"use client"

import { VeilFooter } from '@/components/brand'

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
    label: "Launch Gate Snapshot",
    value: "13 / 13",
    target: "All checklist gates are PASS or PASS (local)",
    status: "healthy" as const,
  },
  {
    label: "Production Decision",
    value: "GO FOR PRODUCTION",
    target: "Authority: launch checklist decision line (2026-02-22)",
    status: "healthy" as const,
  },
  {
    label: "Private Admission Path",
    value: "Enforced",
    target: "Proof-verified actions only (consensus rule)",
    status: "healthy" as const,
  },
  {
    label: "Mempool Privacy",
    value: "Threshold Keying Active (Primary + Secondary)",
    target: "PASS (local): tkroll-20260222-190103",
    status: "warning" as const,
  },
  {
    label: "Child Validator Connectivity",
    value: "Bridge Ready",
    target: "Operator staking/RPC reachable via cloudflared Access TCP sidecars",
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
      "Launch posture is evidence-gated: GO is only valid when every required gate is PASS with archived evidence. Current checklist state is GO FOR PRODUCTION (2026-02-22).",
  },
]

const developerJournal = [
  {
    date: "2026-02-23",
    title: "Live Transparency Push Verified",
    summary:
      "The transparency/devlog surface was pushed through production deploy and verified live on veil.markets so current validator status is no longer local-only.",
    briefing:
      "This update confirms the journal is now live in production with the child-validator connectivity state.",
    status: "Completed",
  },
  {
    date: "2026-02-23",
    title: "Child Validator Connectivity Blocker Cleared",
    summary:
      "Operator staking and RPC reachability from child sandbox is now live through deterministic bridge mode: veil-staking.thesecretlab.app and veil-rpc-tcp.thesecretlab.app are tunneled and verified from child sidecars (127.0.0.1:29651 and 127.0.0.1:29660).",
    briefing:
      "Topology blocker is cleared; remaining blocker is validator registration/activation transaction execution parameters.",
    status: "Completed",
  },
  {
    date: "2026-02-22",
    title: "Operator Execution Aligned to Launched Self-Host Chain",
    summary:
      "Runtime routing is now pinned to the launched self-host chain aQ8Ct8Hwwn71EeJw2eyPQJhu8mwHVoyGT8dDGgGu3svQAGSWs. Router health reports the same chain target and platform lifecycle status remains Validating.",
    briefing: "Router target and launched chain are now aligned, with self-host execution evidence archived.",
    status: "Completed",
  },
  {
    date: "2026-02-22",
    title: "GO FOR PRODUCTION + Self-Host UUP Launch Executed",
    summary:
      "Launch sign-off rows were completed (6/6 PASS), decision state moved to GO FOR PRODUCTION, and a live CreateBlockchain run succeeded on this operator node using alphanumeric UUP chain naming defaults.",
    briefing: "Checklist decision is GO, and self-host chain creation is now evidence-backed in the live operator flow.",
    status: "Completed",
  },
  {
    date: "2026-02-22",
    title: "Strict Signer Policy Enforced in Critical-Phase Runs",
    summary:
      "Critical-phase strict mode now requires launch-packet signer policy matches (requiredSigners + minSignatures) and fails closed when required signer conditions are not met.",
    briefing: "Signed launch-packet policy is now enforced by default in strict orchestration.",
    status: "Completed",
  },
  {
    date: "2026-02-22",
    title: "ANIMA Tier 0 Native SDK + Runtime Guard Baseline Pushed",
    summary:
      "ANIMA Tier 0 execution baseline and runtime guards are now paired with passing readiness evidence (anima-20260222-143834), including strict-private fixture mapping for Tier0 action IDs 2,3,17,4 in the local profile.",
    briefing: "ANIMA readiness bundle is now passing in the launch checklist local evidence profile.",
    status: "Completed",
  },
  {
    date: "2026-02-22",
    title: "Private Liquidity Proof Path Hardened (Local Evidence)",
    summary:
      "Marketless private-liquidity envelope handling was corrected in VeilVM action verification, then validated with passing adversarial backup+malformed evidence (20260222-024215) and post-fix smoke evidence (20260222-033228), now reflected in passing launch-gate state.",
    briefing: "Private liquidity verification edge case is fixed and archived as passing evidence in the active checklist snapshot.",
    status: "Completed",
  },
  {
    date: "2026-02-22",
    title: "Secondary Committee Rollout Closed (Local Profile)",
    summary:
      "Secondary validator committee activation is now live in the active VeilVM stack. Threshold-keying rollout audit passes for both validators with readiness green and runtime cryptographic markers present in logs (latest pointer: tkroll-20260222-190103).",
    briefing: "Second validator participates in threshold-keyed decrypt release with passing latest rollout evidence.",
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
      "Cryptographic threshold mode with per-envelope key-splitting and per-validator encrypted shares is implemented and now represented by passing rollout evidence in the active checklist profile.",
    briefing: "Threshold mechanism moved from implementation-only to evidence-backed passing state in current launch snapshot.",
    status: "Completed",
  },
  {
    date: "2026-02-21",
    title: "Historical Launch Gap Closure",
    summary:
      "The previously tracked launch gap (ceremony/rollout and launch-rehearsal closure) is now closed in the current launch snapshot, with checklist gates marked PASS or PASS (local).",
    briefing: "This item is retained for timeline continuity; it is no longer an active blocker in the current cycle.",
    status: "Completed",
  },
  {
    date: "2026-02-21",
    title: "Current Launch Posture (Updated)",
    summary:
      "Current launch authority state is GO FOR PRODUCTION with sign-off rows complete and all checklist gates shown as PASS or PASS (local) in the 2026-02-22 snapshot.",
    briefing: "Launch decision is now GO FOR PRODUCTION in canonical checklist state.",
    status: "Completed",
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
    title: "Key Ceremony and Admin Rotation Closed",
    summary:
      "Key ceremony and admin rotation evidence are now archived and reflected as passing in the checklist (`ceremony-20260221-184909` and `rotation-20260222-045726`).",
    briefing: "Operational ceremony and ownership rotation are complete for the current launch snapshot.",
    status: "Completed",
  },
]

