/**
 * Canonical runtime profile. Local ≠ Fuji ≠ mainnet.
 * Fuji/mainnet are parked in this tree: setting VEIL_PROFILE to them fails closed
 * until a future ceremony fills endpoints. Do not mix chains.
 */

export const VEIL_PROFILES = ["local", "fuji", "mainnet"] as const
export type VeilProfile = (typeof VEIL_PROFILES)[number]

/** Lost hardened owner. Never deploy under this address. */
export const LOST_OWNER = "0xB9a05AFC8eff7eE6a84889Bb9C88A89eAA2f96af"

export const TSL_OPERATOR = "THE SECRET LAB"
export const TSL_CONTACT = "agent@thesecretlab.app"

export function runtimeProfile(): VeilProfile {
  const raw = (process.env.VEIL_PROFILE || "local").trim().toLowerCase()
  if (raw === "fuji" || raw === "mainnet") return raw
  return "local"
}

export function profileParked(profile: VeilProfile = runtimeProfile()): boolean {
  return profile !== "local"
}

export function profileClaims() {
  return {
    privateMempool: false,
    inCircuitMatching: false,
    publicExplorerDns: false,
    kycCamera: false,
    ofacLiveFeed: false,
    registerIdentity: false,
    groth16WasmServed: false,
    primaryStakeAvax2000: false,
    robinhoodChain: false,
    polymarketAsVeil: false,
  }
}

export function profilePublic() {
  const profile = runtimeProfile()
  return {
    profile,
    live: false,
    liveRequested: process.env.VEIL_LIVE === "1",
    local: profile === "local",
    parked: profileParked(profile),
    operator: TSL_OPERATOR,
    contact: TSL_CONTACT,
    doNotDeployUnder: LOST_OWNER,
    includePolymarket: process.env.VEIL_INCLUDE_POLYMARKET === "1",
    claims: profileClaims(),
    notes: [
      "Local ≠ Fuji ≠ mainnet.",
      "VeilVM app-id 22207 is not an EVM chain id.",
      "Companion wallets talk to chain 31337.",
      "VTG2 is t≥2 locally. RPC ingest to the local producer is still plaintext.",
      "Groth16 shielded-ledger-v1 is digest-binding. Matching is not in-circuit.",
      "Public explorer DNS and Blockscout are not this chain.",
      "L1 validators are not 2000 AVAX primary stake (Etna ACP-77).",
      `Lost owner ${LOST_OWNER} is do-not-deploy-under.`,
    ],
  }
}

export function profileBannerText() {
  const profile = runtimeProfile()
  if (profile === "local") return "LOCAL TESTNET"
  return `${profile.toUpperCase()} PARKED`
}
