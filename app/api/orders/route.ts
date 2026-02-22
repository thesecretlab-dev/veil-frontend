import { NextResponse } from "next/server"

type SubmitOrderBody = {
  marketId?: string
  side?: "buy" | "sell"
  outcome?: "yes" | "no"
  amountUsd?: number
  walletAddress?: string
  nativeNetwork?: "veil" | "polygon"
  routingFeeBps?: number
}

type NormalizedOrderResult = {
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

const ORDER_TIMEOUT_MS = 15_000

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }
  return {}
}

function asString(value: unknown): string {
  if (typeof value === "string") {
    return value
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }
  return ""
}

function asNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }
  if (typeof value === "string" && value.length > 0) {
    const parsed = Number.parseFloat(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
    const timestamp = Date.parse(value)
    if (Number.isFinite(timestamp)) {
      return timestamp
    }
  }
  return 0
}

function firstString(source: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = asString(source[key]).trim()
    if (value.length > 0) {
      return value
    }
  }
  return ""
}

function firstNumber(source: Record<string, unknown>, keys: string[]): number {
  for (const key of keys) {
    const value = asNumber(source[key])
    if (value !== 0) {
      return value
    }
  }
  return 0
}

function firstBoolean(source: Record<string, unknown>, keys: string[]): boolean | null {
  for (const key of keys) {
    const value = source[key]
    if (typeof value === "boolean") {
      return value
    }
    if (typeof value === "string") {
      const lower = value.toLowerCase()
      if (lower === "true") return true
      if (lower === "false") return false
    }
    if (typeof value === "number") {
      if (value === 1) return true
      if (value === 0) return false
    }
  }
  return null
}

function firstNullableBoolean(source: Record<string, unknown>, keys: string[]): boolean | null {
  return firstBoolean(source, keys)
}

function normalizeOrderResult(payload: unknown): NormalizedOrderResult {
  const root = asRecord(payload)
  const nested = asRecord(root.result)
  const source = Object.keys(nested).length > 0 ? nested : root

  const status = firstString(source, ["status", "state", "result"]) || "unknown"
  const message = firstString(source, ["message", "detail", "reason", "error"])
  const orderId = firstString(source, ["orderId", "order_id", "id"])
  const veilTxHash = firstString(source, ["veilTxHash", "executionTxHash", "txHash", "transactionHash"])
  const oracleTxHash = firstString(source, ["oracleTxHash", "oracleTransactionHash", "referenceTxHash"])
  const errorCode = firstString(source, ["errorCode", "error_code", "code"])
  const fillPrice = firstNumber(source, ["fillPrice", "price", "avgPrice"])
  const timestamp = firstNumber(source, ["timestamp", "time", "createdAt", "updatedAt"])
  const requiredVeil = firstNumber(source, ["requiredVeil", "requiredAmount", "minRequiredBalance"])
  const balanceVeil = firstNumber(source, ["balanceVeil", "walletBalance", "balance"])
  const nativeNetwork = firstString(source, ["nativeNetwork", "marketNetwork"]) || "unknown"
  const settlementNetwork = firstString(source, ["settlementNetwork", "executionNetwork", "route"]) || "unknown"
  const routingFeeBps = firstNumber(source, ["routingFeeBps", "feeBps", "routingFee"])
  const liquiditySufficient = firstNullableBoolean(source, ["liquiditySufficient", "hasLiquidity", "routeAvailable"])

  const explicitAccepted = firstBoolean(source, ["accepted", "isAccepted", "ok"])
  const impliedAccepted =
    status.toLowerCase() === "accepted" || status.toLowerCase() === "filled" || status.toLowerCase() === "executed"

  return {
    accepted: explicitAccepted ?? impliedAccepted ?? veilTxHash.length > 0,
    status,
    message,
    orderId,
    veilTxHash,
    oracleTxHash,
    errorCode,
    fillPrice,
    timestamp,
    requiredVeil,
    balanceVeil,
    nativeNetwork,
    settlementNetwork,
    routingFeeBps,
    liquiditySufficient,
  }
}

function invalidBodyResult(message: string): NormalizedOrderResult {
  return {
    accepted: false,
    status: "invalid_request",
    message,
    orderId: "",
    veilTxHash: "",
    oracleTxHash: "",
    errorCode: "INVALID_REQUEST",
    fillPrice: 0,
    timestamp: Date.now(),
    requiredVeil: 0,
    balanceVeil: 0,
    nativeNetwork: "unknown",
    settlementNetwork: "unknown",
    routingFeeBps: 0,
    liquiditySufficient: null,
  }
}

