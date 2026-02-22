"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
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

const metrics = [
  {
    label: "Launch Gates Passing (Local)",
    value: "6 / 12",
    target: "12 / 12 required for GO",
    status: "warning" as const,
  },
  {
    label: "Production Decision",
    value: "NO-GO",
    target: "GO only after all gates pass",
    status: "warning" as const,
  },
  {
    label: "Private Admission Path",
    value: "Enforced",
    target: "Proof-verified actions only",
    status: "healthy" as const,
  },
  {
    label: "Mempool Privacy",
    value: "Threshold Keying Active (Primary + Secondary)",
    target: "Local rollout audit passing (latest: tkroll-20260222-014454)",
    status: "healthy" as const,
  },
]

const principles = [
  {
    title: "Truth Before Hype",
    description:
      "We only claim capabilities that are implemented and evidenced. If a launch gate is pending, we publish it as pending.",
  },
  {
    title: "Fail-Closed by Default",
    description:
      "If privacy or proof conditions are not met, execution is rejected. We do not run permissive fallback paths in strict mode.",
  },
  {
    title: "VM-First Privacy",
    description:
      "Core privacy and economic invariants are enforced in VeilVM consensus, while EVM rails are interoperability surfaces.",
  },
  {
    title: "Gate-Based Launch Discipline",
    description:
      "Mainnet launch stays NO-GO until every required gate is PASS with archived evidence, including production key custody controls, admin rotation, and full launch rehearsal.",
  },
]

