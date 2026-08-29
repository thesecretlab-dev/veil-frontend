import { NextResponse } from "next/server"
import { verifyPassport } from "@/lib/zeroid/issuer"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ ok: false, error: "invalid JSON" }, { status: 400 })
  }
  const result = await verifyPassport(body)
  return NextResponse.json(result, { status: result.ok ? 200 : 400 })
}
