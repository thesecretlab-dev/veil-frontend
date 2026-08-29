import {
  LOCAL_COMPANION_CHAIN_ID,
  LOCAL_COMPANION_RPC,
  LOCAL_LIQ_GATEWAY,
  LOCAL_NODE,
  LOCAL_NODE_ID,
  LOCAL_ORDER_GATEWAY,
  LOCAL_ROUTER,
  LOCAL_SUBNET_ID,
  LOCAL_VEILVM_APP_ID,
  LOCAL_VEILVM_CHAIN_ID,
  LOCAL_WVEIL,
  LOCAL_ZEROID_REGISTRY,
  MESH_HTTP,
  veilCoreApi,
} from "@/lib/local-runtime"
import { polymarketVenueStats } from "@/lib/polymarket/settle"
import { profileParked, profilePublic, publicCatalogOrigin, runtimeProfile } from "@/lib/runtime-profile"
import { readFileSync } from "fs"
import { resolve } from "path"

function liveZeroIdRegistry(): string {
  if (process.env.ZEROID_REGISTRY) return process.env.ZEROID_REGISTRY.trim()
  try {
    const doc = JSON.parse(
      readFileSync(resolve(process.cwd(), "../veilvm/scripts/companion-evm.addresses.json"), "utf8"),
    ) as { zeroidRegistry?: string }
    if (doc.zeroidRegistry) return String(doc.zeroidRegistry)
  } catch {}
  return LOCAL_ZEROID_REGISTRY
}

async function jsonRpc(url: string, method: string, params: unknown = {}, timeoutMs = 2500): Promise<unknown> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    cache: "no-store",
    signal: AbortSignal.timeout(timeoutMs),
  })
  const json = (await res.json()) as { result?: unknown; error?: { message?: string } }
  if (json.error) throw new Error(json.error.message || method)
  return json.result
}

async function timedGet(url: string, timeoutMs = 2500): Promise<unknown> {
  const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(timeoutMs) })
  if (!res.ok) throw new Error(`${url} ${res.status}`)
  return res.json()
}

function asHexNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && value.startsWith("0x")) {
    const n = Number.parseInt(value, 16)
    return Number.isFinite(n) ? n : null
  }
  return null
}

function hasCode(code: unknown) {
  return typeof code === "string" && code !== "" && code !== "0x"
}

