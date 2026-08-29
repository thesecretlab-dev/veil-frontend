import { existsSync, readFileSync } from "fs"
import { resolve } from "path"
import { LOCAL_COMPANION_CHAIN_ID, LOCAL_COMPANION_RPC } from "@/lib/local-runtime"

export type Groth16Probe = {
  groth16WasmServed: boolean
  companionChainId: number
  circuits: {
    kyc_verifier: { wasm: boolean; zkey: boolean; vkey: boolean; wasmUrl: string; zkeyUrl: string }
    sybil_nullifier: { wasm: boolean; wasmUrl: string }
  }
  gate: string
  gateLive: boolean
  artifacts: unknown
  note: string
}

export function groth16WasmOnDisk(cwd = process.cwd()): boolean {
  const pub = resolve(cwd, "public/circuits")
  return (
    (existsSync(resolve(pub, "kyc_verifier.wasm")) && existsSync(resolve(pub, "kyc_verifier_final.zkey"))) ||
    existsSync(resolve(pub, "sybil_nullifier_main.wasm"))
  )
}

export function liveGroth16Gate(): string {
  if (process.env.ZEROID_GATE) return process.env.ZEROID_GATE.trim()
  try {
    const doc = JSON.parse(
      readFileSync(resolve(process.cwd(), "../veilvm/scripts/companion-evm.addresses.json"), "utf8"),
    ) as { zeroidGate?: string; groth16Verifier?: string }
    return String(doc.zeroidGate || "")
  } catch {
    return ""
  }
}

export async function probeGroth16(): Promise<Groth16Probe> {
  const pub = resolve(process.cwd(), "public/circuits")
  const kycWasm = existsSync(resolve(pub, "kyc_verifier.wasm"))
  const kycZkey = existsSync(resolve(pub, "kyc_verifier_final.zkey"))
  const kycVkey = existsSync(resolve(pub, "kyc_verifier_verification_key.json"))
  const sybilWasm =
    existsSync(resolve(pub, "sybil_nullifier_main.wasm")) || existsSync(resolve(pub, "sybil_nullifier.wasm"))
  const served = (kycWasm && kycZkey) || sybilWasm
  let artifacts: unknown = null
  try {
    artifacts = JSON.parse(readFileSync(resolve(pub, "artifacts.json"), "utf8"))
  } catch {}
  const gate = liveGroth16Gate()
  let gateLive = false
  if (gate) {
    try {
      const res = await fetch(LOCAL_COMPANION_RPC, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_getCode", params: [gate, "latest"] }),
        cache: "no-store",
        signal: AbortSignal.timeout(2500),
      })
      const json = (await res.json()) as { result?: string }
      gateLive = Boolean(json.result && json.result !== "0x")
    } catch {}
  }
  return {
    groth16WasmServed: served,
    companionChainId: LOCAL_COMPANION_CHAIN_ID,
    circuits: {
      kyc_verifier: {
        wasm: kycWasm,
        zkey: kycZkey,
        vkey: kycVkey,
        wasmUrl: "/circuits/kyc_verifier.wasm",
        zkeyUrl: "/circuits/kyc_verifier_final.zkey",
      },
      sybil_nullifier: { wasm: sybilWasm, wasmUrl: "/circuits/sybil_nullifier_main.wasm" },
    },
    gate,
    gateLive,
    artifacts,
    note: served
      ? "Local Groth16 wasm/zkey served from /circuits. Setup is local, not a public ceremony. Not Fuji."
      : "Groth16 wasm/zkey not on disk yet. HMAC 8004 registry still issues L1 uniqueness.",
  }
}
