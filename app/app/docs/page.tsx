"use client"

import { useRef, useState, useEffect, ReactNode } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Link from "next/link"

/* ─────────────────────── helpers ─────────────────────── */

function ScrollReveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
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
    <div className="space-y-4 leading-[1.8] text-[15px] text-white/55" style={{ fontFamily: "var(--font-figtree)" }}>
      {children}
    </div>
  )
}

/* card for architecture boxes etc. */
function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-500 hover:border-emerald-500/15 hover:bg-emerald-500/[0.02]">
      <h4 className="mb-2 text-sm font-semibold text-white/80" style={{ fontFamily: "var(--font-space-grotesk)" }}>{title}</h4>
      <p className="text-sm leading-relaxed text-white/50" style={{ fontFamily: "var(--font-figtree)" }}>{children}</p>
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

/* ─────────────────────── page ─────────────────────── */

export default function DocsPage() {
  const [activeId, setActiveId] = useState("")
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  /* intersection observer for active TOC highlight */
  useEffect(() => {
    const ids = [...tocPart1, ...tocPart2].map((t) => t.id)
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
        activeId === id ? "text-emerald-400" : "text-white/30 hover:text-white/60"
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

      {/* ── Fixed top nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.04] bg-[#060606]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/app" className="flex items-center gap-2 text-white/80 transition hover:text-white">
            <span className="text-lg font-medium tracking-tight" style={{ fontFamily: "var(--font-instrument-serif)" }}>VEIL</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-500/60" style={{ fontFamily: "var(--font-space-grotesk)" }}>Protocol Docs</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-[13px] text-white/40" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            <a href="#tech-abstract" className="hover:text-white/70 transition">Technical</a>
            <a href="#econ-abstract" className="hover:text-white/70 transition">Economics</a>
            <Link href="/app/investor-deck" className="hover:text-white/70 transition">Investor Deck</Link>
          </div>
          <button className="md:hidden text-white/40" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={mobileNavOpen ? "M6 18L18 6M6 6l12 12" : "M4 8h16M4 16h16"} /></svg>
          </button>
        </div>
      </nav>

      {/* ── Mobile nav overlay ── */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#060606]/95 backdrop-blur-xl pt-20 px-6 overflow-y-auto md:hidden"
          >
            <div className="mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-500/50 mb-3" style={{ fontFamily: "var(--font-space-grotesk)" }}>Part I — Technical</p>
              {tocPart1.map((t) => <TocLink key={t.id} {...t} />)}
            </div>
            <div className="mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-500/50 mb-3 mt-6" style={{ fontFamily: "var(--font-space-grotesk)" }}>Part II — Economics</p>
              {tocPart2.map((t) => <TocLink key={t.id} {...t} />)}
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
            <div className="space-y-0.5">
              {tocPart2.map((t) => <TocLink key={t.id} {...t} />)}
            </div>
          </div>
        </aside>

        {/* main content */}
        <main className="min-w-0 flex-1 max-w-3xl">
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
                className="text-lg text-white/35 max-w-xl leading-relaxed"
                style={{ fontFamily: "var(--font-figtree)" }}
              >
                Privacy-native prediction markets on an Avalanche L1 Subnet. Technical architecture & token economics.
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

          {/* ═══════════════════ PART I ═══════════════════ */}
          <ScrollReveal>
            <div className="mb-14 mt-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-500/40 mb-3" style={{ fontFamily: "var(--font-space-grotesk)" }}>Part I</p>
              <h1 className="text-4xl md:text-5xl font-normal text-white/90 mb-3" style={{ fontFamily: "var(--font-instrument-serif)" }}>
                Technical Architecture
              </h1>
              <p className="text-base text-white/30" style={{ fontFamily: "var(--font-figtree)" }}>Privacy-Native Prediction Markets on an Avalanche L1 Subnet</p>
            </div>
          </ScrollReveal>

          {/* Abstract */}
          <ScrollReveal>
            <section id="tech-abstract" className="scroll-mt-28 mb-14">
              <SectionHeading title="Abstract" id="tech-abstract" />
              <Prose>
                <p>
                  VEIL is a privacy-native prediction market running on a dedicated Avalanche L1 Subnet. It combines an{" "}
                  <strong className="text-white/75">encrypted mempool</strong> (threshold-encrypted transactions), a{" "}
                  <strong className="text-white/75">shielded ledger</strong> (commitment-nullifier model with ZK-SNARKs),
                  and <strong className="text-white/75">uniform batch auctions</strong> to prevent order leakage and
                  front-running while maintaining regulatory transparency through selective disclosure.
                </p>
                <p>
                  The system achieves <strong className="text-white/75">sub-second finality</strong> via Avalanche
                  consensus, <strong className="text-white/75">deterministic replay</strong> for audits, and{" "}
                  <strong className="text-white/75">objective slashing</strong> for misbehaving operators. This document
                  specifies the cryptographic primitives, VM implementation (HyperSDK), oracle resolution with VRF-selected
                  committees, and service-level objectives (SLOs) that govern market quality.
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
                  Prediction markets aggregate dispersed information into a single price, but existing designs leak order
                  flow to validators, searchers, and competing traders. This{" "}
                  <strong className="text-white/75">alpha leakage</strong> discourages informed participation and degrades
                  price discovery.
                </p>
                <p>
                  VEIL solves this by running on a <strong className="text-white/75">privacy-first Avalanche Subnet</strong>{" "}
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
                  VEIL operates a <strong className="text-white/75">dual market engine</strong>: orders can be routed through
                  Polymarket's deep liquidity pools for a <strong className="text-white/75">0.03% routing fee</strong>,
                  giving traders access to the world's most liquid prediction markets with a privacy layer on top.
                  Alternatively, users can trade <strong className="text-white/75">VEIL-native markets</strong> directly
                  on-chain and earn VEIL token rewards for providing liquidity and volume.
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
                <p>VEIL's architecture consists of four layers:</p>
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
                  Financial markets use VRF-selected committees with BLS signatures. Social, political, and non-financial markets are resolved by Grok 4.2 (xAI) with on-chain query commitment and cryptographic attestation
                </InfoCard>
              </div>
              <Prose>
                <p>
                  The system runs on a dedicated Avalanche Subnet with custom HyperSDK VM optimized for batch clearing and
                  ZK verification. Validators post slashable bonds and are subject to objective penalties for rule
                  violations.
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
                  VEIL supports prediction markets where users can bet on future events. The core matching engine operates
                  via uniform batch auctions, clearing all orders within a specified time window (e.g., 2 seconds) at a
                  single, volume-weighted average price.
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
                  Market outcomes are determined by a decentralized oracle committee selected via verifiable random
                  functions (VRFs). This committee, composed of bonded operators, attests to the ground truth of market
                  outcomes.
                </p>
                <p>
                  <strong className="text-white/75">Attestation process:</strong> Committee members sign a final outcome
                  using BLS signatures. <strong className="text-white/75">Dispute resolution:</strong> A defined dispute
                  window allows any participant to challenge an outcome by posting a bond. If the challenge is successful,
                  the challenger receives their bond back, and the committee members are slashed. Otherwise, the bond is
                  forfeited.
                </p>
                <p>
                  This mechanism ensures accurate and tamper-proof resolution while providing economic incentives for
                  truthful reporting and a robust dispute mechanism.
                </p>
              </Prose>
            </section>
          </ScrollReveal>

          {/* 9. Economics & Depth (Slashing) */}
          <ScrollReveal>
            <section id="economics-depth" className="scroll-mt-28 mb-14">
              <SectionHeading number="09" title="Slashing & Penalties" id="economics-depth" />
              <Prose>
                <p>
                  VEIL enforces protocol rules through a slashing mechanism tied to bonded validators and oracle operators.
                  Malicious behavior, such as attempting to decrypt orders prematurely, colluding on prices, or submitting
                  false oracle attestations, will result in a forfeiture of a portion of the operator's bond.
                </p>
                <p>
                  <strong className="text-white/75">Slashing conditions</strong> are defined in the protocol and detected
                  via on-chain monitoring and dispute resolution. The amount slashed depends on the severity of the offense.
                  These penalties serve as a credible deterrent against bad actors.
                </p>
                <p>
                  <strong className="text-white/75">Economic security</strong> is paramount; slashing ensures that operators
                  have skin in the game and are aligned with the protocol's integrity.
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
                  Protocol parameters, such as batch clearing intervals, oracle committee sizes, and slashing penalties, are
                  governed by the VEIL token holders.
                </p>
                <p>
                  <strong className="text-white/75">On-chain governance</strong> proposals are submitted, voted upon, and
                  executed via smart contracts. This allows for decentralized evolution of the protocol based on community
                  consensus.
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
                  <strong className="text-white/75">Smart contracts</strong> handle market creation, token logic, and
                  governance interactions. <strong className="text-white/75">Cryptography</strong> utilizes BLS12-381 for
                  threshold encryption and Groth16 for ZK-SNARK proofs.
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
                  mitigation. These include protocols for validator collusion, oracle failures, smart contract exploits, and
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
                  VEIL represents a significant advancement in prediction market technology, addressing the fundamental
                  problem of alpha leakage through a novel combination of privacy-preserving primitives and efficient batch
                  clearing on a dedicated Avalanche Subnet.
                </p>
                <p>
                  By prioritizing order and balance privacy, fair execution, and robust resolution mechanisms, VEIL unlocks
                  new possibilities for professional participation, information aggregation, and regulatory compliance in
                  the decentralized prediction market landscape.
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
              <p className="text-base text-white/30" style={{ fontFamily: "var(--font-figtree)" }}>Economic Design & Incentive Mechanisms</p>
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
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Operators:</strong> Run validator nodes, provide liquidity, and participate in oracle committees. They stake VEIL tokens and are subject to slashing.</span></li>
                  <li className="flex gap-3"><span className="text-emerald-500/50 mt-0.5 shrink-0">—</span><span><strong className="text-white/75">Protocol:</strong> The smart contracts and logic that govern market creation, clearing, and fee distribution. It accrues chain-owned liquidity (POL).</span></li>
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
                  The protocol's success hinges on delivering high-quality prediction markets. Key SLOs define acceptable
                  market performance:
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
                  <p className="text-xs uppercase tracking-widest text-white/35" style={{ fontFamily: "var(--font-space-grotesk)" }}>MSRB Depth</p>
                </div>
                <div className="rounded-[20px] border border-emerald-500/10 bg-emerald-500/[0.02] p-5 text-center">
                  <p className="text-3xl font-light text-emerald-400/80 mb-1" style={{ fontFamily: "var(--font-instrument-serif)" }}>20%</p>
                  <p className="text-xs uppercase tracking-widest text-white/35" style={{ fontFamily: "var(--font-space-grotesk)" }}>POL Buyback</p>
                </div>
                <div className="rounded-[20px] border border-emerald-500/10 bg-emerald-500/[0.02] p-5 text-center">
                  <p className="text-3xl font-light text-emerald-400/80 mb-1" style={{ fontFamily: "var(--font-instrument-serif)" }}>10%</p>
                  <p className="text-xs uppercase tracking-widest text-white/35" style={{ fontFamily: "var(--font-space-grotesk)" }}>Operations</p>
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
                  resilience of the prediction market.
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
                  Operators are incentivized to run secure and reliable infrastructure through a combination of fee revenue
                  and potential slashing penalties.
                </p>
                <p>
                  <strong className="text-white/75">Revenue Streams:</strong> Operators earn a share of protocol fees (10%
                  allocation) and can potentially earn trading fees from providing liquidity.
                </p>
                <p>
                  <strong className="text-white/75">Staking & Slashing:</strong> To operate, nodes must stake VEIL tokens.
                  Honest participation is rewarded, while malicious actions or downtime result in slashing (forfeiture of
                  staked tokens), aligning operator incentives with network integrity.
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
                  <strong className="text-white/75">Keep3r Program Reserve:</strong> 2.0% of total supply
                  (19,819,980 VEIL) is reserved for a foundation-bootstrapped, chain-native Keep3r program with bounded,
                  timelocked reward controls.
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
                  private and efficient prediction markets.
                </p>
              </Prose>
            </section>
          </ScrollReveal>

          {/* Investor deck CTA */}
          <ScrollReveal>
            <div className="mt-16 pt-12 border-t border-white/[0.04] text-center">
              <p className="text-sm text-white/25" style={{ fontFamily: "var(--font-figtree)" }}>
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

      {/* ── Fixed footer ── */}
      <footer className="border-t border-white/[0.04] bg-[#060606]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-white/20" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            © 2026 VEIL · TSL — No users. Only developers.
          </p>
          <div className="flex items-center gap-6 text-[12px] text-white/20" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            <Link href="/app" className="hover:text-white/40 transition">Home</Link>
            <Link href="/app/investor-deck" className="hover:text-white/40 transition">Investors</Link>
            <Link href="/app/docs" className="text-emerald-500/40">Docs</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
