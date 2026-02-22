"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { TriangleLogo } from "@/components/triangle-logo"
import Link from "next/link"

/* ───────────────────────── helpers ───────────────────────── */

function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

function SectionLabel({ number, text }: { number: string; text: string }) {
  return (
    <div className="mb-10 flex items-center gap-4">
      <span
        className="text-xs font-medium tracking-[0.3em] uppercase"
        style={{
          fontFamily: "var(--font-space-grotesk)",
          color: "rgba(16, 185, 129, 0.6)",
        }}
      >
        {number}
      </span>
      <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/30 to-transparent" />
      <span
        className="text-xs font-medium tracking-[0.2em] uppercase"
        style={{
          fontFamily: "var(--font-space-grotesk)",
          color: "rgba(255,255,255,0.25)",
        }}
      >
        {text}
      </span>
    </div>
  )
}

function Card({
  children,
  className = "",
  emerald = false,
}: {
  children: React.ReactNode
  className?: string
  emerald?: boolean
}) {
  return (
    <div
      className={`rounded-[20px] border backdrop-blur-md ${
        emerald
          ? "border-emerald-500/15 bg-emerald-500/[0.04]"
          : "border-white/[0.06] bg-white/[0.02]"
      } ${className}`}
      style={{
        boxShadow: emerald
          ? "0 0 80px rgba(16,185,129,0.06), inset 0 1px 0 rgba(255,255,255,0.04)"
          : "inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {children}
    </div>
  )
}

/* ───────────────────────── page ───────────────────────── */

export default function InvestorDeckPage() {
  return (
    <div className="relative min-h-screen" style={{ background: "#060606" }}>
      {/* Film grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          mixBlendMode: "overlay",
        }}
      />

      {/* Subtle radial glow top */}
      <div
        className="pointer-events-none fixed left-1/2 top-0 -translate-x-1/2"
        style={{
          width: "120vw",
          height: "60vh",
          background:
            "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(16,185,129,0.06) 0%, transparent 70%)",
        }}
      />

      {/* ─── Fixed Nav ─── */}
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/[0.04] bg-[#060606]/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          <Link href="/app" className="flex items-center gap-3 transition-opacity hover:opacity-70">
            <TriangleLogo />
            <span
              className="text-xl font-bold tracking-tight"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              VEIL
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span
              className="hidden text-xs tracking-[0.15em] uppercase sm:block"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              Investor Deck — 2025
            </span>
            <Link
              href="/app"
              className="ml-4 flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-2 text-sm transition-all hover:border-emerald-500/20 hover:bg-white/[0.06]"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Main ─── */}
      <main className="relative z-10 mx-auto max-w-6xl px-8 pb-40 pt-40">
        {/* ══════ HERO ══════ */}
        <ScrollReveal>
          <section className="mb-28 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <p
                className="mb-6 text-xs tracking-[0.4em] uppercase"
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  color: "rgba(16,185,129,0.5)",
                }}
              >
                Investor Presentation
              </p>
              <h1
                className="mx-auto max-w-4xl text-[clamp(3rem,7vw,6.5rem)] font-light leading-[0.95] tracking-[-0.03em]"
                style={{
                  fontFamily: "var(--font-instrument-serif)",
                  color: "rgba(255,255,255,0.95)",
                }}
              >
                Private markets.{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, rgba(16,185,129,0.9), rgba(20,184,166,0.7))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Honest prices.
                </span>
              </h1>
              <p
                className="mx-auto mt-10 max-w-2xl text-lg leading-relaxed"
                style={{
                  fontFamily: "var(--font-figtree)",
                  color: "rgba(255,255,255,0.4)",
                  fontWeight: 300,
                }}
              >
                A privacy-first prediction market running on its own Avalanche Subnet — sealed order
                flow, single-price batch execution, and accountable outcomes.
              </p>
            </motion.div>

            {/* decorative line */}
            <motion.div
              className="mx-auto mt-20 h-px w-24 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.4, delay: 0.6 }}
            />
          </section>
        </ScrollReveal>

        {/* ══════ 01 — THE PROBLEM ══════ */}
        <ScrollReveal>
          <section className="mb-28">
            <SectionLabel number="01" text="The Problem" />
            <h2
              className="mb-16 max-w-3xl text-[clamp(2.2rem,4.5vw,4rem)] font-light leading-[1.05] tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-instrument-serif)",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Current prediction markets
              <br />
              are fundamentally broken.
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              {[
                {
                  title: "Order-Flow Leakage",
                  body: "Public chains expose trading strategies, enabling copy-trading and front-running by sophisticated actors.",
                },
                {
                  title: "Unfair Execution",
                  body: "Path-dependent AMMs give inconsistent fills for informed traders, penalizing genuine price discovery.",
                },
                {
                  title: "Outcome Trust Gaps",
                  body: "Unclear oracle incentives and weak dispute processes undermine confidence in final settlements.",
                },
                {
                  title: "Rented Liquidity",
                  body: "Emissions attract mercenary TVL that vanishes when rewards end, leaving markets shallow and unreliable.",
                },
              ].map((item, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <Card className="p-8">
                    <h3
                      className="mb-3 text-lg font-medium"
                      style={{
                        fontFamily: "var(--font-space-grotesk)",
                        color: "rgba(16,185,129,0.85)",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-[15px] leading-[1.8]"
                      style={{
                        fontFamily: "var(--font-figtree)",
                        color: "rgba(255,255,255,0.45)",
                        fontWeight: 300,
                      }}
                    >
                      {item.body}
                    </p>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* ══════ 02 — WHAT VEIL DOES ══════ */}
        <ScrollReveal>
          <section className="mb-28">
            <SectionLabel number="02" text="The Solution" />
            <h2
              className="mb-16 max-w-3xl text-[clamp(2.2rem,4.5vw,4rem)] font-light leading-[1.05] tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-instrument-serif)",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              What VEIL does.
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              {[
                {
                  icon: (
                    <path
                      d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                      stroke="rgba(16,185,129,0.8)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ),
                  title: "Private Until Execution",
                  body: "Orders remain sealed until everyone trades — no one can front-run you or extract your alpha.",
                },
                {
                  icon: (
                    <path
                      d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                      stroke="rgba(16,185,129,0.8)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ),
                  title: "One Fair Price",
                  body: "Single-price clearing per window means all participants share the same execution price.",
                },
                {
                  icon: (
                    <>
                      <circle cx="12" cy="12" r="10" stroke="rgba(16,185,129,0.8)" strokeWidth="1.5" fill="none" />
                      <path d="M12 6v6l4 2" stroke="rgba(16,185,129,0.8)" strokeWidth="1.5" strokeLinecap="round" />
                    </>
                  ),
                  title: "Credible Outcomes",
                  body: "Bonded attestors and transparent dispute paths ensure trustworthy, verifiable settlements.",
                },
                {
                  icon: (
                    <>
                      <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="rgba(16,185,129,0.8)" strokeWidth="1.5" fill="none" />
                      <path d="M9 12l2 2 4-4" stroke="rgba(16,185,129,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </>
                  ),
                  title: "Compounding Depth",
                  body: "Fees recycle into market depth, making spreads tighter and execution more reliable over time.",
                },
              ].map((item, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <Card emerald className="p-8">
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/10 bg-emerald-500/[0.08]">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        {item.icon}
                      </svg>
                    </div>
                    <h3
                      className="mb-3 text-lg font-medium"
                      style={{
                        fontFamily: "var(--font-space-grotesk)",
                        color: "rgba(16,185,129,0.85)",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-[15px] leading-[1.8]"
                      style={{
                        fontFamily: "var(--font-figtree)",
                        color: "rgba(255,255,255,0.45)",
                        fontWeight: 300,
                      }}
                    >
                      {item.body}
                    </p>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* ══════ 03 — WHY PRIVACY MATTERS ══════ */}
        <ScrollReveal>
          <section className="mb-28">
            <SectionLabel number="03" text="Privacy Value" />
            <h2
              className="mb-16 max-w-4xl text-[clamp(2.2rem,4.5vw,4rem)] font-light leading-[1.05] tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-instrument-serif)",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Why privacy matters
              <br />
              <span style={{ color: "rgba(255,255,255,0.4)" }}>(commercially).</span>
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              {[
                {
                  title: "Better Execution",
                  body: "Tighter spreads and more professional flow without predatory actors.",
                },
                {
                  title: "More Market Creation",
                  body: "Sensitive topics can list without social or regulatory chilling effects.",
                },
                {
                  title: "Institutional Comfort",
                  body: "Optional viewing keys enable private audits and regulatory reporting.",
                },
                {
                  title: "Global Reach",
                  body: "Privacy lowers behavioral and competitive risk for participants worldwide.",
                },
              ].map((item, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <div className="flex gap-5 p-2">
                    <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-emerald-500/10 bg-emerald-500/[0.06]">
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                        <path d="M5 10l3 3 7-7" stroke="rgba(16,185,129,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <h3
                        className="mb-2 text-[15px] font-medium"
                        style={{
                          fontFamily: "var(--font-space-grotesk)",
                          color: "rgba(16,185,129,0.8)",
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="text-[14px] leading-[1.8]"
                        style={{
                          fontFamily: "var(--font-figtree)",
                          color: "rgba(255,255,255,0.4)",
                          fontWeight: 300,
                        }}
                      >
                        {item.body}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* ══════ 04 — MARKET OPPORTUNITY ══════ */}
        <ScrollReveal>
          <section className="mb-28">
            <SectionLabel number="04" text="Market" />
            <h2
              className="mb-16 max-w-3xl text-[clamp(2.2rem,4.5vw,4rem)] font-light leading-[1.05] tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-instrument-serif)",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Market opportunity.
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-5">
                <ScrollReveal delay={0}>
                  <Card className="p-10 text-center">
                    <div
                      className="mb-2 text-[clamp(3rem,5vw,4.5rem)] font-light tracking-[-0.03em]"
                      style={{
                        fontFamily: "var(--font-instrument-serif)",
                        background: "linear-gradient(135deg, rgba(16,185,129,0.95), rgba(20,184,166,0.7))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      $8.2B
                    </div>
                    <p
                      className="text-sm"
                      style={{
                        fontFamily: "var(--font-figtree)",
                        color: "rgba(255,255,255,0.35)",
                        fontWeight: 300,
                      }}
                    >
                      Global prediction market size by 2028
                    </p>
                  </Card>
                </ScrollReveal>
                <ScrollReveal delay={0.1}>
                  <Card className="p-10 text-center">
                    <div
                      className="mb-2 text-[clamp(3rem,5vw,4.5rem)] font-light tracking-[-0.03em]"
                      style={{
                        fontFamily: "var(--font-instrument-serif)",
                        background: "linear-gradient(135deg, rgba(16,185,129,0.95), rgba(20,184,166,0.7))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      23.4%
                    </div>
                    <p
                      className="text-sm"
                      style={{
                        fontFamily: "var(--font-figtree)",
                        color: "rgba(255,255,255,0.35)",
                        fontWeight: 300,
                      }}
                    >
                      Expected CAGR through 2028
                    </p>
                  </Card>
                </ScrollReveal>
              </div>
              <ScrollReveal delay={0.2}>
                <div>
                  <h3
                    className="mb-6 text-xl font-light"
                    style={{
                      fontFamily: "var(--font-instrument-serif)",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    Key Growth Drivers
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "Rising demand for decentralized financial instruments",
                      "Increasing institutional adoption of crypto",
                      "Growing interest in information markets",
                      "Regulatory clarity in key jurisdictions",
                      "Mainstream acceptance of prediction markets",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500/50" />
                        <span
                          className="text-[15px] leading-[1.7]"
                          style={{
                            fontFamily: "var(--font-figtree)",
                            color: "rgba(255,255,255,0.4)",
                            fontWeight: 300,
                          }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </section>
        </ScrollReveal>

        {/* ══════ 05 — TRACTION ══════ */}
        <ScrollReveal>
          <section className="mb-28">
            <SectionLabel number="05" text="Traction" />
            <h2
              className="mb-16 max-w-3xl text-[clamp(2.2rem,4.5vw,4rem)] font-light leading-[1.05] tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-instrument-serif)",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Build progress.
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { value: "42", label: "VM Actions Defined" },
                { value: "6/12", label: "Launch Gates (Local PASS)" },
                { value: "22207", label: "Chain ID (Testnet)" },
                { value: "Tier 0", label: "ANIMA SDK Baseline" },
              ].map((item, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <Card className="p-8 text-center">
                    <div
                      className="mb-2 text-[clamp(2rem,3.5vw,3rem)] font-light tracking-[-0.02em]"
                      style={{
                        fontFamily: "var(--font-instrument-serif)",
                        background: "linear-gradient(135deg, rgba(16,185,129,0.9), rgba(20,184,166,0.7))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {item.value}
                    </div>
                    <p
                      className="text-xs tracking-[0.1em] uppercase"
                      style={{
                        fontFamily: "var(--font-space-grotesk)",
                        color: "rgba(255,255,255,0.3)",
                      }}
                    >
                      {item.label}
                    </p>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* ══════ 06 — BUSINESS MODEL ══════ */}
        <ScrollReveal>
          <section className="mb-28">
            <SectionLabel number="06" text="Revenue" />
            <h2
              className="mb-16 max-w-3xl text-[clamp(2.2rem,4.5vw,4rem)] font-light leading-[1.05] tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-instrument-serif)",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Business model.
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Trading Fee",
                  desc: "Per matched notional during each window",
                  value: "40–60 bps",
                  note: "Tiered by market quality",
                },
                {
                  title: "Settlement Fee",
                  desc: "At outcome resolution",
                  value: "10–20 bps",
                  note: "On final settlement",
                },
                {
                  title: "Creation Fee",
                  desc: "Plus refundable collateral",
                  value: "Variable",
                  note: "For market creators",
                },
                {
                  title: "API Tiers",
                  desc: "Higher-throughput desks",
                  value: "Optional",
                  note: "Stake-gated, post-launch",
                },
              ].map((item, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <Card className="flex h-full flex-col justify-between p-7">
                    <div>
                      <h3
                        className="mb-2 text-[15px] font-medium"
                        style={{
                          fontFamily: "var(--font-space-grotesk)",
                          color: "rgba(16,185,129,0.8)",
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="mb-5 text-[13px] leading-[1.7]"
                        style={{
                          fontFamily: "var(--font-figtree)",
                          color: "rgba(255,255,255,0.35)",
                          fontWeight: 300,
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                    <div>
                      <div
                        className="text-2xl font-light tracking-[-0.02em]"
                        style={{
                          fontFamily: "var(--font-instrument-serif)",
                          color: "rgba(16,185,129,0.9)",
                        }}
                      >
                        {item.value}
                      </div>
                      <p
                        className="mt-1 text-[11px]"
                        style={{
                          fontFamily: "var(--font-figtree)",
                          color: "rgba(255,255,255,0.25)",
                        }}
                      >
                        {item.note}
                      </p>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* ══════ 07 — LIQUIDITY STRATEGY ══════ */}
        <ScrollReveal>
          <section className="mb-28">
            <SectionLabel number="07" text="Liquidity" />
            <h2
              className="mb-4 max-w-3xl text-[clamp(2.2rem,4.5vw,4rem)] font-light leading-[1.05] tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-instrument-serif)",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Liquidity strategy.
            </h2>
            <p
              className="mb-16 text-lg"
              style={{
                fontFamily: "var(--font-figtree)",
                color: "rgba(255,255,255,0.35)",
                fontWeight: 300,
              }}
            >
              chain-owned, not rented.
            </p>
            <div className="grid gap-5 md:grid-cols-2">
              <ScrollReveal delay={0}>
                <Card emerald className="p-8">
                  <h3
                    className="mb-3 text-lg font-medium"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      color: "rgba(16,185,129,0.85)",
                    }}
                  >
                    Market Depth Reserve
                  </h3>
                  <p
                    className="text-[15px] leading-[1.8]"
                    style={{
                      fontFamily: "var(--font-figtree)",
                      color: "rgba(255,255,255,0.45)",
                      fontWeight: 300,
                    }}
                  >
                    A treasury-managed pool that funds baseline liquidity where it&apos;s needed most, ensuring
                    consistent market quality.
                  </p>
                </Card>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <Card emerald className="p-8">
                  <h3
                    className="mb-3 text-lg font-medium"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      color: "rgba(16,185,129,0.85)",
                    }}
                  >
                    Buyback-and-Make
                  </h3>
                  <p
                    className="text-[15px] leading-[1.8]"
                    style={{
                      fontFamily: "var(--font-figtree)",
                      color: "rgba(255,255,255,0.45)",
                      fontWeight: 300,
                    }}
                  >
                    A portion of fees buys protocol tokens and pairs them in owned liquidity positions, permanently
                    deepening core markets.
                  </p>
                </Card>
              </ScrollReveal>
            </div>
            <ScrollReveal delay={0.2}>
              <Card className="mt-5 p-8">
                <p
                  className="mb-1 text-xs font-medium tracking-[0.15em] uppercase"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(16,185,129,0.6)",
                  }}
                >
                  Result
                </p>
                <p
                  className="text-[15px] leading-[1.8]"
                  style={{
                    fontFamily: "var(--font-figtree)",
                    color: "rgba(255,255,255,0.45)",
                    fontWeight: 300,
                  }}
                >
                  Less dependence on mercenary incentives, better user experience, and price quality that compounds
                  over time as depth grows.
                </p>
              </Card>
            </ScrollReveal>
          </section>
        </ScrollReveal>

        {/* ══════ 08 — ROADMAP ══════ */}
        <ScrollReveal>
          <section className="mb-28">
            <SectionLabel number="08" text="Roadmap" />
            <h2
              className="mb-16 max-w-3xl text-[clamp(2.2rem,4.5vw,4rem)] font-light leading-[1.05] tracking-[-0.02em]"
              style={{
                fontFamily: "var(--font-instrument-serif)",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              Next 12 months.
            </h2>
            <div className="space-y-0">
              {[
                {
                  quarter: "M0",
                  title: "Custom VM + Proof Pipeline",
                  current: true,
                  items: [
                    "VeilVM on HyperSDK with 42 native actions",
                    "Groth16 proof-gated settlement, encrypted mempool",
                    "Threshold-keyed committee, private-only admission",
                  ],
                },
                {
                  quarter: "M1",
                  title: "Identity + Reputation + SDKs",
                  current: true,
                  items: [
                    "ZER0ID and Bloodsworn surfaces designed/scaffolded",
                    "ANIMA TypeScript SDK baseline with local coverage",
                    "Live runtime and strict-private flows in progress",
                  ],
                },
                {
                  quarter: "M2",
                  title: "Tokenomics + Stability",
                  current: true,
                  items: [
                    "COL, VAI, treasury/risk controls in design/runtime paths",
                    "Production parameter freeze pending (G4/G5)",
                    "Fee routing 70/20/10 implemented",
                  ],
                },
                {
                  quarter: "M3",
                  title: "Production Launch Gates",
                  current: false,
                  items: [
                    "Key ceremony + admin rotation (G10)",
                    "End-to-end launch rehearsal (G11)",
                    "Consolidated evidence bundles",
                  ],
                },
              ].map((phase, i) => (
                <ScrollReveal key={i} delay={i * 0.12}>
                  <div className="flex gap-8">
                    {/* timeline */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                          phase.current
                            ? "border-emerald-500/30 bg-emerald-500/10"
                            : "border-white/[0.06] bg-white/[0.02]"
                        }`}
                      >
                        <div
                          className={`h-2 w-2 rounded-full ${
                            phase.current ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]" : "bg-white/15"
                          }`}
                        />
                      </div>
                      {i < 3 && <div className="h-full w-px bg-white/[0.04]" />}
                    </div>
                    {/* content */}
                    <div className="flex-1 pb-12">
                      <div className="mb-3 flex items-center gap-3">
                        <span
                          className="text-xs font-medium tracking-[0.2em] uppercase"
                          style={{
                            fontFamily: "var(--font-space-grotesk)",
                            color: phase.current ? "rgba(16,185,129,0.7)" : "rgba(255,255,255,0.25)",
                          }}
                        >
                          {phase.quarter}
                        </span>
                        <h3
                          className="text-lg font-light"
                          style={{
                            fontFamily: "var(--font-instrument-serif)",
                            color: phase.current ? "rgba(16,185,129,0.9)" : "rgba(255,255,255,0.5)",
                          }}
                        >
                          {phase.title}
                        </h3>
                        {phase.current && (
                          <span
                            className="rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-3 py-0.5 text-[10px] font-medium tracking-[0.1em] uppercase"
                            style={{
                              fontFamily: "var(--font-space-grotesk)",
                              color: "rgba(16,185,129,0.7)",
                            }}
                          >
                            Current
                          </span>
                        )}
                      </div>
                      <ul className="space-y-2">
                        {phase.items.map((item, j) => (
                          <li
                            key={j}
                            className="text-[14px] leading-[1.7]"
                            style={{
                              fontFamily: "var(--font-figtree)",
                              color: phase.current ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.3)",
                              fontWeight: 300,
                            }}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* ══════ 09 — THE ASK ══════ */}
        <ScrollReveal>
          <section className="mb-20">
            <SectionLabel number="09" text="The Ask" />

            <Card
              emerald
              className="overflow-hidden p-0"
            >
              {/* subtle gradient accent */}
              <div
                className="h-px w-full"
                style={{
                  background: "linear-gradient(90deg, transparent 10%, rgba(16,185,129,0.3) 50%, transparent 90%)",
                }}
              />

              <div className="grid gap-12 p-10 md:grid-cols-2 md:p-14">
                <div>
                  <div
                    className="mb-2 text-[clamp(3.5rem,6vw,5.5rem)] font-light leading-none tracking-[-0.03em]"
                    style={{
                      fontFamily: "var(--font-instrument-serif)",
                      background: "linear-gradient(135deg, rgba(16,185,129,0.95), rgba(20,184,166,0.7))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    $2M
                  </div>
                  <p
                    className="mb-10 text-lg"
                    style={{
                      fontFamily: "var(--font-figtree)",
                      color: "rgba(255,255,255,0.5)",
                      fontWeight: 300,
                    }}
                  >
                    Seed Round
                  </p>
                  <div className="space-y-4">
                    <p
                      className="text-[14px] leading-[1.8]"
                      style={{
                        fontFamily: "var(--font-figtree)",
                        color: "rgba(255,255,255,0.4)",
                        fontWeight: 300,
                      }}
                    >
                      <span style={{ color: "rgba(16,185,129,0.7)", fontWeight: 500 }}>Milestones:</span> M0 VM + Proofs (Complete) →
                      M1 Identity + SDKs (In Progress) → M2 Tokenomics (In Progress) → M3 Production Launch Gates (Blocked)
                    </p>
                    <p
                      className="text-[14px] leading-[1.8]"
                      style={{
                        fontFamily: "var(--font-figtree)",
                        color: "rgba(255,255,255,0.4)",
                        fontWeight: 300,
                      }}
                    >
                      <span style={{ color: "rgba(16,185,129,0.7)", fontWeight: 500 }}>Why now:</span> On-chain
                      forecasting needs privacy + fair execution; Avalanche Subnets make it operationally feasible
                      today
                    </p>
                  </div>
                </div>

                <div>
                  <h3
                    className="mb-8 text-xl font-light"
                    style={{
                      fontFamily: "var(--font-instrument-serif)",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    Use of Funds
                  </h3>
                  <div className="space-y-6">
                    {[
                      { label: "Core Protocol & Infrastructure", pct: 40 },
                      { label: "Liquidity & Market Depth Reserve", pct: 30 },
                      { label: "Security Audits & Testing", pct: 15 },
                      { label: "GTM, Partnerships & Compliance", pct: 15 },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="mb-2 flex items-center justify-between">
                          <span
                            className="text-[13px]"
                            style={{
                              fontFamily: "var(--font-figtree)",
                              color: "rgba(255,255,255,0.45)",
                              fontWeight: 300,
                            }}
                          >
                            {item.label}
                          </span>
                          <span
                            className="text-sm font-medium"
                            style={{
                              fontFamily: "var(--font-space-grotesk)",
                              color: "rgba(16,185,129,0.8)",
                            }}
                          >
                            {item.pct}%
                          </span>
                        </div>
                        <div className="h-1 overflow-hidden rounded-full bg-white/[0.04]">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: "linear-gradient(90deg, rgba(16,185,129,0.6), rgba(20,184,166,0.4))",
                            }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.3 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA row */}
              <div className="border-t border-white/[0.04] px-10 py-8 md:px-14">
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <a
                    href="mailto:founders@veil.markets"
                    className="group relative overflow-hidden rounded-full px-8 py-3.5 text-sm font-medium text-white transition-all"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      background: "linear-gradient(135deg, rgba(16,185,129,0.9), rgba(20,184,166,0.8))",
                      boxShadow: "0 0 40px rgba(16,185,129,0.2)",
                    }}
                  >
                    <span className="relative z-10">Contact Us</span>
                  </a>
                  <Link
                    href="/app/docs"
                    className="rounded-full border border-white/[0.08] bg-white/[0.02] px-8 py-3.5 text-sm transition-all hover:border-emerald-500/20 hover:bg-white/[0.05]"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    Read Documentation
                  </Link>
                </div>
              </div>
            </Card>
          </section>
        </ScrollReveal>
      </main>

      {/* ─── Fixed Footer ─── */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.04] bg-[#060606]/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          <span
            className="text-[11px] tracking-[0.1em] uppercase"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            VEIL — Confidential
          </span>
          <a href="https://thesecretlab.app" target="_blank" rel="noopener noreferrer"
            className="group flex items-center gap-2 transition-opacity duration-700 hover:opacity-80">
            <span className="text-[8px] tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.08)" }}>A</span>
            <span className="text-[10px] tracking-[0.15em] font-semibold group-hover:text-white/25 transition-colors duration-700" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.18)" }}>SECRET LAB</span>
            <span className="text-[8px] tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.08)" }}>Production</span>
          </a>
          <span
            className="text-[11px]"
            style={{
              fontFamily: "var(--font-figtree)",
              color: "rgba(255,255,255,0.15)",
            }}
          >
            founders@veil.markets
          </span>
        </div>
      </footer>
    </div>
  )
}
