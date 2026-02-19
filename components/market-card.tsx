"use client"

import Link from "next/link"
import { PrivacyChips } from "./privacy-chips"
import { getCategoryColors } from "@/lib/category-colors"

interface Market {
  id: number
  title: string
  category: string
  type: "binary" | "sports" | "categorical"
  yesPrice: number
  noPrice: number
  volume: string
  endDate: string
  image: string
  delayMinutes?: number
  minCrowdMet?: boolean
  fairPrice?: boolean
}

export function MarketCard({ market }: { market: Market }) {
  const categoryColors = getCategoryColors(market.category)

  return (
    <Link href={`/app/market/${market.id}`}>
      <div
        className="group relative overflow-hidden rounded-xl border backdrop-blur-xl transition-all hover:scale-[1.01]"
        style={{
          background: "rgba(255, 255, 255, 0.02)",
          borderColor: categoryColors.border,
          padding: "1.25rem",
        }}
      >
        <div className="mb-4 flex items-start gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg text-2xl"
            style={{ background: categoryColors.bg }}
          >
            {market.image}
          </div>
          <div className="flex-1">
            <h3
              className="text-sm font-light leading-tight mb-2"
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                textShadow: `0 0 10px ${categoryColors.glow}`,
              }}
            >
              {market.title}
            </h3>
            <span
              className="text-xs font-light"
              style={{
                color: categoryColors.light,
                textShadow: `0 0 8px ${categoryColors.glow}`,
              }}
            >
              {market.category}
            </span>
            <div className="mt-2">
              <PrivacyChips
                delayMinutes={market.delayMinutes}
                crowdMet={market.minCrowdMet}
                fairPrice={market.fairPrice}
                size="sm"
              />
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <button
            className="flex-1 rounded-lg px-4 py-2.5 text-sm font-light transition-all hover:scale-[1.02]"
            style={{
              background: "rgba(16, 185, 129, 0.15)",
              color: "rgba(16, 185, 129, 0.95)",
            }}
          >
            <div className="text-xs opacity-60 mb-0.5">Yes</div>
            <div className="text-base font-light tabular-nums">{market.yesPrice}¢</div>
          </button>
          <button
            className="flex-1 rounded-lg px-4 py-2.5 text-sm font-light transition-all hover:scale-[1.02]"
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              color: "rgba(239, 68, 68, 0.95)",
            }}
          >
            <div className="text-xs opacity-60 mb-0.5">No</div>
            <div className="text-base font-light tabular-nums">{market.noPrice}¢</div>
          </button>
        </div>

        <div className="flex items-center justify-between text-xs font-light">
          <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>{market.volume} Vol.</span>
          <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>{market.endDate}</span>
        </div>
      </div>
    </Link>
  )
}
