/** Minimal canoto / protobuf-lite reader for HyperSDK executed blocks. */

export const WIRE_VARINT = 0
export const WIRE_I64 = 1
export const WIRE_LEN = 2

export class CanotoReader {
  buf: Uint8Array
  i = 0

  constructor(buf: Uint8Array) {
    this.buf = buf
  }

  remaining(): number {
    return this.buf.length - this.i
  }

  has(): boolean {
    return this.i < this.buf.length
  }

  tag(): { field: number; wire: number } {
    const n = this.varint()
    return { field: n >>> 3, wire: n & 7 }
  }

  varint(): number {
    let n = 0
    let shift = 0
    while (this.has()) {
      const b = this.buf[this.i++]
      n += (b & 0x7f) * 2 ** shift
      if ((b & 0x80) === 0) return n
      shift += 7
      if (shift > 63) throw new Error("varint overflow")
    }
    throw new Error("truncated varint")
  }

  skip(wire: number) {
    if (wire === WIRE_VARINT) {
      this.varint()
      return
    }
    if (wire === WIRE_I64) {
      this.i += 8
      return
    }
    if (wire === WIRE_LEN) {
      const n = this.varint()
      this.i += n
      return
    }
    throw new Error(`unknown wire ${wire}`)
  }

  bytes(): Uint8Array {
    const n = this.varint()
    const slice = this.buf.subarray(this.i, this.i + n)
    this.i += n
    return slice
  }

  fint64(): number {
    const v = this.buf
    const i = this.i
    this.i += 8
    const lo = v[i] + v[i + 1] * 256 + v[i + 2] * 65536 + v[i + 3] * 16777216
    const hi = v[i + 4] + v[i + 5] * 256 + v[i + 6] * 65536 + v[i + 7] * 16777216
    return hi * 4294967296 + lo
  }

  bool(): boolean {
    return this.varint() !== 0
  }
}

export function hexToBytes(hex: string): Uint8Array {
  const h = hex.startsWith("0x") ? hex.slice(2) : hex
  if (h.length % 2) throw new Error("odd hex")
  const out = new Uint8Array(h.length / 2)
  for (let i = 0; i < out.length; i++) out[i] = parseInt(h.slice(i * 2, i * 2 + 2), 16)
  return out
}

export function bytesToHex(b: Uint8Array, prefix = true): string {
  let s = ""
  for (let i = 0; i < b.length; i++) s += b[i].toString(16).padStart(2, "0")
  return prefix ? `0x${s}` : s
}

export function readU64BE(b: Uint8Array, offset = 0): number {
  const hi = b[offset] * 16777216 + b[offset + 1] * 65536 + b[offset + 2] * 256 + b[offset + 3]
  const lo = b[offset + 4] * 16777216 + b[offset + 5] * 65536 + b[offset + 6] * 256 + b[offset + 7]
  return hi * 4294967296 + lo
}
