import { NextResponse } from "next/server"

import { getMergedMarkets } from "@/lib/veil-market-service"

export const dynamic = "force-dynamic"

export async function GET() {
  const markets = await getMergedMarkets()
  return NextResponse.json({ markets })
}
