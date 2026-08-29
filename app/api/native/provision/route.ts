import { NextResponse } from "next/server"
import { liveOrigin } from "@/lib/live-origin"
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
  if (liveOrigin() || process.env.VERCEL) {
    return NextResponse.json({ accepted: false, error: "provision is local only" }, { status: 403 })
  }
  let body: { role?: string; amount?: number } = {}
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
    const res = await fetch(`${LOCAL_ROUTER}/native/provision`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        role: body.role || "mesh",
        amount: typeof body.amount === "number" ? body.amount : 25_000,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(60_000),
    })
    const json = await res.json().catch(() => ({}))
    return NextResponse.json(json, { status: res.status })
  } catch (err) {
    return NextResponse.json(
      { accepted: false, error: err instanceof Error ? err.message : "provision unreachable" },
      { status: 502 },
    )
  }
}
