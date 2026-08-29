/**
 * Mesh — THE SECRET LAB RPC provider (local).
 * VeilVM (HyperSDK) + companion EVM. Not Fuji. Not mainnet.
 *
 *   node mesh/server.mjs
 *   http://127.0.0.1:8787/health
 */
import http from "node:http"
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const PORT = Number(process.env.MESH_PORT || 8787)
const KEY = (process.env.MESH_API_KEY || "mesh_local_dev").trim()
const REQUIRE_KEY = process.env.MESH_REQUIRE_KEY === "1"
const STRICT = process.env.MESH_STRICT === "1"
const CORS_ORIGIN = (process.env.MESH_CORS_ORIGIN || "*").trim() || "*"
const MAX_BATCH = Math.min(Number(process.env.MESH_MAX_BATCH || 20), 50)
const RPM = Number(process.env.MESH_RPM || 240)
const DENY_EXACT = new Set(["eth_sendTransaction", "eth_sign", "eth_signTransaction", "eth_signTypedData", "eth_signTypedData_v4"])
const ALLOW = {
  core: new Set(["hypersdk.ping", "hypersdk.lastAccepted", "hypersdk.network"]),
  veil: new Set(["veilvm.pool", "veilvm.treasury", "veilvm.vaistate", "veilvm.balance", "veilvm.vaibalance"]),
  indexer: new Set(["indexer.getBlock", "indexer.getTx"]),
  evm: new Set([
    "eth_chainId", "eth_blockNumber", "eth_getCode", "eth_call", "eth_getBalance",
    "eth_getTransactionReceipt", "eth_getTransactionByHash", "eth_getTransactionCount",
    "eth_sendRawTransaction", "eth_estimateGas", "eth_gasPrice", "eth_maxPriorityFeePerGas",
    "eth_feeHistory", "eth_getBlockByNumber", "eth_getBlockByHash", "eth_getLogs",
    "eth_accounts", "eth_syncing", "net_version", "web3_clientVersion",
  ]),
}
const buckets = new Map()
const NODE = (process.env.VEIL_NODE_URL || "http://127.0.0.1:9660").replace(/\/+$/, "")
const CHAIN = process.env.VEIL_CHAIN_ID || "bdRGUMA7rzZFXjbn1ePTjqhAUfTjW94e69p7qZd4puZ3uEosL"
const EVM = (process.env.VEIL_COMPANION_RPC || "http://127.0.0.1:8545").replace(/\/+$/, "")
const APP_ID = 22207
function loadZeroIdRegistry() {
  if (process.env.ZEROID_REGISTRY) return process.env.ZEROID_REGISTRY.trim()
  try {
    const here = dirname(fileURLToPath(import.meta.url))
    const rails = resolve(here, "../../veilvm/scripts/companion-evm.addresses.json")
    const doc = JSON.parse(readFileSync(rails, "utf8"))
    if (doc.zeroidRegistry) return String(doc.zeroidRegistry).trim()
  } catch {}
  return "0x68B1D87F95878fE05B998F19b66F4baba5De1aed"
}
const ZEROID_REGISTRY_FALLBACK = loadZeroIdRegistry()

const ORIGIN = {
  veil: `${NODE}/ext/bc/${CHAIN}/veilapi`,
  core: `${NODE}/ext/bc/${CHAIN}/coreapi`,
  indexer: `${NODE}/ext/bc/${CHAIN}/indexer`,
  evm: EVM,
}

const stats = { requests: 0, byLane: { veil: 0, core: 0, indexer: 0, evm: 0 }, lastMethod: "", lastAt: 0 }

function cors() {
  return {
    "access-control-allow-origin": CORS_ORIGIN,
    "access-control-allow-headers": "content-type, x-mesh-key, authorization",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "content-type": "application/json",
  }
}

function methodOk(lane, method) {
  const m = String(method || "").trim()
  if (!m || DENY_EXACT.has(m) || /^(admin|debug|personal|anvil|hardhat|miner|txpool|engine)_/i.test(m)) return false
  if (ALLOW[lane]?.has(m)) return true
  return !STRICT
}

function inspect(lane, payload) {
  const items = Array.isArray(payload) ? payload : [payload]
  if (!payload || items.length === 0) return "empty payload"
  if (items.length > MAX_BATCH) return `batch exceeds ${MAX_BATCH}`
  for (const item of items) {
    if (!item || typeof item !== "object" || !item.method) return "invalid JSON-RPC object"
    if (!methodOk(lane, item.method)) return `method not allowed on ${lane}: ${item.method}`
  }
  return null
}

function rateOk(ip) {
  const now = Date.now()
  const cur = buckets.get(ip)
  if (!cur || now >= cur.reset) {
    buckets.set(ip, { n: 1, reset: now + 60_000 })
    return true
  }
  if (cur.n >= RPM) return false
  cur.n += 1
  return true
}

function send(res, status, body) {
  const payload = typeof body === "string" ? body : JSON.stringify(body)
  res.writeHead(status, cors())
  res.end(payload)
}

function keyOk(req, url) {
  const header = req.headers["x-mesh-key"] || ""
  const auth = String(req.headers.authorization || "")
  const bearer = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : ""
  const q = url.searchParams.get("key") || ""
  const key = String(header || bearer || q).trim()
  if (!REQUIRE_KEY) return !key || key === KEY
  return key === KEY
}

