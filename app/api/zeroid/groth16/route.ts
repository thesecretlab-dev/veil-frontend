import { NextResponse } from "next/server"
import { proxyFromLiveOrigin } from "@/lib/live-origin"
import { probeGroth16 } from "@/lib/zeroid/groth16"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const proxied = await proxyFromLiveOrigin(request)
  if (proxied) return proxied
  const groth = await probeGroth16()
  return NextResponse.json({
    product: "ZER0ID",
    local: true,
    companionChainId: groth.companionChainId,
    groth16WasmServed: groth.groth16WasmServed,
    circuits: groth.circuits,
    gate: groth.gate,
    gateLive: groth.gateLive,
    artifacts: groth.artifacts,
    note: groth.note,
  })
}
