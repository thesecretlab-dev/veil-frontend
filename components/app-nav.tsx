"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { WalletConnect } from "./wallet-connect"
import { GooeyPills } from "@/components/gooey-nav"
import { ECOSYSTEM_FLOW, flowActive } from "@/lib/flow-nav"
import { RuntimeBanner } from "@/components/runtime-banner"

interface AppNavProps {
  selectedCategory?: string
  onCategoryChange?: (category: string) => void
  onShowTutorial?: () => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

export function AppNav({
  selectedCategory,
  onCategoryChange,
  onSearchChange,
}: AppNavProps) {
  const path = usePathname() || "/app"
  const showMarketsChrome = Boolean(onCategoryChange && onSearchChange)

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[120]"
      style={{
        background: "rgba(6, 6, 6, 0.8)",
        backdropFilter: "blur(24px) saturate(1.2)",
        WebkitBackdropFilter: "blur(24px) saturate(1.2)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
        paddingRight: 48,
        pointerEvents: "auto",
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 md:px-10">
        {/* Left: Logo */}
        <Link href="/" className="group flex items-center gap-2.5 transition-all duration-700 hover:scale-[1.02]">
          <div className="relative">
            <svg
              width="22"
              height="22"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-all duration-700 group-hover:drop-shadow-[0_0_18px_rgba(16,185,129,0.85)]"
              style={{ filter: "drop-shadow(0 0 8px rgba(16, 185, 129, 0.65))" }}
              aria-hidden
            >
              <path d="M24 42 L6 8 L42 8 Z" fill="#10B981" />
            </svg>
          </div>
          <span
            className="text-[20px] font-bold tracking-[0.06em] transition-all duration-700 group-hover:text-white"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "0.06em",
            }}
          >
            VEIL
          </span>
        </Link>

        <div className="flex-1" />

        <div className="flex items-center gap-5">
          <RuntimeBanner compact />
          {ECOSYSTEM_FLOW.map((item) => {
            const on = flowActive(path, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                className="hidden md:inline-block text-[13px] transition-all duration-500 hover:text-emerald-400"
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  color: on ? "#23E985" : "rgba(255, 255, 255, 0.45)",
                  fontWeight: on ? 600 : 400,
                  pointerEvents: "auto",
                  paddingBottom: 3,
                  borderBottom: on ? "2px solid #23E985" : "2px solid transparent",
                }}
              >
                {item.label}
              </Link>
            )
          })}

          <WalletConnect />
        </div>
      </div>

      {showMarketsChrome && selectedCategory && onCategoryChange ? (
      <div
        className="flex items-center gap-3 overflow-x-auto px-6 pb-3.5 md:px-10 scrollbar-hide"
        style={{ borderTop: "1px solid rgba(255, 255, 255, 0.03)" }}
      >
        <GooeyPills
          items={["All", "Trending", "Breaking", "New"]}
          value={selectedCategory}
          onChange={onCategoryChange}
        />
        <div className="mx-1 h-4 w-px shrink-0" style={{ background: "rgba(255, 255, 255, 0.06)" }} />
        <GooeyPills
          items={["Native", "Politics", "Sports", "Crypto", "Earnings", "Tech", "Culture", "World", "Economy"]}
          value={selectedCategory}
          onChange={onCategoryChange}
        />
      </div>
      ) : null}
    </nav>
  )
}
