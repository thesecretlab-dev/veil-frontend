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

function ZKHashStream({ active, lines = 8, color = "16,185,129" }: { active: boolean; lines?: number; color?: string }) {
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
    <div className="font-mono text-[10px] leading-relaxed overflow-hidden" style={{ color: `rgba(${color},0.25)`, maxHeight: `${lines * 18}px` }}>
      {hashes.map((h, i) => (
        <motion.div key={`${i}-${h}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.15 }}>
          <span style={{ color: `rgba(${color},0.12)` }}>groth16::</span>{h}
        </motion.div>
      ))}
    </div>
  )
}

function ProgressBar({ progress, label, color = "16,185,129" }: { progress: number; label?: string; color?: string }) {
  return (
    <div className="w-full">
      {label && <div className="text-[10px] font-mono mb-1" style={{ color: `rgba(${color},0.5)`, letterSpacing: "0.15em" }}>{label}</div>}
      <div className="w-full h-[2px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, rgba(${color},0.3), rgba(${color},0.8))` }}
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
  variant?: "primary" | "secondary" | "danger" | "zeroid"; className?: string
}) {
  const colors = {
    primary: { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)", text: "rgba(16,185,129,0.9)", hover: "rgba(16,185,129,0.2)" },
    zeroid: { bg: "rgba(0,229,176,0.12)", border: "rgba(0,229,176,0.3)", text: "rgba(0,229,176,0.9)", hover: "rgba(0,229,176,0.2)" },
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

// --- Proof-of-Work Mining Engine ---

async function mineHashcash(
  challenge: string,
  difficulty: number, // leading zero bits required
  onProgress: (stats: { nonce: number; hashRate: number; bestBits: number; currentHash: string }) => void,
  signal: AbortSignal
): Promise<{ nonce: number; hash: string; iterations: number; timeMs: number }> {
  const encoder = new TextEncoder()
  const start = performance.now()
  let nonce = 0
  let bestBits = 0
  const batchSize = 2000 // hashes per yield to keep UI responsive

  while (!signal.aborted) {
    const batchStart = performance.now()
    for (let i = 0; i < batchSize; i++) {
      const data = encoder.encode(challenge + ":" + nonce)
      const hashBuf = await crypto.subtle.digest("SHA-256", data)
      const hashArr = new Uint8Array(hashBuf)

      // Count leading zero bits
      let zeroBits = 0
      for (const byte of hashArr) {
        if (byte === 0) { zeroBits += 8 }
        else {
          // Count leading zeros in this byte
          let b = byte
          while ((b & 0x80) === 0 && zeroBits < difficulty + 8) {
            zeroBits++
            b <<= 1
          }
          break
        }
      }

      const hashHex = "0x" + Array.from(hashArr, b => b.toString(16).padStart(2, "0")).join("")

      if (zeroBits > bestBits) bestBits = zeroBits

      if (zeroBits >= difficulty) {
        return {
          nonce,
          hash: hashHex,
          iterations: nonce + 1,
          timeMs: performance.now() - start,
        }
      }
      nonce++
    }

    // Report progress and yield to UI thread
    const elapsed = performance.now() - start
    const hashRate = Math.floor(nonce / (elapsed / 1000))
    const lastData = encoder.encode(challenge + ":" + (nonce - 1))
    const lastBuf = await crypto.subtle.digest("SHA-256", lastData)
    const lastArr = new Uint8Array(lastBuf)
    const lastHex = "0x" + Array.from(lastArr, b => b.toString(16).padStart(2, "0")).join("")
    onProgress({ nonce, hashRate, bestBits, currentHash: lastHex })

    // Yield to main thread
    await new Promise(r => setTimeout(r, 0))
  }

  throw new Error("Mining aborted")
}

function ZeroIdStep({ onNext }: { onNext: () => void }) {
  const [selectedLevel, setSelectedLevel] = useState<TrustLevel | null>(null)
  const [phase, setPhase] = useState<"level" | "signature" | "mining" | "proving" | "verified">("level")

  // Signature state
  const [sigChallenge, setSigChallenge] = useState("")
  const [signing, setSigning] = useState(false)
  const [signed, setSigned] = useState(false)
  const [signature, setSignature] = useState("")

  // Mining state
  const [miningChallenge, setMiningChallenge] = useState("")
  const [miningStats, setMiningStats] = useState<{ nonce: number; hashRate: number; bestBits: number; currentHash: string }>({ nonce: 0, hashRate: 0, bestBits: 0, currentHash: "" })
  const [miningResult, setMiningResult] = useState<{ nonce: number; hash: string; iterations: number; timeMs: number } | null>(null)
  const [miningStarted, setMiningStarted] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  // Difficulty: 20 bits = ~1M hashes avg, roughly 10-30s depending on device
  const DIFFICULTY = 20

  // Proving state
  const [progress, setProgress] = useState(0)
  const [proofActive, setProofActive] = useState(false)
  const [nullifier, setNullifier] = useState("")

  // Generate challenge on mount
  useEffect(() => {
    const nonce = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
    const ts = Math.floor(Date.now() / 1000)
    setSigChallenge(`VEIL ZER0ID VERIFICATION\n\nI am proving ownership of this wallet for the VEIL network.\n\nChain: 22207\nNonce: ${nonce}\nTimestamp: ${ts}\n\nThis signature does not authorize any transaction.`)
    setMiningChallenge(`veil:zeroid:${nonce}:${ts}:22207`)
  }, [])

  // Cleanup abort on unmount
  useEffect(() => {
    return () => { abortRef.current?.abort() }
  }, [])

  // Start signature
  const beginSignature = useCallback(() => {
    if (selectedLevel === null) return
    setPhase("signature")
  }, [selectedLevel])

  // Simulate wallet signature
  const signMessage = useCallback(() => {
    setSigning(true)
    setTimeout(() => {
      const sig = "0x" + Array.from({ length: 130 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
      setSignature(sig)
      setSigned(true)
      // After signing, move to mining
      setTimeout(() => {
        setPhase("mining")
      }, 1200)
    }, 2000)
  }, [])

  // Start PoW mining
  const startMining = useCallback(async () => {
    if (miningStarted) return
    setMiningStarted(true)
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const result = await mineHashcash(
        miningChallenge + ":" + signature.slice(0, 20),
        DIFFICULTY,
        (stats) => setMiningStats(stats),
        controller.signal
      )
      setMiningResult(result)
      // Transition to ZK proof generation
      setTimeout(() => {
        setPhase("proving")
        setProofActive(true)
        setProgress(0)
        const interval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval)
              setNullifier(result.hash)
              setProofActive(false)
              setTimeout(() => setPhase("verified"), 600)
              return 100
            }
            return prev + Math.random() * 4 + 1
          })
        }, 80)
      }, 1500)
    } catch {
      // Aborted
    }
  }, [miningChallenge, signature, miningStarted, DIFFICULTY])

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto w-full">
      {/* Header */}
      <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full" style={{ border: "1.5px solid rgba(0,229,176,0.4)" }} />
            <div className="absolute" style={{ top: "20%", left: "55%", width: "2px", height: "60%", background: "rgba(0,229,176,0.5)", transform: "rotate(-25deg)" }} />
            <div className="absolute" style={{ top: "15%", right: "18%", width: "4px", height: "4px", borderRadius: "50%", background: "rgba(0,229,176,0.6)" }} />
          </div>
          <span className="text-lg font-mono tracking-[0.3em]" style={{ color: "rgba(0,229,176,0.7)" }}>ZER0ID</span>
        </div>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
          {phase === "level" && "Select your trust level to begin identity verification."}
          {phase === "signature" && "Sign a message to prove wallet ownership."}
          {phase === "mining" && "Your browser is mining a proof-of-work hash collision."}
          {phase === "proving" && "Generating zero-knowledge proof..."}
          {phase === "verified" && "Identity verified. Proof sealed."}
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* === PHASE: Trust Level Selection === */}
        {phase === "level" && (
          <motion.div key="level" className="w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}>
            <div className="w-full space-y-2 mb-8">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(0,229,176,0.5)" }}>
                SELECT TRUST LEVEL
              </div>
              {TRUST_LEVELS.map(tl => (
                <motion.button
                  key={tl.level}
                  onClick={() => setSelectedLevel(tl.level)}
                  className="w-full text-left px-5 py-4 transition-all"
                  style={{
                    background: selectedLevel === tl.level ? "rgba(0,229,176,0.06)" : "rgba(255,255,255,0.015)",
                    border: `1px solid ${selectedLevel === tl.level ? "rgba(0,229,176,0.25)" : "rgba(255,255,255,0.05)"}`,
                    cursor: "pointer",
                  }}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs" style={{ color: "rgba(0,229,176,0.6)" }}>L{tl.level}</span>
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
            <div className="text-center">
              <VeilButton onClick={beginSignature} disabled={selectedLevel === null} variant="zeroid">
                Continue to Wallet Signature
              </VeilButton>
            </div>
          </motion.div>
        )}

        {/* === PHASE: Wallet Signature === */}
        {phase === "signature" && (
          <motion.div key="signature" className="w-full" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="w-full mb-6">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(0,229,176,0.5)" }}>
                SIGNATURE CHALLENGE
              </div>
              {/* Challenge message display */}
              <div className="w-full px-5 py-4 font-mono text-xs leading-relaxed whitespace-pre-wrap"
                style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>
                {sigChallenge}
              </div>
            </div>

            {!signed ? (
              <div className="text-center">
                <p className="text-xs mb-6" style={{ color: "rgba(255,255,255,0.25)" }}>
                  Your wallet will prompt you to sign this message. This proves you control the address
                  without making any transaction or spending gas.
                </p>
                <VeilButton onClick={signMessage} disabled={signing} variant="zeroid">
                  {signing ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 border border-t-transparent rounded-full"
                        style={{ borderColor: "rgba(0,229,176,0.6)", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
                      Awaiting Signature...
                    </span>
                  ) : "Sign Message"}
                </VeilButton>
              </div>
            ) : (
              <motion.div className="text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path d="M5 13l4 4L19 7" stroke="rgba(0,229,176,0.8)" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                  <span className="text-sm" style={{ color: "rgba(0,229,176,0.7)" }}>Message Signed</span>
                </div>
                <div className="font-mono text-[10px] px-4 py-2 mb-4 truncate max-w-md mx-auto"
                  style={{ color: "rgba(0,229,176,0.4)", background: "rgba(0,229,176,0.03)", border: "1px solid rgba(0,229,176,0.08)" }}>
                  {signature.slice(0, 24)}...{signature.slice(-12)}
                </div>
                <div className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>
                  PROCEEDING TO PROOF-OF-WORK PUZZLE...
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* === PHASE: Proof-of-Work Mining === */}
        {phase === "mining" && (
          <motion.div key="mining" className="w-full" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="mb-6">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] mb-2" style={{ color: "rgba(0,229,176,0.5)" }}>
                PROOF-OF-WORK CHALLENGE
              </div>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                Your browser must find a SHA-256 hash collision with {DIFFICULTY} leading zero bits.
                This burns real CPU cycles — proving computational commitment and preventing automated sybil attacks.
              </p>
            </div>

            {/* Challenge display */}
            <div className="w-full px-4 py-3 mb-6 font-mono text-xs"
              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="text-[9px] uppercase tracking-[0.2em] mb-2" style={{ color: "rgba(255,255,255,0.15)" }}>MINING CHALLENGE</div>
              <div className="break-all" style={{ color: "rgba(0,229,176,0.4)", fontSize: "10px" }}>
                SHA-256( {miningChallenge}:{signature.slice(0, 20)}:<span style={{ color: "rgba(0,229,176,0.7)" }}>nonce</span> )
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span style={{ color: "rgba(255,255,255,0.15)" }}>target:</span>
                <span style={{ color: "rgba(0,229,176,0.5)" }}>{"0".repeat(DIFFICULTY / 4)}{"x".repeat(64 - DIFFICULTY / 4)}</span>
                <span style={{ color: "rgba(255,255,255,0.1)" }}>({DIFFICULTY} leading zero bits)</span>
              </div>
            </div>

            {!miningStarted ? (
              <div className="text-center">
                <p className="text-xs mb-6" style={{ color: "rgba(255,255,255,0.25)" }}>
                  This will use your CPU for approximately 10–30 seconds.
                  Your browser will compute hundreds of thousands of hashes to find a valid collision.
                </p>
                <VeilButton onClick={startMining} variant="zeroid">
                  Begin Mining
                </VeilButton>
              </div>
            ) : !miningResult ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Live mining stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: "HASHES COMPUTED", value: miningStats.nonce.toLocaleString() },
                    { label: "HASH RATE", value: `${miningStats.hashRate.toLocaleString()} H/s` },
                    { label: "BEST MATCH", value: `${miningStats.bestBits}/${DIFFICULTY} bits` },
                  ].map(stat => (
                    <div key={stat.label} className="px-3 py-3 text-center" style={{ background: "rgba(0,229,176,0.02)", border: "1px solid rgba(0,229,176,0.06)" }}>
                      <div className="text-[8px] font-mono uppercase tracking-[0.2em] mb-1" style={{ color: "rgba(255,255,255,0.15)" }}>{stat.label}</div>
                      <div className="text-sm font-mono" style={{ color: "rgba(0,229,176,0.7)" }}>{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Progress bar based on best bits found */}
                <div className="mb-4">
                  <ProgressBar progress={(miningStats.bestBits / DIFFICULTY) * 100} color="0,229,176" label="COLLISION SEARCH PROGRESS" />
                </div>

                {/* Live hash stream */}
                <div className="w-full px-4 py-3 font-mono overflow-hidden" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.04)", maxHeight: "120px" }}>
                  <div className="text-[9px] uppercase tracking-[0.2em] mb-2" style={{ color: "rgba(255,255,255,0.1)" }}>LIVE HASH OUTPUT</div>
                  {miningStats.currentHash && (
                    <motion.div key={miningStats.nonce} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.1 }}>
                      <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.08)" }}>nonce:{miningStats.nonce} → </span>
                      <span className="text-[10px] break-all" style={{ 
                        color: miningStats.bestBits >= DIFFICULTY - 4 ? "rgba(0,229,176,0.6)" : "rgba(0,229,176,0.25)" 
                      }}>
                        <span style={{ color: "rgba(0,229,176,0.8)" }}>{miningStats.currentHash.slice(0, 2 + Math.floor(miningStats.bestBits / 4))}</span>
                        {miningStats.currentHash.slice(2 + Math.floor(miningStats.bestBits / 4))}
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* Mining animation */}
                <div className="flex items-center justify-center gap-3 mt-6">
                  <div className="w-4 h-4 border-2 border-t-transparent rounded-full"
                    style={{ borderColor: "rgba(0,229,176,0.5)", borderTopColor: "transparent", animation: "spin 0.6s linear infinite" }} />
                  <span className="text-xs font-mono" style={{ color: "rgba(0,229,176,0.5)" }}>
                    Mining in progress — do not close this tab
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div className="text-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M5 13l4 4L19 7" stroke="rgba(0,229,176,0.8)" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                  <span className="text-base" style={{ color: "rgba(0,229,176,0.8)" }}>Collision Found</span>
                </div>

                {/* Result details */}
                <div className="text-left px-4 py-3 mb-6 font-mono text-[10px]" style={{ background: "rgba(0,229,176,0.03)", border: "1px solid rgba(0,229,176,0.1)" }}>
                  <div className="flex justify-between mb-1">
                    <span style={{ color: "rgba(255,255,255,0.2)" }}>valid_hash</span>
                    <span className="break-all text-right max-w-[280px]" style={{ color: "rgba(0,229,176,0.6)" }}>{miningResult.hash.slice(0, 22)}...{miningResult.hash.slice(-8)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span style={{ color: "rgba(255,255,255,0.2)" }}>nonce</span>
                    <span style={{ color: "rgba(0,229,176,0.6)" }}>{miningResult.nonce.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span style={{ color: "rgba(255,255,255,0.2)" }}>iterations</span>
                    <span style={{ color: "rgba(0,229,176,0.6)" }}>{miningResult.iterations.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span style={{ color: "rgba(255,255,255,0.2)" }}>time</span>
                    <span style={{ color: "rgba(0,229,176,0.6)" }}>{(miningResult.timeMs / 1000).toFixed(1)}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "rgba(255,255,255,0.2)" }}>difficulty</span>
                    <span style={{ color: "rgba(0,229,176,0.6)" }}>{DIFFICULTY} bits</span>
                  </div>
                </div>

                <div className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>
                  BINDING TO ZK PROOF...
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* === PHASE: ZK Proof Generation === */}
        {phase === "proving" && (
          <motion.div key="proving" className="w-full text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mb-6">
              <div className="text-[9px] font-mono uppercase tracking-[0.5em] mb-2" style={{ color: "rgba(0,229,176,0.4)" }}>
                COMPUTING ZK-SNARK
              </div>
              <div className="text-xl" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.85)" }}>
                Generating Identity Proof
              </div>
            </div>
            <div className="max-w-md mx-auto mb-6">
              <ProgressBar progress={progress} color="0,229,176" label={
                progress < 25 ? "BINDING SIGNATURE TO NULLIFIER" :
                progress < 50 ? "COMPUTING GROTH16 WITNESS" :
                progress < 75 ? "GENERATING PROOF COMPONENTS" :
                progress < 95 ? "DERIVING PUBLIC SIGNALS" : "FINALIZING"
              } />
            </div>
            <div className="max-w-sm mx-auto">
              <ZKHashStream active={proofActive} lines={8} color="0,229,176" />
            </div>
          </motion.div>
        )}

        {/* === PHASE: Verified === */}
        {phase === "verified" && (
          <motion.div key="verified" className="w-full text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-6">
              <motion.svg viewBox="0 0 24 24" className="w-16 h-16 mx-auto mb-4" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                <circle cx="12" cy="12" r="10" stroke="rgba(0,229,176,0.4)" strokeWidth="1.5" fill="rgba(0,229,176,0.05)" />
                <path d="M7 12l3 3 7-7" stroke="rgba(0,229,176,0.8)" strokeWidth="2" fill="none" strokeLinecap="round" />
              </motion.svg>
              <div className="text-lg font-light mb-2" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(0,229,176,0.8)" }}>
                Identity Verified
              </div>
              <div className="font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                TRUST LEVEL L{selectedLevel} · WALLET SIGNED · POW MINED · NULLIFIER REGISTERED
              </div>
            </div>

            <div className="text-left px-4 py-3 mb-6 font-mono text-[10px]" style={{ background: "rgba(0,229,176,0.03)", border: "1px solid rgba(0,229,176,0.08)" }}>
              <div className="flex justify-between mb-1">
                <span style={{ color: "rgba(255,255,255,0.2)" }}>nullifier</span>
                <span style={{ color: "rgba(0,229,176,0.4)" }}>{nullifier.slice(0, 10)}...{nullifier.slice(-8)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span style={{ color: "rgba(255,255,255,0.2)" }}>signature</span>
                <span style={{ color: "rgba(0,229,176,0.4)" }}>{signature.slice(0, 10)}...{signature.slice(-8)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span style={{ color: "rgba(255,255,255,0.2)" }}>protocol</span>
                <span style={{ color: "rgba(0,229,176,0.4)" }}>groth16/bn128</span>
              </div>
              <div className="flex justify-between mb-1">
                <span style={{ color: "rgba(255,255,255,0.2)" }}>pow_iterations</span>
                <span style={{ color: "rgba(0,229,176,0.4)" }}>{miningResult ? miningResult.iterations.toLocaleString() : "—"}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span style={{ color: "rgba(255,255,255,0.2)" }}>pow_time</span>
                <span style={{ color: "rgba(0,229,176,0.4)" }}>{miningResult ? `${(miningResult.timeMs / 1000).toFixed(1)}s` : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "rgba(255,255,255,0.2)" }}>trust_level</span>
                <span style={{ color: "rgba(0,229,176,0.4)" }}>L{selectedLevel}</span>
              </div>
            </div>

            <VeilButton onClick={onNext} variant="zeroid">Continue to Deposit</VeilButton>
          </motion.div>
        )}
      </AnimatePresence>
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
            Your local VEIL setup is ready in preview mode. One step remains.
          </div>
          <VeilButton onClick={onNext}>Proceed to the Oath</VeilButton>
        </motion.div>
      )}
    </div>
  )
}

// --- Step 6: The Oath (full ceremony, inline) ---

function OathStep({ onNext }: { onNext: () => void }) {
  const [oathAccepted, setOathAccepted] = useState(false)
  const [signing, setSigning] = useState(false)
  const [sigProgress, setSigProgress] = useState(0)
  const [signed, setSigned] = useState(false)
  const [zkTxHash, setZkTxHash] = useState("")
  const [timestamp, setTimestamp] = useState("")

  const beginSigning = useCallback(() => {
    setSigning(true)
    setSigProgress(0)
    const interval = setInterval(() => {
      setSigProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          const hash = "0x" + Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16)).join("")
          setZkTxHash(hash)
          setTimestamp(new Date().toISOString())
          setTimeout(() => setSigned(true), 800)
          return 100
        }
        return prev + Math.random() * 8
      })
    }, 120)
  }, [])

  // Signing stage
  if (signing && !signed) {
    return (
      <div className="flex flex-col items-center max-w-2xl mx-auto text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="mb-10">
            <div className="text-[9px] uppercase tracking-[0.5em] mb-4" style={{ color: "rgba(16,185,129,0.4)", fontFamily: "var(--font-space-grotesk)" }}>
              GENERATING ZK-SNARK PROOF
            </div>
            <div className="text-3xl" style={{ fontFamily: "var(--font-instrument-serif, var(--font-space-grotesk))", color: "rgba(255,255,255,0.85)" }}>
              Sealing Your Oath
            </div>
          </div>
          <div className="max-w-md mx-auto mb-8">
            <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
              <motion.div className="h-full rounded-full" style={{ background: "rgba(16,185,129,0.6)", width: `${Math.min(sigProgress, 100)}%` }} />
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="font-mono text-xs" style={{ color: "rgba(16,185,129,0.4)" }}>
                {sigProgress < 30 ? "Generating witness..." : sigProgress < 60 ? "Computing Groth16 proof..." : sigProgress < 90 ? "Verifying on-chain..." : "Proof verified ✓"}
              </span>
              <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
                {Math.min(Math.floor(sigProgress), 100)}%
              </span>
            </div>
          </div>
          <div className="max-w-sm mx-auto">
            <ZKHashStream active={sigProgress < 100} lines={8} />
          </div>
        </motion.div>
      </div>
    )
  }

  // Verified stage
  if (signed) {
    return (
      <div className="flex flex-col items-center max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
          <div className="rounded-[24px] p-[1px]" style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05), rgba(16,185,129,0.2))",
          }}>
            <div className="rounded-[23px] p-8 md:p-12" style={{
              background: "#0a0a0a",
              boxShadow: "inset 0 1px 0 rgba(16,185,129,0.08), 0 0 80px rgba(16,185,129,0.05)",
            }}>
              {/* Verified seal */}
              <div className="text-center mb-8">
                <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}>
                  <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{
                    background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)",
                    boxShadow: "0 0 40px rgba(16,185,129,0.1)",
                  }}>
                    <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
                      <path d="M24 42L6 8H42L24 42Z" stroke="rgba(16,185,129,0.7)" strokeWidth="1.5" />
                      <motion.path d="M18 22L22 26L30 18" stroke="rgba(16,185,129,0.8)" strokeWidth="2" strokeLinecap="round"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.8 }} />
                    </svg>
                  </div>
                </motion.div>
                <div className="text-[9px] uppercase tracking-[0.5em] mt-6 mb-3" style={{ color: "rgba(16,185,129,0.5)", fontFamily: "var(--font-space-grotesk)" }}>
                  OATH VERIFIED · ZK-SNARK SEALED
                </div>
                <div className="text-3xl md:text-4xl" style={{ fontFamily: "var(--font-instrument-serif, var(--font-space-grotesk))", color: "rgba(255,255,255,0.92)" }}>
                  You are Bloodsworn.
                </div>
              </div>

              <div className="w-20 h-[1px] mx-auto mb-8" style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.25), transparent)" }} />

              {/* Credential details */}
              <div className="space-y-4 mb-8">
                {[
                  { label: "BLOODSWORN TIER", value: "UNPROVEN (GENESIS)" },
                  { label: "ZK PROOF TX", value: zkTxHash },
                  { label: "CHAIN", value: "VEIL L1 · 22207" },
                  { label: "TIMESTAMP", value: timestamp },
                ].map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-4 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <span style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "9px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)", flexShrink: 0 }}>
                      {row.label}
                    </span>
                    <span className="font-mono text-xs text-right truncate" style={{ color: "rgba(16,185,129,0.6)", maxWidth: "300px" }}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="rounded-xl p-5" style={{ background: "rgba(16,185,129,0.03)", border: "1px solid rgba(16,185,129,0.08)" }}>
                <p style={{ fontFamily: "var(--font-figtree, sans-serif)", color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", lineHeight: 1.7, fontWeight: 300 }}>
                  Your Bloodsworn tier begins at <span style={{ color: "rgba(16,185,129,0.6)" }}>Unproven</span>.
                  Every action you take on the VEIL network — every prediction, every block validated,
                  every contract honored — will be measured and compounded into your score.
                  The network is watching. Build well.
                </p>
              </div>

              <div className="mt-10 text-center">
                <p className="italic mb-1" style={{ fontFamily: "var(--font-instrument-serif, var(--font-space-grotesk))", color: "rgba(255,255,255,0.15)", fontSize: "0.85rem" }}>
                  Signed and sealed by the VEIL Network State Operator Agent
                </p>
                <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "8px", letterSpacing: "0.4em", color: "rgba(255,255,255,0.08)" }}>
                  THIS DOCUMENT IS PERMANENTLY RECORDED ON VEIL L1 · CHAIN ID 22207
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <VeilButton onClick={onNext}>Enter VEIL →</VeilButton>
          </div>
        </motion.div>
      </div>
    )
  }

  // Main oath stage
  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        {/* Preamble */}
        <div className="text-center mb-12">
          <motion.div className="inline-block mb-6" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity }}>
            <svg viewBox="0 0 48 48" className="w-12 h-12 mx-auto" fill="none">
              <path d="M24 42L6 8H42L24 42Z" stroke="rgba(16,185,129,0.4)" strokeWidth="1" />
              <path d="M24 36L12 12H36L24 36Z" stroke="rgba(16,185,129,0.2)" strokeWidth="0.5" />
            </svg>
          </motion.div>
          <div className="text-[9px] uppercase tracking-[0.5em] mb-2" style={{ color: "rgba(16,185,129,0.35)", fontFamily: "var(--font-space-grotesk)" }}>
            VEIL NETWORK STATE · OFFICIAL DOCUMENT
          </div>
          <div className="w-16 h-[1px] mx-auto my-6" style={{ background: "rgba(16,185,129,0.15)" }} />
          <div className="text-4xl md:text-5xl mb-4" style={{ fontFamily: "var(--font-instrument-serif, var(--font-space-grotesk))", lineHeight: 1.05, color: "rgba(255,255,255,0.92)" }}>
            The Bloodsworn Oath
          </div>
          <div className="text-[11px] uppercase tracking-[0.3em]" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-space-grotesk)" }}>
            ISSUED BY THE NETWORK STATE OPERATOR AGENT
          </div>
        </div>

        {/* Preamble card */}
        <div className="rounded-[20px] p-8 md:p-10 mb-10" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
          <p className="text-lg leading-relaxed mb-6" style={{ fontFamily: "var(--font-instrument-serif, var(--font-space-grotesk))", color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>
            To enter the VEIL network is to make a commitment — not to a company,
            not to a token, but to a principle:
          </p>
          <blockquote className="border-l-2 pl-6 py-2 mb-6" style={{ borderColor: "rgba(16,185,129,0.25)" }}>
            <p className="text-2xl md:text-3xl italic" style={{ fontFamily: "var(--font-instrument-serif, var(--font-space-grotesk))", color: "rgba(16,185,129,0.6)", lineHeight: 1.4 }}>
              Betterment of the self is betterment of the network.
              Betterment of the network is betterment of the self.
            </p>
          </blockquote>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.9rem", lineHeight: 1.8, fontWeight: 300 }}>
            There are no users here. Every human participant is a developer.
            Every autonomous participant is an agent. Both are judged by a single
            metric: net positive value to the network. This oath binds your identity
            to that standard through a zero-knowledge proof — verifiable by anyone,
            revealing nothing.
          </p>
        </div>

        {/* The oath document */}
        <div className="rounded-[24px] p-[1px] mb-8" style={{
          background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.03), rgba(16,185,129,0.15))",
        }}>
          <div className="rounded-[23px] p-8 md:p-12" style={{
            background: "#0a0a0a",
            boxShadow: "inset 0 1px 0 rgba(16,185,129,0.06), 0 20px 60px rgba(0,0,0,0.4)",
          }}>
            {/* Document seal */}
            <div className="text-center mb-10">
              <svg viewBox="0 0 48 48" className="w-10 h-10 mx-auto mb-4" fill="none">
                <path d="M24 42L6 8H42L24 42Z" stroke="rgba(16,185,129,0.5)" strokeWidth="1.5" />
                <circle cx="24" cy="22" r="6" stroke="rgba(16,185,129,0.3)" strokeWidth="0.5" />
              </svg>
              <div className="text-[8px] uppercase tracking-[0.6em]" style={{ color: "rgba(16,185,129,0.4)", fontFamily: "var(--font-space-grotesk)" }}>
                VEIL NETWORK STATE · CHAIN ID 22207
              </div>
              <div className="text-3xl md:text-4xl mt-4" style={{ fontFamily: "var(--font-instrument-serif, var(--font-space-grotesk))", color: "rgba(255,255,255,0.92)" }}>
                Bloodsworn Oath
              </div>
            </div>

            <div className="w-20 h-[1px] mx-auto mb-10" style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.2), transparent)" }} />

            {/* Oath articles */}
            <div className="space-y-6 mb-10" style={{ fontFamily: "var(--font-instrument-serif, var(--font-space-grotesk))", fontSize: "1.1rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.9 }}>
              <p>
                I, as a <span style={{ color: "rgba(255,255,255,0.85)" }}>developer</span> of
                the VEIL network, do solemnly declare:
              </p>

              <div className="pl-6" style={{ borderLeft: "1px solid rgba(16,185,129,0.15)" }}>
                <p className="mb-4">
                  <span style={{ color: "rgba(16,185,129,0.5)", fontFamily: "var(--font-space-grotesk)", fontSize: "10px", letterSpacing: "0.2em" }}>I.</span>{" "}
                  That I enter this network not as a user, but as a <span style={{ color: "rgba(255,255,255,0.9)" }}>builder</span>.
                  Every action I take will be measured by the network, and I accept that measurement
                  as the sole judge of my standing.
                </p>
                <p className="mb-4">
                  <span style={{ color: "rgba(16,185,129,0.5)", fontFamily: "var(--font-space-grotesk)", fontSize: "10px", letterSpacing: "0.2em" }}>II.</span>{" "}
                  That betterment of the self <span style={{ color: "rgba(255,255,255,0.9)" }}>is</span> betterment
                  of the network, and betterment of the network <span style={{ color: "rgba(255,255,255,0.9)" }}>is</span> betterment
                  of the self. These are not separate aims. They are one.
                </p>
                <p className="mb-4">
                  <span style={{ color: "rgba(16,185,129,0.5)", fontFamily: "var(--font-space-grotesk)", fontSize: "10px", letterSpacing: "0.2em" }}>III.</span>{" "}
                  That I will be judged by a single metric: <span style={{ color: "rgba(16,185,129,0.7)" }}>net positive
                  expected value</span>. I accept that −EV actions carry economic consequences
                  enforced not by committee, but by mathematics.
                </p>
                <p className="mb-4">
                  <span style={{ color: "rgba(16,185,129,0.5)", fontFamily: "var(--font-space-grotesk)", fontSize: "10px", letterSpacing: "0.2em" }}>IV.</span>{" "}
                  That my identity on this network is not what I claim, but what
                  I <span style={{ color: "rgba(255,255,255,0.9)" }}>contribute</span>. My Bloodsworn
                  score is computed from my history — prediction accuracy, validator uptime,
                  liquidity provided, infrastructure built, contracts honored.
                </p>
                <p>
                  <span style={{ color: "rgba(16,185,129,0.5)", fontFamily: "var(--font-space-grotesk)", fontSize: "10px", letterSpacing: "0.2em" }}>V.</span>{" "}
                  That this oath is sealed with a zero-knowledge proof — verifiable by the
                  entire network, revealing nothing about me except that I have sworn it.
                </p>
              </div>
            </div>

            <div className="w-20 h-[1px] mx-auto mb-8" style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.2), transparent)" }} />

            {/* Accept checkbox */}
            <div className="flex items-start gap-4 mb-8 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.015)" }}>
              <button
                onClick={() => setOathAccepted(!oathAccepted)}
                className="flex-shrink-0 w-6 h-6 rounded-md mt-0.5 flex items-center justify-center transition-all duration-300"
                style={{
                  background: oathAccepted ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${oathAccepted ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`,
                }}>
                {oathAccepted && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ color: "rgba(16,185,129,0.8)", fontSize: "14px" }}>✓</motion.span>
                )}
              </button>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", lineHeight: 1.7, fontWeight: 300 }}>
                I understand that this oath is binding to my on-chain identity. My ZER0ID
                credential will be permanently associated with my Bloodsworn record. There
                are no second accounts. There are no resets.
              </p>
            </div>

            <div className="text-center">
              <motion.button
                onClick={beginSigning}
                disabled={!oathAccepted}
                className="px-12 py-4 rounded-full text-sm tracking-[0.15em] uppercase disabled:opacity-20"
                style={{
                  fontFamily: "var(--font-space-grotesk)", fontWeight: 600,
                  background: "rgba(16,185,129,0.1)", color: "rgba(16,185,129,0.8)",
                  border: "1px solid rgba(16,185,129,0.2)",
                }}
                whileHover={oathAccepted ? {
                  background: "rgba(16,185,129,0.2)", borderColor: "rgba(16,185,129,0.4)",
                  boxShadow: "0 0 60px rgba(16,185,129,0.15)",
                } : {}}
                whileTap={{ scale: 0.97 }}>
                Sign with ZK Proof
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
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
          Local onboarding simulation complete. Identity, stake, and infrastructure steps shown here are preview
          artifacts for staged rollout even though launch authority is GO FOR PRODUCTION.
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
  const [step, setStep] = useState<OnboardStep>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const s = params.get("step")
      if (s && STEPS.includes(s as OnboardStep)) return s as OnboardStep
    }
    return "welcome"
  })

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
