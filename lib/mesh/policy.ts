import type { MeshLane } from "./config"
import { runtimeProfile } from "@/lib/runtime-profile"

const DENY_PREFIX = /^(admin|debug|personal|anvil|hardhat|miner|txpool|engine)_/i
const DENY_EXACT = new Set([
  "eth_sendTransaction",
  "eth_sign",
  "eth_signTransaction",
  "eth_signTypedData",
  "eth_signTypedData_v4",
  "evm_setAccountBalance",
  "evm_increaseTime",
  "evm_mine",
])

export const MESH_ALLOW: Record<MeshLane, readonly string[]> = {
  core: ["hypersdk.ping", "hypersdk.lastAccepted", "hypersdk.network"],
  veil: ["veilvm.pool", "veilvm.treasury", "veilvm.vaistate", "veilvm.balance", "veilvm.vaibalance"],
  indexer: ["indexer.getBlock", "indexer.getTx"],
  evm: [
    "eth_chainId",
    "eth_blockNumber",
    "eth_getCode",
    "eth_call",
    "eth_getBalance",
    "eth_getTransactionReceipt",
    "eth_getTransactionByHash",
    "eth_getTransactionCount",
    "eth_sendRawTransaction",
    "eth_estimateGas",
    "eth_gasPrice",
    "eth_maxPriorityFeePerGas",
    "eth_feeHistory",
    "eth_getBlockByNumber",
    "eth_getBlockByHash",
    "eth_getLogs",
    "eth_accounts",
    "eth_syncing",
    "net_version",
    "web3_clientVersion",
    "wallet_switchEthereumChain",
    "wallet_addEthereumChain",
  ],
}

const buckets = new Map<string, { n: number; reset: number }>()

export function meshStrict(): boolean {
  return process.env.MESH_STRICT === "1" || process.env.NODE_ENV === "production" || runtimeProfile() !== "local"
}

export function meshMaxBatch(): number {
  const n = Number(process.env.MESH_MAX_BATCH || 20)
  return Number.isFinite(n) && n > 0 ? Math.min(n, 50) : 20
}

export function meshRateLimit(ip: string, limit = Number(process.env.MESH_RPM || 240)): boolean {
  const now = Date.now()
  const windowMs = 60_000
  const cur = buckets.get(ip)
  if (!cur || now >= cur.reset) {
    buckets.set(ip, { n: 1, reset: now + windowMs })
    return true
  }
  if (cur.n >= limit) return false
  cur.n += 1
  return true
}

export function meshClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local"
  )
}

export function methodAllowed(lane: MeshLane, method: string): boolean {
  const m = method.trim()
  if (!m || DENY_EXACT.has(m) || DENY_PREFIX.test(m)) return false
  if (MESH_ALLOW[lane].includes(m)) return true
  return !meshStrict()
}

export function inspectMeshPayload(
  lane: MeshLane,
  payload: unknown,
): { ok: true } | { ok: false; error: string; code: number } {
  const items = Array.isArray(payload) ? payload : [payload]
  if (items.length === 0) return { ok: false, error: "empty payload", code: -32600 }
  if (items.length > meshMaxBatch()) return { ok: false, error: `batch exceeds ${meshMaxBatch()}`, code: -32600 }
  for (const item of items) {
    if (!item || typeof item !== "object" || Array.isArray(item) || !("method" in item)) {
      return { ok: false, error: "invalid JSON-RPC object", code: -32600 }
    }
    const method = String((item as { method?: unknown }).method || "")
    if (!methodAllowed(lane, method)) {
      return { ok: false, error: `method not allowed on ${lane}: ${method || "(empty)"}`, code: -32601 }
    }
  }
  return { ok: true }
}

export function meshCorsOrigin(): string {
  return (process.env.MESH_CORS_ORIGIN || "*").trim() || "*"
}
