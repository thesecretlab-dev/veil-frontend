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
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
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

export default function RewardsPage() {
  return (
    <div className="relative min-h-screen" style={{ background: "#060606" }}>
      <VeilHeader />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-8 pt-28 pb-32">
        {/* Hero */}
        <ScrollReveal>
          <div className="mb-16">
            <span className="mb-6 inline-block text-xs tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.67)" }}>
              01 — Incentives
            </span>
            <h1 className="text-6xl leading-[1.05]" style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.9)", letterSpacing: "-0.03em" }}>
              Rewards & Incentives
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.45)" }}>
              No airdrop. Aligned incentives only — liquidity, compute, consensus. Local testnet does not mint reward tiers.
            </p>
          </div>
        </ScrollReveal>

        {/* Your Status */}
        <ScrollReveal delay={0.1}>
          <div className="mb-6">
            <span className="mb-6 inline-block text-xs tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.67)" }}>
              02 — Your Status
            </span>
          </div>
          <div
            className="mb-14 rounded-[20px] p-10"
            style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}
          >
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <div className="text-xs tracking-[0.15em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.39)" }}>
                  Current Tier
                </div>
                <div className="mt-3 text-4xl font-light" style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(251,191,36,0.9)" }}>
                  —
                </div>
              </div>
              <div>
                <div className="text-xs tracking-[0.15em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.39)" }}>
                  Earned VEIL
                </div>
                <div className="mt-3 text-4xl font-light" style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(16,185,129,0.9)" }}>
                  0
                </div>
              </div>
              <div>
                <div className="text-xs tracking-[0.15em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.39)" }}>
                  Reward Multiplier
                </div>
                <div className="mt-3 text-4xl font-light" style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.9)" }}>
                  —
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Tiers */}
        <ScrollReveal delay={0.2}>
          <div className="mb-6">
            <span className="mb-6 inline-block text-xs tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.67)" }}>
              03 — Design notes
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
                <div className="mb-1 text-xs tracking-[0.1em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.34)" }}>
                  Min. Volume
                </div>
                <div className="mb-4" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.73)", fontSize: "0.95rem" }}>
                  {tier.minVolume}
                </div>
                <div className="text-3xl font-light" style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(16,185,129,0.90)" }}>
                  {tier.multiplier}
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="mb-6">
            <span className="mb-6 inline-block text-xs tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.67)" }}>
              04 — Thesis
            </span>
          </div>
          <div className="rounded-[20px] p-7" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <div className="mb-2 text-2xl font-light" style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(16,185,129,0.95)" }}>
              No airdrop
            </div>
            <div className="text-sm" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.45)" }}>
              Diamond through Bronze above are design notes. This node does not mint those tiers. Incentives are liquidity, compute, and consensus — COL routing is in the docs.
            </div>
            <Link href="/app/docs" className="mt-4 inline-block text-sm" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.78)" }}>
              Read docs →
            </Link>
          </div>
        </ScrollReveal>
      </div>

      <VeilFooter />
    </div>
  )
}
