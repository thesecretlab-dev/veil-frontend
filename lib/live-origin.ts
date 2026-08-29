import { NextResponse } from "next/server"

export function liveOrigin(): string {
  return (process.env.VEIL_LIVE_ORIGIN || "").trim().replace(/\/+$/, "")
}

export async function proxyFromLiveOrigin(request: Request, timeoutMs = 12000): Promise<NextResponse | null> {
  const origin = liveOrigin()
  if (!origin) return null
  const url = new URL(request.url)
  const target = `${origin}${url.pathname}${url.search}`
  try {
    const headers: Record<string, string> = { accept: "application/json" }
    const init: RequestInit = {
      method: request.method,
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
      headers,
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      headers["content-type"] = request.headers.get("content-type") || "application/json"
      init.body = await request.text()
    }
    const res = await fetch(target, init)
    const body = await res.text()
    return new NextResponse(body, {
      status: res.status,
      headers: { "content-type": res.headers.get("content-type") || "application/json" },
    })
  } catch {
    return null
  }
}
