"use client"

import { VeilFooter, VeilHeader } from '@/components/brand'

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"

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
    value: "12 / 13",
    target: "Companion bootstrap gate remains in progress while node state sync completes",
    status: "warning" as const,
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
    value: "Live / Peered (2 Nodes)",
    target: "Operator NodeID-BRW... <-> Child NodeID-A4... connected=true",
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
    date: "2026-02-24",
    title: "Companion Bootstrap Recovery + RPC Gateway Cutover",
    summary:
      "Both companion EVM nodes were restarted onto clean bootstrap paths and are actively progressing through state-trie synchronization. Public RPC ingress has been upgraded behind a unified gateway, and Cloudflare tunnel routes are now pinned to gateway health/info endpoints. Companion RPC remains intentionally unavailable (503) until bootstrap and subnet readiness complete.",
    briefing:
      "VEILvm block production remains live; companion EVM explorer/RPC will resume once bootstrap quorum is back online.",
    status: "In Progress",
  },
  {
    date: "2026-02-24",
    title: "Mainnet + Child Node Pair Live and Peered",
    summary:
      "Recovered live child-validator connectivity end-to-end by correcting staking tunnel routing (operator 9661), aligning child runtime to avalanchego/1.12.2, and installing the VEIL VM plugin on child host. Operator and child now report mutual peer links and the child validator shows connected=true on the active primary set.",
    briefing:
      "Connectivity is no longer bridge-only preflight; the operator-child pair is now live and peered.",
    status: "Completed",
  },
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
    date: "2026-02-24",
    change:
      "Companion recovery moved to active bootstrap phase: both nodes restarted, trie sync in progress, and RPC ingress moved behind the new gateway/tunnel route with readiness still gated pending full subnet bootstrap.",
    type: "Hardening",
  },
  {
    date: "2026-02-24",
    change:
      "Operator-child validator peering moved from bridge-ready to live connected status after staking tunnel correction, runtime version alignment, and child plugin install.",
    type: "Milestone",
  },
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
    gate: "Child Full Subnet Bootstrap Scope",
    detail:
      "In Progress: companion nodes are in active state-trie resync/bootstrap and currently return readiness 503 for the companion chain path until subnet bootstrapping fully completes. Operator-child validator peering on the VEILvm side remains live.",
    status: "In Progress",
  },
  {
    gate: "Child Validator Registration + Peering",
    detail:
      "PASS: child NodeID-A4yqq7yUCQV3CPsVaEGVATLNgHc2fd7vC is registered and connected to operator NodeID-BRWmyj4aQPgx1suA3Le9km1aF6sQnmVyw on the active validator set.",
    status: "PASS",
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
  const passCount = launchBlockers.filter((item) => item.status === "PASS").length
  const passLocalCount = launchBlockers.filter((item) => item.status === "PASS (local)").length
  const inProgressCount = launchBlockers.filter((item) => item.status === "In Progress").length
  const latestEntry = developerJournal[0]

  return (
    <div className="relative min-h-screen overflow-x-clip" style={{ background: "#050607" }}>
      <VeilHeader />
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at 12% 14%, rgba(16,185,129,0.18), transparent 34%), radial-gradient(circle at 84% 10%, rgba(56,189,248,0.11), transparent 32%), radial-gradient(circle at 56% 78%, rgba(167,139,250,0.1), transparent 36%)",
        }}
      />

      <main className="relative z-10 mx-auto max-w-[1180px] px-5 pt-32 pb-28 md:px-8 md:pt-36">
        <ScrollReveal>
          <section
            className="mb-14 rounded-[28px] p-6 md:p-8 lg:p-10"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 55%, rgba(16,185,129,0.05) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 30px 120px rgba(0,0,0,0.45)",
            }}
          >
            <div className="grid gap-7 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <p
                  className="mb-4 text-xs uppercase tracking-[0.34em]"
                  style={{ color: "rgba(16,185,129,0.62)", fontFamily: "var(--font-space-grotesk)" }}
                >
                  Operational Transparency
                </p>
                <h1
                  className="mb-5 text-5xl font-light leading-[1.04] md:text-7xl"
                  style={{
                    fontFamily: "var(--font-instrument-serif)",
                    color: "rgba(255,255,255,0.95)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  Developer Journal
                </h1>
                <p
                  className="max-w-2xl text-base font-light leading-[1.9] md:text-lg"
                  style={{ color: "rgba(255,255,255,0.52)", fontFamily: "var(--font-figtree)" }}
                >
                  Live engineering ledger for VEIL mainnet infrastructure, companion EVM recovery, validator
                  operations, and launch-gate evidence status.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/app/network"
                    className="inline-flex items-center rounded-full px-4 py-2 text-xs uppercase tracking-[0.16em] transition-colors hover:bg-emerald-500/12"
                    style={{
                      color: "rgba(16,185,129,0.92)",
                      border: "1px solid rgba(16,185,129,0.3)",
                      background: "rgba(16,185,129,0.08)",
                      fontFamily: "var(--font-space-grotesk)",
                    }}
                  >
                    Live Network View
                  </Link>
                  <Link
                    href="/app/launch"
                    className="inline-flex items-center rounded-full px-4 py-2 text-xs uppercase tracking-[0.16em] transition-colors hover:bg-white/8"
                    style={{
                      color: "rgba(255,255,255,0.78)",
                      border: "1px solid rgba(255,255,255,0.16)",
                      background: "rgba(255,255,255,0.04)",
                      fontFamily: "var(--font-space-grotesk)",
                    }}
                  >
                    Launch Surface
                  </Link>
                  <Link
                    href="/app/docs"
                    className="inline-flex items-center rounded-full px-4 py-2 text-xs uppercase tracking-[0.16em] transition-colors hover:bg-white/8"
                    style={{
                      color: "rgba(255,255,255,0.78)",
                      border: "1px solid rgba(255,255,255,0.16)",
                      background: "rgba(255,255,255,0.04)",
                      fontFamily: "var(--font-space-grotesk)",
                    }}
                  >
                    Docs
                  </Link>
                </div>
              </div>

              <div
                className="rounded-[20px] p-5 md:p-6"
                style={{
                  background: "rgba(6,12,10,0.72)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
              >
                <p
                  className="text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: "rgba(16,185,129,0.82)", fontFamily: "var(--font-space-grotesk)" }}
                >
                  Latest Entry
                </p>
                <h2
                  className="mt-3 text-xl font-light leading-tight"
                  style={{ color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-instrument-serif)" }}
                >
                  {latestEntry?.title}
                </h2>
                <p
                  className="mt-2 text-sm font-light leading-[1.8]"
                  style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-figtree)" }}
                >
                  {latestEntry?.briefing}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div
                    className="rounded-[14px] p-3"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <p
                      className="text-[10px] uppercase tracking-[0.14em]"
                      style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-space-grotesk)" }}
                    >
                      Decision
                    </p>
                    <p
                      className="mt-1 text-xs"
                      style={{ color: "rgba(16,185,129,0.9)", fontFamily: "var(--font-space-grotesk)" }}
                    >
                      GO FOR PRODUCTION
                    </p>
                  </div>
                  <div
                    className="rounded-[14px] p-3"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <p
                      className="text-[10px] uppercase tracking-[0.14em]"
                      style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-space-grotesk)" }}
                    >
                      Open Gates
                    </p>
                    <p
                      className="mt-1 text-xs"
                      style={{ color: "rgba(234,179,8,0.92)", fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {inProgressCount}
                    </p>
                  </div>
                  <div
                    className="rounded-[14px] p-3"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <p
                      className="text-[10px] uppercase tracking-[0.14em]"
                      style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-space-grotesk)" }}
                    >
                      Journal Entries
                    </p>
                    <p
                      className="mt-1 text-xs"
                      style={{ color: "rgba(255,255,255,0.88)", fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {developerJournal.length}
                    </p>
                  </div>
                  <div
                    className="rounded-[14px] p-3"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <p
                      className="text-[10px] uppercase tracking-[0.14em]"
                      style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-space-grotesk)" }}
                    >
                      Last Update
                    </p>
                    <p
                      className="mt-1 text-xs"
                      style={{ color: "rgba(255,255,255,0.88)", fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {latestEntry?.date}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <section className="mb-14">
          <ScrollReveal>
            <div className="mb-7 flex items-baseline gap-4">
              <span
                className="text-xs tracking-[0.2em]"
                style={{ color: "rgba(16, 185, 129, 0.4)", fontFamily: "var(--font-space-grotesk)" }}
              >
                01
              </span>
              <h2
                className="text-3xl font-light"
                style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255, 255, 255, 0.9)", letterSpacing: "-0.02em" }}
              >
                Current Build Status
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {metrics.map((m, i) => (
              <ScrollReveal key={m.label} delay={i * 0.08}>
                <div
                  className="h-full rounded-[18px] p-6"
                  style={{
                    background: "linear-gradient(165deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
                    border: `1px solid ${statusBorder(m.status)}`,
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="mb-4 h-1 w-14 rounded-full" style={{ background: statusColor(m.status) }} />
                  <div
                    className="text-[28px] font-light leading-none tabular-nums"
                    style={{ color: statusColor(m.status), fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {m.value}
                  </div>
                  <div
                    className="mt-3 text-sm font-light"
                    style={{ color: "rgba(255,255,255,0.68)", fontFamily: "var(--font-figtree)" }}
                  >
                    {m.label}
                  </div>
                  <div
                    className="mt-2 text-xs font-light leading-[1.6]"
                    style={{ color: "rgba(255,255,255,0.34)", fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {m.target}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <ScrollReveal>
            <div className="mb-7 flex items-baseline gap-4">
              <span
                className="text-xs tracking-[0.2em]"
                style={{ color: "rgba(16, 185, 129, 0.4)", fontFamily: "var(--font-space-grotesk)" }}
              >
                02
              </span>
              <h2
                className="text-3xl font-light"
                style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255, 255, 255, 0.9)", letterSpacing: "-0.02em" }}
              >
                Engineering Principles
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {principles.map((p, i) => (
              <ScrollReveal key={p.title} delay={i * 0.08}>
                <div
                  className="h-full rounded-[18px] p-6"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <p
                    className="mb-2 text-[10px] uppercase tracking-[0.18em]"
                    style={{ color: "rgba(16,185,129,0.68)", fontFamily: "var(--font-space-grotesk)" }}
                  >
                    Principle {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3
                    className="text-lg font-light mb-3"
                    style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.88)" }}
                  >
                    {p.title}
                  </h3>
                  <p
                    className="text-[15px] font-light leading-[1.85]"
                    style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-figtree)" }}
                  >
                    {p.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <ScrollReveal>
            <div className="mb-7 flex items-baseline gap-4">
              <span
                className="text-xs tracking-[0.2em]"
                style={{ color: "rgba(16, 185, 129, 0.4)", fontFamily: "var(--font-space-grotesk)" }}
              >
                03
              </span>
              <h2
                className="text-3xl font-light"
                style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255, 255, 255, 0.9)", letterSpacing: "-0.02em" }}
              >
                Timeline
              </h2>
            </div>
          </ScrollReveal>

          <div className="relative space-y-4 pl-0 md:pl-3">
            <span className="pointer-events-none absolute left-[14px] top-0 hidden h-full w-px bg-white/10 md:block" />
            {developerJournal.map((entry, i) => (
              <ScrollReveal key={`${entry.date}-${entry.title}`} delay={i * 0.04}>
                <article className="relative md:pl-10">
                  <span
                    className="absolute left-[8px] top-5 hidden h-3 w-3 rounded-full md:block"
                    style={{
                      background: entry.status === "Completed" ? "rgba(16,185,129,0.95)" : "rgba(234,179,8,0.95)",
                      boxShadow:
                        entry.status === "Completed"
                          ? "0 0 14px rgba(16,185,129,0.52)"
                          : "0 0 14px rgba(234,179,8,0.48)",
                    }}
                  />
                  <div
                    className="rounded-[18px] p-5 md:p-6"
                    style={{
                      background:
                        entry.status === "Completed"
                          ? "linear-gradient(150deg, rgba(255,255,255,0.024), rgba(16,185,129,0.04))"
                          : "linear-gradient(150deg, rgba(255,255,255,0.024), rgba(234,179,8,0.05))",
                      border:
                        entry.status === "Completed"
                          ? "1px solid rgba(16,185,129,0.16)"
                          : "1px solid rgba(234,179,8,0.2)",
                    }}
                  >
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span
                        className="rounded px-2.5 py-1 text-[10px] uppercase tracking-[0.14em]"
                        style={{
                          background: entry.status === "Completed" ? "rgba(16,185,129,0.11)" : "rgba(234,179,8,0.12)",
                          border:
                            entry.status === "Completed"
                              ? "1px solid rgba(16,185,129,0.24)"
                              : "1px solid rgba(234,179,8,0.28)",
                          color: entry.status === "Completed" ? "rgba(16,185,129,0.92)" : "rgba(251,191,36,0.94)",
                          fontFamily: "var(--font-space-grotesk)",
                        }}
                      >
                        {entry.status}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "rgba(255,255,255,0.34)", fontFamily: "var(--font-space-grotesk)" }}
                      >
                        {entry.date}
                      </span>
                    </div>
                    <h3
                      className="mb-3 text-lg font-light"
                      style={{ color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-instrument-serif)" }}
                    >
                      {entry.title}
                    </h3>
                    <p
                      className="text-[15px] leading-[1.85] font-light"
                      style={{ color: "rgba(255,255,255,0.47)", fontFamily: "var(--font-figtree)" }}
                    >
                      {entry.summary}
                    </p>
                    <p
                      className="mt-4 text-sm font-light"
                      style={{ color: "rgba(16,185,129,0.86)", fontFamily: "var(--font-space-grotesk)" }}
                    >
                      Dev briefing: {entry.briefing}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <ScrollReveal>
            <div className="mb-7 flex flex-wrap items-baseline gap-4">
              <span
                className="text-xs tracking-[0.2em]"
                style={{ color: "rgba(16, 185, 129, 0.4)", fontFamily: "var(--font-space-grotesk)" }}
              >
                04
              </span>
              <h2
                className="text-3xl font-light"
                style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255, 255, 255, 0.9)", letterSpacing: "-0.02em" }}
              >
                Launch Gate Board
              </h2>
              <p
                className="text-xs font-light"
                style={{ color: "rgba(255, 255, 255, 0.42)", fontFamily: "var(--font-space-grotesk)" }}
              >
                PASS (local) = validated local evidence profile. PASS = checklist gate closed.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-5 xl:grid-cols-[0.42fr_0.58fr]">
            <ScrollReveal>
              <div
                className="rounded-[20px] p-6"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <p
                  className="text-[10px] uppercase tracking-[0.18em]"
                  style={{ color: "rgba(16,185,129,0.78)", fontFamily: "var(--font-space-grotesk)" }}
                >
                  Gate Totals
                </p>
                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between rounded-[12px] p-3" style={{ background: "rgba(16,185,129,0.08)" }}>
                    <span className="text-xs" style={{ color: "rgba(16,185,129,0.9)", fontFamily: "var(--font-space-grotesk)" }}>PASS</span>
                    <span className="text-sm" style={{ color: "rgba(16,185,129,0.95)", fontFamily: "var(--font-space-grotesk)" }}>{passCount}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-[12px] p-3" style={{ background: "rgba(59,130,246,0.1)" }}>
                    <span className="text-xs" style={{ color: "rgba(59,130,246,0.9)", fontFamily: "var(--font-space-grotesk)" }}>PASS (local)</span>
                    <span className="text-sm" style={{ color: "rgba(96,165,250,0.95)", fontFamily: "var(--font-space-grotesk)" }}>{passLocalCount}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-[12px] p-3" style={{ background: "rgba(234,179,8,0.1)" }}>
                    <span className="text-xs" style={{ color: "rgba(234,179,8,0.92)", fontFamily: "var(--font-space-grotesk)" }}>In Progress</span>
                    <span className="text-sm" style={{ color: "rgba(251,191,36,0.95)", fontFamily: "var(--font-space-grotesk)" }}>{inProgressCount}</span>
                  </div>
                </div>
                <p
                  className="mt-5 text-sm leading-[1.75]"
                  style={{ color: "rgba(255,255,255,0.44)", fontFamily: "var(--font-figtree)" }}
                >
                  Companion EVM bootstrap remains the only active gate. VEILvm validator connectivity and private
                  admission controls are live and evidence-linked.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div
                className="rounded-[20px] p-6"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="space-y-4">
                  {launchBlockers.map((item, i) => (
                  <div
                    key={item.gate}
                    className="rounded-[14px] p-4"
                    style={{
                      background: "rgba(255,255,255,0.012)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      boxShadow: i === 0 ? "inset 0 0 0 1px rgba(255,255,255,0.03)" : "none",
                    }}
                  >
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span
                        className="rounded px-2.5 py-1 text-[10px] uppercase tracking-[0.14em]"
                        style={{
                          background:
                            item.status === "PASS"
                              ? "rgba(16,185,129,0.12)"
                              : item.status === "PASS (local)"
                                ? "rgba(59,130,246,0.14)"
                                : item.status === "In Progress"
                                  ? "rgba(234,179,8,0.14)"
                                  : "rgba(255,255,255,0.08)",
                          border:
                            item.status === "PASS"
                              ? "1px solid rgba(16,185,129,0.28)"
                              : item.status === "PASS (local)"
                                ? "1px solid rgba(59,130,246,0.3)"
                                : item.status === "In Progress"
                                  ? "1px solid rgba(234,179,8,0.3)"
                                  : "1px solid rgba(255,255,255,0.2)",
                          color:
                            item.status === "PASS"
                              ? "rgba(16,185,129,0.94)"
                              : item.status === "PASS (local)"
                                ? "rgba(96,165,250,0.96)"
                                : item.status === "In Progress"
                                  ? "rgba(251,191,36,0.96)"
                                  : "rgba(255,255,255,0.7)",
                          fontFamily: "var(--font-space-grotesk)",
                        }}
                      >
                        {item.status}
                      </span>
                      <h3
                        className="text-sm font-light"
                        style={{ color: "rgba(255,255,255,0.86)", fontFamily: "var(--font-instrument-serif)" }}
                      >
                        {item.gate}
                      </h3>
                    </div>
                    <p
                      className="text-sm leading-[1.8]"
                      style={{ color: "rgba(255,255,255,0.46)", fontFamily: "var(--font-figtree)" }}
                    >
                      {item.detail}
                    </p>
                  </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section>
          <ScrollReveal>
            <div className="mb-7 flex items-baseline gap-4">
              <span
                className="text-xs tracking-[0.2em]"
                style={{ color: "rgba(16, 185, 129, 0.4)", fontFamily: "var(--font-space-grotesk)" }}
              >
                05
              </span>
              <h2
                className="text-3xl font-light"
                style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255, 255, 255, 0.9)", letterSpacing: "-0.02em" }}
              >
                Recent Engineering Changes
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div
              className="rounded-[20px] p-5 md:p-6"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="space-y-3">
                {changelog.map((item, i) => {
                  const badge = typeBadge(item.type)
                  return (
                    <div
                      key={i}
                      className="flex flex-col gap-3 rounded-[14px] p-4 md:flex-row md:items-start md:gap-4"
                      style={{
                        background: "rgba(255,255,255,0.01)",
                        border: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <span
                        className="w-fit rounded px-2.5 py-1 text-[10px] uppercase tracking-[0.14em]"
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
                          className="text-sm font-light leading-[1.75]"
                          style={{ color: "rgba(255,255,255,0.62)", fontFamily: "var(--font-figtree)" }}
                        >
                          {item.change}
                        </p>
                        <p
                          className="mt-1 text-[11px]"
                          style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-space-grotesk)" }}
                        >
                          {item.date}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      <VeilFooter />
    </div>
  )
}

