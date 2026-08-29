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
  let body: { amount0?: number; amount1?: number; actor?: string } = {}
  try {
    body = (await request.json()) as typeof body
  } catch {
    return NextResponse.json({ accepted: false, error: "invalid JSON" }, { status: 400 })
  }
  const amount0 = Math.floor(Number(body.amount0) || 0)
  const amount1 = Math.floor(Number(body.amount1) || 0)
  if (amount0 <= 0 || amount1 <= 0) {
    return NextResponse.json({ accepted: false, error: "amount0 and amount1 required" }, { status: 400 })
  }
  const headers: Record<string, string> = { "content-type": "application/json" }
  const s = secret()
  if (s) {
    headers["x-relay-secret"] = s
    headers.authorization = `Bearer ${s}`
  }
  try {
    const res = await fetch(`${LOCAL_ROUTER}/native/add-liquidity`, {
      method: "POST",
      headers,
      body: JSON.stringify({ amount0, amount1, asset0: 0, asset1: 1, minLp: 1, actor: body.actor || "1" }),
      cache: "no-store",
      signal: AbortSignal.timeout(60_000),
    })
    const json = await res.json().catch(() => ({}))
    return NextResponse.json(json, { status: res.status })
  } catch (err) {
    return NextResponse.json(
      { accepted: false, error: err instanceof Error ? err.message : "add-liquidity unreachable" },
      { status: 502 },
    )
  }
}
