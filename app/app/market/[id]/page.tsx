"use client"

import { useState } from "react"
import { AppShaderBackground } from "@/components/app-shader-background"
import { MarketSidebar } from "@/components/market-sidebar"
import { MarketHeader } from "@/components/market-header"
import { MarketContent } from "@/components/market-content"
import { TradingPanel } from "@/components/trading-panel"
import { use } from "react"

export default function MarketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [category, setCategory] = useState("all")

  return (
    <div className="min-h-screen relative">
      <AppShaderBackground />

      <div className="relative z-10 flex h-screen">
        {/* Left Sidebar - Sport Categories */}
        <MarketSidebar selectedCategory={category} onCategoryChange={setCategory} />

        {/* Main Content - Order Book & Market Info */}
        <div className="flex-1 overflow-y-auto">
          <MarketHeader marketId={id} />
          <MarketContent marketId={id} />
        </div>

        {/* Right Panel - Trading Interface */}
        <TradingPanel marketId={id} />
      </div>
    </div>
  )
}
