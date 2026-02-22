"use client"

import { useState } from "react"
import { useMarket } from "@/lib/use-market"

interface MarketContentProps {
  marketId: string
}

export function MarketContent({ marketId }: MarketContentProps) {
  const [activeTab, setActiveTab] = useState<"orderbook" | "about">("orderbook")
  const { market, isLoading } = useMarket(marketId)

  if (isLoading) {
    return <div className="p-8" style={{ color: "rgba(255, 255, 255, 0.3)", fontFamily: "var(--font-figtree)" }}>Loading market details...</div>
  }

  if (!market || !market.details) {
    return <div className="p-8" style={{ color: "rgba(255, 255, 255, 0.3)", fontFamily: "var(--font-figtree)" }}>Market details not available</div>
  }

  const orders = market.details.orderBook || []

  return (
    <div className="p-5 md:p-8">
      {/* Tabs */}
      <div className="mb-8 flex items-center gap-8" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
        {(["orderbook", "about"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="pb-3 px-1 text-[13px] capitalize transition-all duration-500"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: activeTab === tab ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.35)",
              borderBottom: activeTab === tab ? "2px solid rgba(16, 185, 129, 0.7)" : "2px solid transparent",
            }}
          >
            {tab === "orderbook" ? "Order Book" : "About"}
          </button>
        ))}
      </div>

      {activeTab === "orderbook" && (
        <div
          className="overflow-hidden"
          style={{
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.015)",
            border: "1px solid rgba(255, 255, 255, 0.04)",
          }}
        >
          <div
            className="grid grid-cols-3 gap-4 p-4 text-[11px] uppercase tracking-[0.1em]"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: "rgba(255, 255, 255, 0.3)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
            }}
          >
            <div>Price</div>
            <div className="text-right">Shares</div>
            <div className="text-right">Total</div>
          </div>

          {orders.length === 0 ? (
            <div className="p-10 text-center text-[13px]" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255, 255, 255, 0.3)" }}>
              No order book data available for this market.
            </div>
          ) : (
            <div>
              {orders.map((order, i) => (
                <div
                  key={i}
                  className="grid grid-cols-3 gap-4 p-4 text-[13px]"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    background:
                      order.type === "sell" || order.type === "ask"
                        ? "rgba(239, 68, 68, 0.03)"
                        : order.type === "buy" || order.type === "bid"
                          ? "rgba(16, 185, 129, 0.03)"
                          : "transparent",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.02)",
                  }}
                >
                  <div
                    style={{
                      color:
                        order.type === "sell" || order.type === "ask"
                          ? "rgba(239, 68, 68, 0.8)"
                          : order.type === "buy" || order.type === "bid"
                            ? "rgba(16, 185, 129, 0.8)"
                            : "rgba(255, 255, 255, 0.3)",
                    }}
                  >
                    {order.price}
                  </div>
                  <div className="text-right" style={{ color: "rgba(255, 255, 255, 0.55)" }}>{order.shares.toLocaleString()}</div>
                  <div className="text-right" style={{ color: "rgba(255, 255, 255, 0.35)" }}>{order.total}</div>
                </div>
              ))}
            </div>
          )}

          {orders.length > 0 && (
            <div className="px-4 py-3 text-[10px]" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255, 255, 255, 0.2)", borderTop: "1px solid rgba(255, 255, 255, 0.03)" }}>
              Live order book from Polymarket CLOB · Refreshes every 10s
            </div>
          )}
        </div>
      )}

      {activeTab === "about" && (
        <div
          className="p-6"
          style={{
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.015)",
            border: "1px solid rgba(255, 255, 255, 0.04)",
          }}
        >
          <h3 className="mb-3 text-lg" style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255, 255, 255, 0.8)" }}>
            Resolution Details
          </h3>
          <p
            className="whitespace-pre-wrap text-[13px] leading-relaxed"
            style={{ fontFamily: "var(--font-figtree)", color: "rgba(255, 255, 255, 0.5)" }}
          >
            {market.details.description || "No additional market description provided."}
          </p>
          <div className="mt-5 grid gap-2 text-[12px] md:grid-cols-2" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255, 255, 255, 0.3)" }}>
            <div>Category: {market.category}</div>
            <div>Status: {market.status || "active"}</div>
            <div>24h Volume: {market.volume24h || "n/a"}</div>
            <div>Total Volume: {market.volume || "n/a"}</div>
            <div>Liquidity: {market.liquidity || "n/a"}</div>
            <div>End Date: {market.endDate || "n/a"}</div>
          </div>
          {market.sourceUrl && (
            <a
              href={market.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-[12px] transition-colors duration-500 hover:text-emerald-400"
              style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16, 185, 129, 0.6)" }}
            >
              View on {market.sourceName || "source"} →
            </a>
          )}
        </div>
      )}
    </div>
  )
}
