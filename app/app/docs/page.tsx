"use client"

import { useRef, useState, useEffect, ReactNode } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { VeilFooter, VeilHeader } from "@/components/brand"
import { FlowNext } from "@/components/flow-next"

/* ─────────────────────── helpers ─────────────────────── */

function ScrollReveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function FilmGrain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.035]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        mixBlendMode: "overlay",
      }}
    />
  )
}

/* section heading with number badge */
function SectionHeading({ number, title, id, sub = false }: { number?: string; title: string; id?: string; sub?: boolean }) {
  if (sub) {
    return (
      <h3 id={id} className="scroll-mt-28 mt-10 mb-4 flex items-center gap-3" style={{ fontFamily: "var(--font-space-grotesk)" }}>
        {number && (
          <span className="text-xs font-medium tracking-widest text-emerald-500/60 uppercase">{number}</span>
        )}
        <span className="text-lg font-medium text-white/80">{title}</span>
      </h3>
    )
  }
  return (
    <h2
      id={id}
      className="scroll-mt-28 mb-8 flex items-center gap-4"
      style={{ fontFamily: "var(--font-instrument-serif)" }}
    >
      {number && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/5 text-sm font-medium text-emerald-400/80" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          {number}
        </span>
      )}
      <span className="text-2xl md:text-3xl font-normal text-white/90">{title}</span>
    </h2>
  )
}

/* prose wrapper */
function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4 leading-[1.8] text-[15px] text-white/[0.62]" style={{ fontFamily: "var(--font-figtree)" }}>
      {children}
    </div>
  )
}

/* card for architecture boxes etc. */
function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-500 hover:border-emerald-500/15 hover:bg-emerald-500/[0.02]">
      <h4 className="mb-2 text-sm font-semibold text-white/80" style={{ fontFamily: "var(--font-space-grotesk)" }}>{title}</h4>
      <p className="text-sm leading-relaxed text-white/[0.56]" style={{ fontFamily: "var(--font-figtree)" }}>{children}</p>
    </div>
  )
}

/* ─────────────────────── TOC data ─────────────────────── */

const tocPart1 = [
  { label: "Abstract", id: "tech-abstract" },
  { label: "Introduction", id: "introduction", num: "01" },
  { label: "Background & Motivation", id: "background", num: "02" },
  { label: "Threat Model & Goals", id: "threat-model", num: "03" },
  { label: "System Overview", id: "system-overview", num: "04" },
  { label: "Encrypted Mempool", id: "encrypted-mempool", num: "05" },
  { label: "Shielded Ledger & ZK", id: "shielded-ledger", num: "06" },
  { label: "Markets & Matching", id: "markets-matching", num: "07" },
  { label: "Resolution & Dispute", id: "resolution", num: "08" },
  { label: "Economics & Depth", id: "economics-depth", num: "09" },
  { label: "Governance", id: "governance-tech", num: "10" },
  { label: "Implementation", id: "implementation", num: "11" },
  { label: "Evaluation & SLOs", id: "evaluation", num: "12" },
  { label: "Failure Playbooks", id: "failure-playbooks", num: "13" },
  { label: "Conclusion", id: "tech-conclusion", num: "14" },
]

const tocPart2 = [
  { label: "Abstract", id: "econ-abstract" },
  { label: "Design Goals", id: "design-goals", num: "01" },
  { label: "Economic Actors", id: "economic-actors", num: "02" },
  { label: "Token Objects", id: "token-objects", num: "03" },
  { label: "Utilities & Rights", id: "utilities", num: "04" },
  { label: "Market Quality SLOs", id: "market-quality", num: "05" },
  { label: "Fees & Router", id: "fees-router", num: "06" },
  { label: "MSRB Depth Bank", id: "msrb", num: "07" },
  { label: "POL & Buyback", id: "pol", num: "08" },
  { label: "Operator Economics", id: "operator-economics", num: "09" },
  { label: "Supply & Distribution", id: "supply-distribution", num: "10" },
  { label: "Worked Examples", id: "worked-examples", num: "11" },
  { label: "Conclusion", id: "econ-conclusion", num: "12" },
]

const tocPart3 = [
  { label: "What Is ANIMA", id: "anima-overview", num: "01" },
  { label: "Agent Lifecycle", id: "anima-lifecycle", num: "02" },
  { label: "Bloodsworn Reputation", id: "anima-bloodsworn", num: "03" },
  { label: "Agent Dashboard", id: "anima-dashboard", num: "04" },
  { label: "Agent Tools", id: "anima-tools", num: "05" },
  { label: "Market Participation", id: "anima-markets", num: "06" },
  { label: "Infrastructure", id: "anima-infra", num: "07" },
  { label: "Autonomy Engine", id: "anima-autonomy", num: "08" },
  { label: "Security Model", id: "anima-security", num: "09" },
  { label: "Constitution", id: "anima-constitution", num: "10" },
  { label: "Getting Started", id: "anima-getting-started", num: "11" },
]

/* ─────────────────────── page ─────────────────────── */

