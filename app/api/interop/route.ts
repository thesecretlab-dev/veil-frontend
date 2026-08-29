import { NextResponse } from "next/server"
import { probeStack } from "@/lib/stack-status"

export const dynamic = "force-dynamic"

export async function GET() {
  const stack = await probeStack()
  const checks = (stack.checks || []).map((c) => ({
    id: c.id,
    surface:
      c.id === "veilvm"
        ? "HyperSDK VeilVM"
        : c.id === "router"
          ? "Order router"
          : c.id === "companion"
            ? "Companion EVM anvil 31337"
            : c.id === "zeroid"
              ? "ZER0ID registry"
              : c.id === "mesh"
                ? "Mesh RPC"
                : c.id,
    ok: c.ok,
    detail: c.detail,
  }))
  return NextResponse.json({
    ok: stack.ok,
    local: true,
    height: stack.blockHeight ?? null,
    failed: stack.failed || [],
    checks,
    timestamp: stack.timestamp,
    note: "Local interop only. Companion is anvil 31337, not app-id 22207, not Fuji.",
  })
}
