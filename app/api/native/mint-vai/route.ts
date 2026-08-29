import { NextResponse } from "next/server"
import { LOCAL_ROUTER } from "@/lib/local-runtime"
import { proxyFromLiveOrigin } from "@/lib/live-origin"

export const dynamic = "force-dynamic"

function secret() {
  return (
    process.env.VEIL_ORDER_API_KEY ||
    process.env.ORDER_ROUTER_RELAY_SECRET ||
    (process.env.NODE_ENV === "production" ? "" : "local-dev-secret")
  ).trim()
}

export async function POST(request: Request) {
  const proxied = await proxyFromLiveOrigin(request, 60_000)
  if (proxied) return proxied

  let body: { to?: string; amount?: number } = {}
  try {
    body = (await request.json()) as typeof body
  } catch {
    body = {}
  }
  const amount = typeof body.amount === "number" && Number.isFinite(body.amount) ? Math.floor(body.amount) : 1_000
  if (amount <= 0 || amount > 100_000) {
    return NextResponse.json({ accepted: false, error: "amount must be 1–100000 (epoch mint limit)" }, { status: 400 })
  }
  const headers: Record<string, string> = { "content-type": "application/json" }
  const s = secret()
  if (s) {
    headers["x-relay-secret"] = s
    headers.authorization = `Bearer ${s}`
  }
  try {
    const res = await fetch(`${LOCAL_ROUTER}/native/mint-vai`, {
      method: "POST",
      headers,
      body: JSON.stringify({ to: body.to || "", amount }),
      cache: "no-store",
      signal: AbortSignal.timeout(60_000),
    })
    const json = await res.json().catch(() => ({}))
    return NextResponse.json(json, { status: res.status })
  } catch (err) {
    return NextResponse.json(
      { accepted: false, error: err instanceof Error ? err.message : "mint router unreachable" },
      { status: 502 },
    )
  }
}
