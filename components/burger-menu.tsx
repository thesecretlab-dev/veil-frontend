"use client"

import { useState } from "react"
import Link from "next/link"

export function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 backdrop-blur-xl transition-all hover:border-emerald-500/40 hover:bg-white/5"
        style={{
          background: "rgba(255, 255, 255, 0.03)",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Menu */}
          <div
            className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-white/10 p-4 shadow-2xl backdrop-blur-xl"
            style={{
              background: "rgba(0, 0, 0, 0.85)",
              boxShadow: "0 0 40px rgba(16, 185, 129, 0.15)",
            }}
          >
            {/* Menu items */}
            <div className="space-y-1">
              <Link
                href="/app/leaderboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 transition-all hover:bg-white/5"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M6 14h2V9H6v5zm3 0h2V6H9v8zm3 0h2v-3h-2v3z" fill="rgba(16, 185, 129, 0.6)" />
                  <path
                    d="M4 18h12a2 2 0 002-2V4a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"
                    stroke="rgba(16, 185, 129, 0.6)"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
                <span
                  className="font-medium"
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontFamily: "var(--font-space-grotesk)",
                    textShadow: "0 0 10px rgba(16, 185, 129, 0.2)",
                  }}
                >
                  Leaderboard
                </span>
              </Link>

              <Link
                href="/app/rewards"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 transition-all hover:bg-white/5"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="7" stroke="rgba(16, 185, 129, 0.6)" strokeWidth="1.5" fill="none" />
                  <path d="M10 7v3l2 2" stroke="rgba(16, 185, 129, 0.6)" strokeWidth="1.5" strokeLinecap="round" />
                  <path
                    d="M10 3v1M10 16v1M3 10h1M16 10h1"
                    stroke="rgba(16, 185, 129, 0.6)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span
                  className="font-medium"
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontFamily: "var(--font-space-grotesk)",
                    textShadow: "0 0 10px rgba(16, 185, 129, 0.2)",
                  }}
                >
                  Rewards
                </span>
              </Link>

              <Link
                href="/app/portfolio"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 transition-all hover:bg-white/5"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect
                    x="3"
                    y="5"
                    width="14"
                    height="11"
                    rx="2"
                    stroke="rgba(16, 185, 129, 0.6)"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    d="M3 8h14M7 5V3M13 5V3"
                    stroke="rgba(16, 185, 129, 0.6)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span
                  className="font-medium"
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontFamily: "var(--font-space-grotesk)",
                    textShadow: "0 0 10px rgba(16, 185, 129, 0.2)",
                  }}
                >
                  Portfolio
                </span>
              </Link>

              <Link
                href="/app/defi"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 transition-all hover:bg-white/5"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="7" stroke="rgba(16, 185, 129, 0.6)" strokeWidth="1.5" fill="none" />
                  <path d="M10 6v4l3 2" stroke="rgba(16, 185, 129, 0.6)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span
                  className="font-medium"
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontFamily: "var(--font-space-grotesk)",
                    textShadow: "0 0 10px rgba(16, 185, 129, 0.2)",
                  }}
                >
                  DeFi
                </span>
              </Link>

              <Link
                href="/app/api-docs"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 transition-all hover:bg-white/5"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M6 4l8 6-8 6V4z" stroke="rgba(16, 185, 129, 0.6)" strokeWidth="1.5" fill="none" />
                </svg>
                <span
                  className="font-medium"
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontFamily: "var(--font-space-grotesk)",
                    textShadow: "0 0 10px rgba(16, 185, 129, 0.2)",
                  }}
                >
                  APIs
                </span>
              </Link>

              <Link
                href="/app/ecosystem"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 transition-all hover:bg-white/5"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="5" cy="10" r="2" fill="rgba(16, 185, 129, 0.65)" />
                  <circle cx="15" cy="10" r="2" fill="rgba(16, 185, 129, 0.65)" />
                  <circle cx="10" cy="5" r="2" fill="rgba(16, 185, 129, 0.65)" />
                  <circle cx="10" cy="15" r="2" fill="rgba(16, 185, 129, 0.65)" />
                  <path d="M7 10h6M10 7v6" stroke="rgba(16, 185, 129, 0.55)" strokeWidth="1.5" />
                </svg>
                <span
                  className="font-medium"
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontFamily: "var(--font-space-grotesk)",
                    textShadow: "0 0 10px rgba(16, 185, 129, 0.2)",
                  }}
                >
                  Ecosystem
                </span>
              </Link>

              <Link
                href="/maiev"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 transition-all hover:bg-white/5"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 4h12v12H4z" stroke="rgba(16, 185, 129, 0.6)" strokeWidth="1.5" />
                  <path d="M7 8h6M7 11h6M7 14h4" stroke="rgba(16, 185, 129, 0.6)" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                <span
                  className="font-medium"
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    fontFamily: "var(--font-space-grotesk)",
                    textShadow: "0 0 10px rgba(16, 185, 129, 0.2)",
                  }}
                >
                  MAIEV Audits
                </span>
              </Link>
            </div>

            {/* Divider */}
            <div className="my-3 h-px bg-white/10" />

            {/* Bottom links */}
            <div className="space-y-1">
              <Link
                href="/app/docs"
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-4 py-2 text-sm transition-all hover:bg-white/5"
                style={{
                  color: "rgba(255, 255, 255, 0.5)",
                  fontFamily: "var(--font-space-grotesk)",
                }}
              >
                Documentation
              </Link>
              <Link
                href="/app/terms"
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-4 py-2 text-sm transition-all hover:bg-white/5"
                style={{
                  color: "rgba(255, 255, 255, 0.5)",
                  fontFamily: "var(--font-space-grotesk)",
                }}
              >
                Terms of Use
              </Link>
              <Link
                href="/app/support"
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-4 py-2 text-sm transition-all hover:bg-white/5"
                style={{
                  color: "rgba(255, 255, 255, 0.5)",
                  fontFamily: "var(--font-space-grotesk)",
                }}
              >
                Support
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
