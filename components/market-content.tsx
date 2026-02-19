"use client"

import { useState } from "react"
import { getMarketById } from "@/lib/market-data"

interface MarketContentProps {
  marketId: string
}

export function MarketContent({ marketId }: MarketContentProps) {
  const [activeTab, setActiveTab] = useState<"orderbook" | "graph" | "about">("orderbook")

  const market = getMarketById(Number.parseInt(marketId))

  if (!market || !market.details) {
    return <div className="p-6 text-white/50">Market details not available</div>
  }

  const orders = market.details.orderBook || []
  const hasSpreads = market.details.sport?.spreads
  const hasTotals = market.details.sport?.totals

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex items-center gap-6 mb-6 border-b border-white/5">
        {(["orderbook", "graph", "about"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-1 text-sm font-['Space_Grotesk'] capitalize transition-all
                     ${
                       activeTab === tab
                         ? "text-white border-b-2 border-emerald-400"
                         : "text-white/50 hover:text-white/70"
                     }`}
          >
            {tab === "orderbook" ? "Order Book" : tab}
          </button>
        ))}
      </div>

      {/* Order Book */}
      {activeTab === "orderbook" && (
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-3 gap-4 p-4 border-b border-white/10 text-xs text-white/40 font-['Space_Grotesk']">
              <div>PRICE</div>
              <div className="text-right">SHARES</div>
              <div className="text-right">TOTAL</div>
            </div>
            <div className="divide-y divide-white/5">
              {orders.map((order, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-3 gap-4 p-4 font-['Space_Grotesk'] text-sm
                           ${order.type === "sell" ? "bg-red-500/5" : ""}
                           ${order.type === "buy" ? "bg-emerald-500/5" : ""}
                           ${order.type === "ask" ? "bg-red-500/10 font-medium" : ""}
                           ${order.type === "bid" ? "bg-emerald-500/10 font-medium" : ""}
                           ${order.type === "spread" ? "bg-white/5" : ""}`}
                >
                  <div
                    className={`
                    ${order.type === "sell" || order.type === "ask" ? "text-red-400" : ""}
                    ${order.type === "buy" || order.type === "bid" ? "text-emerald-400" : ""}
                    ${order.type === "spread" ? "text-white/40" : ""}
                  `}
                  >
                    {order.price}
                  </div>
                  <div className="text-right text-white/70">{order.shares.toLocaleString()}</div>
                  <div className="text-right text-white/50">{order.total}</div>
                </div>
              ))}
            </div>
          </div>

          {hasSpreads && (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <div className="text-sm text-white/50 font-['Space_Grotesk'] mb-4">
                Spreads <span className="text-white/30">$145.2k Vol.</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  className="flex-1 py-3 rounded-lg bg-white/5 border border-white/10 
                               hover:border-emerald-500/30 transition-all"
                >
                  <div className="text-xs text-white/40 font-['Space_Grotesk']">
                    {market.details.sport?.teams?.home.abbr} {market.details.sport?.spreads?.home > 0 ? "+" : ""}
                    {market.details.sport?.spreads?.home}
                  </div>
                  <div className="text-lg text-white font-['Space_Grotesk'] font-medium">
                    {market.details.sport?.spreads?.homePrice}¢
                  </div>
                </button>
                <button
                  className="flex-1 py-3 rounded-lg bg-white/5 border border-white/10 
                               hover:border-emerald-500/30 transition-all"
                >
                  <div className="text-xs text-white/40 font-['Space_Grotesk']">
                    {market.details.sport?.teams?.away.abbr} {market.details.sport?.spreads?.away > 0 ? "+" : ""}
                    {market.details.sport?.spreads?.away}
                  </div>
                  <div className="text-lg text-white font-['Space_Grotesk'] font-medium">
                    {market.details.sport?.spreads?.awayPrice}¢
                  </div>
                </button>
              </div>
            </div>
          )}

          {hasTotals && (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              <div className="text-sm text-white/50 font-['Space_Grotesk'] mb-4">
                Totals <span className="text-white/30">$68.6k Vol.</span>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <button
                  className="flex-1 py-3 rounded-lg bg-white/5 border border-white/10 
                               hover:border-emerald-500/30 transition-all"
                >
                  <div className="text-xs text-white/40 font-['Space_Grotesk']">
                    O {market.details.sport?.totals?.over}
                  </div>
                  <div className="text-lg text-white font-['Space_Grotesk'] font-medium">
                    {market.details.sport?.totals?.overPrice}¢
                  </div>
                </button>
                <button
                  className="flex-1 py-3 rounded-lg bg-white/5 border border-white/10 
                               hover:border-emerald-500/30 transition-all"
                >
                  <div className="text-xs text-white/40 font-['Space_Grotesk']">
                    U {market.details.sport?.totals?.under}
                  </div>
                  <div className="text-lg text-white font-['Space_Grotesk'] font-medium">
                    {market.details.sport?.totals?.underPrice}¢
                  </div>
                </button>
              </div>
              <input
                type="range"
                min={market.details.sport?.totals?.over - 2}
                max={market.details.sport?.totals?.over + 2}
                step="0.5"
                defaultValue={market.details.sport?.totals?.over}
                className="w-full"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
