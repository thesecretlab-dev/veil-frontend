import { NextResponse } from "next/server"
import type { MeshLane } from "@/lib/mesh/config"
import { meshCorsHeaders, meshGate, meshJsonRpc } from "@/lib/mesh/proxy"

export const dynamic = "force-dynamic"

const LANES = new Set<MeshLane>(["veil", "core", "indexer", "evm"])

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: meshCorsHeaders() })
}

export async function POST(request: Request, context: { params: Promise<{ lane: string }> }) {
  const { lane } = await context.params
  if (!LANES.has(lane as MeshLane)) {
    return NextResponse.json({ error: `unknown lane ${lane}` }, { status: 404, headers: meshCorsHeaders() })
  }
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400, headers: meshCorsHeaders() })
  }
  const gate = meshGate(request, lane as MeshLane, payload)
  if (!gate.ok) {
    return NextResponse.json(
      { error: gate.error, jsonrpc: "2.0", id: null, code: gate.code },
      { status: gate.status, headers: meshCorsHeaders() },
    )
  }
  try {
    const json = await meshJsonRpc(lane as MeshLane, payload, 12000)
    return NextResponse.json(json, { headers: meshCorsHeaders() })
  } catch (err) {
    return NextResponse.json(
      { jsonrpc: "2.0", id: null, error: { code: -32000, message: String(err instanceof Error ? err.message : err) } },
      { status: 502, headers: meshCorsHeaders() },
    )
  }
}