async function readBody(req) {
  const chunks = []
  for await (const c of req) chunks.push(c)
  const raw = Buffer.concat(chunks).toString("utf8")
  if (!raw) return null
  return JSON.parse(raw)
}

async function forward(lane, payload) {
  const url = ORIGIN[lane]
  if (!url) throw new Error(`unknown lane ${lane}`)
  stats.requests += 1
  stats.byLane[lane] = (stats.byLane[lane] || 0) + 1
  stats.lastAt = Date.now()
  if (payload && typeof payload === "object" && !Array.isArray(payload) && payload.method) {
    stats.lastMethod = String(payload.method)
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload ?? {}),
    signal: AbortSignal.timeout(12000),
  })
  return res.json()
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://127.0.0.1:${PORT}`)
    if (req.method === "OPTIONS") {
      res.writeHead(204, cors())
      res.end()
      return
    }

    if (req.method === "GET" && (url.pathname === "/health" || url.pathname === "/v1/health")) {
      let node = null
      let tip = null
      let evm = null
      try {
        node = await fetch(`${NODE}/ext/health`, { signal: AbortSignal.timeout(2500) }).then((r) => r.json())
      } catch {
        node = null
      }
      try {
        tip = await forward("core", { jsonrpc: "2.0", id: 1, method: "hypersdk.lastAccepted", params: {} })
      } catch {
        tip = null
      }
      try {
        evm = await forward("evm", { jsonrpc: "2.0", id: 1, method: "eth_chainId", params: [] })
      } catch {
        evm = null
      }
      let registryCode = ""
      try {
        const code = await forward("evm", {
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getCode",
          params: [loadZeroIdRegistry(), "latest"],
        })
        registryCode = String(code?.result || "")
      } catch {
        registryCode = ""
      }
      const height = tip?.result?.height ?? null
      const chainHex = evm?.result
      const evmId = typeof chainHex === "string" ? Number.parseInt(chainHex, 16) : null
      send(res, node?.healthy && height ? 200 : 503, {
        ok: Boolean(node?.healthy && height),
        product: "Mesh",
        operator: "THE SECRET LAB",
        local: true,
        veilvm: { healthy: Boolean(node?.healthy), height, blockId: tip?.result?.blockId || null },
        companion: { chainId: evmId, ok: evmId === 31337 },
        identity: {
          product: "ZER0ID",
          registry: loadZeroIdRegistry(),
          deployed: Boolean(registryCode && registryCode !== "0x"),
        },
        stats,
      })
      return
    }

    if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/v1")) {
      const origin = `http://127.0.0.1:${PORT}`
      send(res, 200, {
        product: "Mesh",
        operator: "THE SECRET LAB",
        local: true,
        note: "Local Mesh. Not Fuji. Not mainnet. VeilVM app-id 22207 is not an EVM chain id.",
        keyHeader: "x-mesh-key",
        networks: [
          {
            id: "veilvm",
            appId: APP_ID,
            chainId: CHAIN,
            lanes: {
              core: `${origin}/v1/core`,
              veil: `${origin}/v1/veil`,
              indexer: `${origin}/v1/indexer`,
            },
          },
          { id: "companion", chainId: 31337, lanes: { evm: `${origin}/v1/evm` } },
        ],
      })
      return
    }

    if (req.method === "GET" && url.pathname === "/ext/health") {
      try {
        const node = await fetch(`${NODE}/ext/health`, { signal: AbortSignal.timeout(2500) }).then((r) => r.json())
        send(res, 200, node)
      } catch (err) {
        send(res, 502, { error: String(err.message || err) })
      }
      return
    }

    if (req.method === "POST") {
      if (!keyOk(req, url)) {
        send(res, 401, { error: "mesh key required" })
        return
      }
      const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "local").split(",")[0].trim()
      if (!rateOk(ip)) {
        send(res, 429, { error: "mesh rate limited" })
        return
      }
      let lane = null
      const p = url.pathname.replace(/\/+$/, "")
      if (p === "/v1/veil" || p.endsWith("/veilapi")) lane = "veil"
      else if (p === "/v1/core" || p.endsWith("/coreapi")) lane = "core"
      else if (p === "/v1/indexer" || p.endsWith("/indexer")) lane = "indexer"
      else if (p === "/v1/evm" || p === "/evm") lane = "evm"
      if (!lane) {
        send(res, 404, { error: "unknown mesh lane" })
        return
      }
      const payload = await readBody(req)
      const bad = inspect(lane, payload)
      if (bad) {
        send(res, 400, { jsonrpc: "2.0", id: null, error: { code: -32601, message: bad } })
        return
      }
      const json = await forward(lane, payload)
      send(res, 200, json)
      return
    }

    send(res, 404, { error: "not found" })
  } catch (err) {
    send(res, 500, { error: String(err.message || err) })
  }
})

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Mesh (THE SECRET LAB) http://127.0.0.1:${PORT}`)
  console.log(`  VeilVM  ${ORIGIN.core}`)
  console.log(`  EVM     ${ORIGIN.evm}`)
  console.log(`  key     ${REQUIRE_KEY ? "required" : KEY}`)
})