const developerJournal = [
  {
    date: "2026-02-22",
    title: "ANIMA Tier 0 Native SDK + Runtime Guard Baseline Pushed",
    summary:
      "ANIMA Native v1 Tier 0 execution baseline is now pushed in the ANIMA repo: typed VeilVM Tier 0 client methods (CommitOrder, RevealBatch, SubmitBatchProof, ClearBatch, SetProofConfig, SetRevealCommittee), per-call signer override routing, strict-private runtime admission/fencing in ANIMA, and local unit coverage for VM SDK + ANIMA dispatch/guard behavior. Local live-flow harness/env scaffolding is added, but live strict-private flow execution remains pending runtime/proof fixture setup.",
    briefing: "Pushed ANIMA Tier 0 native SDK/runtime baseline with strict-private guards and passing local unit coverage; live flow harness is scaffolded, not claimed as passing.",
    status: "Completed",
  },
  {
    date: "2026-02-22",
    title: "Private Liquidity Proof Path Hardened (Local Evidence)",
    summary:
      "Marketless private-liquidity envelope handling was corrected in VeilVM action verification, then validated with passing adversarial backup+malformed evidence (20260222-024215) and a passing post-fix smoke run (20260222-033228). Consolidated full-set rerun archive is still pending before launch-gate promotion.",
    briefing: "Fixed private liquidity verification edge case, then validated with adversarial and smoke PASS evidence in local profile.",
    status: "Completed",
  },
  {
    date: "2026-02-22",
    title: "Secondary Committee Rollout Closed (Local Profile)",
    summary:
      "Secondary validator committee activation is now live in the active VeilVM stack. Threshold-keying rollout audit passes for both validators with readiness green and runtime cryptographic markers present in logs (evidence run: tkroll-20260222-014454).",
    briefing: "Second validator now participates in threshold-keyed decrypt release with passing rollout audit evidence.",
    status: "Completed",
  },
  {
    date: "2026-02-21",
    title: "Live Dev Journal Pipeline Verified",
    summary:
      "Transparency updates can now be published straight to production with isolated single-commit deployment flow, so live community updates ship without bundling unrelated in-progress frontend work.",
    briefing: "Established clean single-file publish flow so community updates can ship live without frontend churn.",
    status: "Completed",
  },
  {
    date: "2026-02-21",
    title: "Live Runtime Activation Fixed for Threshold Keying",
    summary:
      "Local VEIL startup now writes per-chain VM config from secret env before AvalancheGo launch, fixing plugin env isolation. The secondary committee rollout gap that remained at this stage is now closed in the active local profile.",
    briefing: "Startup config materialization now reliably activates threshold mode in the VM runtime process.",
    status: "Completed",
  },
  {
    date: "2026-02-18",
    title: "Where We Started: Whitepaper Baseline Locked",
    summary:
      "We finalized the implementation baseline for VeilVM: encrypted mempool, shielded commitment/nullifier ledger, proof-gated batch execution, objective slashing, and deterministic replay.",
    briefing: "Locked protocol scope to whitepaper invariants and used it as the engineering source of truth.",
    status: "Completed",
  },
  {
    date: "2026-02-19",
    title: "Chain Bring-Up and Proof Pipeline",
    summary:
      "Local VEIL chain reached stable block production, proof-gated batch flow was wired, Vellum proof blob storage was enabled, and benchmark validation was hardened to require indexed execution success.",
    briefing: "Reached stable local chain operation with strict proof path checks and indexed execution validation.",
    status: "Completed",
  },
  {
    date: "2026-02-20",
    title: "Reliability and Interop Rails",
    summary:
      "Launch-gate runner reliability improved with targeted execution and fuel preflight hardening. Companion EVM intent relay paths were wired for both order and liquidity intents.",
    briefing: "Improved launch-gate reliability and wired EVM compatibility rails for intents and liquidity routing.",
    status: "Completed",
  },
  {
    date: "2026-02-21",
    title: "Private-Only Admission Enforced",
    summary:
      "Consensus now enforces a private-only action allowlist for core flow. Direct public AMM paths are rejected in strict mode; native liquidity ingress routes through private CommitOrder envelopes.",
    briefing: "Consensus now rejects public core-flow actions and only admits proof-verified private envelope routes.",
    status: "Completed",
  },
  {
    date: "2026-02-21",
    title: "Mempool Gossip Hardening Shipped",
    summary:
      "Tx gossip transport is now authenticated-encrypted (AES-256-GCM) with fail-closed key requirements. Local key management was moved to git-ignored secrets.",
    briefing: "Gossip confidentiality and authenticity are enforced, with fail-closed key requirements in local stack.",
    status: "Completed",
  },
  {
    date: "2026-02-21",
    title: "Threshold-Gated Decrypt Release Implemented",
    summary:
      "Encrypted tx gossip now uses threshold envelopes and a validator-share quorum gate before release into mempool submit path. Dockerized chain/vm tests pass for this path.",
    briefing: "Decrypt release now requires committee quorum shares before transaction admission into mempool.",
    status: "Completed",
  },
  {
    date: "2026-02-21",
    title: "Cryptographic Threshold-Keying Mode Implemented",
    summary:
      "A cryptographic mode was added using per-envelope key-splitting and per-validator encrypted shares, with threshold combination before mempool release. Activation still requires production key ceremony and rollout evidence.",
    briefing: "Cryptographic threshold mechanism is implemented; production activation evidence and ceremony remain pending.",
    status: "In Progress",
  },
  {
    date: "2026-02-21",
    title: "Current Critical Gap",
    summary:
      "Local activation and rollout evidence are now passing. Remaining critical gap is production-profile validator ceremony/rollout and adversarial evidence proving fallback decrypt mode is not active in production.",
    briefing: "Main remaining risk is production custody and proving fallback decrypt mode cannot activate in production.",
    status: "In Progress",
  },
  {
    date: "2026-02-21",
    title: "Current Launch Posture",
    summary:
      "We remain NO-GO for production while remaining gates are closed, including cryptographic threshold-keying completion, key ceremony/admin rotation, and full launch rehearsal.",
    briefing: "Launch remains NO-GO until all gates are PASS with archived production-grade evidence.",
    status: "In Progress",
  },
  {
    date: "2026-02-21",
    title: "Threshold Key-Ceremony Tooling Added",
    summary:
      "VeilVM key tooling now includes threshold-node and threshold-ceremony modes to generate committee public-key bundles, ceremony manifests, and per-validator rollout env snippets for cryptographic mempool threshold keying.",
    briefing: "Added operator tooling for committee manifests, validator bundles, and rollout snippets for key ceremony.",
    status: "Completed",
  },
  {
    date: "2026-02-21",
    title: "Key Ceremony Execution Is the Active Blocker",
    summary:
      "Implementation and tooling are in place; remaining work is operational: execute production validator ceremony, roll config network-wide, and archive adversarial evidence that threshold-keying mode is active in production profile.",
    briefing: "Code is ready; blocker is operational execution of production ceremony, rollout, and audit evidence.",
    status: "In Progress",
  },
]

