import { NextResponse } from "next/server"
import { fetchRecentTxs } from "@/lib/explorer/rpc"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const limit = Number(new URL(request.url).searchParams.get("limit") || 30)
  try {
    const data = await fetchRecentTxs(Math.min(50, Math.max(1, limit)))
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err), txs: [], scanned: 0 }, { status: 502 })
  }
}
