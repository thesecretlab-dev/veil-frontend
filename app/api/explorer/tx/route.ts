import { NextResponse } from "next/server"
import { fetchTx } from "@/lib/explorer/rpc"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id") || ""
  if (!id.trim()) return NextResponse.json({ error: "missing id" }, { status: 400 })
  try {
    const tx = await fetchTx(id)
    return NextResponse.json(tx)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 404 })
  }
}
