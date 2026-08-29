import { NextResponse } from "next/server"
import { fetchDecodedBlock } from "@/lib/explorer/rpc"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const heightRaw = url.searchParams.get("height")
  const id = (url.searchParams.get("id") || "").trim()
  const height = heightRaw != null && heightRaw !== "" ? Number(heightRaw) : undefined
  try {
    const block = await fetchDecodedBlock({ height, id: id || undefined })
    return NextResponse.json(block)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 404 })
  }
}
