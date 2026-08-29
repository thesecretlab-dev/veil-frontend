import "server-only"
import { createHmac } from "crypto"
import { promises as fs } from "fs"
import path from "path"
import {
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
  recoverMessageAddress,
  zeroAddress,
  zeroHash,
  type Hex,
} from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { LOCAL_COMPANION_RPC, LOCAL_ZEROID_REGISTRY } from "@/lib/local-runtime"
import { ZEROID_REGISTRY_ABI } from "./registry-abi"
import { ZEROID_REGISTRY_BYTECODE } from "./registry-bytecode"
import { TAG_BIND, TAG_CRED, TAG_ISSUE, hexToBytes, isHex32, taggedSha256Hex, timingSafeEqualHex } from "./tagged"
import { ZEROID_APP_ID, ZEROID_TYPE, type IssuedPassport } from "./types"

const HMAC_KEY = (process.env.ZEROID_ISSUER_HMAC || process.env.MESH_API_KEY || "mesh_local_dev").trim()
const ISSUER_PK = (process.env.ZEROID_ISSUER_PK ||
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80") as Hex
const FILE = path.resolve(process.cwd(), ".local", "zeroid-registry.json")
const NOTE =
  "Issuer HMAC + companion nullifier registry. Secret never left the device. Groth16 wasm/zkey not served."

type Row = {
  nullifier: string
  commitment: string
  credentialHash: string
  issuerSig: string
  issuedAt: string
  wallet: string
  bindSig: string
  bindTx: string
  onChain: boolean
  issueTx: string
}

type Store = {
  registry: string
  deployTx: string
  rows: Row[]
}

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

let liveRegistry: Hex | null = null
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

function asHex(value: string): Hex {
  return value.toLowerCase() as Hex
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
      registry: typeof j.registry === "string" ? j.registry : "",
      deployTx: typeof j.deployTx === "string" ? j.deployTx : "",
      rows: Array.isArray(j.rows) ? j.rows : [],
    }
  } catch {
    return { registry: "", deployTx: "", rows: [] }
  }
}

async function writeStore(store: Store) {
  await fs.mkdir(path.dirname(FILE), { recursive: true })
  const tmp = `${FILE}.${process.pid}.tmp`
  await fs.writeFile(tmp, JSON.stringify(store, null, 2) + "\n", "utf8")
  try {
    await fs.unlink(FILE)
  } catch {
    /* first write */
  }
  await fs.rename(tmp, FILE)
}

function hmacIssue(p: { commitment: string; nullifier: string; credentialHash: string; issuedAt: string }): string {
  const h = createHmac("sha256", HMAC_KEY)
  h.update(TAG_ISSUE)
  h.update(ZEROID_TYPE)
  h.update(String(ZEROID_APP_ID))
  h.update(Buffer.from(hexToBytes(p.commitment)))
  h.update(Buffer.from(hexToBytes(p.nullifier)))
  h.update(Buffer.from(hexToBytes(p.credentialHash)))
  h.update(p.issuedAt)
  return `0x${h.digest("hex")}`
}

export function issueSig(p: { commitment: string; nullifier: string; credentialHash: string; issuedAt: string }): string {
  return hmacIssue(p)
}

export function bindMessage(nullifier: string, credentialHash: string): string {
  return [
    TAG_BIND,
    `nullifier:${nullifier.toLowerCase()}`,
    `credential:${credentialHash.toLowerCase()}`,
    `app:${ZEROID_APP_ID}`,
    `type:${ZEROID_TYPE}`,
  ].join("\n")
}

export async function expectedCredentialHash(commitment: string, nullifier: string): Promise<string> {
  return taggedSha256Hex(TAG_CRED, [hexToBytes(commitment), hexToBytes(nullifier), new TextEncoder().encode(ZEROID_TYPE)])
}

async function registryHasNewAbi(address: Hex): Promise<boolean> {
  try {
    const code = await pub.getCode({ address })
    if (!code || code === "0x") return false
    await pub.readContract({
      address,
      abi: ZEROID_REGISTRY_ABI,
      functionName: "issuerSigOf",
      args: [zeroHash],
    })
    return true
  } catch {
    return false
  }
}

