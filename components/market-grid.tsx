"use client"

import { MarketCard } from "./market-card"
import { MARKETS } from "@/lib/market-data"

interface MarketGridProps {
  selectedCategory: string
  searchQuery: string
}

export function MarketGrid({ selectedCategory, searchQuery }: MarketGridProps) {
  let filteredMarkets =
    selectedCategory === "All" ||
    selectedCategory === "Trending" ||
    selectedCategory === "Breaking" ||
    selectedCategory === "New"
      ? MARKETS
      : MARKETS.filter((market) => market.category === selectedCategory)

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
    filteredMarkets = filteredMarkets.filter(
      (market) =>
        market.title?.toLowerCase().includes(query) ||
        market.description?.toLowerCase().includes(query) ||
        market.category?.toLowerCase().includes(query),
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-4 text-sm font-light" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
        {filteredMarkets.length} {filteredMarkets.length === 1 ? "market" : "markets"}
        {selectedCategory !== "All" &&
          selectedCategory !== "Trending" &&
          selectedCategory !== "Breaking" &&
          selectedCategory !== "New" && <span> in {selectedCategory}</span>}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredMarkets.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </div>

      {filteredMarkets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg font-light" style={{ color: "rgba(255, 255, 255, 0.3)" }}>
            No markets found
            {searchQuery.trim() ? ` for "${searchQuery}"` : ` in ${selectedCategory}`}
          </p>
        </div>
      )}
    </div>
  )
}
