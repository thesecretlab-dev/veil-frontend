"use client"

import { VeilFooter, VeilHeader } from '@/components/brand'

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
        style={{ color: "rgba(16,185,129,0.67)" }}
      >
        {num}
      </span>
      <div className="h-px flex-1 max-w-[60px]" style={{ background: "rgba(16,185,129,0.2)" }} />
      <span
        className="font-[family-name:var(--font-space-grotesk)] text-[11px] tracking-[0.25em] uppercase"
        style={{ color: "rgba(255,255,255,0.39)" }}
      >
        {label}
      </span>
    </div>
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
// Note: these describe internal (self-run) validation coverage only. VEIL has
// zero external third-party audits as of this writing — see the status line
// above and the Methodology section below.
const auditCategories = [
  {
    icon: <FileText className="w-5 h-5" />,
    title: "VM Actions & Settlement",
    description: "VeilVM v1 has 19 native actions (IDs 0–18): markets, commit/reveal/clear, dispute, resolution, fee routing, VAI mint/burn, AMM. Companion EVM is wrap/bridge/intents only — not a second protocol. Neither chain is live on Fuji or mainnet.",
    status: "In Progress" as const,
    owner: "VEIL Core (internal)",
    lastUpdated: "2026-02-20",
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: "VM Privacy & ZK Verification",
    description: "Groth16 (gnark, BN254) shielded-ledger proof verification for batch settlement, exercised against a running local testnet: proof-gated acceptance, malformed-proof rejection, and settlement-deadline enforcement.",
    status: "In Progress" as const,
    owner: "VEIL Core (internal)",
    lastUpdated: "2026-02-20",
  },
  {
    icon: <Coins className="w-5 h-5" />,
    title: "Economic Model",
    description: "Fee routing, liquidity incentives, and VAI collateral/redemption parameters. Design and runtime paths are implemented; production parameter freeze and full stress-test evidence are still pending.",
    status: "In Progress" as const,
    owner: "VEIL Core (internal)",
    lastUpdated: "2026-02-10",
  },
  {
    icon: <Server className="w-5 h-5" />,
    title: "Infrastructure",
    description: "Node architecture, backup-prover takeover, and disaster-recovery drills, exercised on a local protocol-45 testnet. Public Fuji testnet deployment has not happened yet — that's the next campaign.",
    status: "In Progress" as const,
    owner: "VEIL Core (internal)",
    lastUpdated: "2026-02-20",
  },
]

// Real launch-gate run: bundle 20260220-202857-launch-gate-evidence, generated
// 2026-02-20T20:48:20.428Z against local chain 2CdK3iHBweFSZhh5XBgLYDaC2U7SoyqEzDaTRhmMFwSLLCm1Xb.
// Source: public/maiev/20260220-202857-launch-gate-evidence/bundle.json
const launchGateRun = {
  bundleId: "20260220-202857-launch-gate-evidence",
  generatedAt: "2026-02-20T20:48:20.428Z",
  overallPass: true,
  checks: [
    { id: "shielded-smoke", result: "PASS", durationS: 221.6, detail: "accepted=1, rejected=0, missed=0" },
    { id: "backup-takeover", result: "PASS", durationS: 451.3, detail: "primary prover rejected under backup-authority gate; backup recovered and cleared 1/1" },
    { id: "synthetic-negative", result: "PASS", durationS: 5.5, detail: "expected fail-close proof rejection observed (non-zero exit)" },
    { id: "malformed-proof", result: "PASS", durationS: 232.5, detail: "expected malformed-proof rejection observed (non-zero exit)" },
    { id: "timeout-drill", result: "PASS", durationS: 224.6, detail: "expected proof-deadline-missed rejection observed (non-zero exit)" },
  ],
}

