export type PortalStatusResponse = {
  timestamp: string
  markets: {
    source: string
    total: number
    active: number
    totalLiquidityUsd: number
    totalVolume24hUsd: number
    topCategories: Array<{ category: string; count: number }>
    topMarkets: Array<{
      id: number
      title: string
      category: string
      liquidity: string
      volume24h: string
      status: string
    }>
  }
  bridge: {
    available: boolean
    overallPass: boolean | null
    chainId: number | null
    latestBlock: number | null
    relayerFunded: boolean | null
    relayerBalanceAvax: string | null
    chainlinkFeeds: Array<{
      feedName: string
      stale: boolean
      updatedAtISO: string | null
    }>
    staleFeeds: number
    timestamp: string | null
  }
  prelaunch: {
    available: boolean
    overallPass: boolean | null
    failingGateCount: number
    failingGates: Array<{
      gateId: string
      status: string
    }>
    timestamp: string | null
  }
  mvp: {
    available: boolean
    passed: boolean | null
    targetMinutes: number | null
    totalDurationMs: number | null
    totalDurationMinutes: number | null
    startedAt: string | null
    endedAt: string | null
    stepCount: number
    passedStepCount: number
    failedStepCount: number
    failedSteps: Array<{
      id: string
      name: string
      error: string | null
    }>
    artifactPath: string | null
    trackerStatus: string | null
    trackerUpdated: string | null
    trackerLastArtifact: string | null
  }
  orderRouter: {
    configured: boolean
    baseUrl: string | null
    reachable: boolean | null
    statusCode: number | null
  }
  flags: {
    liveMarketsAvailable: boolean
    bridgeReady: boolean
    chainlinkFresh: boolean
    prelaunchReady: boolean
    mvpReady: boolean
    orderRouterReady: boolean
  }
}

export function formatUsdCompact(value: number): string {
  if (!Number.isFinite(value)) {
    return "$0"
  }
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`
  }
  return `$${value.toFixed(0)}`
}
