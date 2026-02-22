"use client"

import Link from "next/link"

import { useMarket } from "@/lib/use-market"

interface MarketHeaderProps {
  marketId: string
}

function isHttpImage(value: string): boolean {
  return /^https?:\/\//i.test(value)
}

export function MarketHeader({ marketId }: MarketHeaderProps) {
  const { market, isLoading } = useMarket(marketId)

  if (isLoading) {
    return (
      <div className="p-8" style={{ color: "rgba(255, 255, 255, 0.3)", fontFamily: "var(--font-figtree)" }}>
        Loading market...
      </div>
    )
  }

  if (!market) {
    return (
      <div className="p-8" style={{ color: "rgba(255, 255, 255, 0.3)", fontFamily: "var(--font-figtree)" }}>
        Market not found
      </div>
    )
  }

  const isPolygonNative =
    (market.sourceName || "").toLowerCase().includes("poly")

  return (
    <div
      style={{
        background: "rgba(6, 6, 6, 0.6)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="p-5 md:p-8">
        {/* Back */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 text-[13px] transition-colors duration-500 hover:text-emerald-400"
            style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255, 255, 255, 0.35)" }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Markets
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {market.sourceUrl ? (
              <a
                href={market.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 text-[10px] transition-colors duration-500 hover:text-white/70"
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  borderRadius: "100px",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  color: "rgba(255, 255, 255, 0.35)",
                }}
              >
                {market.sourceName || "Source"}
              </a>
            ) : null}
            <span
              className="px-2.5 py-1 text-[10px]"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                borderRadius: "100px",
                background: market.status === "closed" ? "rgba(239, 68, 68, 0.06)" : "rgba(16, 185, 129, 0.06)",
                border: market.status === "closed" ? "1px solid rgba(239, 68, 68, 0.12)" : "1px solid rgba(16, 185, 129, 0.12)",
                color: market.status === "closed" ? "rgba(239, 68, 68, 0.7)" : "rgba(16, 185, 129, 0.7)",
              }}
            >
              {market.status === "closed" ? "Closed" : "Live"}
            </span>
            <span
              className="px-2.5 py-1 text-[10px]"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                borderRadius: "100px",
                background: isPolygonNative ? "rgba(99, 102, 241, 0.06)" : "rgba(16, 185, 129, 0.06)",
                border: isPolygonNative ? "1px solid rgba(99, 102, 241, 0.12)" : "1px solid rgba(16, 185, 129, 0.12)",
                color: isPolygonNative ? "rgba(99, 102, 241, 0.7)" : "rgba(16, 185, 129, 0.7)",
              }}
            >
              {isPolygonNative ? "Polymarket" : "VEIL native"}
            </span>
          </div>
        </div>

        {/* Market info */}
        <div className="mb-6 text-center">
          <div className="mb-4 flex justify-center text-4xl">
            {isHttpImage(market.image) ? (
              <img
                src={market.image}
                alt={market.title}
                className="h-16 w-16 object-cover"
                style={{ borderRadius: "16px" }}
              />
            ) : (
              market.image
            )}
          </div>
          <h1
            className="mb-3 text-2xl md:text-3xl"
            style={{
              fontFamily: "var(--font-instrument-serif)",
              color: "rgba(255, 255, 255, 0.9)",
              fontWeight: 400,
            }}
          >
            {market.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[13px]" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255, 255, 255, 0.3)" }}>
            <span>{market.volume} Vol.</span>
            <span>·</span>
            <span>{market.volume24h} 24h</span>
            <span>·</span>
            <span>{market.liquidity} Liquidity</span>
            <span>·</span>
            <span>Ends {market.endDate}</span>
          </div>
        </div>

        {/* Outcome prices */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div
            className="px-10 py-3"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontWeight: 500,
              borderRadius: "14px",
              background: "rgba(16, 185, 129, 0.08)",
              border: "1px solid rgba(16, 185, 129, 0.15)",
              color: "rgba(255, 255, 255, 0.9)",
            }}
          >
            {market.details?.outcomes?.yes?.label || "Yes"} {market.yesPrice}¢
          </div>
          <div
            className="px-10 py-3"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontWeight: 500,
              borderRadius: "14px",
              background: "rgba(239, 68, 68, 0.06)",
              border: "1px solid rgba(239, 68, 68, 0.12)",
              color: "rgba(255, 255, 255, 0.9)",
            }}
          >
            {market.details?.outcomes?.no?.label || "No"} {market.noPrice}¢
          </div>
        </div>
      </div>
    </div>
  )
}
