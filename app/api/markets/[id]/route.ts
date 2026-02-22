import { NextResponse } from "next/server"

import { getMergedMarketByUiId } from "@/lib/veil-market-service"

export const dynamic = "force-dynamic"

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const uiId = Number.parseInt(id, 10)

  if (Number.isNaN(uiId)) {
    return NextResponse.json({ error: "Invalid market id" }, { status: 400 })
  }

  const market = await getMergedMarketByUiId(uiId)
  if (!market) {
    return NextResponse.json({ error: "Market not found" }, { status: 404 })
  }

  return NextResponse.json({ market })
}
