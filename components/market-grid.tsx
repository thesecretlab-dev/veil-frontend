"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import type { Market } from "@/lib/market-data"
import { fetchMarkets } from "@/lib/market-api-client"
import { MarketCard } from "./market-card"

interface MarketGridProps {
  selectedCategory: string
  searchQuery: string
}

function MarketCardSkeleton({ index }: { index: number }) {
  return (
    <div
      className="animate-pulse"
      style={{
        borderRadius: "20px",
        background: "rgba(255, 255, 255, 0.015)",
        border: "1px solid rgba(255, 255, 255, 0.04)",
        padding: "1.5rem",
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="h-5 w-16 rounded-full" style={{ background: "rgba(255, 255, 255, 0.05)" }} />
        <div className="h-5 w-20 rounded-full" style={{ background: "rgba(255, 255, 255, 0.04)" }} />
      </div>
      <div className="mb-5 flex gap-3.5">
        <div className="h-11 w-11 shrink-0" style={{ borderRadius: "12px", background: "rgba(255, 255, 255, 0.04)" }} />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-full rounded" style={{ background: "rgba(255, 255, 255, 0.05)" }} />
          <div className="h-3 w-1/2 rounded" style={{ background: "rgba(255, 255, 255, 0.03)" }} />
        </div>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-2.5">
        <div className="h-14" style={{ borderRadius: "12px", background: "rgba(16, 185, 129, 0.04)" }} />
        <div className="h-14" style={{ borderRadius: "12px", background: "rgba(239, 68, 68, 0.03)" }} />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-3 w-20 rounded" style={{ background: "rgba(255, 255, 255, 0.03)" }} />
        <div className="h-3 w-16 rounded" style={{ background: "rgba(255, 255, 255, 0.03)" }} />
      </div>
    </div>
  )
}

function normalizeCategory(category: string): string {
  return category.toLowerCase()
}

export function MarketGrid({ selectedCategory, searchQuery }: MarketGridProps) {
  const [markets, setMarkets] = useState<Market[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const loadMarkets = async (initial: boolean) => {
      const nextMarkets = await fetchMarkets()
      if (!cancelled) {
        setMarkets(nextMarkets)
        if (initial) setIsLoading(false)
      }
    }
    void loadMarkets(true)
    const interval = setInterval(() => void loadMarkets(false), 15_000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  const filteredMarkets = useMemo(() => {
    const categoryFiltered =
      selectedCategory === "All" || selectedCategory === "Trending" || selectedCategory === "Breaking" || selectedCategory === "New"
        ? markets
        : markets.filter((market) => normalizeCategory(market.category) === normalizeCategory(selectedCategory))

    const query = searchQuery.trim().toLowerCase()
    const textFiltered =
      query.length === 0
        ? categoryFiltered
        : categoryFiltered.filter((market) => {
            const title = market.title?.toLowerCase() || ""
            const description = market.details?.description?.toLowerCase() || ""
            const category = market.category?.toLowerCase() || ""
            const slug = market.marketSlug?.toLowerCase() || ""
            return title.includes(query) || description.includes(query) || category.includes(query) || slug.includes(query)
          })

    if (selectedCategory === "Breaking") {
      return [...textFiltered].sort((a, b) => Math.abs(b.change24h || 0) - Math.abs(a.change24h || 0))
    }
    if (selectedCategory === "New") {
      return [...textFiltered].sort((a, b) => {
        const aTs = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
        const bTs = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
        return bTs - aTs
      })
    }
    if (selectedCategory === "Trending") {
      return [...textFiltered].sort((a, b) => Math.abs(b.change24h || 0) - Math.abs(a.change24h || 0))
    }
    return textFiltered
  }, [markets, searchQuery, selectedCategory])

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8 md:px-10">
      {/* Status bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div
          className="text-[13px]"
          style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255, 255, 255, 0.3)" }}
        >
          {isLoading ? "Loading live markets..." : `${filteredMarkets.length} ${filteredMarkets.length === 1 ? "market" : "markets"}`}
          {selectedCategory !== "All" && selectedCategory !== "Trending" && selectedCategory !== "Breaking" && selectedCategory !== "New" && (
            <span> in {selectedCategory}</span>
          )}
        </div>
        <div
          className="flex items-center gap-1.5 px-3 py-1 text-[10px] tracking-[0.1em] uppercase"
          style={{
            fontFamily: "var(--font-space-grotesk)",
            borderRadius: "100px",
            background: "rgba(16, 185, 129, 0.06)",
            border: "1px solid rgba(16, 185, 129, 0.12)",
            color: "rgba(16, 185, 129, 0.7)",
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/60 animate-pulse" />
          Live feed: Polymarket
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => <MarketCardSkeleton key={`skeleton-${index}`} index={index} />)
            : filteredMarkets.map((market) => <MarketCard key={market.id} market={market} />)}
        </AnimatePresence>
      </div>

      {!isLoading && filteredMarkets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24">
          <p
            className="text-lg"
            style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255, 255, 255, 0.25)" }}
          >
            No markets found
            {searchQuery.trim() ? ` for "${searchQuery}"` : ` in ${selectedCategory}`}
          </p>
        </div>
      )}
    </div>
  )
}
