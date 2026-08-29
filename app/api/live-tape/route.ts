import { promises as fs } from "fs"
import path from "path"

import { NextResponse } from "next/server"
import { LOCAL_VEILVM_CHAIN_ID } from "@/lib/local-runtime"
import { meshCall, meshNodeHealth } from "@/lib/mesh/proxy"

export const dynamic = "force-dynamic"

const ROUTER = (process.env.VEIL_ORDER_API_BASE || "http://127.0.0.1:9098").replace(/\/+$/, "")
const CHAIN_ID = LOCAL_VEILVM_CHAIN_ID
const SECRET =
  process.env.VEIL_ORDER_API_KEY ||
  process.env.ORDER_ROUTER_RELAY_SECRET ||
  (process.env.NODE_ENV === "production" ? "" : "local-dev-secret")

type Tick = { t: string; kind: string; text: string; hash?: string }

async function timedJson(url: string, init?: RequestInit): Promise<unknown> {
  const res = await fetch(url, { ...init, cache: "no-store", signal: AbortSignal.timeout(2500) })
  if (!res.ok) throw new Error(`${url} ${res.status}`)
  return res.json()
}

function parseTick(line: string): Tick | null {
  const m = line.match(/^(\S+)\s+(.+)$/)
  if (!m) return null
  const t = m[1]
  const rest = m[2].trim()
  if (rest.startsWith("live-activity start")) {
    return { t, kind: "sys", text: "tape online" }
  }
  const swap = rest.match(/^swap\s+(\S+)\s+(0x[a-f0-9]+)/i)
  if (swap) return { t, kind: "swap", text: `swap ${swap[1]}`, hash: swap[2] }
  const add = rest.match(/^add_lp\s+(0x[a-f0-9]+)/i)
  if (add) return { t, kind: "lp", text: "add liquidity", hash: add[1] }
  const mint = rest.match(/^mint\s+(0x[a-f0-9]+)/i)
  if (mint) return { t, kind: "vai", text: "mint VAI", hash: mint[1] }
  const fees = rest.match(/^fees\s+(0x[a-f0-9]+)/i)
  if (fees) return { t, kind: "fee", text: "route fees", hash: fees[1] }
  const order = rest.match(/^order\s+(0x[a-f0-9]+)\s+market=([A-Za-z0-9]+)/i)
  if (order) return { t, kind: "order", text: `order ${order[2].slice(0, 8)}`, hash: order[1] }
  const clear = rest.match(/^clear\s+(0x[a-f0-9]+)/i)
  if (clear) return { t, kind: "clear", text: "batch cleared", hash: clear[1] }
  if (rest.includes("FAIL")) return { t, kind: "fail", text: rest.slice(0, 80) }
  return { t, kind: "sys", text: rest.slice(0, 80) }
}

async function readTicks(): Promise<Tick[]> {
  const candidates = [
    process.env.VEIL_ACTIVITY_LOG,
    path.resolve(process.cwd(), "..", "veilvm", ".local", "logs", "live-activity.log"),
    path.resolve("C:/Users/Justin/src/veil/veilvm/.local/logs/live-activity.log"),
  ].filter(Boolean) as string[]
  for (const p of candidates) {
    try {
      const raw = await fs.readFile(p, "utf8")
      const lines = raw.trim().split(/\r?\n/).filter(Boolean).slice(-24)
      return lines.map(parseTick).filter((x): x is Tick => Boolean(x)).reverse()
    } catch {
      continue
    }
  }
  return []
}

export async function GET() {
  const headers: Record<string, string> = {}
  if (SECRET) headers["x-relay-secret"] = SECRET

  const [router, nodeHealth, poolRpc, accepted, ticks] = await Promise.all([
    timedJson(`${ROUTER}/health`).catch(() => null),
    meshNodeHealth().catch(() => null),
    meshCall("veil", "veilvm.pool", { asset0: 0, asset1: 1 }, 2500).catch(() => null),
    meshCall("core", "hypersdk.lastAccepted", {}, 2500).catch(() => null),
    readTicks(),
  ])

  const health = router as { ok?: boolean; chainId?: string; markets?: number; proverReady?: boolean } | null
  const node = nodeHealth as {
    healthy?: boolean
    checks?: Record<string, { message?: { engine?: { consensus?: { lastAcceptedHeight?: number } } } }>
  } | null
  const pool = poolRpc as { reserve0?: number; reserve1?: number; total_lp?: number; fee_bips?: number } | null
  const heightFromHealth = node?.checks?.[CHAIN_ID]?.message?.engine?.consensus?.lastAcceptedHeight ?? null
  const acceptedRow = accepted as { height?: number; blockId?: string; timestamp?: number } | null
  const height = acceptedRow?.height ?? heightFromHealth

  return NextResponse.json({
    ok: Boolean(health?.ok || (typeof height === "number" && height > 0)),
    local: true,
    chainId: health?.chainId || CHAIN_ID,
    markets: health?.markets ?? 0,
    proverReady: Boolean(health?.proverReady),
    height,
    blockId: acceptedRow?.blockId || null,
    blockTimestamp: acceptedRow?.timestamp || null,
    pool: pool || null,
    ticks,
    timestamp: new Date().toISOString(),
  })
}
