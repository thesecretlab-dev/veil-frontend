"use client"

import { VeilFooter } from '@/components/brand'

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"

/* ─── ScrollReveal ─── */
function SR({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}

/* ─── Code Block ─── */
function CodeBlock({ children }: { children: string }) {
  return (
    <pre
      className="overflow-x-auto rounded-[14px] p-5 text-[13px] leading-relaxed"
      style={{
        background: "rgba(0,0,0,0.5)",
        border: "1px solid rgba(255,255,255,0.04)",
        color: "rgba(16,185,129,0.8)",
        fontFamily: "monospace",
      }}
    >
      <code>{children}</code>
    </pre>
  )
}

/* ─── Inline Code ─── */
function IC({ children }: { children: React.ReactNode }) {
  return (
    <code
      className="rounded-md px-2 py-0.5 text-[13px]"
      style={{
        background: "rgba(0,0,0,0.4)",
        border: "1px solid rgba(255,255,255,0.04)",
        color: "rgba(16,185,129,0.8)",
        fontFamily: "monospace",
      }}
    >
      {children}
    </code>
  )
}

/* ─── Endpoint Card ─── */
function Endpoint({
  method,
  path,
  description,
  params,
  delay = 0,
}: {
  method: string
  path: string
  description: string
  params?: string
  delay?: number
}) {
  const methodColor = method === "POST" ? "rgba(251,191,36,0.9)" : "rgba(16,185,129,0.9)"
  return (
    <SR delay={delay}>
      <div
        className="rounded-[16px] p-5"
        style={{
          background: "rgba(255,255,255,0.015)",
          border: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="mb-2 flex items-center gap-3">
          <span
            className="rounded-md px-2.5 py-1 text-xs font-bold tracking-wider"
            style={{
              background: `${methodColor.replace("0.9", "0.1")}`,
              color: methodColor,
              fontFamily: "monospace",
            }}
          >
            {method}
          </span>
          <span
            className="text-sm font-medium"
            style={{ color: "rgba(255,255,255,0.7)", fontFamily: "monospace" }}
          >
            {path}
          </span>
        </div>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-space-grotesk)" }}
        >
          {description}
        </p>
        {params && (
          <p
            className="mt-2 text-xs"
            style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-space-grotesk)" }}
          >
            {params}
          </p>
        )}
      </div>
    </SR>
  )
}

/* ─── Section Label ─── */
function SectionLabel({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <span
        className="text-xs font-medium tracking-[0.3em] uppercase"
        style={{ color: "rgba(16,185,129,0.5)", fontFamily: "var(--font-space-grotesk)" }}
      >
        {number}
      </span>
      <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.04)" }} />
    </div>
  )
}

