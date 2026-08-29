"use client"

import { AppShaderBackground } from "@/components/app-shader-background"
import { AppNav } from "@/components/app-nav"
import { MarketHeader } from "@/components/market-header"
import { MarketContent } from "@/components/market-content"
import { TradingPanel } from "@/components/trading-panel"
import { use } from "react"

export default function MarketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  return (
    <div className="min-h-screen relative" style={{ background: "#000000" }}>
      <AppShaderBackground />

      <div className="pointer-events-none fixed inset-0 z-50">
        <svg className="h-full w-full opacity-[0.035]">
          <filter id="grain-detail">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain-detail)" />
        </svg>
      </div>

      <AppNav />

      <div className="relative z-10 flex min-h-screen pt-[88px]">
        <div className="flex-1 overflow-y-auto">
          <MarketHeader marketId={id} />
          <MarketContent marketId={id} />
        </div>
        <TradingPanel marketId={id} />
      </div>
    </div>
  )
}
