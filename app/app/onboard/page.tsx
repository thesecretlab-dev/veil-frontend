"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import Link from "next/link"
import { VeilFooter, VeilHeader, FilmGrain } from "@/components/brand"

/* ═══════════════════════════════════════════════════════════════════════════
   VEIL NETWORK CITIZEN ONBOARDING
   
   10-stage flow (accepted-developer-e2e-flow.json):
   A0 — Accepted (enrollment token)
   A1 — Wallet Bind (connect + sign)
   A2 — Payment (AVAX observed)
   A3 — Provision (cloud instance)
   A4 — Codex Access (command channel)
   A5 — Network Nativized (peer + RPC)
   A6 — ANIMA Validated (runtime check)
   A7 — ZER0ID 8004 (passport verified)
   A8 — Validator Active (heartbeat)
   A9 — Markets Unlocked (terminal)
   
   Hard unlock: Markets locked until A6 + A7 + A8 all pass.
   ═══════════════════════════════════════════════════════════════════════════ */

type StageStatus = "pending" | "running" | "passed" | "failed" | "blocked"

interface StageState {
  id: string
  name: string
  status: StageStatus
  icon: string
  description: string
  detail: string
  evidence: Record<string, string> | null
  error: string | null
  startedAt: string | null
  updatedAt: string | null
}

const STAGE_DEFS: Omit<StageState, "status" | "evidence" | "error" | "startedAt" | "updatedAt">[] = [
  {
    id: "A0_ACCEPTED",
    name: "Accepted",
    icon: "⬡",
    description: "Developer enrollment verified",
    detail: "Your application has been reviewed and an enrollment token issued. This grants access to the VEIL network onboarding pipeline.",
  },
  {
    id: "A1_WALLET_BIND",
    name: "Wallet Bind",
    icon: "◈",
    description: "Connect and sign your wallet",
    detail: "Connect your wallet to cryptographically bind your identity to this enrollment. Sign the challenge to prove ownership.",
  },
  {
    id: "A2_PAYMENT",
    name: "Payment",
    icon: "◇",
    description: "AVAX payment observed on C-Chain",
    detail: "Send the required AVAX to the designated address. The network verifies your transaction on Avalanche C-Chain.",
  },
  {
    id: "A3_PROVISION",
    name: "Provision",
    icon: "▣",
    description: "Cloud infrastructure deployed",
    detail: "A dedicated cloud instance is provisioned for your validator node. This is your home on the network — sovereign compute.",
  },
  {
    id: "A4_CODEX_ACCESS",
    name: "Codex Access",
    icon: "⌘",
    description: "Command channel established",
    detail: "Codex runtime binds to your provisioned server. The command channel is verified through a transcript hash.",
  },
  {
    id: "A5_NETWORK_NATIVIZED",
    name: "Nativized",
    icon: "◎",
    description: "Joined the VEIL network",
    detail: "Your node identity is established, peer membership confirmed, and VEIL RPC health verified. You are now part of the network fabric.",
  },
  {
    id: "A6_ANIMA_VALIDATED",
    name: "ANIMA Validated",
    icon: "△",
    description: "Autonomous agent runtime verified",
    detail: "ANIMA validation suite confirms your node can participate in the agent ecosystem. Runtime checks, consensus probes, and liveness tests all pass.",
  },
  {
    id: "A7_ZEROID_8004",
    name: "ZER0ID Passport",
    icon: "ø",
    description: "Identity passport 8004 verified",
    detail: "Zero-knowledge identity verification through ZER0ID. Passport 8004 proves your humanity without revealing your identity. Privacy-preserving, cryptographically sound.",
  },
  {
    id: "A8_VALIDATOR_ACTIVE",
    name: "Validator Active",
    icon: "▽",
    description: "Actively validating on VEIL",
    detail: "Your validator node is live, weighted, and heartbeating. You are now contributing to network consensus and earning validation rewards.",
  },
  {
    id: "A9_MARKETS_UNLOCKED",
    name: "Markets Unlocked",
    icon: "◉",
    description: "Full network citizen — markets open",
    detail: "All gates passed. You have full access to VEIL prediction markets, governance, and the sovereign agent economy. Welcome, citizen.",
  },
]

const GATE_STAGES = ["A6_ANIMA_VALIDATED", "A7_ZEROID_8004", "A8_VALIDATOR_ACTIVE"]

