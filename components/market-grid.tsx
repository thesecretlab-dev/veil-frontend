"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence } from "framer-motion"
import type { Market } from "@/lib/market-data"
import { fetchMarkets } from "@/lib/market-api-client"
import { MarketCard } from "./market-card"
import type { MarketLayout, MarketSort } from "./markets-toolbar"

interface MarketGridProps {
  selectedCategory: string
  searchQuery: string
  sort?: MarketSort
  layout?: MarketLayout
}

const PAGE_SIZE_GRID = 4
const PAGE_SIZE_LIST = 6

function MarketCardSkeleton() {
  return (
    <div
      className="animate-pulse"
      style={{
        borderRadius: "18px",
        background: "#0a0a0a",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        padding: "1.4rem",
        minHeight: 240,
      }}
    />
  )
}

function normalizeCategory(category: string): string {
  return category.toLowerCase()
}

function aliases(category: string): string[] {
  const c = normalizeCategory(category)
  if (c === "global") return ["global", "world"]
  if (c === "macro") return ["macro", "economy"]
  return [c]
}

function Pagination({ page, pages, onPage }: { page: number; pages: number; onPage: (n: number) => void }) {
  if (pages <= 1) return null
  const last = pages
  const wanted = new Set([1, 2, 3, page, page - 1, page + 1, last])
  const nums = [...wanted].filter((n) => n >= 1 && n <= last).sort((a, b) => a - b)
  const items: (number | "gap")[] = []
  for (const n of nums) {
    const prev = items[items.length - 1]
    if (typeof prev === "number" && n - prev > 1) items.push("gap")
    items.push(n)
  }

  return (
    <div className="mt-10 flex items-center justify-center gap-1.5">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
        className="flex h-8 w-8 items-center justify-center text-[14px] disabled:opacity-30"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        ‹
      </button>
      {items.map((it, i) =>
        it === "gap" ? (
          <span key={`g-${i}`} className="px-1 text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>
            …
          </span>
        ) : (
          <button
            key={it}
            type="button"
            onClick={() => onPage(it)}
            className="flex h-8 w-8 items-center justify-center text-[13px]"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              borderRadius: 8,
              background: it === page ? "#22c55e" : "transparent",
              color: it === page ? "#04140c" : "rgba(255,255,255,0.7)",
              fontWeight: it === page ? 700 : 400,
            }}
          >
            {it}
          </button>
        ),
      )}
      <button
        type="button"
        aria-label="Next page"
        disabled={page >= pages}
        onClick={() => onPage(page + 1)}
        className="flex h-8 w-8 items-center justify-center text-[14px] disabled:opacity-30"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        ›
      </button>
    </div>
  )
}

export function MarketGrid({ selectedCategory, searchQuery, sort = "trending", layout = "grid" }: MarketGridProps) {
  const [markets, setMarkets] = useState<Market[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)

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
    const interval = setInterval(() => void loadMarkets(false), 5_000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    setPage(1)
  }, [selectedCategory, searchQuery, sort, layout])

  const filteredMarkets = useMemo(() => {
    const categoryFiltered =
      selectedCategory === "Native"
        ? markets.filter((market) => Boolean(market.veilMarketId) || normalizeCategory(market.category) === "native")
        : selectedCategory === "All"
          ? markets
          : markets.filter((market) => aliases(selectedCategory).includes(normalizeCategory(market.category)))

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

    const sorted = [...textFiltered]
    if (sort === "new") {
      sorted.sort((a, b) => {
        const aTs = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
        const bTs = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
        return bTs - aTs
      })
    } else if (sort === "volume") {
      sorted.sort((a, b) => (b.volumeNum || 0) - (a.volumeNum || 0))
    } else {
      sorted.sort((a, b) => Math.abs(b.change24h || 0) - Math.abs(a.change24h || 0))
    }
    return sorted
  }, [markets, searchQuery, selectedCategory, sort])

  const pageSize = layout === "list" ? PAGE_SIZE_LIST : PAGE_SIZE_GRID
  const pages = Math.max(1, Math.ceil(filteredMarkets.length / pageSize))
  const current = Math.min(page, pages)
  const slice = filteredMarkets.slice((current - 1) * pageSize, current * pageSize)

  return (
    <div className="mx-auto max-w-[1100px] px-6 pb-16 md:px-10">
      <div className={layout === "list" ? "flex flex-col gap-4" : "grid grid-cols-1 gap-6 md:grid-cols-2"}>
        <AnimatePresence mode="popLayout">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => <MarketCardSkeleton key={`skeleton-${index}`} />)
            : slice.map((market) => <MarketCard key={market.id} market={market} layout={layout} />)}
        </AnimatePresence>
      </div>

      {!isLoading && filteredMarkets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24">
          <p className="text-lg" style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255, 255, 255, 0.28)" }}>
            No books
            {searchQuery.trim()
              ? ` for "${searchQuery}"`
              : selectedCategory === "Native"
                ? " on this router. Create one above."
                : ` in ${selectedCategory}`}
          </p>
        </div>
      )}

      <Pagination page={current} pages={pages} onPage={setPage} />
    </div>
  )
}
