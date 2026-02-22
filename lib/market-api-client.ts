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
  nativeNetwork?: "veil" | "polygon"
  routingFeeBps?: number
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

export async function fetchMarkets(): Promise<Market[]> {
  try {
    const response = await fetch("/api/markets", { cache: "no-store" })
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
