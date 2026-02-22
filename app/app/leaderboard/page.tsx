"use client"

import Link from "next/link"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay }}
    >
      {children}
    </motion.div>
  )
}

const leaderboardData = [
  { rank: 1, address: "0x742d...35a3", volume: "$2,847,392", profit: "+$284,739", winRate: "68%", trades: 1247 },
  { rank: 2, address: "0x8f3c...92b1", volume: "$2,103,847", profit: "+$189,346", winRate: "64%", trades: 892 },
  { rank: 3, address: "0x1a9e...47d2", volume: "$1,892,103", profit: "+$151,368", winRate: "62%", trades: 743 },
  { rank: 4, address: "0x5c2b...83f9", volume: "$1,647,291", profit: "+$131,783", winRate: "61%", trades: 634 },
  { rank: 5, address: "0x9d4a...26e8", volume: "$1,523,847", profit: "+$121,908", winRate: "59%", trades: 589 },
  { rank: 6, address: "0x3e7f...91c4", volume: "$1,392,103", profit: "+$111,368", winRate: "58%", trades: 521 },
  { rank: 7, address: "0x6b8c...45a7", volume: "$1,284,736", profit: "+$102,779", winRate: "57%", trades: 478 },
  { rank: 8, address: "0x2f1d...68b3", volume: "$1,147,291", profit: "+$91,783", winRate: "56%", trades: 423 },
  { rank: 9, address: "0x7a3e...92f5", volume: "$1,023,847", profit: "+$81,908", winRate: "55%", trades: 387 },
  { rank: 10, address: "0x4c9b...37d1", volume: "$947,103", profit: "+$75,768", winRate: "54%", trades: 356 },
]

const stats = [
  { label: "Total Volume", value: "$47.2M", change: "+12.4%" },
  { label: "Active Traders", value: "8,392", change: "+8.7%" },
  { label: "Markets Traded", value: "1,247", change: "+15.2%" },
]

export default function LeaderboardPage() {
  return (
    <div className="relative min-h-screen" style={{ background: "#060606" }}>
      {/* Film Grain */}
      <div
        className="pointer-events-none fixed inset-0 z-[9999]"
        style={{
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{ background: "rgba(6,6,6,0.85)", backdropFilter: "blur(20px)", borderColor: "rgba(255,255,255,0.04)" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          <Link href="/app" style={{ fontFamily: "var(--font-instrument-serif)", fontSize: "1.5rem", color: "rgba(255,255,255,0.9)", letterSpacing: "-0.02em" }}>
            VEIL
          </Link>
          <div className="flex items-center gap-8">
            {["Markets", "Leaderboard", "Rewards", "Blog"].map((item) => (
              <Link
                key={item}
                href={`/app/${item.toLowerCase()}`}
                className="transition-colors hover:text-white"
                style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "0.85rem", color: item === "Leaderboard" ? "rgba(16,185,129,0.9)" : "rgba(255,255,255,0.45)", letterSpacing: "0.05em", textTransform: "uppercase" as const }}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-8 pt-36 pb-32">
        {/* Hero */}
        <ScrollReveal>
          <div className="mb-16">
            <span
              className="mb-6 inline-block text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.6)" }}
            >
              01 — Rankings
            </span>
            <h1
              className="text-6xl leading-[1.05]"
              style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.9)", letterSpacing: "-0.03em" }}
            >
              Leaderboard
            </h1>
            <p
              className="mt-5 max-w-lg text-lg leading-relaxed"
              style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.4)" }}
            >
              Top traders on VEIL this month.
            </p>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <ScrollReveal delay={0.1}>
          <div className="mb-12 grid gap-5 md:grid-cols-3">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="rounded-[20px] p-7"
                style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <div className="text-xs tracking-[0.15em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.35)" }}>
                  {stat.label}
                </div>
                <div className="mt-3 text-4xl font-light" style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.9)" }}>
                  {stat.value}
                </div>
                <div className="mt-2 text-sm" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.7)" }}>
                  {stat.change}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Table */}
        <ScrollReveal delay={0.2}>
          <div className="mb-6">
            <span
              className="mb-6 inline-block text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.6)" }}
            >
              02 — Top Performers
            </span>
          </div>
          <div
            className="overflow-hidden rounded-[20px]"
            style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}
          >
            {/* Header */}
            <div
              className="grid grid-cols-6 gap-4 px-8 py-5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
            >
              {["Rank", "Trader", "Volume", "Profit", "Win Rate", "Trades"].map((h) => (
                <div
                  key={h}
                  className="text-xs tracking-[0.15em] uppercase"
                  style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.3)" }}
                >
                  {h}
                </div>
              ))}
            </div>

            {/* Rows */}
            {leaderboardData.map((trader, i) => (
              <motion.div
                key={trader.rank}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="grid grid-cols-6 gap-4 px-8 py-5 transition-colors duration-300 hover:bg-white/[0.02]"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}
              >
                <div className="flex items-center gap-3">
                  {trader.rank <= 3 && (
                    <span className="text-lg">
                      {trader.rank === 1 ? "🥇" : trader.rank === 2 ? "🥈" : "🥉"}
                    </span>
                  )}
                  <span style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>
                    #{trader.rank}
                  </span>
                </div>
                <div style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
                  {trader.address}
                </div>
                <div style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.7)" }}>
                  {trader.volume}
                </div>
                <div style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.85)" }}>
                  {trader.profit}
                </div>
                <div style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.55)" }}>
                  {trader.winRate}
                </div>
                <div style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.4)" }}>
                  {trader.trades.toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* Footer */}
      <footer className="border-t px-8 py-10" style={{ borderColor: "rgba(255,255,255,0.04)", background: "rgba(6,6,6,0.9)" }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.25)", fontSize: "1.1rem" }}>VEIL</span>
          <span style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.2)", fontSize: "0.75rem", letterSpacing: "0.05em" }}>© 2024 VEIL PROTOCOL</span>
        </div>
      </footer>
    </div>
  )
}
