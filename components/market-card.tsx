"use client"

import Link from "next/link"
import { useMemo } from "react"
import { motion } from "framer-motion"
import type { Market } from "@/lib/market-data"

function isHttpImage(value: string): boolean {
  return /^https?:\/\//i.test(value)
}

function hashHue(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 33 + seed.charCodeAt(i)) >>> 0
  return h
}

function MarketThumb({ market, size = 72 }: { market: Market; size?: number }) {
  const cat = (market.category || "native").toLowerCase()
  if (isHttpImage(market.image)) {
    return (
      <img
        src={market.image}
        alt=""
        className="shrink-0 object-cover"
        style={{ width: size, height: size, borderRadius: 14 }}
      />
    )
  }
  const hue = hashHue(market.title + cat) % 360
  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{
        width: size,
        height: size,
        borderRadius: 14,
        background: `linear-gradient(145deg, hsl(${hue} 28% 14%), #070807)`,
        border: "1px solid rgba(255,255,255,0.08)",
      }}
      aria-hidden
    >
      <svg viewBox="0 0 72 72" className="h-full w-full">
        {cat === "politics" || cat === "macro" ? (
          <>
            <rect x="14" y="28" width="10" height="30" fill="rgba(255,255,255,0.18)" />
            <rect x="31" y="18" width="10" height="40" fill="rgba(16,185,129,0.55)" />
            <rect x="48" y="24" width="10" height="34" fill="rgba(255,255,255,0.12)" />
            <rect x="10" y="58" width="52" height="4" fill="rgba(255,255,255,0.2)" />
          </>
        ) : cat === "sports" || cat === "global" ? (
          <>
            <rect x="8" y="14" width="56" height="44" rx="4" fill="rgba(16,185,129,0.12)" />
            <path d="M8 28h56M8 42h56M28 14v44" stroke="rgba(255,255,255,0.22)" strokeWidth="3" />
          </>
        ) : cat === "crypto" || cat === "tech" ? (
          <>
            <polygon points="36,12 58,24 58,48 36,60 14,48 14,24" fill="none" stroke="#10B981" strokeWidth="2" />
            <polygon points="36,24 48,31 48,44 36,51 24,44 24,31" fill="rgba(16,185,129,0.35)" />
          </>
        ) : (
          <path d="M36 58 L14 16 H58 Z" fill="#10B981" />
        )}
      </svg>
    </div>
  )
}

function Sparkline({ seed, up }: { seed: string; up: boolean }) {
  const d = useMemo(() => {
    const h = hashHue(seed)
    const pts: number[] = []
    let v = 40 + (h % 20)
    for (let i = 0; i < 18; i++) {
      const step = ((h >> (i % 8)) & 7) - 3
      v = Math.max(8, Math.min(56, v + step + (up ? 0.6 : -0.6)))
      pts.push(v)
    }
    return pts.map((y, i) => `${(i / 17) * 72},${64 - y}`).join(" ")
  }, [seed, up])
  return (
    <svg width="72" height="40" viewBox="0 0 72 64" className="shrink-0" aria-hidden>
      <polyline fill="none" stroke="#10B981" strokeWidth="2.2" points={d} />
    </svg>
  )
}

function formatCents(n: number) {
  if (!Number.isFinite(n)) return "—"
  return `${n.toFixed(1)}¢`
}

function formatVeil(n: number | undefined, fallback: string) {
  if (typeof n === "number" && Number.isFinite(n)) return `${n.toLocaleString()} VEIL`
  const stripped = (fallback || "").replace(/^\$/, "").trim()
  if (!stripped || stripped === "0" || stripped === "n/a") return "0 VEIL"
  if (/veil/i.test(stripped)) return stripped
  return stripped
}

function deltaLabel(change: number | undefined) {
  const n = change || 0
  const abs = Math.abs(n)
  const body = abs < 0.05 ? "0.0%" : `${abs.toFixed(1)}%`
  if (n >= 0) return { text: `▲ ${body}`, color: "#34d399" }
  return { text: `▼ ${body}`, color: "#f87171" }
}

