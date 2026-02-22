"use client"

import { useEffect, useState } from "react"
import { AppShaderBackground } from "@/components/app-shader-background"
import { MarketGrid } from "@/components/market-grid"
import { AppNav } from "@/components/app-nav"
import { AppFooter } from "@/components/app-footer"
import { HowItWorksModal } from "@/components/how-it-works-modal"

const CATEGORY_MAP: Record<string, string> = {
  all: "All",
  trending: "Trending",
  breaking: "Breaking",
  new: "New",
  politics: "Politics",
  sports: "Sports",
  crypto: "Crypto",
  earnings: "Earnings",
  tech: "Tech",
  culture: "Culture",
  world: "World",
  economy: "Economy",
}

export default function AppPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [showTutorial, setShowTutorial] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

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
    <main className="relative min-h-screen overflow-hidden" style={{ background: "#060606" }}>
      <AppShaderBackground />

      {/* Film grain overlay */}
      <div className="pointer-events-none fixed inset-0 z-50">
        <svg className="h-full w-full opacity-[0.035]">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <AppNav
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onShowTutorial={() => setShowTutorial(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <div className="pt-[140px]">
          <MarketGrid selectedCategory={selectedCategory} searchQuery={searchQuery} />
        </div>
        <AppFooter />
      </div>

      <HowItWorksModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
    </main>
  )
}
