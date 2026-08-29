import { NextResponse } from "next/server"
import { fetchAddress } from "@/lib/explorer/rpc"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id") || ""
  if (!id.trim()) return NextResponse.json({ error: "missing id" }, { status: 400 })
  try {
    const data = await fetchAddress(id)
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 404 })
  }
}
