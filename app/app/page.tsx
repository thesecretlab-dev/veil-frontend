"use client"

import { useState } from "react"
import { AppShaderBackground } from "@/components/app-shader-background"
import { MarketGrid } from "@/components/market-grid"
import { AppNav } from "@/components/app-nav"
import { AppFooter } from "@/components/app-footer"
import { HowItWorksModal } from "@/components/how-it-works-modal"

export default function AppPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [showTutorial, setShowTutorial] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <AppShaderBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <AppNav
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onShowTutorial={() => setShowTutorial(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <MarketGrid selectedCategory={selectedCategory} searchQuery={searchQuery} />
        <AppFooter />
      </div>

      <HowItWorksModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
    </main>
  )
}
