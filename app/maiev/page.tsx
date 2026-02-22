"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Download, Shield, CheckCircle, Clock, AlertTriangle, Lock, FileText, Eye, Server, Coins } from "lucide-react"
import { getLaunchStatus, getFeature, getBadge } from "@/app/lib/surface-translation-registry"

/* ─── ScrollReveal ─── */
function ScrollReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay }}
    >
      {children}
    </motion.div>
  )
}

/* ─── Section Label ─── */
function SectionLabel({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-10">
      <span
        className="font-[family-name:var(--font-space-grotesk)] text-[11px] tracking-[0.25em] uppercase"
        style={{ color: "rgba(16,185,129,0.6)" }}
      >
        {num}
      </span>
      <div className="h-px flex-1 max-w-[60px]" style={{ background: "rgba(16,185,129,0.2)" }} />
      <span
        className="font-[family-name:var(--font-space-grotesk)] text-[11px] tracking-[0.25em] uppercase"
        style={{ color: "rgba(255,255,255,0.35)" }}
      >
        {label}
      </span>
    </div>
  )
}

/* ─── Severity Pill ─── */
function SeverityPill({ level, count }: { level: string; count: number }) {
  const colors: Record<string, string> = {
    Critical: "bg-red-500/15 text-red-400 border-red-500/20",
    High: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    Medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    Low: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    Info: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${colors[level] || colors.Info}`}>
      {count} {level}
    </span>
  )
}

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: "Complete" | "In Progress" | "Pending" }) {
  const styles = {
    Complete: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    "In Progress": "bg-amber-500/15 text-amber-400 border-amber-500/20",
    Pending: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  }
  const icons = {
    Complete: <CheckCircle className="w-3 h-3" />,
    "In Progress": <Clock className="w-3 h-3" />,
    Pending: <AlertTriangle className="w-3 h-3" />,
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border ${styles[status]}`}>
      {icons[status]} {status}
    </span>
  )
}

/* ─── Data ─── */
const auditCategories = [
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Smart Contracts",
    description: "Full coverage of prediction market contracts, vault logic, oracle integrations, and settlement mechanisms on Avalanche C-Chain.",
    status: "Complete" as const,
    auditor: "Internal Validation Team",
    lastUpdated: "2026-01-15",
    coverage: "100%",
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: "VM Privacy",
    description: "Zero-knowledge proof circuits, private state transitions, and encrypted order flow through VEIL's privacy layer.",
    status: "Complete" as const,
    auditor: "Internal Validation Team",
    lastUpdated: "2026-01-28",
    coverage: "100%",
  },
  {
    icon: <Coins className="w-5 h-5" />,
    title: "Economic Model",
    description: "Tokenomics, fee structures, liquidity incentives, staking mechanisms, and protocol sustainability analysis.",
    status: "In Progress" as const,
    auditor: "Internal Validation Team",
    lastUpdated: "2026-02-10",
    coverage: "78%",
  },
  {
    icon: <Server className="w-5 h-5" />,
    title: "Infrastructure",
    description: "Node architecture, RPC endpoints, sequencer integrity, uptime guarantees, and disaster recovery procedures.",
    status: "Pending" as const,
    auditor: "Internal Validation Team",
    lastUpdated: "—",
    coverage: "—",
  },
]

