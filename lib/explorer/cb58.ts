import { createHash } from "crypto"

const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

function sha256(b: Uint8Array): Uint8Array {
  return new Uint8Array(createHash("sha256").update(b).digest())
}

export function encodeCb58(payload: Uint8Array): string {
  const checksum = sha256(payload).subarray(28)
  const raw = new Uint8Array(payload.length + 4)
  raw.set(payload)
  raw.set(checksum, payload.length)
  let zeros = 0
  while (zeros < raw.length && raw[zeros] === 0) zeros++
  const digits: number[] = []
  const buf = Array.from(raw)
  let start = zeros
  while (start < buf.length) {
    let rem = 0
    for (let i = start; i < buf.length; i++) {
      const acc = rem * 256 + buf[i]
      buf[i] = Math.floor(acc / 58)
      rem = acc % 58
    }
    digits.push(rem)
    while (start < buf.length && buf[start] === 0) start++
  }
  let s = "1".repeat(zeros)
  for (let i = digits.length - 1; i >= 0; i--) s += ALPHABET[digits[i]]
  return s
}

export function decodeCb58(s: string): Uint8Array {
  let zeros = 0
  while (zeros < s.length && s[zeros] === "1") zeros++
  const bytes = [0]
  for (let i = zeros; i < s.length; i++) {
    const val = ALPHABET.indexOf(s[i])
    if (val < 0) throw new Error("invalid cb58")
    let carry = val
    for (let j = bytes.length - 1; j >= 0; j--) {
      const acc = bytes[j] * 58 + carry
      bytes[j] = acc & 0xff
      carry = acc >> 8
    }
    while (carry > 0) {
      bytes.unshift(carry & 0xff)
      carry >>= 8
    }
  }
  const raw = new Uint8Array(zeros + bytes.length)
  raw.set(bytes, zeros)
  if (raw.length < 5) throw new Error("cb58 too short")
  const payload = raw.subarray(0, raw.length - 4)
  const checksum = raw.subarray(raw.length - 4)
  const expect = sha256(payload).subarray(28)
  if (checksum[0] !== expect[0] || checksum[1] !== expect[1] || checksum[2] !== expect[2] || checksum[3] !== expect[3]) {
    throw new Error("cb58 checksum")
  }
  return payload
}

export function looksLikeCb58(s: string): boolean {
  return s.length >= 20 && s.length <= 64 && /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/.test(s)
}
