import { NextResponse } from "next/server"
import { meshCorsHeaders, meshStatus } from "@/lib/mesh/proxy"

export const dynamic = "force-dynamic"

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: meshCorsHeaders() })
}

export async function GET() {
  const status = await meshStatus()
  return NextResponse.json(status, {
    status: status.ok ? 200 : 503,
    headers: meshCorsHeaders(),
  })
}