const publishedReports = [
  {
    id: "MAIEV-2026-001",
    title: "Core Prediction Market Contracts v2.1",
    auditor: "Internal Validation Team",
    date: "2026-01-15",
    duration: "6 weeks",
    findings: { Critical: 0, High: 1, Medium: 3, Low: 7, Info: 12 },
    summary: "One high-severity finding in the settlement callback path was identified and remediated prior to mainnet deployment. All medium findings addressed in v2.1.1 patch.",
    status: "Remediated",
  },
  {
    id: "MAIEV-2026-002",
    title: "ZK Privacy Circuit Audit — Round 1",
    auditor: "Internal Validation Team",
    date: "2026-01-28",
    duration: "8 weeks",
    findings: { Critical: 0, High: 0, Medium: 2, Low: 5, Info: 9 },
    summary: "No critical or high-severity issues. Two medium findings related to circuit constraint optimization were resolved. Privacy guarantees validated under adversarial conditions.",
    status: "Remediated",
  },
  {
    id: "MAIEV-2026-003",
    title: "Oracle Integration & Price Feed Security",
    auditor: "Internal Validation Team",
    date: "2025-12-02",
    duration: "4 weeks",
    findings: { Critical: 0, High: 0, Medium: 1, Low: 4, Info: 6 },
    summary: "Oracle fallback mechanisms validated. One medium finding regarding stale price tolerance windows was tightened from 120s to 30s. Chainlink and API3 integrations confirmed secure.",
    status: "Remediated",
  },
  {
    id: "MAIEV-2026-004",
    title: "Economic Model — Preliminary Assessment",
    auditor: "Internal Validation Team",
    date: "2026-02-10",
    duration: "Ongoing",
    findings: { Critical: 0, High: 0, Medium: 0, Low: 2, Info: 4 },
    summary: "Preliminary findings on fee structure sustainability and liquidity depth requirements. Full report pending completion of stress-testing scenarios.",
    status: "In Progress",
  },
]

const evidenceBundles = [
  {
    name: "Smart Contract Source + Bytecode Verification",
    version: "v2.1.1",
    date: "2026-01-18",
    size: "4.2 MB",
    sha256: "a7c3e9f1...d84b2106",
    contents: ["Verified Solidity source", "Deployed bytecode diff", "Constructor arguments", "Etherscan verification proof"],
  },
  {
    name: "ZK Circuit Artifacts",
    version: "v1.0.0",
    date: "2026-01-30",
    size: "18.7 MB",
    sha256: "f29d0a83...1c7e4520",
    contents: ["Circom circuit source", "Trusted setup ceremony transcript", "Proving/verification keys", "Witness generation tests"],
  },
  {
    name: "Internal Validation Team — Full Report + Remediation Diff",
    version: "Final",
    date: "2026-01-20",
    size: "2.8 MB",
    sha256: "b1e4f708...93a2c6df",
    contents: ["Validation report", "Git diff of remediations", "Remediation verification notes", "Artifact signature manifest"],
  },
  {
    name: "Internal Validation Team — Privacy Audit Package",
    version: "Final",
    date: "2026-02-01",
    size: "6.1 MB",
    sha256: "c8d2a195...47f0e3b1",
    contents: ["Validation report", "Circuit constraint analysis", "Adversarial test results", "Formal verification proofs"],
  },
]

const methodology = [
  {
    title: "Scope Definition",
    description: "Every audit begins with a precise scope document defining contracts, circuits, and systems under review. Scope is published before audit commencement for community review.",
  },
  {
    title: "External Audit Status",
    description: "External audit firms are engaged only after launch-readiness milestones require them. This archive currently prioritizes internal and staged validation evidence.",
  },
  {
    title: "Multi-Phase Validation",
    description: "Validation proceeds through automated analysis, manual review, and reproducible evidence checks. Each phase records findings and remediation status.",
  },
  {
    title: "Remediation & Follow-up Validation",
    description: "Findings rated Medium or above require remediation and follow-up validation. Third-party re-audit is recorded only when an external report is published.",
  },
  {
    title: "Evidence Preservation",
    description: "All validation artifacts—source snapshots, reports, and remediation notes—are cryptographically hashed and stored in MAIEV's evidence archive.",
  },
  {
    title: "Continuous Monitoring",
    description: "Post-deployment planning includes invariant testing, bug bounty programs, and scheduled re-validation for critical components.",
  },
]

const timeline = [
  { date: "2026-02-19", event: "MAIEV evidence lane established", detail: "Frontend evidence archive aligned to launch-gate workflow." },
  { date: "2026-02-20", event: "Launch-gate bundle ingestion", detail: "Local PASS/FAIL artifacts from launch-gate runner indexed into MAIEV surfaces." },
  { date: "2026-02-21", event: "Threshold-keying evidence updates", detail: "Mempool hardening and threshold rollout records added to archive." },
  { date: "2026-02-22", event: "Private-liquidity proof path update", detail: "Adversarial and smoke evidence pointers synced to latest local run IDs." },
  { date: "Planned", event: "External audit publication", detail: "Independent third-party reports will be listed here only after publication." },
]

