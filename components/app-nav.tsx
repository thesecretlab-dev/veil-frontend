"use client"

import Link from "next/link"
import { WalletConnect } from "./wallet-connect"
import { BurgerMenu } from "./burger-menu"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { getCategoryColors } from "@/lib/category-colors"

interface AppNavProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  onShowTutorial: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function AppNav({
  selectedCategory,
  onCategoryChange,
  onShowTutorial,
  searchQuery,
  onSearchChange,
}: AppNavProps) {
  const [theme, setThemeState] = useState<"light" | "dark">("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    const initialTheme = savedTheme || "dark"
    setThemeState(initialTheme)

    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark"

    setThemeState(newTheme)
    localStorage.setItem("theme", newTheme)

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <nav className="sticky top-0 z-20 border-b border-white/5 backdrop-blur-xl bg-black/30">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4">
        <Link href="/" className="group flex items-center gap-3 transition-all duration-[1500ms] hover:scale-[1.02]">
          {/* Enhanced triangle with better glow and animation */}
          <div className="relative">
            <svg
              width="32"
              height="32"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-all duration-[1500ms] group-hover:drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]"
              style={{
                filter: "drop-shadow(0 0 10px rgba(16, 185, 129, 0.4))",
              }}
            >
              <defs>
                <linearGradient id="navTriangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(192, 192, 192, 0.5)" />
                  <stop offset="50%" stopColor="rgba(16, 185, 129, 0.45)" />
                  <stop offset="100%" stopColor="rgba(255, 255, 255, 0.3)" />
                </linearGradient>
              </defs>
              <path
                d="M24 40 L8 12 L40 12 Z"
                fill="url(#navTriangleGradient)"
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="1.5"
                className="transition-all duration-[1500ms] group-hover:stroke-emerald-400/50"
              />
            </svg>
          </div>

          {/* VEIL | Markets text with improved styling */}
          <div className="flex items-center gap-2">
            <span
              className="text-2xl font-light tracking-wider transition-all duration-[1500ms] group-hover:text-white/50"
              style={{
                color: "rgba(255, 255, 255, 0.4)",
                textShadow: `
                  0 0 12px rgba(16, 185, 129, 0.35),
                  0 0 24px rgba(16, 185, 129, 0.2)
                `,
              }}
            >
              VEIL
            </span>
            <span
              className="text-xl font-extralight transition-all duration-[1500ms]"
              style={{
                color: "rgba(255, 255, 255, 0.2)",
              }}
            >
              |
            </span>
            <span
              className="text-lg font-light tracking-wide transition-all duration-[1500ms] group-hover:text-white/50"
              style={{
                color: "rgba(255, 255, 255, 0.4)",
                textShadow: `
                  0 0 12px rgba(16, 185, 129, 0.35),
                  0 0 24px rgba(16, 185, 129, 0.2)
                `,
              }}
            >
              Markets
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <input
            type="text"
            placeholder="Search markets..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-80 rounded-lg border border-white/10 px-4 py-2.5 text-sm font-light backdrop-blur-xl transition-all focus:border-emerald-500/40 focus:outline-none"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              color: "rgba(255, 255, 255, 0.6)",
            }}
          />

          <button
            onClick={onShowTutorial}
            className="text-sm font-light transition-all hover:text-emerald-400"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              textShadow: "0 0 10px rgba(16, 185, 129, 0.3)",
            }}
          >
            How it works
          </button>

          <Link
            href="/app/insights"
            className="text-sm font-light transition-all hover:text-emerald-400"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              textShadow: "0 0 10px rgba(16, 185, 129, 0.3)",
            }}
          >
            Insights
          </Link>

          <button
            onClick={handleThemeToggle}
            className="rounded-lg p-2 transition-all hover:bg-white/5"
            style={{
              color: "rgba(255, 255, 255, 0.6)",
            }}
            aria-label="Toggle theme"
          >
            {mounted && (theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
          </button>

          <WalletConnect />
          <BurgerMenu />
        </div>
      </div>

      {/* Trending + Main Categories */}
      <div className="flex items-center gap-6 border-t border-white/5 px-8 py-3">
        {/* Trending section */}
        <div className="flex items-center gap-3">
          {["Trending", "Breaking", "New"].map((category, index) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className="text-sm font-light transition-all hover:text-emerald-400"
              style={{
                color:
                  selectedCategory === category
                    ? "rgba(16, 185, 129, 0.8)"
                    : index === 0
                      ? "rgba(16, 185, 129, 0.6)"
                      : "rgba(255, 255, 255, 0.6)",
                textShadow:
                  selectedCategory === category
                    ? "0 0 15px rgba(16, 185, 129, 0.4)"
                    : "0 0 10px rgba(16, 185, 129, 0.2)",
              }}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-white/10" />

        {/* Main categories */}
        <div className="flex flex-1 items-center gap-4 overflow-x-auto scrollbar-hide">
          {["Politics", "Sports", "Crypto", "Earnings", "Tech", "Culture", "World", "Economy"].map((category) => {
            const colors = getCategoryColors(category)
            const isSelected = selectedCategory === category

            return (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className="whitespace-nowrap text-sm font-light transition-all"
                style={{
                  color: isSelected ? colors.light : "rgba(255, 255, 255, 0.6)",
                  textShadow: isSelected ? `0 0 12px ${colors.glow}` : "none",
                }}
              >
                {category}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
