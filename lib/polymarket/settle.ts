import "server-only"
import { promises as fs } from "fs"
import path from "path"
import {
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
  keccak256,
  recoverMessageAddress,
  toBytes,
  type Hex,
} from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { LOCAL_COMPANION_RPC } from "@/lib/local-runtime"
import { polygonRouteMessage } from "./message"
import { POLYMARKET_VENUE_ABI } from "./venue-abi"
import { POLYMARKET_VENUE_BYTECODE } from "./venue-bytecode"

export { polygonRouteMessage }

const ISSUER_PK = (process.env.ZEROID_ISSUER_PK ||
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80") as Hex
const FILE = path.resolve(process.cwd(), ".local", "polymarket-venue.json")
const CLOB = (process.env.POLYMARKET_CLOB_API || "https://clob.polymarket.com").replace(/\/+$/, "")
const MIN_FEE_BPS = 3

export const LOCAL_POLYMARKET_VENUE =
  process.env.POLYMARKET_VENUE || "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6"

type FillRow = {
  orderId: string
  conditionId: string
  tokenId: string
  trader: string
  yes: boolean
  side: string
  usdcIn: number
  sharesOut: number
  feeBps: number
  price: number
  txHash: string
  clobOrderId: string
  venue: "polygon-local" | "polygon"
  marketId: string
  createdAt: string
}

type Store = { venue: string; deployTx: string; fills: FillRow[] }

type BookLevel = { price: string; size: string }
type Book = { bids?: BookLevel[]; asks?: BookLevel[] }

const companion = defineChain({
  id: 31337,
  name: "veil-companion",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: [LOCAL_COMPANION_RPC] } },
})

const issuerAccount = privateKeyToAccount(ISSUER_PK)
const pub = createPublicClient({ chain: companion, transport: http(LOCAL_COMPANION_RPC) })
const wallet = createWalletClient({
  account: issuerAccount,
  chain: companion,
  transport: http(LOCAL_COMPANION_RPC),
})

let liveVenue: Hex | null = null
let ensureLock: Promise<Hex> | null = null
let gate: Promise<unknown> = Promise.resolve()

function serialize<T>(fn: () => Promise<T>): Promise<T> {
  const run = gate.then(fn, fn)
  gate = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}

function chainError(err: unknown): Error {
  if (err && typeof err === "object" && "shortMessage" in err) {
    return new Error(String((err as { shortMessage: string }).shortMessage))
  }
  if (err instanceof Error) return err
  return new Error(String(err))
}

async function readStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(FILE, "utf8")
    const j = JSON.parse(raw) as Partial<Store>
    return {
      venue: typeof j.venue === "string" ? j.venue : "",
      deployTx: typeof j.deployTx === "string" ? j.deployTx : "",
      fills: Array.isArray(j.fills) ? j.fills : [],
    }
  } catch {
    return { venue: "", deployTx: "", fills: [] }
  }
}

async function writeStore(store: Store) {
  await fs.mkdir(path.dirname(FILE), { recursive: true })
  await fs.writeFile(FILE, JSON.stringify(store, null, 2) + "\n", "utf8")
}

async function venueLive(address: Hex): Promise<boolean> {
  try {
    const code = await pub.getCode({ address })
    if (!code || code === "0x") return false
    await pub.readContract({ address, abi: POLYMARKET_VENUE_ABI, functionName: "count" })
    return true
  } catch {
    return false
  }
}

async function deployOrReuse(): Promise<Hex> {
  if (liveVenue && (await venueLive(liveVenue))) return liveVenue
  const store = await readStore()
  const env = (process.env.POLYMARKET_VENUE || "").trim()
  const candidates = [env, store.venue].filter((a) => /^0x[0-9a-fA-F]{40}$/.test(a) && a !== "0x0000000000000000000000000000000000000000")
  for (const c of candidates) {
    const addr = c.toLowerCase() as Hex
    if (await venueLive(addr)) {
      liveVenue = addr
      if (store.venue.toLowerCase() !== addr) {
        store.venue = addr
        await writeStore(store)
      }
      return addr
    }
  }
  const hash = await wallet.deployContract({
    abi: POLYMARKET_VENUE_ABI,
    bytecode: POLYMARKET_VENUE_BYTECODE,
    account: issuerAccount,
  })
  const receipt = await pub.waitForTransactionReceipt({ hash, timeout: 20_000 })
  if (receipt.status !== "success" || !receipt.contractAddress) {
    throw new Error("polymarket venue deploy reverted")
  }
  liveVenue = receipt.contractAddress
  await writeStore({ venue: liveVenue, deployTx: hash, fills: [] })
  return liveVenue
}

export async function ensurePolymarketVenue(): Promise<Hex> {
  if (liveVenue && (await venueLive(liveVenue))) return liveVenue
  if (!ensureLock) {
    ensureLock = deployOrReuse().finally(() => {
      ensureLock = null
    })
  }
  return ensureLock
}