async function deployOrReuseRegistry(): Promise<Hex> {
  if (liveRegistry && (await registryHasNewAbi(liveRegistry))) return liveRegistry
  const store = await readStore()
  const candidates = [LOCAL_ZEROID_REGISTRY, store.registry].filter((a) => /^0x[0-9a-fA-F]{40}$/.test(a))
  for (const c of candidates) {
    const addr = asHex(c)
    if (await registryHasNewAbi(addr)) {
      liveRegistry = addr
      if (store.registry.toLowerCase() !== addr) {
        store.registry = addr
        await writeStore(store)
      }
      return addr
    }
  }
  let hash: Hex
  try {
    hash = await wallet.deployContract({
      abi: ZEROID_REGISTRY_ABI,
      bytecode: ZEROID_REGISTRY_BYTECODE,
      account: issuerAccount,
    })
  } catch (err) {
    throw new Error(`companion registry deploy failed: ${chainError(err).message}`)
  }
  const receipt = await pub.waitForTransactionReceipt({ hash, timeout: 20_000 })
  if (receipt.status !== "success" || !receipt.contractAddress) {
    throw new Error("companion registry deploy reverted")
  }
  liveRegistry = receipt.contractAddress
  await writeStore({
    registry: liveRegistry,
    deployTx: hash,
    rows: [],
  })
  return liveRegistry
}

export async function ensureRegistry(): Promise<Hex> {
  if (liveRegistry && (await registryHasNewAbi(liveRegistry))) return liveRegistry
  if (!ensureLock) {
    ensureLock = deployOrReuseRegistry().finally(() => {
      ensureLock = null
    })
  }
  return ensureLock
}

async function waitOk(hash: Hex, label: string) {
  const receipt = await pub.waitForTransactionReceipt({ hash, timeout: 20_000 })
  if (receipt.status !== "success") throw new Error(`${label} reverted (${hash})`)
  return receipt
}

async function chainRecord(nullifier: string) {
  const registry = await ensureRegistry()
  const n = asHex(nullifier)
  const [used, commitment, credential, issuerSig, walletAddr] = await Promise.all([
    pub.readContract({ address: registry, abi: ZEROID_REGISTRY_ABI, functionName: "usedNullifiers", args: [n] }),
    pub.readContract({ address: registry, abi: ZEROID_REGISTRY_ABI, functionName: "commitmentOf", args: [n] }),
    pub.readContract({ address: registry, abi: ZEROID_REGISTRY_ABI, functionName: "credentialOf", args: [n] }),
    pub.readContract({ address: registry, abi: ZEROID_REGISTRY_ABI, functionName: "issuerSigOf", args: [n] }),
    pub.readContract({ address: registry, abi: ZEROID_REGISTRY_ABI, functionName: "walletOf", args: [n] }),
  ])
  return {
    registry,
    used: Boolean(used),
    commitment: String(commitment).toLowerCase(),
    credential: String(credential).toLowerCase(),
    issuerSig: String(issuerSig).toLowerCase(),
    wallet: String(walletAddr).toLowerCase(),
  }
}

