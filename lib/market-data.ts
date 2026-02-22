export interface Market {
  id: number
  title: string
  category: string
  type: "binary" | "sports" | "categorical"
  yesPrice: number
  noPrice: number
  volume: string
  endDate: string
  image: string
  sourceName?: string
  sourceUrl?: string
  marketSlug?: string
  status?: "active" | "closed"
  volume24h?: string
  liquidity?: string
  change24h?: number
  updatedAt?: string
  delayMinutes?: number
  minCrowdMet?: boolean
  fairPrice?: boolean
  details?: {
    description?: string
    sport?: {
      status: "LIVE" | "UPCOMING" | "FINAL"
      quarter?: string
      time?: string
      score?: { home: number; away: number }
      teams?: {
        home: { name: string; abbr: string; record?: string }
        away: { name: string; abbr: string; record?: string }
      }
      spreads?: { home: number; homePrice: number; away: number; awayPrice: number }
      totals?: { over: number; overPrice: number; under: number; underPrice: number }
    }
    outcomes?: {
      yes: { label: string; price: number }
      no: { label: string; price: number }
    }
    orderBook?: Array<{
      price: string
      shares: number
      total: string
      type: "sell" | "buy" | "ask" | "bid" | "spread"
    }>
  }
}
