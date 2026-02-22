import { promises as fs } from "fs"
import path from "path"

import { NextResponse } from "next/server"

import { getMergedMarkets } from "@/lib/veil-market-service"

type BridgeFeed = {
  feedName?: string
  stale?: boolean
  updatedAtISO?: string
}

type BridgeStatus = {
  timestamp?: string
  overallPass?: boolean
  rpc?: {
    chainId?: number
    latestBlock?: number
  }
  chainlink?: {
    feeds?: BridgeFeed[]
  }
  relayer?: {
    meetsMinimum?: boolean
    balanceAvax?: string
  }
}

type ReadinessGate = {
  gateId?: string
  status?: string
}

type PrelaunchReadiness = {
  timestamp?: string
  overallPass?: boolean
  checks?: {
    checklist?: {
      failing?: ReadinessGate[]
    }
  }
}

const ORDER_ROUTER_TIMEOUT_MS = 3500

function parseUsdShorthand(value: string | undefined): number {
  if (!value) {
    return 0
  }

  const normalized = value.replace(/[$,\s]/g, "").toLowerCase()
  const match = normalized.match(/^(-?\d*\.?\d+)([kmb])?$/)
  if (!match) {
    return 0
  }

  const base = Number.parseFloat(match[1] || "0")
  if (!Number.isFinite(base)) {
    return 0
  }

  const suffix = match[2] || ""
  if (suffix === "k") {
    return base * 1_000
  }
  if (suffix === "m") {
    return base * 1_000_000
  }
  if (suffix === "b") {
    return base * 1_000_000_000
  }

  return base
}

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8")
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

async function readLatestPrelaunch(maievDir: string): Promise<PrelaunchReadiness | null> {
  try {
    const entries = await fs.readdir(maievDir)
    const files = entries
      .filter((entry) => /^prelaunch-readiness-.*\.json$/i.test(entry))
      .sort()
      .reverse()

    if (files.length === 0) {
      return null
    }

    const latestPath = path.join(maievDir, files[0])
    return readJsonFile<PrelaunchReadiness>(latestPath)
  } catch {
    return null
  }
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }
}

async function probeOrderRouter(baseUrl: string): Promise<{ reachable: boolean; statusCode: number | null }> {
  const candidates = [`${baseUrl}/health`, baseUrl]

  for (const url of candidates) {
    try {
      const response = await fetchWithTimeout(url, ORDER_ROUTER_TIMEOUT_MS)
      if (response.status < 500) {
        return { reachable: true, statusCode: response.status }
      }
    } catch {
      continue
    }
  }

  return { reachable: false, statusCode: null }
}

export const dynamic = "force-dynamic"

export async function GET() {
  const maievDir = path.join(process.cwd(), "public", "maiev")
  const bridgePath = path.join(maievDir, "mainnet-bridge-live-status-latest.json")

  const [markets, bridgeStatus, readiness] = await Promise.all([
    getMergedMarkets(),
    readJsonFile<BridgeStatus>(bridgePath),
    readLatestPrelaunch(maievDir),
  ])

  const totalLiquidityUsd = markets.reduce((sum, market) => sum + parseUsdShorthand(market.liquidity), 0)
  const totalVolume24hUsd = markets.reduce((sum, market) => sum + parseUsdShorthand(market.volume24h), 0)
  const activeMarkets = markets.filter((market) => market.status !== "closed")

  const topMarkets = [...markets]
    .sort((a, b) => parseUsdShorthand(b.liquidity) - parseUsdShorthand(a.liquidity))
    .slice(0, 8)
    .map((market) => ({
      id: market.id,
      title: market.title,
      category: market.category,
      liquidity: market.liquidity || "$0",
      volume24h: market.volume24h || "$0",
      status: market.status || "active",
    }))

  const categoryCounts = new Map<string, number>()
  for (const market of markets) {
    const key = market.category || "Other"
    categoryCounts.set(key, (categoryCounts.get(key) || 0) + 1)
  }

  const topCategories = [...categoryCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([category, count]) => ({ category, count }))

  const chainlinkFeeds = bridgeStatus?.chainlink?.feeds || []
  const staleFeeds = chainlinkFeeds.filter((feed) => feed.stale).length
  const failingGates = readiness?.checks?.checklist?.failing || []

  const orderRouterBase = (process.env.VEIL_ORDER_API_BASE || "").trim().replace(/\/+$/, "")
  const orderRouterProbe = orderRouterBase
    ? await probeOrderRouter(orderRouterBase)
    : { reachable: false, statusCode: null as number | null }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    markets: {
      source: "polymarket",
      total: markets.length,
      active: activeMarkets.length,
      totalLiquidityUsd,
      totalVolume24hUsd,
      topCategories,
      topMarkets,
    },
    bridge: {
      available: Boolean(bridgeStatus),
      overallPass: bridgeStatus?.overallPass ?? null,
      chainId: bridgeStatus?.rpc?.chainId ?? null,
      latestBlock: bridgeStatus?.rpc?.latestBlock ?? null,
      relayerFunded: bridgeStatus?.relayer?.meetsMinimum ?? null,
      relayerBalanceAvax: bridgeStatus?.relayer?.balanceAvax ?? null,
      chainlinkFeeds: chainlinkFeeds.map((feed) => ({
        feedName: feed.feedName || "unknown",
        stale: Boolean(feed.stale),
        updatedAtISO: feed.updatedAtISO || null,
      })),
      staleFeeds,
      timestamp: bridgeStatus?.timestamp ?? null,
    },
    prelaunch: {
      available: Boolean(readiness),
      overallPass: readiness?.overallPass ?? null,
      failingGateCount: failingGates.length,
      failingGates: failingGates.map((gate) => ({
        gateId: gate.gateId || "unknown",
        status: gate.status || "unknown",
      })),
      timestamp: readiness?.timestamp ?? null,
    },
    orderRouter: {
      configured: Boolean(orderRouterBase),
      baseUrl: orderRouterBase || null,
      reachable: orderRouterBase ? orderRouterProbe.reachable : null,
      statusCode: orderRouterBase ? orderRouterProbe.statusCode : null,
    },
    flags: {
      liveMarketsAvailable: markets.length > 0,
      bridgeReady: bridgeStatus?.overallPass === true,
      chainlinkFresh: chainlinkFeeds.length > 0 && staleFeeds === 0,
      prelaunchReady: readiness?.overallPass === true,
      orderRouterReady: Boolean(orderRouterBase) && orderRouterProbe.reachable,
    },
  })
}
