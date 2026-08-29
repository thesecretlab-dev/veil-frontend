import { NextResponse } from "next/server"
import { searchExplorer } from "@/lib/explorer/rpc"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q") || ""
  try {
    const hits = await searchExplorer(q)
    return NextResponse.json({ q, hits })
  } catch (err) {
    return NextResponse.json({ q, hits: [], error: String(err) })
  }
}