const changelog = [
  {
    date: "2026-02-23",
    change:
      "Live transparency/devlog surface deployment verified on veil.markets to ensure latest validator progression is production-visible.",
    type: "Milestone",
  },
  {
    date: "2026-02-23",
    change:
      "Cleared child validator network topology blocker by enabling operator staking/RPC bridge endpoints and validating live child-side connectivity over cloudflared Access TCP.",
    type: "Hardening",
  },
  {
    date: "2026-02-22",
    change:
      "Launch decision advanced to GO FOR PRODUCTION after sign-off sheet completion (6/6 PASS) and readiness parser alignment for GO decision forms.",
    type: "Policy",
  },
  {
    date: "2026-02-22",
    change:
      "Self-host UUP chain launch executed successfully, then router runtime pinned to launched chain aQ8Ct8Hwwn71EeJw2eyPQJhu8mwHVoyGT8dDGgGu3svQAGSWs.",
    type: "Milestone",
  },
  {
    date: "2026-02-22",
    change:
      "ANIMA Native v1 Tier 0 baseline is now paired with passing readiness evidence (`anima-20260222-143834`) and strict-private fixture mapping for Tier0 action IDs 2,3,17,4.",
    type: "Milestone",
  },
  {
    date: "2026-02-22",
    change:
      "Private liquidity proof path hardened for marketless envelope flow, with archived PASS evidence for backup+malformed (20260222-024215) and post-fix smoke (20260222-033228), now reflected in passing checklist state.",
    type: "Hardening",
  },
  {
    date: "2026-02-22",
    change:
      "Threshold-keying rollout now passes for both primary and secondary validators in local profile, with latest passing pointer `tkroll-20260222-190103`.",
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
    gate: "Child Validator Registration Path",
    detail:
      "In Progress: connectivity is now live (staking/rpc bridge verified), but validator registration/activation execution still requires finalized l1/validator-manager/stake/reward-owner tx path for child NodeID.",
    status: "In Progress",
  },
  {
    gate: "Cryptographic Threshold Keying",
    detail:
      "PASS (local): threshold-gated encrypted gossip and fail-closed keying are active, with latest rollout audit pointer at tkroll-20260222-190103 and archived adversarial/smoke evidence.",
    status: "PASS (local)",
  },
  {
    gate: "Key Ceremony and Admin Key Rotation",
    detail:
      "PASS: key ceremony and ownership rotation are archived (`ceremony-20260221-184909`, `rotation-20260222-045726`) and reflected in checklist snapshot.",
    status: "PASS",
  },
  {
    gate: "End-to-End Launch Rehearsal",
    detail:
      "PASS: full rehearsal packet is archived (`rehearsal-20260222-095753`) with signature verification complete.",
    status: "PASS",
  },
  {
    gate: "ANIMA Runtime Readiness",
    detail:
      "PASS (local): readiness bundle pointer (`anima-20260222-143834`) reports strict-private fixture coverage and overall pass in the current checklist.",
    status: "PASS (local)",
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
                Launch Gate Snapshot
              </h2>
              <p
                className="text-xs font-light"
                style={{ color: "rgba(255, 255, 255, 0.35)", fontFamily: "var(--font-space-grotesk)" }}
              >
                PASS (local) = validated local evidence profile. PASS = checklist gate closed.
              </p>
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
                        background:
                          item.status === "PASS"
                            ? "rgba(16, 185, 129, 0.08)"
                            : item.status === "PASS (local)"
                              ? "rgba(59, 130, 246, 0.08)"
                              : item.status === "In Progress"
                                ? "rgba(234, 179, 8, 0.08)"
                                : "rgba(255, 255, 255, 0.05)",
                        border:
                          item.status === "PASS"
                            ? "1px solid rgba(16, 185, 129, 0.2)"
                            : item.status === "PASS (local)"
                              ? "1px solid rgba(59, 130, 246, 0.2)"
                              : item.status === "In Progress"
                                ? "1px solid rgba(234, 179, 8, 0.2)"
                                : "1px solid rgba(255, 255, 255, 0.12)",
                        color:
                          item.status === "PASS"
                            ? "rgba(16, 185, 129, 0.9)"
                            : item.status === "PASS (local)"
                              ? "rgba(59, 130, 246, 0.9)"
                              : item.status === "In Progress"
                                ? "rgba(234, 179, 8, 0.9)"
                                : "rgba(255, 255, 255, 0.72)",
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