const changelog = [
  {
    date: "2026-02-22",
    change:
      "ANIMA Native v1 Tier 0 baseline pushed: typed VeilVM Tier 0 SDK methods, per-call signer override routing, strict-private ANIMA runtime guard/fencing, and passing local unit suites (VM SDK + ANIMA); live Tier 0 flow remains scaffolded/pending local runtime+proof fixtures.",
    type: "Milestone",
  },
  {
    date: "2026-02-22",
    change:
      "Private liquidity proof path hardened for marketless envelope flow, with archived PASS evidence for backup+malformed (20260222-024215) and post-fix smoke (20260222-033228); consolidated full-set rerun remains pending.",
    type: "Hardening",
  },
  {
    date: "2026-02-22",
    change:
      "Threshold-keying rollout now passes for both primary and secondary validators in local profile, with fixed secondary bootstrap wiring and archived passing evidence (tkroll-20260222-014454).",
    type: "Milestone",
  },
  {
    date: "2026-02-21",
    change:
      "Local node startup now materializes per-chain VM config from env so plugin subprocesses activate cryptographic threshold-keying mode consistently.",
    type: "Hardening",
  },
  {
    date: "2026-02-21",
    change:
      "Cryptographic threshold-keying mode added (per-envelope key split + per-validator encrypted shares + threshold combine before release).",
    type: "Hardening",
  },
  {
    date: "2026-02-21",
    change:
      "Threshold key-ceremony tooling added to veilvm-keygen for validator key generation, committee manifesting, and rollout env packaging.",
    type: "Hardening",
  },
  {
    date: "2026-02-21",
    change:
      "Threshold envelope gossip and validator-quorum-gated decrypt release path wired into VM mempool admission flow.",
    type: "Hardening",
  },
  {
    date: "2026-02-21",
    change:
      "Encrypted mempool gossip transport enabled with fail-closed key requirement and local secret rotation.",
    type: "Hardening",
  },
  {
    date: "2026-02-21",
    change:
      "Consensus private-only admission gate enforced for core proof-verified action path.",
    type: "Policy",
  },
  {
    date: "2026-02-21",
    change:
      "Liquidity ingress moved to CommitOrder envelope route under strict privacy policy.",
    type: "Milestone",
  },
  {
    date: "2026-02-20",
    change:
      "Targeted launch-gate evidence flow added to speed iteration and improve operational reliability.",
    type: "Improvement",
  },
  {
    date: "2026-02-20",
    change:
      "Companion EVM order and liquidity intent relay endpoints wired for interoperability rails.",
    type: "Feature",
  },
  {
    date: "2026-02-19",
    change:
      "Proof-gated batch pipeline and strict verifier runtime path stabilized in local environment.",
    type: "Milestone",
  },
  {
    date: "2026-02-18",
    change:
      "Whitepaper-aligned protocol implementation baseline finalized and adopted as source of truth.",
    type: "Milestone",
  },
]

const launchBlockers = [
  {
    gate: "Cryptographic Threshold Keying",
    detail:
      "Local profile is passing on both validators with archived rollout evidence, including additional private-liquidity proof-path passes (20260222-024215 and 20260222-033228). Remaining blocker is production-profile ceremony rollout, adversarial proof that fallback decrypt mode is not active in production, and a consolidated full-set rerun archive.",
    status: "In Progress",
  },
  {
    gate: "Key Ceremony and Admin Key Rotation",
    detail:
      "Run audited key ceremony and rotate privileged keys into production custody controls.",
    status: "Pending",
  },
  {
    gate: "End-to-End Launch Rehearsal",
    detail:
      "Execute full rehearsal covering proofs, liquidity ingress, failover, and incident recovery.",
    status: "Pending",
  },
]

function statusColor(status: string) {
  if (status === "healthy") return "rgba(16, 185, 129, 0.9)"
  if (status === "warning") return "rgba(234, 179, 8, 0.9)"
  return "rgba(255, 255, 255, 0.7)"
}

