import { LOCAL_ZEROID_REGISTRY } from "@/lib/local-runtime"
import { profilePublic, publicCatalogOrigin } from "@/lib/runtime-profile"
import { MESH_KEY, MESH_REQUIRE_KEY, meshOrigins, type MeshLane } from "./config"
import { inspectMeshPayload, meshClientIp, meshCorsOrigin, meshRateLimit } from "./policy"

type RpcError = { message?: string; code?: number }

const stats = {
  requests: 0,
  byLane: { veil: 0, core: 0, indexer: 0, evm: 0, health: 0 } as Record<string, number>,
  lastMethod: "",
  lastLane: "",
  lastAt: 0,
}

export function meshStats() {
  return { ...stats, byLane: { ...stats.byLane } }
}

export function meshKeyFrom(req: Request): string {
  const header = req.headers.get("x-mesh-key") || req.headers.get("authorization") || ""
  const bearer = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : ""
  const url = new URL(req.url)
  return (req.headers.get("x-mesh-key") || bearer || url.searchParams.get("key") || "").trim()
}

export function meshAuthorized(req: Request): boolean {
  const key = meshKeyFrom(req)
  if (!MESH_REQUIRE_KEY) {
    if (!key) return true
    return key === MESH_KEY
  }
  return key === MESH_KEY && MESH_KEY.length > 0
}

export function meshCorsHeaders(): Record<string, string> {
  return {
    "access-control-allow-origin": meshCorsOrigin(),
    "access-control-allow-headers": "content-type, x-mesh-key, authorization",
    "access-control-allow-methods": "GET, POST, OPTIONS",
  }
}

export function meshGate(
  req: Request,
  lane: MeshLane,
  payload: unknown,
): { ok: true } | { ok: false; status: number; error: string; code?: number } {
  if (!meshAuthorized(req)) return { ok: false, status: 401, error: "mesh key required" }
  if (!meshRateLimit(meshClientIp(req))) return { ok: false, status: 429, error: "mesh rate limited" }
  const inspected = inspectMeshPayload(lane, payload)
  if (!inspected.ok) return { ok: false, status: 400, error: inspected.error, code: inspected.code }
  return { ok: true }
}

export async function meshJsonRpc(
  lane: MeshLane,
  payload: unknown,
  timeoutMs = 8000,
): Promise<{ result?: unknown; error?: RpcError; jsonrpc?: string; id?: unknown }> {
  if (publicCatalogOrigin()) {
    return { error: { message: "Mesh is loopback. This origin is the public catalog.", code: -32001 } }
  }
  const origins = meshOrigins()
  const url = origins[lane]
  stats.requests += 1
  stats.byLane[lane] = (stats.byLane[lane] || 0) + 1
  stats.lastLane = lane
  stats.lastAt = Date.now()
  if (payload && typeof payload === "object" && !Array.isArray(payload) && "method" in payload) {
    stats.lastMethod = String((payload as { method?: string }).method || "")
  } else if (Array.isArray(payload) && payload[0] && typeof payload[0] === "object" && "method" in payload[0]) {
    stats.lastMethod = `batch:${payload.length}`
  } else {
    stats.lastMethod = "unknown"
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload ?? {}),
    cache: "no-store",
    signal: AbortSignal.timeout(timeoutMs),
  })
  const json = (await res.json()) as { result?: unknown; error?: RpcError; jsonrpc?: string; id?: unknown }
  return json
}

export async function meshCall(lane: MeshLane, method: string, params: unknown = {}, timeoutMs = 6000): Promise<unknown> {
  const json = await meshJsonRpc(lane, { jsonrpc: "2.0", id: 1, method, params }, timeoutMs)
  if (json.error) throw new Error(json.error.message || method)
  return json.result
}

export async function meshNodeHealth(timeoutMs = 2500): Promise<unknown> {
  if (publicCatalogOrigin()) throw new Error("Mesh is loopback. This origin is the public catalog.")
  stats.byLane.health = (stats.byLane.health || 0) + 1
  const res = await fetch(meshOrigins().nodeHealth, {
    cache: "no-store",
    signal: AbortSignal.timeout(timeoutMs),
  })
  if (!res.ok) throw new Error(`node health ${res.status}`)
  return res.json()
}

export async function meshStatus() {
  if (publicCatalogOrigin()) {
    return {
      ok: false,
      product: "Mesh",
      operator: "THE SECRET LAB",
      local: false,
      origin: "vercel",
      profile: profilePublic(),
      note: "Mesh is loopback. This origin is the public catalog.",
    }
  }
  const [health, tip, chainId, registryCode] = await Promise.all([
    meshNodeHealth().catch(() => null),
    meshCall("core", "hypersdk.lastAccepted", {}, 4000).catch(() => null),
    meshCall("evm", "eth_chainId", [], 2500).catch(() => null),
    meshCall("evm", "eth_getCode", [LOCAL_ZEROID_REGISTRY, "latest"], 2500).catch(() => ""),
  ])
  const h = health as { healthy?: boolean } | null
  const accepted = tip as { height?: number; blockId?: string } | null
  const height = typeof accepted?.height === "number" ? accepted.height : null
  const evmId =
    typeof chainId === "string" && chainId.startsWith("0x")
      ? Number.parseInt(chainId, 16)
      : typeof chainId === "number"
        ? chainId
        : null
  return {
    ok: Boolean(h?.healthy && height && height > 0),
    product: "Mesh",
    operator: "THE SECRET LAB",
    local: true,
    profile: profilePublic(),
    veilvm: {
      healthy: Boolean(h?.healthy),
      height,
      blockId: accepted?.blockId || null,
    },
    companion: {
      chainId: evmId,
      ok: evmId === 31337,
    },
    identity: {
      product: "ZER0ID",
      registry: LOCAL_ZEROID_REGISTRY,
      deployed: Boolean(registryCode && registryCode !== "0x"),
    },
    stats: meshStats(),
  }
}
