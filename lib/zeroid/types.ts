export const ZEROID_TYPE = "8004"
export const ZEROID_APP_ID = 22207
export const ZEROID_STORAGE_KEY = "veil:onboard:zeroid-passport-v1"

export type IssuedPassport = {
  version: "1"
  passport_id: string
  type: string
  appId: string
  commitment: string
  nullifier: string
  credentialHash: string
  wallet: string
  issuedAt: string
  verified_at: string
  verification_proof: string
  issuerSig: string
  bindSig: string
  bindTx: string
  onChain: boolean
  issueTx: string
  registry: string
  binding: string
  inCircuit: string
  note: string
}
