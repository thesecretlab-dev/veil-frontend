"use client"

import { useState } from "react"
import { useMarket } from "@/lib/use-market"

interface TradingPanelProps {
  marketId: string
}

function isHttpImage(value: string): boolean {
  return /^https?:\/\//i.test(value)
}

export function TradingPanel({ marketId }: TradingPanelProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<"yes" | "no">("yes")
  const [amount, setAmount] = useState(100)
  const { market, isLoading } = useMarket(marketId)

  if (isLoading) {
    return <div className="w-96 p-8" style={{ color: "rgba(255, 255, 255, 0.3)", fontFamily: "var(--font-figtree)" }}>Loading...</div>
  }

  if (!market) {
    return <div className="w-96 p-8" style={{ color: "rgba(255, 255, 255, 0.3)", fontFamily: "var(--font-figtree)" }}>Market not found</div>
  }

  const isPolygonNative = (market.sourceName || "").toLowerCase().includes("poly")
  const price = selectedOutcome === "yes" ? market.yesPrice / 100 : market.noPrice / 100
  const safePrice = Math.max(price, 0.0001)
  const potentialReturn = amount / safePrice
  const change = market.change24h || 0

  return (
    <div
      className="w-96 overflow-y-auto"
      style={{
        background: "rgba(6, 6, 6, 0.7)",
        borderLeft: "1px solid rgba(255, 255, 255, 0.04)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="p-6 space-y-5">
        {/* Market title */}
        <div className="flex items-center gap-3">
          <div className="text-2xl">
            {isHttpImage(market.image) ? (
              <img src={market.image} alt={market.title} className="h-10 w-10 object-cover" style={{ borderRadius: "10px" }} />
            ) : (
              market.image
            )}
          </div>
          <div>
            <div className="text-[13px]" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255, 255, 255, 0.8)", fontWeight: 500 }}>{market.title}</div>
            <div className="text-[11px]" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255, 255, 255, 0.3)" }}>{market.category}</div>
          </div>
        </div>

        {/* Live price card */}
        <div className="p-4" style={{ borderRadius: "16px", background: "rgba(255, 255, 255, 0.015)", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
          <div className="mb-3 text-[10px] uppercase tracking-[0.1em]" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255, 255, 255, 0.3)" }}>
            Live Prices
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3" style={{ borderRadius: "12px", background: "rgba(16, 185, 129, 0.04)", border: "1px solid rgba(16, 185, 129, 0.08)" }}>
              <div className="text-[11px] mb-1" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16, 185, 129, 0.6)" }}>
                {market.details?.outcomes?.yes?.label || "Yes"}
              </div>
              <div className="text-2xl" style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, color: "rgba(16, 185, 129, 0.9)" }}>
                {market.yesPrice}¢
              </div>
            </div>
            <div className="p-3" style={{ borderRadius: "12px", background: "rgba(239, 68, 68, 0.03)", border: "1px solid rgba(239, 68, 68, 0.06)" }}>
              <div className="text-[11px] mb-1" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(239, 68, 68, 0.6)" }}>
                {market.details?.outcomes?.no?.label || "No"}
              </div>
              <div className="text-2xl" style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, color: "rgba(239, 68, 68, 0.8)" }}>
                {market.noPrice}¢
              </div>
            </div>
          </div>
          {change !== 0 && (
            <div className="mt-2 text-[11px] text-right" style={{ fontFamily: "var(--font-space-grotesk)", color: change > 0 ? "rgba(16, 185, 129, 0.6)" : "rgba(239, 68, 68, 0.6)" }}>
              {change > 0 ? "+" : ""}{change.toFixed(1)}% 24h
            </div>
          )}
        </div>

        {/* Market stats */}
        <div className="p-4" style={{ borderRadius: "16px", background: "rgba(255, 255, 255, 0.015)", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
          <div className="mb-3 text-[10px] uppercase tracking-[0.1em]" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255, 255, 255, 0.3)" }}>
            Market Stats
          </div>
          <div className="space-y-2.5 text-[13px]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {[
              { label: "Total Volume", value: market.volume },
              { label: "24h Volume", value: market.volume24h },
              { label: "Liquidity", value: market.liquidity },
              { label: "End Date", value: market.endDate },
              { label: "Source", value: market.sourceName || "—" },
            ].map((row) => (
              <div key={row.label} className="flex justify-between">
                <span style={{ color: "rgba(255, 255, 255, 0.35)" }}>{row.label}</span>
                <span style={{ color: "rgba(255, 255, 255, 0.75)" }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payout calculator */}
        <div className="p-4" style={{ borderRadius: "16px", background: "rgba(255, 255, 255, 0.015)", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
          <div className="mb-3 text-[10px] uppercase tracking-[0.1em]" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255, 255, 255, 0.3)" }}>
            Payout Calculator
          </div>

          {/* Outcome selection */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setSelectedOutcome("yes")}
              className="flex-1 py-2.5 text-[12px] transition-all duration-500"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                borderRadius: "10px",
                background: selectedOutcome === "yes" ? "rgba(16, 185, 129, 0.1)" : "rgba(255, 255, 255, 0.02)",
                border: selectedOutcome === "yes" ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid rgba(255, 255, 255, 0.05)",
                color: selectedOutcome === "yes" ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.4)",
              }}
            >
              {market.details?.outcomes?.yes?.label || "Yes"} {market.yesPrice}¢
            </button>
            <button
              onClick={() => setSelectedOutcome("no")}
              className="flex-1 py-2.5 text-[12px] transition-all duration-500"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                borderRadius: "10px",
                background: selectedOutcome === "no" ? "rgba(239, 68, 68, 0.08)" : "rgba(255, 255, 255, 0.02)",
                border: selectedOutcome === "no" ? "1px solid rgba(239, 68, 68, 0.18)" : "1px solid rgba(255, 255, 255, 0.05)",
                color: selectedOutcome === "no" ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.4)",
              }}
            >
              {market.details?.outcomes?.no?.label || "No"} {market.noPrice}¢
            </button>
          </div>

          {/* Amount */}
          <div className="mb-3">
            <div className="text-[11px] mb-1.5" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255, 255, 255, 0.3)" }}>If you bet</div>
            <div className="text-3xl mb-2" style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, color: "rgba(255, 255, 255, 0.95)" }}>${amount}</div>
            <div className="flex gap-2">
              {[10, 50, 100, 500].map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val)}
                  className="px-3 py-1.5 text-[12px] transition-all duration-500 hover:border-emerald-500/20"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    borderRadius: "8px",
                    background: amount === val ? "rgba(16, 185, 129, 0.08)" : "rgba(255, 255, 255, 0.02)",
                    border: amount === val ? "1px solid rgba(16, 185, 129, 0.15)" : "1px solid rgba(255, 255, 255, 0.05)",
                    color: amount === val ? "rgba(16, 185, 129, 0.8)" : "rgba(255, 255, 255, 0.4)",
                  }}
                >
                  ${val}
                </button>
              ))}
            </div>
          </div>

          {/* Potential return */}
          <div className="p-3" style={{ borderRadius: "12px", background: "rgba(16, 185, 129, 0.04)", border: "1px solid rgba(16, 185, 129, 0.1)" }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px]" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16, 185, 129, 0.6)" }}>Potential return</span>
              <span className="text-[11px]" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255, 255, 255, 0.3)" }}>
                at {(price * 100).toFixed(0)}¢
              </span>
            </div>
            <div className="text-2xl" style={{ fontFamily: "var(--font-space-grotesk)", fontWeight: 700, color: "rgba(16, 185, 129, 0.9)" }}>
              ${potentialReturn.toFixed(2)}
            </div>
            <div className="text-[11px] mt-0.5" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16, 185, 129, 0.4)" }}>
              {((potentialReturn / amount - 1) * 100).toFixed(0)}% return if correct
            </div>
          </div>
        </div>

        {/* Trade on source link */}
        {market.sourceUrl && (
          <a
            href={market.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="block w-full py-4 text-center text-[14px] transition-all duration-500 hover:shadow-lg hover:shadow-emerald-500/15"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontWeight: 700,
              borderRadius: "14px",
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.85), rgba(20, 184, 166, 0.85))",
              color: "rgba(255, 255, 255, 0.95)",
            }}
          >
            Trade on {market.sourceName || "Polymarket"}
          </a>
        )}

        {isPolygonNative && (
          <div className="text-[11px] text-center" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255, 255, 255, 0.2)" }}>
            VEIL native trading is staged by operator rollout policy
          </div>
        )}

        <div className="pt-2 text-[10px] text-center" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255, 255, 255, 0.15)" }}>
          Prices refresh every 10 seconds
        </div>
      </div>
    </div>
  )
}
