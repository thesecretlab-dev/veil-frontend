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
  let body: { to?: string; amount?: number } = {}
  try {
    body = (await request.json()) as typeof body
  } catch {
    body = {}
  }
  const headers: Record<string, string> = { "content-type": "application/json" }
  const s = secret()
  if (s) {
    headers["x-relay-secret"] = s
    headers.authorization = `Bearer ${s}`
  }
  try {
    const res = await fetch(`${LOCAL_ROUTER}/native/faucet`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        to: body.to || "",
        amount: typeof body.amount === "number" ? body.amount : 25_000,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(60_000),
    })
    const json = await res.json().catch(() => ({}))
    return NextResponse.json(json, { status: res.status })
  } catch (err) {
    return NextResponse.json(
      { accepted: false, error: err instanceof Error ? err.message : "faucet unreachable" },
      { status: 502 },
    )
  }
}
