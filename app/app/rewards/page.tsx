"use client"

import { VeilFooter, VeilHeader } from '@/components/brand'

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

const rewardTiers = [
  { tier: "Diamond", minVolume: "$100,000", multiplier: "3x", color: "rgba(147, 197, 253, 0.8)" },
  { tier: "Platinum", minVolume: "$50,000", multiplier: "2.5x", color: "rgba(203, 213, 225, 0.8)" },
  { tier: "Gold", minVolume: "$25,000", multiplier: "2x", color: "rgba(251, 191, 36, 0.8)" },
  { tier: "Silver", minVolume: "$10,000", multiplier: "1.5x", color: "rgba(156, 163, 175, 0.8)" },
  { tier: "Bronze", minVolume: "$1,000", multiplier: "1x", color: "rgba(180, 83, 9, 0.8)" },
]

const upcomingAirdrops = [
  { date: "Jan 15, 2025", amount: "10,000 VEIL", requirement: "Trade $5,000+ volume", status: "Upcoming" },
  { date: "Feb 1, 2025", amount: "25,000 VEIL", requirement: "Top 100 traders", status: "Upcoming" },
  { date: "Mar 1, 2025", amount: "50,000 VEIL", requirement: "Early adopters", status: "Upcoming" },
]

export default function RewardsPage() {
  return (
    <div className="relative min-h-screen" style={{ background: "#060606" }}>
      <VeilHeader />
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
                style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "0.85rem", color: item === "Rewards" ? "rgba(16,185,129,0.9)" : "rgba(255,255,255,0.45)", letterSpacing: "0.05em", textTransform: "uppercase" as const }}
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
            <span className="mb-6 inline-block text-xs tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.6)" }}>
              01 — Incentives
            </span>
            <h1 className="text-6xl leading-[1.05]" style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.9)", letterSpacing: "-0.03em" }}>
              Rewards & Incentives
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.4)" }}>
              Preview reward mechanics and incentive structure. Distribution remains staged by operator policy.
            </p>
          </div>
        </ScrollReveal>

        {/* Your Status */}
        <ScrollReveal delay={0.1}>
          <div className="mb-6">
            <span className="mb-6 inline-block text-xs tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.6)" }}>
              02 — Your Status
            </span>
          </div>
          <div
            className="mb-14 rounded-[20px] p-10"
            style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}
          >
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <div className="text-xs tracking-[0.15em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.35)" }}>
                  Current Tier
                </div>
                <div className="mt-3 text-4xl font-light" style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(251,191,36,0.9)" }}>
                  Gold
                </div>
              </div>
              <div>
                <div className="text-xs tracking-[0.15em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.35)" }}>
                  Earned VEIL
                </div>
                <div className="mt-3 text-4xl font-light" style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(16,185,129,0.9)" }}>
                  12,847
                </div>
              </div>
              <div>
                <div className="text-xs tracking-[0.15em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.35)" }}>
                  Reward Multiplier
                </div>
                <div className="mt-3 text-4xl font-light" style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.9)" }}>
                  2.0x
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Tiers */}
        <ScrollReveal delay={0.2}>
          <div className="mb-6">
            <span className="mb-6 inline-block text-xs tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.6)" }}>
              03 — Reward Tiers
            </span>
          </div>
          <div className="mb-14 grid gap-5 md:grid-cols-5">
            {rewardTiers.map((tier) => (
              <motion.div
                key={tier.tier}
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="rounded-[20px] p-7 cursor-default"
                style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <div
                  className="mb-4 text-xl font-light"
                  style={{ fontFamily: "var(--font-instrument-serif)", color: tier.color }}
                >
                  {tier.tier}
                </div>
                <div className="mb-1 text-xs tracking-[0.1em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.3)" }}>
                  Min. Volume
                </div>
                <div className="mb-4" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.65)", fontSize: "0.95rem" }}>
                  {tier.minVolume}
                </div>
                <div className="text-3xl font-light" style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(16,185,129,0.8)" }}>
                  {tier.multiplier}
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* Airdrops */}
        <ScrollReveal delay={0.3}>
          <div className="mb-6">
            <span className="mb-6 inline-block text-xs tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.6)" }}>
              04 — Upcoming Airdrops
            </span>
          </div>
          <div className="space-y-4">
            {upcomingAirdrops.map((airdrop, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-[20px] p-7"
                style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <div>
                  <div className="mb-1 text-xs" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.3)" }}>
                    {airdrop.date}
                  </div>
                  <div className="mb-2 text-2xl font-light" style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(16,185,129,0.85)" }}>
                    {airdrop.amount}
                  </div>
                  <div className="text-sm" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.4)" }}>
                    {airdrop.requirement}
                  </div>
                </div>
                <div
                  className="rounded-full px-5 py-2 text-xs tracking-[0.1em] uppercase"
                  style={{
                    background: "rgba(16,185,129,0.08)",
                    border: "1px solid rgba(16,185,129,0.2)",
                    color: "rgba(16,185,129,0.8)",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  {airdrop.status}
                </div>
              </div>
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
