import {
  LOCAL_NODE,
  LOCAL_NODE_ID,
  LOCAL_ROUTER,
  LOCAL_VEILVM_APP_ID,
  LOCAL_VEILVM_CHAIN_ID,
} from "@/lib/local-runtime"
import { meshCall } from "@/lib/mesh/proxy"
import { decodeCb58, encodeCb58, looksLikeCb58 } from "./cb58"
import { hexToBytes, bytesToHex } from "./canoto"
import { decodeExecutedBlock, decodeTxHex } from "./decode"
import type { BlockRow, DecodedBlock, DecodedTx, ExplorerStatus, TxRow } from "./types"

export const EXPLORER_CHAIN = LOCAL_VEILVM_CHAIN_ID
export const EXPLORER_APP_ID = LOCAL_VEILVM_APP_ID

export function indexerRpc(method: string, params: unknown, timeoutMs = 6000) {
  return meshCall("indexer", method, params, timeoutMs)
}

export function coreRpc(method: string, params: unknown = {}, timeoutMs = 4000) {
  return meshCall("core", method, params, timeoutMs)
}

export function veilRpc(method: string, params: unknown = {}, timeoutMs = 4000) {
  return meshCall("veil", method, params, timeoutMs)
}

export async function lastAccepted(): Promise<{ height: number; blockId: string; timestamp: number }> {
  const r = (await coreRpc("hypersdk.lastAccepted")) as { height?: number; blockId?: string; timestamp?: number }
  return {
    height: Number(r?.height || 0),
    blockId: String(r?.blockId || ""),
    timestamp: Number(r?.timestamp || 0),
  }
}

type IndexerBlock = {
  block?: {
    block?: {
      parent?: string
      timestamp?: number
      height?: number
      stateRoot?: string
      blockContext?: { pChainHeight?: number }
      txs?: unknown[]
    }
    results?: { unitsConsumed?: { bandwidth?: number; compute?: number } }
  }
  blockBytes?: string
}

export async function fetchDecodedBlock(opts: { height?: number; id?: string }): Promise<DecodedBlock> {
  const params = opts.id
    ? { blockID: opts.id }
    : { blockNumber: Number.isFinite(opts.height) ? opts.height : Number.MAX_SAFE_INTEGER }
  const got = (await indexerRpc("indexer.getBlock", params)) as IndexerBlock
  const inner = got?.block?.block
  const hex = got?.blockBytes
  if (!hex) throw new Error("block has no bytes")
  const decoded = decodeExecutedBlock(hex, inner)
  if (!decoded.chainId) decoded.chainId = EXPLORER_CHAIN
  if (got.block?.results?.unitsConsumed && decoded.txCount === 0) {
    decoded.units.bandwidth = Number(got.block.results.unitsConsumed.bandwidth || decoded.units.bandwidth)
    decoded.units.compute = Number(got.block.results.unitsConsumed.compute || decoded.units.compute)
  }
  return decoded
}

async function mapPool<T, R>(items: T[], size: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = []
  for (let i = 0; i < items.length; i += size) {
    const chunk = items.slice(i, i + size)
    out.push(...(await Promise.all(chunk.map(fn))))
  }
  return out
}

function toTxRow(b: DecodedBlock): TxRow[] {
  return b.txs.map((t) => ({
    idHex: t.idHex,
    id: t.id,
    blockHeight: b.height,
    timestamp: b.timestamp,
    method: t.method,
    from: t.from,
    to: t.to,
    value: t.value,
    success: t.result ? t.result.success : null,
    fee: t.result?.fee || 0,
  }))
}

