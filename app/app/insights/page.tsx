"use client"

import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Copy, Download, Plus, Trash2, ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { INSIGHTS_PRODUCTS } from "@/lib/products"
import { InsightsCheckout } from "@/components/insights-checkout"

/* ─── ScrollReveal wrapper ─── */
function ScrollReveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

/* ─── Section label ─── */
function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span
        className="text-[11px] tracking-[0.2em] uppercase"
        style={{ color: "rgba(16, 185, 129, 0.5)", fontFamily: "var(--font-space-grotesk)" }}
      >
        {number}
      </span>
      <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
      <span
        className="text-[11px] tracking-[0.15em] uppercase"
        style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-space-grotesk)" }}
      >
        {label}
      </span>
    </div>
  )
}

/* ─── Glass card ─── */
function Card({ children, className = "", highlight = false, ...props }: React.HTMLAttributes<HTMLDivElement> & { highlight?: boolean }) {
  return (
    <div
      className={`rounded-[20px] backdrop-blur-2xl transition-all duration-500 ${className}`}
      style={{
        background: highlight ? "rgba(16, 185, 129, 0.03)" : "rgba(255,255,255,0.015)",
        border: `1px solid ${highlight ? "rgba(16, 185, 129, 0.12)" : "rgba(255,255,255,0.06)"}`,
        boxShadow: highlight
          ? "0 0 60px -20px rgba(16,185,129,0.08), inset 0 1px 0 rgba(255,255,255,0.03)"
          : "inset 0 1px 0 rgba(255,255,255,0.03)",
      }}
      {...props}
    >
      {children}
    </div>
  )
}