const evidenceBundles = [
  {
    name: "Launch-Gate Evidence Bundle — 2026-02-20 20:48 UTC (latest full PASS)",
    version: "bundle 20260220-202857",
    date: "2026-02-20",
    size: "17.7 KB",
    sha256: "8925e405665cf33cee794005a7326a83168b847948e5eb814c1abecee06e3590",
    href: "/maiev/20260220-202857-launch-gate-evidence/bundle.json",
    contents: ["shielded-smoke — PASS", "backup-takeover — PASS (primary rejected, backup recovered)", "synthetic-negative — PASS (fail-closed)", "malformed-proof — PASS (fail-closed)", "timeout-drill — PASS (fail-closed)"],
  },
  {
    name: "Launch-Gate Evidence Bundle — Human-Readable Summary",
    version: "bundle 20260220-202857",
    date: "2026-02-20",
    size: "3.0 KB",
    sha256: "9089afc349e1e69e2c9ca8a681765b8551e9688d69b8aad5b53f5b522c28a518",
    href: "/maiev/20260220-202857-launch-gate-evidence/bundle.md",
    contents: ["Per-check PASS/FAIL table", "Duration + accepted/rejected/missed counts", "Paths to raw stdout/stderr logs per check"],
  },
  {
    name: "Latest Launch-Gate Pointer",
    version: "—",
    date: "2026-02-20",
    size: "300 B",
    sha256: "8a21ef9d966aa2a07b702bd14a4a1c55ad13cbb237e54968e8f4af1a9a19eda9",
    href: "/maiev/latest-launch-gate-evidence.txt",
    contents: ["Points at the most recent bundle directory", "overall_pass flag", "Chain ID + node URL used for the run"],
  },
]

