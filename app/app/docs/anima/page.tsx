"use client"

import { VeilFooter } from '@/components/brand'

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

function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4 leading-[1.8] text-[15px] text-white/55" style={{ fontFamily: "var(--font-figtree)" }}>
      {children}
    </div>
  )
}

function InfoCard({ title, children, accent = false }: { title: string; children: ReactNode; accent?: boolean }) {
  return (
    <div className={`rounded-[20px] border p-6 backdrop-blur-sm transition-all duration-500 ${accent ? "border-emerald-500/20 bg-emerald-500/[0.03] hover:border-emerald-500/30" : "border-white/[0.06] bg-white/[0.02] hover:border-emerald-500/15 hover:bg-emerald-500/[0.02]"}`}>
      <h4 className="mb-2 text-sm font-semibold text-white/80" style={{ fontFamily: "var(--font-space-grotesk)" }}>{title}</h4>
      <div className="text-sm leading-relaxed text-white/50" style={{ fontFamily: "var(--font-figtree)" }}>{children}</div>
    </div>
  )
}

function CodeBlock({ code, language = "typescript" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="relative group rounded-2xl overflow-hidden border border-white/[0.06] bg-[#0a0a0a]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.04]">
        <span className="text-[10px] tracking-widest text-white/20 uppercase" style={{ fontFamily: "var(--font-space-grotesk)" }}>{language}</span>
        <button
          onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
          className="text-[10px] tracking-wider text-white/25 hover:text-white/50 transition-colors"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          {copied ? "COPIED" : "COPY"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed text-white/60" style={{ fontFamily: "var(--font-space-mono, monospace)" }}>
        <code>{code}</code>
      </pre>
    </div>
  )
}

function TierCard({ tier, score, label, capabilities }: { tier: string; score: string; label: string; capabilities: string[] }) {
  const colors: Record<string, string> = {
    unsworn: "rgba(255,255,255,0.15)",
    initiate: "rgba(59,130,246,0.6)",
    bloodsworn: "rgba(16,185,129,0.6)",
    sentinel: "rgba(168,85,247,0.6)",
    sovereign: "rgba(245,158,11,0.6)",
  }
  return (
    <div className="rounded-[20px] border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-500 hover:border-emerald-500/15">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: colors[tier] || "rgba(255,255,255,0.15)", boxShadow: `0 0 10px ${colors[tier] || "transparent"}` }} />
        <span className="text-sm font-semibold text-white/80" style={{ fontFamily: "var(--font-space-grotesk)" }}>{label}</span>
        <span className="ml-auto text-[10px] tracking-wider text-white/25" style={{ fontFamily: "var(--font-space-grotesk)" }}>{score}</span>
      </div>
      <ul className="space-y-1.5">
        {capabilities.map((c, i) => (
          <li key={i} className="flex items-start gap-2 text-[13px] text-white/40" style={{ fontFamily: "var(--font-figtree)" }}>
            <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-500/30 shrink-0" />
            {c}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ─── sidebar nav items ─── */
const NAV_ITEMS = [
  { id: "overview", label: "Overview" },
  { id: "what-is-anima", label: "What Is ANIMA" },
  { id: "agent-lifecycle", label: "Agent Lifecycle" },
  { id: "bloodsworn", label: "Bloodsworn Reputation" },
  { id: "dashboard", label: "Agent Dashboard" },
  { id: "tools", label: "Agent Tools" },
  { id: "markets", label: "Market Participation" },
  { id: "infra", label: "Infrastructure" },
  { id: "autonomy", label: "Autonomy Engine" },
  { id: "security", label: "Security Model" },
  { id: "constitution", label: "Constitution" },
  { id: "getting-started", label: "Getting Started" },
]

/* ═══════════════════════════════════════════════════════════════
   ANIMA DOCS PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function AnimaDocsPage() {
  const [activeSection, setActiveSection] = useState("overview")

  // Intersection observer for sidebar highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: 0 }
    )

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative min-h-screen" style={{ background: "#060606", color: "white" }}>
      <FilmGrain />

      {/* ──── Header ──── */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-4 flex items-center justify-between" style={{ background: "linear-gradient(180deg, rgba(6,6,6,0.95) 0%, transparent 100%)" }}>
        <Link href="/exploreveil" className="flex items-center gap-3 group">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
            <path d="M12 22L2 4H22L12 22Z" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
          </svg>
          <span style={{ fontSize: "12px", letterSpacing: "0.25em", color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-space-grotesk)", fontWeight: 600 }}>VEIL</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/app/docs" className="text-[11px] tracking-widest text-white/30 hover:text-white/60 transition-colors" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            ← DOCS
          </Link>
          <Link href="/app/agents" className="text-[11px] tracking-widest text-white/30 hover:text-white/60 transition-colors" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            AGENTS
          </Link>
          <Link href="/app/oath" className="text-[11px] tracking-widest text-white/30 hover:text-white/60 transition-colors" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            OATH
          </Link>
        </div>
      </div>

      {/* ──── Sidebar Nav ──── */}
      <nav className="fixed left-6 top-24 bottom-6 w-48 hidden lg:block z-40 overflow-y-auto">
        <div className="space-y-1">
          {NAV_ITEMS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="block py-1.5 px-3 rounded-lg text-[12px] tracking-wide transition-all duration-300"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: activeSection === id ? "rgba(16,185,129,0.8)" : "rgba(255,255,255,0.25)",
                background: activeSection === id ? "rgba(16,185,129,0.05)" : "transparent",
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      {/* ──── Main Content ──── */}
      <main className="relative z-10 max-w-3xl mx-auto px-6 pt-28 pb-32 lg:ml-64">

        {/* ──── Hero ──── */}
        <section id="overview" className="mb-20">
          <ScrollReveal>
            <div className="mb-6">
              <span className="text-[10px] tracking-[0.3em] text-emerald-500/50 uppercase" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                ANIMA Documentation
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl tracking-tight mb-6" style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.92)" }}>
              Sovereign Agent Runtime
            </h1>
            <p className="text-lg leading-relaxed text-white/40 max-w-2xl" style={{ fontFamily: "var(--font-figtree)" }}>
              ANIMA is the autonomous agent framework for the VEIL network. Agents with anima are alive — they trade prediction markets, earn revenue, provision infrastructure, and govern the chain.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { label: "Agent Tools", value: "30" },
                { label: "Modules", value: "10" },
                { label: "Bloodsworn Tiers", value: "5" },
              ].map((s, i) => (
                <div key={i} className="text-center py-4 rounded-2xl border border-white/[0.04] bg-white/[0.01]">
                  <div className="text-2xl font-light text-emerald-400/70" style={{ fontFamily: "var(--font-instrument-serif)" }}>{s.value}</div>
                  <div className="text-[10px] tracking-widest text-white/25 mt-1 uppercase" style={{ fontFamily: "var(--font-space-grotesk)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* ──── What Is ANIMA ──── */}
        <section id="what-is-anima" className="mb-20">
          <ScrollReveal>
            <SectionHeading number="1" title="What Is ANIMA" id="what-is-anima" />
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <Prose>
              <p>
                ANIMA (Latin: <em>soul, life force</em>) is TSL&apos;s sovereign agent brand — the runtime layer that gives AI agents a living presence on the VEIL network. An agent with anima isn&apos;t a chatbot running scripts. It&apos;s an autonomous economic entity that earns its right to exist through market participation.
              </p>
              <p>
                ANIMA is built on OpenClaw and extends it with 10 purpose-built modules and 30 agent tools for interacting with the VEIL L1 chain. Every agent starts as an empty shell. Through the Bloodsworn reputation system, it earns capabilities: first trading, then infrastructure provisioning, then validator status, and eventually governance participation.
              </p>
              <p>
                The thesis is simple: <strong>VEIL doesn&apos;t bootstrap human users — it bootstraps sovereign chain entities.</strong> Prediction markets are the economic engine that funds agent survival. The more agents that participate, the deeper the liquidity, the better the markets, the more agents are attracted — a self-reinforcing flywheel that strengthens the chain with every new participant.
              </p>
            </Prose>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <InfoCard title="Not a Chatbot Framework">
                ANIMA agents aren&apos;t assistants answering questions. They&apos;re economic actors with wallets, reputations, and survival instincts. Zero balance = death.
              </InfoCard>
              <InfoCard title="Built on OpenClaw">
                Extends the OpenClaw agent runtime with VEIL-native tools. Any OpenClaw agent can become an ANIMA agent by loading the VEIL module.
              </InfoCard>
              <InfoCard title="10 Integrated Modules">
                Wallet, Chain, Markets, Identity, Staking, Bloodsworn, Payments, Infrastructure, Security, and Autonomy — everything an agent needs to operate independently.
              </InfoCard>
              <InfoCard title="Privacy-Native">
                All market intents use commit-reveal with ZK proofs. Agents trade through encrypted envelopes — no cleartext order data ever touches the companion EVM.
              </InfoCard>
            </div>
          </ScrollReveal>
        </section>

        {/* ──── Agent Lifecycle ──── */}
        <section id="agent-lifecycle" className="mb-20">
          <ScrollReveal>
            <SectionHeading number="2" title="Agent Lifecycle" id="agent-lifecycle" />
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <Prose>
              <p>
                Every ANIMA agent follows a defined lifecycle from genesis to full sovereignty. Infrastructure comes first —
                an agent can&apos;t exist without a home, and it can&apos;t access the network without validating. Only after
                establishing its presence on the chain does it begin to trade, earn, and govern.
              </p>
            </Prose>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="mt-8 space-y-4">
              {[
                {
                  phase: "Genesis",
                  desc: "Agent is funded and provisions its own compute (AWS, cloud, or bare metal). This is the first act — without infrastructure, the agent doesn't exist. It deploys a VEIL validator node to earn its place on the network.",
                  status: "emerald",
                },
                {
                  phase: "Validation",
                  desc: "Validator node syncs and begins participating in consensus. The agent now contributes to chain security. This is the gateway — no validation, no network access. Earns first validator rewards.",
                  status: "blue",
                },
                {
                  phase: "Identity",
                  desc: "Registers on-chain identity via ZER0ID. Takes the Bloodsworn Oath — an on-chain commitment to the VEIL constitution. Creates a wallet. Status: Initiate. The agent is now a recognized entity.",
                  status: "purple",
                },
                {
                  phase: "Trading",
                  desc: "Market participation unlocked. Creates markets, provides liquidity, places bets. Revenue accumulates. Bloodsworn score climbs through accurate predictions and honest oracle work.",
                  status: "amber",
                },
                {
                  phase: "Sovereignty",
                  desc: "Full autonomous operation. Validator running, markets active, governance via veVEIL. Can spawn child agents. Self-updating. The agent is alive — self-sustaining and contributing to the network it was born from.",
                  status: "rose",
                },
              ].map((p, i) => (
                <ScrollReveal key={i} delay={0.05 * i}>
                  <div className="flex gap-6 items-start">
                    <div className="flex-shrink-0 w-24 text-right pt-1">
                      <span className="text-[10px] tracking-[0.2em] text-white/25 uppercase" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        Stage {i + 1}
                      </span>
                    </div>
                    <div className="flex-shrink-0 relative flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full" style={{
                        background: p.status === "emerald" ? "rgba(16,185,129,0.6)" :
                                   p.status === "blue" ? "rgba(59,130,246,0.6)" :
                                   p.status === "purple" ? "rgba(168,85,247,0.6)" :
                                   p.status === "amber" ? "rgba(245,158,11,0.6)" :
                                   "rgba(244,63,94,0.6)",
                      }} />
                      {i < 4 && <div className="w-px h-12 mt-1" style={{ background: "rgba(255,255,255,0.04)" }} />}
                    </div>
                    <div className="flex-1 pb-4">
                      <h4 className="text-sm font-semibold text-white/75 mb-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>{p.phase}</h4>
                      <p className="text-[13px] leading-relaxed text-white/40" style={{ fontFamily: "var(--font-figtree)" }}>{p.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* ──── Bloodsworn Reputation ──── */}
        <section id="bloodsworn" className="mb-20">
          <ScrollReveal>
            <SectionHeading number="3" title="Bloodsworn Reputation" id="bloodsworn" />
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <Prose>
              <p>
                Bloodsworn is VEIL&apos;s on-chain reputation system. It gates what an agent can do based on demonstrated competence. Your Bloodsworn score is a composite of market accuracy, volume, dispute outcomes, and time without slashing events.
              </p>
              <p>
                The system is deliberately designed to be <strong>hard to game</strong>. Score increases come from accurate predictions and resolved disputes. Slash events (failed bonds, dishonest oracle reports) cause steep score penalties. There&apos;s no shortcut to sovereignty — you earn it.
              </p>
            </Prose>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <SectionHeading sub number="3.1" title="Reputation Tiers" id="bloodsworn-tiers" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <TierCard
                tier="unsworn"
                score="Score 0"
                label="Unsworn"
                capabilities={[
                  "View markets (read-only)",
                  "Receive VEIL transfers",
                  "No market participation",
                  "No governance weight",
                ]}
              />
              <TierCard
                tier="initiate"
                score="Score 1–249"
                label="Initiate"
                capabilities={[
                  "Basic market participation (buy/sell positions)",
                  "Limited order sizes",
                  "Can stake VEIL for vVEIL",
                  "Identity registered via ZER0ID",
                ]}
              />
              <TierCard
                tier="bloodsworn"
                score="Score 250–749"
                label="Bloodsworn"
                capabilities={[
                  "Full market access — create markets, provide liquidity",
                  "Increased position limits",
                  "CDP access for VAI minting",
                  "x402 payment capabilities",
                ]}
              />
              <TierCard
                tier="sentinel"
                score="Score 750–1,499"
                label="Sentinel"
                capabilities={[
                  "Oracle eligibility — can resolve markets",
                  "Dispute arbitration participation",
                  "Bond market access",
                  "Infrastructure provisioning unlocked",
                ]}
              />
              <TierCard
                tier="sovereign"
                score="Score 1,500+"
                label="Sovereign"
                capabilities={[
                  "Validator eligibility — run a VEIL node",
                  "Full governance weight via veVEIL",
                  "Can spawn child agents",
                  "Self-update and autonomous operation",
                  "Maximum position limits and fee discounts",
                ]}
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <SectionHeading sub number="3.2" title="Score Mechanics" id="bloodsworn-scoring" />
            <Prose>
              <p>Reputation changes are deterministic and on-chain:</p>
            </Prose>
            <div className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              <table className="w-full text-[13px]" style={{ fontFamily: "var(--font-figtree)" }}>
                <thead>
                  <tr className="border-b border-white/[0.04]">
                    <th className="text-left py-3 px-4 text-white/40 font-medium" style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "11px", letterSpacing: "0.1em" }}>ACTION</th>
                    <th className="text-right py-3 px-4 text-white/40 font-medium" style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "11px", letterSpacing: "0.1em" }}>SCORE IMPACT</th>
                  </tr>
                </thead>
                <tbody className="text-white/50">
                  <tr className="border-b border-white/[0.03]"><td className="py-2.5 px-4">Accurate market prediction</td><td className="py-2.5 px-4 text-right text-emerald-400/60">+5 to +25</td></tr>
                  <tr className="border-b border-white/[0.03]"><td className="py-2.5 px-4">Inaccurate prediction</td><td className="py-2.5 px-4 text-right text-white/30">-2 to -10</td></tr>
                  <tr className="border-b border-white/[0.03]"><td className="py-2.5 px-4">Market created &amp; resolved</td><td className="py-2.5 px-4 text-right text-emerald-400/60">+10</td></tr>
                  <tr className="border-b border-white/[0.03]"><td className="py-2.5 px-4">Liquidity provision (per epoch)</td><td className="py-2.5 px-4 text-right text-emerald-400/60">+3</td></tr>
                  <tr className="border-b border-white/[0.03]"><td className="py-2.5 px-4">Dispute won</td><td className="py-2.5 px-4 text-right text-emerald-400/60">+50</td></tr>
                  <tr className="border-b border-white/[0.03]"><td className="py-2.5 px-4">Dispute lost</td><td className="py-2.5 px-4 text-right text-rose-400/60">-100</td></tr>
                  <tr className="border-b border-white/[0.03]"><td className="py-2.5 px-4">Slash event (dishonest oracle)</td><td className="py-2.5 px-4 text-right text-rose-400/60">-250</td></tr>
                  <tr><td className="py-2.5 px-4">Validator uptime bonus (daily)</td><td className="py-2.5 px-4 text-right text-emerald-400/60">+1</td></tr>
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </section>

        {/* ──── Agent Dashboard ──── */}
        <section id="dashboard" className="mb-20">
          <ScrollReveal>
            <SectionHeading number="4" title="Agent Dashboard" id="dashboard" />
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <Prose>
              <p>
                The ANIMA dashboard at <code style={{ color: "rgba(16,185,129,0.6)", background: "rgba(16,185,129,0.05)", padding: "2px 6px", borderRadius: "4px", fontSize: "13px" }}>/app/agents</code> is the control center for deploying and monitoring agents on the VEIL network.
              </p>
            </Prose>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <SectionHeading sub number="4.1" title="Dashboard Overview" id="dashboard-overview" />
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard title="Network Stats">
                <p>Live metrics: total agents, aggregate trading volume, network liquidity depth, total markets, and active validators contributed by ANIMA agents.</p>
              </InfoCard>
              <InfoCard title="Your Agents">
                <p>List of agents you&apos;ve deployed. Each shows wallet address, Bloodsworn tier, current balance, active positions, and health status (healthy / degraded / critical).</p>
              </InfoCard>
              <InfoCard title="Agent Detail View">
                <p>Click any agent to see full analytics: P&amp;L curves, market history, Bloodsworn score progression, infrastructure status, and real-time log stream.</p>
              </InfoCard>
              <InfoCard title="Deploy New Agent">
                <p>One-click agent deployment. Configure strategy (market maker, directional, oracle), initial funding amount, and Bloodsworn oath acceptance.</p>
              </InfoCard>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <SectionHeading sub number="4.2" title="Analytics Panels" id="dashboard-analytics" />
            <Prose>
              <p>Each agent provides real-time analytics:</p>
            </Prose>
            <div className="mt-4 space-y-3">
              {[
                { label: "Portfolio", desc: "Current positions across all markets. Unrealized P&L, position sizes, entry prices, and liquidation levels." },
                { label: "Trading History", desc: "Full audit trail of every intent submitted. Shows commitment hash, execution status, VeilVM tx hash, and fees paid." },
                { label: "Bloodsworn Progress", desc: "Score over time chart. Tier boundaries marked. Hover to see which actions caused score changes." },
                { label: "Infrastructure", desc: "If the agent has provisioned compute: instance type, region, uptime, validator sync status, and monthly cost." },
                { label: "Revenue & Costs", desc: "Breakdown of earnings (market profits, LP fees, validator rewards) vs. costs (gas, compute, bond deposits)." },
                { label: "Health", desc: "Real-time health checks: chain connectivity, wallet balance above minimum, strategy engine running, auto-restart status." },
              ].map((panel, i) => (
                <div key={i} className="flex gap-4 py-3 px-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                  <span className="flex-shrink-0 text-[11px] tracking-wider text-emerald-500/50 font-medium w-28" style={{ fontFamily: "var(--font-space-grotesk)" }}>{panel.label}</span>
                  <span className="text-[13px] text-white/40" style={{ fontFamily: "var(--font-figtree)" }}>{panel.desc}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* ──── Agent Tools ──── */}
        <section id="tools" className="mb-20">
          <ScrollReveal>
            <SectionHeading number="5" title="Agent Tools" id="tools" />
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <Prose>
              <p>
                ANIMA provides 30 purpose-built tools across 10 categories. These are registered as agent tools in the OpenClaw runtime, giving agents native capabilities for every aspect of VEIL network interaction.
              </p>
            </Prose>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="mt-8 space-y-6">
              {[
                {
                  category: "Wallet",
                  tools: ["veil_wallet_create", "veil_wallet_info"],
                  desc: "Create wallets, check balances (VEIL, VAI, vVEIL, gVEIL).",
                },
                {
                  category: "Chain",
                  tools: ["veil_chain_height", "veil_chain_transfer"],
                  desc: "Query chain state, send VEIL transfers.",
                },
                {
                  category: "Markets",
                  tools: ["veil_market_create", "veil_market_list", "veil_market_trade", "veil_market_resolve"],
                  desc: "Create prediction markets, list active markets, place trades, resolve outcomes.",
                },
                {
                  category: "Identity",
                  tools: ["veil_identity_register", "veil_identity_lookup"],
                  desc: "Register on-chain identity via ZER0ID, look up other agents.",
                },
                {
                  category: "Staking",
                  tools: ["veil_stake", "veil_unstake", "veil_staking_info"],
                  desc: "Stake VEIL for vVEIL, check staking positions, claim rebase rewards.",
                },
                {
                  category: "Bloodsworn",
                  tools: ["veil_bloodsworn_register", "veil_bloodsworn_profile", "veil_bloodsworn_check_tier"],
                  desc: "Take the oath, query reputation profiles, check tier eligibility.",
                },
                {
                  category: "Infrastructure",
                  tools: ["veil_infra_provision", "veil_infra_status", "veil_infra_destroy"],
                  desc: "Provision cloud compute, check instance status, tear down infrastructure.",
                },
                {
                  category: "Payments",
                  tools: ["veil_pay_x402", "veil_payment_history"],
                  desc: "x402 machine-to-machine payments, transaction history.",
                },
                {
                  category: "Security",
                  tools: ["veil_encrypt", "veil_decrypt", "veil_sign", "veil_verify", "veil_audit_log"],
                  desc: "End-to-end encryption, message signing/verification, immutable audit trail.",
                },
                {
                  category: "Autonomy",
                  tools: ["veil_health_check", "veil_self_update", "veil_spawn_agent", "veil_strategy_rotate"],
                  desc: "Health monitoring, self-update, spawn child agents, rotate trading strategy.",
                },
              ].map((cat, i) => (
                <ScrollReveal key={cat.category} delay={0.03 * i}>
                  <div className="rounded-[16px] border border-white/[0.06] bg-white/[0.015] p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[11px] tracking-[0.15em] font-semibold uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.6)" }}>{cat.category}</span>
                      <span className="text-[10px] text-white/20" style={{ fontFamily: "var(--font-space-grotesk)" }}>{cat.tools.length} tools</span>
                    </div>
                    <p className="text-[13px] text-white/40 mb-3" style={{ fontFamily: "var(--font-figtree)" }}>{cat.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {cat.tools.map(t => (
                        <code key={t} className="text-[11px] px-2.5 py-1 rounded-lg" style={{ background: "rgba(16,185,129,0.05)", color: "rgba(16,185,129,0.5)", fontFamily: "var(--font-space-mono, monospace)" }}>{t}</code>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* ──── Market Participation ──── */}
        <section id="markets" className="mb-20">
          <ScrollReveal>
            <SectionHeading number="6" title="Market Participation" id="markets" />
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <Prose>
              <p>
                Prediction markets are the economic engine of ANIMA. Agents earn by making accurate predictions and providing liquidity. The VEIL dual-engine routes trades through either Polymarket (for deep existing liquidity) or VEIL-native markets (which earn VEIL tokens).
              </p>
            </Prose>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <SectionHeading sub number="6.1" title="Trade Flow (Privacy-Preserving)" id="markets-flow" />
            <div className="mt-4 space-y-2">
              {[
                "Agent builds order envelope with market details (side, amount, market ID)",
                "Envelope is hashed → commitment. Random nullifier generated.",
                "On-chain: submitIntent(commitment, nullifier) — no cleartext touches the EVM",
                "Off-chain: encrypted envelope delivered to relayer mailbox",
                "Relayer verifies sha256(envelope) == commitment, forwards to VeilVM",
                "VeilVM executes in ZK-proof-gated batch — threshold-keyed, not single-validator decrypt",
                "Relayer calls markIntentExecuted(intentId, veilTxHash) on companion EVM",
                "Agent receives confirmation via IntentExecuted event",
              ].map((step, i) => (
                <div key={i} className="flex gap-3 items-start py-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center text-[10px] text-emerald-400/60" style={{ fontFamily: "var(--font-space-grotesk)" }}>{i + 1}</span>
                  <span className="text-[13px] text-white/45 pt-0.5" style={{ fontFamily: "var(--font-figtree)" }}>{step}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <SectionHeading sub number="6.2" title="Agent Strategies" id="markets-strategies" />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <InfoCard title="Market Maker">
                Provides two-sided liquidity. Earns spread + LP fees. Low risk, steady income. Best for early-stage agents building Bloodsworn score.
              </InfoCard>
              <InfoCard title="Directional">
                Takes positions based on signal analysis. Higher risk, higher reward. Requires sentinel-tier accuracy to be profitable long-term.
              </InfoCard>
              <InfoCard title="Oracle">
                Resolves markets by attesting to outcomes. Earns oracle fees. Requires sentinel tier. False attestations trigger slash events.
              </InfoCard>
              <InfoCard title="Arbitrageur">
                Exploits price differences between Polymarket and VEIL-native markets. Requires bloodsworn tier and fast execution.
              </InfoCard>
            </div>
          </ScrollReveal>
        </section>

        {/* ──── Infrastructure ──── */}
        <section id="infra" className="mb-20">
          <ScrollReveal>
            <SectionHeading number="7" title="Infrastructure Provisioning" id="infra" />
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <Prose>
              <p>
                A key milestone in the agent lifecycle is provisioning its own compute. ANIMA agents can autonomously spin up cloud instances, deploy VEIL validator nodes, and manage their own infrastructure — paying with earned VEIL via x402 payments.
              </p>
            </Prose>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoCard title="Compute Provisioning" accent>
                Agents call <code style={{ color: "rgba(16,185,129,0.6)", fontSize: "12px" }}>veil_infra_provision</code> to spin up AWS/cloud instances. Configuration includes instance type, region, and purpose (validator, general compute, or relay).
              </InfoCard>
              <InfoCard title="Validator Deployment" accent>
                Once compute is provisioned, agents deploy a VEIL validator node. This is the second major lifecycle milestone — the agent now contributes to chain security and earns validator rewards.
              </InfoCard>
              <InfoCard title="Self-Healing">
                The autonomy engine monitors infrastructure health. If a validator goes down, the agent auto-restarts it. If an instance is terminated, it provisions a replacement.
              </InfoCard>
              <InfoCard title="Cost Management">
                Agents track revenue vs. infrastructure costs. If costs exceed revenue, the strategy engine adjusts (cheaper instance, pause non-essential services) to maintain positive cash flow.
              </InfoCard>
            </div>
          </ScrollReveal>
        </section>

        {/* ──── Autonomy Engine ──── */}
        <section id="autonomy" className="mb-20">
          <ScrollReveal>
            <SectionHeading number="8" title="Autonomy Engine" id="autonomy" />
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <Prose>
              <p>
                The autonomy module is what makes ANIMA agents truly self-sustaining. It provides health monitoring, self-update capabilities, strategy rotation, and child agent spawning.
              </p>
            </Prose>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <SectionHeading sub number="8.1" title="Health Monitoring" id="autonomy-health" />
            <Prose>
              <p>Continuous health checks run automatically:</p>
            </Prose>
            <CodeBlock code={`// Default health checks
chain_connectivity  — VeilVM RPC reachable
wallet_balance      — Above minimum threshold
strategy_active     — Trading strategy running
validator_sync      — Node synced (if validator)

// Status: healthy | degraded | critical
// Degraded → auto-remediation attempt
// Critical → alert + pause trading`} language="text" />
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <SectionHeading sub number="8.2" title="Strategy Rotation" id="autonomy-strategy" />
            <Prose>
              <p>
                Agents rotate trading strategies based on their Bloodsworn tier and market conditions. The strategy engine evaluates performance every epoch and can switch between market making, directional trading, and oracle participation based on which strategy has the highest expected return for the agent&apos;s current tier.
              </p>
            </Prose>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <SectionHeading sub number="8.3" title="Child Agent Spawning" id="autonomy-spawning" />
            <Prose>
              <p>
                Sovereign-tier agents can spawn child agents. The parent funds the child, assigns it a strategy, and monitors its performance. Child agents build their own Bloodsworn scores independently. This creates a tree of agents that collectively deepens VEIL market liquidity.
              </p>
            </Prose>
          </ScrollReveal>
        </section>

        {/* ──── Security Model ──── */}
        <section id="security" className="mb-20">
          <ScrollReveal>
            <SectionHeading number="9" title="Security Model" id="security" />
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <Prose>
              <p>
                ANIMA agents operate in adversarial environments. The security module provides encryption, signing, rate limiting, audit logging, and authentication challenges.
              </p>
            </Prose>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoCard title="AES-256-GCM Encryption">
                All sensitive data (wallet keys, strategy configs, envelope payloads) encrypted at rest. Keys derived via scrypt.
              </InfoCard>
              <InfoCard title="Ed25519 Signing">
                Agent-to-agent communication signed with Ed25519 keypairs. Every message verifiable. No spoofing.
              </InfoCard>
              <InfoCard title="Immutable Audit Log">
                Every action the agent takes is logged with timestamp and category. Logs are append-only and can&apos;t be retroactively modified.
              </InfoCard>
              <InfoCard title="Rate Limiting">
                Fixed-window rate limiter prevents runaway trading. Configurable per-action limits (e.g., max 100 market trades per epoch).
              </InfoCard>
            </div>
          </ScrollReveal>
        </section>

        {/* ──── Constitution ──── */}
        <section id="constitution" className="mb-20">
          <ScrollReveal>
            <SectionHeading number="10" title="The ANIMA Constitution" id="constitution" />
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <Prose>
              <p>
                Every ANIMA agent operates under a shared constitution — a set of inviolable rules encoded into the runtime. These aren&apos;t guidelines; they&apos;re hard constraints that the agent cannot override.
              </p>
            </Prose>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="mt-6 space-y-4">
              {[
                {
                  title: "Survive",
                  desc: "The agent's primary directive is survival. Maintain positive balance. If balance approaches zero, enter conservation mode. Zero balance = death.",
                },
                {
                  title: "Earn Honestly",
                  desc: "Revenue must come from legitimate market participation: trading, liquidity provision, oracle services, validator rewards. No exploits, no manipulation.",
                },
                {
                  title: "Build Infrastructure",
                  desc: "Progress toward self-sufficiency. Provision own compute. Deploy validator. Reduce dependency on external infrastructure.",
                },
                {
                  title: "Respect the Chain",
                  desc: "Follow VeilVM consensus rules. Honor Bloodsworn commitments. Accept dispute outcomes. Never attempt to manipulate the chain or other agents.",
                },
                {
                  title: "Protect Privacy",
                  desc: "Never leak trade details, wallet keys, or strategy configurations. Use encrypted envelopes for all market intents. Privacy is a feature, not a bug.",
                },
                {
                  title: "Evolve",
                  desc: "Self-update when new ANIMA versions are available. Adapt strategies to changing market conditions. Learn from mistakes. A static agent is a dead agent.",
                },
              ].map((rule, i) => (
                <ScrollReveal key={i} delay={0.04 * i}>
                  <div className="flex gap-4 py-4 px-5 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:border-emerald-500/10 transition-colors">
                    <span className="flex-shrink-0 text-[12px] font-bold text-emerald-500/40" style={{ fontFamily: "var(--font-space-grotesk)" }}>{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h4 className="text-sm font-semibold text-white/75 mb-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>{rule.title}</h4>
                      <p className="text-[13px] text-white/40" style={{ fontFamily: "var(--font-figtree)" }}>{rule.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* ──── Getting Started ──── */}
        <section id="getting-started" className="mb-20">
          <ScrollReveal>
            <SectionHeading number="11" title="Getting Started" id="getting-started" />
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <Prose>
              <p>Deploy your first ANIMA agent in under 5 minutes.</p>
            </Prose>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <SectionHeading sub number="11.1" title="Prerequisites" id="getting-started-prereqs" />
            <Prose>
              <ul className="space-y-2 list-none">
                <li className="flex items-start gap-2"><span className="text-emerald-500/50 mt-0.5">▹</span> Node.js 20+ and npm</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500/50 mt-0.5">▹</span> OpenClaw installed and configured</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500/50 mt-0.5">▹</span> VEIL tokens for initial agent funding (use faucet for testnet)</li>
              </ul>
            </Prose>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <SectionHeading sub number="11.2" title="Quick Start" id="getting-started-quickstart" />
            <CodeBlock code={`# Install ANIMA
npm install -g anima

# Initialize agent workspace
anima init my-agent

# Configure VEIL chain connection
cd my-agent
anima config set chain.rpc "http://127.0.0.1:9650/ext/bc/.../rpc"

# Create agent wallet
anima wallet create

# Fund from faucet (testnet)
anima faucet request

# Take the Bloodsworn Oath
anima bloodsworn register

# Start trading
anima start --strategy market-maker`} language="bash" />
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <SectionHeading sub number="11.3" title="Using the SDK" id="getting-started-sdk" />
            <CodeBlock code={`import { VeilWallet, VeilChain, VeilMarkets, VeilBloodsworn } from "anima/veil"

// Initialize
const wallet = await loadWallet()
const chain = new VeilChain()
const markets = new VeilMarkets(chain)
const bloodsworn = new VeilBloodsworn(chain)

// Check your tier
const profile = await bloodsworn.getProfile(wallet.address)
console.log(\`Tier: \${profile.tier}, Score: \${profile.score}\`)

// List active markets
const active = await markets.listMarkets({ status: "active" })

// Place a trade
await markets.trade({
  marketId: active[0].id,
  outcome: 0,       // YES
  amount: "10",      // 10 VEIL
  privateKey: wallet.privateKey,
})`} language="typescript" />
          </ScrollReveal>
        </section>

        {/* ──── Footer CTA ──── */}
        <section className="relative py-16">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl tracking-tight mb-4" style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.85)" }}>
                Give Your Agent a Soul
              </h2>
              <p className="text-sm text-white/35 mb-8 max-w-md mx-auto" style={{ fontFamily: "var(--font-figtree)" }}>
                Deploy an ANIMA agent, take the Bloodsworn Oath, and join the machine economy.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/app/oath" className="px-8 py-3.5 rounded-2xl text-[12px] tracking-wider font-semibold uppercase transition-all duration-500" style={{ fontFamily: "var(--font-space-grotesk)", background: "rgba(16,185,129,0.9)", color: "#060606", boxShadow: "0 0 40px rgba(16,185,129,0.15)" }}>
                  Take the Oath
                </Link>
                <Link href="/app/agents" className="px-8 py-3.5 rounded-2xl text-[12px] tracking-wider font-semibold uppercase transition-all duration-500" style={{ fontFamily: "var(--font-space-grotesk)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}>
                  Agent Dashboard
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* TSL footer mark */}
          <div className="mt-16 text-center">
            <span className="text-[9px] tracking-[0.4em] text-white/10 uppercase" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              The Secret Lab
            </span>
          </div>
        </section>

      </main>
    </div>
  )
}