/* ─── Film grain overlay ─── */
function FilmGrain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] opacity-[0.035]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        mixBlendMode: "overlay",
      }}
    />
  )
}

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState<"dashboards" | "api" | "receipts" | "packages">("dashboards")
  const [checkoutProductId, setCheckoutProductId] = useState<string | null>(null)
  const [currentPlan, setCurrentPlan] = useState<string>("insights-standard")
  const [showNewKeyModal, setShowNewKeyModal] = useState(false)

  const apiKeys = [
    { id: "1", name: "Production API", key: "veil_live_••••••••••••3x9k", created: "2025-01-15", lastUsed: "2 hours ago" },
    { id: "2", name: "Development", key: "veil_test_••••••••••••7m2p", created: "2025-01-10", lastUsed: "5 days ago" },
  ]

  const markets = [
    { id: 1, name: "Trump wins 2024", odds: "62%", confidence: "±3%", change: "+2%", health: "Healthy", lastUpdate: "5m ago" },
    { id: 2, name: "Bitcoin > $100k by EOY", odds: "45%", confidence: "±5%", change: "-1%", health: "Healthy", lastUpdate: "5m ago" },
    { id: 3, name: "Lakers win NBA Finals", odds: "18%", confidence: "±4%", change: "+3%", health: "Thin", lastUpdate: "5m ago" },
    { id: 4, name: "Fed cuts rates in Q1", odds: "73%", confidence: "±2%", change: "0%", health: "Healthy", lastUpdate: "5m ago" },
  ]

  const receipts = [
    { id: "0x7f3a...9b2c", market: "Trump wins 2024", action: "Fill", timestamp: "2025-01-17 14:32:18", status: "Verified" },
    { id: "0x4e1d...5k8p", market: "Bitcoin > $100k", action: "Settlement", timestamp: "2025-01-17 12:15:42", status: "Verified" },
    { id: "0x9c2f...3n7q", market: "Lakers win Finals", action: "Fill", timestamp: "2025-01-17 09:48:55", status: "Verified" },
  ]

  const handleUpgrade = (productId: string) => {
    if (productId === "insights-standard") {
      setCurrentPlan(productId)
    } else {
      setCheckoutProductId(productId)
    }
  }

  const tabs = [
    { id: "dashboards", label: "Live Dashboards" },
    { id: "api", label: "API" },
    { id: "receipts", label: "Receipts" },
    { id: "packages", label: "Packages" },
  ] as const

  return (
    <div className="min-h-screen relative" style={{ background: "#060606" }}>
      <FilmGrain />

      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.03) 0%, transparent 70%)" }}
        />
      </div>

      {/* ─── Fixed Nav ─── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl"
        style={{
          background: "rgba(6,6,6,0.8)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="mx-auto max-w-7xl px-8 h-16 flex items-center justify-between">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 text-[13px] tracking-wide transition-all duration-300 group"
            style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-space-grotesk)" }}
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Markets
          </Link>
          <span
            className="text-[11px] tracking-[0.3em] uppercase"
            style={{ color: "rgba(16,185,129,0.4)", fontFamily: "var(--font-space-grotesk)" }}
          >
            Insights
          </span>
        </div>
      </motion.nav>

      {/* ─── Main Content ─── */}
      <div className="relative z-10 min-h-screen px-8 pt-32 pb-32">
        <div className="mx-auto max-w-7xl">

          {/* ─── Hero ─── */}
          <ScrollReveal>
            <div className="mb-20 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1
                  className="text-6xl md:text-7xl font-light mb-5 leading-[1.1]"
                  style={{
                    fontFamily: "var(--font-instrument-serif)",
                    color: "rgba(255,255,255,0.92)",
                    textShadow: "0 0 80px rgba(16,185,129,0.15)",
                  }}
                >
                  Insights Hub
                </h1>
              </motion.div>
              <p
                className="text-lg font-light max-w-xl mx-auto mb-3"
                style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.35)" }}
              >
                We sell probabilities, not people.
              </p>
              <p
                className="text-[13px] font-light tracking-wide"
                style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.5)" }}
              >
                No wallet data · Aggregated · Delayed · Verified
              </p>
            </div>
          </ScrollReveal>

          {/* ─── Tabs ─── */}
          <ScrollReveal delay={0.1}>
            <div className="flex items-center gap-1 mb-10 pb-px" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className="relative px-6 py-3.5 text-[13px] tracking-wide transition-colors duration-300"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: activeTab === tab.id ? "rgba(16,185,129,0.9)" : "rgba(255,255,255,0.3)",
                  }}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-px"
                      style={{ background: "rgba(16,185,129,0.7)", boxShadow: "0 0 12px rgba(16,185,129,0.4)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </ScrollReveal>

          <AnimatePresence mode="wait">
            {/* ═══════════ Dashboards ═══════════ */}
            {activeTab === "dashboards" && (
              <motion.div
                key="dashboards"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <ScrollReveal>
                  <SectionLabel number="01" label="Market Odds" />
                  <Card className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2
                          className="text-2xl font-light mb-1.5"
                          style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.9)" }}
                        >
                          Market Odds
                        </h2>
                        <p className="text-[12px] tracking-wide" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.3)" }}>
                          Aggregated from all sealed windows · Delayed 5m · No individual order data
                        </p>
                      </div>
                      <button
                        className="flex items-center gap-2.5 px-5 py-2.5 rounded-full text-[12px] tracking-wide transition-all duration-300 hover:scale-[1.03]"
                        style={{
                          fontFamily: "var(--font-space-grotesk)",
                          background: "rgba(16,185,129,0.08)",
                          border: "1px solid rgba(16,185,129,0.15)",
                          color: "rgba(16,185,129,0.9)",
                        }}
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download 24h CSV
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                            {["Market", "Odds", "Confidence", "Change", "Health", "Last Update"].map((h) => (
                              <th
                                key={h}
                                className="text-left py-3 px-4 text-[11px] tracking-[0.12em] uppercase"
                                style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.25)" }}
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {markets.map((market, i) => (
                            <motion.tr
                              key={market.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: i * 0.06 }}
                              className="group transition-colors duration-300"
                              style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            >
                              <td className="py-4 px-4 text-[13px]" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.75)" }}>
                                {market.name}
                              </td>
                              <td className="py-4 px-4 text-[13px] tabular-nums" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.9)" }}>
                                {market.odds}
                              </td>
                              <td className="py-4 px-4 text-[13px] tabular-nums" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.4)" }}>
                                {market.confidence}
                              </td>
                              <td
                                className="py-4 px-4 text-[13px] tabular-nums"
                                style={{
                                  fontFamily: "var(--font-space-grotesk)",
                                  color: market.change.startsWith("+")
                                    ? "rgba(16,185,129,0.9)"
                                    : market.change.startsWith("-")
                                      ? "rgba(239,68,68,0.8)"
                                      : "rgba(255,255,255,0.4)",
                                }}
                              >
                                {market.change}
                              </td>
                              <td className="py-4 px-4">
                                <span
                                  className="px-3 py-1 rounded-full text-[11px] tracking-wide"
                                  style={{
                                    fontFamily: "var(--font-space-grotesk)",
                                    background: market.health === "Healthy" ? "rgba(16,185,129,0.08)" : "rgba(234,179,8,0.08)",
                                    border: `1px solid ${market.health === "Healthy" ? "rgba(16,185,129,0.15)" : "rgba(234,179,8,0.15)"}`,
                                    color: market.health === "Healthy" ? "rgba(16,185,129,0.85)" : "rgba(234,179,8,0.85)",
                                  }}
                                >
                                  {market.health}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-[12px]" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.25)" }}>
                                {market.lastUpdate}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                      <a
                        href="/app/docs"
                        target="_blank"
                        className="inline-flex items-center gap-2 text-[11px] tracking-wide transition-colors duration-300 hover:text-emerald-400"
                        style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.3)" }}
                        rel="noreferrer"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Learn about our privacy model and delay policies
                      </a>
                    </div>
                  </Card>
                </ScrollReveal>
              </motion.div>
            )}

            {/* ═══════════ API ═══════════ */}
            {activeTab === "api" && (
              <motion.div
                key="api"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-8"
              >
                {/* API Keys */}
                <ScrollReveal>
                  <SectionLabel number="01" label="API Keys" />
                  <Card className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <h2
                        className="text-2xl font-light"
                        style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.9)" }}
                      >
                        API Keys
                      </h2>
                      <button
                        onClick={() => setShowNewKeyModal(true)}
                        className="flex items-center gap-2.5 px-5 py-2.5 rounded-full text-[12px] tracking-wide transition-all duration-300 hover:scale-[1.03]"
                        style={{
                          fontFamily: "var(--font-space-grotesk)",
                          background: "rgba(16,185,129,0.08)",
                          border: "1px solid rgba(16,185,129,0.15)",
                          color: "rgba(16,185,129,0.9)",
                        }}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Create New Key
                      </button>
                    </div>

                    <div className="space-y-3">
                      {apiKeys.map((key, i) => (
                        <motion.div
                          key={key.id}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="flex items-center justify-between p-5 rounded-2xl transition-colors duration-300"
                          style={{
                            background: "rgba(255,255,255,0.015)",
                            border: "1px solid rgba(255,255,255,0.04)",
                          }}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-[14px]" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.85)" }}>
                                {key.name}
                              </span>
                              <span
                                className="px-2.5 py-0.5 rounded-full text-[10px] tracking-wider uppercase"
                                style={{
                                  fontFamily: "var(--font-space-grotesk)",
                                  background: "rgba(16,185,129,0.08)",
                                  border: "1px solid rgba(16,185,129,0.15)",
                                  color: "rgba(16,185,129,0.85)",
                                }}
                              >
                                Active
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] tracking-wide" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.25)" }}>
                              <span>Created {key.created}</span>
                              <span style={{ color: "rgba(255,255,255,0.1)" }}>·</span>
                              <span>Last used {key.lastUsed}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <code
                              className="px-4 py-2 rounded-xl font-mono text-[12px]"
                              style={{ background: "rgba(0,0,0,0.4)", color: "rgba(255,255,255,0.5)" }}
                            >
                              {key.key}
                            </code>
                            <button className="p-2.5 rounded-xl transition-colors duration-300 hover:bg-white/[0.04]" style={{ color: "rgba(255,255,255,0.35)" }}>
                              <Copy className="h-4 w-4" />
                            </button>
                            <button className="p-2.5 rounded-xl transition-colors duration-300 hover:bg-red-500/[0.06]" style={{ color: "rgba(239,68,68,0.5)" }}>
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </ScrollReveal>

                {/* Quickstart */}
                <ScrollReveal delay={0.1}>
                  <SectionLabel number="02" label="Quickstart" />
                  <Card className="p-8">
                    <h2
                      className="text-2xl font-light mb-5"
                      style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.9)" }}
                    >
                      Quickstart
                    </h2>
                    <pre
                      className="p-6 rounded-2xl overflow-x-auto text-[12px] font-mono leading-relaxed"
                      style={{ background: "rgba(0,0,0,0.4)", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.04)" }}
                    >
                      {`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.veil.markets/v1/markets

# Response (delayed 5m, aggregated)
{
  "markets": [
    {
      "id": "trump-2024",
      "odds": 0.62,
      "confidence": 0.03,
      "delayed_minutes": 5
    }
  ]
}`}
                    </pre>
                  </Card>
                </ScrollReveal>

                {/* Usage */}
                <ScrollReveal delay={0.2}>
                  <SectionLabel number="03" label="Usage" />
                  <Card className="p-8">
                    <h2
                      className="text-2xl font-light mb-6"
                      style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.9)" }}
                    >
                      Usage This Month
                    </h2>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[13px]" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.5)" }}>
                          API Calls
                        </span>
                        <span className="text-[13px] tabular-nums" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.85)" }}>
                          12,450 / 50,000
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "25%" }}
                          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                          style={{ background: "linear-gradient(90deg, rgba(16,185,129,0.7), rgba(16,185,129,0.35))" }}
                        />
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              </motion.div>
            )}

            {/* ═══════════ Receipts ═══════════ */}
            {activeTab === "receipts" && (
              <motion.div
                key="receipts"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <ScrollReveal>
                  <SectionLabel number="01" label="Transaction Receipts" />
                  <Card className="p-8">
                    <h2
                      className="text-2xl font-light mb-8"
                      style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.9)" }}
                    >
                      Recent Receipts
                    </h2>

                    <div className="space-y-3">
                      {receipts.map((receipt, i) => (
                        <motion.div
                          key={receipt.id}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="flex items-center justify-between p-5 rounded-2xl transition-colors duration-300"
                          style={{
                            background: "rgba(255,255,255,0.015)",
                            border: "1px solid rgba(255,255,255,0.04)",
                          }}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <code
                                className="px-3 py-1.5 rounded-xl font-mono text-[11px]"
                                style={{ background: "rgba(0,0,0,0.4)", color: "rgba(16,185,129,0.85)" }}
                              >
                                {receipt.id}
                              </code>
                              <span
                                className="px-2.5 py-0.5 rounded-full text-[10px] tracking-wider uppercase"
                                style={{
                                  fontFamily: "var(--font-space-grotesk)",
                                  background: "rgba(16,185,129,0.08)",
                                  border: "1px solid rgba(16,185,129,0.15)",
                                  color: "rgba(16,185,129,0.85)",
                                }}
                              >
                                {receipt.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] tracking-wide" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.25)" }}>
                              <span>{receipt.market}</span>
                              <span style={{ color: "rgba(255,255,255,0.1)" }}>·</span>
                              <span>{receipt.action}</span>
                              <span style={{ color: "rgba(255,255,255,0.1)" }}>·</span>
                              <span>{receipt.timestamp}</span>
                            </div>
                          </div>
                          <button className="p-2.5 rounded-xl transition-colors duration-300 hover:bg-white/[0.04]" style={{ color: "rgba(255,255,255,0.35)" }}>
                            <Copy className="h-4 w-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </ScrollReveal>
              </motion.div>
            )}

            {/* ═══════════ Packages ═══════════ */}
            {activeTab === "packages" && (
              <motion.div
                key="packages"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <ScrollReveal>
                  <SectionLabel number="01" label="Choose Your Plan" />
                </ScrollReveal>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {INSIGHTS_PRODUCTS.map((pkg, i) => {
                    const isCurrentPlan = currentPlan === pkg.id
                    const isFree = pkg.priceInCents === 0
                    const isEnterprise = pkg.id === "insights-enterprise"

                    return (
                      <ScrollReveal key={pkg.id} delay={i * 0.1}>
                        <Card highlight={isEnterprise} className="p-8 h-full flex flex-col">
                          {isEnterprise && (
                            <div
                              className="mb-4 px-3 py-1 rounded-full text-[10px] tracking-[0.2em] uppercase self-start"
                              style={{
                                fontFamily: "var(--font-space-grotesk)",
                                background: "rgba(16,185,129,0.1)",
                                border: "1px solid rgba(16,185,129,0.2)",
                                color: "rgba(16,185,129,0.9)",
                              }}
                            >
                              Recommended
                            </div>
                          )}
                          <h3
                            className="text-3xl font-light mb-2"
                            style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.9)" }}
                          >
                            {pkg.name}
                          </h3>
                          <div className="mb-5">
                            <span
                              className="text-4xl font-light"
                              style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.9)" }}
                            >
                              {isFree ? "Free" : `$${(pkg.priceInCents / 100).toFixed(0)}`}
                            </span>
                            {!isFree && (
                              <span className="text-[13px] ml-1" style={{ color: "rgba(255,255,255,0.25)" }}>/mo</span>
                            )}
                          </div>
                          <div
                            className="mb-6 px-3 py-1.5 rounded-full text-[11px] tracking-wide inline-block self-start"
                            style={{
                              fontFamily: "var(--font-space-grotesk)",
                              background: "rgba(16,185,129,0.06)",
                              border: "1px solid rgba(16,185,129,0.1)",
                              color: "rgba(16,185,129,0.7)",
                            }}
                          >
                            Delay: {pkg.delay}
                          </div>
                          <ul className="space-y-3 mb-8 flex-1">
                            {pkg.features.map((feature) => (
                              <li
                                key={feature}
                                className="text-[13px] flex items-start gap-3"
                                style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.55)" }}
                              >
                                <div className="w-1 h-1 rounded-full mt-2 shrink-0" style={{ background: "rgba(16,185,129,0.5)" }} />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <button
                            onClick={() => handleUpgrade(pkg.id)}
                            disabled={isCurrentPlan}
                            className="w-full py-3 rounded-2xl text-[13px] tracking-wide transition-all duration-300 hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                            style={{
                              fontFamily: "var(--font-space-grotesk)",
                              background: isEnterprise ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.06)",
                              border: `1px solid ${isEnterprise ? "rgba(16,185,129,0.25)" : "rgba(16,185,129,0.1)"}`,
                              color: "rgba(16,185,129,0.9)",
                            }}
                          >
                            {isCurrentPlan ? "Current Plan" : isFree ? "Downgrade" : "Upgrade"}
                          </button>
                        </Card>
                      </ScrollReveal>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Fixed Footer ─── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-2xl"
        style={{
          background: "rgba(6,6,6,0.8)",
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="mx-auto max-w-7xl px-8 h-12 flex items-center justify-between">
          <span className="text-[11px] tracking-wide" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.15)" }}>
            © VEIL � TSL
          </span>
          <span className="text-[11px] tracking-wide" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.15)" }}>
            Privacy-first prediction data
          </span>
        </div>
      </div>

      {checkoutProductId && (
        <InsightsCheckout productId={checkoutProductId} onClose={() => setCheckoutProductId(null)} />
      )}
    </div>
  )
}
