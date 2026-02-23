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
            {/* Primary — Trading */}
            <div className="mb-1">
              <p className="px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase" style={{ color: "rgba(16, 185, 129, 0.4)", fontFamily: "var(--font-space-grotesk)" }}>Trade</p>
            </div>
            <div className="space-y-0.5">
              {[
                { label: "Markets", href: "/app/markets" },
                { label: "Portfolio", href: "/app/portfolio" },
                { label: "Leaderboard", href: "/app/leaderboard" },
                { label: "Rewards", href: "/app/rewards" },
              ].map((item) => (
                <Link key={item.label} href={item.href} onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-4 py-2.5 text-sm transition-all hover:bg-white/5"
                  style={{ color: "rgba(255, 255, 255, 0.7)", fontFamily: "var(--font-space-grotesk)" }}>
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="my-3 h-px bg-white/10" />

            {/* Protocol */}
            <div className="mb-1">
              <p className="px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase" style={{ color: "rgba(16, 185, 129, 0.4)", fontFamily: "var(--font-space-grotesk)" }}>Protocol</p>
            </div>
            <div className="space-y-0.5">
              {[
                { label: "Agents (ANIMA)", href: "/app/agents" },
                { label: "DeFi & Staking", href: "/app/defi" },
                { label: "Governance", href: "/app/gov" },
                { label: "Ecosystem", href: "/app/ecosystem" },
                { label: "MAIEV Evidence", href: "/maiev" },
                { label: "Transparency", href: "/app/transparency" },
              ].map((item) => (
                <Link key={item.label} href={item.href} onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-4 py-2.5 text-sm transition-all hover:bg-white/5"
                  style={{ color: "rgba(255, 255, 255, 0.7)", fontFamily: "var(--font-space-grotesk)" }}>
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="my-3 h-px bg-white/10" />

            {/* Resources */}
            <div className="mb-1">
              <p className="px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase" style={{ color: "rgba(16, 185, 129, 0.4)", fontFamily: "var(--font-space-grotesk)" }}>Resources</p>
            </div>
            <div className="space-y-0.5">
              {[
                { label: "Documentation", href: "/app/docs" },
                { label: "API Reference", href: "/app/api-docs" },
                { label: "Blog", href: "/app/blog" },
                { label: "Investor Deck", href: "/app/investor-deck" },
                { label: "Onboarding", href: "/app/onboard" },
                { label: "MVP Launch", href: "/app/launch" },
              ].map((item) => (
                <Link key={item.label} href={item.href} onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-4 py-2.5 text-sm transition-all hover:bg-white/5"
                  style={{ color: "rgba(255, 255, 255, 0.5)", fontFamily: "var(--font-space-grotesk)" }}>
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="my-3 h-px bg-white/10" />

            {/* Legal */}
            <div className="space-y-0.5">
              {[
                { label: "Terms", href: "/app/terms" },
                { label: "Privacy", href: "/app/privacy" },
                { label: "Compliance", href: "/app/compliance" },
                { label: "Support", href: "/app/support" },
              ].map((item) => (
                <Link key={item.label} href={item.href} onClick={() => setIsOpen(false)}
                  className="block rounded-lg px-4 py-2 text-xs transition-all hover:bg-white/5"
                  style={{ color: "rgba(255, 255, 255, 0.35)", fontFamily: "var(--font-space-grotesk)" }}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
