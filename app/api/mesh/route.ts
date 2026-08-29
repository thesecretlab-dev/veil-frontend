import { NextResponse } from "next/server"
import { meshCatalog } from "@/lib/mesh/config"
import { meshCorsHeaders } from "@/lib/mesh/proxy"

export const dynamic = "force-dynamic"

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: meshCorsHeaders() })
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const base = `${url.origin}/api/mesh`
  return NextResponse.json(meshCatalog(base), { headers: meshCorsHeaders() })
}