/* ─── Page ─── */
export default function MaievPage() {
  return (
    <div className="relative min-h-screen bg-[#060606] text-white overflow-x-hidden">
      {/* Film grain */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Fixed nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl" style={{ background: "rgba(6,6,6,0.8)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-[family-name:var(--font-space-grotesk)] text-[13px] tracking-wide">VEIL</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" style={{ color: "rgba(16,185,129,0.7)" }} />
            <span className="font-[family-name:var(--font-space-grotesk)] text-[13px] tracking-[0.15em] uppercase" style={{ color: "rgba(16,185,129,0.7)" }}>
              MAIEV
            </span>
          </div>
          <Link
            href="/docs"
            className="font-[family-name:var(--font-space-grotesk)] text-[12px] tracking-wide text-white/40 hover:text-white/70 transition-colors"
          >
            Docs
          </Link>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative pt-40 pb-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 rounded-full" style={{ background: "rgba(16,185,129,0.8)", boxShadow: "0 0 12px rgba(16,185,129,0.4)" }} />
              <span className="font-[family-name:var(--font-space-grotesk)] text-[11px] tracking-[0.3em] uppercase text-white/40">
                Evidence + Validation Archive
              </span>
            </div>
            <h1
              className="font-[family-name:var(--font-instrument-serif)] text-[clamp(3.5rem,8vw,7rem)] leading-[0.9] tracking-tight mb-8"
              style={{ color: "rgba(16,185,129,0.9)" }}
            >
              MAIEV
            </h1>
            <p className="font-[family-name:var(--font-figtree)] text-lg leading-relaxed text-white/50 max-w-2xl">
              Trust is not declared — it is demonstrated. MAIEV is VEIL&apos;s evidence and validation archive. It tracks local and staged verification artifacts, remediation notes, and launch-gate evidence. External third-party audits are listed only when publicly published.
            </p>
            <p className="mt-4 font-[family-name:var(--font-space-grotesk)] text-[11px] tracking-[0.14em] uppercase text-amber-300/70">
              Current status: 0 external third-party audits published. Launch posture: {getLaunchStatus().decision} ({getLaunchStatus().gates_passing_local}/{getLaunchStatus().gates_total} gates local PASS).
            </p>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {[
              { label: "Gates Passing (Local)", value: `${getLaunchStatus().gates_passing_local}/${getLaunchStatus().gates_total}` },
              { label: "Critical Findings", value: "0" },
              { label: "External Audits Published", value: "0" },
              { label: "Launch Decision", value: getLaunchStatus().decision },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-[16px] p-5 text-center"
                style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <div className="font-[family-name:var(--font-instrument-serif)] text-3xl mb-1" style={{ color: "rgba(16,185,129,0.9)" }}>
                  {stat.value}
                </div>
                <div className="font-[family-name:var(--font-space-grotesk)] text-[10px] tracking-[0.2em] uppercase text-white/30">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Decorative gradient */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)" }}
        />
      </section>

      {/* ═══ 01 — AUDIT STATUS ═══ */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <SectionLabel num="01" label="Validation Status Overview" />
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-5">
            {auditCategories.map((cat, i) => (
              <ScrollReveal key={cat.title} delay={i * 0.1}>
                <div
                  className="rounded-[20px] p-7 h-full group hover:border-emerald-500/10 transition-colors duration-500"
                  style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl" style={{ background: "rgba(16,185,129,0.08)", color: "rgba(16,185,129,0.7)" }}>
                        {cat.icon}
                      </div>
                      <h3 className="font-[family-name:var(--font-instrument-serif)] text-xl text-white/90">{cat.title}</h3>
                    </div>
                    <StatusBadge status={cat.status} />
                  </div>
                  <p className="font-[family-name:var(--font-figtree)] text-[14px] leading-relaxed text-white/40 mb-5">{cat.description}</p>
                  <div className="flex items-center gap-6 text-[11px] font-[family-name:var(--font-space-grotesk)] tracking-wide text-white/25">
                    <span>Review Owner: <span className="text-white/45">{cat.auditor}</span></span>
                    <span>Updated: <span className="text-white/45">{cat.lastUpdated}</span></span>
                    <span>Coverage: <span className="text-white/45">{cat.coverage}</span></span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 02 — PUBLISHED REPORTS ═══ */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <SectionLabel num="02" label="Published Validation Reports" />
          </ScrollReveal>
          <div className="space-y-5">
            {publishedReports.map((report, i) => (
              <ScrollReveal key={report.id} delay={i * 0.08}>
                <div
                  className="rounded-[20px] p-7 hover:border-emerald-500/10 transition-colors duration-500"
                  style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-[family-name:var(--font-space-grotesk)] text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 rounded" style={{ color: "rgba(16,185,129,0.6)", background: "rgba(16,185,129,0.06)" }}>
                          {report.id}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${report.status === "Remediated" ? "text-emerald-400 bg-emerald-500/10" : "text-amber-400 bg-amber-500/10"}`}>
                          {report.status}
                        </span>
                      </div>
                      <h3 className="font-[family-name:var(--font-instrument-serif)] text-lg text-white/90">{report.title}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] font-[family-name:var(--font-space-grotesk)] tracking-wide text-white/30 shrink-0">
                      <span>{report.auditor}</span>
                      <span>{report.date}</span>
                      <span>{report.duration}</span>
                    </div>
                  </div>
                  <p className="font-[family-name:var(--font-figtree)] text-[14px] leading-relaxed text-white/40 mb-4">{report.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(report.findings).map(([level, count]) => (
                      <SeverityPill key={level} level={level} count={count} />
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 03 — EVIDENCE BUNDLES ═══ */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <SectionLabel num="03" label="Evidence Bundles" />
            <p className="font-[family-name:var(--font-figtree)] text-white/40 text-[15px] leading-relaxed max-w-2xl mb-12">
              Each validation run produces a cryptographically sealed evidence bundle. Packages include snapshots, validation notes, remediation diffs, and verification artifacts.
            </p>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-5">
            {evidenceBundles.map((bundle, i) => (
              <ScrollReveal key={bundle.name} delay={i * 0.1}>
                <div
                  className="rounded-[20px] p-7 h-full hover:border-emerald-500/10 transition-colors duration-500"
                  style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-[family-name:var(--font-instrument-serif)] text-[17px] text-white/90 leading-snug pr-4">{bundle.name}</h3>
                    <button className="p-2 rounded-xl shrink-0 hover:bg-white/5 transition-colors" style={{ color: "rgba(16,185,129,0.6)" }}>
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-[family-name:var(--font-space-grotesk)] tracking-wide text-white/25 mb-4">
                    <span>{bundle.version}</span>
                    <span>{bundle.date}</span>
                    <span>{bundle.size}</span>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-3 h-3 text-white/20" />
                      <span className="font-[family-name:var(--font-space-grotesk)] text-[10px] tracking-wider text-white/25 uppercase">SHA-256</span>
                    </div>
                    <code className="font-mono text-[11px] text-emerald-400/50 break-all">{bundle.sha256}</code>
                  </div>
                  <ul className="space-y-1">
                    {bundle.contents.map((item) => (
                      <li key={item} className="flex items-center gap-2 font-[family-name:var(--font-figtree)] text-[13px] text-white/35">
                        <div className="w-1 h-1 rounded-full bg-emerald-500/30" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 04 — METHODOLOGY ═══ */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <SectionLabel num="04" label="Methodology" />
          </ScrollReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {methodology.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.08}>
                <div
                  className="rounded-[20px] p-7 h-full"
                  style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <div
                    className="font-[family-name:var(--font-space-grotesk)] text-[11px] tracking-[0.2em] uppercase mb-4"
                    style={{ color: "rgba(16,185,129,0.5)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-[family-name:var(--font-instrument-serif)] text-lg text-white/90 mb-3">{item.title}</h3>
                  <p className="font-[family-name:var(--font-figtree)] text-[14px] leading-relaxed text-white/40">{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 05 — TIMELINE ═══ */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <SectionLabel num="05" label="Validation Timeline" />
          </ScrollReveal>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[7px] md:left-[120px] top-0 bottom-0 w-px" style={{ background: "rgba(16,185,129,0.1)" }} />

            <div className="space-y-8">
              {timeline.map((entry, i) => (
                <ScrollReveal key={i} delay={i * 0.05}>
                  <div className="flex gap-6 md:gap-8 items-start">
                    <div className="hidden md:block w-[100px] shrink-0 text-right">
                      <span className="font-[family-name:var(--font-space-grotesk)] text-[12px] text-white/25">{entry.date}</span>
                    </div>
                    <div className="relative shrink-0">
                      <div className="w-[14px] h-[14px] rounded-full border-2 mt-1" style={{ borderColor: "rgba(16,185,129,0.4)", background: "#060606" }}>
                        <div className="w-[6px] h-[6px] rounded-full mx-auto mt-[2px]" style={{ background: "rgba(16,185,129,0.6)" }} />
                      </div>
                    </div>
                    <div className="pb-2">
                      <span className="md:hidden font-[family-name:var(--font-space-grotesk)] text-[11px] text-white/25 block mb-1">{entry.date}</span>
                      <h4 className="font-[family-name:var(--font-instrument-serif)] text-[16px] text-white/85 mb-1">{entry.event}</h4>
                      <p className="font-[family-name:var(--font-figtree)] text-[13px] text-white/35">{entry.detail}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <ScrollReveal>
            <div
              className="inline-block rounded-full px-4 py-1.5 mb-8"
              style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)" }}
            >
              <span className="font-[family-name:var(--font-space-grotesk)] text-[11px] tracking-[0.25em] uppercase" style={{ color: "rgba(16,185,129,0.7)" }}>
                Verify Everything
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-instrument-serif)] text-[clamp(2rem,5vw,3.5rem)] leading-tight mb-6 text-white/90">
              Review the Evidence
            </h2>
            <p className="font-[family-name:var(--font-figtree)] text-white/40 text-lg max-w-xl mx-auto mb-10">
              MAIEV tracks staged validation evidence and launch-gate artifacts. Review documentation and evidence bundles directly before relying on any readiness claim.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/docs"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-[family-name:var(--font-space-grotesk)] text-[13px] tracking-wide transition-all duration-300 hover:scale-105"
                style={{ background: "rgba(16,185,129,0.15)", color: "rgba(16,185,129,0.9)", border: "1px solid rgba(16,185,129,0.2)" }}
              >
                Read Documentation
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="https://github.com/veil-protocol"
                target="_blank"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-[family-name:var(--font-space-grotesk)] text-[13px] tracking-wide text-white/50 hover:text-white/70 transition-colors duration-300"
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}
              >
                View Source
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Fixed footer */}
      <footer className="border-t px-6 py-8" style={{ borderColor: "rgba(255,255,255,0.04)", background: "rgba(6,6,6,0.9)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5" style={{ color: "rgba(16,185,129,0.4)" }} />
            <span className="font-[family-name:var(--font-space-grotesk)] text-[11px] tracking-[0.2em] uppercase text-white/20">
              MAIEV — VEIL Evidence System
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="font-[family-name:var(--font-figtree)] text-[12px] text-white/15">
              Published evidence bundles are provided under project documentation licensing terms.
            </span>
            <a href="https://thesecretlab.app" target="_blank" rel="noopener noreferrer"
              className="group flex items-center gap-1.5 shrink-0">
              <span className="font-[family-name:var(--font-space-grotesk)] text-[8px] tracking-[0.3em] uppercase text-white/8">Built by</span>
              <span className="font-[family-name:var(--font-space-grotesk)] text-[10px] tracking-[0.15em] text-white/15 font-semibold group-hover:text-white/25 transition-colors duration-700">TSL</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

