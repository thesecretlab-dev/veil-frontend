import { NextResponse } from "next/server"
import { probeStack } from "@/lib/stack-status"

export const dynamic = "force-dynamic"

export async function GET() {
  const stack = await probeStack()
  return NextResponse.json(stack)
}
