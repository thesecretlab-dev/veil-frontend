export function asMs(ts: number) {
  if (!ts) return 0
  return ts > 0 && ts < 1e11 ? ts * 1000 : ts
}

export function shortId(h?: string, head = 10, tail = 8) {
  if (!h) return "—"
  if (h.length <= head + tail + 1) return h
  return `${h.slice(0, head)}…${h.slice(-tail)}`
}

/** Display HRP for HyperSDK 33-byte actors. Not bech32. */
export function veilAddr(hex?: string, head = 6, tail = 4) {
  if (!hex) return "—"
  if (hex.startsWith("veil1") || hex.startsWith("NodeID-")) return shortId(hex, 10, 6)
  const h = hex.replace(/^0x/i, "")
  if (h.length < 12) return hex
  return `veil1${h.slice(0, head)}…${h.slice(-tail)}`
}

export function fmt(n?: number | null) {
  if (typeof n !== "number" || !Number.isFinite(n)) return "—"
  return n.toLocaleString()
}

export function timeUtc(ts: number) {
  if (!ts) return "—"
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toISOString().replace(".000Z", "Z")
}

export function age(ts: number, now = Date.now()) {
  const t = asMs(ts)
  if (!t) return "—"
  const abs = Math.abs(now - t)
  if (abs < 2000) return "just now"
  if (abs < 60_000) return `${Math.floor(abs / 1000)}s ago`
  if (abs < 3_600_000) return `${Math.floor(abs / 60_000)}m ago`
  if (abs < 86_400_000) return `${Math.floor(abs / 3_600_000)}h ago`
  return `${Math.floor(abs / 86_400_000)}d ago`
}
