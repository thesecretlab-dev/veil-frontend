"use client"

import Link from "next/link"
import { useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"

import { getCategoryColors } from "@/lib/category-colors"
import type { Market } from "@/lib/market-data"
import { PrivacyChips } from "./privacy-chips"

function isHttpImage(value: string): boolean {
  return /^https?:\/\//i.test(value)
}

export function MarketCard({ market }: { market: Market }) {
  const categoryColors = getCategoryColors(market.category)
  const isUp = (market.change24h || 0) >= 0
  const statusText = market.status === "closed" ? "Closed" : "Live"
  const isPolygonNative =
    (market.sourceName || "").toLowerCase().includes("poly") || (market.sourceName || "").toLowerCase().includes("Polymarket")

  const cardRef = useRef<HTMLDivElement>(null)
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    setGlowPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }, [])

  return (
    <Link href={`/app/market/${market.id}`}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="group relative overflow-hidden"
        style={{
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.015)",
          border: "1px solid rgba(255, 255, 255, 0.04)",
          padding: "1.5rem",
          transition: "border-color 0.7s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(16, 185, 129, 0.2)"
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255, 255, 255, 0.04)"
        }}
      >
        {/* Mouse-tracking glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            borderRadius: "20px",
            background: `radial-gradient(400px circle at ${glowPos.x}% ${glowPos.y}%, rgba(16, 185, 129, 0.06), transparent 60%)`,
          }}
        />

        {/* Status + 24h change */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            <span
              className="rounded-full px-2.5 py-1"
              style={{
                background: statusText === "Live" ? "rgba(16, 185, 129, 0.08)" : "rgba(255, 255, 255, 0.04)",
                color: statusText === "Live" ? "rgba(16, 185, 129, 0.7)" : "rgba(255, 255, 255, 0.35)",
                border: statusText === "Live" ? "1px solid rgba(16, 185, 129, 0.15)" : "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              {statusText}
            </span>
            <span
              className="rounded-full px-2.5 py-1"
              style={{
                background: isPolygonNative ? "rgba(99, 102, 241, 0.08)" : "rgba(16, 185, 129, 0.08)",
                color: isPolygonNative ? "rgba(99, 102, 241, 0.7)" : "rgba(16, 185, 129, 0.7)",
                border: isPolygonNative ? "1px solid rgba(99, 102, 241, 0.15)" : "1px solid rgba(16, 185, 129, 0.15)",
              }}
            >
              {isPolygonNative ? "Polymarket" : "VEIL"}
            </span>
          </div>
          <span
            className="rounded-full px-2.5 py-1 text-[10px] tracking-wide"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: isUp ? "rgba(16, 185, 129, 0.85)" : "rgba(239, 68, 68, 0.85)",
              background: isUp ? "rgba(16, 185, 129, 0.06)" : "rgba(239, 68, 68, 0.06)",
              border: isUp ? "1px solid rgba(16, 185, 129, 0.12)" : "1px solid rgba(239, 68, 68, 0.12)",
            }}
          >
            {market.change24h ? `${isUp ? "+" : ""}${market.change24h.toFixed(2)}%` : "Flat"}
          </span>
        </div>

        {/* Title + Image */}
        <div className="mb-5 flex items-start gap-3.5">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden text-xl"
            style={{
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            {isHttpImage(market.image) ? (
              <img src={market.image} alt={market.title} className="h-full w-full rounded-[12px] object-cover" />
            ) : (
              market.image
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="mb-1.5 line-clamp-2 text-[14px] leading-[1.4]"
              style={{
                fontFamily: "var(--font-figtree)",
                color: "rgba(255, 255, 255, 0.85)",
                fontWeight: 400,
              }}
            >
              {market.title}
            </h3>
            <span
              className="text-[11px]"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: "rgba(255, 255, 255, 0.3)",
              }}
            >
              {market.category}
            </span>
            <div className="mt-2">
              <PrivacyChips delayMinutes={market.delayMinutes} crowdMet={market.minCrowdMet} fairPrice={market.fairPrice} size="sm" />
            </div>
          </div>
        </div>

        {/* Yes / No buttons */}
        <div className="mb-4 flex items-center gap-2.5">
          <button
            className="flex-1 py-2.5 transition-all duration-500 hover:scale-[1.02]"
            style={{
              borderRadius: "12px",
              background: "rgba(16, 185, 129, 0.08)",
              border: "1px solid rgba(16, 185, 129, 0.12)",
            }}
          >
            <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16, 185, 129, 0.5)" }}>Yes</div>
            <div className="text-[16px] tabular-nums" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16, 185, 129, 0.9)", fontWeight: 500 }}>{market.yesPrice}¢</div>
          </button>
          <button
            className="flex-1 py-2.5 transition-all duration-500 hover:scale-[1.02]"
            style={{
              borderRadius: "12px",
              background: "rgba(239, 68, 68, 0.06)",
              border: "1px solid rgba(239, 68, 68, 0.1)",
            }}
          >
            <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(239, 68, 68, 0.5)" }}>No</div>
            <div className="text-[16px] tabular-nums" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(239, 68, 68, 0.85)", fontWeight: 500 }}>{market.noPrice}¢</div>
          </button>
        </div>

        {/* Volume + meta */}
        <div className="flex items-center justify-between text-[11px]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          <span style={{ color: "rgba(255, 255, 255, 0.25)" }}>{market.volume} Vol.</span>
          <span style={{ color: "rgba(255, 255, 255, 0.2)" }}>{market.endDate}</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-[10px]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          <span style={{ color: "rgba(255, 255, 255, 0.18)" }}>24h: {market.volume24h || "n/a"}</span>
          <span style={{ color: "rgba(255, 255, 255, 0.18)" }}>Liq: {market.liquidity || "n/a"}</span>
        </div>
      </motion.div>
    </Link>
  )
}
