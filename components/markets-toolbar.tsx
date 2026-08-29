"use client"

import { useEffect, useRef, useState } from "react"

export const MARKET_CHIPS = ["All", "Native", "Global", "Macro", "Tech", "Sports", "Politics", "Crypto"] as const

export type MarketSort = "trending" | "new" | "volume"
export type MarketLayout = "grid" | "list"

const SORT_LABEL: Record<MarketSort, string> = {
  trending: "Trending",
  new: "New",
  volume: "Volume",
}

export function MarketsToolbar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sort,
  onSortChange,
  layout,
  onLayoutChange,
}: {
  searchQuery: string
  onSearchChange: (q: string) => void
  selectedCategory: string
  onCategoryChange: (c: string) => void
  sort: MarketSort
  onSortChange: (s: MarketSort) => void
  layout: MarketLayout
  onLayoutChange: (l: MarketLayout) => void
}) {
  const input = useRef<HTMLInputElement>(null)
  const [sortOpen, setSortOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) return
      if (e.key === "/") {
        e.preventDefault()
        input.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-3 px-6 pb-5 pt-2 md:px-10">
      <div
        className="flex items-center gap-2 px-3"
        style={{
          height: 44,
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3-3" />
        </svg>
        <input
          ref={input}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search markets"
          className="h-full flex-1 bg-transparent text-[14px] outline-none"
          style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.9)" }}
        />
        <kbd
          className="hidden sm:inline-flex items-center justify-center rounded"
          style={{
            minWidth: 22,
            height: 22,
            padding: "0 6px",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.4)",
            fontFamily: "var(--font-space-grotesk)",
            fontSize: 11,
          }}
        >
          /
        </kbd>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div
          className="flex items-center overflow-x-auto"
          style={{
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.1)",
            padding: 3,
          }}
        >
          {MARKET_CHIPS.map((chip) => {
            const on = selectedCategory === chip
            return (
              <button
                key={chip}
                type="button"
                onClick={() => onCategoryChange(chip)}
                className="whitespace-nowrap px-3 py-1.5 text-[13px]"
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  color: on ? "#ffffff" : "rgba(255,255,255,0.48)",
                  background: "transparent",
                  border: on ? "1px solid rgba(16,185,129,0.7)" : "1px solid transparent",
                  borderRadius: 8,
                }}
              >
                {chip}
              </button>
            )
          })}
        </div>

        <div className="relative ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSortOpen((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[13px]"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: "rgba(255,255,255,0.82)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 10,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.8" aria-hidden>
              <path d="M4 19V9M10 19V5M16 19v-7" />
              <path d="M14 7l6-4v6" />
            </svg>
            {SORT_LABEL[sort]}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {sortOpen ? (
            <div
              className="absolute right-0 top-[calc(100%+6px)] z-20 min-w-[140px] overflow-hidden rounded-xl py-1"
              style={{ background: "#0a0c0b", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(Object.keys(SORT_LABEL) as MarketSort[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  className="block w-full px-3 py-2 text-left text-[12px]"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: sort === key ? "#6ee7b7" : "rgba(255,255,255,0.75)",
                  }}
                  onClick={() => {
                    onSortChange(key)
                    setSortOpen(false)
                  }}
                >
                  {SORT_LABEL[key]}
                </button>
              ))}
            </div>
          ) : null}

          <div
            className="flex overflow-hidden"
            style={{ borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <button
              type="button"
              aria-label="Grid view"
              onClick={() => onLayoutChange("grid")}
              className="flex h-9 w-9 items-center justify-center"
              style={{
                background: layout === "grid" ? "rgba(16,185,129,0.08)" : "transparent",
                borderRight: "1px solid rgba(255,255,255,0.08)",
                color: layout === "grid" ? "#34d399" : "rgba(255,255,255,0.4)",
                boxShadow: layout === "grid" ? "inset 0 0 0 1px rgba(16,185,129,0.7)" : "none",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="List view"
              onClick={() => onLayoutChange("list")}
              className="flex h-9 w-9 items-center justify-center"
              style={{
                color: layout === "list" ? "#34d399" : "rgba(255,255,255,0.4)",
                boxShadow: layout === "list" ? "inset 0 0 0 1px rgba(16,185,129,0.7)" : "none",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
