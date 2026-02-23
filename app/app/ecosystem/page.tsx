"use client"

import Link from "next/link"
import { useEffect, useState, useRef, useCallback } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"

import { formatUsdCompact, type PortalStatusResponse } from "@/lib/portal-status"
import { GeoIcon } from "@/components/geo-3d-icons"
import { getCtaState, getLaunchStatus } from "@/app/lib/surface-translation-registry"

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

type PortalLink = {
  name: string
  href: string
  description: string
  status: "live" | "linked" | "ops"
}

type PortalGroup = {
  title: string
  subtitle: string
  portals: PortalLink[]
}

/* ═══════════════════════════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════════════════════════ */

function ScrollReveal({
  children, className = "", delay = 0,
}: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 1, delay, ease: [0.25, 0.46, 0.45, 0.94] }}>
      {children}
    </motion.div>
  )
}

function FilmGrain() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" style={{
      opacity: 0.035, mixBlendMode: "overlay",
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat", backgroundSize: "128px 128px",
    }} />
  )
}

function SectionLabel({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span style={{
        fontSize: "9px", letterSpacing: "0.4em", color: "rgba(16,185,129,0.4)",
        fontFamily: "var(--font-space-grotesk)", fontWeight: 600,
      }}>{number}</span>
      <span style={{ width: "20px", height: "1px", background: "rgba(16,185,129,0.15)" }} />
      <span style={{
        fontSize: "8px", letterSpacing: "0.4em", color: "rgba(255,255,255,0.2)",
        fontFamily: "var(--font-space-grotesk)", textTransform: "uppercase",
      }}>{text}</span>
    </div>
  )
}