function statusBorder(status: string) {
  if (status === "healthy") return "rgba(16, 185, 129, 0.15)"
  if (status === "warning") return "rgba(234, 179, 8, 0.15)"
  return "rgba(255, 255, 255, 0.04)"
}

function typeBadge(type: string) {
  const map: Record<string, { bg: string; border: string; color: string }> = {
    Feature: {
      bg: "rgba(16, 185, 129, 0.06)",
      border: "rgba(16, 185, 129, 0.15)",
      color: "rgba(16, 185, 129, 0.85)",
    },
    Policy: {
      bg: "rgba(59, 130, 246, 0.06)",
      border: "rgba(59, 130, 246, 0.15)",
      color: "rgba(59, 130, 246, 0.85)",
    },
    Improvement: {
      bg: "rgba(234, 179, 8, 0.06)",
      border: "rgba(234, 179, 8, 0.15)",
      color: "rgba(234, 179, 8, 0.85)",
    },
    Milestone: {
      bg: "rgba(244, 114, 182, 0.06)",
      border: "rgba(244, 114, 182, 0.15)",
      color: "rgba(244, 114, 182, 0.85)",
    },
    Hardening: {
      bg: "rgba(139, 92, 246, 0.08)",
      border: "rgba(139, 92, 246, 0.2)",
      color: "rgba(167, 139, 250, 0.92)",
    },
  }
  return map[type] || map.Feature
}

