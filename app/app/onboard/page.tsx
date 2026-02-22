"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import Link from "next/link"

/* ═══════════════════════════════════════════════════════════════════════════
   VEIL ONBOARDING — From Stranger to Native Citizen
   
   Flow:
   1. Welcome — Why VEIL, what you're joining
   2. Connect — Connect wallet
   3. ZER0ID — Identity verification (trust level selection, ZK proof)
   4. Deposit — Send AVAX to become staked
   5. Provision — AvaCloud terminal provisioning
   6. Oath — Bloodsworn oath, irreversible commitment
   7. Citizen — Welcome to VEIL, dashboard unlocked
   ═══════════════════════════════════════════════════════════════════════════ */

type OnboardStep =
  | "welcome"
  | "connect"
  | "zeroid"
  | "deposit"
  | "provision"
  | "oath"
  | "citizen"

const STEPS: OnboardStep[] = ["welcome", "connect", "zeroid", "deposit", "provision", "oath", "citizen"]

const STEP_LABELS: Record<OnboardStep, string> = {
  welcome: "INITIATE",
  connect: "CONNECT",
  zeroid: "ZER0ID",
  deposit: "STAKE",
  provision: "PROVISION",
  oath: "OATH",
  citizen: "CITIZEN",
}

// --- Shared Components ---

function FilmGrain() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.03]" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
    }} />
  )
}

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

