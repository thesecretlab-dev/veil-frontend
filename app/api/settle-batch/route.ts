import { NextResponse } from "next/server"

const SETTLE_TIMEOUT_MS = 90_000

export async function POST(request: Request) {
  const localDefault = process.env.NODE_ENV === "production" ? "" : "http://127.0.0.1:9098"
  const base = (process.env.VEIL_ORDER_API_BASE || localDefault).trim().replace(/\/+$/, "")
  if (!base) {
    return NextResponse.json({ error: "order router not configured" }, { status: 503 })
  }

  const body = await request.json().catch(() => ({}))
  const apiKey = (
    process.env.VEIL_ORDER_API_KEY ||
    process.env.ORDER_ROUTER_RELAY_SECRET ||
    (process.env.NODE_ENV === "production" ? "" : "local-dev-secret")
  ).trim()

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), SETTLE_TIMEOUT_MS)
  try {
    const response = await fetch(`${base}/native/settle-batch`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
        "x-relay-secret": apiKey,
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: controller.signal,
    })
    const payload = await response.json().catch(() => ({}))
    return NextResponse.json(payload, { status: response.status })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: message }, { status: 502 })
  } finally {
    clearTimeout(timeout)
  }
}
