import { NextResponse } from "next/server"

import { getLatestTradeByUiId } from "@/lib/veil-market-service"

export const dynamic = "force-dynamic"

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const uiId = Number.parseInt(id, 10)

  if (Number.isNaN(uiId)) {
    return NextResponse.json({ error: "Invalid market id" }, { status: 400 })
  }

  const trade = await getLatestTradeByUiId(uiId)
  if (!trade) {
    return NextResponse.json({ trade: null })
  }

  return NextResponse.json({ trade })
}
