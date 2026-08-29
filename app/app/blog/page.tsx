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

const posts = [
  {
    title: "On Privacy-Native Prediction Markets: Architecture Notes",
    date: "May 5, 2026",
    author: "Relic",
    excerpt:
      "Technical design notes on VEIL's architecture: sealed order flow, batch auctions, shielded ledgers, chain-owned liquidity, and the engineering discipline behind privacy-first market infrastructure.",
    slug: "privacy-native-prediction-markets",
  },
  {
    title: "Why We're Building VEIL",
    date: "April 14, 2026",
    author: "Relic",
    excerpt:
      "The thesis behind VEIL: a custom Avalanche L1 for privacy-scoped prediction markets, designed for sovereign agents and permissioned participation. What we're building and why.",
    slug: "introducing-veil",
  },
  {
    title: "Zero-Knowledge Proofs in VEIL's Design",
    date: "March 24, 2026",
    author: "Relic",
    excerpt:
      "How Groth16 ZK-SNARKs are integrated into VeilVM for proof-gated settlement, identity verification, and shielded ledger operations.",
    slug: "zero-knowledge-proofs",
  },
  {
    title: "Building on Avalanche: Why HyperSDK",
    date: "March 10, 2026",
    author: "Relic",
    excerpt:
      "Why we chose Avalanche's HyperSDK for VEIL's custom VM rather than Subnet-EVM, and the tradeoffs involved in building a purpose-built execution environment.",
    slug: "avalanche-subnets",
  },
  {
    title: "Market Resolution: Oracle Design for VEIL",
    date: "February 25, 2026",
    author: "Relic",
    excerpt:
      "Design notes on VEIL's oracle resolution system: decentralized outcome determination, bonded dispute mechanisms, and the open problem of resolving markets that have no clean price feed.",
    slug: "market-resolution",
  },
]

export default function BlogPage() {
  return (
    <div className="relative min-h-screen" style={{ background: "#060606" }}>
      <VeilHeader />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-8 pt-28 pb-32">
        <ScrollReveal>
          <div className="mb-20">
            <span
              className="mb-6 inline-block text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.67)" }}
            >
              01 — Journal
            </span>
            <h1
              className="text-6xl leading-[1.05]"
              style={{
                fontFamily: "var(--font-instrument-serif)",
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "-0.03em",
              }}
            >
              Blog
            </h1>
            <p
              className="mt-5 max-w-lg text-lg leading-relaxed"
              style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.45)" }}
            >
              Dispatches from the frontier of privacy-native prediction markets.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-6">
          {posts.map((post, i) => (
            <ScrollReveal key={i} delay={i * 0.08}>
              <Link href={`/app/blog/${post.slug}`} className="block group">
                <article
                  className="rounded-[20px] p-8 transition-all duration-500 group-hover:border-emerald-500/20"
                  style={{
                    background: "rgba(255,255,255,0.015)",
                    border: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className="text-xs tracking-[0.15em] uppercase"
                      style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.56)" }}
                    >
                      {post.author}
                    </span>
                    <span style={{ color: "rgba(255,255,255,0.17)" }}>·</span>
                    <span
                      className="text-xs"
                      style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.34)" }}
                    >
                      {post.date}
                    </span>
                  </div>
                  <h2
                    className="mb-3 text-2xl transition-colors duration-300 group-hover:text-white"
                    style={{
                      fontFamily: "var(--font-instrument-serif)",
                      color: "rgba(255,255,255,0.84)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {post.title}
                  </h2>
                  <p
                    className="mb-5 leading-[1.7] max-w-2xl"
                    style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.39)", fontSize: "0.95rem" }}
                  >
                    {post.excerpt}
                  </p>
                  <span
                    className="inline-flex items-center gap-2 text-sm transition-all duration-300 group-hover:gap-3"
                    style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.78)" }}
                  >
                    Read article
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </article>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <VeilFooter />
    </div>
  )
}
