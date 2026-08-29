import { TAG_COMMIT, TAG_CRED, TAG_NULL, hexToBytes, taggedSha256Hex, u64be } from "./tagged"
import { ZEROID_APP_ID, ZEROID_STORAGE_KEY, ZEROID_TYPE, type IssuedPassport } from "./types"

export { ZEROID_APP_ID, ZEROID_STORAGE_KEY, ZEROID_TYPE }
export type LocalPassport = IssuedPassport

function asBool(value: unknown): boolean {
  return value === true || value === "true"
}

async function readJson(res: Response): Promise<Record<string, unknown>> {
  const text = await res.text()
  try {
    return JSON.parse(text) as Record<string, unknown>
  } catch {
    throw new Error(text.slice(0, 220) || `request failed ${res.status}`)
  }
}

export function loadPassport(): LocalPassport | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(ZEROID_STORAGE_KEY)
    if (!raw) return null
    const p = JSON.parse(raw) as Partial<LocalPassport>
    if (!p.nullifier && !p.verification_proof) return null
    return {
      version: "1",
      passport_id: p.passport_id || ZEROID_TYPE,
      type: p.type || ZEROID_TYPE,
      appId: p.appId || String(ZEROID_APP_ID),
      commitment: p.commitment || "",
      nullifier: p.nullifier || p.verification_proof || "",
      credentialHash: p.credentialHash || p.verification_proof || "",
      wallet: p.wallet || "",
      issuedAt: p.issuedAt || p.verified_at || "",
      verified_at: p.verified_at || p.issuedAt || "",
      verification_proof: p.verification_proof || p.credentialHash || p.nullifier || "",
      issuerSig: p.issuerSig || "",
      bindSig: p.bindSig || "",
      bindTx: p.bindTx || "",
      onChain: asBool(p.onChain),
      issueTx: p.issueTx || "",
      registry: p.registry || "",
      binding: p.binding || "tagged-sha256",
      inCircuit: p.inCircuit || "false",
      note: p.note || "",
    }
  } catch {
    return null
  }
}

export function savePassport(p: LocalPassport) {
  window.localStorage.setItem(ZEROID_STORAGE_KEY, JSON.stringify(p))
}

export function revokePassport() {
  window.localStorage.removeItem(ZEROID_STORAGE_KEY)
}

export async function mintLocalPassport(wallet = ""): Promise<LocalPassport> {
  const secret = crypto.getRandomValues(new Uint8Array(32))
  const commitment = await taggedSha256Hex(TAG_COMMIT, [secret])
  const nullifier = await taggedSha256Hex(TAG_NULL, [secret, u64be(ZEROID_APP_ID)])
  const credentialHash = await taggedSha256Hex(TAG_CRED, [
    hexToBytes(commitment),
    hexToBytes(nullifier),
    new TextEncoder().encode(ZEROID_TYPE),
  ])
  const res = await fetch("/api/zeroid/issue", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ commitment, nullifier, credentialHash, wallet }),
  })
  const json = await readJson(res)
  const passport = json.passport as LocalPassport | undefined
  if (!res.ok || json.ok !== true || !passport) {
    throw new Error(String(json.error || "issue failed"))
  }
  const minted: LocalPassport = {
    ...passport,
    onChain: asBool(passport.onChain),
    bindTx: passport.bindTx || "",
    registry: passport.registry || String(json.registry || ""),
  }
  savePassport(minted)
  return minted
}

export function bindMessage(nullifier: string, credentialHash: string): string {
  return [
    "VEIL_ZEROID_BIND_V1",
    `nullifier:${nullifier.toLowerCase()}`,
    `credential:${credentialHash.toLowerCase()}`,
    `app:${ZEROID_APP_ID}`,
    `type:${ZEROID_TYPE}`,
  ].join("\n")
}

export async function bindWallet(p: LocalPassport): Promise<LocalPassport> {
  const eth = (
    window as unknown as {
      ethereum?: { request: (a: { method: string; params?: unknown[] }) => Promise<unknown> }
    }
  ).ethereum
  if (!eth?.request) throw new Error("Connect an injected wallet to bind")
  const accounts = (await eth.request({ method: "eth_requestAccounts" })) as string[]
  const wallet = (accounts?.[0] || "").toLowerCase()
  if (!wallet) throw new Error("Wallet returned no address")
  const message = bindMessage(p.nullifier, p.credentialHash)
  let signature: string
  try {
    signature = String(await eth.request({ method: "personal_sign", params: [message, wallet] }))
  } catch {
    signature = String(await eth.request({ method: "personal_sign", params: [wallet, message] }))
  }
  const res = await fetch("/api/zeroid/bind", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      nullifier: p.nullifier,
      credentialHash: p.credentialHash,
      wallet,
      signature,
    }),
  })
  const json = await readJson(res)
  if (!res.ok || json.ok !== true) throw new Error(String(json.error || "bind failed"))
  const next: LocalPassport = {
    ...p,
    wallet: String(json.wallet || wallet),
    bindSig: signature,
    bindTx: String(json.txHash || p.bindTx || ""),
    onChain: true,
    registry: String(json.registry || p.registry || ""),
  }
  savePassport(next)
  return next
}

export async function verifyPassport(p: LocalPassport) {
  const res = await fetch("/api/zeroid/verify", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(p),
  })
  return (await readJson(res)) as { ok?: boolean; reasons?: string[]; onChain?: boolean | null; registry?: string | null }
}
