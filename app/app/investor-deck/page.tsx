"use client"

import { AppShaderBackground } from "@/components/app-shader-background"
import { TriangleLogo } from "@/components/triangle-logo"
import Link from "next/link"

export default function InvestorDeckPage() {
  return (
    <div className="relative min-h-screen">
      <AppShaderBackground />

      {/* Header */}
      <header className="relative border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/app" className="flex items-center gap-3 transition-all hover:opacity-80">
              <div className="flex items-center gap-3">
                <TriangleLogo />
                <span
                  className="text-2xl font-bold tracking-tight"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(255, 255, 255, 0.95)",
                    textShadow: "0 0 30px rgba(16, 185, 129, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  VEIL
                </span>
              </div>
            </Link>

            <Link
              href="/app"
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl transition-all hover:border-emerald-400/30 hover:bg-white/10"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: "rgba(255, 255, 255, 0.7)",
              }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Markets
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative mx-auto max-w-7xl px-8 py-16">
        {/* Hero section */}
        <div className="mb-20 text-center">
          <h1
            className="mb-6 text-6xl font-bold leading-tight"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: "rgba(255, 255, 255, 0.95)",
              textShadow: "0 0 60px rgba(16, 185, 129, 0.4), 0 4px 12px rgba(0, 0, 0, 0.5)",
              letterSpacing: "-0.02em",
            }}
          >
            Private markets. Honest prices.
          </h1>
          <p
            className="mx-auto max-w-3xl text-xl leading-relaxed"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: "rgba(255, 255, 255, 0.6)",
            }}
          >
            A privacy-first prediction market running on its own Avalanche Subnet
          </p>
          <p
            className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: "rgba(255, 255, 255, 0.5)",
            }}
          >
            Sealed order flow, single-price batch execution, and accountable outcomes
          </p>
        </div>

        {/* Problem section */}
        <section className="mb-16">
          <div
            className="rounded-2xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl"
            style={{
              boxShadow: "0 0 60px rgba(16, 185, 129, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            <h2
              className="mb-6 text-4xl font-bold"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: "rgba(255, 255, 255, 0.9)",
                textShadow: "0 0 30px rgba(16, 185, 129, 0.3)",
              }}
            >
              The Problem
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3
                  className="mb-3 text-xl font-semibold"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(16, 185, 129, 0.9)",
                  }}
                >
                  Order-Flow Leakage
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(255, 255, 255, 0.6)",
                    lineHeight: "1.8",
                  }}
                >
                  Public chains expose trading strategies, enabling copy-trading and front-running by sophisticated
                  actors.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3
                  className="mb-3 text-xl font-semibold"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(16, 185, 129, 0.9)",
                  }}
                >
                  Unfair Execution
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(255, 255, 255, 0.6)",
                    lineHeight: "1.8",
                  }}
                >
                  Path-dependent AMMs give inconsistent fills for informed traders, penalizing genuine price discovery.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3
                  className="mb-3 text-xl font-semibold"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(16, 185, 129, 0.9)",
                  }}
                >
                  Outcome Trust Gaps
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(255, 255, 255, 0.6)",
                    lineHeight: "1.8",
                  }}
                >
                  Unclear oracle incentives and weak dispute processes undermine confidence in final settlements.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3
                  className="mb-3 text-xl font-semibold"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(16, 185, 129, 0.9)",
                  }}
                >
                  Rented Liquidity
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(255, 255, 255, 0.6)",
                    lineHeight: "1.8",
                  }}
                >
                  Emissions attract mercenary TVL that vanishes when rewards end, leaving markets shallow and
                  unreliable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What VEIL Does */}
        <section className="mb-16">
          <div
            className="rounded-2xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl"
            style={{
              boxShadow: "0 0 60px rgba(16, 185, 129, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            <h2
              className="mb-6 text-4xl font-bold"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: "rgba(255, 255, 255, 0.9)",
                textShadow: "0 0 30px rgba(16, 185, 129, 0.3)",
              }}
            >
              What VEIL Does
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/20">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                      stroke="rgba(16, 185, 129, 0.9)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3
                  className="mb-3 text-xl font-semibold"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(16, 185, 129, 0.9)",
                  }}
                >
                  Private Until Execution
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(255, 255, 255, 0.6)",
                    lineHeight: "1.8",
                  }}
                >
                  Orders remain sealed until everyone trades—no one can front-run you or extract your alpha.
                </p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/20">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                      stroke="rgba(16, 185, 129, 0.9)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3
                  className="mb-3 text-xl font-semibold"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(16, 185, 129, 0.9)",
                  }}
                >
                  One Fair Price
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(255, 255, 255, 0.6)",
                    lineHeight: "1.8",
                  }}
                >
                  Single-price clearing per window means all participants share the same execution price.
                </p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/20">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(16, 185, 129, 0.9)" strokeWidth="2" fill="none" />
                    <path d="M12 6v6l4 2" stroke="rgba(16, 185, 129, 0.9)" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <h3
                  className="mb-3 text-xl font-semibold"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(16, 185, 129, 0.9)",
                  }}
                >
                  Credible Outcomes
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(255, 255, 255, 0.6)",
                    lineHeight: "1.8",
                  }}
                >
                  Bonded attestors and transparent dispute paths ensure trustworthy, verifiable settlements.
                </p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/20">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      stroke="rgba(16, 185, 129, 0.9)"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M9 12l2 2 4-4"
                      stroke="rgba(16, 185, 129, 0.9)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3
                  className="mb-3 text-xl font-semibold"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(16, 185, 129, 0.9)",
                  }}
                >
                  Compounding Depth
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(255, 255, 255, 0.6)",
                    lineHeight: "1.8",
                  }}
                >
                  Fees recycle into market depth, making spreads tighter and execution more reliable over time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy value prop */}
        <section className="mb-16">
          <div
            className="rounded-2xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl"
            style={{
              boxShadow: "0 0 60px rgba(16, 185, 129, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            <h2
              className="mb-6 text-4xl font-bold"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: "rgba(255, 255, 255, 0.9)",
                textShadow: "0 0 30px rgba(16, 185, 129, 0.3)",
              }}
            >
              Why Privacy Matters (Commercially)
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/20">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5 10l3 3 7-7"
                      stroke="rgba(16, 185, 129, 0.9)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h3
                    className="mb-2 text-lg font-semibold"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      color: "rgba(16, 185, 129, 0.9)",
                    }}
                  >
                    Better Execution
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      color: "rgba(255, 255, 255, 0.6)",
                      lineHeight: "1.8",
                    }}
                  >
                    Tighter spreads and more professional flow without predatory actors.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/20">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5 10l3 3 7-7"
                      stroke="rgba(16, 185, 129, 0.9)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h3
                    className="mb-2 text-lg font-semibold"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      color: "rgba(16, 185, 129, 0.9)",
                    }}
                  >
                    More Market Creation
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      color: "rgba(255, 255, 255, 0.6)",
                      lineHeight: "1.8",
                    }}
                  >
                    Sensitive topics can list without social or regulatory chilling effects.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/20">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5 10l3 3 7-7"
                      stroke="rgba(16, 185, 129, 0.9)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h3
                    className="mb-2 text-lg font-semibold"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      color: "rgba(16, 185, 129, 0.9)",
                    }}
                  >
                    Institutional Comfort
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      color: "rgba(255, 255, 255, 0.6)",
                      lineHeight: "1.8",
                    }}
                  >
                    Optional viewing keys enable private audits and regulatory reporting.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/20">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5 10l3 3 7-7"
                      stroke="rgba(16, 185, 129, 0.9)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h3
                    className="mb-2 text-lg font-semibold"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      color: "rgba(16, 185, 129, 0.9)",
                    }}
                  >
                    Global Reach
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      color: "rgba(255, 255, 255, 0.6)",
                      lineHeight: "1.8",
                    }}
                  >
                    Privacy lowers behavioral and competitive risk for participants worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Market opportunity */}
        <section className="mb-16">
          <div
            className="rounded-2xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl"
            style={{
              boxShadow: "0 0 60px rgba(16, 185, 129, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            <h2
              className="mb-6 text-4xl font-bold"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: "rgba(255, 255, 255, 0.9)",
                textShadow: "0 0 30px rgba(16, 185, 129, 0.3)",
              }}
            >
              Market Opportunity
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-8 text-center">
                  <div
                    className="mb-2 text-5xl font-bold"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      color: "rgba(16, 185, 129, 0.9)",
                      textShadow: "0 0 30px rgba(16, 185, 129, 0.4)",
                    }}
                  >
                    $8.2B
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    Global prediction market size by 2028
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
                  <div
                    className="mb-2 text-5xl font-bold"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      color: "rgba(16, 185, 129, 0.9)",
                      textShadow: "0 0 30px rgba(16, 185, 129, 0.4)",
                    }}
                  >
                    23.4%
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    Expected CAGR through 2028
                  </p>
                </div>
              </div>
              <div>
                <h3
                  className="mb-4 text-2xl font-semibold"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(255, 255, 255, 0.8)",
                  }}
                >
                  Key Growth Drivers
                </h3>
                <ul className="space-y-3">
                  {[
                    "Rising demand for decentralized financial instruments",
                    "Increasing institutional adoption of crypto",
                    "Growing interest in information markets",
                    "Regulatory clarity in key jurisdictions",
                    "Mainstream acceptance of prediction markets",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path
                            d="M2 6l3 3 5-6"
                            stroke="rgba(16, 185, 129, 0.9)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-space-grotesk)",
                          color: "rgba(255, 255, 255, 0.6)",
                          lineHeight: "1.6",
                        }}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Traction */}
        <section className="mb-16">
          <div
            className="rounded-2xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl"
            style={{
              boxShadow: "0 0 60px rgba(16, 185, 129, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            <h2
              className="mb-6 text-4xl font-bold"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: "rgba(255, 255, 255, 0.9)",
                textShadow: "0 0 30px rgba(16, 185, 129, 0.3)",
              }}
            >
              Early Traction
            </h2>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
                <div
                  className="mb-2 text-4xl font-bold"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(16, 185, 129, 0.9)",
                  }}
                >
                  12.5K
                </div>
                <p
                  className="text-sm"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(255, 255, 255, 0.5)",
                  }}
                >
                  Whitelist Signups
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
                <div
                  className="mb-2 text-4xl font-bold"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(16, 185, 129, 0.9)",
                  }}
                >
                  $2.4M
                </div>
                <p
                  className="text-sm"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(255, 255, 255, 0.5)",
                  }}
                >
                  Pre-Launch Volume
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
                <div
                  className="mb-2 text-4xl font-bold"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(16, 185, 129, 0.9)",
                  }}
                >
                  45
                </div>
                <p
                  className="text-sm"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(255, 255, 255, 0.5)",
                  }}
                >
                  Active Markets
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
                <div
                  className="mb-2 text-4xl font-bold"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(16, 185, 129, 0.9)",
                  }}
                >
                  98%
                </div>
                <p
                  className="text-sm"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(255, 255, 255, 0.5)",
                  }}
                >
                  User Satisfaction
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Business model */}
        <section className="mb-16">
          <div
            className="rounded-2xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl"
            style={{
              boxShadow: "0 0 60px rgba(16, 185, 129, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            <h2
              className="mb-6 text-4xl font-bold"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: "rgba(255, 255, 255, 0.9)",
                textShadow: "0 0 30px rgba(16, 185, 129, 0.3)",
              }}
            >
              Business Model
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3
                  className="mb-3 text-xl font-semibold"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(16, 185, 129, 0.9)",
                  }}
                >
                  Trading Fee
                </h3>
                <p
                  className="mb-4 text-sm"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(255, 255, 255, 0.6)",
                    lineHeight: "1.8",
                  }}
                >
                  Per matched notional during each window
                </p>
                <div
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(16, 185, 129, 0.9)",
                  }}
                >
                  40–60 bps
                </div>
                <p
                  className="text-xs"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(255, 255, 255, 0.4)",
                  }}
                >
                  Tiered by market quality
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3
                  className="mb-3 text-xl font-semibold"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(16, 185, 129, 0.9)",
                  }}
                >
                  Settlement Fee
                </h3>
                <p
                  className="mb-4 text-sm"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(255, 255, 255, 0.6)",
                    lineHeight: "1.8",
                  }}
                >
                  At outcome resolution
                </p>
                <div
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(16, 185, 129, 0.9)",
                  }}
                >
                  10–20 bps
                </div>
                <p
                  className="text-xs"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(255, 255, 255, 0.4)",
                  }}
                >
                  On final settlement
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3
                  className="mb-3 text-xl font-semibold"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(16, 185, 129, 0.9)",
                  }}
                >
                  Creation Fee
                </h3>
                <p
                  className="mb-4 text-sm"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(255, 255, 255, 0.6)",
                    lineHeight: "1.8",
                  }}
                >
                  Plus refundable collateral
                </p>
                <div
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(16, 185, 129, 0.9)",
                  }}
                >
                  Variable
                </div>
                <p
                  className="text-xs"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(255, 255, 255, 0.4)",
                  }}
                >
                  For market creators
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3
                  className="mb-3 text-xl font-semibold"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(16, 185, 129, 0.9)",
                  }}
                >
                  API Tiers
                </h3>
                <p
                  className="mb-4 text-sm"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(255, 255, 255, 0.6)",
                    lineHeight: "1.8",
                  }}
                >
                  Higher-throughput desks
                </p>
                <div
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(16, 185, 129, 0.9)",
                  }}
                >
                  Optional
                </div>
                <p
                  className="text-xs"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(255, 255, 255, 0.4)",
                  }}
                >
                  Stake-gated, post-launch
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Liquidity strategy */}
        <section className="mb-16">
          <div
            className="rounded-2xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl"
            style={{
              boxShadow: "0 0 60px rgba(16, 185, 129, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            <h2
              className="mb-6 text-4xl font-bold"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: "rgba(255, 255, 255, 0.9)",
                textShadow: "0 0 30px rgba(16, 185, 129, 0.3)",
              }}
            >
              Liquidity Strategy
            </h2>
            <p
              className="mb-8 text-lg"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: "rgba(255, 255, 255, 0.6)",
              }}
            >
              Protocol-Owned, Not Rented
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                <h3
                  className="mb-3 text-xl font-semibold"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(16, 185, 129, 0.9)",
                  }}
                >
                  Market Depth Reserve
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(255, 255, 255, 0.6)",
                    lineHeight: "1.8",
                  }}
                >
                  A treasury-managed pool that funds baseline liquidity where it's needed most, ensuring consistent
                  market quality.
                </p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                <h3
                  className="mb-3 text-xl font-semibold"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(16, 185, 129, 0.9)",
                  }}
                >
                  Buyback-and-Make
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(255, 255, 255, 0.6)",
                    lineHeight: "1.8",
                  }}
                >
                  A portion of fees buys protocol tokens and pairs them in owned liquidity positions, permanently
                  deepening core markets.
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-6">
              <p
                className="mb-2 font-semibold"
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  color: "rgba(16, 185, 129, 0.9)",
                }}
              >
                Result:
              </p>
              <p
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  color: "rgba(255, 255, 255, 0.6)",
                  lineHeight: "1.8",
                }}
              >
                Less dependence on mercenary incentives, better user experience, and price quality that compounds over
                time as depth grows.
              </p>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="mb-16">
          <div
            className="rounded-2xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl"
            style={{
              boxShadow: "0 0 60px rgba(16, 185, 129, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            <h2
              className="mb-6 text-4xl font-bold"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: "rgba(255, 255, 255, 0.9)",
                textShadow: "0 0 30px rgba(16, 185, 129, 0.3)",
              }}
            >
              Roadmap (Next 12 Months)
            </h2>
            <div className="space-y-6">
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 ring-4 ring-emerald-500/10">
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  </div>
                  <div className="h-full w-px bg-white/10" />
                </div>
                <div className="flex-1 pb-8">
                  <div className="mb-2 flex items-center gap-3">
                    <h3
                      className="text-xl font-semibold"
                      style={{
                        fontFamily: "var(--font-space-grotesk)",
                        color: "rgba(16, 185, 129, 0.9)",
                      }}
                    >
                      Q1 - Public Testnet
                    </h3>
                    <span
                      className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold"
                      style={{
                        fontFamily: "var(--font-space-grotesk)",
                        color: "rgba(16, 185, 129, 0.9)",
                      }}
                    >
                      Current
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {[
                      "Sealed windows and single-price clearing live",
                      "Dashboards and analytics available",
                      "Community testing and feedback",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span
                          style={{
                            fontFamily: "var(--font-space-grotesk)",
                            color: "rgba(255, 255, 255, 0.6)",
                          }}
                        >
                          • {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 ring-4 ring-white/5">
                    <div className="h-3 w-3 rounded-full bg-white/20" />
                  </div>
                  <div className="h-full w-px bg-white/10" />
                </div>
                <div className="flex-1 pb-8">
                  <h3
                    className="mb-2 text-xl font-semibold"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Q2 - Private Beta
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Private trading with select partners",
                      "First external security review",
                      "Performance optimization and stress testing",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span
                          style={{
                            fontFamily: "var(--font-space-grotesk)",
                            color: "rgba(255, 255, 255, 0.5)",
                          }}
                        >
                          • {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 ring-4 ring-white/5">
                    <div className="h-3 w-3 rounded-full bg-white/20" />
                  </div>
                  <div className="h-full w-px bg-white/10" />
                </div>
                <div className="flex-1 pb-8">
                  <h3
                    className="mb-2 text-xl font-semibold"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Q3 - Mainnet Beta
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Outcomes and disputes live",
                      "Protocol-owned liquidity seeded",
                      "Public launch with core markets",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span
                          style={{
                            fontFamily: "var(--font-space-grotesk)",
                            color: "rgba(255, 255, 255, 0.5)",
                          }}
                        >
                          • {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 ring-4 ring-white/5">
                    <div className="h-3 w-3 rounded-full bg-white/20" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3
                    className="mb-2 text-xl font-semibold"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Q4 - Governance & Integrations
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Governance parameters to token holders",
                      "Integrations and expanded templates",
                      "API access for institutional traders",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span
                          style={{
                            fontFamily: "var(--font-space-grotesk)",
                            color: "rgba(255, 255, 255, 0.5)",
                          }}
                        >
                          • {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Ask */}
        <section>
          <div
            className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-10 backdrop-blur-xl"
            style={{
              boxShadow: "0 0 80px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            <h2
              className="mb-6 text-4xl font-bold"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: "rgba(255, 255, 255, 0.95)",
                textShadow: "0 0 40px rgba(16, 185, 129, 0.4)",
              }}
            >
              The Ask
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <div className="mb-6">
                  <div
                    className="mb-2 text-5xl font-bold"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      color: "rgba(16, 185, 129, 0.95)",
                      textShadow: "0 0 40px rgba(16, 185, 129, 0.5)",
                    }}
                  >
                    $2M
                  </div>
                  <p
                    className="text-lg"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Seed Round
                  </p>
                </div>
                <div className="space-y-3">
                  <p
                    className="text-sm"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      color: "rgba(255, 255, 255, 0.6)",
                      lineHeight: "1.8",
                    }}
                  >
                    <span className="font-semibold text-emerald-400">Milestones:</span> Q1 testnet → Q2 private beta →
                    Q3 mainnet beta → Q4 governance & broader integrations
                  </p>
                  <p
                    className="text-sm"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      color: "rgba(255, 255, 255, 0.6)",
                      lineHeight: "1.8",
                    }}
                  >
                    <span className="font-semibold text-emerald-400">Why now:</span> On-chain forecasting needs privacy
                    + fair execution; Avalanche Subnets make it operationally feasible today
                  </p>
                </div>
              </div>
              <div>
                <h3
                  className="mb-4 text-xl font-semibold"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "rgba(255, 255, 255, 0.8)",
                  }}
                >
                  Use of Funds
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        style={{
                          fontFamily: "var(--font-space-grotesk)",
                          color: "rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        Core Protocol & Infrastructure
                      </span>
                      <span
                        className="font-semibold"
                        style={{
                          fontFamily: "var(--font-space-grotesk)",
                          color: "rgba(16, 185, 129, 0.9)",
                        }}
                      >
                        40%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[40%] rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        style={{
                          fontFamily: "var(--font-space-grotesk)",
                          color: "rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        Liquidity & Market Depth Reserve
                      </span>
                      <span
                        className="font-semibold"
                        style={{
                          fontFamily: "var(--font-space-grotesk)",
                          color: "rgba(16, 185, 129, 0.9)",
                        }}
                      >
                        30%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[30%] rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        style={{
                          fontFamily: "var(--font-space-grotesk)",
                          color: "rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        Security Audits & Testing
                      </span>
                      <span
                        className="font-semibold"
                        style={{
                          fontFamily: "var(--font-space-grotesk)",
                          color: "rgba(16, 185, 129, 0.9)",
                        }}
                      >
                        15%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[15%] rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        style={{
                          fontFamily: "var(--font-space-grotesk)",
                          color: "rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        GTM, Partnerships & Compliance
                      </span>
                      <span
                        className="font-semibold"
                        style={{
                          fontFamily: "var(--font-space-grotesk)",
                          color: "rgba(16, 185, 129, 0.9)",
                        }}
                      >
                        15%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[15%] rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4">
              <a
                href="mailto:founders@veil.markets"
                className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-emerald-500/50"
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                }}
              >
                Contact Us
              </a>
              <Link
                href="/app/docs"
                className="rounded-lg border border-white/20 bg-white/5 px-8 py-4 font-semibold backdrop-blur-xl transition-all hover:border-emerald-400/30 hover:bg-white/10"
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  color: "rgba(255, 255, 255, 0.8)",
                }}
              >
                Read Documentation
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
