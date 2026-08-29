/**
 * Local ZER0ID issue/verify uniqueness smoke.
 * Tagged SHA-256 must match lib/zeroid/tagged.ts and VeilVM taggedSHA256.
 */
import { createHash, randomBytes } from "node:crypto"

const BASE = (process.env.VEIL_FRONT || "http://127.0.0.1:3000").replace(/\/+$/, "")
const APP_ID = 22207

function tagged(tag, parts) {
  const h = createHash("sha256")
  h.update(tag)
  for (const p of parts) h.update(p)
  return h.digest()
}

function u64be(n) {
  const b = Buffer.alloc(8)
  b.writeBigUInt64BE(BigInt(n))
  return b
}

function hex(buf) {
  return `0x${Buffer.from(buf).toString("hex")}`
}

function hashes() {
  const secret = randomBytes(32)
  const commitment = tagged("VEIL_ZEROID_COMMIT_V1", [secret])
  const nullifier = tagged("VEIL_ZEROID_NULL_V1", [secret, u64be(APP_ID)])
  const credentialHash = tagged("VEIL_ZEROID_CRED_V1", [commitment, nullifier, Buffer.from("8004")])
  return {
    commitment: hex(commitment),
    nullifier: hex(nullifier),
    credentialHash: hex(credentialHash),
  }
}

async function json(path, opts) {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: { "content-type": "application/json", ...(opts?.headers || {}) },
  })
  const text = await res.text()
  let body
  try {
    body = JSON.parse(text)
  } catch {
    throw new Error(`${path} ${res.status}: ${text.slice(0, 240)}`)
  }
  return { status: res.status, body }
}

const h = hashes()
const issue = await json("/api/zeroid/issue", { method: "POST", body: JSON.stringify(h) })
if (!issue.body.ok || !issue.body.passport?.onChain || !issue.body.txHash) {
  throw new Error(`issue failed: ${JSON.stringify(issue.body)}`)
}
const verify = await json("/api/zeroid/verify", { method: "POST", body: JSON.stringify(issue.body.passport) })
if (!verify.body.ok || verify.body.onChain !== true) {
  throw new Error(`verify failed: ${JSON.stringify(verify.body)}`)
}
const dup = await json("/api/zeroid/issue", { method: "POST", body: JSON.stringify(h) })
if (dup.status !== 409 && dup.body.ok) {
  throw new Error(`duplicate nullifier was accepted: ${JSON.stringify(dup.body)}`)
}
const bad = await json("/api/zeroid/verify", {
  method: "POST",
  body: JSON.stringify({ ...issue.body.passport, credentialHash: issue.body.passport.commitment }),
})
if (bad.body.ok) throw new Error("tampered credential verified")
const status = await json("/api/zeroid")
console.log(
  JSON.stringify(
    {
      ok: true,
      registry: issue.body.registry || status.body.companion?.registry,
      issueTx: issue.body.txHash,
      chainCount: status.body.companion?.chainCount,
      deployed: status.body.companion?.deployed,
      duplicate: dup.body.error,
    },
    null,
    2,
  ),
)
