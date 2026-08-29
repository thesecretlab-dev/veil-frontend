"use client"

import { VeilFooter, VeilHeader } from '@/components/brand'

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay }}
    >
      {children}
    </motion.div>
  )
}

const leaderboardData: { rank: number; address: string; volume: string; profit: string; winRate: string; trades: number }[] = []

export default function LeaderboardPage() {
  const [stats, setStats] = useState([
    { label: "Height", value: "—", change: "this node" },
    { label: "Markets", value: "—", change: "native + catalog" },
    { label: "Pool VEIL", value: "—", change: "live tape" },
  ])

  useEffect(() => {
    let dead = false
    fetch("/api/live-tape", { cache: "no-store" })
      .then((r) => r.json())
      .then((j: { height?: number; markets?: number; pool?: { reserve0?: number } }) => {
        if (dead) return
        setStats([
          { label: "Height", value: typeof j.height === "number" ? j.height.toLocaleString() : "—", change: "this node" },
          { label: "Markets", value: typeof j.markets === "number" ? String(j.markets) : "—", change: "native + catalog" },
          { label: "Pool VEIL", value: typeof j.pool?.reserve0 === "number" ? j.pool.reserve0.toLocaleString() : "—", change: "live tape" },
        ])
      })
      .catch(() => {})
    return () => {
      dead = true
    }
  }, [])

  return (
    <div className="relative min-h-screen" style={{ background: "#060606" }}>
      <VeilHeader />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-8 pt-28 pb-32">
        {/* Hero */}
        <ScrollReveal>
          <div className="mb-16">
            <span
              className="mb-6 inline-block text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.67)" }}
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
              style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.45)" }}
            >
              Ranked book is empty on this local testnet. Live height and pool are below — fills do not invent a public leaderboard.
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
                <div className="text-xs tracking-[0.15em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.39)" }}>
                  {stat.label}
                </div>
                <div className="mt-3 text-4xl font-light" style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.9)" }}>
                  {stat.value}
                </div>
                <div className="mt-2 text-sm" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.78)" }}>
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
              style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.67)" }}
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
                  style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.34)" }}
                >
                  {h}
                </div>
              ))}
            </div>

            {/* Rows */}
            {leaderboardData.length === 0 && (
              <div className="px-8 py-16 text-center">
                <p className="mb-6" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.45)" }}>
                  No ranked traders yet. Native activity is on the explorer tape.
                </p>
                <Link href="/explorer" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.84)" }}>
                  Open Explorer →
                </Link>
              </div>
            )}
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
                  <span style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.90)", fontWeight: 600 }}>
                    #{trader.rank}
                  </span>
                </div>
                <div style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.56)", fontSize: "0.9rem" }}>
                  {trader.address}
                </div>
                <div style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.78)" }}>
                  {trader.volume}
                </div>
                <div style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.95)" }}>
                  {trader.profit}
                </div>
                <div style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.62)" }}>
                  {trader.winRate}
                </div>
                <div style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.45)" }}>
                  {trader.trades.toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      <VeilFooter />
    </div>
  )
}
