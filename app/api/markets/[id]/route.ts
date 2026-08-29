import { NextResponse } from "next/server"

import { getMergedMarketByKey } from "@/lib/veil-market-service"

export const dynamic = "force-dynamic"

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const market = await getMergedMarketByKey(id)
  if (!market) {
    return NextResponse.json({ error: "Market not found" }, { status: 404 })
  }

  return NextResponse.json({ market })
}
