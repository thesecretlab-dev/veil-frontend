import { NextResponse } from "next/server"
import { fetchStatus } from "@/lib/explorer/rpc"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const status = await fetchStatus()
    return NextResponse.json(status)
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 502 })
  }
}