/* ═══════════════════════════════════════════════ */
export default function ApiDocsPage() {
  return (
    <>
      {/* Film Grain */}
      <div
        className="pointer-events-none fixed inset-0 z-[9999]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          opacity: 0.5,
        }}
      />

      <div className="min-h-screen" style={{ background: "#060606" }}>
        {/* ─── Fixed Nav ─── */}
        <nav
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5"
          style={{
            background: "rgba(6,6,6,0.8)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <Link href="/app" className="text-lg font-semibold tracking-wider" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-instrument-serif)" }}>
            VEIL
          </Link>
          <div className="flex gap-6">
            {[{ label: "Privacy", href: "/app/privacy" }, { label: "Terms", href: "/app/terms" }].map((l) => (
              <Link key={l.href} href={l.href} className="text-xs tracking-wider uppercase transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-space-grotesk)" }}>
                {l.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* ─── Hero ─── */}
        <header className="flex flex-col items-center justify-center px-6 pt-40 pb-20 text-center">
          <SR>
            <p
              className="mb-4 text-xs tracking-[0.4em] uppercase"
              style={{ color: "rgba(16,185,129,0.5)", fontFamily: "var(--font-space-grotesk)" }}
            >
              Developer Reference
            </p>
          </SR>
          <SR delay={0.1}>
            <h1
              className="mb-4 text-5xl font-light leading-[1.1] md:text-6xl"
              style={{
                fontFamily: "var(--font-instrument-serif)",
                color: "rgba(255,255,255,0.9)",
                textShadow: "0 0 60px rgba(16,185,129,0.08)",
              }}
            >
              API Documentation
            </h1>
          </SR>
          <SR delay={0.2}>
            <p
              className="max-w-lg text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-figtree)" }}
            >
              Last updated February 2026
            </p>
          </SR>
        </header>

        {/* ─── Content ─── */}
        <main className="mx-auto max-w-3xl px-6 pb-32">
          {/* 01 — REST API */}
          <section className="mb-20">
            <SR>
              <SectionLabel number="01" title="REST API" />
              <h2
                className="mb-4 text-3xl font-light"
                style={{
                  fontFamily: "var(--font-instrument-serif)",
                  color: "rgba(255,255,255,0.85)",
                  textShadow: "0 0 30px rgba(16,185,129,0.1)",
                }}
              >
                REST API
              </h2>
              <p
                className="mb-8 text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-space-grotesk)" }}
              >
                Base URL: <IC>https://api.veil.markets/v1</IC>
              </p>
            </SR>

            <div className="space-y-4">
              <Endpoint method="GET" path="/markets" description="Fetch all active markets with current prices, volume, and metadata." params="Query params: category, status, limit, offset" delay={0.05} />
              <Endpoint method="GET" path="/markets/:id" description="Get detailed information about a specific market including resolution criteria and historical data." delay={0.1} />
              <Endpoint method="GET" path="/markets/:id/orderbook" description="Retrieve the current order book for a market with bid/ask prices and liquidity depth." delay={0.15} />
              <Endpoint method="POST" path="/orders" description="Place a new order on a market. Requires wallet authentication and signature." params="Body: marketId, outcome, amount, price, signature" delay={0.2} />
              <Endpoint method="GET" path="/user/:address/positions" description="Get all open positions for a wallet address. Requires authentication." delay={0.25} />
            </div>
          </section>

          {/* 02 — WebSocket API */}
          <section className="mb-20">
            <SR>
              <SectionLabel number="02" title="WebSocket API" />
              <h2
                className="mb-4 text-3xl font-light"
                style={{
                  fontFamily: "var(--font-instrument-serif)",
                  color: "rgba(255,255,255,0.85)",
                  textShadow: "0 0 30px rgba(16,185,129,0.1)",
                }}
              >
                WebSocket API
              </h2>
              <p
                className="mb-4 text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-space-grotesk)" }}
              >
                Connect to: <IC>wss://api.veil.markets/ws</IC>
              </p>
              <p
                className="mb-8 text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-space-grotesk)" }}
              >
                Subscribe to real-time market updates, order book changes, and trade executions via WebSocket connections.
              </p>
            </SR>

            <div className="space-y-6">
              <SR delay={0.05}>
                <h3
                  className="mb-3 text-sm font-medium"
                  style={{ color: "rgba(16,185,129,0.7)", fontFamily: "var(--font-space-grotesk)" }}
                >
                  Subscribe to Market
                </h3>
                <CodeBlock>{`{ "action": "subscribe", "channel": "market", "marketId": "btc-100k" }`}</CodeBlock>
              </SR>
              <SR delay={0.1}>
                <h3
                  className="mb-3 text-sm font-medium"
                  style={{ color: "rgba(16,185,129,0.7)", fontFamily: "var(--font-space-grotesk)" }}
                >
                  Subscribe to Order Book
                </h3>
                <CodeBlock>{`{ "action": "subscribe", "channel": "orderbook", "marketId": "btc-100k" }`}</CodeBlock>
              </SR>
            </div>
          </section>

          {/* 03 — Authentication */}
          <section className="mb-20">
            <SR>
              <SectionLabel number="03" title="Authentication" />
              <h2
                className="mb-4 text-3xl font-light"
                style={{
                  fontFamily: "var(--font-instrument-serif)",
                  color: "rgba(255,255,255,0.85)",
                  textShadow: "0 0 30px rgba(16,185,129,0.1)",
                }}
              >
                Authentication
              </h2>
              <p
                className="mb-6 text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-space-grotesk)" }}
              >
                VEIL uses wallet-based authentication. Sign a message with your wallet to receive an API key:
              </p>
            </SR>
            <SR delay={0.1}>
              <div
                className="rounded-[20px] p-6"
                style={{
                  background: "rgba(255,255,255,0.015)",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <ol className="space-y-4">
                  {[
                    "Request a challenge message from POST /auth/challenge",
                    "Sign the message with your wallet",
                    "Submit the signature to POST /auth/verify",
                    "Receive an API key valid for 24 hours",
                    "Include the API key in the Authorization header for authenticated requests",
                  ].map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span
                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                        style={{
                          background: "rgba(16,185,129,0.08)",
                          color: "rgba(16,185,129,0.7)",
                          border: "1px solid rgba(16,185,129,0.15)",
                          fontFamily: "var(--font-space-grotesk)",
                        }}
                      >
                        {i + 1}
                      </span>
                      <span
                        className="text-sm leading-relaxed"
                        style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-space-grotesk)" }}
                      >
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </SR>
          </section>
        </main>

        {/* ─── Footer ─── */}
        <footer
          className="border-t px-8 py-8"
          style={{ borderColor: "rgba(255,255,255,0.04)", background: "rgba(6,6,6,0.6)" }}
        >
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <span
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-space-grotesk)" }}
            >
              © 2026 VEIL
            </span>
            <div className="flex gap-6">
              {[
                { label: "Privacy", href: "/app/privacy" },
                { label: "Terms", href: "/app/terms" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-xs transition-colors hover:text-white"
                  style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-space-grotesk)" }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
