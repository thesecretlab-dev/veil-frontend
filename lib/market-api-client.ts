import type { Market } from "@/lib/market-data"

type MarketsResponse = {
  markets: Market[]
}

type MarketResponse = {
  market: Market
}

export type LatestTrade = {
  transactionHash: string
  price: number
  side: string
  outcome: string
  timestamp: number
}

export type SubmitOrderRequest = {
  marketId: string
  side: "buy" | "sell"
  outcome: "yes" | "no"
  amountUsd: number
  walletAddress: string
  walletSignature?: string
  walletNonce?: string
  nativeNetwork?: "veil" | "polygon"
  routingFeeBps?: number
  actor?: string
}

export type OrderSubmissionResult = {
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
  windowId?: number
}

type LatestTradeResponse = {
  trade: LatestTrade | null
}

type SubmitOrderResponse = {
  result: OrderSubmissionResult | null
}

function safeStringError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

export async function createNativeMarket(question: string): Promise<{ accepted?: boolean; marketId?: string; veilTxHash?: string; error?: string } | null> {
  try {
    const response = await fetch("/api/markets", {
      method: "POST",
      cache: "no-store",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question }),
    })
    return (await response.json().catch(() => null)) as {
      accepted?: boolean
      marketId?: string
      veilTxHash?: string
      error?: string
    } | null
  } catch (error) {
    console.error("Failed to create native market:", safeStringError(error))
    return null
  }
}

export async function fetchMarkets(scope?: "native"): Promise<Market[]> {
  try {
    const path = scope === "native" ? "/api/markets?scope=native" : "/api/markets"
    const response = await fetch(path, { cache: "no-store", signal: AbortSignal.timeout(8000) })
    if (!response.ok) {
      return []
    }

    const payload = (await response.json()) as MarketsResponse
    return Array.isArray(payload.markets) ? payload.markets : []
  } catch (error) {
    console.error("Failed to fetch markets:", safeStringError(error))
    return []
  }
}

export async function fetchMarketById(id: string): Promise<Market | null> {
  try {
    const response = await fetch(`/api/markets/${id}`, { cache: "no-store" })
    if (!response.ok) {
      return null
    }

    const payload = (await response.json()) as MarketResponse
    return payload.market ?? null
  } catch (error) {
    console.error(`Failed to fetch market ${id}:`, safeStringError(error))
    return null
  }
}

export async function fetchLatestTrade(marketId: string): Promise<LatestTrade | null> {
  try {
    const response = await fetch(`/api/markets/${marketId}/latest-trade`, { cache: "no-store" })
    if (!response.ok) {
      return null
    }

    const payload = (await response.json()) as LatestTradeResponse
    return payload.trade ?? null
  } catch (error) {
    console.error(`Failed to fetch latest trade for ${marketId}:`, safeStringError(error))
    return null
  }
}

export type SettleBatchResult = {
  accepted?: boolean
  status?: string
  message?: string
  marketId?: string
  windowId?: number
  revealTxHash?: string
  proofTxHash?: string
  clearTxHash?: string
  proveMs?: number
  error?: string
}

export async function settleNativeBatch(marketId: string, windowId?: number): Promise<SettleBatchResult | null> {
  try {
    const response = await fetch("/api/settle-batch", {
      method: "POST",
      cache: "no-store",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ marketId, windowId }),
    })
    return (await response.json().catch(() => null)) as SettleBatchResult | null
  } catch (error) {
    console.error("Failed to settle native batch:", safeStringError(error))
    return null
  }
}

export async function fetchOrderRouterHealth(): Promise<{
  ok: boolean
  chainId: string
  meshActor?: string
  animaActor?: string
  zer0Actor?: string
  zeroActor?: string
  actor2?: string
  meshVeil?: number
  animaVeil?: number
  zer0Veil?: number
}> {
  try {
    const response = await fetch("/api/orders", { cache: "no-store" })
    const payload = (await response.json().catch(() => null)) as {
      ok?: boolean
      chainId?: string
      meshActor?: string
      animaActor?: string
      zer0Actor?: string
      zeroActor?: string
      actor2?: string
      meshVeil?: number
      animaVeil?: number
      zer0Veil?: number
    } | null
    const zer0 = payload?.zer0Actor || payload?.zeroActor
    return {
      ok: Boolean(payload?.ok),
      chainId: String(payload?.chainId || ""),
      meshActor: payload?.meshActor,
      animaActor: payload?.animaActor,
      zer0Actor: zer0,
      zeroActor: zer0,
      actor2: payload?.actor2,
      meshVeil: payload?.meshVeil,
      animaVeil: payload?.animaVeil,
      zer0Veil: payload?.zer0Veil,
    }
  } catch {
    return { ok: false, chainId: "" }
  }
}

export async function submitOrder(input: SubmitOrderRequest): Promise<OrderSubmissionResult | null> {
  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      cache: "no-store",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(input),
    })

    const payload = (await response.json().catch(() => null)) as SubmitOrderResponse | null
    if (!response.ok) {
      return payload?.result ?? null
    }

    return payload?.result ?? null
  } catch (error) {
    console.error("Failed to submit market order:", safeStringError(error))
    return null
  }
}
