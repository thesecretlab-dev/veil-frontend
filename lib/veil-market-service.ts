import type { Market } from "@/lib/market-data"

type GammaMarket = {
  id: string
  question?: string
  conditionId?: string
  slug?: string
  description?: string
  outcomes?: string | string[]
  outcomePrices?: string | string[]
  endDate?: string
  image?: string
  icon?: string
  volume?: string | number
  volumeNum?: number
  volume24hr?: number
  liquidity?: string | number
  oneDayPriceChange?: number
  acceptingOrders?: boolean
  updatedAt?: string
  active?: boolean
  closed?: boolean
  clobTokenIds?: string | string[]
}

type CLOBLevel = {
  price: string
  size: string
}

type CLOBBook = {
  bids?: CLOBLevel[]
  asks?: CLOBLevel[]
}

type DataTrade = {
  transactionHash?: string
  price?: number | string
  side?: string
  outcome?: string
  timestamp?: number
}

type OrderBookRow = {
  price: string
  shares: number
  total: string
  type: "sell" | "buy" | "ask" | "bid" | "spread"
}

export type LatestTradeResult = {
  transactionHash: string
  price: number
  side: string
  outcome: string
  timestamp: number
}

const DEFAULT_GAMMA_API = "https://gamma-api.polymarket.com"
const DEFAULT_CLOB_API = "https://clob.polymarket.com"
const DEFAULT_DATA_API = "https://data-api.polymarket.com"
const GAMMA_CACHE_MS = 15_000

let cachedGamma: { expiresAt: number; markets: GammaMarket[] } | null = null

function apiBaseFromEnv(name: string, fallback: string): string {
  return (process.env[name] || fallback).replace(/\/+$/, "")
}

function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

function parseStringArray(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry))
  }
  if (typeof value === "string") {
    const parsed = safeJsonParse<unknown[]>(value, [])
    return parsed.map((entry) => String(entry))
  }
  return []
}

function parseNumberArray(value: string | string[] | undefined): number[] {
  const strings = parseStringArray(value)
  return strings.map((entry) => Number.parseFloat(entry)).filter((entry) => Number.isFinite(entry))
}

function parseTokenIds(value: string | string[] | undefined): string[] {
  return parseStringArray(value).filter((entry) => entry.length > 0)
}

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }
  return fallback
}

function toCents(price: number): number {
  const clamped = Math.min(Math.max(price, 0), 1)
  return Math.round(clamped * 100)
}

