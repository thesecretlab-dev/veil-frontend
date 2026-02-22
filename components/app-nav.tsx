"use client"

import Link from "next/link"
import { WalletConnect } from "./wallet-connect"
import { BurgerMenu } from "./burger-menu"
import { Moon, Sun, Search } from "lucide-react"
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
  const [searchFocused, setSearchFocused] = useState(false)

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
    <nav
      className="fixed top-0 left-0 right-0 z-30"
      style={{
        background: "rgba(6, 6, 6, 0.8)",
        backdropFilter: "blur(24px) saturate(1.2)",
        WebkitBackdropFilter: "blur(24px) saturate(1.2)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 md:px-10">
        {/* Left: Logo */}
        <Link href="/" className="group flex items-center gap-3 transition-all duration-700 hover:scale-[1.02]">
          <div className="relative">
            <svg
              width="28"
              height="28"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-all duration-700 group-hover:drop-shadow-[0_0_16px_rgba(16,185,129,0.6)]"
              style={{ filter: "drop-shadow(0 0 8px rgba(16, 185, 129, 0.35))" }}
            >
              <defs>
                <linearGradient id="navTriGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(16, 185, 129, 0.6)" />
                  <stop offset="100%" stopColor="rgba(255, 255, 255, 0.25)" />
                </linearGradient>
              </defs>
              <path
                d="M24 42 L6 8 L42 8 Z"
                fill="url(#navTriGrad)"
                stroke="rgba(16, 185, 129, 0.3)"
                strokeWidth="1"
              />
            </svg>
          </div>
          <span
            className="text-[22px] tracking-[0.2em] transition-all duration-700 group-hover:text-white/70"
            style={{
              fontFamily: "var(--font-instrument-serif)",
              color: "rgba(255, 255, 255, 0.5)",
              letterSpacing: "0.2em",
            }}
          >
            VEIL
          </span>
        </Link>

        {/* Center: Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-12">
          <div
            className="relative w-full transition-all duration-500"
            style={{
              borderRadius: "12px",
              border: searchFocused ? "1px solid rgba(16, 185, 129, 0.25)" : "1px solid rgba(255, 255, 255, 0.06)",
              background: "rgba(255, 255, 255, 0.02)",
            }}
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "rgba(255, 255, 255, 0.25)" }} />
            <input
              type="text"
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full bg-transparent pl-10 pr-4 py-2.5 text-sm outline-none"
              style={{
                fontFamily: "var(--font-figtree)",
                color: "rgba(255, 255, 255, 0.7)",
              }}
            />
          </div>
        </div>

        {/* Right: Links + Wallet */}
        <div className="flex items-center gap-5">
          {[
            { label: "How it works", action: onShowTutorial },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="hidden lg:inline text-[13px] transition-all duration-500 hover:text-emerald-400"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: "rgba(255, 255, 255, 0.4)",
              }}
            >
              {item.label}
            </button>
          ))}

          {[
            { label: "Markets", href: "/app/markets" },
            { label: "Agents", href: "/app/agents" },
            { label: "DeFi", href: "/app/defi" },
            { label: "Docs", href: "/app/docs" },
            { label: "Ecosystem", href: "/app/ecosystem" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hidden lg:inline text-[13px] transition-all duration-500 hover:text-emerald-400"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: "rgba(255, 255, 255, 0.4)",
              }}
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={handleThemeToggle}
            className="rounded-lg p-2 transition-all duration-500 hover:bg-white/[0.04]"
            style={{ color: "rgba(255, 255, 255, 0.35)" }}
            aria-label="Toggle theme"
          >
            {mounted && (theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
          </button>

          <WalletConnect />
          <BurgerMenu />
        </div>
      </div>

      {/* Category pills */}
      <div
        className="flex items-center gap-2 overflow-x-auto px-6 pb-3.5 md:px-10 scrollbar-hide"
        style={{ borderTop: "1px solid rgba(255, 255, 255, 0.03)" }}
      >
        {["All", "Trending", "Breaking", "New"].map((category) => {
          const isActive = selectedCategory === category
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className="whitespace-nowrap px-4 py-1.5 text-[13px] transition-all duration-500"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                borderRadius: "100px",
                background: isActive ? "rgba(16, 185, 129, 0.12)" : "transparent",
                border: isActive ? "1px solid rgba(16, 185, 129, 0.25)" : "1px solid transparent",
                color: isActive ? "rgba(16, 185, 129, 0.9)" : "rgba(255, 255, 255, 0.4)",
              }}
            >
              {category}
            </button>
          )
        })}

        <div className="mx-2 h-4 w-px shrink-0" style={{ background: "rgba(255, 255, 255, 0.06)" }} />

        {["Politics", "Sports", "Crypto", "Earnings", "Tech", "Culture", "World", "Economy"].map((category) => {
          const isActive = selectedCategory === category
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className="whitespace-nowrap px-4 py-1.5 text-[13px] transition-all duration-500"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                borderRadius: "100px",
                background: isActive ? "rgba(16, 185, 129, 0.12)" : "transparent",
                border: isActive ? "1px solid rgba(16, 185, 129, 0.25)" : "1px solid transparent",
                color: isActive ? "rgba(16, 185, 129, 0.9)" : "rgba(255, 255, 255, 0.4)",
              }}
            >
              {category}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