const methodology = [
  {
    title: "Scope Definition",
    description: "Every review begins with a precise scope document defining contracts, circuits, and systems under validation. Scope is published before validation commencement for community review.",
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

      <VeilHeader />

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
              <span className="font-[family-name:var(--font-space-grotesk)] text-[11px] tracking-[0.3em] uppercase text-white/[0.45]">
                Evidence + Validation Archive
              </span>
            </div>
            <h1
              className="font-[family-name:var(--font-instrument-serif)] text-[clamp(3.5rem,8vw,7rem)] leading-[0.9] tracking-tight mb-8"
              style={{ color: "rgba(16,185,129,0.9)" }}
            >
              MAIEV
            </h1>
            <p className="font-[family-name:var(--font-figtree)] text-lg leading-relaxed text-white/[0.56] max-w-2xl">
              Trust is not declared — it is demonstrated. MAIEV is VEIL&apos;s evidence and validation archive. It tracks local and staged verification artifacts, remediation notes, and launch-gate evidence. External third-party audits are listed only when publicly published.
            </p>
            <p className="mt-4 font-[family-name:var(--font-space-grotesk)] text-[11px] tracking-[0.14em] uppercase text-amber-300/70">
              Current status: 0 external third-party audits published. Operator packet {getLaunchStatus().decision} ({getLaunchStatus().gates_passing_local}/{getLaunchStatus().gates_total} gates local PASS) — not public launch.
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
              { label: "Operator packet", value: getLaunchStatus().decision },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-[16px] p-5 text-center"
                style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <div className="font-[family-name:var(--font-instrument-serif)] text-3xl mb-1" style={{ color: "rgba(16,185,129,0.9)" }}>
                  {stat.value}
                </div>
                <div className="font-[family-name:var(--font-space-grotesk)] text-[10px] tracking-[0.2em] uppercase text-white/[0.34]">
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
                      <div className="p-2 rounded-xl" style={{ background: "rgba(16,185,129,0.08)", color: "rgba(16,185,129,0.78)" }}>
                        {cat.icon}
                      </div>
                      <h3 className="font-[family-name:var(--font-instrument-serif)] text-xl text-white/90">{cat.title}</h3>
                    </div>
                    <StatusBadge status={cat.status} />
                  </div>
                  <p className="font-[family-name:var(--font-figtree)] text-[14px] leading-relaxed text-white/[0.45] mb-5">{cat.description}</p>
                  <div className="flex items-center gap-6 text-[11px] font-[family-name:var(--font-space-grotesk)] tracking-wide text-white/[0.28]">
                    <span>Review Owner: <span className="text-white/45">{cat.owner}</span></span>
                    <span>Updated: <span className="text-white/45">{cat.lastUpdated}</span></span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 02 — LAUNCH-GATE EVIDENCE ═══ */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <SectionLabel num="02" label="Launch-Gate Evidence (Local)" />
            <p className="font-[family-name:var(--font-figtree)] text-white/[0.45] text-[15px] leading-relaxed max-w-2xl mb-12">
              No external audit firm has reviewed VEIL. What exists instead is a reproducible local launch-gate
              suite run against a real protocol-45 testnet. Bundle{" "}
              <code className="font-mono text-[12px] text-emerald-400/60">{launchGateRun.bundleId}</code>{" "}
              (generated {launchGateRun.generatedAt}) is the latest full run — every required gate passed.
            </p>
          </ScrollReveal>
          <div
            className="rounded-[20px] overflow-hidden"
            style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}
          >
            <div className="flex items-center justify-between px-7 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
              <span className="font-[family-name:var(--font-space-grotesk)] text-[11px] tracking-[0.2em] uppercase text-white/[0.45]">
                Overall verdict
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border bg-emerald-500/15 text-emerald-400 border-emerald-500/20">
                <CheckCircle className="w-3 h-3" /> {launchGateRun.overallPass ? "PASS" : "FAIL"}
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
              {launchGateRun.checks.map((check, i) => (
                <ScrollReveal key={check.id} delay={i * 0.06}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 px-7 py-5">
                    <div className="flex items-center gap-3 sm:w-56 shrink-0">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border bg-emerald-500/15 text-emerald-400 border-emerald-500/20">
                        {check.result}
                      </span>
                      <code className="font-[family-name:var(--font-space-grotesk)] text-[13px] text-white/75">{check.id}</code>
                    </div>
                    <p className="font-[family-name:var(--font-figtree)] text-[13px] text-white/[0.45] flex-1">{check.detail}</p>
                    <span className="font-[family-name:var(--font-space-grotesk)] text-[11px] text-white/[0.28] shrink-0">{check.durationS}s</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 03 — EVIDENCE BUNDLES ═══ */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <SectionLabel num="03" label="Evidence Bundles" />
            <p className="font-[family-name:var(--font-figtree)] text-white/[0.45] text-[15px] leading-relaxed max-w-2xl mb-12">
              Every local launch-gate run publishes its bundle under <code className="font-mono text-[12px] text-emerald-400/60">public/maiev/*-launch-gate-evidence/</code>.
              These are real, unaltered files from this repository — open them directly.
            </p>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-5">
            {evidenceBundles.map((bundle, i) => (
              <ScrollReveal key={bundle.name} delay={i * 0.1}>
                <a
                  href={bundle.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-[20px] p-7 h-full hover:border-emerald-500/10 transition-colors duration-500"
                  style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-[family-name:var(--font-instrument-serif)] text-[17px] text-white/90 leading-snug pr-4">{bundle.name}</h3>
                    <span className="p-2 rounded-xl shrink-0" style={{ color: "rgba(16,185,129,0.67)" }}>
                      <Download className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-[family-name:var(--font-space-grotesk)] tracking-wide text-white/[0.28] mb-4">
                    <span>{bundle.version}</span>
                    <span>{bundle.date}</span>
                    <span>{bundle.size}</span>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-3 h-3 text-white/[0.22]" />
                      <span className="font-[family-name:var(--font-space-grotesk)] text-[10px] tracking-wider text-white/[0.28] uppercase">SHA-256</span>
                    </div>
                    <code className="font-mono text-[11px] text-emerald-400/50 break-all">{bundle.sha256}</code>
                  </div>
                  <ul className="space-y-1">
                    {bundle.contents.map((item) => (
                      <li key={item} className="flex items-center gap-2 font-[family-name:var(--font-figtree)] text-[13px] text-white/[0.39]">
                        <div className="w-1 h-1 rounded-full bg-emerald-500/30" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </a>
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
                    style={{ color: "rgba(16,185,129,0.56)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-[family-name:var(--font-instrument-serif)] text-lg text-white/90 mb-3">{item.title}</h3>
                  <p className="font-[family-name:var(--font-figtree)] text-[14px] leading-relaxed text-white/[0.45]">{item.description}</p>
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
                      <span className="font-[family-name:var(--font-space-grotesk)] text-[12px] text-white/[0.28]">{entry.date}</span>
                    </div>
                    <div className="relative shrink-0">
                      <div className="w-[14px] h-[14px] rounded-full border-2 mt-1" style={{ borderColor: "rgba(16,185,129,0.45)", background: "#060606" }}>
                        <div className="w-[6px] h-[6px] rounded-full mx-auto mt-[2px]" style={{ background: "rgba(16,185,129,0.6)" }} />
                      </div>
                    </div>
                    <div className="pb-2">
                      <span className="md:hidden font-[family-name:var(--font-space-grotesk)] text-[11px] text-white/[0.28] block mb-1">{entry.date}</span>
                      <h4 className="font-[family-name:var(--font-instrument-serif)] text-[16px] text-white/85 mb-1">{entry.event}</h4>
                      <p className="font-[family-name:var(--font-figtree)] text-[13px] text-white/[0.39]">{entry.detail}</p>
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
              <span className="font-[family-name:var(--font-space-grotesk)] text-[11px] tracking-[0.25em] uppercase" style={{ color: "rgba(16,185,129,0.78)" }}>
                Verify Everything
              </span>
            </div>
            <h2 className="font-[family-name:var(--font-instrument-serif)] text-[clamp(2rem,5vw,3.5rem)] leading-tight mb-6 text-white/90">
              Review the Evidence
            </h2>
            <p className="font-[family-name:var(--font-figtree)] text-white/[0.45] text-lg max-w-xl mx-auto mb-10">
              MAIEV tracks staged validation evidence and launch-gate artifacts. Review documentation and evidence bundles directly before relying on any readiness claim.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/app/docs"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-[family-name:var(--font-space-grotesk)] text-[13px] tracking-wide transition-all duration-300 hover:scale-105"
                style={{ background: "rgba(16,185,129,0.15)", color: "rgba(16,185,129,0.9)", border: "1px solid rgba(16,185,129,0.2)" }}
              >
                Read Documentation
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="https://github.com/thesecretlab-dev/veilvm"
                target="_blank"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-[family-name:var(--font-space-grotesk)] text-[13px] tracking-wide text-white/[0.56] hover:text-white/[0.78] transition-colors duration-300"
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
            <Shield className="w-3.5 h-3.5" style={{ color: "rgba(16,185,129,0.45)" }} />
            <span className="font-[family-name:var(--font-space-grotesk)] text-[11px] tracking-[0.2em] uppercase text-white/[0.22]">
              MAIEV — VEIL Evidence System
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="font-[family-name:var(--font-figtree)] text-[12px] text-white/[0.17]">
              Published evidence bundles are provided under project documentation licensing terms.
            </span>
            <a href="https://thesecretlab.app" target="_blank" rel="noopener noreferrer"
              className="group flex items-center gap-1.5 shrink-0">
              <span className="font-[family-name:var(--font-space-grotesk)] text-[8px] tracking-[0.3em] uppercase text-white/8">Built by</span>
              <span className="font-[family-name:var(--font-space-grotesk)] text-[10px] tracking-[0.15em] text-white/[0.17] font-semibold group-hover:text-white/[0.28] transition-colors duration-700">TSL</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}