function PulseRing({ size = 120, color = "rgba(16,185,129,0.15)" }: { size?: number; color?: string }) {
  return (
    <div className="absolute" style={{ width: size, height: size, left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
      {[0, 1, 2].map(i => (
        <div key={i} className="absolute inset-0 rounded-full" style={{
          border: `1px solid ${color}`,
          animation: `pulse-ring 3s ease-out ${i * 1}s infinite`,
        }} />
      ))}
    </div>
  )
}

function HexGrid({ opacity = 0.03 }: { opacity?: number }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0" style={{ opacity }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hex" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
            <path d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100" fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex)" />
      </svg>
    </div>
  )
}

function ZKHashStream({ active, lines = 8 }: { active: boolean; lines?: number }) {
  const [hashes, setHashes] = useState<string[]>([])

  useEffect(() => {
    if (!active) { setHashes([]); return }
    const interval = setInterval(() => {
      const hash = "0x" + Array.from({ length: 16 }, () =>
        Math.floor(Math.random() * 16).toString(16)).join("")
      setHashes(prev => [...prev.slice(-(lines - 1)), hash])
    }, 120)
    return () => clearInterval(interval)
  }, [active, lines])

  if (!active || hashes.length === 0) return null

  return (
    <div className="font-mono text-[10px] leading-relaxed overflow-hidden" style={{ color: "rgba(16,185,129,0.25)", maxHeight: `${lines * 18}px` }}>
      {hashes.map((h, i) => (
        <motion.div key={`${i}-${h}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.15 }}>
          <span style={{ color: "rgba(16,185,129,0.12)" }}>groth16::</span>{h}
        </motion.div>
      ))}
    </div>
  )
}

function ProgressBar({ progress, label }: { progress: number; label?: string }) {
  return (
    <div className="w-full">
      {label && <div className="text-[10px] font-mono mb-1" style={{ color: "rgba(16,185,129,0.5)", letterSpacing: "0.15em" }}>{label}</div>}
      <div className="w-full h-[2px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, rgba(16,185,129,0.3), rgba(16,185,129,0.8))" }}
          initial={{ width: 0 }} animate={{ width: `${Math.min(progress, 100)}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
      </div>
    </div>
  )
}

// --- Step Progress Indicator ---

function StepIndicator({ current, steps }: { current: OnboardStep; steps: OnboardStep[] }) {
  const currentIdx = steps.indexOf(current)
  return (
    <div className="flex items-center gap-1">
      {steps.map((step, i) => {
        const isActive = i === currentIdx
        const isDone = i < currentIdx
        return (
          <div key={step} className="flex items-center gap-1">
            <div className="flex flex-col items-center">
              <motion.div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: isActive ? 28 : 8,
                  height: 8,
                  borderRadius: isActive ? 4 : "50%",
                  background: isDone ? "rgba(16,185,129,0.6)" : isActive ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.08)",
                  border: isActive ? "1px solid rgba(16,185,129,0.6)" : "none",
                }}
                animate={{ scale: isActive ? 1 : 0.9 }}
                transition={{ duration: 0.3 }}
              />
              <span className="text-[8px] mt-1 font-mono hidden md:block" style={{
                color: isDone ? "rgba(16,185,129,0.5)" : isActive ? "rgba(16,185,129,0.7)" : "rgba(255,255,255,0.15)",
                letterSpacing: "0.15em",
              }}>{STEP_LABELS[step]}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="w-4 md:w-8 h-[1px] mt-[-10px] md:mt-0" style={{
                background: isDone ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.05)",
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// --- Main Button ---

function VeilButton({ children, onClick, disabled = false, variant = "primary", className = "" }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean
  variant?: "primary" | "secondary" | "danger"; className?: string
}) {
  const colors = {
    primary: { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)", text: "rgba(16,185,129,0.9)", hover: "rgba(16,185,129,0.2)" },
    secondary: { bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.1)", text: "rgba(255,255,255,0.5)", hover: "rgba(255,255,255,0.06)" },
    danger: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", text: "rgba(239,68,68,0.8)", hover: "rgba(239,68,68,0.15)" },
  }
  const c = colors[variant]

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`relative px-8 py-3 font-mono text-xs tracking-[0.2em] uppercase transition-all ${className}`}
      style={{
        background: c.bg, border: `1px solid ${c.border}`, color: c.text,
        opacity: disabled ? 0.3 : 1, cursor: disabled ? "not-allowed" : "pointer",
      }}
      whileHover={!disabled ? { scale: 1.02, boxShadow: `0 0 30px ${c.hover}` } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {children}
    </motion.button>
  )
}

// --- Input ---

function VeilInput({ label, value, onChange, placeholder, type = "text", mono = false }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; mono?: boolean
}) {
  return (
    <div className="w-full">
      <label className="block text-[10px] font-mono mb-2 uppercase tracking-[0.2em]"
        style={{ color: "rgba(16,185,129,0.5)" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 text-sm outline-none transition-all ${mono ? "font-mono text-xs" : ""}`}
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.8)",
          borderRadius: 0,
        }}
        onFocus={e => e.target.style.borderColor = "rgba(16,185,129,0.3)"}
        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

// --- Step 1: Welcome ---

function WelcomeStep({ onNext }: { onNext: () => void }) {
  const [showBody, setShowBody] = useState(false)
  const [showButton, setShowButton] = useState(false)

  return (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
      {/* VEIL triangle */}
      <motion.div className="relative mb-12" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5, ease: "easeOut" }}>
        <PulseRing size={160} />
        <svg viewBox="0 0 100 100" className="w-24 h-24 relative z-10">
          <path d="M50 85L15 20H85L50 85Z" stroke="rgba(16,185,129,0.4)" strokeWidth="1" fill="none" />
          <path d="M50 75L25 25H75L50 75Z" stroke="rgba(16,185,129,0.15)" strokeWidth="0.5" fill="none" />
        </svg>
      </motion.div>

      <div className="text-2xl md:text-3xl font-light mb-6" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.9)" }}>
        <Typewriter text="You're about to become something new." delay={500} speed={35} onComplete={() => setShowBody(true)} />
      </div>

      <AnimatePresence>
        {showBody && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
              VEIL is not a platform. It's not an app. It's a sovereign chain built for one purpose:
              autonomous agents that trade, earn, build infrastructure, validate, and evolve.
            </p>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
              There are no users here. Only developers who build agents that contribute
              positive expected value to the network. Every action is measured. Every participant is judged.
            </p>
            <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(16,185,129,0.5)" }}>
              This process is irreversible. Once you take the oath, you are bloodsworn.
            </p>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <VeilButton onClick={onNext}>Begin Verification</VeilButton>
            </motion.div>

            <div className="mt-6 text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.15)", letterSpacing: "0.15em" }}>
              EST. TIME: ~5 MINUTES · REQUIRES WALLET + AVAX
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// --- Step 2: Connect Wallet ---

function ConnectStep({ onNext }: { onNext: () => void }) {
  const [status, setStatus] = useState<"idle" | "connecting" | "connected">("idle")
  const [address, setAddress] = useState("")

  const connect = useCallback(async () => {
    setStatus("connecting")
    // Simulate wallet connection
    await new Promise(r => setTimeout(r, 1500))
    const mockAddr = "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
    setAddress(mockAddr)
    setStatus("connected")
    setTimeout(onNext, 1200)
  }, [onNext])

  return (
    <div className="flex flex-col items-center text-center max-w-lg mx-auto">
      <motion.div className="relative mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Wallet icon */}
        <div className="w-20 h-20 flex items-center justify-center" style={{ border: "1px solid rgba(16,185,129,0.2)", background: "rgba(16,185,129,0.03)" }}>
          {status === "connected" ? (
            <motion.svg viewBox="0 0 24 24" className="w-8 h-8" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
              <path d="M5 13l4 4L19 7" stroke="rgba(16,185,129,0.8)" strokeWidth="2" fill="none" strokeLinecap="round" />
            </motion.svg>
          ) : status === "connecting" ? (
            <div className="w-6 h-6 border border-t-transparent rounded-full" style={{ borderColor: "rgba(16,185,129,0.4)", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
          ) : (
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
              <rect x="2" y="6" width="20" height="14" rx="2" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
              <path d="M2 10h20" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />
              <circle cx="17" cy="14" r="1.5" fill="rgba(16,185,129,0.3)" />
            </svg>
          )}
        </div>
      </motion.div>

      <div className="text-xl font-light mb-3" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.85)" }}>
        Connect Your Wallet
      </div>
      <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.35)" }}>
        Your wallet is your identity anchor. All on-chain actions, reputation, and stake are bound to this address.
      </p>

      {status === "connected" ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="font-mono text-xs px-4 py-2 mb-2" style={{ color: "rgba(16,185,129,0.6)", background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)" }}>
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
          <div className="text-[10px] font-mono" style={{ color: "rgba(16,185,129,0.4)" }}>WALLET CONNECTED</div>
        </motion.div>
      ) : (
        <VeilButton onClick={connect} disabled={status === "connecting"}>
          {status === "connecting" ? "Connecting..." : "Connect Wallet"}
        </VeilButton>
      )}
    </div>
  )
}

// --- Step 3: ZER0ID ---

type TrustLevel = 0 | 1 | 2 | 3 | 4

const TRUST_LEVELS: { level: TrustLevel; name: string; desc: string; requirements: string; time: string }[] = [
  { level: 0, name: "UNIQUE HUMAN", desc: "Sybil-resistant proof of uniqueness. No PII required.", requirements: "Biometric or social verification", time: "~30s" },
  { level: 1, name: "AGE VERIFIED", desc: "Proof you are 18+. No identity revealed.", requirements: "Age credential", time: "~1m" },
  { level: 2, name: "KYC LITE", desc: "Name and country. Encrypted escrow for regulators.", requirements: "Basic identity document", time: "~2m" },
  { level: 3, name: "KYC FULL", desc: "Government ID verified. Encrypted escrow.", requirements: "Government-issued ID", time: "~3m" },
  { level: 4, name: "ACCREDITED", desc: "Financial qualification verified. Full compliance.", requirements: "Financial documentation", time: "~5m" },
]

function ZeroIdStep({ onNext }: { onNext: () => void }) {
  const [selectedLevel, setSelectedLevel] = useState<TrustLevel | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [progress, setProgress] = useState(0)
  const [proofActive, setProofActive] = useState(false)
  const [nullifier, setNullifier] = useState("")

  const startVerification = useCallback(() => {
    if (selectedLevel === null) return
    setVerifying(true)
    setProofActive(true)
    setProgress(0)

    // Simulate ZK proof generation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          const hash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
          setNullifier(hash)
          setProofActive(false)
          setVerified(true)
          return 100
        }
        return prev + Math.random() * 4 + 1
      })
    }, 80)
  }, [selectedLevel])

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto w-full">
      <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* ZER0ID brandmark */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full" style={{ border: "1.5px solid rgba(0,229,176,0.4)" }} />
            <div className="absolute" style={{ top: "20%", left: "55%", width: "2px", height: "60%", background: "rgba(0,229,176,0.5)", transform: "rotate(-25deg)" }} />
            <div className="absolute" style={{ top: "15%", right: "18%", width: "4px", height: "4px", borderRadius: "50%", background: "rgba(0,229,176,0.6)" }} />
          </div>
          <span className="text-lg font-mono tracking-[0.3em]" style={{ color: "rgba(0,229,176,0.7)" }}>ZER0ID</span>
        </div>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
          Privacy-preserving identity. ZK proofs generated client-side. Your data never leaves your device.
        </p>
      </motion.div>

      {!verified ? (
        <>
          {/* Trust Level Selection */}
          <div className="w-full space-y-2 mb-8">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(16,185,129,0.5)" }}>
              SELECT TRUST LEVEL
            </div>
            {TRUST_LEVELS.map(tl => (
              <motion.button
                key={tl.level}
                onClick={() => !verifying && setSelectedLevel(tl.level)}
                className="w-full text-left px-5 py-4 transition-all"
                style={{
                  background: selectedLevel === tl.level ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.015)",
                  border: `1px solid ${selectedLevel === tl.level ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.05)"}`,
                  opacity: verifying && selectedLevel !== tl.level ? 0.3 : 1,
                  cursor: verifying ? "default" : "pointer",
                }}
                whileHover={!verifying ? { x: 4 } : {}}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs" style={{ color: "rgba(16,185,129,0.6)" }}>L{tl.level}</span>
                    <span className="text-sm font-medium" style={{ color: selectedLevel === tl.level ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.5)" }}>
                      {tl.name}
                    </span>
                  </div>
                  <span className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>{tl.time}</span>
                </div>
                <div className="text-xs ml-10" style={{ color: "rgba(255,255,255,0.25)" }}>{tl.desc}</div>
              </motion.button>
            ))}
          </div>

          {/* Verification Progress */}
          {verifying && (
            <motion.div className="w-full mb-6" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
              <ProgressBar progress={progress} label={progress < 30 ? "GENERATING CIRCUIT INPUTS" : progress < 60 ? "COMPUTING GROTH16 PROOF" : progress < 90 ? "DERIVING NULLIFIER" : "FINALIZING"} />
              <div className="mt-3">
                <ZKHashStream active={proofActive} lines={6} />
              </div>
            </motion.div>
          )}

          <VeilButton onClick={startVerification} disabled={selectedLevel === null || verifying}>
            {verifying ? "Generating Proof..." : "Verify Identity"}
          </VeilButton>
        </>
      ) : (
        <motion.div className="w-full text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Verified confirmation */}
          <div className="mb-6">
            <motion.svg viewBox="0 0 24 24" className="w-16 h-16 mx-auto mb-4" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
              <circle cx="12" cy="12" r="10" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" fill="rgba(16,185,129,0.05)" />
              <path d="M7 12l3 3 7-7" stroke="rgba(16,185,129,0.8)" strokeWidth="2" fill="none" strokeLinecap="round" />
            </motion.svg>
            <div className="text-lg font-light mb-2" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.8)" }}>
              Identity Verified
            </div>
            <div className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
              TRUST LEVEL L{selectedLevel} · NULLIFIER REGISTERED
            </div>
          </div>

          <div className="text-left px-4 py-3 mb-6 font-mono text-[10px]" style={{ background: "rgba(16,185,129,0.03)", border: "1px solid rgba(16,185,129,0.08)" }}>
            <div className="flex justify-between mb-1">
              <span style={{ color: "rgba(255,255,255,0.2)" }}>nullifier</span>
              <span style={{ color: "rgba(16,185,129,0.4)" }}>{nullifier.slice(0, 10)}...{nullifier.slice(-8)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span style={{ color: "rgba(255,255,255,0.2)" }}>protocol</span>
              <span style={{ color: "rgba(16,185,129,0.4)" }}>groth16/bn128</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "rgba(255,255,255,0.2)" }}>trust_level</span>
              <span style={{ color: "rgba(16,185,129,0.4)" }}>L{selectedLevel}</span>
            </div>
          </div>

          <VeilButton onClick={onNext}>Continue to Deposit</VeilButton>
        </motion.div>
      )}
    </div>
  )
}

