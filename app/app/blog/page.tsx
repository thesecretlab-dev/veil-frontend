"use client"

import { VeilFooter } from '@/components/brand'

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

const posts = [
  {
    title: "On Privacy-Native Prediction Markets: Architecture Notes",
    date: "April 1, 2024",
    author: "Relic",
    excerpt:
      "Technical design notes on VEIL's architecture: sealed order flow, batch auctions, shielded ledgers, chain-owned liquidity, and the engineering discipline behind privacy-first market infrastructure.",
    slug: "privacy-native-prediction-markets",
  },
  {
    title: "Why We're Building VEIL",
    date: "March 15, 2024",
    author: "Relic",
    excerpt:
      "The thesis behind VEIL: a custom Avalanche L1 for privacy-scoped prediction markets, designed for sovereign agents and permissioned participation. What we're building and why.",
    slug: "introducing-veil",
  },
  {
    title: "Zero-Knowledge Proofs in VEIL's Design",
    date: "March 10, 2024",
    author: "Relic",
    excerpt:
      "How Groth16 ZK-SNARKs are integrated into VeilVM for proof-gated settlement, identity verification, and shielded ledger operations.",
    slug: "zero-knowledge-proofs",
  },
  {
    title: "VEIL Token Economics: Design Principles",
    date: "March 5, 2024",
    author: "Relic",
    excerpt:
      "Design principles behind VEIL's token economy: fixed supply, chain-owned liquidity, fee routing, and the role of the VEIL token in the network.",
    slug: "token-airdrop",
  },
  {
    title: "Building on Avalanche: Why HyperSDK",
    date: "February 28, 2024",
    author: "Relic",
    excerpt:
      "Why we chose Avalanche's HyperSDK for VEIL's custom VM rather than Subnet-EVM, and the tradeoffs involved in building a purpose-built execution environment.",
    slug: "avalanche-subnets",
  },
  {
    title: "Market Resolution: Oracle Design for VEIL",
    date: "February 20, 2024",
    author: "Relic",
    excerpt:
      "Design notes on VEIL's oracle resolution system: decentralized outcome determination, dispute mechanisms, and the Grok 4.2 AI oracle for social/political markets.",
    slug: "market-resolution",
  },
]

export default function BlogPage() {
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
        style={{
          background: "rgba(6,6,6,0.85)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(255,255,255,0.04)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          <Link href="/app" style={{ fontFamily: "var(--font-instrument-serif)", fontSize: "1.5rem", color: "rgba(255,255,255,0.9)", letterSpacing: "-0.02em" }}>
            VEIL
          </Link>
          <div className="flex items-center gap-8">
            {[
              { label: "Protocol", href: "/app/veil" },
              { label: "Markets", href: "/app/markets" },
              { label: "Governance", href: "/app/gov" },
              { label: "Docs", href: "/app/docs" },
              { label: "MAIEV", href: "/maiev" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition-colors hover:text-white"
                style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em", textTransform: "uppercase" as const }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-8 pt-36 pb-32">
        <ScrollReveal>
          <div className="mb-20">
            <span
              className="mb-6 inline-block text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.6)" }}
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
              style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.4)" }}
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
                      style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.5)" }}
                    >
                      {post.author}
                    </span>
                    <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
                    <span
                      className="text-xs"
                      style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.3)" }}
                    >
                      {post.date}
                    </span>
                  </div>
                  <h2
                    className="mb-3 text-2xl transition-colors duration-300 group-hover:text-white"
                    style={{
                      fontFamily: "var(--font-instrument-serif)",
                      color: "rgba(255,255,255,0.75)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {post.title}
                  </h2>
                  <p
                    className="mb-5 leading-[1.7] max-w-2xl"
                    style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.35)", fontSize: "0.95rem" }}
                  >
                    {post.excerpt}
                  </p>
                  <span
                    className="inline-flex items-center gap-2 text-sm transition-all duration-300 group-hover:gap-3"
                    style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.7)" }}
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

      {/* Footer */}
      <footer
        className="border-t px-8 py-10"
        style={{ borderColor: "rgba(255,255,255,0.04)", background: "rgba(6,6,6,0.9)" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.25)", fontSize: "1.1rem" }}>
            VEIL
          </span>
          <span style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.2)", fontSize: "0.75rem", letterSpacing: "0.05em" }}>
            © 2024 VEIL PROTOCOL
          </span>
        </div>
      </footer>
    </div>
  )
}