function formatDate(iso: string | undefined, fallback: string): string {
  if (!iso) {
    return fallback
  }
  const parsed = new Date(iso)
  if (Number.isNaN(parsed.getTime())) {
    return fallback
  }
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatVolume(value: number): string {
  if (!Number.isFinite(value) || value <= 0) {
    return "$0"
  }
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}b`
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}m`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}k`
  }
  return `$${value.toFixed(0)}`
}

function formatUsd(value: number): string {
  if (!Number.isFinite(value)) {
    return "$0"
  }
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function inferCategory(input: string): string {
  const lower = input.toLowerCase()

  // Politics — check FIRST so political markets never leak into other categories
  const politicsPatterns = [
    "election", "trump", "biden", "president", "congress", "senate", "governor",
    "democrat", "republican", "gop", "vote", "ballot", "impeach", "pardon",
    "supreme court", "scotus", "legislation", "bill pass", "veto",
    "political", "politician", "party nomina", "primary", "caucus",
    "kamala", "harris", "desantis", "newsom", "rfk", "vivek", "haley",
    "pelosi", "mcconnell", "schumer", "cabinet", "executive order",
    "immigration", "border", "tariff", "sanction", "nato", "un vote",
    "regime", "dictator", "coup", "martial law", "government shutdown",
    "debt ceiling", "state of the union", "midterm", "poll",
  ]
  if (politicsPatterns.some((p) => lower.includes(p))) {
    return "Politics"
  }

  // Sports
  const sportsPatterns = [
    "nba", "nfl", "mlb", "nhl", "mls", "soccer", "football", "basketball",
    "baseball", "hockey", "tennis", "f1", "formula 1", "ufc", "boxing",
    "olympics", "world cup", "premier league", "champions league",
    "super bowl", "playoffs", "championship", "mvp", "draft",
    "lakers", "celtics", "warriors", "yankees", "dodgers",
    "match", "game ", "season", "coach", "player",
  ]
  if (sportsPatterns.some((p) => lower.includes(p))) {
    return "Sports"
  }

  // Crypto — after politics so "Will Trump pump Bitcoin?" stays in Politics
  const cryptoPatterns = [
    "bitcoin", "btc", "ethereum", "eth ", "solana", "sol ", "crypto",
    "blockchain", "defi", "token", "coin", "nft", "web3",
    "binance", "coinbase", "dex", "swap", "airdrop", "halving",
    "stablecoin", "usdc", "usdt", "tether", "mining", "staking",
    "avalanche", "avax", "polygon", "matic", "cardano", "ada ",
    "dogecoin", "doge", "xrp", "ripple", "chainlink", "link ",
    "market cap", "all-time high", "ath", "bull run", "bear market",
  ]
  if (cryptoPatterns.some((p) => lower.includes(p))) {
    return "Crypto"
  }

  // Economy
  const economyPatterns = [
    "fed ", "federal reserve", "interest rate", "recession", "inflation",
    "gdp", "unemployment", "jobs report", "cpi", "ppi", "stock",
    "s&p", "nasdaq", "dow jones", "wall street", "ipo", "earnings",
    "housing", "real estate", "oil price", "gas price", "commodity",
  ]
  if (economyPatterns.some((p) => lower.includes(p))) {
    return "Economy"
  }

  return "World"
}

function stableUiId(input: string): number {
  let hash = 2166136261
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  const positive = hash >>> 0
  return (positive % 900_000_000) + 100_000_000
}

async function fetchGammaMarkets(): Promise<GammaMarket[]> {
  const now = Date.now()
  if (cachedGamma && cachedGamma.expiresAt > now) {
    return cachedGamma.markets
  }

  const gammaBase = apiBaseFromEnv("POLYMARKET_GAMMA_API", DEFAULT_GAMMA_API)
  const url = new URL("/markets", gammaBase)
  url.searchParams.set("active", "true")
  url.searchParams.set("closed", "false")
  url.searchParams.set("limit", process.env.POLYMARKET_MARKETS_LIMIT || "80")

  try {
    const response = await fetch(url.toString(), { cache: "no-store" })
    if (!response.ok) {
      return []
    }
    const payload = (await response.json()) as unknown
    const markets = Array.isArray(payload) ? (payload as GammaMarket[]) : []
    cachedGamma = { expiresAt: now + GAMMA_CACHE_MS, markets }
    return markets
  } catch {
    return []
  }
}

function mapGammaToMarket(market: GammaMarket): Market {
  const outcomes = parseStringArray(market.outcomes)
  const prices = parseNumberArray(market.outcomePrices)
  const yesLabel = outcomes[0] || "Yes"
  const noLabel = outcomes[1] || "No"

  const derivedYes = prices[0]
  const derivedNo = prices[1]
  const yesPrice = toCents(Number.isFinite(derivedYes) ? derivedYes : 0.5)
  const noPrice = toCents(Number.isFinite(derivedNo) ? derivedNo : 1 - yesPrice / 100)

  const volumeRaw = asNumber(market.volumeNum, asNumber(market.volume, 0))
  const categorySeed = `${market.question || ""} ${market.slug || ""}`
  const stableSeed = market.conditionId || market.id || market.slug || market.question || String(Math.random())

  return {
    id: stableUiId(stableSeed),
    title: market.question || "Untitled market",
    category: inferCategory(categorySeed),
    type: outcomes.length > 2 ? "categorical" : "binary",
    yesPrice,
    noPrice,
    volume: formatVolume(volumeRaw),
    volume24h: formatVolume(asNumber(market.volume24hr, 0)),
    liquidity: formatVolume(asNumber(market.liquidity, 0)),
    change24h: asNumber(market.oneDayPriceChange, 0) * 100,
    updatedAt: market.updatedAt,
    status: market.closed ? "closed" : market.acceptingOrders === false ? "closed" : "active",
    sourceName: "Polymarket",
    sourceUrl: market.slug ? `https://polymarket.com/event/${market.slug}` : "https://polymarket.com",
    marketSlug: market.slug,
    endDate: formatDate(market.endDate, "TBD"),
    image: market.icon || market.image || "MKT",
    details: {
      description: market.description || "Live Polymarket market data.",
      outcomes: {
        yes: { label: yesLabel, price: yesPrice / 100 },
        no: { label: noLabel, price: noPrice / 100 },
      },
      orderBook: [],
    },
  }
}