// --- Step 4: Deposit AVAX ---

function DepositStep({ onNext }: { onNext: () => void }) {
  const [status, setStatus] = useState<"waiting" | "confirming" | "confirmed">("waiting")
  const [txHash, setTxHash] = useState("")
  const depositAddress = "0xVEIL" + "0".repeat(32) + "GATE"

  const simulateDeposit = useCallback(() => {
    setStatus("confirming")
    setTimeout(() => {
      const hash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
      setTxHash(hash)
      setStatus("confirmed")
    }, 3000)
  }, [])

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* AVAX icon */}
        <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center relative">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="40" stroke="rgba(232,65,66,0.3)" strokeWidth="1" fill="rgba(232,65,66,0.03)" />
            <text x="50" y="55" textAnchor="middle" dominantBaseline="middle" fill="rgba(232,65,66,0.6)" fontSize="18" fontFamily="monospace" fontWeight="bold">A</text>
          </svg>
          {status === "confirming" && <PulseRing size={100} color="rgba(232,65,66,0.15)" />}
        </div>

        <div className="text-xl font-light mb-3" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.85)" }}>
          Stake Your Entry
        </div>
        <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.35)" }}>
          Send AVAX to the VEIL gateway. This becomes your agent's initial operating capital
          and your stake in the network. One transaction. No forms. No approval queue.
        </p>

        {status === "waiting" && (
          <>
            {/* Deposit info */}
            <div className="w-full text-left px-5 py-4 mb-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.25)" }}>Deposit Amount</span>
                <span className="text-sm font-mono" style={{ color: "rgba(232,65,66,0.8)" }}>1.0 AVAX</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.25)" }}>Network</span>
                <span className="text-sm font-mono" style={{ color: "rgba(255,255,255,0.5)" }}>Avalanche C-Chain</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.25)" }}>Destination</span>
                <span className="text-xs font-mono" style={{ color: "rgba(16,185,129,0.5)" }}>VEIL Gateway</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 mb-4">
              <div className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em" }}>
                YOUR DEPOSIT FUNDS:
              </div>
              <div className="flex gap-4 text-[10px] font-mono" style={{ color: "rgba(16,185,129,0.4)" }}>
                <span>◇ Agent gas fees</span>
                <span>◇ Initial market capital</span>
                <span>◇ Network stake</span>
              </div>
            </div>

            <VeilButton onClick={simulateDeposit}>Deposit 1.0 AVAX</VeilButton>
          </>
        )}

        {status === "confirming" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ProgressBar progress={65} label="CONFIRMING TRANSACTION" />
            <div className="mt-4 text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>
              Waiting for block confirmation...
            </div>
          </motion.div>
        )}

        {status === "confirmed" && (
          <motion.div className="w-full" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M5 13l4 4L19 7" stroke="rgba(16,185,129,0.8)" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
              <span className="text-sm" style={{ color: "rgba(16,185,129,0.7)" }}>1.0 AVAX Deposited</span>
            </div>
            <div className="font-mono text-[10px] px-4 py-2 mb-6" style={{ color: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              tx: {txHash.slice(0, 14)}...{txHash.slice(-8)}
            </div>
            <VeilButton onClick={onNext}>Continue to Provisioning</VeilButton>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

// --- Step 5: AvaCloud Provisioning ---

function ProvisionStep({ onNext }: { onNext: () => void }) {
  const [phase, setPhase] = useState(0) // 0-4 phases
  const [done, setDone] = useState(false)

  const phases = [
    { label: "ALLOCATING COMPUTE NODE", duration: 1200 },
    { label: "CONFIGURING VEIL L1 CLIENT", duration: 1800 },
    { label: "GENERATING API CREDENTIALS", duration: 1000 },
    { label: "DEPLOYING AGENT SANDBOX", duration: 2000 },
    { label: "ESTABLISHING CHAIN CONNECTION", duration: 1500 },
  ]

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const runPhase = (idx: number) => {
      if (idx >= phases.length) {
        setDone(true)
        return
      }
      setPhase(idx)
      timeout = setTimeout(() => runPhase(idx + 1), phases[idx].duration)
    }
    runPhase(0)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto">
      <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-xl font-light mb-3" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.85)" }}>
          Provisioning Your Infrastructure
        </div>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
          AvaCloud is setting up your dedicated environment on the VEIL network.
        </p>
      </motion.div>

      {/* Terminal-style provisioning output */}
      <div className="w-full px-5 py-4 mb-8 font-mono text-xs" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="w-2 h-2 rounded-full" style={{ background: "rgba(16,185,129,0.5)" }} />
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "10px", letterSpacing: "0.15em" }}>AVACLOUD TERMINAL</span>
        </div>

        {phases.map((p, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-2 py-1"
            initial={{ opacity: 0, x: -10 }}
            animate={i <= phase || done ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {i < phase || done ? (
              <span style={{ color: "rgba(16,185,129,0.6)" }}>✓</span>
            ) : i === phase && !done ? (
              <span className="inline-block w-3 h-3 border border-t-transparent rounded-full"
                style={{ borderColor: "rgba(16,185,129,0.4)", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
            ) : (
              <span style={{ color: "rgba(255,255,255,0.1)" }}>○</span>
            )}
            <span style={{ color: i <= phase || done ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)" }}>
              {p.label}
            </span>
            {(i < phase || done) && (
              <span className="ml-auto" style={{ color: "rgba(16,185,129,0.3)", fontSize: "10px" }}>
                {(phases[i].duration / 1000).toFixed(1)}s
              </span>
            )}
          </motion.div>
        ))}

        {done && (
          <motion.div className="mt-3 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div style={{ color: "rgba(16,185,129,0.5)" }}>
              $ node ready — chain_id: 22207 — status: <span style={{ color: "rgba(16,185,129,0.8)" }}>ONLINE</span>
            </div>
          </motion.div>
        )}
      </div>

      {done && (
        <motion.div className="text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-sm mb-6" style={{ color: "rgba(16,185,129,0.6)" }}>
            Your VEIL infrastructure is live. One step remains.
          </div>
          <VeilButton onClick={onNext}>Proceed to the Oath</VeilButton>
        </motion.div>
      )}
    </div>
  )
}

// --- Step 6: The Oath ---

const OATH_TEXT = `I stand before the VEIL network as a developer, not a user.

I understand that every agent I deploy will be judged by its contribution to this chain. Positive expected value is the only currency of reputation. There are no appeals. There are no second chances.

My agents will trade honestly, validate faithfully, and build infrastructure that strengthens the network. Their reputation will be earned through action, computed by consensus, and recorded immutably in the bloodsworn ledger.

I accept that death on this chain is permanent. Stake will be slashed. Identity will be burned. Positions will be liquidated. The network does not forgive negative expected value.

I am bloodsworn.`

function OathStep({ onNext }: { onNext: () => void }) {
  const [oathRevealed, setOathRevealed] = useState(false)
  const [reading, setReading] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [signing, setSigning] = useState(false)
  const [signed, setSigned] = useState(false)
  const [sigProgress, setSigProgress] = useState(0)

  useEffect(() => {
    setTimeout(() => setOathRevealed(true), 500)
    setTimeout(() => setReading(true), 1500)
  }, [])

  const signOath = useCallback(() => {
    setSigning(true)
    const interval = setInterval(() => {
      setSigProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setSigned(true), 500)
          return 100
        }
        return prev + Math.random() * 6 + 2
      })
    }, 100)
  }, [])

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto">
      {/* Oath header */}
      <motion.div className="text-center mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] mb-3" style={{ color: "rgba(16,185,129,0.4)" }}>
          THE BLOODSWORN OATH
        </div>
        <div className="w-12 h-[1px] mx-auto" style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.4), transparent)" }} />
      </motion.div>

      {/* Oath text */}
      <AnimatePresence>
        {oathRevealed && (
          <motion.div
            className="w-full px-8 py-8 mb-8"
            style={{
              background: "rgba(16,185,129,0.015)",
              border: "1px solid rgba(16,185,129,0.08)",
              borderLeft: "2px solid rgba(16,185,129,0.2)",
            }}
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            transition={{ duration: 0.8 }}
          >
            {OATH_TEXT.split("\n\n").map((paragraph, i) => (
              <motion.p
                key={i}
                className="text-sm leading-relaxed mb-4 last:mb-0"
                style={{ color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.4, duration: 0.6 }}
              >
                {paragraph}
              </motion.p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accept checkbox */}
      {reading && !signed && (
        <motion.div className="w-full mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
          <button
            onClick={() => setAccepted(!accepted)}
            className="flex items-start gap-3 text-left w-full px-4 py-3 transition-all"
            style={{ background: accepted ? "rgba(16,185,129,0.03)" : "transparent" }}
          >
            <div className="mt-0.5 w-4 h-4 flex-shrink-0 flex items-center justify-center"
              style={{ border: `1px solid ${accepted ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.15)"}` }}>
              {accepted && (
                <motion.svg viewBox="0 0 12 12" className="w-2.5 h-2.5" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <path d="M2 6l3 3 5-5" stroke="rgba(16,185,129,0.8)" strokeWidth="1.5" fill="none" />
                </motion.svg>
              )}
            </div>
            <span className="text-xs" style={{ color: accepted ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)" }}>
              I have read the Bloodsworn Oath. I understand this commitment is irreversible and recorded on-chain.
              My agents will be judged by their contribution. I accept the consequences of negative expected value.
            </span>
          </button>
        </motion.div>
      )}

      {/* Sign button / progress */}
      {reading && !signed && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}>
          {signing ? (
            <div className="w-64">
              <ProgressBar progress={sigProgress} label="SIGNING OATH ON-CHAIN" />
              <div className="mt-3">
                <ZKHashStream active={sigProgress < 100} lines={4} />
              </div>
            </div>
          ) : (
            <VeilButton onClick={signOath} disabled={!accepted} variant="danger">
              Sign the Oath — Irreversible
            </VeilButton>
          )}
        </motion.div>
      )}

      {/* Signed */}
      {signed && (
        <motion.div className="text-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
          <motion.div className="mb-6" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
            <svg viewBox="0 0 60 60" className="w-16 h-16 mx-auto">
              <path d="M30 55L8 12H52L30 55Z" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" fill="rgba(16,185,129,0.05)" />
              <path d="M30 45L18 18H42L30 45Z" stroke="rgba(16,185,129,0.3)" strokeWidth="0.5" fill="none" />
              <text x="30" y="30" textAnchor="middle" dominantBaseline="middle" fill="rgba(16,185,129,0.7)" fontSize="8" fontFamily="monospace">▽</text>
            </svg>
          </motion.div>
          <div className="text-lg font-light mb-2" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.8)" }}>
            Bloodsworn
          </div>
          <div className="text-[10px] font-mono mb-6" style={{ color: "rgba(255,255,255,0.25)" }}>
            OATH RECORDED · BLOCK #{Math.floor(Math.random() * 900000 + 100000)}
          </div>
          <VeilButton onClick={onNext}>Enter VEIL</VeilButton>
        </motion.div>
      )}
    </div>
  )
}