export async function fetchRecentBlocks(count: number, from?: number): Promise<{
  tip: number
  tipId: string
  tipTimestamp: number
  chainId: string
  blockTimeMs: number | null
  blocks: BlockRow[]
  txs: TxRow[]
}> {
  const tip = await lastAccepted()
  const start = from != null && Number.isFinite(from) ? from : tip.height
  const n = Math.min(48, Math.max(1, count))
  const heights: number[] = []
  for (let h = start; h > start - n && h >= 0; h--) heights.push(h)
  const decoded = (
    await mapPool(heights, 8, async (h) => {
      try {
        return await fetchDecodedBlock({ height: h })
      } catch {
        return null
      }
    })
  ).filter((b): b is DecodedBlock => Boolean(b))

  const MAX_BLOCK_BANDWIDTH = 1_800_000
  const blocks: BlockRow[] = decoded.map((b) => ({
    height: b.height,
    parent: b.parent,
    blockId: b.blockId,
    timestamp: b.timestamp,
    txCount: b.txCount,
    bandwidth: b.units.bandwidth,
    compute: b.units.compute,
    size: b.size,
    actions: b.txs.flatMap((t) => t.actions.map((a) => a.name)),
    proposer: b.txs[0]?.from || LOCAL_NODE_ID,
    gasUsed: b.units.bandwidth,
    gasPct: Math.min(100, Math.round((b.units.bandwidth / MAX_BLOCK_BANDWIDTH) * 100)),
  }))

  const txs: TxRow[] = decoded.flatMap(toTxRow)

  let blockTimeMs: number | null = null
  if (decoded.length >= 2) {
    const deltas: number[] = []
    for (let i = 0; i < decoded.length - 1; i++) {
      const d = decoded[i].timestamp - decoded[i + 1].timestamp
      if (d > 0 && d < 60_000) deltas.push(d)
    }
    if (deltas.length) blockTimeMs = Math.round(deltas.reduce((a, b) => a + b, 0) / deltas.length)
  }

  return {
    tip: tip.height,
    tipId: tip.blockId,
    tipTimestamp: tip.timestamp,
    chainId: EXPLORER_CHAIN,
    blockTimeMs,
    blocks,
    txs,
  }
}

export async function fetchRecentTxs(limit = 25, lookback = 80): Promise<{ tip: number; scanned: number; txs: TxRow[] }> {
  const tip = await lastAccepted()
  const txs: TxRow[] = []
  let scanned = 0
  let h = tip.height
  const floor = Math.max(0, tip.height - lookback)
  while (h >= floor && txs.length < limit) {
    const batch: number[] = []
    for (let i = 0; i < 12 && h >= floor; i++, h--) batch.push(h)
    const decoded = await mapPool(batch, 12, async (height) => {
      try {
        const got = (await indexerRpc("indexer.getBlock", { blockNumber: height }, 4000)) as IndexerBlock
        const hex = got?.blockBytes || ""
        if (hex.length < 360) {
          scanned += 1
          return null
        }
        scanned += 1
        return decodeExecutedBlock(hex, got?.block?.block)
      } catch {
        scanned += 1
        return null
      }
    })
    for (const b of decoded) {
      if (!b || !b.txs.length) continue
      txs.push(...toTxRow(b))
      if (txs.length >= limit) break
    }
  }
  return { tip: tip.height, scanned, txs: txs.slice(0, limit) }
}

function toTxIdParam(q: string): string {
  const s = q.trim()
  if (s.startsWith("0x") && /^0x[0-9a-fA-F]{64}$/.test(s)) return encodeCb58(hexToBytes(s))
  if (/^[0-9a-fA-F]{64}$/.test(s)) return encodeCb58(hexToBytes(s))
  if (looksLikeCb58(s)) return s
  throw new Error("not a tx id")
}

export async function fetchTx(q: string): Promise<DecodedTx> {
  const txId = toTxIdParam(q)
  const got = (await indexerRpc("indexer.getTx", { txId })) as {
    transactionBytes?: string
    timestamp?: number
    result?: { success?: boolean; error?: string | { $binary?: string }; fee?: number; units?: Record<string, number> }
  }
  const hex = got?.transactionBytes
  if (!hex) throw new Error("tx not found")
  const result = got.result
    ? {
        success: Boolean(got.result.success),
        error: typeof got.result.error === "string" ? got.result.error : "",
        fee: Number(got.result.fee || 0),
        units: got.result.units
          ? {
              bandwidth: Number(got.result.units.bandwidth || 0),
              compute: Number(got.result.units.compute || 0),
              storageRead: Number(got.result.units.storageRead || 0),
              storageAllocate: Number(got.result.units.storageAllocate || 0),
              storageWrite: Number(got.result.units.storageWrite || 0),
            }
          : null,
      }
    : null
  const tx = decodeTxHex(hex, result)
  if (got.timestamp) tx.timestamp = Number(got.timestamp)
  return tx
}