function tokenToBytes32(tokenId: string): Hex {
  const n = BigInt(tokenId)
  return `0x${n.toString(16).padStart(64, "0")}` as Hex
}

function conditionToBytes32(conditionId: string): Hex {
  const h = conditionId.startsWith("0x") ? conditionId.slice(2) : conditionId
  if (!/^[0-9a-fA-F]+$/.test(h)) {
    return keccak256(toBytes(conditionId))
  }
  return `0x${h.padStart(64, "0").slice(-64)}` as Hex
}

function walkBook(book: Book, side: "buy" | "sell", usd: number) {
  const levels = side === "buy" ? [...(book.asks || [])] : [...(book.bids || [])]
  levels.sort((a, b) =>
    side === "buy" ? Number(a.price) - Number(b.price) : Number(b.price) - Number(a.price),
  )
  let remaining = usd
  let shares = 0
  let notional = 0
  for (const lvl of levels) {
    const price = Number(lvl.price)
    const avail = Number(lvl.size)
    if (!(price > 0) || !(avail > 0)) continue
    const take = Math.min(avail, remaining / price)
    if (take <= 0) continue
    shares += take
    notional += take * price
    remaining -= take * price
    if (remaining < 1e-8) break
  }
  if (shares <= 0 || notional <= 0) {
    throw new Error("CLOB book has no size at this price")
  }
  return { shares, notional, avgPrice: notional / shares, unfilledUsd: remaining }
}

async function findGamma(marketId: string) {
  const { getPolymarketSettlementMeta } = await import("@/lib/veil-market-service")
  return getPolymarketSettlementMeta(marketId)
}

async function fetchBook(tokenId: string): Promise<Book> {
  const url = new URL("/book", CLOB)
  url.searchParams.set("token_id", tokenId)
  const res = await fetch(url.toString(), { cache: "no-store", signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`clob book ${res.status}`)
  return (await res.json()) as Book
}

async function postLiveClob(body: Record<string, unknown>): Promise<{ id?: string; orderID?: string; status?: string; error?: string } | null> {
  if (process.env.POLYMARKET_CLOB_LIVE !== "1") return null
  const key = (process.env.POLYMARKET_API_KEY || "").trim()
  const secret = (process.env.POLYMARKET_API_SECRET || "").trim()
  const pass = (process.env.POLYMARKET_API_PASSPHRASE || "").trim()
  if (!key || !secret || !pass) {
    throw new Error("POLYMARKET_CLOB_LIVE=1 but API key/secret/passphrase are not set")
  }
  const res = await fetch(`${CLOB}/order`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      POLY_API_KEY: key,
      POLY_PASSPHRASE: pass,
      POLY_SIGNATURE: secret,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(12_000),
  })
  const json = (await res.json().catch(() => ({}))) as {
    error?: string
    orderID?: string
    id?: string
    status?: string
  }
  if (!res.ok) throw new Error(json.error || `clob order ${res.status}`)
  return json
}

