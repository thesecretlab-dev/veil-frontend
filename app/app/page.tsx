"use client"

import { useEffect, useState } from "react"
import { MarketGrid } from "@/components/market-grid"
import { NativeCreateBar } from "@/components/native-create-bar"
import { AppNav } from "@/components/app-nav"
import { AppFooter } from "@/components/app-footer"
import { MarketsToolbar, type MarketLayout, type MarketSort } from "@/components/markets-toolbar"

const CATEGORY_MAP: Record<string, string> = {
  all: "All",
  native: "Native",
  global: "Global",
  world: "Global",
  macro: "Macro",
  economy: "Macro",
  tech: "Tech",
  sports: "Sports",
  politics: "Politics",
  crypto: "Crypto",
}

export default function AppPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Native")
  const [searchQuery, setSearchQuery] = useState("")
  const [sort, setSort] = useState<MarketSort>("trending")
  const [layout, setLayout] = useState<MarketLayout>("grid")
  const [marketTick, setMarketTick] = useState(0)

  useEffect(() => {
    const syncCategoryFromUrl = () => {
      const raw = new URLSearchParams(window.location.search).get("category")?.trim().toLowerCase() || ""
      if (!raw) return
      const mapped = CATEGORY_MAP[raw]
      if (mapped) setSelectedCategory(mapped)
    }
    syncCategoryFromUrl()
    window.addEventListener("popstate", syncCategoryFromUrl)
    return () => window.removeEventListener("popstate", syncCategoryFromUrl)
  }, [])

  return (
    <main className="relative min-h-screen" style={{ background: "#000000" }}>
      <div className="relative z-10 flex min-h-screen flex-col">
        <AppNav />
        <div className="pt-[72px]">
          <MarketsToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sort={sort}
            onSortChange={setSort}
            layout={layout}
            onLayoutChange={setLayout}
          />
          <NativeCreateBar onCreated={() => setMarketTick((n) => n + 1)} />
          <MarketGrid
            key={marketTick}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            sort={sort}
            layout={layout}
          />
        </div>
        <AppFooter />
      </div>
    </main>
  )
}