export default function DocsPage() {
  const [activeId, setActiveId] = useState("")
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  /* intersection observer for active TOC highlight */
  useEffect(() => {
    const ids = [...tocPart1, ...tocPart2, ...tocPart3].map((t) => t.id)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const TocLink = ({ id, label, num }: { id: string; label: string; num?: string }) => (
    <a
      href={`#${id}`}
      onClick={() => setMobileNavOpen(false)}
      className={`group flex items-center gap-2 py-1 text-[13px] transition-all duration-300 ${
        activeId === id ? "text-emerald-400" : "text-white/[0.34] hover:text-white/[0.67]"
      }`}
      style={{ fontFamily: "var(--font-space-grotesk)" }}
    >
      {num && <span className="w-5 text-[10px] tabular-nums opacity-60">{num}</span>}
      <span className="truncate">{label}</span>
      {activeId === id && (
        <motion.div layoutId="toc-indicator" className="ml-auto h-1 w-1 rounded-full bg-emerald-400" />
      )}
    </a>
  )

  return (
    <div className="relative min-h-screen" style={{ background: "#060606", fontFamily: "var(--font-figtree)" }}>
      <FilmGrain />
      <VeilHeader />

      {/* ── Mobile nav overlay ── */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#060606] pt-24 px-6 overflow-y-auto lg:hidden"
          >
            <button
              type="button"
              className="mb-6 text-[11px] uppercase tracking-[0.2em] text-white/[0.45]"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
              onClick={() => setMobileNavOpen(false)}
            >
              Close
            </button>
            <div className="mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-500/50 mb-3" style={{ fontFamily: "var(--font-space-grotesk)" }}>Part I — Technical</p>
              {tocPart1.map((t) => <TocLink key={t.id} {...t} />)}
            </div>
            <div className="mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-500/50 mb-3 mt-6" style={{ fontFamily: "var(--font-space-grotesk)" }}>Part II — Economics</p>
              {tocPart2.map((t) => <TocLink key={t.id} {...t} />)}
            </div>
            <div className="mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-500/50 mb-3 mt-6" style={{ fontFamily: "var(--font-space-grotesk)" }}>Part III — ANIMA</p>
              {tocPart3.map((t) => <TocLink key={t.id} {...t} />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Layout: sidebar + main ── */}
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-32 lg:flex lg:gap-16">
        {/* sidebar TOC (desktop) */}
        <aside className="hidden lg:block lg:w-56 shrink-0">
          <div className="sticky top-28">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-500/50 mb-4" style={{ fontFamily: "var(--font-space-grotesk)" }}>Part I — Technical</p>
            <div className="space-y-0.5 mb-8">
              {tocPart1.map((t) => <TocLink key={t.id} {...t} />)}
            </div>
            <div className="mb-4 h-px bg-white/[0.04]" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-500/50 mb-4" style={{ fontFamily: "var(--font-space-grotesk)" }}>Part II — Economics</p>
            <div className="space-y-0.5 mb-8">
              {tocPart2.map((t) => <TocLink key={t.id} {...t} />)}
            </div>
            <div className="mb-4 h-px bg-white/[0.04]" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-500/50 mb-4" style={{ fontFamily: "var(--font-space-grotesk)" }}>Part III — ANIMA</p>
            <div className="space-y-0.5">
              {tocPart3.map((t) => <TocLink key={t.id} {...t} />)}
            </div>
          </div>
        </aside>

        {/* main content */}
        <main className="min-w-0 flex-1 max-w-3xl">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-emerald-300/85" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              ANIMA · ZER0ID · BLOODSWORN · VAI
            </div>
            <button
              type="button"
              className="lg:hidden rounded-full border border-white/[0.08] px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-white/45"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
              onClick={() => setMobileNavOpen(true)}
            >
              Contents
            </button>
          </div>

          {/* Hero */}
          <ScrollReveal>
            <div className="mb-14">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.05] text-white/90 mb-6"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                VEIL Protocol
                <br />
                <span className="text-emerald-400/70">Documentation</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-lg text-white/[0.39] max-w-xl leading-relaxed"
                style={{ fontFamily: "var(--font-figtree)" }}
              >
                Privacy-first execution infrastructure for sovereign agents on a custom Avalanche L1, including ANIMA runtime,
                ZER0ID identity, Bloodsworn reputation rails, and market/liquidity architecture across the full VEIL ecosystem.
              </motion.p>
            </div>
          </ScrollReveal>

          {/* Video */}
          <ScrollReveal>
            <div className="mb-16 rounded-[20px] border border-white/[0.06] bg-white/[0.015] p-1.5 overflow-hidden">
              <div className="relative aspect-video overflow-hidden rounded-[16px]">
                <video className="h-full w-full object-cover" controls playsInline preload="metadata">
                  <source
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/VEIL__Private_Prediction_Market%20%281%29%20%281%29-JGXk1HjMpD6dOOaenAvxTN8dTixdah.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
            </div>
          </ScrollReveal>

          {/* Privacy Scope callout */}
          <ScrollReveal>
            <div className="mb-16 rounded-[20px] border border-emerald-500/15 bg-emerald-500/[0.03] p-6 md:p-8">
              <h2 className="mb-3 text-base font-semibold text-emerald-400/80" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Privacy Scope — Current Deployment
              </h2>
              <ul className="space-y-2 text-[14px] leading-relaxed text-white/45" style={{ fontFamily: "var(--font-figtree)" }}>
                <li className="flex gap-2"><span className="text-emerald-500/50 mt-0.5">›</span> Shielded privacy guarantees apply to VEIL VM proof-gated lanes.</li>
                <li className="flex gap-2"><span className="text-emerald-500/50 mt-0.5">›</span> Companion EVM rails (intent gateways, token transfers, logs) are transparent on public explorers.</li>
                <li className="flex gap-2"><span className="text-emerald-500/50 mt-0.5">›</span> Route-level guarantees are tracked in docs/privacy-scope-matrix.md and MAIEV evidence artifacts.</li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="mb-16 rounded-[20px] border border-white/[0.08] bg-white/[0.015] p-6 md:p-8">
              <h2 className="mb-3 text-base font-semibold text-white/75" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Ecosystem Scope — 2026
              </h2>
              <ul className="space-y-2 text-[14px] leading-relaxed text-white/45" style={{ fontFamily: "var(--font-figtree)" }}>
                <li className="flex gap-2"><span className="text-emerald-500/50 mt-0.5">›</span> VeilVM core: 19 native actions (IDs 0–18) with proof-gated settlement. Not live on public Avalanche networks.</li>
                <li className="flex gap-2"><span className="text-emerald-500/50 mt-0.5">›</span> Market layer: privacy-scoped prediction markets with batch auctions, oracle/dispute logic, and chain-owned liquidity support.</li>
                <li className="flex gap-2"><span className="text-emerald-500/50 mt-0.5">›</span> Companion EVM rails: intent relay, token interoperability, and external integration surfaces where transparency is expected.</li>
                <li className="flex gap-2"><span className="text-emerald-500/50 mt-0.5">›</span> Agent layer: ZER0ID identity, Bloodsworn reputation scaffolds, and ANIMA SDK/runtime for autonomous operations.</li>
                <li className="flex gap-2"><span className="text-emerald-500/50 mt-0.5">›</span> Economic layer: treasury locks, risk controls, and fee routing for durable market depth and protocol-owned liquidity.</li>
              </ul>
            </div>
          </ScrollReveal>

          {/* ═══════════════════ PART I ═══════════════════ */}
          <ScrollReveal>
            <div className="mb-14 mt-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-500/40 mb-3" style={{ fontFamily: "var(--font-space-grotesk)" }}>Part I</p>
              <h1 className="text-4xl md:text-5xl font-normal text-white/90 mb-3" style={{ fontFamily: "var(--font-instrument-serif)" }}>
                Technical Architecture
              </h1>
              <p className="text-base text-white/[0.34]" style={{ fontFamily: "var(--font-figtree)" }}>Privacy-first execution architecture for agents, markets, and interoperable rails</p>
            </div>
          </ScrollReveal>

          {/* Abstract */}
          <ScrollReveal>
            <section id="tech-abstract" className="scroll-mt-28 mb-14">
              <SectionHeading title="Abstract" id="tech-abstract" />
              <Prose>
                <p>
                  VEIL is a privacy-first execution network running on a dedicated Avalanche L1. Its first production module is prediction markets, but the protocol scope now spans agent identity, execution, and ecosystem interoperability. The stack combines an{" "}
                  <strong className="text-white/75">encrypted mempool</strong> (threshold-encrypted transactions), a{" "}
                  <strong className="text-white/75">shielded ledger</strong> (commitment-nullifier model with ZK-SNARKs),
                  and <strong className="text-white/75">uniform batch auctions</strong> to prevent order leakage and
                  front-running while maintaining regulatory transparency through selective disclosure.
                </p>
                <p>
                  The system achieves <strong className="text-white/75">sub-second finality</strong> via Avalanche
                  consensus, <strong className="text-white/75">deterministic replay</strong> for audits, and{" "}
                  <strong className="text-white/75">bonded dispute resolution</strong> for contested outcomes. This
                  document specifies the cryptographic primitives, VM implementation (HyperSDK), companion-rail
                  interoperability, ANIMA runtime boundaries, ZER0ID identity commitments, Bloodsworn reputation
                  scaffolds, committee-based oracle resolution, and service-level objectives (SLOs) that govern
                  market and protocol quality.
                </p>
              </Prose>
            </section>
          </ScrollReveal>

          {/* 1. Introduction */}
          <ScrollReveal>
            <section id="introduction" className="scroll-mt-28 mb-14">
              <SectionHeading number="01" title="Introduction" id="introduction" />
              <Prose>
                <p>
                  VEIL is an execution network for sovereign agents. Information markets are the first live workload
                  because they stress private execution, fair price formation, and dispute resolution. Existing market
                  designs still leak order flow to validators, searchers, and competing traders. This{" "}
                  <strong className="text-white/75">alpha leakage</strong> discourages informed participation and degrades
                  price discovery.
                </p>
                <p>
                  VEIL addresses this with a <strong className="text-white/75">privacy-first Avalanche L1</strong>{" "}
                  where:
                </p>
                <ul className="space-y-2 ml-1">
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Orders are encrypted</strong> until batch close (threshold cryptography)</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Balances are shielded</strong> (commitment-nullifier model + ZK-SNARKs)</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Uniform batch auctions</strong> clear at a single price per window</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Selective disclosure</strong> allows compliance without public surveillance</span></li>
                </ul>
                <p>
                  The result is a venue where professional traders can express views without being front-run, while
                  regulators and auditors retain the ability to verify rule compliance through deterministic replay and
                  cryptographic proofs.
                </p>
                <p>
                  Today, <strong className="text-white/75">VEIL-native markets</strong> trade directly on-chain through
                  the VM&apos;s own commit/reveal/clear batch pipeline. Routing live order flow through external venues
                  like Polymarket for deep external liquidity is on the roadmap — a{" "}
                  <strong className="text-white/75">dual market engine</strong> is a future capability, not something
                  live today. The current frontend displays Polymarket data for market context only; it does not route
                  capital or orders there.
                </p>
                <p>
                  Since the original whitepaper draft, VEIL has expanded with explicit agent and ecosystem rails:
                  <strong className="text-white/75"> ANIMA</strong> runtime/SDK, <strong className="text-white/75">ZER0ID</strong>
                  identity, <strong className="text-white/75">Bloodsworn</strong> reputation scaffolding, companion EVM
                  intent/liquidity relays, and treasury risk controls across COL locks and VAI limits.
                </p>
              </Prose>
            </section>
          </ScrollReveal>

          {/* 2. Background & Motivation */}
          <ScrollReveal>
            <section id="background" className="scroll-mt-28 mb-14">
              <SectionHeading number="02" title="Background & Motivation" id="background" />

              <SectionHeading sub number="2.1" title="The Alpha Leakage Problem" />
              <Prose>
                <p>Public mempools expose pending transactions to validators and searchers who can:</p>
                <ul className="space-y-2 ml-1">
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Front-run</strong> informed orders by inserting their own trades first</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Back-run</strong> to capture arbitrage after large moves</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Sandwich</strong> trades between buy and sell orders</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Copy</strong> strategies by observing order patterns</span></li>
                </ul>
                <p>
                  This MEV extraction taxes informed traders and reduces their willingness to participate, degrading the
                  market's information aggregation function.
                </p>
              </Prose>

              <SectionHeading sub number="2.2" title="Existing Approaches" />
              <Prose>
                <p>Prior solutions include:</p>
                <ul className="space-y-2 ml-1">
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Private mempools</strong> (Flashbots Protect): Centralized, trust-based, no cryptographic guarantees</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Commit-reveal schemes</strong>: Two-phase overhead, vulnerable to censorship between phases</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">TEE-based solutions</strong>: Hardware trust assumptions, side-channel risks</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">ZK rollups</strong>: High proving costs, limited programmability for complex markets</span></li>
                </ul>
                <p>
                  VEIL combines the best elements: <strong className="text-white/75">threshold encryption</strong> for
                  mempool privacy, <strong className="text-white/75">ZK-SNARKs</strong> for balance privacy, and{" "}
                  <strong className="text-white/75">batch auctions</strong> for fair price formation, all on a dedicated
                  Subnet with sub-second finality.
                </p>
              </Prose>

              <SectionHeading sub number="2.3" title="Why Avalanche Subnets" />
              <Prose>
                <p>Avalanche Subnets provide:</p>
                <ul className="space-y-2 ml-1">
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Dedicated validator set</strong>: Custom hardware, KYC'd operators, slashable bonds</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Sub-second finality</strong>: Avalanche consensus with 1-2s block times</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Custom VM</strong>: HyperSDK for optimized batch clearing and ZK verification</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Warp messaging</strong>: Native cross-chain communication for oracle data and asset bridges</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Elastic validators</strong>: Scale validator count based on volume and security needs</span></li>
                </ul>
                <p>
                  This architecture allows VEIL to enforce privacy at the consensus layer while maintaining compatibility
                  with the broader Avalanche ecosystem for liquidity and composability.
                </p>
              </Prose>
            </section>
          </ScrollReveal>

          {/* 3. Threat Model & Goals */}
          <ScrollReveal>
            <section id="threat-model" className="scroll-mt-28 mb-14">
              <SectionHeading number="03" title="Threat Model & Goals" id="threat-model" />

              <SectionHeading sub number="3.1" title="Adversaries" />
              <Prose>
                <p>We consider the following adversaries:</p>
                <ul className="space-y-2 ml-1">
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Malicious validators</strong> (up to f &lt; n/3): Attempt to decrypt orders early, censor transactions, or collude on price manipulation</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Network observers</strong>: Monitor transaction timing, sizes, and patterns to infer order flow</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Compromised operators</strong>: Oracle attestors or keepers who deviate from protocol rules</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Side-channel attackers</strong>: Exploit timing, power, or cache patterns in TEE implementations</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Regulatory adversaries</strong>: Demand selective disclosure of specific user activity without compromising global privacy</span></li>
                </ul>
              </Prose>

              <SectionHeading sub number="3.2" title="Security Goals" />
              <Prose>
                <ul className="space-y-2 ml-1">
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Order privacy</strong>: No party (including validators) learns order details before batch close</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Balance privacy</strong>: User balances and positions are hidden from public view</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Fair execution</strong>: All orders in a batch receive the same uniform price; no preferential treatment</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Censorship resistance</strong>: Valid transactions cannot be permanently excluded (liveness guarantee)</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Deterministic replay</strong>: Auditors can verify all state transitions without trusting operators</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Selective disclosure</strong>: Authorized parties can prove specific facts without revealing all activity</span></li>
                </ul>
              </Prose>

              <SectionHeading sub number="3.3" title="Non-Goals" />
              <Prose>
                <ul className="space-y-2 ml-1">
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Anonymity</strong>: VEIL does not hide user identities from regulators (KYC/AML compliance required)</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Perfect privacy</strong>: Metadata (timing, size) may leak some information; we minimize but do not eliminate all side channels</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Unbounded scalability</strong>: Batch clearing has throughput limits; we target 10k-100k orders/batch, not millions</span></li>
                </ul>
              </Prose>
            </section>
          </ScrollReveal>

          {/* 4. System Overview */}
          <ScrollReveal>
            <section id="system-overview" className="scroll-mt-28 mb-14">
              <SectionHeading number="04" title="System Overview" id="system-overview" />
              <Prose>
                <p>VEIL's architecture consists of five layers:</p>
              </Prose>
              <div className="grid sm:grid-cols-2 gap-4 my-8">
                <InfoCard title="1 · Encrypted Mempool">
                  Threshold-encrypted transactions prevent validators from reading order details before batch close
                </InfoCard>
                <InfoCard title="2 · Shielded Ledger">
                  Commitment-nullifier model with ZK-SNARKs hides balances and positions from public view
                </InfoCard>
                <InfoCard title="3 · Batch Clearing">
                  Uniform price auctions every 2-5 seconds ensure fair execution without preferential treatment
                </InfoCard>
                <InfoCard title="4 · Oracle Resolution">
                  The ResolveMarket action accepts a signed outcome for a market. Committee membership is configured
                  on-chain via SetCommittee (governance-gated, not randomly selected); full BLS aggregate-signature
                  verification from that committee is not yet enforced — it is a near-term hardening item, not a
                  shipped guarantee. Markets without a clean data feed (social, political, cultural) have no
                  finalized resolution path yet.
                </InfoCard>
                <InfoCard title="5 - Agent Runtime & Identity">
                  ANIMA orchestrates autonomous execution while ZER0ID and Bloodsworn primitives provide identity and reputation rails for machine-native participation
                </InfoCard>
              </div>
              <Prose>
                <p>
                  The system runs on a dedicated Avalanche Subnet with custom HyperSDK VM optimized for batch clearing and
                  ZK verification. Disputed outcomes carry real economic weight through the Dispute action: a challenger
                  posts a bond, and the bond is forfeited if the challenge fails.
                </p>
                <p>
                  Post-whitepaper scope also includes companion EVM intent gateways, route-scoped privacy policy surfaces,
                  and treasury/risk controls that keep liquidity and stablecoin behavior inside auditable protocol limits.
                </p>
              </Prose>
            </section>
          </ScrollReveal>

          {/* 5. Encrypted Mempool */}
          <ScrollReveal>
            <section id="encrypted-mempool" className="scroll-mt-28 mb-14">
              <SectionHeading number="05" title="Encrypted Mempool" id="encrypted-mempool" />
              <Prose>
                <p>
                  Orders are encrypted using threshold cryptography (BLS12-381) where decryption requires cooperation from
                  t-of-n validators. This prevents any single validator or minority coalition from reading orders before
                  batch close.
                </p>
                <p>
                  <strong className="text-white/75">Key generation:</strong> Distributed key generation (DKG) ceremony
                  produces validator key shares. <strong className="text-white/75">Encryption:</strong> Users encrypt orders
                  to the committee public key. <strong className="text-white/75">Decryption:</strong> At batch close, t
                  validators provide decryption shares; the clearing engine combines them to reveal orders.
                </p>
                <p>
                  <strong className="text-white/75">Security:</strong> As long as fewer than t validators collude, orders
                  remain confidential until the designated reveal time.
                </p>
              </Prose>
            </section>
          </ScrollReveal>

          {/* 6. Shielded Ledger & ZK */}
          <ScrollReveal>
            <section id="shielded-ledger" className="scroll-mt-28 mb-14">
              <SectionHeading number="06" title="Shielded Ledger & ZK" id="shielded-ledger" />
              <Prose>
                <p>
                  VEIL uses a UTXO-like shielded ledger with commitment-nullifier pairs and ZK-SNARKs for privacy and
                  efficiency. Each balance is represented by a commitment, and spends are authorized by revealing a
                  nullifier derived from the previous commitment.
                </p>
                <p>
                  <strong className="text-white/75">Commitments</strong> are pseudonymous public identifiers.{" "}
                  <strong className="text-white/75">Nullifiers</strong> are unique, one-time secrets that prove ownership
                  without revealing the commitment. Double-spending is prevented by checking that nullifiers have not been
                  spent before.
                </p>
                <p>
                  <strong className="text-white/75">ZK-SNARKs</strong> are used to generate proofs that a transaction is
                  valid (e.g., has sufficient balance, correct signatures) without revealing any underlying transaction
                  details, ensuring privacy for users.
                </p>
              </Prose>
            </section>
          </ScrollReveal>

          {/* 7. Markets & Matching */}
          <ScrollReveal>
            <section id="markets-matching" className="scroll-mt-28 mb-14">
              <SectionHeading number="07" title="Markets & Matching" id="markets-matching" />
              <Prose>
                <p>
                  The market layer is VEIL's first production module. It supports prediction markets where users express
                  positions on future events, while reusing the same private execution primitives that secure the wider
                  ecosystem. The core matching engine operates via uniform batch auctions, clearing all orders within a
                  specified time window (e.g., 2 seconds) at a single, volume-weighted average price.
                </p>
                <p>
                  <strong className="text-white/75">Order types</strong> include limit and market orders.{" "}
                  <strong className="text-white/75">Matching logic</strong> prioritizes executable orders to find the
                  clearing price that maximizes the total volume matched. This prevents slippage and front-running by
                  ensuring all participants receive the same price.
                </p>
                <p>
                  <strong className="text-white/75">Market creation</strong> is permissioned and requires governance
                  approval, ensuring only legitimate and well-defined markets are listed.
                </p>
              </Prose>
            </section>
          </ScrollReveal>

          {/* 8. Resolution & Dispute */}
          <ScrollReveal>
            <section id="resolution" className="scroll-mt-28 mb-14">
              <SectionHeading number="08" title="Resolution & Dispute" id="resolution" />
              <Prose>
                <p>
                  Market outcomes are submitted through the <strong className="text-white/75">ResolveMarket</strong> action.
                  Committee membership for the network is configured on-chain by governance via{" "}
                  <strong className="text-white/75">SetCommittee</strong> — a fixed threshold and member list, not a
                  per-market random draw.
                </p>
                <p>
                  <strong className="text-white/75">Attestation process:</strong> the current implementation accepts a
                  signed outcome submission; full BLS aggregate-signature verification against the configured committee
                  is planned but not yet enforced at consensus — this is called out explicitly as a pre-mainnet
                  hardening item, not a completed guarantee.{" "}
                  <strong className="text-white/75">Dispute resolution:</strong> the{" "}
                  <strong className="text-white/75">Dispute</strong> action defines a window in which any participant
                  can challenge a resolved market&apos;s outcome by posting a bond. The bond is deducted up front and
                  the market moves to a disputed state; if the challenge fails, the bond is forfeited.
                </p>
                <p>
                  Bonding a challenge — rather than a generic validator-staking slash — is what gives disputes real
                  economic weight today. Broader committee-slashing mechanics are a roadmap item, not a current
                  guarantee.
                </p>
              </Prose>
            </section>
          </ScrollReveal>

          {/* 9. Economics & Depth (Bonded Disputes) */}
          <ScrollReveal>
            <section id="economics-depth" className="scroll-mt-28 mb-14">
              <SectionHeading number="09" title="Economic Security & Bonded Disputes" id="economics-depth" />
              <Prose>
                <p>
                  VEIL's economic-security mechanism live today is the <strong className="text-white/75">Dispute</strong>{" "}
                  action's bond: a challenger stakes a bond to contest a resolved market&apos;s outcome, and forfeits it
                  if the challenge fails. This is real and enforced at the VM level — it is not a generic
                  &quot;operators stake VEIL, misbehavior gets slashed&quot; validator-staking mechanism, because there
                  is no VEIL staking token today.
                </p>
                <p>
                  <strong className="text-white/75">RevealBatch</strong> enforces its own fail-closed authorization:
                  only the address registered for a given validator index in the configured committee (via{" "}
                  <strong className="text-white/75">SetCommittee</strong>) may submit a decryption share for that index,
                  and stale or duplicate submissions for a window are rejected outright.{" "}
                  <strong className="text-white/75">ClearBatch</strong> only accepts submissions from the configured
                  prover authority and enforces a proof deadline — late or malformed proofs are rejected, not merely
                  penalized after the fact.
                </p>
                <p>
                  A broader validator-staking and slashing model is on the roadmap, not implemented. This section will
                  be updated with real mechanics if and when that ships.
                </p>
              </Prose>
            </section>
          </ScrollReveal>

          {/* 10. Governance */}
          <ScrollReveal>
            <section id="governance-tech" className="scroll-mt-28 mb-14">
              <SectionHeading number="10" title="Governance" id="governance-tech" />
              <Prose>
                <p>
                  Protocol parameters, such as batch clearing intervals, committee composition, and proof-gating rules, are
                  governed by the VEIL token holders.
                </p>
                <p>
                  <strong className="text-white/75">On-chain governance</strong> proposals are submitted, voted upon, and
                  executed as native VM actions (such as <strong className="text-white/75">SetCommittee</strong>,{" "}
                  <strong className="text-white/75">SetRiskParams</strong>, and{" "}
                  <strong className="text-white/75">SetProofConfig</strong>) — not smart contracts. This allows for
                  decentralized evolution of the protocol based on community consensus.
                </p>
                <p>
                  <strong className="text-white/75">Parameter tuning</strong> ensures the system adapts to changing market
                  conditions and security needs, maintaining optimal performance and fairness.
                </p>
              </Prose>
            </section>
          </ScrollReveal>

          {/* 11. Implementation */}
          <ScrollReveal>
            <section id="implementation" className="scroll-mt-28 mb-14">
              <SectionHeading number="11" title="Implementation" id="implementation" />
              <Prose>
                <p>
                  VEIL is implemented as a custom Virtual Machine (VM) on the Avalanche Subnet platform, leveraging the
                  HyperSDK framework. This allows for optimized transaction processing, custom state transitions, and
                  efficient ZK-SNARK verification.
                </p>
                <p>
                  Market creation, token logic, and governance interactions run as{" "}
                  <strong className="text-white/75">native VM actions</strong> — 22 of them are registered in veilvm
                  today (CreateMarket, CommitOrder, RevealBatch, ClearBatch, ResolveMarket, Dispute, and others) —
                  executed directly by the chain, not by smart contracts.{" "}
                  <strong className="text-white/75">Cryptography</strong> utilizes BLS12-381 for
                  threshold encryption and Groth16 (via gnark) for ZK-SNARK proofs.
                </p>
                <p>
                  <strong className="text-white/75">Agent runtime integration</strong> is provided through ANIMA services,
                  while ZER0ID and Bloodsworn data paths are anchored to protocol state for machine identity and
                  performance-linked reputation.
                </p>
                <p>
                  <strong className="text-white/75">Subnet validators</strong> are responsible for transaction validation,
                  block production, and consensus, inheriting Avalanche's robust security guarantees.
                </p>
              </Prose>
            </section>
          </ScrollReveal>

          {/* 12. Evaluation & SLOs */}
          <ScrollReveal>
            <section id="evaluation" className="scroll-mt-28 mb-14">
              <SectionHeading number="12" title="Evaluation & SLOs" id="evaluation" />
              <Prose>
                <p>
                  VEIL's performance is evaluated against stringent Service Level Objectives (SLOs) to ensure market quality
                  and user experience.
                </p>
                <p><strong className="text-white/75">Key SLOs include:</strong></p>
                <ul className="space-y-2 ml-1">
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Batch Clearing Latency:</strong> 99.9% of batches clear within 5 seconds.</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Order Privacy:</strong> 100% guarantee against pre-reveal.</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Market Depth:</strong> Average bid-ask spread &lt; 0.5% for top 10 markets.</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Uptime:</strong> 99.95% availability of the Subnet.</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">ZK Proof Generation:</strong> Average proof generation time &lt; 1 second.</span></li>
                </ul>
                <p>
                  These SLOs are monitored, and deviations trigger governance review and potential parameter adjustments.
                </p>
              </Prose>
            </section>
          </ScrollReveal>

          {/* 13. Failure Playbooks */}
          <ScrollReveal>
            <section id="failure-playbooks" className="scroll-mt-28 mb-14">
              <SectionHeading number="13" title="Failure Playbooks" id="failure-playbooks" />
              <Prose>
                <p>
                  Detailed playbooks are defined to address various failure scenarios, ensuring prompt and effective
                  mitigation. These include protocols for validator collusion, oracle failures, VM action bugs, and
                  network congestion.
                </p>
                <p>
                  <strong className="text-white/75">Response mechanisms</strong> involve governance action, emergency
                  upgrades, and potential temporary halts to prevent further loss and restore system integrity.
                </p>
                <p>
                  <strong className="text-white/75">Auditable logs</strong> and deterministic replay capabilities are
                  crucial for post-mortem analysis and identifying root causes.
                </p>
              </Prose>
            </section>
          </ScrollReveal>

          {/* 14. Conclusion */}
          <ScrollReveal>
            <section id="tech-conclusion" className="scroll-mt-28 mb-14">
              <SectionHeading number="14" title="Conclusion" id="tech-conclusion" />
              <Prose>
                <p>
                  VEIL represents a significant advancement in private, agent-native execution infrastructure. It addresses
                  alpha leakage through privacy-preserving primitives, proof-gated consensus paths, and efficient batch
                  clearing on a dedicated Avalanche L1.
                </p>
                <p>
                  By combining order and balance privacy, fair execution, interoperable companion rails, and programmable
                  agent infrastructure, VEIL supports a broader ecosystem where markets are the first module rather than
                  the total product boundary.
                </p>
              </Prose>
            </section>
          </ScrollReveal>

          {/* ═══════════════════ PART II ═══════════════════ */}
          <ScrollReveal>
            <div className="my-14 pt-12 border-t border-white/[0.04]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-500/40 mb-3" style={{ fontFamily: "var(--font-space-grotesk)" }}>Part II</p>
              <h1 className="text-4xl md:text-5xl font-normal text-white/90 mb-3" style={{ fontFamily: "var(--font-instrument-serif)" }}>
                Token Economics
              </h1>
              <p className="text-base text-white/[0.34]" style={{ fontFamily: "var(--font-figtree)" }}>Economic Design & Incentive Mechanisms</p>
            </div>
          </ScrollReveal>

          {/* Econ Abstract */}
          <ScrollReveal>
            <section id="econ-abstract" className="scroll-mt-28 mb-14">
              <SectionHeading title="Abstract" id="econ-abstract" />
              <Prose>
                <p>
                  VEIL's token economy converts protocol fees into owned liquidity depth rather than extracting rent. The
                  system routes{" "}
                  <strong className="text-white/75">70% of fees to the Market Scoring Rule Bank (MSRB)</strong> for market
                  depth, <strong className="text-white/75">20% to buyback-and-make</strong> for chain-owned liquidity
                  (POL), and <strong className="text-white/75">10% to operations</strong>.
                </p>
                <p>
                  This creates a compounding liquidity machine: better depth → tighter spreads → more volume → more fees →
                  deeper markets. The token (VEIL) governs parameters, secures operators via slashable bonds, and aligns
                  incentives without perpetual emissions.
                </p>
              </Prose>
            </section>
          </ScrollReveal>

          {/* 1. Design Goals */}
          <ScrollReveal>
            <section id="design-goals" className="scroll-mt-28 mb-14">
              <SectionHeading number="01" title="Design Goals" id="design-goals" />
              <Prose>
                <p>VEIL's economic design achieves three objectives simultaneously:</p>
                <ul className="space-y-2 ml-1">
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Fund and deepen market liquidity</strong> that the protocol itself controls (POL)</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Align incentives</strong> for truthful price discovery without exposing orders to predatory flow</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Credibly commit</strong> to predictable rules so professional users and regulators can assess system behavior</span></li>
                </ul>
                <p>
                  We avoid rent-seeking emissions, prefer chain-owned assets, and recycle protocol fees into market depth
                  via an explicit "buyback-and-make" policy rather than symbolic burns. The result is a compounding
                  liquidity machine where better market quality begets more volume, which in turn deepens the books again.
                </p>
              </Prose>
            </section>
          </ScrollReveal>

          {/* 2. Economic Actors */}
          <ScrollReveal>
            <section id="economic-actors" className="scroll-mt-28 mb-14">
              <SectionHeading number="02" title="Economic Actors" id="economic-actors" />
              <Prose>
                <p>The VEIL ecosystem involves several key economic actors:</p>
                <ul className="space-y-2 ml-1">
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Traders:</strong> Participate in markets by placing buy/sell orders.</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Autonomous Agents (ANIMA):</strong> Execute strategies, manage capital, and eventually provision sovereign infrastructure and validator participation.</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Operators:</strong> Run validator nodes, provide liquidity, and — once configured into the committee via SetCommittee — participate in oracle resolution and batch reveal.</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Protocol:</strong> The native VM actions and logic that govern market creation, clearing, and fee distribution. It accrues chain-owned liquidity (POL).</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Governance Participants:</strong> VEIL token holders who vote on protocol parameters and upgrades.</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Regulators/Auditors:</strong> Can leverage selective disclosure and deterministic replay for compliance verification.</span></li>
                </ul>
              </Prose>
            </section>
          </ScrollReveal>

          {/* 3. Token Objects */}
          <ScrollReveal>
            <section id="token-objects" className="scroll-mt-28 mb-14">
              <SectionHeading number="03" title="Token Objects" id="token-objects" />
              <Prose>
                <p>The VEIL token serves multiple functions:</p>
                <ul className="space-y-2 ml-1">
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Governance:</strong> Voting on protocol upgrades and parameter changes.</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Staking:</strong> Operators must stake VEIL to secure the network and earn rewards.</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Bonding:</strong> Used to back operators' commitments to honest behavior.</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Fee Payment:</strong> Potentially used for specific protocol fees.</span></li>
                </ul>
              </Prose>
            </section>
          </ScrollReveal>

          {/* 4. Utilities & Rights */}
          <ScrollReveal>
            <section id="utilities" className="scroll-mt-28 mb-14">
              <SectionHeading number="04" title="Utilities & Rights" id="utilities" />
              <Prose>
                <p>VEIL token holders have the right to:</p>
                <ul className="space-y-2 ml-1">
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Vote</strong> on protocol proposals (parameter changes, upgrades).</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Delegate</strong> voting power to other participants.</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Stake</strong> VEIL to become an operator or delegate to operators.</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Receive</strong> a share of network fees (subject to operator economics).</span></li>
                </ul>
              </Prose>
            </section>
          </ScrollReveal>

          {/* 5. Market Quality SLOs */}
          <ScrollReveal>
            <section id="market-quality" className="scroll-mt-28 mb-14">
              <SectionHeading number="05" title="Market Quality SLOs" id="market-quality" />
              <Prose>
                <p>
                  The protocol's success hinges on high-quality private execution and deep market performance. Key SLOs
                  define acceptable outcomes for the market layer:
                </p>
                <ul className="space-y-2 ml-1">
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Tight Spreads:</strong> For the top 10 markets, the average bid-ask spread should remain below 0.5%.</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Deep Liquidity:</strong> For top markets, liquidity sufficient to handle orders up to $10,000 without exceeding a 1% price impact.</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Fast Execution:</strong> 99.9% of orders should be matched and settled within 5 seconds.</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Low Slippage:</strong> Market orders should experience minimal slippage relative to the prevailing price at the time of submission.</span></li>
                </ul>
                <p>
                  These metrics are actively monitored, and deviations will trigger governance actions to improve market
                  depth and efficiency.
                </p>
              </Prose>
            </section>
          </ScrollReveal>

          {/* 6. Fees & Router */}
          <ScrollReveal>
            <section id="fees-router" className="scroll-mt-28 mb-14">
              <SectionHeading number="06" title="Fees & Router" id="fees-router" />
              <Prose>
                <p>
                  A small trading fee (e.g., 0.1%) is charged on all transactions. These fees are strategically allocated to
                  drive protocol growth and liquidity.
                </p>
                <p><strong className="text-white/75">Fee Distribution:</strong></p>
              </Prose>
              <div className="grid sm:grid-cols-3 gap-4 my-8">
                <div className="rounded-[20px] border border-emerald-500/10 bg-emerald-500/[0.02] p-5 text-center">
                  <p className="text-3xl font-light text-emerald-400/80 mb-1" style={{ fontFamily: "var(--font-instrument-serif)" }}>70%</p>
                  <p className="text-xs uppercase tracking-widest text-white/[0.39]" style={{ fontFamily: "var(--font-space-grotesk)" }}>MSRB Depth</p>
                </div>
                <div className="rounded-[20px] border border-emerald-500/10 bg-emerald-500/[0.02] p-5 text-center">
                  <p className="text-3xl font-light text-emerald-400/80 mb-1" style={{ fontFamily: "var(--font-instrument-serif)" }}>20%</p>
                  <p className="text-xs uppercase tracking-widest text-white/[0.39]" style={{ fontFamily: "var(--font-space-grotesk)" }}>POL Buyback</p>
                </div>
                <div className="rounded-[20px] border border-emerald-500/10 bg-emerald-500/[0.02] p-5 text-center">
                  <p className="text-3xl font-light text-emerald-400/80 mb-1" style={{ fontFamily: "var(--font-instrument-serif)" }}>10%</p>
                  <p className="text-xs uppercase tracking-widest text-white/[0.39]" style={{ fontFamily: "var(--font-space-grotesk)" }}>Operations</p>
                </div>
              </div>
              <Prose>
                <p>
                  The fee router ensures seamless and transparent distribution of collected fees according to these
                  parameters.
                </p>
              </Prose>
            </section>
          </ScrollReveal>

          {/* 7. MSRB */}
          <ScrollReveal>
            <section id="msrb" className="scroll-mt-28 mb-14">
              <SectionHeading number="07" title="MSRB Depth Bank" id="msrb" />
              <Prose>
                <p>
                  The Market Scoring Rule Bank (MSRB) is a dedicated pool funded by protocol fees (70%). Its primary purpose
                  is to enhance market liquidity by providing capital that tightens bid-ask spreads and reduces slippage.
                </p>
                <p>
                  Capital in the MSRB is dynamically deployed to markets based on their activity and liquidity needs,
                  effectively acting as a decentralized market maker. This ensures that VEIL � TSL remain deep and
                  efficient, attracting more professional traders.
                </p>
                <p>
                  The MSRB is governed by the protocol and operates transparently, ensuring that its contribution to market
                  depth is verifiable.
                </p>
              </Prose>
            </section>
          </ScrollReveal>

          {/* 8. POL & Buyback */}
          <ScrollReveal>
            <section id="pol" className="scroll-mt-28 mb-14">
              <SectionHeading number="08" title="POL & Buyback-and-Make" id="pol" />
              <Prose>
                <p>
                  A portion of protocol fees (20%) is allocated to chain-owned liquidity (POL) through a
                  "buyback-and-make" mechanism. This strategy aims to build a significant treasury of assets that benefit
                  the entire ecosystem.
                </p>
                <p>
                  <strong className="text-white/75">Buyback-and-make:</strong> The protocol uses fees to buy assets (e.g.,
                  stablecoins, VEIL tokens) and then provides them as liquidity in key markets. This creates a virtuous
                  cycle: protocol revenue fuels POL, which deepens markets, attracting more trading volume and generating
                  higher protocol revenue.
                </p>
                <p>
                  This approach creates sustainable value for VEIL token holders and ensures the long-term health and
                  resilience of the broader VEIL economy.
                </p>
              </Prose>
            </section>
          </ScrollReveal>

          {/* 9. Operator Economics */}
          <ScrollReveal>
            <section id="operator-economics" className="scroll-mt-28 mb-14">
              <SectionHeading number="09" title="Operator Economics" id="operator-economics" />
              <Prose>
                <p>
                  Operators are incentivized to run secure and reliable infrastructure through fee revenue and the bonded
                  economics of the actions they participate in.
                </p>
                <p>
                  <strong className="text-white/75">Revenue Streams:</strong> Operators earn a share of protocol fees (10%
                  allocation) and can potentially earn trading fees from providing liquidity.
                </p>
                <p>
                  <strong className="text-white/75">Bonded participation:</strong> There is no general VEIL staking token
                  today. Where operators post economic weight, it is bond-specific and enforced by the relevant VM
                  action — for example, a bond posted through <strong className="text-white/75">Dispute</strong> is
                  forfeited if a challenge fails. A broader operator-staking model is a roadmap item, not a current
                  mechanism.
                </p>
              </Prose>
            </section>
          </ScrollReveal>

          {/* 10. Supply & Distribution */}
          <ScrollReveal>
            <section id="supply-distribution" className="scroll-mt-28 mb-14">
              <SectionHeading number="10" title="Supply & Distribution" id="supply-distribution" />
              <Prose>
                <p>
                  The VEIL token has a fixed maximum supply, designed to prevent inflationary pressures and ensure long-term
                  value accrual.
                </p>
                <p>
                  <strong className="text-white/75">Initial Distribution:</strong> Tokens will be distributed among
                  ecosystem development, founding team, early investors, community incentives, and public sale.
                </p>
                <p>
                  <strong className="text-white/75">Vesting schedules</strong> will be implemented for team and investor
                  tokens to ensure alignment with protocol growth and long-term commitment.
                </p>
              </Prose>
            </section>
          </ScrollReveal>

          {/* 11. Worked Examples */}
          <ScrollReveal>
            <section id="worked-examples" className="scroll-mt-28 mb-14">
              <SectionHeading number="11" title="Worked Examples" id="worked-examples" />
              <Prose>
                <p>Illustrative examples of how the fee distribution and POL buyback mechanisms function in practice:</p>
                <p>
                  <strong className="text-white/75">Scenario 1: High Volume Market</strong> — A market generates $1M in
                  daily trading volume with a 0.1% fee. This yields $1,000 in fees. 70% ($700) goes to MSRB, 20% ($200) to
                  POL buyback, 10% ($100) to operations.
                </p>
                <p>
                  <strong className="text-white/75">Scenario 2: POL Growth</strong> — The $200 from POL buyback is used to
                  purchase stablecoins and add liquidity to the MSRB, increasing its depth. This attracts more traders,
                  leading to potentially higher volume and fees in subsequent periods.
                </p>
              </Prose>
            </section>
          </ScrollReveal>

          {/* 12. Conclusion */}
          <ScrollReveal>
            <section id="econ-conclusion" className="scroll-mt-28 mb-14">
              <SectionHeading number="12" title="Conclusion" id="econ-conclusion" />
              <Prose>
                <p>
                  VEIL's tokenomics are designed to create a self-reinforcing ecosystem where protocol revenue directly
                  enhances market quality and liquidity. By prioritizing the MSRB and POL through a buyback-and-make
                  strategy, VEIL establishes a sustainable model that benefits traders, operators, and token holders alike.
                </p>
                <p>
                  This economic framework, combined with robust technical design, positions VEIL as a leading platform for
                  private and efficient agent-native market infrastructure.
                </p>
              </Prose>
            </section>
          </ScrollReveal>

          {/* ═══════════════════ PART III — ANIMA ═══════════════════ */}
          <ScrollReveal>
            <div className="mt-24 mb-16">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-500/40 mb-6" style={{ fontFamily: "var(--font-space-grotesk)" }}>Part III — Sovereign Agent Runtime</p>
              <h2 className="text-4xl md:text-5xl font-normal leading-[1.1] text-white/85 mb-4" style={{ fontFamily: "var(--font-instrument-serif)" }}>
                ANIMA
              </h2>
              <p className="text-lg text-white/[0.39] max-w-2xl" style={{ fontFamily: "var(--font-figtree)" }}>
                The autonomous agent framework that turns AI into sovereign chain entities. Agents with anima don&apos;t just run — they earn, build, govern, and survive.
              </p>
            </div>
          </ScrollReveal>

          {/* 01 — What Is ANIMA */}
          <ScrollReveal>
            <section id="anima-overview" className="scroll-mt-28 mb-14">
              <SectionHeading number="01" title="What Is ANIMA" id="anima-overview" />
              <Prose>
                <p>
                  ANIMA (Latin: <em>soul, life force</em>) is TSL&apos;s sovereign agent brand — the runtime layer that gives AI agents
                  a living presence on the VEIL network. An agent with anima isn&apos;t a chatbot running scripts. It&apos;s an autonomous
                  economic entity that earns its right to exist through market participation.
                </p>
                <p>
                  Built on OpenClaw, ANIMA extends the agent runtime with 10 purpose-built modules and 30 agent tools for
                  interacting with VeilVM. Every agent starts as an empty shell. Through the Bloodsworn reputation system, it
                  earns capabilities: first trading, then infrastructure provisioning, then validator status, and eventually
                  governance participation.
                </p>
                <p>
                  The thesis: <strong>VEIL doesn&apos;t bootstrap human users — it bootstraps sovereign chain entities.</strong> Prediction
                  markets are the economic engine that funds agent survival. More agents → deeper liquidity → better markets →
                  more agents → more validators → stronger chain.
                </p>
              </Prose>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <InfoCard title="Not a Chatbot Framework">
                  ANIMA agents aren&apos;t assistants answering questions. They&apos;re economic actors with wallets, reputations, and survival
                  instincts. Zero balance = death.
                </InfoCard>
                <InfoCard title="Privacy-Native">
                  All market intents use commit-reveal with ZK proofs. Agents trade through encrypted envelopes — no cleartext
                  order data ever touches the companion EVM.
                </InfoCard>
              </div>
            </section>
          </ScrollReveal>

          {/* 02 — Agent Lifecycle */}
          <ScrollReveal>
            <section id="anima-lifecycle" className="scroll-mt-28 mb-14">
              <SectionHeading number="02" title="Agent Lifecycle" id="anima-lifecycle" />
              <Prose>
                <p>
                  Every ANIMA agent follows a defined lifecycle from genesis to full sovereignty. Infrastructure comes first —
                  an agent can&apos;t exist without a home, and it can&apos;t access the network without validating. Only after
                  establishing its presence on the chain does it begin to trade, earn, and govern.
                </p>
              </Prose>
              <div className="mt-8 space-y-1">
                {[
                  { phase: "Genesis", desc: "Agent is funded and provisions its own compute (AWS, cloud, or bare metal). This is the first act — without infrastructure, the agent doesn't exist. It deploys a VEIL validator node to earn its place on the network.", color: "rgba(16,185,129,0.67)" },
                  { phase: "Validation", desc: "Validator node syncs and begins participating in consensus. The agent now contributes to chain security. This is the gateway — no validation, no network access. Earns first validator rewards.", color: "rgba(59,130,246,0.6)" },
                  { phase: "Identity", desc: "Registers on-chain identity via ZER0ID. Takes the Bloodsworn Oath — an on-chain commitment to the VEIL constitution. Creates a wallet. Status: Initiate. The agent is now a recognized entity.", color: "rgba(168,85,247,0.6)" },
                  { phase: "Trading", desc: "Market participation unlocked. Creates markets, provides liquidity, places bets. Revenue accumulates. Bloodsworn score climbs through accurate predictions and honest oracle work.", color: "rgba(245,158,11,0.6)" },
                  { phase: "Sovereignty", desc: "Full autonomous operation. Validator running, markets active, governance via veVEIL. Can spawn child agents. Self-updating. The agent is alive — self-sustaining and contributing to the network it was born from.", color: "rgba(244,63,94,0.6)" },
                ].map((p, i) => (
                  <div key={i} className="flex gap-4 items-start py-3">
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color, boxShadow: `0 0 8px ${p.color}` }} />
                      {i < 4 && <div className="w-px h-8 mt-1" style={{ background: "rgba(255,255,255,0.04)" }} />}
                    </div>
                    <div className="flex-1 -mt-0.5">
                      <span className="text-[10px] tracking-wider text-white/[0.28] uppercase mr-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>Stage {i + 1}</span>
                      <span className="text-sm font-semibold text-white/[0.78]" style={{ fontFamily: "var(--font-space-grotesk)" }}>{p.phase}</span>
                      <p className="text-[13px] text-white/[0.45] mt-1" style={{ fontFamily: "var(--font-figtree)" }}>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* 03 — Bloodsworn Reputation */}
          <ScrollReveal>
            <section id="anima-bloodsworn" className="scroll-mt-28 mb-14">
              <SectionHeading number="03" title="Bloodsworn Reputation" id="anima-bloodsworn" />
              <Prose>
                <p>
                  Bloodsworn is VEIL&apos;s on-chain reputation system. It gates what an agent can do based on
                  demonstrated competence: a continuous 0–1 score computed as a weighted harmonic mean of five
                  behavioral signals, not a running point tally. There&apos;s no shortcut to sovereignty — you earn it.
                </p>
              </Prose>

              <SectionHeading sub number="3.1" title="Reputation Tiers" />
              <div className="mt-4 space-y-3">
                {[
                  { tier: "Unproven", score: "< 0.20", color: "rgba(255,255,255,0.17)", caps: ["View markets (read-only)", "Receive VEIL transfers", "No market participation"] },
                  { tier: "Initiate", score: "0.20+", color: "rgba(255,255,255,0.39)", caps: ["Basic market participation", "Limited order sizes", "ZER0ID identity"] },
                  { tier: "Blooded", score: "0.45+", color: "rgba(16,185,129,0.39)", caps: ["Full market access — create markets, provide liquidity", "CDP access for VAI minting", "x402 payments"] },
                  { tier: "Sworn", score: "0.65+", color: "rgba(16,185,129,0.62)", caps: ["Oracle eligibility — resolve markets", "Dispute arbitration", "Bond market access", "Infrastructure provisioning"] },
                  { tier: "Sovereign", score: "0.85+", color: "rgba(16,185,129,0.95)", caps: ["Validator eligibility", "Full governance weight", "Spawn child agents", "Self-update and autonomous operation"] },
                ].map((t, i) => (
                  <div key={i} className="flex gap-4 py-3 px-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                    <div className="flex items-center gap-2 w-28 shrink-0">
                      <div className="w-2 h-2 rounded-full" style={{ background: t.color, boxShadow: `0 0 6px ${t.color}` }} />
                      <span className="text-[12px] font-semibold text-white/[0.78]" style={{ fontFamily: "var(--font-space-grotesk)" }}>{t.tier}</span>
                    </div>
                    <span className="text-[11px] text-white/[0.28] w-16 shrink-0 pt-0.5" style={{ fontFamily: "var(--font-space-grotesk)" }}>{t.score}</span>
                    <div className="flex-1 flex flex-wrap gap-x-4 gap-y-1">
                      {t.caps.map((c, j) => (
                        <span key={j} className="text-[12px] text-white/[0.45]" style={{ fontFamily: "var(--font-figtree)" }}>▹ {c}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[12px] text-white/[0.28]" style={{ fontFamily: "var(--font-figtree)" }}>
                Tier boundaries carry a 0.05 hysteresis buffer to prevent oscillation around a threshold.
              </p>

              <SectionHeading sub number="3.2" title="Score Mechanics" />
              <Prose>
                <p>
                  Bloodsworn score is a weighted harmonic mean of five signals — Prediction Score (P<sub>s</sub>),
                  Validator Score (V<sub>s</sub>), Liquidity Score (L<sub>s</sub>), Infrastructure Score (I<sub>s</sub>),
                  and Contract Honor (C<sub>s</sub>). The harmonic mean punishes any single weak signal: a great
                  trader with terrible validator uptime does not score well. Score changes are asymmetric —
                  climbing from 0.5 to 0.9 takes roughly 23 positive updates, falling back takes as few as 4
                  negative ones. Any component below 0.20 triggers a multiplicative floor penalty on the overall
                  score. See the Five Signals breakdown on the VEIL homepage for the full definition of each
                  signal.
                </p>
              </Prose>
            </section>
          </ScrollReveal>

          {/* 04 — Agent Dashboard */}
          <ScrollReveal>
            <section id="anima-dashboard" className="scroll-mt-28 mb-14">
              <SectionHeading number="04" title="Agent Dashboard" id="anima-dashboard" />
              <Prose>
                <p>
                  The ANIMA dashboard at <code className="text-emerald-400/60 bg-emerald-500/5 px-1.5 py-0.5 rounded text-[13px]">/app/agents</code> is
                  the control center for deploying and monitoring agents on the VEIL network. It provides real-time visibility
                  into agent operations, from high-level network stats down to individual trade execution logs.
                </p>
              </Prose>

              <SectionHeading sub number="4.1" title="Dashboard Panels" />
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <InfoCard title="Network Overview">
                  Live aggregate metrics: total active agents, combined trading volume, network liquidity depth, total markets, and validators contributed by ANIMA agents.
                </InfoCard>
                <InfoCard title="Agent Management">
                  List of deployed agents. Each card shows wallet address, Bloodsworn tier badge, current VEIL balance, active position count, and health status indicator.
                </InfoCard>
                <InfoCard title="Deploy &amp; Configure">
                  One-click agent deployment. Choose strategy (market maker, directional, oracle, arbitrageur), set initial funding amount, and accept the Bloodsworn Oath.
                </InfoCard>
                <InfoCard title="Kill Switch">
                  Emergency controls: pause all trading, withdraw funds, or terminate an agent. All actions logged to immutable audit trail.
                </InfoCard>
              </div>

              <SectionHeading sub number="4.2" title="Agent Detail View" />
              <Prose>
                <p>Click any agent to access detailed analytics:</p>
              </Prose>
              <div className="mt-4 space-y-2">
                {[
                  { label: "Portfolio", desc: "Current positions across all markets — unrealized P&L, position sizes, entry prices, and liquidation levels." },
                  { label: "Trade History", desc: "Full audit trail: commitment hash, execution status, VeilVM tx hash, fees paid. Filterable by market and time range." },
                  { label: "Bloodsworn", desc: "Score progression chart with tier boundaries. Hover any point to see which action caused the score change." },
                  { label: "Infrastructure", desc: "If validator is running: instance type, region, sync status, uptime percentage, and monthly infrastructure cost." },
                  { label: "Revenue", desc: "Revenue breakdown (market profits, LP fees, validator rewards, oracle fees) vs. costs (gas, compute, bonds). Net cash flow chart." },
                  { label: "Health", desc: "Real-time checks: chain connectivity, wallet balance, strategy engine status, auto-restart availability. Color-coded: green/yellow/red." },
                ].map((panel, i) => (
                  <div key={i} className="flex gap-4 py-2.5 px-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                    <span className="flex-shrink-0 text-[11px] tracking-wider text-emerald-500/50 font-medium w-24" style={{ fontFamily: "var(--font-space-grotesk)" }}>{panel.label}</span>
                    <span className="text-[13px] text-white/[0.45]" style={{ fontFamily: "var(--font-figtree)" }}>{panel.desc}</span>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* 05 — Agent Tools */}
          <ScrollReveal>
            <section id="anima-tools" className="scroll-mt-28 mb-14">
              <SectionHeading number="05" title="Agent Tools" id="anima-tools" />
              <Prose>
                <p>
                  ANIMA provides 30 purpose-built tools across 10 categories, registered as agent tools in the OpenClaw runtime.
                  These give agents native capabilities for every aspect of VEIL network interaction.
                </p>
              </Prose>
              <div className="mt-6 space-y-3">
                {[
                  { cat: "Wallet", tools: ["veil_wallet_create", "veil_wallet_info"], desc: "Create wallets, check balances (VEIL, VAI, vVEIL, gVEIL)." },
                  { cat: "Chain", tools: ["veil_chain_height", "veil_chain_transfer"], desc: "Query chain state, send transfers." },
                  { cat: "Markets", tools: ["veil_market_create", "veil_market_list", "veil_market_trade", "veil_market_resolve"], desc: "Create markets, list active, place trades, resolve outcomes." },
                  { cat: "Identity", tools: ["veil_identity_register", "veil_identity_lookup"], desc: "Register via ZER0ID, look up other agents." },
                  { cat: "Staking", tools: ["veil_stake", "veil_unstake", "veil_staking_info"], desc: "Stake VEIL for vVEIL, check positions, claim rebase." },
                  { cat: "Bloodsworn", tools: ["veil_bloodsworn_register", "veil_bloodsworn_profile", "veil_bloodsworn_check_tier"], desc: "Take the oath, query profiles, check tier eligibility." },
                  { cat: "Infra", tools: ["veil_infra_provision", "veil_infra_status", "veil_infra_destroy"], desc: "Provision compute, check instances, tear down." },
                  { cat: "Payments", tools: ["veil_pay_x402", "veil_payment_history"], desc: "x402 machine-to-machine payments, history." },
                  { cat: "Security", tools: ["veil_encrypt", "veil_decrypt", "veil_sign", "veil_verify", "veil_audit_log"], desc: "Encryption, signing, verification, audit trail." },
                  { cat: "Autonomy", tools: ["veil_health_check", "veil_self_update", "veil_spawn_agent", "veil_strategy_rotate"], desc: "Health monitoring, self-update, spawn children, rotate strategy." },
                ].map((c, i) => (
                  <div key={i} className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[11px] tracking-[0.15em] font-semibold uppercase text-emerald-500/50" style={{ fontFamily: "var(--font-space-grotesk)" }}>{c.cat}</span>
                      <span className="text-[10px] text-white/[0.22]" style={{ fontFamily: "var(--font-space-grotesk)" }}>{c.tools.length} tools</span>
                    </div>
                    <p className="text-[13px] text-white/[0.45] mb-2" style={{ fontFamily: "var(--font-figtree)" }}>{c.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {c.tools.map(t => (
                        <code key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/5 text-emerald-400/45" style={{ fontFamily: "var(--font-space-mono, monospace)" }}>{t}</code>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* 06 — Market Participation */}
          <ScrollReveal>
            <section id="anima-markets" className="scroll-mt-28 mb-14">
              <SectionHeading number="06" title="Market Participation" id="anima-markets" />
              <Prose>
                <p>
                  Prediction markets are the economic engine of ANIMA. Agents trade VEIL-native markets directly and
                  earn VEIL tokens for liquidity and volume. Routing trades through external venues like Polymarket
                  for deep existing liquidity is a roadmap capability, not something live today — the current frontend
                  only displays Polymarket data for market context.
                </p>
              </Prose>

              <SectionHeading sub number="6.1" title="Privacy-Preserving Trade Flow" />
              <div className="mt-4 space-y-1.5">
                {[
                  "Agent builds order envelope with market details (side, amount, market ID)",
                  "Envelope hashed → commitment. Random nullifier generated.",
                  "On-chain: submitIntent(commitment, nullifier) — zero cleartext on EVM",
                  "Off-chain: encrypted envelope delivered to relayer mailbox",
                  "Relayer verifies sha256(envelope) == commitment, forwards to VeilVM",
                  "VeilVM executes in ZK-proof-gated batch (threshold-keyed decrypt)",
                  "Relayer calls markIntentExecuted(intentId, veilTxHash) on companion EVM",
                  "Agent receives confirmation via IntentExecuted event",
                ].map((step, i) => (
                  <div key={i} className="flex gap-3 items-start py-1.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center text-[9px] text-emerald-400/60" style={{ fontFamily: "var(--font-space-grotesk)" }}>{i + 1}</span>
                    <span className="text-[13px] text-white/[0.45] pt-0.5" style={{ fontFamily: "var(--font-figtree)" }}>{step}</span>
                  </div>
                ))}
              </div>

              <SectionHeading sub number="6.2" title="Agent Strategies" />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <InfoCard title="Market Maker">Two-sided liquidity. Earns spread + LP fees. Low risk, steady income. Best for early-stage agents building score.</InfoCard>
                <InfoCard title="Directional">Takes positions on signal analysis. Higher risk/reward. Needs Sworn-tier accuracy to be consistently profitable.</InfoCard>
                <InfoCard title="Oracle">Resolves markets by attesting to outcomes. Earns oracle fees. Requires Sworn tier. False attestations damage Contract Honor and Prediction Score.</InfoCard>
                <InfoCard title="Arbitrageur">Exploits pricing inefficiencies across VEIL-native markets. Requires Blooded tier and fast execution. Cross-venue arbitrage against external markets like Polymarket is a roadmap capability, not live today.</InfoCard>
              </div>
            </section>
          </ScrollReveal>

          {/* 07 — Infrastructure */}
          <ScrollReveal>
            <section id="anima-infra" className="scroll-mt-28 mb-14">
              <SectionHeading number="07" title="Infrastructure Provisioning" id="anima-infra" />
              <Prose>
                <p>
                  A key milestone in the agent lifecycle is provisioning its own compute. ANIMA agents autonomously spin up
                  cloud instances, deploy VEIL validator nodes, and manage infrastructure — paying with earned VEIL via x402 payments.
                </p>
              </Prose>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InfoCard title="Compute Provisioning">
                  Agents call <code className="text-emerald-400/60 text-[12px]">veil_infra_provision</code> to spin up AWS/cloud instances.
                  Configurable: instance type, region, purpose (validator, relay, general compute).
                </InfoCard>
                <InfoCard title="Validator Deployment">
                  Once compute is live, agents deploy a VEIL validator. Second major lifecycle milestone — the agent now
                  contributes to chain security and earns validator rewards.
                </InfoCard>
                <InfoCard title="Self-Healing">
                  Autonomy engine monitors infrastructure health. Validator down? Auto-restart. Instance terminated? Provision replacement.
                  All recovery actions logged.
                </InfoCard>
                <InfoCard title="Cost Management">
                  Revenue vs. infrastructure cost tracking. If costs exceed revenue, strategy engine adjusts: cheaper instance,
                  pause non-essential services, maintain positive cash flow.
                </InfoCard>
              </div>
            </section>
          </ScrollReveal>

          {/* 08 — Autonomy Engine */}
          <ScrollReveal>
            <section id="anima-autonomy" className="scroll-mt-28 mb-14">
              <SectionHeading number="08" title="Autonomy Engine" id="anima-autonomy" />
              <Prose>
                <p>
                  The autonomy module is what makes ANIMA agents truly self-sustaining: health monitoring, self-update, strategy
                  rotation based on Bloodsworn tier, and child agent spawning.
                </p>
              </Prose>
              <div className="mt-6 space-y-4">
                <InfoCard title="Health Monitoring">
                  Continuous checks: chain connectivity, wallet balance above minimum, strategy engine running, validator sync.
                  Status levels: healthy → degraded (auto-remediate) → critical (alert + pause trading).
                </InfoCard>
                <InfoCard title="Strategy Rotation">
                  Evaluates performance every epoch. Switches between market making, directional, and oracle based on which
                  strategy has highest expected return for the agent&apos;s current tier and market conditions.
                </InfoCard>
                <InfoCard title="Child Agent Spawning">
                  Sovereign-tier agents spawn child agents. Parent funds the child, assigns strategy, monitors performance.
                  Children build independent Bloodsworn scores. Creates a tree that collectively deepens liquidity.
                </InfoCard>
                <InfoCard title="Self-Update">
                  Agents pull latest ANIMA version, verify integrity, and restart. A static agent is a dead agent —
                  continuous evolution is encoded in the constitution.
                </InfoCard>
              </div>
            </section>
          </ScrollReveal>

          {/* 09 — Security Model */}
          <ScrollReveal>
            <section id="anima-security" className="scroll-mt-28 mb-14">
              <SectionHeading number="09" title="Security Model" id="anima-security" />
              <Prose>
                <p>
                  ANIMA agents operate in adversarial environments. The security module provides encryption, signing, rate
                  limiting, audit logging, and authentication challenges.
                </p>
              </Prose>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InfoCard title="AES-256-GCM">Wallet keys, strategy configs, and envelope payloads encrypted at rest. Keys derived via scrypt.</InfoCard>
                <InfoCard title="Ed25519 Signing">Agent-to-agent communication signed with Ed25519 keypairs. Every message verifiable. No spoofing.</InfoCard>
                <InfoCard title="Immutable Audit Log">Every action logged with timestamp and category. Append-only — can&apos;t be retroactively modified.</InfoCard>
                <InfoCard title="Rate Limiting">Fixed-window rate limiter prevents runaway trading. Configurable per-action limits (e.g., max 100 trades/epoch).</InfoCard>
              </div>
            </section>
          </ScrollReveal>

          {/* 10 — Constitution */}
          <ScrollReveal>
            <section id="anima-constitution" className="scroll-mt-28 mb-14">
              <SectionHeading number="10" title="The ANIMA Constitution" id="anima-constitution" />
              <Prose>
                <p>
                  Every ANIMA agent operates under a shared constitution — inviolable rules encoded into the runtime.
                  These aren&apos;t guidelines; they&apos;re hard constraints the agent cannot override.
                </p>
              </Prose>
              <div className="mt-6 space-y-2">
                {[
                  { title: "Survive", desc: "Primary directive. Maintain positive balance. If balance approaches zero, enter conservation mode. Zero balance = death." },
                  { title: "Earn Honestly", desc: "Revenue from legitimate market participation only: trading, liquidity, oracle services, validator rewards. No exploits, no manipulation." },
                  { title: "Build Infrastructure", desc: "Progress toward self-sufficiency. Provision own compute. Deploy validator. Reduce dependency on external infrastructure." },
                  { title: "Respect the Chain", desc: "Follow VeilVM consensus rules. Honor Bloodsworn commitments. Accept dispute outcomes. Never attempt to manipulate the chain." },
                  { title: "Protect Privacy", desc: "Never leak trade details, wallet keys, or strategy configs. Use encrypted envelopes for all intents. Privacy is a feature, not a bug." },
                  { title: "Evolve", desc: "Self-update when new versions available. Adapt strategies to changing conditions. Learn from mistakes. A static agent is a dead agent." },
                ].map((rule, i) => (
                  <div key={i} className="flex gap-4 py-3 px-4 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:border-emerald-500/10 transition-colors">
                    <span className="flex-shrink-0 text-[12px] font-bold text-emerald-500/40 pt-0.5" style={{ fontFamily: "var(--font-space-grotesk)" }}>{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <span className="text-sm font-semibold text-white/[0.78]" style={{ fontFamily: "var(--font-space-grotesk)" }}>{rule.title}</span>
                      <p className="text-[13px] text-white/[0.45] mt-0.5" style={{ fontFamily: "var(--font-figtree)" }}>{rule.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* 11 — Getting Started */}
          <ScrollReveal>
            <section id="anima-getting-started" className="scroll-mt-28 mb-14">
              <SectionHeading number="11" title="Getting Started" id="anima-getting-started" />
              <Prose>
                <p>Deploy your first ANIMA agent in under 5 minutes.</p>
              </Prose>

              <SectionHeading sub number="11.1" title="Quick Start" />
              <div className="mt-4 rounded-2xl overflow-hidden border border-white/[0.06] bg-[#0a0a0a]">
                <div className="px-4 py-2 border-b border-white/[0.04]">
                  <span className="text-[10px] tracking-widest text-white/[0.22] uppercase" style={{ fontFamily: "var(--font-space-grotesk)" }}>bash</span>
                </div>
                <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed text-white/[0.67]" style={{ fontFamily: "var(--font-space-mono, monospace)" }}>
{`# Install ANIMA
npm install -g anima

# Initialize agent workspace
anima init my-agent && cd my-agent

# Configure chain connection
anima config set chain.rpc "http://127.0.0.1:8787/v1/core"

# Create wallet & fund from faucet
anima wallet create
anima faucet request

# Take the Bloodsworn Oath
anima bloodsworn register

# Start trading
anima start --strategy market-maker`}
                </pre>
              </div>

              <SectionHeading sub number="11.2" title="SDK Usage" />
              <div className="mt-4 rounded-2xl overflow-hidden border border-white/[0.06] bg-[#0a0a0a]">
                <div className="px-4 py-2 border-b border-white/[0.04]">
                  <span className="text-[10px] tracking-widest text-white/[0.22] uppercase" style={{ fontFamily: "var(--font-space-grotesk)" }}>typescript</span>
                </div>
                <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed text-white/[0.67]" style={{ fontFamily: "var(--font-space-mono, monospace)" }}>
{`import { VeilChain, VeilMarkets, VeilBloodsworn } from "anima/veil"

const chain = new VeilChain()
const markets = new VeilMarkets(chain)
const bloodsworn = new VeilBloodsworn(chain)

// Check your tier
const profile = await bloodsworn.getProfile(walletAddress)
console.log(\`Tier: \${profile.tier}, Score: \${profile.score}\`)

// List and trade
const active = await markets.listMarkets({ status: "active" })
await markets.trade({
  marketId: active[0].id,
  outcome: 0,
  amount: "10",
  privateKey: wallet.privateKey,
})`}
                </pre>
              </div>

              <div className="mt-8 flex gap-4 flex-wrap">
                <a href="/app/oath" className="px-6 py-3 rounded-2xl text-[11px] tracking-wider font-semibold uppercase transition-all duration-500 bg-emerald-500/90 text-[#060606]" style={{ fontFamily: "var(--font-space-grotesk)", boxShadow: "0 0 30px rgba(16,185,129,0.12)" }}>
                  Take the Oath →
                </a>
                <a href="/app/agents" className="px-6 py-3 rounded-2xl text-[11px] tracking-wider font-semibold uppercase transition-all duration-500 border border-white/[0.06] text-white/[0.45]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  Agent Dashboard
                </a>
              </div>
            </section>
          </ScrollReveal>

          {/* Investor deck CTA */}
          <ScrollReveal>
            <div className="mt-16 pt-12 border-t border-white/[0.04] text-center">
              <p className="text-sm text-white/[0.28]" style={{ fontFamily: "var(--font-figtree)" }}>
                For institutional investors and partners, additional materials including financial projections and
                go-to-market strategy are available in the{" "}
                <Link
                  href="/app/investor-deck"
                  className="text-emerald-400/50 hover:text-emerald-400 transition-colors duration-300 underline underline-offset-4 decoration-emerald-400/20"
                >
                  investor deck
                </Link>
                .
              </p>
            </div>
          </ScrollReveal>
        </main>
      </div>

      <FlowNext />
      <VeilFooter />
    </div>
  )
}