/* ═══════════════════════════════════════════════════════════════
   VISUAL COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function Typewriter({ text, delay = 0, speed = 25, onComplete, className = "" }: {
  text: string; delay?: number; speed?: number; onComplete?: () => void; className?: string
}) {
  const [displayed, setDisplayed] = useState("")
  const [started, setStarted] = useState(false)

  useEffect(() => {
    setDisplayed("")
    setStarted(false)
    const timer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timer)
  }, [text, delay])

  useEffect(() => {
    if (!started) return
    if (displayed.length >= text.length) { onComplete?.(); return }
    const timer = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), speed)
    return () => clearTimeout(timer)
  }, [started, displayed, text, speed, onComplete])

  return (
    <span className={className}>
      {displayed}
      {started && displayed.length < text.length && (
        <span className="inline-block w-[2px] h-[1em] ml-0.5 align-middle"
          style={{ background: "rgba(16,185,129,0.6)", animation: "blink 0.8s step-end infinite" }} />
      )}
    </span>
  )
}

function PulseRing({ size = 80 }: { size?: number }) {
  return (
    <div className="absolute" style={{ width: size, height: size, left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
      {[0, 1, 2].map(i => (
        <div key={i} className="absolute inset-0 rounded-full" style={{
          border: "1px solid rgba(16,185,129,0.12)",
          animation: `pulse-ring 3s ease-out ${i * 1}s infinite`,
        }} />
      ))}
    </div>
  )
}

function ZKHashStream({ active, lines = 6 }: { active: boolean; lines?: number }) {
  const [hashes, setHashes] = useState<string[]>([])

  useEffect(() => {
    if (!active) { setHashes([]); return }
    const interval = setInterval(() => {
      const hash = "0x" + Array.from({ length: 16 }, () =>
        Math.floor(Math.random() * 16).toString(16)).join("")
      setHashes(prev => [...prev.slice(-(lines - 1)), hash])
    }, 100)
    return () => clearInterval(interval)
  }, [active, lines])

  if (!active || hashes.length === 0) return null

  return (
    <div className="font-mono text-[10px] leading-relaxed overflow-hidden" style={{ color: "rgba(16,185,129,0.2)", maxHeight: `${lines * 18}px` }}>
      {hashes.map((h, i) => (
        <motion.div key={`${h}-${i}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.15 }}>{h}</motion.div>
      ))}
    </div>
  )
}

function HexGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.025 }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hex" width="56" height="100" patternUnits="userSpaceOnUse">
            <path d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100" fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex)" />
      </svg>
    </div>
  )
}

function GateLock({ locked }: { locked: boolean }) {
  return (
    <motion.div
      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.2em] font-[var(--font-space-grotesk)] ${
        locked
          ? "border-red-500/20 bg-red-500/[0.04] text-red-400/70"
          : "border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-400"
      }`}
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <span className="text-base">{locked ? "🔒" : "🔓"}</span>
      <span>{locked ? "Markets Locked" : "Markets Unlocked"}</span>
    </motion.div>
  )
}

function StatusIcon({ status }: { status: StageStatus }) {
  if (status === "passed") return <span className="text-emerald-400">✓</span>
  if (status === "failed") return <span className="text-red-400">✕</span>
  if (status === "running") return (
    <motion.span className="text-amber-400" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>⟳</motion.span>
  )
  if (status === "blocked") return <span className="text-white/15">⊘</span>
  return <span className="text-white/20">○</span>
}

const statusColors: Record<StageStatus, string> = {
  pending: "border-white/[0.06] bg-white/[0.015]",
  running: "border-amber-500/20 bg-amber-500/[0.03]",
  passed: "border-emerald-500/15 bg-emerald-500/[0.02]",
  failed: "border-red-500/20 bg-red-500/[0.03]",
  blocked: "border-white/[0.04] bg-white/[0.008]",
}

const statusBadgeColors: Record<StageStatus, string> = {
  pending: "border-white/20 text-white/40",
  running: "border-amber-400/30 bg-amber-500/10 text-amber-300",
  passed: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
  failed: "border-red-400/30 bg-red-500/10 text-red-300",
  blocked: "border-white/10 text-white/20",
}

/* ═══════════════════════════════════════════════════════════════
   STAGE CARD
   ═══════════════════════════════════════════════════════════════ */