export async function issuePassport(input: {
  commitment: string
  nullifier: string
  credentialHash: string
}): Promise<{ passport: IssuedPassport; onChain: boolean; txHash: string; registry: string }> {
  return serialize(async () => {
    const commitment = input.commitment.toLowerCase()
    const nullifier = input.nullifier.toLowerCase()
    const credentialHash = input.credentialHash.toLowerCase()
    if (!isHex32(commitment) || !isHex32(nullifier) || !isHex32(credentialHash)) {
      throw new Error("commitment, nullifier, and credentialHash must be 32-byte hex")
    }
    const expected = await expectedCredentialHash(commitment, nullifier)
    if (!timingSafeEqualHex(expected, credentialHash)) {
      throw new Error("credential hash does not bind commitment+nullifier+8004")
    }
    const registry = await ensureRegistry()
    const existing = await chainRecord(nullifier)
    if (existing.used) throw new Error("nullifier already on companion registry")
    const store = await readStore()
    if (store.rows.some((r) => r.nullifier === nullifier)) {
      throw new Error("nullifier already issued")
    }
    const issuedAt = new Date().toISOString()
    const issuerSig = hmacIssue({ commitment, nullifier, credentialHash, issuedAt })
    let txHash: Hex
    try {
      txHash = await wallet.writeContract({
        address: registry,
        abi: ZEROID_REGISTRY_ABI,
        functionName: "issue",
        args: [asHex(nullifier), asHex(commitment), asHex(credentialHash), asHex(issuerSig)],
        account: issuerAccount,
      })
    } catch (err) {
      throw new Error(`companion issue failed: ${chainError(err).message}`)
    }
    await waitOk(txHash, "issue")
    const confirmed = await chainRecord(nullifier)
    if (
      !confirmed.used ||
      !timingSafeEqualHex(confirmed.commitment, commitment) ||
      !timingSafeEqualHex(confirmed.credential, credentialHash) ||
      !timingSafeEqualHex(confirmed.issuerSig, issuerSig)
    ) {
      throw new Error("issue mined but registry record does not match")
    }
    const row: Row = {
      nullifier,
      commitment,
      credentialHash,
      issuerSig,
      issuedAt,
      wallet: "",
      bindSig: "",
      bindTx: "",
      onChain: true,
      issueTx: txHash,
    }
    store.registry = registry
    store.rows.push(row)
    await writeStore(store)
    const passport: IssuedPassport = {
      version: "1",
      passport_id: ZEROID_TYPE,
      type: ZEROID_TYPE,
      appId: String(ZEROID_APP_ID),
      commitment,
      nullifier,
      credentialHash,
      wallet: "",
      issuedAt,
      verified_at: issuedAt,
      verification_proof: credentialHash,
      issuerSig,
      bindSig: "",
      bindTx: "",
      onChain: true,
      issueTx: txHash,
      registry,
      binding: "tagged-sha256",
      inCircuit: "false",
      note: NOTE,
    }
    return { passport, onChain: true, txHash, registry }
  })
}

export async function verifyPassport(p: Partial<IssuedPassport>): Promise<{
  ok: boolean
  reasons: string[]
  onChain: boolean | null
  registry: string | null
}> {
  const reasons: string[] = []
  const commitment = (p.commitment || "").toLowerCase()
  const nullifier = (p.nullifier || "").toLowerCase()
  const credentialHash = (p.credentialHash || "").toLowerCase()
  const issuedAt = p.issuedAt || p.verified_at || ""
  const issuerSig = (p.issuerSig || "").toLowerCase()
  if (!isHex32(commitment) || !isHex32(nullifier) || !isHex32(credentialHash)) reasons.push("malformed fields")
  else {
    const expected = await expectedCredentialHash(commitment, nullifier)
    if (!timingSafeEqualHex(expected, credentialHash)) reasons.push("credential hash mismatch")
    if (!issuedAt) reasons.push("missing issuedAt")
    else {
      const want = hmacIssue({ commitment, nullifier, credentialHash, issuedAt })
      if (!issuerSig || !timingSafeEqualHex(want, issuerSig)) reasons.push("issuer signature invalid")
    }
  }
  let onChain: boolean | null = null
  let registry: string | null = null
  if (isHex32(nullifier)) {
    try {
      const rec = await chainRecord(nullifier)
      registry = rec.registry
      onChain = rec.used
      if (!rec.used) reasons.push("nullifier not on companion registry")
      else {
        if (isHex32(commitment) && !timingSafeEqualHex(rec.commitment, commitment)) reasons.push("on-chain commitment mismatch")
        if (isHex32(credentialHash) && !timingSafeEqualHex(rec.credential, credentialHash)) {
          reasons.push("on-chain credential mismatch")
        }
        if (isHex32(issuerSig) && rec.issuerSig !== zeroHash && !timingSafeEqualHex(rec.issuerSig, issuerSig)) {
          reasons.push("on-chain issuer sig mismatch")
        }
      }
    } catch (err) {
      onChain = null
      reasons.push(`companion unreachable: ${chainError(err).message}`)
    }
  }
  return { ok: reasons.length === 0, reasons, onChain, registry }
}

