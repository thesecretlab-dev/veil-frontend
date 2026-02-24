"use client"

import { VeilFooter, VeilHeader } from '@/components/brand'

import React, { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { AppShaderBackground } from "@/components/app-shader-background"
import { TriangleLogo } from "@/components/triangle-logo"

// ─── Types ───────────────────────────────────────────────────────────────────

type CalloutType = "info" | "warning" | "tip"

interface Section {
  id: string
  label: string
  children?: { id: string; label: string }[]
}

// ─── Section Data ────────────────────────────────────────────────────────────

const SECTIONS: Section[] = [
  { id: "introduction", label: "Introduction" },
  {
    id: "how-cds-work",
    label: "How CDs Work",
    children: [
      { id: "auction-overview", label: "Auction & Price Discovery" },
      { id: "exit-options", label: "Three Exit Options" },
    ],
  },
  {
    id: "key-components",
    label: "Key Components",
    children: [
      { id: "receipt-tokens", label: "Receipt Tokens" },
      { id: "cd-positions", label: "CD Positions" },
      { id: "deposit-manager", label: "DepositManager" },
      { id: "deposit-periods", label: "Deposit Periods" },
      { id: "supported-assets", label: "Supported Assets" },
    ],
  },
  {
    id: "auction-mechanism",
    label: "Auction Mechanism",
    children: [
      { id: "tick-system", label: "Tick System" },
      { id: "bid-processing", label: "Bid Processing" },
      { id: "dynamic-pricing", label: "Dynamic Pricing" },
      { id: "daily-targets", label: "Daily Targets" },
      { id: "min-price", label: "Minimum Price Protection" },
      { id: "making-deposit", label: "Making a Deposit" },
    ],
  },
  {
    id: "managing-position",
    label: "Managing Your Position",
    children: [
      { id: "convert-to-veil", label: "Converting to VEIL" },
      { id: "early-reclaim", label: "Early Reclaim" },
      { id: "full-redemption", label: "Full Redemption" },
      { id: "borrowing", label: "Borrowing Against Redemptions" },
    ],
  },
  {
    id: "limit-orders",
    label: "Limit Orders",
    children: [
      { id: "lo-overview", label: "Overview" },
      { id: "lo-creating", label: "Creating & Filling" },
      { id: "lo-benefits", label: "Benefits" },
    ],
  },
  {
    id: "practical-guidance",
    label: "Practical Guidance",
    children: [
      { id: "strategy-matrix", label: "Strategy Matrix" },
      { id: "risk-management", label: "Risk Management" },
      { id: "common-mistakes", label: "Common Mistakes" },
    ],
  },
  {
    id: "technical-faq",
    label: "Technical Details & FAQ",
    children: [
      { id: "fee-structures", label: "Fee Structures" },
      { id: "config-params", label: "Configuration" },
      { id: "faq", label: "FAQ" },
    ],
  },
  {
    id: "adding-assets",
    label: "Adding New Assets",
    children: [
      { id: "asset-evaluation", label: "Evaluation" },
      { id: "governance-process", label: "Governance Process" },
    ],
  },
]

// ─── Utility Components ──────────────────────────────────────────────────────

function CalloutBox({
  type,
  title,
  children,
}: {
  type: CalloutType
  title?: string
  children: React.ReactNode
}) {
  const styles: Record<CalloutType, { border: string; bg: string; icon: string; iconColor: string }> = {
    info: {
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/5",
      icon: "ℹ️",
      iconColor: "text-emerald-400",
    },
    warning: {
      border: "border-amber-500/30",
      bg: "bg-amber-500/5",
      icon: "⚠️",
      iconColor: "text-amber-400",
    },
    tip: {
      border: "border-sky-500/30",
      bg: "bg-sky-500/5",
      icon: "💡",
      iconColor: "text-sky-400",
    },
  }
  const s = styles[type]
  return (
    <div className={`my-6 rounded-lg border ${s.border} ${s.bg} p-5`}>
      {title && (
        <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${s.iconColor}`}>
          <span>{s.icon}</span>
          {title}
        </div>
      )}
      <div className="text-sm leading-relaxed text-white/60">{children}</div>
    </div>
  )
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-white/10 px-1.5 py-0.5 text-[0.85em] text-emerald-300 font-mono">
      {children}
    </code>
  )
}

function FAQAccordion({ items }: { items: { q: string; a: React.ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-white/10 bg-white/[0.02]">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            {item.q}
            <motion.span
              animate={{ rotate: open === i ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="ml-4 text-white/40"
            >
              ▾
            </motion.span>
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="border-t border-white/5 px-5 py-4 text-sm leading-relaxed text-white/55">
                  {item.a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

function ParamTable({ rows }: { rows: [string, string, string][] }) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.03]">
            <th className="px-4 py-3 text-left font-medium text-white/70">Parameter</th>
            <th className="px-4 py-3 text-left font-medium text-white/70">Value</th>
            <th className="px-4 py-3 text-left font-medium text-white/70">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([p, v, d], i) => (
            <tr key={i} className="border-b border-white/5 last:border-0">
              <td className="px-4 py-3 font-mono text-emerald-300/80 text-xs">{p}</td>
              <td className="px-4 py-3 text-white/60">{v}</td>
              <td className="px-4 py-3 text-white/50">{d}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StrategyMatrix() {
  const strategies = [
    {
      profile: "Long-term VEIL Bull",
      action: "Convert to VEIL",
      period: "3-month",
      risk: "Medium",
      reward: "High",
      color: "emerald",
    },
    {
      profile: "Stable Yield Seeker",
      action: "Full Redemption",
      period: "1-month",
      risk: "Low",
      reward: "Medium",
      color: "sky",
    },
    {
      profile: "Quick Flip",
      action: "Early Reclaim",
      period: "1-month",
      risk: "Low",
      reward: "Low",
      color: "amber",
    },
    {
      profile: "DeFi Maximizer",
      action: "Borrow Against Redemption",
      period: "3-month",
      risk: "Medium-High",
      reward: "High",
      color: "purple",
    },
    {
      profile: "Market Neutral",
      action: "Limit Order + Redemption",
      period: "Any",
      risk: "Low-Medium",
      reward: "Medium",
      color: "sky",
    },
    {
      profile: "Protocol Aligned",
      action: "Convert + Stake",
      period: "6-month",
      risk: "Medium",
      reward: "Very High",
      color: "emerald",
    },
  ]

  const colorMap: Record<string, string> = {
    emerald: "border-emerald-500/30 bg-emerald-500/5",
    sky: "border-sky-500/30 bg-sky-500/5",
    amber: "border-amber-500/30 bg-amber-500/5",
    purple: "border-purple-500/30 bg-purple-500/5",
  }

  return (
    <div className="my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {strategies.map((s, i) => (
        <div key={i} className={`rounded-lg border p-4 ${colorMap[s.color]}`}>
          <div className="mb-2 text-sm font-semibold text-white/80">{s.profile}</div>
          <div className="space-y-1 text-xs text-white/50">
            <div>
              <span className="text-white/40">Action:</span>{" "}
              <span className="text-white/70">{s.action}</span>
            </div>
            <div>
              <span className="text-white/40">Period:</span>{" "}
              <span className="text-white/70">{s.period}</span>
            </div>
            <div>
              <span className="text-white/40">Risk:</span>{" "}
              <span className="text-white/70">{s.risk}</span>
            </div>
            <div>
              <span className="text-white/40">Reward:</span>{" "}
              <span className="text-white/70">{s.reward}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function TickDiagram() {
  return (
    <svg viewBox="0 0 600 200" className="my-6 w-full" fill="none">
      {/* axis */}
      <line x1="50" y1="160" x2="560" y2="160" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <line x1="50" y1="30" x2="50" y2="160" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      {/* labels */}
      <text x="300" y="190" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11">
        Tick Price (increasing →)
      </text>
      <text x="15" y="95" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11" transform="rotate(-90,15,95)">
        Deposit Volume
      </text>
      {/* bars */}
      {[
        { x: 80, h: 20, label: "$8.50" },
        { x: 130, h: 35, label: "$8.75" },
        { x: 180, h: 55, label: "$9.00" },
        { x: 230, h: 90, label: "$9.25" },
        { x: 280, h: 120, label: "$9.50" },
        { x: 330, h: 80, label: "$9.75" },
        { x: 380, h: 45, label: "$10.00" },
        { x: 430, h: 25, label: "$10.25" },
        { x: 480, h: 10, label: "$10.50" },
      ].map((bar, i) => (
        <g key={i}>
          <rect
            x={bar.x}
            y={160 - bar.h}
            width="35"
            height={bar.h}
            fill={i === 4 ? "rgba(16,185,129,0.5)" : "rgba(16,185,129,0.15)"}
            stroke={i === 4 ? "rgba(16,185,129,0.8)" : "rgba(16,185,129,0.3)"}
            strokeWidth="1"
            rx="2"
          />
          <text
            x={bar.x + 17}
            y="175"
            textAnchor="middle"
            fill="rgba(255,255,255,0.35)"
            fontSize="8"
          >
            {bar.label}
          </text>
        </g>
      ))}
      {/* clearing price arrow */}
      <line x1="297" y1="25" x2="297" y2="38" stroke="rgb(16,185,129)" strokeWidth="2" markerEnd="url(#arrow)" />
      <text x="297" y="20" textAnchor="middle" fill="rgb(16,185,129)" fontSize="10" fontWeight="bold">
        Clearing Price
      </text>
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="10" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L5,10 L10,0" fill="rgb(16,185,129)" />
        </marker>
      </defs>
    </svg>
  )
}

function FlowDiagram() {
  return (
    <svg viewBox="0 0 640 260" className="my-6 w-full" fill="none">
      {/* Deposit box */}
      <rect x="20" y="100" width="130" height="50" rx="8" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.5)" />
      <text x="85" y="130" textAnchor="middle" fill="white" fontSize="12" opacity="0.8">
        Deposit Asset
      </text>
      {/* Arrow to auction */}
      <line x1="150" y1="125" x2="190" y2="125" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <polygon points="188,120 198,125 188,130" fill="rgba(255,255,255,0.3)" />
      {/* Auction box */}
      <rect x="200" y="90" width="130" height="70" rx="8" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.6)" />
      <text x="265" y="118" textAnchor="middle" fill="white" fontSize="12" opacity="0.9" fontWeight="bold">
        Auction
      </text>
      <text x="265" y="138" textAnchor="middle" fill="white" fontSize="9" opacity="0.5">
        Price Discovery
      </text>
      {/* Three arrows out */}
      {/* Convert */}
      <line x1="330" y1="105" x2="400" y2="50" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
      <polygon points="396,47 404,46 400,55" fill="rgba(16,185,129,0.4)" />
      <rect x="405" y="25" width="140" height="50" rx="8" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.4)" />
      <text x="475" y="48" textAnchor="middle" fill="rgb(16,185,129)" fontSize="11" fontWeight="bold">
        Convert to VEIL
      </text>
      <text x="475" y="63" textAnchor="middle" fill="white" fontSize="9" opacity="0.4">
        At conversion price
      </text>
      {/* Redeem */}
      <line x1="330" y1="125" x2="400" y2="125" stroke="rgba(59,130,246,0.4)" strokeWidth="1.5" />
      <polygon points="398,120 408,125 398,130" fill="rgba(59,130,246,0.4)" />
      <rect x="405" y="100" width="140" height="50" rx="8" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.4)" />
      <text x="475" y="123" textAnchor="middle" fill="rgb(59,130,246)" fontSize="11" fontWeight="bold">
        Full Redemption
      </text>
      <text x="475" y="138" textAnchor="middle" fill="white" fontSize="9" opacity="0.4">
        At maturity, face value
      </text>
      {/* Reclaim */}
      <line x1="330" y1="145" x2="400" y2="200" stroke="rgba(245,158,11,0.4)" strokeWidth="1.5" />
      <polygon points="396,197 404,204 400,195" fill="rgba(245,158,11,0.4)" />
      <rect x="405" y="178" width="140" height="50" rx="8" fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.4)" />
      <text x="475" y="200" textAnchor="middle" fill="rgb(245,158,11)" fontSize="11" fontWeight="bold">
        Early Reclaim
      </text>
      <text x="475" y="215" textAnchor="middle" fill="white" fontSize="9" opacity="0.4">
        Before maturity, minus fee
      </text>
    </svg>
  )
}

// ─── Sidebar Navigation ──────────────────────────────────────────────────────

function SidebarNav({ activeId }: { activeId: string }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navContent = (
    <nav className="space-y-1 text-sm">
      {SECTIONS.map((s) => {
        const isActive = activeId === s.id || s.children?.some((c) => c.id === activeId)
        return (
          <div key={s.id}>
            <a
              href={`#${s.id}`}
              onClick={() => setMobileOpen(false)}
              className={`block rounded px-3 py-1.5 transition-colors ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5"
              }`}
            >
              {s.label}
            </a>
            {s.children && isActive && (
              <div className="ml-3 mt-0.5 space-y-0.5 border-l border-white/10 pl-3">
                {s.children.map((c) => (
                  <a
                    key={c.id}
                    href={`#${c.id}`}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded px-2 py-1 text-xs transition-colors ${
                      activeId === c.id
                        ? "text-emerald-400"
                        : "text-white/30 hover:text-white/60"
                    }`}
                  >
                    {c.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 py-3">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 text-sm text-white/60 hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Navigation
        </button>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pt-3"
            >
              {navContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block sticky top-24 self-start w-56 shrink-0">
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 backdrop-blur-xl max-h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/30">
            On this page
          </div>
          {navContent}
        </div>
      </aside>
    </>
  )
}

// ─── Section Heading ─────────────────────────────────────────────────────────

function SectionH2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="scroll-mt-24 text-2xl font-light mb-6 mt-16 first:mt-0 transition-all duration-500 hover:text-white"
      style={{
        color: "rgba(255,255,255,0.85)",
        textShadow: "0 0 15px rgba(16,185,129,0.25)",
      }}
    >
      {children}
    </h2>
  )
}

function SectionH3({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3
      id={id}
      className="scroll-mt-24 text-lg font-light mb-4 mt-8 text-white/70"
      style={{ textShadow: "0 0 10px rgba(16,185,129,0.15)" }}
    >
      {children}
    </h3>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 leading-relaxed text-white/55 text-sm">{children}</p>
}

function UL({ children }: { children: React.ReactNode }) {
  return <ul className="mb-4 ml-4 list-disc list-inside space-y-2 text-sm text-white/55">{children}</ul>
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ConvertibleDepositsPage() {
  const [activeId, setActiveId] = useState("introduction")
  const mainRef = useRef<HTMLDivElement>(null)

  // Intersection observer for active section tracking
  useEffect(() => {
    const allIds = SECTIONS.flatMap((s) => [s.id, ...(s.children?.map((c) => c.id) ?? [])])
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          // pick topmost
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    )
    allIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative min-h-screen bg-[#0a0a0a]">
      <AppShaderBackground />

      {/* Film grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <header className="relative z-20 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          <Link href="/app" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <TriangleLogo />
            <span className="text-xl font-bold tracking-tight text-white/95" style={{ textShadow: "0 0 30px rgba(16,185,129,0.4)" }}>
              VEIL
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/app/docs" className="text-sm text-white/50 hover:text-white/80 transition-colors">
              ← Docs
            </Link>
            <Link
              href="/app"
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:border-emerald-400/30 hover:bg-white/10 transition-all"
            >
              Back to Markets
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-10">
        <div className="max-w-3xl">
          <div className="mb-4 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
            Protocol Mechanics
          </div>
          <h1
            className="text-4xl md:text-5xl font-light mb-4"
            style={{
              color: "rgba(255,255,255,0.95)",
              textShadow: "0 0 40px rgba(16,185,129,0.3)",
              fontFamily: "var(--font-instrument-serif, serif)",
            }}
          >
            Convertible Deposits
          </h1>
          <p className="text-lg text-white/50 max-w-2xl leading-relaxed">
            A novel mechanism for acquiring VEIL tokens at market-driven prices, with flexible exit options
            and protocol-aligned incentives. Deposit stablecoins, earn yield, and choose your path.
          </p>
        </div>
      </div>

      {/* Main content with sidebar */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <div className="flex gap-10">
          <SidebarNav activeId={activeId} />

          <main ref={mainRef} className="min-w-0 flex-1">
            <div
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 md:p-12 backdrop-blur-xl"
              style={{ boxShadow: "0 0 60px rgba(16,185,129,0.05)" }}
            >
              {/* ─── 1. Introduction ─── */}
              <SectionH2 id="introduction">Introduction</SectionH2>
              <P>
                Convertible Deposits (CDs) are VEIL Protocol&apos;s primary mechanism for growing protocol-owned
                liquidity while offering users flexible, risk-managed exposure to VEIL tokens. Think of them as
                a DeFi bond system where you deposit stablecoins and receive options on how to exit.
              </P>

              <CalloutBox type="info" title="What are Convertible Deposits?">
                CDs let you deposit supported assets (like USDS or USDC) into the VEIL Protocol treasury.
                In return, you receive a receipt token representing your position and a future claim on either
                VEIL tokens (at a discount) or your original deposit (at face value).
              </CalloutBox>

              <P>
                <strong className="text-white/80">Benefits for Users:</strong>
              </P>
              <UL>
                <li>Acquire VEIL at a discount to market price through the auction mechanism</li>
                <li>Three flexible exit options: convert to VEIL, full redemption at maturity, or early reclaim</li>
                <li>Transparent, on-chain price discovery through tick-based auctions</li>
                <li>Receipt tokens are transferable and can be used in DeFi composability</li>
              </UL>

              <P>
                <strong className="text-white/80">Benefits for Protocol:</strong>
              </P>
              <UL>
                <li>Grows protocol-owned liquidity (POL) in a sustainable, market-driven manner</li>
                <li>VEIL is minted only at prices the market deems fair — no arbitrary discounts</li>
                <li>Predictable, scheduled issuance via daily auction targets</li>
                <li>Treasury diversification through stablecoin deposits</li>
              </UL>

              {/* ─── 2. How CDs Work ─── */}
              <SectionH2 id="how-cds-work">How CDs Work</SectionH2>

              <SectionH3 id="auction-overview">Auction & Price Discovery</SectionH3>
              <P>
                CDs use a continuous auction system where depositors bid for VEIL at various price points (called
                &quot;ticks&quot;). The protocol sets a daily target amount of VEIL to issue, and deposits are
                filled from the highest bid price downward until the target is met.
              </P>
              <P>
                This creates genuine price discovery — the market determines what price VEIL is worth, not
                the protocol. If demand is high, prices rise; if low, prices stay near the floor.
              </P>

              <FlowDiagram />

              <SectionH3 id="exit-options">Three Exit Options</SectionH3>
              <P>
                Once your deposit is accepted through the auction, you hold a CD Position with three possible outcomes:
              </P>

              <div className="my-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-5">
                  <div className="mb-2 text-sm font-semibold text-emerald-400">1. Convert to VEIL</div>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Convert your position to VEIL tokens at the auction clearing price.
                    Best if you&apos;re bullish on VEIL and want discounted exposure.
                  </p>
                </div>
                <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-5">
                  <div className="mb-2 text-sm font-semibold text-sky-400">2. Full Redemption</div>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Wait until maturity and redeem your full deposit amount in the original asset.
                    No VEIL price risk — you get back what you put in.
                  </p>
                </div>
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-5">
                  <div className="mb-2 text-sm font-semibold text-amber-400">3. Early Reclaim</div>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Reclaim your deposit before maturity, minus a small early withdrawal fee.
                    Useful if you need liquidity or market conditions change.
                  </p>
                </div>
              </div>

              {/* ─── 3. Key Components ─── */}
              <SectionH2 id="key-components">Key Components</SectionH2>

              <SectionH3 id="receipt-tokens">Receipt Tokens</SectionH3>
              <P>
                When you make a deposit, you receive an ERC-20 receipt token representing your position.
                These tokens follow a naming convention: <Code>cdfUSDC-1m</Code> for a 1-month USDC deposit,{" "}
                <Code>cdfUSDC-3m</Code> for 3-month, <Code>cdfUSDS-6m</Code> for 6-month USDS deposits, etc.
              </P>
              <P>
                Receipt tokens are transferable and composable — they can be traded on secondary markets, used as
                collateral in lending protocols, or held to maturity for redemption.
              </P>

              <SectionH3 id="cd-positions">CD Positions</SectionH3>
              <P>
                A CD Position tracks the details of your deposit: the asset deposited, amount, the tick price
                at which your bid was filled, the deposit period, maturity date, and current status. Each position
                has a unique ID and can be queried on-chain.
              </P>

              <SectionH3 id="deposit-manager">DepositManager</SectionH3>
              <P>
                The <Code>DepositManager</Code> smart contract is the core engine of the CD system. It handles
                deposit acceptance, auction clearing, position management, conversions, redemptions, and reclaims.
                All interactions flow through this contract.
              </P>

              <SectionH3 id="deposit-periods">Deposit Periods</SectionH3>
              <P>
                VEIL Protocol offers multiple deposit periods to suit different strategies:
              </P>
              <ParamTable
                rows={[
                  ["1-month", "30 days", "Shortest lock, lowest potential discount, highest flexibility"],
                  ["3-month", "90 days", "Balanced option, moderate discount, popular among regular depositors"],
                  ["6-month", "180 days", "Longest lock, highest potential discount, best for long-term alignment"],
                ]}
              />

              <SectionH3 id="supported-assets">Supported Assets</SectionH3>
              <P>
                Currently supported deposit assets:
              </P>
              <UL>
                <li><Code>USDS</Code> — Primary stablecoin, deepest auction liquidity</li>
                <li><Code>USDC</Code> — Secondary stablecoin, available on select periods</li>
              </UL>
              <P>
                New assets can be added through the governance process (see <a href="#adding-assets" className="text-emerald-400 hover:underline">Adding New Assets</a>).
              </P>

              {/* ─── 4. Auction Mechanism ─── */}
              <SectionH2 id="auction-mechanism">Auction Mechanism</SectionH2>

              <SectionH3 id="tick-system">Tick System</SectionH3>
              <P>
                The auction uses a tick-based pricing system. Each tick represents a specific VEIL price point
                where depositors can place their bids. Ticks are evenly spaced at configurable intervals
                (e.g., $0.25 increments).
              </P>

              <TickDiagram />

              <P>
                Depositors choose which tick (price) they want to bid at. Lower ticks mean you&apos;re willing
                to pay less per VEIL (bigger discount), but your bid is less likely to be filled. Higher ticks
                give smaller discounts but higher fill probability.
              </P>

              <SectionH3 id="bid-processing">Bid Processing</SectionH3>
              <P>
                Bids are processed in price-priority order — highest bids fill first. When the daily target
                is met, remaining lower bids roll over to the next auction cycle. The clearing price is
                the lowest filled tick.
              </P>

              <SectionH3 id="dynamic-pricing">Dynamic Pricing</SectionH3>
              <P>
                The auction system adjusts dynamically based on demand. When deposit volume exceeds the daily
                target, the minimum acceptable price rises. When volume is low, prices can drift down
                toward the floor. This creates a natural equilibrium between supply and demand.
              </P>

              <CalloutBox type="tip" title="Price Discovery in Action">
                If the current VEIL market price is $10.00 and the auction clearing price is $9.50,
                depositors receive an effective 5% discount. This discount widens or narrows based on
                demand — truly market-driven pricing.
              </CalloutBox>

              <SectionH3 id="daily-targets">Daily Targets</SectionH3>
              <P>
                The protocol sets a daily VEIL issuance target through governance. This target controls
                the rate at which new VEIL enters circulation through CDs. Typical targets range from
                50,000 to 500,000 VEIL per day, adjustable by governance based on market conditions.
              </P>

              <SectionH3 id="min-price">Minimum Price Protection</SectionH3>
              <P>
                A governance-set minimum price prevents VEIL from being issued at extreme discounts. This
                floor is typically set at a percentage of the moving average VEIL price (e.g., 90% of
                the 7-day TWAP). No bids below this floor are accepted.
              </P>

              <CalloutBox type="warning" title="Minimum Price Floor">
                If the minimum price is set to $9.00 and you bid at $8.50, your bid will be rejected.
                Always check the current minimum price before placing deposits.
              </CalloutBox>

              <SectionH3 id="making-deposit">Making a Deposit: Step by Step</SectionH3>
              <div className="my-4 space-y-3">
                {[
                  ["1", "Choose your deposit asset (USDS or USDC) and deposit period (1m, 3m, 6m)"],
                  ["2", "Select a tick price — the VEIL price you're willing to pay"],
                  ["3", "Approve and submit your deposit transaction"],
                  ["4", "Receive your receipt token (e.g., cdfUSDC-3m)"],
                  ["5", "Wait for the auction to clear — your bid fills if it meets the clearing price"],
                  ["6", "Manage your position: convert, redeem, or reclaim"],
                ].map(([n, text]) => (
                  <div key={n} className="flex gap-4 items-start">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                      {n}
                    </div>
                    <p className="text-sm text-white/55 pt-0.5">{text}</p>
                  </div>
                ))}
              </div>

              {/* ─── 5. Managing Position ─── */}
              <SectionH2 id="managing-position">Managing Your Position</SectionH2>

              <SectionH3 id="convert-to-veil">Converting to VEIL</SectionH3>
              <P>
                If you believe VEIL will appreciate, you can convert your CD position to VEIL tokens at the
                auction clearing price. Conversion is available once your deposit has been filled in an auction.
                The VEIL tokens are minted and sent to your wallet immediately upon conversion.
              </P>
              <CalloutBox type="info" title="Conversion Rate">
                If your 1,000 USDS deposit was filled at a clearing price of $9.50, you receive
                approximately 105.26 VEIL tokens (1,000 / 9.50). If VEIL market price is $10.00,
                that&apos;s an immediate 5.26% gain.
              </CalloutBox>

              <SectionH3 id="early-reclaim">Early Reclaim</SectionH3>
              <P>
                Need your funds back before maturity? Early Reclaim lets you withdraw your deposited asset,
                minus a time-proportional fee. The earlier you reclaim, the higher the fee. This protects
                the protocol from deposit/withdraw gaming.
              </P>
              <ParamTable
                rows={[
                  ["Reclaim at 25% of term", "3.75%", "Fee on deposit amount if reclaimed early in the term"],
                  ["Reclaim at 50% of term", "2.50%", "Fee decreases linearly as you approach maturity"],
                  ["Reclaim at 75% of term", "1.25%", "Near maturity, fee is minimal"],
                  ["Reclaim at 100% (maturity)", "0%", "At maturity, use Full Redemption instead (no fee)"],
                ]}
              />

              <SectionH3 id="full-redemption">Full Redemption</SectionH3>
              <P>
                At maturity, you can redeem your full deposit amount in the original asset — no price risk,
                no fees. Simply call the redeem function with your receipt tokens, and you receive your
                deposited stablecoins back 1:1.
              </P>

              <SectionH3 id="borrowing">Borrowing Against Redemptions</SectionH3>
              <P>
                CD receipt tokens approaching maturity can be used as collateral in partner lending protocols.
                Because the redemption value is known and deterministic (face value at maturity), these tokens
                make excellent collateral with high loan-to-value ratios.
              </P>
              <CalloutBox type="tip" title="DeFi Composability">
                A <Code>cdfUSDC-3m</Code> token with 2 weeks to maturity could be used as collateral to
                borrow USDC at near 1:1 LTV — effectively getting your capital back early without paying
                the early reclaim fee.
              </CalloutBox>

              {/* ─── 6. Limit Orders ─── */}
              <SectionH2 id="limit-orders">Limit Orders</SectionH2>

              <SectionH3 id="lo-overview">Overview</SectionH3>
              <P>
                Limit Orders allow you to set a specific tick price at which you want to enter a CD position.
                Instead of actively choosing a tick during each auction, you can set a standing order that
                automatically fills when the clearing price reaches your target.
              </P>

              <SectionH3 id="lo-creating">Creating & Filling Limit Orders</SectionH3>
              <P>
                To create a limit order, specify your asset, amount, desired tick price, and deposit period.
                Your funds are escrowed until the order fills or you cancel. When an auction clears at or
                above your limit price, your order automatically converts into a CD position.
              </P>
              <UL>
                <li>Orders persist across multiple auction cycles until filled or cancelled</li>
                <li>Partial fills are supported — if only part of your order can be filled, the rest remains active</li>
                <li>Cancel anytime to reclaim your escrowed funds with no penalty</li>
              </UL>

              <SectionH3 id="lo-benefits">Benefits</SectionH3>
              <UL>
                <li><strong className="text-white/80">Set and forget</strong> — no need to monitor each auction</li>
                <li><strong className="text-white/80">Better pricing</strong> — patient capital can capture larger discounts</li>
                <li><strong className="text-white/80">No gas on fill</strong> — the auction engine fills your order automatically</li>
                <li><strong className="text-white/80">Cancellable</strong> — full flexibility to update your strategy</li>
              </UL>

              {/* ─── 7. Practical Guidance ─── */}
              <SectionH2 id="practical-guidance">Practical Guidance</SectionH2>

              <SectionH3 id="strategy-matrix">Strategy Matrix</SectionH3>
              <P>
                Choose your approach based on your risk tolerance, time horizon, and market outlook:
              </P>
              <StrategyMatrix />

              <SectionH3 id="risk-management">Risk Management</SectionH3>
              <UL>
                <li>
                  <strong className="text-white/80">VEIL price risk:</strong> If you convert to VEIL and the price drops
                  below your conversion price, you&apos;re underwater. Mitigate by using shorter deposit periods or
                  setting limit orders at conservative ticks.
                </li>
                <li>
                  <strong className="text-white/80">Opportunity cost:</strong> Funds locked in CDs can&apos;t be deployed
                  elsewhere. Consider your alternative yield opportunities before committing.
                </li>
                <li>
                  <strong className="text-white/80">Smart contract risk:</strong> As with all DeFi, smart contract bugs
                  are a risk. The CD contracts are audited and battle-tested, but never deposit more than you can afford.
                </li>
                <li>
                  <strong className="text-white/80">Early reclaim fees:</strong> If you might need liquidity, factor in
                  potential early reclaim fees or plan to use receipt tokens as collateral instead.
                </li>
              </UL>

              <SectionH3 id="common-mistakes">Common Mistakes</SectionH3>
              <CalloutBox type="warning" title="Avoid These Pitfalls">
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>Bidding below the minimum price floor — your transaction will revert</li>
                  <li>Forgetting to convert or redeem at maturity — your position doesn&apos;t auto-convert</li>
                  <li>Choosing too long a deposit period without understanding the commitment</li>
                  <li>Not accounting for early reclaim fees when planning liquidity needs</li>
                  <li>Assuming the auction clearing price will match the current market price</li>
                </ul>
              </CalloutBox>

              {/* ─── 8. Technical Details & FAQ ─── */}
              <SectionH2 id="technical-faq">Technical Details &amp; FAQ</SectionH2>

              <SectionH3 id="fee-structures">Fee Structures</SectionH3>
              <ParamTable
                rows={[
                  ["Deposit Fee", "0%", "No fee to deposit into the auction"],
                  ["Conversion Fee", "0%", "No fee to convert your position to VEIL"],
                  ["Redemption Fee", "0%", "No fee to redeem at maturity"],
                  ["Early Reclaim Fee", "0-5%", "Linear decay based on time remaining to maturity"],
                  ["Limit Order Cancel", "0%", "No fee to cancel unfilled limit orders"],
                ]}
              />

              <SectionH3 id="config-params">Configuration Parameters</SectionH3>
              <ParamTable
                rows={[
                  ["dailyTarget", "100,000 VEIL", "Maximum VEIL issued per day through CDs"],
                  ["minPrice", "90% of 7d TWAP", "Floor price below which bids are rejected"],
                  ["tickSpacing", "$0.25", "Price increment between adjacent ticks"],
                  ["maxReclaimFee", "5%", "Maximum early reclaim fee at start of term"],
                  ["auctionInterval", "24 hours", "Frequency of auction clearing cycles"],
                  ["depositPeriods", "30, 90, 180 days", "Available deposit lock durations"],
                ]}
              />

              <SectionH3 id="faq">Frequently Asked Questions</SectionH3>
              <FAQAccordion
                items={[
                  {
                    q: "What happens if my bid isn't filled?",
                    a: "Unfilled bids roll over to the next auction cycle automatically. Your funds remain escrowed and your bid stays active. You can cancel at any time to reclaim your deposit.",
                  },
                  {
                    q: "Can I convert part of my position and redeem the rest?",
                    a: "No, each CD position must be fully converted, fully redeemed, or fully reclaimed. However, if you make multiple deposits, each position is independent.",
                  },
                  {
                    q: "What determines the clearing price?",
                    a: "The clearing price is the lowest tick price at which the daily VEIL issuance target is met. All bids at or above this price are filled at their respective tick prices.",
                  },
                  {
                    q: "Are receipt tokens transferable?",
                    a: (
                      <>
                        Yes. Receipt tokens like <Code>cdfUSDC-3m</Code> are standard ERC-20 tokens. They can be transferred,
                        traded on DEXs, or used as collateral in lending protocols. The holder of the receipt token
                        has the right to convert, redeem, or reclaim.
                      </>
                    ),
                  },
                  {
                    q: "How is the minimum price calculated?",
                    a: "The minimum price is set by governance, typically as a percentage of the 7-day time-weighted average price (TWAP) of VEIL. This prevents extreme dilution during market downturns.",
                  },
                  {
                    q: "What happens if VEIL price drops below my conversion price?",
                    a: "You're not obligated to convert. If VEIL price drops, you can simply wait until maturity and use Full Redemption to get your stablecoins back at face value. This is the key advantage of CDs over simple spot purchases.",
                  },
                  {
                    q: "Can I increase my deposit in an existing position?",
                    a: "No. Each deposit creates a new, independent position. To increase exposure, make a new deposit at the current auction terms.",
                  },
                  {
                    q: "Where can I get help?",
                    a: (
                      <>
                        Join the <strong className="text-white/80">VEIL Discord</strong> for community support,
                        or reach out to <strong className="text-white/80">@VEILmarkets</strong> on Twitter.
                        Technical documentation is available at{" "}
                        <strong className="text-white/80">docs.veil.markets</strong>.
                      </>
                    ),
                  },
                ]}
              />

              {/* ─── 9. Adding New Assets ─── */}
              <SectionH2 id="adding-assets">Adding New Assets</SectionH2>

              <SectionH3 id="asset-evaluation">Evaluation Criteria</SectionH3>
              <P>
                New assets proposed for CD support are evaluated on the following criteria:
              </P>
              <UL>
                <li><strong className="text-white/80">Stability:</strong> Asset must maintain a stable peg or have low volatility relative to its reference</li>
                <li><strong className="text-white/80">Liquidity:</strong> Sufficient on-chain liquidity to ensure reliable price feeds and redemption</li>
                <li><strong className="text-white/80">Smart contract risk:</strong> Audited, battle-tested contracts with no known vulnerabilities</li>
                <li><strong className="text-white/80">Regulatory compliance:</strong> Clear regulatory status in major jurisdictions</li>
                <li><strong className="text-white/80">Oracle availability:</strong> Reliable price oracle coverage from multiple providers</li>
              </UL>

              <SectionH3 id="governance-process">Governance Process</SectionH3>
              <P>
                Adding a new asset follows the standard VEIL governance flow:
              </P>
              <div className="my-4 space-y-3">
                {[
                  ["1", "Forum proposal with asset evaluation and risk assessment"],
                  ["2", "Community discussion period (minimum 7 days)"],
                  ["3", "Formal on-chain governance vote (VEIL token holders)"],
                  ["4", "If approved: technical implementation, audit, and deployment"],
                  ["5", "Gradual rollout with conservative initial parameters"],
                ].map(([n, text]) => (
                  <div key={n} className="flex gap-4 items-start">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                      {n}
                    </div>
                    <p className="text-sm text-white/55 pt-0.5">{text}</p>
                  </div>
                ))}
              </div>

              <CalloutBox type="info" title="Want to Propose a New Asset?">
                Head to the <strong className="text-white/80">VEIL Governance Forum</strong> and use the
                &quot;New CD Asset Proposal&quot; template. Include your evaluation against each criterion
                above, along with any relevant data or audit reports.
              </CalloutBox>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} VEIL Protocol. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-white/30">
            <Link href="/app/docs" className="hover:text-white/60 transition-colors">Documentation</Link>
            <Link href="/app/gov" className="hover:text-white/60 transition-colors">Governance</Link>
            <a href="https://discord.gg/veil" className="hover:text-white/60 transition-colors">Discord</a>
            <a href="https://twitter.com/VEILmarkets" className="hover:text-white/60 transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