function unconfiguredResult(nativeNetwork: string, routingFeeBps: number): NormalizedOrderResult {
  return {
    accepted: false,
    status: "unconfigured",
    message: "VEIL order router is not configured. Set VEIL_ORDER_API_BASE.",
    orderId: "",
    veilTxHash: "",
    oracleTxHash: "",
    errorCode: "ORDER_ROUTER_UNCONFIGURED",
    fillPrice: 0,
    timestamp: Date.now(),
    requiredVeil: 0,
    balanceVeil: 0,
    nativeNetwork,
    settlementNetwork: nativeNetwork === "polygon" ? "veil_or_polygon" : "veil",
    routingFeeBps,
    liquiditySufficient: null,
  }
}

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  let body: SubmitOrderBody
  try {
    body = (await request.json()) as SubmitOrderBody
  } catch {
    return NextResponse.json({ result: invalidBodyResult("Invalid JSON body.") }, { status: 400 })
  }

  const marketId = asString(body.marketId).trim()
  const side = body.side
  const outcome = body.outcome
  const amountUsd = typeof body.amountUsd === "number" ? body.amountUsd : Number.NaN
  const walletAddress = asString(body.walletAddress).trim()
  const nativeNetwork = body.nativeNetwork === "polygon" ? "polygon" : "veil"
  const routingFeeBps = typeof body.routingFeeBps === "number" && Number.isFinite(body.routingFeeBps) ? body.routingFeeBps : 0

  if (!marketId || (side !== "buy" && side !== "sell") || (outcome !== "yes" && outcome !== "no")) {
    return NextResponse.json(
      { result: invalidBodyResult("marketId, side, and outcome are required.") },
      { status: 400 },
    )
  }

  if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
    return NextResponse.json({ result: invalidBodyResult("amountUsd must be a positive number.") }, { status: 400 })
  }

  if (!walletAddress) {
    return NextResponse.json(
      { result: invalidBodyResult("walletAddress is required for VEIL order execution.") },
      { status: 400 },
    )
  }

  const localDefault = process.env.NODE_ENV === "production" ? "" : "http://127.0.0.1:9098"
  const base = (process.env.VEIL_ORDER_API_BASE || localDefault).trim().replace(/\/+$/, "")
  if (!base) {
    return NextResponse.json({ result: unconfiguredResult(nativeNetwork, routingFeeBps) }, { status: 503 })
  }

  const upstreamUrl = `${base}/orders`
  const headers: Record<string, string> = {
    "content-type": "application/json",
  }

  const apiKey = (process.env.VEIL_ORDER_API_KEY || "").trim()
  if (apiKey) {
    headers.authorization = `Bearer ${apiKey}`
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), ORDER_TIMEOUT_MS)

  try {
    const response = await fetch(upstreamUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        marketId,
        side,
        outcome,
        amountUsd,
        walletAddress,
        nativeNetwork,
        routingFeeBps,
      }),
      cache: "no-store",
      signal: controller.signal,
    })

    clearTimeout(timeout)
    const payload = await response.json().catch(() => ({}))
    const result = normalizeOrderResult(payload)
    const mergedResult: NormalizedOrderResult = {
      ...result,
      nativeNetwork: result.nativeNetwork === "unknown" ? nativeNetwork : result.nativeNetwork,
      settlementNetwork:
        result.settlementNetwork === "unknown"
          ? nativeNetwork === "polygon"
            ? "veil_or_polygon"
            : "veil"
          : result.settlementNetwork,
      routingFeeBps: result.routingFeeBps > 0 ? result.routingFeeBps : routingFeeBps,
    }
    const status = response.ok ? 200 : response.status
    return NextResponse.json({ result: mergedResult }, { status })
  } catch (error) {
    clearTimeout(timeout)
    const isAbort = error instanceof Error && error.name === "AbortError"
    return NextResponse.json(
      {
        result: {
          accepted: false,
          status: isAbort ? "timeout" : "request_failed",
          message: isAbort
            ? `VEIL order request timed out after ${ORDER_TIMEOUT_MS}ms.`
            : "Failed to reach VEIL order router.",
          orderId: "",
          veilTxHash: "",
          oracleTxHash: "",
          errorCode: isAbort ? "ORDER_ROUTER_TIMEOUT" : "ORDER_ROUTER_UNREACHABLE",
          fillPrice: 0,
          timestamp: Date.now(),
          requiredVeil: 0,
          balanceVeil: 0,
          nativeNetwork,
          settlementNetwork: nativeNetwork === "polygon" ? "veil_or_polygon" : "veil",
          routingFeeBps,
          liquiditySufficient: null,
        },
      },
      { status: 502 },
    )
  }
}