export async function bindPassport(input: {
  nullifier: string
  credentialHash: string
  wallet: string
  signature: string
}): Promise<{ wallet: string; txHash: string | null; registry: string }> {
  return serialize(async () => {
    const nullifier = input.nullifier.toLowerCase()
    const credentialHash = input.credentialHash.toLowerCase()
    const claimed = input.wallet.toLowerCase()
    if (!isHex32(nullifier) || !isHex32(credentialHash)) throw new Error("malformed bind fields")
    if (!/^0x[0-9a-f]{40}$/.test(claimed)) throw new Error("malformed wallet")
    const rec = await chainRecord(nullifier)
    if (!rec.used) throw new Error("unknown nullifier")
    if (!timingSafeEqualHex(rec.credential, credentialHash)) throw new Error("credential mismatch")
    const recovered = await recoverMessageAddress({
      message: bindMessage(nullifier, credentialHash),
      signature: input.signature as Hex,
    })
    if (recovered.toLowerCase() !== claimed) throw new Error("signature is not from claimed wallet")
    if (rec.wallet && rec.wallet !== zeroAddress) {
      if (rec.wallet !== claimed) throw new Error("nullifier already bound")
      const store = await readStore()
      const row = store.rows.find((r) => r.nullifier === nullifier)
      if (row) {
        row.wallet = claimed
        row.bindSig = input.signature
        await writeStore(store)
      }
      return { wallet: claimed, txHash: null, registry: rec.registry }
    }
    let txHash: Hex
    try {
      txHash = await wallet.writeContract({
        address: rec.registry as Hex,
        abi: ZEROID_REGISTRY_ABI,
        functionName: "bind",
        args: [asHex(nullifier), claimed as Hex],
        account: issuerAccount,
      })
    } catch (err) {
      throw new Error(`companion bind failed: ${chainError(err).message}`)
    }
    await waitOk(txHash, "bind")
    const store = await readStore()
    const row = store.rows.find((r) => r.nullifier === nullifier)
    if (row) {
      row.wallet = claimed
      row.bindSig = input.signature
      row.bindTx = txHash
      await writeStore(store)
    }
    return { wallet: claimed, txHash, registry: rec.registry }
  })
}

export async function lookupNullifier(nullifier: string) {
  const n = nullifier.toLowerCase()
  if (!isHex32(n)) throw new Error("malformed nullifier")
  const store = await readStore()
  const row = store.rows.find((r) => r.nullifier === n) || null
  let chain = null
  try {
    chain = await chainRecord(n)
  } catch (err) {
    chain = { error: chainError(err).message }
  }
  return { nullifier: n, file: row, chain }
}

export async function registryStats(opts?: { deploy?: boolean }) {
  const store = await readStore()
  let registry: string | null = liveRegistry || store.registry || LOCAL_ZEROID_REGISTRY || null
  let chainCount: number | null = null
  let issuer: string | null = null
  let deployed = false
  try {
    if (opts?.deploy === false) {
      const addr = registry && /^0x[0-9a-fA-F]{40}$/.test(registry) ? asHex(registry) : null
      deployed = addr ? await registryHasNewAbi(addr) : false
      if (addr && deployed) registry = addr
    } else {
      registry = await ensureRegistry()
      deployed = true
    }
    if (registry && deployed) {
      chainCount = Number(
        await pub.readContract({
          address: asHex(registry),
          abi: ZEROID_REGISTRY_ABI,
          functionName: "count",
        }),
      )
      issuer = String(
        await pub.readContract({
          address: asHex(registry),
          abi: ZEROID_REGISTRY_ABI,
          functionName: "issuer",
        }),
      )
    }
  } catch {
    deployed = false
  }
  return {
    fileCount: store.rows.length,
    chainCount,
    registry,
    deployed,
    issuer,
    hmac: HMAC_KEY === "mesh_local_dev" ? "local-dev" : "env",
  }
}
