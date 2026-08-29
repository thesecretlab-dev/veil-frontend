import { NextResponse } from "next/server"
import { LOCAL_ROUTER } from "@/lib/local-runtime"

export const dynamic = "force-dynamic"

function secret() {
  return (
    process.env.VEIL_ORDER_API_KEY ||
    process.env.ORDER_ROUTER_RELAY_SECRET ||
    (process.env.NODE_ENV === "production" ? "" : "local-dev-secret")
  ).trim()
}

export async function POST(request: Request) {
  let body: { amountIn?: number; assetIn?: number; assetOut?: number; minAmountOut?: number; actor?: string } = {}
  try {
    body = (await request.json()) as typeof body
  } catch {
    return NextResponse.json({ accepted: false, error: "invalid JSON" }, { status: 400 })
  }
  const amountIn = Math.floor(Number(body.amountIn) || 0)
  if (amountIn <= 0) {
    return NextResponse.json({ accepted: false, error: "amountIn required" }, { status: 400 })
  }
  const headers: Record<string, string> = { "content-type": "application/json" }
  const s = secret()
  if (s) {
    headers["x-relay-secret"] = s
    headers.authorization = `Bearer ${s}`
  }
  try {
    const res = await fetch(`${LOCAL_ROUTER}/native/swap`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        amountIn,
        assetIn: body.assetIn ?? 0,
        assetOut: body.assetOut ?? 1,
        minAmountOut: Math.floor(Number(body.minAmountOut) || 0),
        actor: body.actor || "1",
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(60_000),
    })
    const json = await res.json().catch(() => ({}))
    return NextResponse.json(json, { status: res.status })
  } catch (err) {
    return NextResponse.json(
      { accepted: false, error: err instanceof Error ? err.message : "swap unreachable" },
      { status: 502 },
    )
  }
}