export async function probeStack() {
  const profile = profilePublic()
  if (publicCatalogOrigin()) {
    return {
      ok: true,
      readyForUsers: true,
      local: false,
      origin: "vercel",
      profile,
      timestamp: new Date().toISOString(),
      chainId: LOCAL_VEILVM_APP_ID,
      blockHeight: null as number | null,
      totalPeers: 0,
      subnetPeers: 0,
      validators: [] as Array<{ nodeId: string; role: string; active: boolean; label: string }>,
      veilvm: {
        healthy: false,
        appId: LOCAL_VEILVM_APP_ID,
        chainId: "",
        subnetId: "",
        height: null as number | null,
        blockId: null as string | null,
        node: "",
        nodeId: "",
        note: "Native VeilVM is loopback. This origin serves the public catalog.",
      },
      companion: {
        ok: false,
        chainId: null as number | null,
        expectedChainId: LOCAL_COMPANION_CHAIN_ID,
        rpc: "",
        orderGateway: "",
        liquidityGateway: "",
        wveil: "",
        orderGatewayLive: false,
        liquidityGatewayLive: false,
        wveilLive: false,
        note: "Companion anvil is not this origin.",
      },
      identity: {
        product: "ZER0ID",
        registry: "",
        deployed: false,
        groth16WasmServed: false,
        registerIdentity: false,
      },
      mesh: { ok: false, http: "", operator: "THE SECRET LAB", note: "Mesh is loopback." },
      router: {
        ok: false,
        base: "",
        chainId: null as string | null,
        markets: 0,
        proverReady: false,
      },
      polymarket: {
        catalog: true,
        liveClob: process.env.POLYMARKET_CLOB_LIVE === "1",
        venue: null as string | null,
        deployed: false,
        fills: 0,
        note: "Public catalog. Prices from Polymarket Gamma/CLOB. Native settlement is not this origin.",
      },
      checks: [{ id: "catalog", ok: true, detail: "polymarket feed" }],
      failed: [] as string[],
    }
  }
  if (profileParked()) {
    return {
      ok: false,
      readyForUsers: false,
      local: false,
      profile,
      error: `${runtimeProfile()} is parked. This tree serves local only.`,
      timestamp: new Date().toISOString(),
      chainId: LOCAL_VEILVM_APP_ID,
      blockHeight: null as number | null,
      totalPeers: 0,
      subnetPeers: 0,
      validators: [] as Array<{ nodeId: string; role: string; active: boolean; label: string }>,
      veilvm: {
        healthy: false,
        appId: LOCAL_VEILVM_APP_ID,
        chainId: LOCAL_VEILVM_CHAIN_ID,
        subnetId: LOCAL_SUBNET_ID,
        height: null as number | null,
        blockId: null as string | null,
        node: LOCAL_NODE,
        nodeId: LOCAL_NODE_ID,
      },
      companion: {
        ok: false,
        chainId: null as number | null,
        expectedChainId: LOCAL_COMPANION_CHAIN_ID,
        rpc: LOCAL_COMPANION_RPC,
        orderGateway: LOCAL_ORDER_GATEWAY,
        liquidityGateway: LOCAL_LIQ_GATEWAY,
        wveil: LOCAL_WVEIL,
        orderGatewayLive: false,
        liquidityGatewayLive: false,
        wveilLive: false,
        note: "Parked profile. Companion not probed.",
      },
      identity: {
        product: "ZER0ID",
        registry: liveZeroIdRegistry(),
        deployed: false,
        groth16WasmServed: false,
        registerIdentity: false,
      },
      mesh: { ok: false, http: MESH_HTTP, operator: "THE SECRET LAB" },
      router: {
        ok: false,
        base: LOCAL_ROUTER,
        chainId: null as string | null,
        markets: 0,
        proverReady: false,
      },
      checks: [{ id: "profile", ok: false, detail: `${runtimeProfile()} parked` }],
      failed: ["profile"],
    }
  }

  const [nodeHealth, accepted, router, companionChain, orderCode, liqCode, wveilCode, registryCode, meshHealth, poly] =
    await Promise.all([
      timedGet(`${LOCAL_NODE}/ext/health`).catch(() => null),
      jsonRpc(veilCoreApi(), "hypersdk.lastAccepted", {}).catch(() => null),
      timedGet(`${LOCAL_ROUTER}/health`).catch(() => null),
      jsonRpc(LOCAL_COMPANION_RPC, "eth_chainId", []).catch(() => null),
      jsonRpc(LOCAL_COMPANION_RPC, "eth_getCode", [LOCAL_ORDER_GATEWAY, "latest"]).catch(() => null),
      jsonRpc(LOCAL_COMPANION_RPC, "eth_getCode", [LOCAL_LIQ_GATEWAY, "latest"]).catch(() => null),
      jsonRpc(LOCAL_COMPANION_RPC, "eth_getCode", [LOCAL_WVEIL, "latest"]).catch(() => null),
      jsonRpc(LOCAL_COMPANION_RPC, "eth_getCode", [liveZeroIdRegistry(), "latest"]).catch(() => null),
      timedGet(`${MESH_HTTP}/health`).catch(() => null),
      polymarketVenueStats({ deploy: false }).catch(() => null),
    ])

  const health = nodeHealth as { healthy?: boolean } | null
  const tip = accepted as { height?: number; blockId?: string } | null
  const height = typeof tip?.height === "number" ? tip.height : null
  const routerHealth = router as { ok?: boolean; chainId?: string; markets?: number; proverReady?: boolean } | null
  const companionId = asHexNumber(companionChain)
  const companionOk = companionId === LOCAL_COMPANION_CHAIN_ID && hasCode(orderCode) && hasCode(liqCode)
  const veilvmOk = Boolean(health?.healthy && height && height > 0)
  const routerOk = Boolean(routerHealth?.ok && routerHealth.chainId === LOCAL_VEILVM_CHAIN_ID)
  const identityOk = hasCode(registryCode)
  const mesh = meshHealth as { ok?: boolean; veilvm?: { height?: number | null } } | null
  const meshOk = Boolean(mesh?.ok || (mesh && veilvmOk))
  const readyForUsers = veilvmOk && routerOk && companionOk

  const checks = [
    { id: "veilvm", ok: veilvmOk, detail: veilvmOk ? `ht ${height}` : "node down" },
    { id: "router", ok: routerOk, detail: routerOk ? `${routerHealth?.markets ?? 0} books` : "router down or chain mismatch" },
    { id: "companion", ok: companionOk, detail: companionOk ? "31337 rails" : "anvil/gateways down" },
    { id: "zeroid", ok: identityOk, detail: identityOk ? liveZeroIdRegistry() : "registry bytecode missing" },
    { id: "mesh", ok: meshOk, detail: meshOk ? MESH_HTTP : "mesh :8787 not answering" },
  ]

  return {
    ok: readyForUsers,
    readyForUsers,
    local: true,
    profile,
    timestamp: new Date().toISOString(),
    chainId: LOCAL_VEILVM_APP_ID,
    blockHeight: height,
    totalPeers: 0,
    subnetPeers: 0,
    validators: [
      {
        nodeId: LOCAL_NODE_ID,
        role: "primary",
        active: veilvmOk,
        label: "Local VeilVM",
      },
    ],
    veilvm: {
      healthy: Boolean(health?.healthy),
      appId: LOCAL_VEILVM_APP_ID,
      chainId: LOCAL_VEILVM_CHAIN_ID,
      subnetId: LOCAL_SUBNET_ID,
      height,
      blockId: tip?.blockId || null,
      node: LOCAL_NODE,
      nodeId: LOCAL_NODE_ID,
    },
    companion: {
      ok: companionOk,
      chainId: companionId,
      expectedChainId: LOCAL_COMPANION_CHAIN_ID,
      rpc: LOCAL_COMPANION_RPC,
      orderGateway: LOCAL_ORDER_GATEWAY,
      liquidityGateway: LOCAL_LIQ_GATEWAY,
      wveil: LOCAL_WVEIL,
      orderGatewayLive: hasCode(orderCode),
      liquidityGatewayLive: hasCode(liqCode),
      wveilLive: hasCode(wveilCode),
      note: "Anvil 31337 companion rails. Not HyperSDK. Not Fuji.",
    },
    identity: {
      product: "ZER0ID",
      registry: liveZeroIdRegistry(),
      deployed: identityOk,
      groth16WasmServed: false,
      registerIdentity: false,
    },
    mesh: {
      ok: meshOk,
      http: MESH_HTTP,
      operator: "THE SECRET LAB",
    },
    router: {
      ok: routerOk,
      base: LOCAL_ROUTER,
      chainId: routerHealth?.chainId || null,
      markets: routerHealth?.markets ?? 0,
      proverReady: Boolean(routerHealth?.proverReady),
    },
    polymarket: {
      catalog: (process.env.VEIL_INCLUDE_POLYMARKET ?? "1") !== "0",
      liveClob: process.env.POLYMARKET_CLOB_LIVE === "1",
      venue: poly?.venue || null,
      deployed: Boolean(poly?.deployed),
      fills: poly?.fills ?? 0,
      note: "CLOB-priced route. Local fills settle on companion PolymarketVenue, not Polygon 137, unless POLYMARKET_CLOB_LIVE=1.",
    },
    checks,
    failed: checks.filter((c) => !c.ok).map((c) => c.id),
  }
}
