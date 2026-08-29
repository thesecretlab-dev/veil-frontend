import { NextResponse } from "next/server"
import { publicCatalogOrigin } from "@/lib/runtime-profile"
import { probeStack } from "@/lib/stack-status"

export const dynamic = "force-dynamic"

export async function GET() {
  const stack = await probeStack()
  return NextResponse.json(stack, { status: stack.ok || publicCatalogOrigin() ? 200 : 503 })
}
