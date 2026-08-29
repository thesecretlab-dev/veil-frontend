/** Same construction as veilvm taggedSHA256: SHA-256(tag || parts...). */

export const TAG_COMMIT = "VEIL_ZEROID_COMMIT_V1"
export const TAG_NULL = "VEIL_ZEROID_NULL_V1"
export const TAG_CRED = "VEIL_ZEROID_CRED_V1"
export const TAG_ISSUE = "VEIL_ZEROID_ISSUE_V1"
export const TAG_BIND = "VEIL_ZEROID_BIND_V1"

export function hexToBytes(hex: string): Uint8Array {
  const h = hex.startsWith("0x") ? hex.slice(2) : hex
  if (h.length % 2 !== 0 || !/^[0-9a-fA-F]*$/.test(h)) throw new Error("invalid hex")
  const out = new Uint8Array(h.length / 2)
  for (let i = 0; i < out.length; i++) out[i] = Number.parseInt(h.slice(i * 2, i * 2 + 2), 16)
  return out
}

export function bytesToHex(bytes: Uint8Array): string {
  return `0x${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}`
}

export function u64be(n: number): Uint8Array {
  const b = new Uint8Array(8)
  const v = BigInt(n)
  new DataView(b.buffer).setBigUint64(0, v, false)
  return b
}

export async function taggedSha256(tag: string, parts: Uint8Array[]): Promise<Uint8Array> {
  const enc = new TextEncoder().encode(tag)
  let len = enc.length
  for (const p of parts) len += p.length
  const buf = new Uint8Array(len)
  buf.set(enc, 0)
  let o = enc.length
  for (const p of parts) {
    buf.set(p, o)
    o += p.length
  }
  return new Uint8Array(await crypto.subtle.digest("SHA-256", buf))
}

export async function taggedSha256Hex(tag: string, parts: Uint8Array[]): Promise<string> {
  return bytesToHex(await taggedSha256(tag, parts))
}

export function isHex32(value: string): boolean {
  return /^0x[0-9a-fA-F]{64}$/.test(value)
}

export function timingSafeEqualHex(a: string, b: string): boolean {
  const aa = a.toLowerCase()
  const bb = b.toLowerCase()
  if (aa.length !== bb.length) return false
  let x = 0
  for (let i = 0; i < aa.length; i++) x |= aa.charCodeAt(i) ^ bb.charCodeAt(i)
  return x === 0
}