export function MarketCard({ market, layout = "grid" }: { market: Market; layout?: "grid" | "list" }) {
  const isVeilNative = Boolean(market.veilMarketId)
  const isUp = (market.change24h || 0) >= 0
  const yesDelta = deltaLabel(market.change24h)
  const noDelta = deltaLabel(-(market.change24h || 0))
  const volume = formatVeil(market.volumeNum, market.volume)
  const liq = formatVeil(market.liquidityNum, market.liquidity || "0")

  const inner = (
    <>
      <div className="absolute right-3 top-3 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
        <span
          className="rounded-full px-2 py-0.5"
          style={{
            background: "rgba(16,185,129,0.1)",
            color: "rgba(16,185,129,0.9)",
            border: "1px solid rgba(16,185,129,0.22)",
          }}
        >
          {isVeilNative ? "LOCAL" : "CATALOG"}
        </span>
        <span
          className="rounded-full px-2 py-0.5"
          style={{
            background: "rgba(16,185,129,0.1)",
            color: "rgba(16,185,129,0.9)",
            border: "1px solid rgba(16,185,129,0.22)",
          }}
        >
          {isVeilNative ? "VEILVM" : "POLY"}
        </span>
      </div>

      <div className={`flex items-start gap-4 ${layout === "list" ? "pr-28" : "pr-4 pt-2"}`}>
        <MarketThumb market={market} size={layout === "list" ? 56 : 72} />
        <h3
          className="text-[16px] leading-[1.35]"
          style={{
            fontFamily: "var(--font-figtree)",
            color: "rgba(255,255,255,0.94)",
            fontWeight: 500,
          }}
        >
          {market.title}
        </h3>
      </div>

      <div className={`mt-5 flex items-end gap-4 ${layout === "list" ? "pl-[72px]" : ""}`}>
        <div className="min-w-[72px]">
          <div className="text-[11px] tracking-wide" style={{ fontFamily: "var(--font-space-grotesk)", color: "#34d399" }}>
            YES
          </div>
          <div className="text-[28px] leading-none tabular-nums" style={{ fontFamily: "var(--font-space-grotesk)", color: "#6ee7b7", fontWeight: 600 }}>
            {formatCents(market.yesPrice)}
          </div>
          <div className="mt-1 text-[11px]" style={{ fontFamily: "var(--font-space-grotesk)", color: yesDelta.color }}>
            {yesDelta.text}
          </div>
        </div>
        <div className="min-w-[72px]">
          <div className="text-[11px] tracking-wide" style={{ fontFamily: "var(--font-space-grotesk)", color: "#f87171" }}>
            NO
          </div>
          <div className="text-[28px] leading-none tabular-nums" style={{ fontFamily: "var(--font-space-grotesk)", color: "#fca5a5", fontWeight: 600 }}>
            {formatCents(market.noPrice)}
          </div>
          <div className="mt-1 text-[11px]" style={{ fontFamily: "var(--font-space-grotesk)", color: noDelta.color }}>
            {noDelta.text}
          </div>
        </div>
        <div className="ml-auto pb-1">
          <Sparkline seed={String(market.id)} up={isUp} />
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
        <div className="flex gap-8">
          <div>
            <div className="text-[11px]" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.38)" }}>
              Volume
            </div>
            <div className="text-[13px] tabular-nums" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.82)" }}>
              {volume}
            </div>
          </div>
          <div>
            <div className="text-[11px]" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.38)" }}>
              Liquidity
            </div>
            <div className="text-[13px] tabular-nums" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.82)" }}>
              {liq}
            </div>
          </div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.8" aria-hidden>
          <path d="M4 18V10M10 18V6M16 18v-5M22 18H3" />
        </svg>
      </div>
    </>
  )

  return (
    <Link href={`/app/market/${market.veilMarketId || market.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
        style={{
          borderRadius: 18,
          background: "#0a0a0a",
          border: "1px solid rgba(255,255,255,0.07)",
          padding: layout === "list" ? "18px 20px" : "20px 22px 18px",
        }}
      >
        {inner}
      </motion.div>
    </Link>
  )
}
