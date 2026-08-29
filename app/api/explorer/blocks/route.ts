import { NextResponse } from "next/server"
import { fetchRecentBlocks } from "@/lib/explorer/rpc"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const count = Number(url.searchParams.get("count") || 24)
  const fromRaw = url.searchParams.get("from")
  const from = fromRaw ? Number(fromRaw) : undefined
  try {
    const data = await fetchRecentBlocks(count, from)
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 })
  }
}
