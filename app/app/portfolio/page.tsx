"use client"

import { VeilFooter, VeilHeader } from '@/components/brand'

import { useState, useRef, useEffect, ReactNode } from "react"
import Link from "next/link"
import { PortfolioChart } from "@/components/portfolio-chart"
import { Download, Copy, Check, TrendingUp, TrendingDown, ChevronDown } from "lucide-react"
import { motion, AnimatePresence, useInView } from "framer-motion"

/* ─── ScrollReveal ─── */
function ScrollReveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Film Grain Overlay ─── */
function FilmGrain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] opacity-[0.035]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
      }}
    />
  )
}

/* ─── Section Label ─── */
function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <span
        className="text-[11px] tracking-[0.2em] uppercase"
        style={{ color: "rgba(16,185,129,0.5)", fontFamily: "var(--font-space-grotesk)" }}
      >
        {number}
      </span>
      <div className="h-px flex-1 max-w-[40px]" style={{ background: "rgba(255,255,255,0.06)" }} />
      <span
        className="text-[11px] tracking-[0.2em] uppercase"
        style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-space-grotesk)" }}
      >
        {label}
      </span>
    </div>
  )
}

/* ─── Stat Card ─── */
function StatCard({ label, value, color, sub }: { label: string; value: string; color: string; sub?: string }) {
  return (
    <div
      className="rounded-[20px] p-8 relative overflow-hidden group"
      style={{
        background: "rgba(255,255,255,0.015)",
        border: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(16,185,129,0.04), transparent 70%)" }}
      />
      <div
        className="text-[11px] tracking-[0.15em] uppercase mb-4 relative z-10"
        style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-space-grotesk)" }}
      >
        {label}
      </div>
      <div
        className="text-[2.5rem] leading-none font-light relative z-10"
        style={{ color, fontFamily: "var(--font-instrument-serif)" }}
      >
        {value}
      </div>
      {sub && (
        <div
          className="text-sm mt-2 relative z-10"
          style={{ color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-figtree)" }}
        >
          {sub}
        </div>
      )}
    </div>
  )
}

/* ─── Detail Row ─── */
function DetailRow({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2">
      <span
        className="text-[13px]"
        style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-space-grotesk)" }}
      >
        {label}
      </span>
      <span
        className="text-[13px]"
        style={{
          color: accent ? "rgba(16,185,129,0.8)" : "rgba(255,255,255,0.7)",
          fontFamily: accent ? "monospace" : "var(--font-figtree)",
        }}
      >
        {value}
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════ */
export default function PortfolioPage() {
  const [expandedPosition, setExpandedPosition] = useState<number | null>(null)
  const [expandedTrade, setExpandedTrade] = useState<number | null>(null)
  const [copiedReceipt, setCopiedReceipt] = useState<string | null>(null)

  const positions = [
    {
      id: 1, question: "Will Bitcoin reach $100k by end of 2024?", outcome: "Yes",
      shares: 250, avgPrice: 0.45, currentPrice: 0.62, value: 155, pnl: 42.5, pnlPercent: 37.8,
      entryDate: "2024-01-08", marketVolume: "$2.4M", totalShares: 5420000, yourOwnership: "0.0046%",
      fees: 1.25, breakEven: 0.45, roi: 37.8, daysHeld: 37, lastUpdate: "2 hours ago", receiptId: "0x7f3a...9b2c",
    },
    {
      id: 2, question: "Will there be a US recession in 2024?", outcome: "No",
      shares: 180, avgPrice: 0.38, currentPrice: 0.51, value: 91.8, pnl: 23.4, pnlPercent: 34.2,
      entryDate: "2024-01-12", marketVolume: "$1.8M", totalShares: 3890000, yourOwnership: "0.0046%",
      fees: 0.95, breakEven: 0.38, roi: 34.2, daysHeld: 33, lastUpdate: "5 hours ago", receiptId: "0x4e1d...5k8p",
    },
    {
      id: 3, question: "Will Trump win the 2024 election?", outcome: "Yes",
      shares: 320, avgPrice: 0.52, currentPrice: 0.48, value: 153.6, pnl: -12.8, pnlPercent: -7.7,
      entryDate: "2024-01-05", marketVolume: "$8.2M", totalShares: 18500000, yourOwnership: "0.0017%",
      fees: 1.85, breakEven: 0.52, roi: -7.7, daysHeld: 40, lastUpdate: "1 hour ago", receiptId: "0x9c2f...3n7q",
    },
  ]

  const history = [
    {
      id: 1, date: "2024-01-15", time: "14:32 EST", question: "Will AI replace 50% of jobs by 2030?",
      outcome: "No", type: "Sell", shares: 150, price: 0.68, total: 102, pnl: 28.5,
      entryPrice: 0.49, entryDate: "2023-12-20", exitPrice: 0.68, fees: 1.15, netPnl: 27.35,
      holdingPeriod: "26 days", roi: 38.8, transactionHash: "0x7a9f...3c2d", receiptId: "0x7a9f...3c2d",
    },
    {
      id: 2, date: "2024-01-14", time: "09:15 EST", question: "Will Ethereum reach $5k in 2024?",
      outcome: "Yes", type: "Buy", shares: 200, price: 0.42, total: 84, pnl: 0,
      entryPrice: 0.42, entryDate: "2024-01-14", exitPrice: null, fees: 0.84, netPnl: 0,
      holdingPeriod: "31 days", roi: 0, transactionHash: "0x4b8e...9f1a", receiptId: "0x4b8e...9f1a",
    },
  ]

  const totalValue = positions.reduce((sum, pos) => sum + pos.value, 0)
  const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0)
  const totalPnLPercent = (totalPnL / (totalValue - totalPnL)) * 100

  const portfolioHistory = [
    { date: "Jan 1", value: 320 }, { date: "Jan 5", value: 335 }, { date: "Jan 10", value: 328 },
    { date: "Jan 15", value: 352 }, { date: "Jan 20", value: 368 }, { date: "Jan 25", value: 358 },
    { date: "Jan 30", value: 375 }, { date: "Feb 4", value: 385 }, { date: "Feb 9", value: 395 },
    { date: "Feb 14", value: totalValue },
  ]

  const handleExportCSV = () => {
    const csvData = [
      ["Date", "Market", "Type", "Outcome", "Shares", "Price", "Total", "P&L", "Receipt ID"],
      ...history.map((t) => [t.date, t.question, t.type, t.outcome, t.shares, t.price, t.total, t.pnl, t.receiptId]),
    ]
    const csvContent = csvData.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `veil-portfolio-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleCopyReceipt = (receiptId: string) => {
    navigator.clipboard.writeText(receiptId)
    setCopiedReceipt(receiptId)
    setTimeout(() => setCopiedReceipt(null), 2000)
  }

  const emerald = "rgba(16,185,129,0.95)"
  const red = "rgba(239,68,68,0.95)"
  const pnlColor = (v: number) => (v >= 0 ? emerald : red)

  return (
    <div className="relative min-h-screen" style={{ background: "#060606" }}>
      <FilmGrain />
      <VeilHeader />

      {/* ─── Fixed Nav ─── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
        style={{ background: "rgba(6,6,6,0.85)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="mx-auto max-w-6xl px-8 h-16 flex items-center justify-between">
          <Link
            href="/app"
            className="flex items-center gap-3 group"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="opacity-40 group-hover:opacity-70 transition-opacity">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span
              className="text-[13px] tracking-wide opacity-40 group-hover:opacity-70 transition-opacity"
              style={{ fontFamily: "var(--font-space-grotesk)", color: "#fff" }}
            >
              Markets
            </span>
          </Link>
          <span
            className="text-[13px] tracking-[0.15em] uppercase"
            style={{ color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-space-grotesk)" }}
          >
            Portfolio
          </span>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-2 rounded-full text-[12px] tracking-wide transition-all"
            style={{
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.15)",
              color: "rgba(16,185,129,0.85)",
              fontFamily: "var(--font-space-grotesk)",
            }}
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </motion.button>
        </div>
      </nav>

      {/* ─── Preview Banner ─── */}
      <div className="relative z-10 pt-24 mx-auto max-w-6xl px-8">
        <div className="rounded-[16px] border border-amber-500/20 bg-amber-500/5 px-5 py-3 text-center mb-4">
          <span className="font-[var(--font-space-grotesk)] text-[11px] tracking-[0.15em] uppercase text-amber-300/70">
            Demo Data — All positions and values shown are illustrative only. No live trading is active.
          </span>
        </div>
      </div>

      {/* ─── Hero / Portfolio Value ─── */}
      <div className="relative z-10 pb-8 mx-auto max-w-6xl px-8">
        <ScrollReveal>
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="text-[11px] tracking-[0.3em] uppercase mb-6"
                style={{ color: "rgba(16,185,129,0.4)", fontFamily: "var(--font-space-grotesk)" }}
              >
                Total Portfolio Value
              </div>
              <h1
                className="text-[5rem] md:text-[7rem] leading-[0.9] font-light tracking-tight"
                style={{
                  color: "rgba(255,255,255,0.95)",
                  fontFamily: "var(--font-instrument-serif)",
                  textShadow: "0 0 80px rgba(16,185,129,0.12)",
                }}
              >
                ${totalValue.toFixed(2)}
              </h1>
              <div className="flex items-center justify-center gap-6 mt-6">
                <span
                  className="flex items-center gap-1.5 text-lg font-light"
                  style={{ color: pnlColor(totalPnL), fontFamily: "var(--font-instrument-serif)" }}
                >
                  {totalPnL >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {totalPnL >= 0 ? "+" : ""}${totalPnL.toFixed(2)}
                </span>
                <span
                  className="text-sm px-3 py-1 rounded-full"
                  style={{
                    background: totalPnL >= 0 ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                    color: pnlColor(totalPnLPercent),
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  {totalPnLPercent >= 0 ? "+" : ""}{totalPnLPercent.toFixed(1)}%
                </span>
              </div>
            </motion.div>
          </div>
        </ScrollReveal>

        {/* ─── Stats Grid ─── */}
        <ScrollReveal delay={0.1}>
          <div className="grid gap-5 md:grid-cols-3 mb-24">
            <StatCard label="Positions" value={String(positions.length)} color="rgba(255,255,255,0.9)" sub="Active markets" />
            <StatCard label="Best Performer" value="+37.8%" color={emerald} sub="BTC $100k" />
            <StatCard label="Total Trades" value={String(positions.length + history.length)} color="rgba(255,255,255,0.9)" sub="All time" />
          </div>
        </ScrollReveal>

        {/* ─── 01 / Chart ─── */}
        <ScrollReveal delay={0.15}>
          <SectionLabel number="01" label="Performance" />
          <div
            className="rounded-[20px] p-8 md:p-10 mb-24 relative overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.04)",
              boxShadow: "0 0 80px rgba(16,185,129,0.03)",
            }}
          >
            {/* Subtle grid lines */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />
            <div className="relative z-10">
              <PortfolioChart data={portfolioHistory} />
            </div>
          </div>
        </ScrollReveal>

        {/* ─── 02 / Active Positions ─── */}
        <ScrollReveal delay={0.1}>
          <SectionLabel number="02" label="Active Positions" />
        </ScrollReveal>

        <div className="space-y-4 mb-24">
          {positions.map((position, i) => (
            <ScrollReveal key={position.id} delay={0.05 * i}>
              <motion.div
                layout
                className="rounded-[20px] cursor-pointer relative overflow-hidden group"
                style={{
                  background: "rgba(255,255,255,0.015)",
                  border: `1px solid ${expandedPosition === position.id ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)"}`,
                  boxShadow: expandedPosition === position.id ? "0 0 60px rgba(16,185,129,0.06)" : "none",
                }}
                onClick={() => setExpandedPosition(expandedPosition === position.id ? null : position.id)}
                whileHover={{ borderColor: "rgba(16,185,129,0.1)" }}
                transition={{ duration: 0.3 }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.03), transparent 60%)" }}
                />

                {/* PnL accent bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[2px]"
                  style={{ background: position.pnl >= 0 ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)" }}
                />

                <div className="relative z-10 p-7 md:p-8">
                  <div className="flex items-start justify-between gap-8">
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-[1.15rem] font-normal mb-3 leading-snug"
                        style={{ color: "rgba(255,255,255,0.88)", fontFamily: "var(--font-figtree)" }}
                      >
                        {position.question}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        <span
                          className="text-[12px] px-2.5 py-0.5 rounded-full"
                          style={{
                            background: "rgba(16,185,129,0.08)",
                            color: "rgba(16,185,129,0.8)",
                            fontFamily: "var(--font-space-grotesk)",
                          }}
                        >
                          {position.outcome}
                        </span>
                        <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-space-grotesk)" }}>
                          {position.shares} shares
                        </span>
                        <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-space-grotesk)" }}>
                          {position.avgPrice.toFixed(2)}¢ → {position.currentPrice.toFixed(2)}¢
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-5 shrink-0">
                      <div className="text-right">
                        <div
                          className="text-[1.75rem] font-light leading-none"
                          style={{ color: pnlColor(position.pnl), fontFamily: "var(--font-instrument-serif)" }}
                        >
                          {position.pnl >= 0 ? "+" : ""}${position.pnl.toFixed(2)}
                        </div>
                        <div
                          className="text-[13px] mt-1"
                          style={{ color: pnlColor(position.pnl), opacity: 0.6, fontFamily: "var(--font-space-grotesk)" }}
                        >
                          {position.pnlPercent >= 0 ? "+" : ""}{position.pnlPercent.toFixed(1)}%
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedPosition === position.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-4 h-4" style={{ color: "rgba(255,255,255,0.2)" }} />
                      </motion.div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedPosition === position.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="mt-7 pt-7 grid gap-8 md:grid-cols-2" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                          <div>
                            <div className="flex justify-between items-center py-2">
                              <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-space-grotesk)" }}>Receipt ID</span>
                              <div className="flex items-center gap-2">
                                <code className="text-[13px]" style={{ color: "rgba(16,185,129,0.8)" }}>{position.receiptId}</code>
                                <button
                                  onClick={() => handleCopyReceipt(position.receiptId)}
                                  className="p-1 rounded-md transition-all hover:bg-white/5"
                                  style={{ color: "rgba(16,185,129,0.6)" }}
                                >
                                  {copiedReceipt === position.receiptId ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                </button>
                              </div>
                            </div>
                            <DetailRow label="Entry Date" value={position.entryDate} />
                            <DetailRow label="Days Held" value={`${position.daysHeld} days`} />
                            <DetailRow label="Break Even" value={`${position.breakEven.toFixed(2)}¢`} />
                            <DetailRow label="Fees Paid" value={`$${position.fees.toFixed(2)}`} />
                          </div>
                          <div>
                            <DetailRow label="Market Volume" value={position.marketVolume} />
                            <DetailRow label="Total Shares" value={position.totalShares.toLocaleString()} />
                            <DetailRow label="Your Ownership" value={position.yourOwnership} />
                            <DetailRow label="Last Update" value={position.lastUpdate} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* ─── 03 / Trading History ─── */}
        <ScrollReveal delay={0.1}>
          <SectionLabel number="03" label="Trading History" />
        </ScrollReveal>

        <div className="space-y-4 pb-32">
          {history.map((trade, i) => (
            <ScrollReveal key={trade.id} delay={0.05 * i}>
              <motion.div
                layout
                className="rounded-[20px] cursor-pointer relative overflow-hidden group"
                style={{
                  background: "rgba(255,255,255,0.015)",
                  border: `1px solid ${expandedTrade === trade.id ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)"}`,
                  boxShadow: expandedTrade === trade.id ? "0 0 60px rgba(16,185,129,0.06)" : "none",
                }}
                onClick={() => setExpandedTrade(expandedTrade === trade.id ? null : trade.id)}
                whileHover={{ borderColor: "rgba(16,185,129,0.1)" }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.03), transparent 60%)" }}
                />

                <div
                  className="absolute left-0 top-0 bottom-0 w-[2px]"
                  style={{ background: trade.type === "Buy" ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)" }}
                />

                <div className="relative z-10 p-7 md:p-8">
                  <div className="flex items-start justify-between gap-8">
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-[1.15rem] font-normal mb-3 leading-snug"
                        style={{ color: "rgba(255,255,255,0.88)", fontFamily: "var(--font-figtree)" }}
                      >
                        {trade.question}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        <span
                          className="text-[12px] px-2.5 py-0.5 rounded-full"
                          style={{
                            background: trade.type === "Buy" ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
                            color: trade.type === "Buy" ? "rgba(16,185,129,0.8)" : "rgba(239,68,68,0.8)",
                            fontFamily: "var(--font-space-grotesk)",
                          }}
                        >
                          {trade.type}
                        </span>
                        <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-space-grotesk)" }}>
                          {trade.outcome}
                        </span>
                        <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-space-grotesk)" }}>
                          {trade.shares} shares @ {trade.price.toFixed(2)}¢
                        </span>
                        <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.15)", fontFamily: "var(--font-space-grotesk)" }}>
                          {trade.date}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-5 shrink-0">
                      {trade.pnl > 0 && (
                        <div
                          className="text-[1.5rem] font-light"
                          style={{ color: emerald, fontFamily: "var(--font-instrument-serif)" }}
                        >
                          +${trade.pnl.toFixed(2)}
                        </div>
                      )}
                      <motion.div
                        animate={{ rotate: expandedTrade === trade.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-4 h-4" style={{ color: "rgba(255,255,255,0.2)" }} />
                      </motion.div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedTrade === trade.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="mt-7 pt-7 grid gap-8 md:grid-cols-2" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                          <div>
                            <div className="flex justify-between items-center py-2">
                              <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-space-grotesk)" }}>Receipt ID</span>
                              <div className="flex items-center gap-2">
                                <code className="text-[13px]" style={{ color: "rgba(16,185,129,0.8)" }}>{trade.receiptId}</code>
                                <button
                                  onClick={() => handleCopyReceipt(trade.receiptId)}
                                  className="p-1 rounded-md transition-all hover:bg-white/5"
                                  style={{ color: "rgba(16,185,129,0.6)" }}
                                >
                                  {copiedReceipt === trade.receiptId ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                </button>
                              </div>
                            </div>
                            <DetailRow label="Transaction Time" value={trade.time} />
                            <DetailRow label="Entry Price" value={`${trade.entryPrice.toFixed(2)}¢`} />
                            {trade.exitPrice && <DetailRow label="Exit Price" value={`${trade.exitPrice.toFixed(2)}¢`} />}
                            <DetailRow label="Holding Period" value={trade.holdingPeriod} />
                          </div>
                          <div>
                            <DetailRow label="Fees" value={`$${trade.fees.toFixed(2)}`} />
                            <div className="flex justify-between items-center py-2">
                              <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-space-grotesk)" }}>Net P&L</span>
                              <span className="text-[13px]" style={{ color: pnlColor(trade.netPnl), fontFamily: "var(--font-figtree)" }}>
                                {trade.netPnl >= 0 ? "+" : ""}${trade.netPnl.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-space-grotesk)" }}>ROI</span>
                              <span className="text-[13px]" style={{ color: pnlColor(trade.roi), fontFamily: "var(--font-figtree)" }}>
                                {trade.roi >= 0 ? "+" : ""}{trade.roi.toFixed(1)}%
                              </span>
                            </div>
                            <DetailRow label="Transaction Hash" value={trade.transactionHash} accent />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* ─── Fixed Footer ─── */}
      <footer
        className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl"
        style={{ background: "rgba(6,6,6,0.85)", borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="mx-auto max-w-6xl px-8 h-12 flex items-center justify-between">
          <span className="text-[11px] tracking-[0.15em] uppercase" style={{ color: "rgba(255,255,255,0.15)", fontFamily: "var(--font-space-grotesk)" }}>
            Veil
          </span>
          <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.1)", fontFamily: "var(--font-space-grotesk)" }}>
            {positions.length} active positions · ${totalValue.toFixed(2)} total value
          </span>
        </div>
      </footer>
    </div>
  )
}
