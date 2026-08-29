import { NextResponse } from "next/server"
import { bindPassport } from "@/lib/zeroid/issuer"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  let body: { nullifier?: string; credentialHash?: string; wallet?: string; signature?: string }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return NextResponse.json({ ok: false, error: "invalid JSON" }, { status: 400 })
  }
  try {
    const out = await bindPassport({
      nullifier: String(body.nullifier || ""),
      credentialHash: String(body.credentialHash || ""),
      wallet: String(body.wallet || ""),
      signature: String(body.signature || ""),
    })
    return NextResponse.json({ ok: true, ...out })
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : String(err) }, { status: 400 })
  }
}
