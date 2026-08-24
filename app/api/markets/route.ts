import { NextResponse } from "next/server"

import { getMergedMarkets } from "@/lib/veil-market-service"

export const dynamic = "force-dynamic"

function orderBase(): string {
  const localDefault = process.env.NODE_ENV === "production" ? "" : "http://127.0.0.1:9098"
  return (process.env.VEIL_ORDER_API_BASE || localDefault).trim().replace(/\/+$/, "")
}

function relaySecret(): string {
  return (
    process.env.VEIL_ORDER_API_KEY ||
    process.env.ORDER_ROUTER_RELAY_SECRET ||
    (process.env.NODE_ENV === "production" ? "" : "local-dev-secret")
  ).trim()
}

export async function GET() {
  const markets = await getMergedMarkets()
  return NextResponse.json({ markets })
}

export async function POST(request: Request) {
  const base = orderBase()
  if (!base) {
    return NextResponse.json({ error: "VEIL_ORDER_API_BASE not set" }, { status: 503 })
  }
  let body: { question?: string }
  try {
    body = (await request.json()) as { question?: string }
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
  const question = String(body.question || "").trim()
  if (!question) {
    return NextResponse.json({ error: "question required" }, { status: 400 })
  }
  const secret = relaySecret()
  const headers: Record<string, string> = { "content-type": "application/json" }
  if (secret) {
    headers["x-relay-secret"] = secret
    headers.authorization = `Bearer ${secret}`
  }
  const res = await fetch(`${base}/native/create-market`, {
    method: "POST",
    headers,
    body: JSON.stringify({ question, outcomes: 2, creatorBond: 1 }),
    cache: "no-store",
  })
  const payload = await res.json().catch(() => ({}))
  return NextResponse.json(payload, { status: res.status })
}
