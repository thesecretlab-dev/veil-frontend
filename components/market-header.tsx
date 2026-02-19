"use client"

import Link from "next/link"
import { getMarketById } from "@/lib/market-data"
import { PrivacyChips } from "./privacy-chips"
import { getCategoryColors } from "@/lib/category-colors"
import { TriangleLogo } from "./triangle-logo"

interface MarketHeaderProps {
  marketId: string
}

export function MarketHeader({ marketId }: MarketHeaderProps) {
  const market = getMarketById(Number.parseInt(marketId))

  if (!market) {
    return <div className="p-6 text-white/50">Market not found</div>
  }

  const categoryColors = getCategoryColors(market.category)

  const isSportsMarket = market.type === "sports" && market.details?.sport
  const isBinaryMarket = market.type === "binary"

  const handleAskViola = () => {
    window.dispatchEvent(
      new CustomEvent("viola:market-inquiry", {
        detail: {
          marketTitle: market.title,
          marketCategory: market.category,
        },
      }),
    )
  }

  return (
    <div
      className="border-b border-white/5 bg-black/20 backdrop-blur-xl"
      style={{
        background: "rgba(0, 0, 0, 0.2)",
        borderColor: categoryColors.border,
      }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-emerald-400 
                     transition-colors font-['Space_Grotesk']"
            style={{
              color: categoryColors.light,
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {market.category}
          </Link>

          <button
            onClick={handleAskViola}
            className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-black/40 px-4 py-2 
                     text-sm font-medium text-white backdrop-blur-xl transition-all hover:border-emerald-500/40 
                     hover:bg-black/60 hover:shadow-lg hover:shadow-emerald-500/10"
          >
            <div className="relative h-5 w-5 flex-shrink-0 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="scale-[0.33] origin-center">
                  <TriangleLogo />
                </div>
              </div>
            </div>
            <span>Ask Viola</span>
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <PrivacyChips delayMinutes={5} crowdMet={true} fairPrice={true} size="md" />
          <span
            className="text-xs font-light"
            style={{
              color: "rgba(255, 255, 255, 0.4)",
              fontFamily: "var(--font-space-grotesk)",
            }}
          >
            Last update: {new Date().toLocaleTimeString()} (delayed)
          </span>
        </div>

        {isSportsMarket && market.details?.sport ? (
          <>
            <div className="flex items-center justify-between">
              {/* Home Team */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-20 h-20 rounded-xl bg-emerald-500/20 border border-emerald-500/30 
                          flex items-center justify-center backdrop-blur-sm"
                >
                  <span className="text-2xl font-bold text-white font-['Space_Grotesk']">
                    {market.details.sport.teams?.home.abbr}
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-white/90 font-['Space_Grotesk'] font-medium">
                    {market.details.sport.teams?.home.name}
                  </div>
                  {market.details.sport.teams?.home.record && (
                    <div className="text-xs text-white/40">{market.details.sport.teams.home.record}</div>
                  )}
                </div>
              </div>

              {/* Score or Status */}
              <div className="flex flex-col items-center gap-2">
                {market.details.sport.status === "LIVE" && market.details.sport.score ? (
                  <>
                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-['Space_Grotesk']">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                      {market.details.sport.status} • {market.details.sport.quarter} - {market.details.sport.time}
                    </div>
                    <div className="text-6xl font-bold text-white/90 font-['Space_Grotesk'] tracking-tight">
                      {market.details.sport.score.home} - {market.details.sport.score.away}
                    </div>
                  </>
                ) : (
                  <div className="text-2xl font-bold text-white/60 font-['Space_Grotesk']">
                    {market.details.sport.status}
                  </div>
                )}
                <div className="text-sm text-white/40 font-['Space_Grotesk']">{market.volume} Vol.</div>
              </div>

              {/* Away Team */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-20 h-20 rounded-xl bg-red-500/20 border border-red-500/30 
                          flex items-center justify-center backdrop-blur-sm"
                >
                  <span className="text-2xl font-bold text-white font-['Space_Grotesk']">
                    {market.details.sport.teams?.away.abbr}
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-white/90 font-['Space_Grotesk'] font-medium">
                    {market.details.sport.teams?.away.name}
                  </div>
                  {market.details.sport.teams?.away.record && (
                    <div className="text-xs text-white/40">{market.details.sport.teams.away.record}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Outcome Buttons */}
            <div className="flex items-center gap-4 mt-6 justify-center">
              <div className="text-sm text-white/50 font-['Space_Grotesk']">Outcomes</div>
              <button
                className="px-8 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 
                           hover:bg-emerald-500/30 transition-all text-white font-['Space_Grotesk']"
              >
                {market.details.outcomes?.yes.label} {(market.details.outcomes?.yes.price * 100).toFixed(0)}¢
              </button>
              <button
                className="px-8 py-2 rounded-lg bg-red-500/20 border border-red-500/30 
                           hover:bg-red-500/30 transition-all text-white font-['Space_Grotesk']"
              >
                {market.details.outcomes?.no.label} {(market.details.outcomes?.no.price * 100).toFixed(0)}¢
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">{market.image}</div>
              <h1 className="text-3xl font-bold text-white/90 font-['Space_Grotesk'] mb-2">{market.title}</h1>
              <div className="text-sm text-white/40 font-['Space_Grotesk']">
                {market.volume} Vol. • Ends {market.endDate}
              </div>
            </div>

            {/* Outcome Buttons */}
            <div className="flex items-center gap-4 justify-center">
              <button
                className="px-12 py-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 
                           hover:bg-emerald-500/30 transition-all text-white font-['Space_Grotesk'] font-medium"
              >
                Yes {market.yesPrice}¢
              </button>
              <button
                className="px-12 py-3 rounded-lg bg-red-500/20 border border-red-500/30 
                           hover:bg-red-500/30 transition-all text-white font-['Space_Grotesk'] font-medium"
              >
                No {market.noPrice}¢
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
