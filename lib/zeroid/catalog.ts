export const ZEROID_CIRCUITS = [
  {
    id: "sybil_nullifier",
    name: "Sybil nullifier",
    file: "zeroid/circuits/sybil_nullifier.circom",
    proves: "One unique (secret, appId) pair without revealing the secret",
    status: "circuit in repo · wasm not served",
  },
  {
    id: "age_check",
    name: "Age threshold",
    file: "zeroid/circuits/age_check.circom",
    proves: "userAge ≥ requiredAge without revealing age",
    status: "circuit in repo · wasm not served",
  },
  {
    id: "country_check",
    name: "Jurisdiction",
    file: "zeroid/circuits/country_check.circom",
    proves: "Membership / exclusion of a country code",
    status: "circuit in repo · wasm not served",
  },
  {
    id: "sanctions_check",
    name: "Sanctions exclusion",
    file: "zeroid/circuits/sanctions_check.circom",
    proves: "Not in a Merkle-set of restricted identifiers",
    status: "circuit in repo · wasm not served",
  },
  {
    id: "kyc_verifier",
    name: "Master verifier",
    file: "zeroid/circuits/kyc_verifier.circom",
    proves: "Composed Groth16 statement for the above",
    status: "circuit in repo · wasm not served",
  },
] as const

export const ZEROID_LEVELS = [
  { id: "L0", name: "Anonymous", proves: "Nothing. Default." },
  { id: "L1", name: "Pseudonymous", proves: "Unique nullifier for this app-id." },
  { id: "L2", name: "Age / jurisdiction", proves: "Threshold and country circuits. Not issued on this node." },
  { id: "L3", name: "Attested", proves: "Third-party attestation. Not issued on this node." },
  { id: "L4", name: "Sovereign", proves: "On-chain bond. RegisterIdentity is not in VeilVM v1 (actions 0–18)." },
] as const

export const BLOODSWORN_SIGNALS = [
  { id: "accuracy", name: "Prediction accuracy", live: false },
  { id: "uptime", name: "Validator uptime", live: false },
  { id: "liquidity", name: "Liquidity provision", live: false },
  { id: "infra", name: "Infrastructure health", live: false },
  { id: "fulfillment", name: "Contract fulfillment", live: false },
] as const