function Divider({ variant = "default" }: { variant?: "default" | "emerald" }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const width = variant === "emerald" ? "w-40" : "w-24"
  const bg = variant === "emerald"
    ? "linear-gradient(90deg, transparent, rgba(16,185,129,0.25), transparent)"
    : "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)"
  return (
    <motion.div ref={ref} className={`mx-auto h-px ${width} my-6`}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={inView ? { scaleX: 1, opacity: 1 } : {}}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      style={{ background: bg }}
    />
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   STATUS PILL
   ═══════════════════════════════════════════════════════════════════════════ */

function StatusPill({ status }: { status: PortalLink["status"] }) {
  const styles: Record<string, { bg: string; border: string; color: string; dot: string }> = {
    live: {
      bg: "rgba(16,185,129,0.06)",
      border: "rgba(16,185,129,0.18)",
      color: "rgba(16,185,129,0.8)",
      dot: "rgba(16,185,129,0.6)",
    },
    ops: {
      bg: "rgba(251,191,36,0.06)",
      border: "rgba(251,191,36,0.18)",
      color: "rgba(251,191,36,0.75)",
      dot: "rgba(251,191,36,0.5)",
    },
    linked: {
      bg: "rgba(255,255,255,0.02)",
      border: "rgba(255,255,255,0.06)",
      color: "rgba(255,255,255,0.4)",
      dot: "rgba(255,255,255,0.2)",
    },
  }
  const s = styles[status]
  return (
    <span className="flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{
      background: s.bg, border: `1px solid ${s.border}`,
      fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase",
      fontFamily: "var(--font-space-grotesk)", fontWeight: 500, color: s.color,
    }}>
      {status === "live" && (
        <motion.span className="w-1.5 h-1.5 rounded-full"
          style={{ background: s.dot }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      {status !== "live" && <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />}
      {status}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   PORTAL CARD
   ═══════════════════════════════════════════════════════════════════════════ */

function PortalCard({ portal, delay = 0 }: { portal: PortalLink; delay?: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  return (
    <ScrollReveal delay={delay}>
      <Link href={portal.href} className="block h-full">
        <motion.div ref={cardRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onMouseMove={handleMouse}
          className="relative rounded-[20px] p-[1px] h-full overflow-hidden group"
          style={{
            background: hovered
              ? `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16,185,129,0.12), transparent 40%)`
              : "rgba(255,255,255,0.04)",
            transition: "background 0.3s ease",
          }}>
          <div className="relative rounded-[19px] bg-[#0a0a0a] px-6 py-5 h-full flex flex-col overflow-hidden"
            style={{
              boxShadow: hovered
                ? "inset 0 1px 0 rgba(16,185,129,0.06), 0 8px 40px rgba(0,0,0,0.3)"
                : "inset 0 1px 0 rgba(255,255,255,0.02)",
              transition: "box-shadow 0.7s ease",
            }}>
            {/* 3D Geometric Icon */}
            <div className="mb-4">
              <GeoIcon name={portal.name} />
            </div>

            <div className="flex items-center justify-between gap-3 mb-3">
              <h4 className="text-[15px] transition-colors duration-700 group-hover:text-emerald-400/90"
                style={{
                  fontFamily: "var(--font-space-grotesk)", fontWeight: 500,
                  color: "rgba(255,255,255,0.88)",
                }}>
                {portal.name}
              </h4>
              <StatusPill status={portal.status} />
            </div>
            <p className="flex-1 mb-3" style={{
              fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.35)",
              fontSize: "0.875rem", lineHeight: 1.7, fontWeight: 300,
            }}>{portal.description}</p>
            <p className="text-[11px] tracking-wide transition-colors duration-700 group-hover:text-emerald-400/60"
              style={{
                fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.3)",
              }}>{portal.href}</p>

            {/* Ambient glow on hover */}
            <div className="absolute pointer-events-none inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background: `radial-gradient(200px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16,185,129,0.03), transparent 50%)`,
              }}
            />
          </div>
        </motion.div>
      </Link>
    </ScrollReveal>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   STAT CARD
   ═══════════════════════════════════════════════════════════════════════════ */

function StatCard({ label, value, sub, delay = 0 }: {
  label: string; value: string; sub: string; delay?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [hovered, setHovered] = useState(false)

  return (
    <ScrollReveal delay={delay}>
      <motion.div ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="rounded-[20px] p-[1px] group"
        style={{
          background: hovered ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.04)",
          transition: "background 0.7s ease",
        }}>
        <div className="rounded-[19px] bg-[#0a0a0a] p-6 relative overflow-hidden"
          style={{
            boxShadow: hovered
              ? "inset 0 1px 0 rgba(16,185,129,0.06), 0 4px 30px rgba(0,0,0,0.2)"
              : "inset 0 1px 0 rgba(255,255,255,0.02)",
            transition: "box-shadow 0.7s ease",
          }}>
          <p className="text-[9px] tracking-[0.35em] uppercase mb-4" style={{
            fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.25)", fontWeight: 600,
          }}>{label}</p>
          <motion.p className="text-3xl md:text-4xl mb-2 tracking-tight"
            style={{
              fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.92)",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: delay + 0.2, ease: [0.22, 1, 0.36, 1] }}>
            {value}
          </motion.p>
          <p style={{
            fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.2)",
            fontSize: "0.8rem", fontWeight: 300,
          }}>{sub}</p>
        </div>
      </motion.div>
    </ScrollReveal>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export default function EcosystemPage() {
  const [status, setStatus] = useState<PortalStatusResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    let cancelled = false
    const loadStatus = async () => {
      try {
        const response = await fetch("/api/portal-status", { cache: "no-store" })
        if (!response.ok) throw new Error("portal-status unavailable")
        const payload = (await response.json()) as PortalStatusResponse
        if (!cancelled) setStatus(payload)
      } catch {
        if (!cancelled) setStatus(null)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    void loadStatus()
    return () => { cancelled = true }
  }, [])

  // Derive portal statuses from registry CTA states
  const ctaToPortal = (featureId: string, fallback: "live" | "linked" | "ops" = "ops"): "live" | "linked" | "ops" => {
    const cta = getCtaState(featureId)
    if (cta === "enabled") return "live"
    if (cta === "docs_only" || cta === "waitlist") return "linked"
    if (cta === "disabled" || cta === "hidden") return "ops"
    return fallback
  }
  const launch = getLaunchStatus()
  const launchGo = launch.decision === "GO FOR PRODUCTION"

  const groups: PortalGroup[] = [
    {
      title: "Core Trading",
      subtitle: "Indexed market and status surfaces.",
      portals: [
        { name: "Markets", href: "/app/markets", description: "Primary prediction market trading interface.", status: status?.flags.liveMarketsAvailable && launchGo ? "live" : "ops" },
        { name: "Market Detail", href: status?.markets.topMarkets[0] ? `/app/market/${status.markets.topMarkets[0].id}` : "/app", description: "Orderbook and trading panel for individual markets.", status: status?.flags.liveMarketsAvailable && launchGo ? "live" : "ops" },
        { name: "Insights", href: "/app/insights", description: "Research and strategy dashboards.", status: ctaToPortal("developer_sdk_docs", "linked") },
      ],
    },
    {
      title: "DeFi + Liquidity",
      subtitle: "Readiness, docs, and portfolio surfaces.",
      portals: [
        { name: "DeFi Preview", href: "/app/defi", description: "Gated execution lane; docs and readiness only.", status: ctaToPortal("companion_evm_rails") },
        { name: "Portfolio", href: "/app/portfolio", description: "Account positions and risk exposure.", status: "linked" },
        { name: "Rewards", href: "/app/rewards", description: "Reward tracking and operator incentives.", status: "linked" },
        { name: "Leaderboard", href: "/app/leaderboard", description: "Top performers and activity rankings.", status: "linked" },
      ],
    },
    {
      title: "Governance + Trust",
      subtitle: "Protocol controls, documentation, and policy routes.",
      portals: [
        { name: "Governance", href: "/app/gov", description: "Governance proposals and voting surfaces.", status: ctaToPortal("governance_validator_ops", "linked") },
        { name: "Transparency", href: "/app/transparency", description: "Operational transparency and reporting.", status: "linked" },
        { name: "Documentation", href: "/app/docs", description: "Technical docs and economic framework.", status: ctaToPortal("developer_sdk_docs", "linked") },
        { name: "API Docs", href: "/app/api-docs", description: "Developer integration endpoints.", status: ctaToPortal("developer_sdk_docs", "linked") },
      ],
    },
    {
      title: "Audit + Operations",
      subtitle: "Launch-readiness and audit evidence portals.",
      portals: [
        { name: "MAIEV Home", href: "/maiev", description: "Evidence archive entrypoint.", status: ctaToPortal("launch_gate_status", "linked") },
        { name: "Evidence Closure", href: "/maiev/audit-closure/index.html", description: "Full contract diagnostics and artifacts.", status: status?.prelaunch.available ? "linked" : "ops" },
        { name: "VM Privacy Evidence", href: "/maiev/vm-privacy-audit/latest-report.html", description: "VM privacy validation run.", status: ctaToPortal("proof_gated_consensus", "ops") },
      ],
    },
  ]

  return (
    <div className="relative min-h-screen" style={{ background: "#060606", color: "white", overflowX: "hidden" }}>
      <FilmGrain />

      {/* Scroll progress */}
      <motion.div className="fixed top-0 left-0 right-0 h-[1px] z-[100] origin-left"
        style={{
          scaleX: scrollYProgress,
          background: "linear-gradient(90deg, rgba(16,185,129,0.3), rgba(16,185,129,0.6), rgba(16,185,129,0.3))",
          boxShadow: "0 0 8px rgba(16,185,129,0.3)",
        }}
      />

      {/* ─── FIXED NAV ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 flex items-center justify-between"
        style={{ background: "linear-gradient(180deg, rgba(6,6,6,0.95) 0%, rgba(6,6,6,0.7) 60%, transparent 100%)", backdropFilter: "blur(12px)" }}>
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-6 h-6 relative">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path d="M12 22L2 4H22L12 22Z" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5"
                className="group-hover:stroke-emerald-400/60 transition-all duration-700" />
            </svg>
          </div>
          <span style={{
            fontSize: "13px", letterSpacing: "0.25em", color: "rgba(255,255,255,0.5)",
            fontFamily: "var(--font-space-grotesk)", fontWeight: 600,
          }} className="group-hover:text-white/70 transition-colors duration-700">VEIL</span>
        </Link>
        <div className="flex items-center gap-6">
          {[
            { label: "Markets", href: "/app/markets" },
            { label: "DeFi", href: "/app/defi" },
            { label: "Docs", href: "/app/docs" },
            { label: "MAIEV", href: "/maiev" },
          ].map(link => (
            <Link key={link.label} href={link.href}
              className="hidden md:block text-xs tracking-[0.15em] uppercase transition-colors duration-700 hover:text-emerald-400/70"
              style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.3)" }}>
              {link.label}
            </Link>
          ))}
          <Link href="/app"
            className="px-5 py-2 rounded-full text-xs tracking-wider transition-all duration-700 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]"
            style={{
              fontFamily: "var(--font-space-grotesk)", fontWeight: 500,
              background: "rgba(16,185,129,0.08)", color: "rgba(16,185,129,0.7)",
              border: "1px solid rgba(16,185,129,0.15)",
            }}>
            Launch App
          </Link>
        </div>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative pt-40 pb-24 md:pt-52 md:pb-32 px-6">
        {/* Subtle radial glow behind hero */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 20%, rgba(16,185,129,0.04), transparent 70%)",
        }} />

        <div className="relative z-10 max-w-7xl mx-auto">
          <ScrollReveal>
            <SectionLabel number="00" text="Ecosystem" />
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl mb-6 max-w-4xl" style={{
              fontFamily: "var(--font-instrument-serif)", lineHeight: 1.0,
              color: "rgba(255,255,255,0.95)",
            }}>
              Portal{" "}
              <span style={{
                color: "transparent",
                WebkitTextStroke: "1.5px rgba(16,185,129,0.4)",
                textShadow: "0 0 60px rgba(16,185,129,0.1)",
              }}>Directory</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="max-w-2xl mb-16" style={{
              fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.35)",
              fontSize: "1.05rem", lineHeight: 1.8, fontWeight: 300,
            }}>
              Unified access to markets, governance, docs, and MAIEV evidence surfaces.
              Launch authority is GO FOR PRODUCTION; some routes remain preview/docs-only while operator rollout
              policy is staged.
            </p>
          </ScrollReveal>

          {/* ─── STATS ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              label="Active Markets"
              value={isLoading ? "..." : String(status?.markets.active ?? 0)}
              sub="indexed markets"
              delay={0.15}
            />
            <StatCard
              label="24h Volume"
              value={isLoading ? "..." : formatUsdCompact(status?.markets.totalVolume24hUsd || 0)}
              sub="aggregated indexed volume"
              delay={0.2}
            />
            <StatCard
              label="Bridge Readiness"
              value={status?.flags.bridgeReady ? "PASS" : "ATTN"}
              sub="interop readiness snapshot"
              delay={0.25}
            />
            <StatCard
              label="Prelaunch Gates"
              value={isLoading ? "..." : String(status?.prelaunch.failingGateCount ?? 0)}
              sub="unresolved in latest bundle"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      <Divider variant="emerald" />

      {/* ═══════════ PORTAL GROUPS ═══════════ */}
      <div className="relative z-10">
        {groups.map((group, gi) => (
          <section key={group.title} className="px-6 py-20 md:py-28">
            <div className="max-w-7xl mx-auto">
              <ScrollReveal>
                <SectionLabel number={String(gi + 1).padStart(2, "0")} text={group.title} />
              </ScrollReveal>

              <ScrollReveal delay={0.05}>
                <h2 className="text-4xl md:text-5xl mb-4 max-w-3xl" style={{
                  fontFamily: "var(--font-instrument-serif)", lineHeight: 1.1,
                  color: "rgba(255,255,255,0.92)",
                }}>
                  {group.title}<span style={{ color: "rgba(255,255,255,0.12)" }}>.</span>
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={0.08}>
                <p className="mb-12 max-w-xl" style={{
                  fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.3)",
                  fontSize: "0.95rem", lineHeight: 1.7, fontWeight: 300,
                }}>{group.subtitle}</p>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {group.portals.map((portal, pi) => (
                  <PortalCard
                    key={`${group.title}-${portal.name}`}
                    portal={portal}
                    delay={0.1 + pi * 0.05}
                  />
                ))}
              </div>
            </div>

            {gi < groups.length - 1 && <div className="mt-20 md:mt-28"><Divider /></div>}
          </section>
        ))}
      </div>

      <Divider variant="emerald" />

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="relative z-10 px-6 py-20 md:py-28">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
            <div>
              <ScrollReveal>
                <div className="flex items-center gap-3 mb-6">
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                    <path d="M12 22L2 4H22L12 22Z" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" />
                  </svg>
                  <span style={{
                    fontSize: "12px", letterSpacing: "0.3em", color: "rgba(255,255,255,0.25)",
                    fontFamily: "var(--font-space-grotesk)", fontWeight: 600,
                  }}>VEIL PROTOCOL</span>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.05}>
                <p style={{
                  fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.2)",
                  fontSize: "0.85rem", lineHeight: 1.7, fontWeight: 300, maxWidth: "360px",
                }}>
                  Sovereign agent infrastructure on Avalanche L1.
                  No users. Only developers and the agents they deploy.
                </p>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.1}>
              <div className="flex flex-wrap gap-6">
                {[
                  { label: "Markets", href: "/app/markets" },
                  { label: "DeFi", href: "/app/defi" },
                  { label: "Governance", href: "/app/gov" },
                  { label: "Docs", href: "/app/docs" },
                  { label: "MAIEV", href: "/maiev" },
                  { label: "Explore VEIL", href: "/" },
                ].map(link => (
                  <Link key={link.label} href={link.href}
                    className="text-xs tracking-[0.12em] uppercase transition-colors duration-700 hover:text-emerald-400/60"
                    style={{
                      fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.2)",
                    }}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </ScrollReveal>
          </div>

          <motion.div className="h-px mt-12 mb-6"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)" }}
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p style={{
              fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.12)",
              fontSize: "0.75rem", fontWeight: 300,
            }}>
              © 2026 VEIL · TSL — No users. Only developers.
            </p>
            <p style={{
              fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.2)",
              fontSize: "0.65rem", letterSpacing: "0.2em",
            }}>
              CHAIN ID 22207
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