export async function fetchStatus(): Promise<ExplorerStatus> {
  const { publicCatalogOrigin } = await import("@/lib/runtime-profile")
  if (publicCatalogOrigin()) {
    const { fetchLocalSnapshot, explorerFromSnapshot } = await import("@/lib/local-snapshot")
    const snap = await fetchLocalSnapshot()
    const fromSnap = explorerFromSnapshot(snap)
    if (fromSnap) return { ...fromSnap, note: "Local VeilVM numbers mirrored to this catalog. Not a public L1." }
    return {
      ok: false,
      local: true,
      height: null,
      blockId: null,
      blockTimestamp: null,
      chainId: "",
      appId: EXPLORER_APP_ID,
      node: "",
      nodeId: "",
      routerOk: false,
      markets: 0,
      proverReady: false,
      pool: null,
      treasury: null,
      vai: null,
      note: "Waiting for local snapshot. Native VeilVM is loopback.",
    }
  }
  const [accepted, pool, treasury, vai, router] = await Promise.all([
    lastAccepted().catch(() => null),
    veilRpc("veilvm.pool", { asset0: 0, asset1: 1 }).catch(() => null),
    veilRpc("veilvm.treasury").catch(() => null),
    veilRpc("veilvm.vaistate").catch(() => null),
    fetch(`${LOCAL_ROUTER}/health`, { cache: "no-store", signal: AbortSignal.timeout(2500) })
      .then((r) => r.json())
      .catch(() => null),
  ])
  const health = router as { ok?: boolean; markets?: number; proverReady?: boolean; chainId?: string } | null
  const poolR = pool as ExplorerStatus["pool"]
  const treas = treasury as { locked?: number; live?: number; released?: number } | null
  const vaiR = vai as { total_debt?: number; debt_ceiling?: number } | null
  return {
    ok: Boolean(accepted && accepted.height > 0),
    local: true,
    height: accepted?.height ?? null,
    blockId: accepted?.blockId ?? null,
    blockTimestamp: accepted?.timestamp ?? null,
    chainId: EXPLORER_CHAIN,
    appId: EXPLORER_APP_ID,
    node: LOCAL_NODE,
    nodeId: LOCAL_NODE_ID,
    routerOk: Boolean(health?.ok),
    markets: health?.markets ?? 0,
    proverReady: Boolean(health?.proverReady),
    pool: poolR,
    treasury: treas ? { locked: Number(treas.locked || 0), live: Number(treas.live || 0), released: Number(treas.released || 0) } : null,
    vai: vaiR ? { total_debt: Number(vaiR.total_debt || 0), debt_ceiling: Number(vaiR.debt_ceiling || 0) } : null,
    note: "Local VeilVM explorer via Mesh. Not Fuji. Not mainnet. Not Blockscout.",
  }
}

export async function fetchAddress(addr: string): Promise<{
  address: string
  veil: number
  vai: number
}> {
  const a = addr.startsWith("0x") ? addr : `0x${addr}`
  const [veil, vai] = await Promise.all([
    veilRpc("veilvm.balance", { address: a }).catch(() => ({ amount: 0 })),
    veilRpc("veilvm.vaibalance", { address: a }).catch(() => ({ amount: 0 })),
  ])
  return {
    address: a,
    veil: Number((veil as { amount?: number })?.amount || 0),
    vai: Number((vai as { amount?: number })?.amount || 0),
  }
}

export type SearchHit =
  | { kind: "block"; href: string; label: string }
  | { kind: "tx"; href: string; label: string }
  | { kind: "address"; href: string; label: string }

export async function searchExplorer(q: string): Promise<SearchHit[]> {
  const s = q.trim()
  if (!s) return []
  if (/^\d+$/.test(s)) {
    try {
      const b = await fetchDecodedBlock({ height: Number(s) })
      return [{ kind: "block", href: `/explorer/block/${b.height}`, label: `Block ${b.height.toLocaleString()}` }]
    } catch {
      return []
    }
  }
  if (/^0x[0-9a-fA-F]{66}$/.test(s)) {
    return [{ kind: "address", href: `/explorer/address/${encodeURIComponent(s)}`, label: s }]
  }
  const hits: SearchHit[] = []
  try {
    const tx = await fetchTx(s)
    hits.push({ kind: "tx", href: `/explorer/tx/${tx.idHex}`, label: `Tx ${tx.idHex.slice(0, 10)}…` })
  } catch {
    /* not a tx */
  }
  try {
    const id = looksLikeCb58(s) ? s : /^0x[0-9a-fA-F]{64}$/.test(s) ? encodeCb58(hexToBytes(s)) : s
    const b = await fetchDecodedBlock({ id })
    hits.push({ kind: "block", href: `/explorer/block/${b.height}`, label: `Block ${b.height.toLocaleString()}` })
  } catch {
    /* not a block */
  }
  return hits
}

export function hex32ToCb58(hex: string): string {
  return encodeCb58(hexToBytes(hex))
}

export function cb58ToHex(id: string): string {
  return bytesToHex(decodeCb58(id))
}
