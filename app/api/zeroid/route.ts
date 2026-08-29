import { NextResponse } from "next/server"
import { LOCAL_COMPANION_CHAIN_ID } from "@/lib/local-runtime"
import { BLOODSWORN_SIGNALS, ZEROID_CIRCUITS, ZEROID_LEVELS } from "@/lib/zeroid/catalog"
import { registryStats } from "@/lib/zeroid/issuer"

export const dynamic = "force-dynamic"

export async function GET() {
  const stats = await registryStats()
  return NextResponse.json({
    product: "ZER0ID",
    operator: "THE SECRET LAB",
    local: true,
    credentialType: 8004,
    appId: 22207,
    note: "Issuer HMAC + companion nullifier registry on anvil 31337. Tagged SHA-256 matches VeilVM digest-binding. Groth16 circuits in-repo; wasm/zkey not served. No KYC camera, no OFAC live feed.",
    circuits: ZEROID_CIRCUITS,
    levels: ZEROID_LEVELS,
    bloodsworn: {
      signals: BLOODSWORN_SIGNALS,
      nativeActions: { register: 37, update: 38, inV1: false },
      oath: "/app/oath",
    },
    veilvm: {
      registerIdentity: false,
      nativeActions: "0–18. Identity register is spec-only.",
    },
    companion: {
      chainId: LOCAL_COMPANION_CHAIN_ID,
      registry: stats.registry,
      deployed: stats.deployed,
      issued: stats.fileCount,
      chainCount: stats.chainCount,
      issuer: stats.issuer,
      hmac: stats.hmac,
      artifact: "veil-contracts/contracts/identity/ZeroIdRegistry.sol",
      groth16Gate: "ZeroIdGate compiled; not used until wasm/zkey are served",
    },
  })
}
