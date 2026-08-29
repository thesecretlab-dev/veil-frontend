import { NextResponse } from "next/server"
import { issuePassport } from "@/lib/zeroid/issuer"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  let body: { commitment?: string; nullifier?: string; credentialHash?: string }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return NextResponse.json({ ok: false, error: "invalid JSON" }, { status: 400 })
  }
  try {
    const out = await issuePassport({
      commitment: String(body.commitment || ""),
      nullifier: String(body.nullifier || ""),
      credentialHash: String(body.credentialHash || ""),
    })
    return NextResponse.json({ ok: true, ...out })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const conflict = /already/i.test(message)
    return NextResponse.json({ ok: false, error: message }, { status: conflict ? 409 : 400 })
  }
}
