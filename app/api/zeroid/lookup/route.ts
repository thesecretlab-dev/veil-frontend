import { NextResponse } from "next/server"
import { lookupNullifier } from "@/lib/zeroid/issuer"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const nullifier = url.searchParams.get("nullifier") || ""
  try {
    const out = await lookupNullifier(nullifier)
    return NextResponse.json({ ok: true, ...out })
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : String(err) }, { status: 400 })
  }
}