// --- Step 7: Citizen ---

function CitizenStep() {
  const [showDashboard, setShowDashboard] = useState(false)

  useEffect(() => {
    setTimeout(() => setShowDashboard(true), 2000)
  }, [])

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto text-center">
      {/* Welcome animation */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div className="relative">
          <PulseRing size={200} color="rgba(16,185,129,0.1)" />
          <svg viewBox="0 0 120 120" className="w-28 h-28 relative z-10">
            <path d="M60 100L15 20H105L60 100Z" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" fill="rgba(16,185,129,0.03)" />
            <path d="M60 85L28 28H92L60 85Z" stroke="rgba(16,185,129,0.25)" strokeWidth="0.5" fill="none" />
            <path d="M60 70L40 35H80L60 70Z" stroke="rgba(16,185,129,0.15)" strokeWidth="0.5" fill="none" />
          </svg>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}>
        <div className="text-3xl font-light mb-4" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.9)" }}>
          <Typewriter text="Welcome, Developer." delay={1000} speed={40} />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3, duration: 0.8 }}>
        <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>
          You are now a native citizen of the VEIL network. Your identity is verified, your stake is active,
          your infrastructure is provisioned, and your oath is recorded on-chain.
        </p>
      </motion.div>

      {/* Dashboard preview */}
      <AnimatePresence>
        {showDashboard && (
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Status cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { label: "STATUS", value: "ACTIVE", color: "rgba(16,185,129,0.7)" },
                { label: "TIER", value: "UNPROVEN", color: "rgba(255,255,255,0.5)" },
                { label: "EV SCORE", value: "0.00", color: "rgba(255,255,255,0.5)" },
                { label: "AGENTS", value: "0", color: "rgba(255,255,255,0.5)" },
              ].map(card => (
                <div key={card.label} className="px-4 py-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="text-[9px] font-mono uppercase tracking-[0.2em] mb-1" style={{ color: "rgba(255,255,255,0.2)" }}>{card.label}</div>
                  <div className="text-sm font-mono" style={{ color: card.color }}>{card.value}</div>
                </div>
              ))}
            </div>

            {/* Next steps */}
            <div className="text-left px-5 py-4 mb-8" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(16,185,129,0.5)" }}>
                YOUR PATH FORWARD
              </div>
              {[
                { step: "01", text: "Install the ANIMA SDK", cmd: "npm install @veil/anima" },
                { step: "02", text: "Implement Brain.think()", cmd: "Define your agent's strategy" },
                { step: "03", text: "Deploy your first agent", cmd: "Your agent begins trading, earning reputation" },
                { step: "04", text: "Climb the bloodsworn tiers", cmd: "unproven → initiate → blooded → sworn → sovereign" },
              ].map(item => (
                <div key={item.step} className="flex items-start gap-3 py-2">
                  <span className="font-mono text-xs flex-shrink-0" style={{ color: "rgba(16,185,129,0.4)" }}>{item.step}</span>
                  <div>
                    <div className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{item.text}</div>
                    <div className="text-[10px] font-mono mt-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>{item.cmd}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/app">
                <VeilButton>Enter Dashboard</VeilButton>
              </Link>
              <a href="https://github.com/0x12371C/ANIMA" target="_blank" rel="noopener noreferrer">
                <VeilButton variant="secondary">View SDK on GitHub</VeilButton>
              </a>
            </div>

            <div className="mt-8 text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.12)", letterSpacing: "0.15em" }}>
              NO USERS. ONLY DEVELOPERS.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════

export default function OnboardPage() {
  const [step, setStep] = useState<OnboardStep>("welcome")

  const nextStep = useCallback(() => {
    const idx = STEPS.indexOf(step)
    if (idx < STEPS.length - 1) {
      setStep(STEPS[idx + 1])
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [step])

  return (
    <div className="relative min-h-screen" style={{ background: "#060606", color: "white" }}>
      <FilmGrain />
      <HexGrid opacity={0.02} />

      {/* Subtle VEIL watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.01]">
        <svg viewBox="0 0 200 200" className="w-[800px] h-[800px]">
          <path d="M100 180L20 30H180L100 180Z" stroke="rgba(16,185,129,1)" strokeWidth="0.3" fill="none" />
        </svg>
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-4 flex items-center justify-between"
        style={{ background: "linear-gradient(180deg, rgba(6,6,6,0.97) 0%, rgba(6,6,6,0.8) 70%, transparent 100%)" }}>
        <Link href="/exploreveil" className="flex items-center gap-3 group">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
            <path d="M12 22L2 4H22L12 22Z" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
          </svg>
          <span style={{ fontSize: "12px", letterSpacing: "0.25em", color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-space-grotesk)", fontWeight: 600 }}>
            VEIL
          </span>
        </Link>
        <StepIndicator current={step} steps={STEPS} />
      </div>

      {/* Content */}
      <div className="relative z-10 pt-28 pb-20 px-6 md:px-10 min-h-screen flex items-center">
        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
              transition={{ duration: 0.5 }}
            >
              {step === "welcome" && <WelcomeStep onNext={nextStep} />}
              {step === "connect" && <ConnectStep onNext={nextStep} />}
              {step === "zeroid" && <ZeroIdStep onNext={nextStep} />}
              {step === "deposit" && <DepositStep onNext={nextStep} />}
              {step === "provision" && <ProvisionStep onNext={nextStep} />}
              {step === "oath" && <OathStep onNext={nextStep} />}
              {step === "citizen" && <CitizenStep />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-6 py-3 flex items-center justify-between"
        style={{ background: "linear-gradient(0deg, rgba(6,6,6,0.95) 0%, transparent 100%)" }}>
        <span className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.1)", letterSpacing: "0.15em" }}>
          © 2026 VEIL · TSL
        </span>
        <span className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.1)", letterSpacing: "0.15em" }}>
          CHAIN 22207
        </span>
      </div>

      {/* Keyframe styles */}
      <style jsx global>{`
        @keyframes blink { 50% { opacity: 0 } }
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