function toOrderRow(level: CLOBLevel, type: "sell" | "buy" | "ask" | "bid"): OrderBookRow {
  const price = asNumber(level.price, 0)
  const shares = Math.max(Math.round(asNumber(level.size, 0)), 0)
  const total = shares * price

  return {
    price: `${Math.round(price * 100)}c`,
    shares,
    total: formatUsd(total),
    type,
  }
}

function buildOrderBook(book: CLOBBook): OrderBookRow[] {
  const asks = [...(book.asks || [])].sort((a, b) => asNumber(a.price, 0) - asNumber(b.price, 0)).slice(0, 3)
  const bids = [...(book.bids || [])].sort((a, b) => asNumber(b.price, 0) - asNumber(a.price, 0)).slice(0, 3)

  const rows: OrderBookRow[] = []
  asks.forEach((ask, index) => {
    rows.push(toOrderRow(ask, index === asks.length - 1 ? "ask" : "sell"))
  })

  const bestBid = bids.length > 0 ? asNumber(bids[0].price, 0) : 0
  const bestAsk = asks.length > 0 ? asNumber(asks[0].price, 0) : 0
  if (bestBid > 0 && bestAsk > 0) {
    rows.push({
      price: `${Math.round(((bestBid + bestAsk) / 2) * 100)}c`,
      shares: 0,
      total: "$0",
      type: "spread",
    })
  }

  bids.forEach((bid, index) => {
    rows.push(toOrderRow(bid, index === 0 ? "bid" : "buy"))
  })

  return rows
}

async function fetchCLOBBook(tokenId: string): Promise<CLOBBook | null> {
  const clobBase = apiBaseFromEnv("POLYMARKET_CLOB_API", DEFAULT_CLOB_API)
  const url = new URL("/book", clobBase)
  url.searchParams.set("token_id", tokenId)

  try {
    const response = await fetch(url.toString(), { cache: "no-store" })
    if (!response.ok) {
      return null
    }
    return (await response.json()) as CLOBBook
  } catch {
    return null
  }
}

async function findGammaMarketByUiId(uiId: number): Promise<GammaMarket | null> {
  const markets = await fetchGammaMarkets()
  for (const market of markets) {
    const stableSeed = market.conditionId || market.id || market.slug || market.question
    if (!stableSeed) {
      continue
    }
    if (stableUiId(stableSeed) === uiId) {
      return market
    }
  }
  return null
}

export async function getMergedMarkets(): Promise<Market[]> {
  const gammaMarkets = await fetchGammaMarkets()
  if (gammaMarkets.length === 0) {
    return []
  }

  return [...gammaMarkets]
    .sort((a, b) => asNumber(b.volume24hr, 0) - asNumber(a.volume24hr, 0))
    .map((market) => mapGammaToMarket(market))
}

export async function getMergedMarketByUiId(uiId: number): Promise<Market | null> {
  const gamma = await findGammaMarketByUiId(uiId)
  if (!gamma) {
    return null
  }

  const mapped = mapGammaToMarket(gamma)
  const tokenIds = parseTokenIds(gamma.clobTokenIds)
  if (tokenIds.length === 0) {
    return mapped
  }

  const book = await fetchCLOBBook(tokenIds[0])
  if (!book) {
    return mapped
  }

  return {
    ...mapped,
    details: {
      ...mapped.details,
      orderBook: buildOrderBook(book),
    },
  }
}

export async function getLatestTradeByUiId(uiId: number): Promise<LatestTradeResult | null> {
  const gamma = await findGammaMarketByUiId(uiId)
  if (!gamma?.conditionId) {
    return null
  }

  const dataBase = apiBaseFromEnv("POLYMARKET_DATA_API", DEFAULT_DATA_API)
  const url = new URL("/trades", dataBase)
  url.searchParams.set("market", gamma.conditionId)
  url.searchParams.set("limit", "1")

  try {
    const response = await fetch(url.toString(), { cache: "no-store" })
    if (!response.ok) {
      return null
    }

    const payload = (await response.json()) as unknown
    if (!Array.isArray(payload) || payload.length === 0) {
      return null
    }

    const trade = payload[0] as DataTrade
    const txHash = trade.transactionHash || ""
    if (!txHash) {
      return null
    }

    return {
      transactionHash: txHash,
      price: asNumber(trade.price, 0),
      side: trade.side || "",
      outcome: trade.outcome || "",
      timestamp: asNumber(trade.timestamp, 0),
    }
  } catch {
    return null
  }
}