export async function settlePolygonRoute(input: {
  marketId: string
  side: "buy" | "sell"
  outcome: "yes" | "no"
  amountUsd: number
  walletAddress: string
  walletSignature: string
  walletNonce: string
  routingFeeBps: number
}): Promise<{
  accepted: boolean
  status: string
  message: string
  orderId: string
  veilTxHash: string
  oracleTxHash: string
  errorCode: string
  fillPrice: number
  timestamp: number
  requiredVeil: number
  balanceVeil: number
  nativeNetwork: string
  settlementNetwork: string
  routingFeeBps: number
  liquiditySufficient: boolean | null
}> {
  return serialize(async () => {
    const feeBps = Math.max(MIN_FEE_BPS, Math.floor(input.routingFeeBps || 0) || MIN_FEE_BPS)
    const walletAddr = input.walletAddress.toLowerCase()
    if (!/^0x[0-9a-f]{40}$/.test(walletAddr)) throw new Error("malformed wallet")
    if (!input.walletSignature || !input.walletNonce) throw new Error("walletSignature and walletNonce required")
    const message = polygonRouteMessage({
      marketId: input.marketId,
      side: input.side,
      outcome: input.outcome,
      amountUsd: input.amountUsd,
      wallet: walletAddr,
      nonce: input.walletNonce,
      feeBps,
    })
    const recovered = await recoverMessageAddress({
      message,
      signature: input.walletSignature as Hex,
    })
    if (recovered.toLowerCase() !== walletAddr) throw new Error("signature is not from claimed wallet")

    const gamma = await findGamma(input.marketId)
    if (!gamma) throw new Error("unknown Polymarket market")
    if (gamma.closed) throw new Error("market not accepting orders")
    if (gamma.tokens.length < 2) throw new Error("market has no CLOB token ids")
    const yes = input.outcome === "yes"
    const tokenId = yes ? gamma.tokens[0] : gamma.tokens[1]
    const book = await fetchBook(tokenId)
    const walk = walkBook(book, input.side, input.amountUsd)
    const feeUsd = (walk.notional * feeBps) / 10_000
    const conditionId = gamma.conditionId || gamma.id || ""
    const orderIdHex = keccak256(
      toBytes(`${walletAddr}:${input.walletNonce}:${tokenId}:${walk.notional}`),
    ) as Hex

    let clobOrderId = ""
    let venueKind: "polygon-local" | "polygon" = "polygon-local"
    if (process.env.POLYMARKET_CLOB_LIVE === "1") {
      const posted = await postLiveClob({
        tokenID: tokenId,
        side: input.side.toUpperCase(),
        size: String(walk.shares),
        price: String(walk.avgPrice),
        feeRateBps: feeBps,
        nonce: input.walletNonce,
        maker: walletAddr,
      })
      clobOrderId = String(posted?.orderID || posted?.id || "")
      venueKind = "polygon"
    }

    const venue = await ensurePolymarketVenue()
    const usdcIn = BigInt(Math.round(walk.notional * 1_000_000))
    const sharesOut = BigInt(Math.round(walk.shares * 1_000_000))
    const priceE6 = BigInt(Math.round(walk.avgPrice * 1_000_000))
    let txHash: Hex
    try {
      txHash = await wallet.writeContract({
        address: venue,
        abi: POLYMARKET_VENUE_ABI,
        functionName: "fill",
        args: [
          orderIdHex,
          conditionToBytes32(conditionId),
          tokenToBytes32(tokenId),
          walletAddr as Hex,
          yes,
          usdcIn,
          sharesOut,
          feeBps,
          priceE6,
        ],
        account: issuerAccount,
      })
    } catch (err) {
      throw new Error(`venue fill failed: ${chainError(err).message}`)
    }
    const receipt = await pub.waitForTransactionReceipt({ hash: txHash, timeout: 20_000 })
    if (receipt.status !== "success") throw new Error("venue fill reverted")

    const store = await readStore()
    store.venue = venue
    store.fills.push({
      orderId: orderIdHex,
      conditionId,
      tokenId,
      trader: walletAddr,
      yes,
      side: input.side,
      usdcIn: walk.notional,
      sharesOut: walk.shares,
      feeBps,
      price: walk.avgPrice,
      txHash,
      clobOrderId,
      venue: venueKind,
      marketId: input.marketId,
      createdAt: new Date().toISOString(),
    })
    await writeStore(store)

    const live = venueKind === "polygon"
    return {
      accepted: true,
      status: live ? "posted_clob" : "filled_local_venue",
      message: live
        ? `Posted to Polymarket CLOB. Routing ${feeBps} bps. Companion receipt ${txHash}.`
        : `Filled against live CLOB book at ${(walk.avgPrice * 100).toFixed(1)}¢. Settled on companion PolymarketVenue (not Polygon 137). Routing ${feeBps} bps ($${feeUsd.toFixed(4)}).`,
      orderId: orderIdHex,
      veilTxHash: "",
      oracleTxHash: txHash,
      errorCode: "",
      fillPrice: walk.avgPrice,
      timestamp: Date.now(),
      requiredVeil: 0,
      balanceVeil: 0,
      nativeNetwork: "polygon",
      settlementNetwork: live ? "polygon" : "polygon-local",
      routingFeeBps: feeBps,
      liquiditySufficient: walk.unfilledUsd < 1e-6,
    }
  })
}

export async function polymarketVenueStats(opts?: { deploy?: boolean }) {
  const store = await readStore()
  let venue: string | null = liveVenue || store.venue || null
  let deployed = false
  let chainCount: number | null = null
  try {
    if (opts?.deploy === false) {
      const addr = venue && /^0x[0-9a-fA-F]{40}$/.test(venue) ? (venue.toLowerCase() as Hex) : null
      deployed = addr ? await venueLive(addr) : false
      if (addr && deployed) {
        chainCount = Number(await pub.readContract({ address: addr, abi: POLYMARKET_VENUE_ABI, functionName: "count" }))
      }
    } else {
      venue = await ensurePolymarketVenue()
      deployed = true
      chainCount = Number(
        await pub.readContract({ address: venue as Hex, abi: POLYMARKET_VENUE_ABI, functionName: "count" }),
      )
    }
  } catch {
    deployed = false
  }
  return {
    venue,
    deployed,
    chainCount,
    fills: store.fills.length,
    live: process.env.POLYMARKET_CLOB_LIVE === "1",
  }
}

export async function latestPolygonFill(marketId?: string) {
  const store = await readStore()
  const rows = marketId ? store.fills.filter((f) => f.marketId === marketId) : store.fills
  return rows.at(-1) || null
}