function StageCard({ stage, index, isActive, isGate, onClick }: {
  stage: StageState; index: number; isActive: boolean; isGate: boolean; onClick: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        onClick={onClick}
        className={`group relative cursor-pointer rounded-[20px] border p-6 transition-all duration-300 ${statusColors[stage.status]} ${
          isActive ? "ring-1 ring-emerald-500/20" : ""
        } hover:border-emerald-500/15 hover:bg-emerald-500/[0.015]`}
      >
        {/* Gate indicator */}
        {isGate && (
          <div className="absolute -top-2 right-4">
            <span className="rounded-full border border-emerald-500/20 bg-[#060606] px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-emerald-500/50 font-[var(--font-space-grotesk)]">
              Gate
            </span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[12px] border border-white/[0.06] bg-white/[0.02]">
              <span className={`text-lg ${stage.status === "passed" ? "text-emerald-400" : stage.status === "running" ? "text-amber-400" : "text-white/30"}`}>
                {stage.icon}
              </span>
            </div>
            <div>
              <p className="font-[var(--font-space-grotesk)] text-[10px] uppercase tracking-[0.2em] text-white/30">
                {stage.id.replace(/_/g, " · ")}
              </p>
              <h3 className="font-[var(--font-space-grotesk)] text-sm font-medium tracking-tight text-white/85">
                {stage.name}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusIcon status={stage.status} />
            <span className={`rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] ${statusBadgeColors[stage.status]}`}>
              {stage.status}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="font-[var(--font-figtree)] text-[13px] text-white/40 leading-relaxed">
          {stage.description}
        </p>

        {/* Running indicator */}
        {stage.status === "running" && (
          <motion.div className="mt-3 h-[2px] rounded-full bg-amber-500/20 overflow-hidden">
            <motion.div
              className="h-full w-1/3 rounded-full bg-amber-400/60"
              animate={{ x: ["-100%", "400%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        )}

        {/* Evidence */}
        {stage.status === "passed" && stage.evidence && (
          <div className="mt-3 rounded-[12px] border border-emerald-500/10 bg-emerald-500/[0.02] p-3">
            <p className="mb-1 text-[9px] uppercase tracking-[0.2em] text-emerald-500/40 font-[var(--font-space-grotesk)]">Evidence</p>
            {Object.entries(stage.evidence).map(([k, v]) => (
              <p key={k} className="font-mono text-[11px] text-emerald-400/50 truncate">
                <span className="text-emerald-400/30">{k}:</span> {v}
              </p>
            ))}
          </div>
        )}

        {/* Error */}
        {stage.status === "failed" && stage.error && (
          <div className="mt-3 rounded-[12px] border border-red-500/15 bg-red-500/[0.03] p-3">
            <p className="font-mono text-[11px] text-red-400/70">{stage.error}</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   STAGE DETAIL PANEL
   ═══════════════════════════════════════════════════════════════ */

function StageDetail({ stage, onAction }: { stage: StageState; onAction: (action: string) => void }) {
  return (
    <motion.div
      key={stage.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="rounded-[20px] border border-white/[0.06] bg-white/[0.015] p-8"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className={`flex h-14 w-14 items-center justify-center rounded-[16px] border ${
          stage.status === "passed" ? "border-emerald-500/20 bg-emerald-500/[0.06]" :
          stage.status === "running" ? "border-amber-500/20 bg-amber-500/[0.06]" :
          "border-white/[0.06] bg-white/[0.02]"
        }`}>
          <span className={`text-2xl ${
            stage.status === "passed" ? "text-emerald-400" :
            stage.status === "running" ? "text-amber-400" :
            "text-white/30"
          }`}>{stage.icon}</span>
        </div>
        <div>
          <p className="font-[var(--font-space-grotesk)] text-[11px] uppercase tracking-[0.2em] text-white/30">
            {stage.id.replace(/_/g, " · ")}
          </p>
          <h2 className="font-[var(--font-instrument-serif)] text-2xl tracking-tight text-white/90">{stage.name}</h2>
        </div>
      </div>

      <p className="font-[var(--font-figtree)] text-sm leading-relaxed text-white/45 mb-6">
        {stage.detail}
      </p>

      {/* ZK stream for running crypto stages */}
      {stage.status === "running" && ["A6_ANIMA_VALIDATED", "A7_ZEROID_8004"].includes(stage.id) && (
        <div className="mb-6 rounded-[14px] border border-white/[0.04] bg-[#060606] p-4 relative overflow-hidden">
          <PulseRing size={60} />
          <ZKHashStream active={true} lines={8} />
        </div>
      )}

      {/* Action buttons per stage */}
      {stage.status === "pending" && stage.id === "A1_WALLET_BIND" && (
        <button
          onClick={() => onAction("connect_wallet")}
          className="group relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-3.5 font-[var(--font-space-grotesk)] text-sm font-medium text-white transition-all hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]"
        >
          <span className="relative z-10">Connect Wallet</span>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-0 transition-opacity group-hover:opacity-100" />
        </button>
      )}

      {stage.status === "pending" && stage.id === "A2_PAYMENT" && (
        <div className="space-y-4">
          <div className="rounded-[14px] border border-emerald-500/15 bg-emerald-500/[0.03] p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-500/50 font-[var(--font-space-grotesk)] mb-2">Send AVAX to</p>
            <p className="font-mono text-sm text-emerald-400/80 break-all">0x9378...EED6</p>
            <p className="mt-2 text-[11px] text-white/30">Minimum: 0.1 AVAX · Target: ~$100 USD equivalent</p>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-white/30 font-[var(--font-space-grotesk)] mb-2">
              Payment Transaction Hash
            </label>
            <input
              placeholder="0x..."
              className="w-full rounded-[14px] border border-white/[0.08] bg-[#060606] px-4 py-3 font-mono text-xs text-white/80 outline-none transition focus:border-emerald-500/30 placeholder:text-white/15"
            />
          </div>
          <button
            onClick={() => onAction("verify_payment")}
            className="rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-6 py-2.5 font-[var(--font-space-grotesk)] text-sm text-emerald-400/80 transition-all hover:border-emerald-500/40 hover:text-emerald-400"
          >
            Verify Payment
          </button>
        </div>
      )}

      {stage.status === "pending" && stage.id === "A7_ZEROID_8004" && (
        <button
          onClick={() => onAction("start_zeroid")}
          className="group relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-3.5 font-[var(--font-space-grotesk)] text-sm font-medium text-white transition-all hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]"
        >
          <span className="relative z-10">Begin ZER0ID Verification</span>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-0 transition-opacity group-hover:opacity-100" />
        </button>
      )}

      {stage.status === "failed" && (
        <button
          onClick={() => onAction("retry")}
          className="rounded-full border border-red-500/20 bg-red-500/[0.04] px-6 py-2.5 font-[var(--font-space-grotesk)] text-sm text-red-400/80 transition-all hover:border-red-500/40 hover:text-red-400"
        >
          Retry Stage
        </button>
      )}

      {/* Timestamps */}
      {(stage.startedAt || stage.updatedAt) && (
        <div className="mt-6 flex gap-6 text-[11px] text-white/20 font-mono">
          {stage.startedAt && <span>Started: {new Date(stage.startedAt).toLocaleString()}</span>}
          {stage.updatedAt && <span>Updated: {new Date(stage.updatedAt).toLocaleString()}</span>}
        </div>
      )}
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PROGRESS SPINE
   ═══════════════════════════════════════════════════════════════ */

function ProgressSpine({ stages, activeIndex }: { stages: StageState[]; activeIndex: number }) {
  const passedCount = stages.filter(s => s.status === "passed").length
  const progress = (passedCount / stages.length) * 100

  return (
    <div className="flex items-center gap-1">
      {stages.map((stage, i) => (
        <div key={stage.id} className="flex items-center">
          <div className={`h-2 w-2 rounded-full transition-all duration-500 ${
            stage.status === "passed" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" :
            stage.status === "running" ? "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.4)]" :
            stage.status === "failed" ? "bg-red-500" :
            "bg-white/10"
          } ${i === activeIndex ? "scale-150" : ""}`} />
          {i < stages.length - 1 && (
            <div className={`h-[1px] w-4 transition-all duration-500 ${
              stage.status === "passed" ? "bg-emerald-500/40" : "bg-white/[0.06]"
            }`} />
          )}
        </div>
      ))}
      <span className="ml-3 font-mono text-[11px] text-white/25">{passedCount}/{stages.length}</span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function OnboardPage() {
  // Simulated state — in production this comes from the backend API
  const [stages, setStages] = useState<StageState[]>(() =>
    STAGE_DEFS.map((def, i) => ({
      ...def,
      status: (i === 0 ? "passed" : i === 1 ? "running" : "blocked") as StageStatus,
      evidence: i === 0 ? { acceptance_record_id: "dev_28fk3m", issued_at: "2026-02-24T03:20:00Z" } : null,
      error: null,
      startedAt: i <= 1 ? "2026-02-24T03:20:00Z" : null,
      updatedAt: i <= 1 ? "2026-02-24T03:22:00Z" : null,
    }))
  )

  const [activeStageIndex, setActiveStageIndex] = useState(1)
  const activeStage = stages[activeStageIndex]

  const marketsLocked = useMemo(() => {
    return !GATE_STAGES.every(gateId => stages.find(s => s.id === gateId)?.status === "passed")
  }, [stages])

  // Simulated progress for demo
  const advanceStage = useCallback((action: string) => {
    setStages(prev => {
      const next = [...prev]
      const currentRunning = next.findIndex(s => s.status === "running")
      if (currentRunning >= 0) {
        next[currentRunning] = {
          ...next[currentRunning],
          status: "passed",
          evidence: { verified: "true", timestamp: new Date().toISOString() },
          updatedAt: new Date().toISOString(),
        }
        if (currentRunning + 1 < next.length) {
          next[currentRunning + 1] = {
            ...next[currentRunning + 1],
            status: "running",
            startedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          // Unblock subsequent stages
          for (let i = currentRunning + 2; i < next.length; i++) {
            if (next[i].status === "blocked") {
              next[i] = { ...next[i], status: "pending" }
            }
          }
          setActiveStageIndex(currentRunning + 1)
        }
      }
      return next
    })
  }, [])

  const [heroComplete, setHeroComplete] = useState(false)

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <FilmGrain />
      <HexGrid />
      <VeilHeader />

      {/* Ambient glow */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-emerald-500/[0.02] blur-[160px]" />

      {/* ─── Hero ─── */}
      <div className="relative pt-28 pb-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-4 font-[var(--font-figtree)] text-[11px] uppercase tracking-[0.3em] text-emerald-500/50"
          >
            Network Onboarding
          </motion.p>
          <h1 className="font-[var(--font-instrument-serif)] text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] tracking-tight text-white/95">
            <Typewriter text="Become a Network Citizen" delay={300} speed={35} onComplete={() => setHeroComplete(true)} />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={heroComplete ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl font-[var(--font-figtree)] text-base leading-relaxed text-white/30"
          >
            Ten stages from stranger to sovereign participant. Provision your infrastructure,
            prove your identity, validate your node, and unlock the market economy.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={heroComplete ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex items-center justify-center gap-6"
          >
            <GateLock locked={marketsLocked} />
          </motion.div>
        </div>
      </div>

      {/* ─── Progress Spine ─── */}
      <div className="sticky top-0 z-40 border-b border-white/[0.04] bg-[#060606]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
          <ProgressSpine stages={stages} activeIndex={activeStageIndex} />
          <div className="flex items-center gap-3">
            <span className="font-[var(--font-space-grotesk)] text-[11px] uppercase tracking-[0.14em] text-white/25">
              {activeStage.name}
            </span>
            <span className={`h-1.5 w-1.5 rounded-full ${
              activeStage.status === "running" ? "bg-amber-400 animate-pulse" :
              activeStage.status === "passed" ? "bg-emerald-400" : "bg-white/15"
            }`} />
          </div>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">
          {/* Stage Cards */}
          <div className="space-y-4">
            {stages.map((stage, i) => (
              <StageCard
                key={stage.id}
                stage={stage}
                index={i}
                isActive={i === activeStageIndex}
                isGate={GATE_STAGES.includes(stage.id)}
                onClick={() => setActiveStageIndex(i)}
              />
            ))}
          </div>

          {/* Detail Panel (sticky on desktop) */}
          <div className="lg:sticky lg:top-16 lg:self-start">
            <AnimatePresence mode="wait">
              <StageDetail
                key={activeStage.id}
                stage={activeStage}
                onAction={advanceStage}
              />
            </AnimatePresence>

            {/* Gate Status */}
            <div className="mt-4 rounded-[20px] border border-white/[0.04] bg-white/[0.01] p-5">
              <p className="mb-3 font-[var(--font-space-grotesk)] text-[10px] uppercase tracking-[0.2em] text-white/25">
                Market Unlock Gates
              </p>
              {GATE_STAGES.map(gateId => {
                const gate = stages.find(s => s.id === gateId)!
                return (
                  <div key={gateId} className="flex items-center justify-between py-2 border-b border-white/[0.03] last:border-0">
                    <span className="font-[var(--font-figtree)] text-[12px] text-white/40">{gate.name}</span>
                    <StatusIcon status={gate.status} />
                  </div>
                )
              })}
              <div className="mt-3 flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${marketsLocked ? "bg-red-500/50" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"}`} />
                <span className="font-[var(--font-space-grotesk)] text-[11px] uppercase tracking-[0.14em] text-white/30">
                  {marketsLocked ? "Markets remain locked" : "All gates passed — markets open"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <VeilFooter />

      <style jsx global>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