export default function TransparencyPage() {
  return (
    <div className="relative min-h-screen" style={{ background: "#060606" }}>
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
        }}
      />

      <nav
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-5"
        style={{
          background: "rgba(6, 6, 6, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
        }}
      >
        <Link
          href="/app"
          className="flex items-center gap-2 text-sm transition-all hover:gap-3"
          style={{ color: "rgba(16, 185, 129, 0.7)", fontFamily: "var(--font-space-grotesk)" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Markets
        </Link>
        <span
          className="text-xs tracking-[0.3em] uppercase"
          style={{ color: "rgba(255, 255, 255, 0.25)", fontFamily: "var(--font-space-grotesk)" }}
        >
          VEIL / Transparency
        </span>
      </nav>

      <main className="relative z-10 mx-auto max-w-[960px] px-6 pt-32 pb-32">
        <ScrollReveal>
          <div className="mb-20 text-center">
            <p
              className="mb-4 text-xs tracking-[0.4em] uppercase"
              style={{ color: "rgba(16, 185, 129, 0.5)", fontFamily: "var(--font-space-grotesk)" }}
            >
              Open Build Log
            </p>
            <h1
              className="text-6xl md:text-7xl font-light mb-6"
              style={{
                fontFamily: "var(--font-instrument-serif)",
                color: "rgba(255, 255, 255, 0.92)",
                letterSpacing: "-0.03em",
              }}
            >
              Developer Journal
            </h1>
            <p
              className="text-lg font-light max-w-xl mx-auto"
              style={{ color: "rgba(255, 255, 255, 0.35)", fontFamily: "var(--font-figtree)" }}
            >
              A live community update on where we started, what is shipped, and what remains.
            </p>
          </div>
        </ScrollReveal>

        <div className="mb-16">
          <ScrollReveal>
            <div className="flex items-baseline gap-4 mb-8">
              <span
                className="text-xs tracking-[0.2em]"
                style={{ color: "rgba(16, 185, 129, 0.4)", fontFamily: "var(--font-space-grotesk)" }}
              >
                01
              </span>
              <h2
                className="text-3xl font-light"
                style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255, 255, 255, 0.85)", letterSpacing: "-0.02em" }}
              >
                Current Build Status
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {metrics.map((m, i) => (
              <ScrollReveal key={m.label} delay={i * 0.1}>
                <div
                  className="rounded-[20px] p-7"
                  style={{
                    background: "rgba(255, 255, 255, 0.015)",
                    border: `1px solid ${statusBorder(m.status)}`,
                  }}
                >
                  <div
                    className="text-3xl font-light mb-2 tabular-nums"
                    style={{ color: statusColor(m.status), fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {m.value}
                  </div>
                  <div
                    className="text-sm font-light mb-1"
                    style={{ color: "rgba(255, 255, 255, 0.55)", fontFamily: "var(--font-figtree)" }}
                  >
                    {m.label}
                  </div>
                  <div
                    className="text-xs font-light"
                    style={{ color: "rgba(255, 255, 255, 0.25)", fontFamily: "var(--font-space-grotesk)" }}
                  >
                    Target: {m.target}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <ScrollReveal>
            <div className="flex items-baseline gap-4 mb-8">
              <span
                className="text-xs tracking-[0.2em]"
                style={{ color: "rgba(16, 185, 129, 0.4)", fontFamily: "var(--font-space-grotesk)" }}
              >
                02
              </span>
              <h2
                className="text-3xl font-light"
                style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255, 255, 255, 0.85)", letterSpacing: "-0.02em" }}
              >
                Engineering Principles
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {principles.map((p, i) => (
              <ScrollReveal key={p.title} delay={i * 0.1}>
                <div
                  className="rounded-[20px] p-8 h-full"
                  style={{
                    background: "rgba(255, 255, 255, 0.015)",
                    border: "1px solid rgba(255, 255, 255, 0.04)",
                  }}
                >
                  <h3
                    className="text-lg font-light mb-3"
                    style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(16, 185, 129, 0.8)" }}
                  >
                    {p.title}
                  </h3>
                  <p
                    className="text-[15px] leading-[1.85] font-light"
                    style={{ color: "rgba(255, 255, 255, 0.4)", fontFamily: "var(--font-figtree)" }}
                  >
                    {p.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <ScrollReveal>
            <div className="flex items-baseline gap-4 mb-8">
              <span
                className="text-xs tracking-[0.2em]"
                style={{ color: "rgba(16, 185, 129, 0.4)", fontFamily: "var(--font-space-grotesk)" }}
              >
                03
              </span>
              <h2
                className="text-3xl font-light"
                style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255, 255, 255, 0.85)", letterSpacing: "-0.02em" }}
              >
                Timeline: From Start to Current State
              </h2>
            </div>
          </ScrollReveal>

          <div className="space-y-5">
            {developerJournal.map((entry, i) => (
              <ScrollReveal key={`${entry.date}-${entry.title}`} delay={i * 0.08}>
                <div
                  className="rounded-[20px] p-8"
                  style={{
                    background: "rgba(255, 255, 255, 0.015)",
                    border: "1px solid rgba(255, 255, 255, 0.04)",
                  }}
                >
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span
                      className="px-3 py-1 rounded-lg text-xs font-light"
                      style={{
                        background: entry.status === "Completed" ? "rgba(16, 185, 129, 0.06)" : "rgba(234, 179, 8, 0.08)",
                        border: entry.status === "Completed" ? "1px solid rgba(16, 185, 129, 0.15)" : "1px solid rgba(234, 179, 8, 0.2)",
                        color: entry.status === "Completed" ? "rgba(16, 185, 129, 0.9)" : "rgba(234, 179, 8, 0.92)",
                        fontFamily: "var(--font-space-grotesk)",
                      }}
                    >
                      {entry.status}
                    </span>
                    <span
                      className="text-xs font-light"
                      style={{ color: "rgba(255, 255, 255, 0.25)", fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {entry.date}
                    </span>
                  </div>
                  <h3
                    className="text-lg font-light mb-3"
                    style={{ color: "rgba(255, 255, 255, 0.88)", fontFamily: "var(--font-instrument-serif)" }}
                  >
                    {entry.title}
                  </h3>
                  <p
                    className="text-[15px] leading-[1.85] font-light"
                    style={{ color: "rgba(255, 255, 255, 0.42)", fontFamily: "var(--font-figtree)" }}
                  >
                    {entry.summary}
                  </p>
                  <p
                    className="text-sm font-light mt-4"
                    style={{ color: "rgba(16, 185, 129, 0.82)", fontFamily: "var(--font-space-grotesk)" }}
                  >
                    Dev briefing: {entry.briefing}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <div>
          <ScrollReveal>
            <div className="flex items-baseline gap-4 mb-8">
              <span
                className="text-xs tracking-[0.2em]"
                style={{ color: "rgba(16, 185, 129, 0.4)", fontFamily: "var(--font-space-grotesk)" }}
              >
                04
              </span>
              <h2
                className="text-3xl font-light"
                style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255, 255, 255, 0.85)", letterSpacing: "-0.02em" }}
              >
                Remaining Launch Blockers
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div
              className="rounded-[20px] p-8 mb-16"
              style={{
                background: "rgba(255, 255, 255, 0.015)",
                border: "1px solid rgba(255, 255, 255, 0.04)",
              }}
            >
              <div className="space-y-5">
                {launchBlockers.map((item, i) => (
                  <div
                    key={item.gate}
                    className="flex items-start gap-4 pb-5 last:pb-0"
                    style={{ borderBottom: i < launchBlockers.length - 1 ? "1px solid rgba(255, 255, 255, 0.03)" : "none" }}
                  >
                    <span
                      className="px-3 py-1 rounded-lg text-xs font-light whitespace-nowrap"
                      style={{
                        background: item.status === "In Progress" ? "rgba(234, 179, 8, 0.08)" : "rgba(255, 255, 255, 0.05)",
                        border: item.status === "In Progress" ? "1px solid rgba(234, 179, 8, 0.2)" : "1px solid rgba(255, 255, 255, 0.12)",
                        color: item.status === "In Progress" ? "rgba(234, 179, 8, 0.9)" : "rgba(255, 255, 255, 0.72)",
                        fontFamily: "var(--font-space-grotesk)",
                      }}
                    >
                      {item.status}
                    </span>
                    <div className="flex-1">
                      <h3
                        className="text-sm font-light mb-1"
                        style={{ color: "rgba(255, 255, 255, 0.78)", fontFamily: "var(--font-instrument-serif)" }}
                      >
                        {item.gate}
                      </h3>
                      <p
                        className="text-sm font-light leading-[1.8]"
                        style={{ color: "rgba(255, 255, 255, 0.42)", fontFamily: "var(--font-figtree)" }}
                      >
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        <div>
          <ScrollReveal>
            <div className="flex items-baseline gap-4 mb-8">
              <span
                className="text-xs tracking-[0.2em]"
                style={{ color: "rgba(16, 185, 129, 0.4)", fontFamily: "var(--font-space-grotesk)" }}
              >
                05
              </span>
              <h2
                className="text-3xl font-light"
                style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255, 255, 255, 0.85)", letterSpacing: "-0.02em" }}
              >
                Recent Engineering Changes
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div
              className="rounded-[20px] p-8"
              style={{
                background: "rgba(255, 255, 255, 0.015)",
                border: "1px solid rgba(255, 255, 255, 0.04)",
              }}
            >
              <div className="space-y-5">
                {changelog.map((item, i) => {
                  const badge = typeBadge(item.type)
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-4 pb-5 last:pb-0"
                      style={{ borderBottom: i < changelog.length - 1 ? "1px solid rgba(255, 255, 255, 0.03)" : "none" }}
                    >
                      <span
                        className="px-3 py-1 rounded-lg text-xs font-light whitespace-nowrap"
                        style={{
                          background: badge.bg,
                          border: `1px solid ${badge.border}`,
                          color: badge.color,
                          fontFamily: "var(--font-space-grotesk)",
                        }}
                      >
                        {item.type}
                      </span>
                      <div className="flex-1">
                        <p
                          className="text-sm font-light mb-1"
                          style={{ color: "rgba(255, 255, 255, 0.6)", fontFamily: "var(--font-figtree)" }}
                        >
                          {item.change}
                        </p>
                        <span
                          className="text-xs font-light"
                          style={{ color: "rgba(255, 255, 255, 0.2)", fontFamily: "var(--font-space-grotesk)" }}
                        >
                          {item.date}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>

      <footer
        className="relative z-10 border-t px-8 py-8 text-center"
        style={{
          borderColor: "rgba(255, 255, 255, 0.04)",
          background: "rgba(6, 6, 6, 0.6)",
        }}
      >
        <p className="text-xs" style={{ color: "rgba(255, 255, 255, 0.2)", fontFamily: "var(--font-space-grotesk)" }}>
          (c) 2026 VEIL. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
