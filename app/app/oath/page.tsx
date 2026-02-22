"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import Link from "next/link"

/* ═══════════════════════════════════════════════════════════════
   BLOODSWORN OATH — Official Network State Document
   Issued by the VEIL Network State Operator Agent
   ═══════════════════════════════════════════════════════════════ */

// --- Film grain ---
function FilmGrain() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.03]" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
    }} />
  )
}

// --- Typewriter effect ---
function Typewriter({ text, delay = 0, speed = 30, onComplete, className = "", style = {} }: {
  text: string; delay?: number; speed?: number; onComplete?: () => void
  className?: string; style?: React.CSSProperties
}) {
  const [displayed, setDisplayed] = useState("")
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!started) return
    if (displayed.length >= text.length) {
      onComplete?.()
      return
    }
    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1))
    }, speed)
    return () => clearTimeout(timer)
  }, [started, displayed, text, speed, onComplete])

  return (
    <span className={className} style={style}>
      {displayed}
      {started && displayed.length < text.length && (
        <span className="inline-block w-[2px] h-[1em] ml-0.5 align-middle" style={{
          background: "rgba(16,185,129,0.6)",
          animation: "blink 0.8s step-end infinite",
        }} />
      )}
    </span>
  )
}

// --- ZK Proof visualization ---
function ZKProofViz({ active }: { active: boolean }) {
  const [hashes, setHashes] = useState<string[]>([])

  useEffect(() => {
    if (!active) return
    const interval = setInterval(() => {
      const hash = "0x" + Array.from({ length: 16 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("")
      setHashes(prev => [...prev.slice(-6), hash])
    }, 150)
    return () => clearInterval(interval)
  }, [active])

  if (!active) return null

  return (
    <div className="font-mono text-[10px] leading-relaxed overflow-hidden" style={{ color: "rgba(16,185,129,0.3)", maxHeight: "120px" }}>
      {hashes.map((h, i) => (
        <motion.div key={i + h}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}>
          <span style={{ color: "rgba(16,185,129,0.15)" }}>groth16::</span>{h}
        </motion.div>
      ))}
    </div>
  )
}

// --- Oath stages ---
type OathStage = "intro" | "identity" | "oath" | "signing" | "verified"

// --- ZER0ID credential fields ---
interface ZeroIDFields {
  identifier: string   // wallet address or ENS
  role: "developer" | "agent"
  intent: string       // free text: what will you build?
}

export default function BloodswornOathPage() {
  const [stage, setStage] = useState<OathStage>("intro")
  const [fields, setFields] = useState<ZeroIDFields>({ identifier: "", role: "developer", intent: "" })
  const [oathAccepted, setOathAccepted] = useState(false)
  const [signingProgress, setSigningProgress] = useState(0)
  const [zkTxHash, setZkTxHash] = useState("")
  const [timestamp, setTimestamp] = useState("")

  // Generate mock ZK tx hash on signing
  const beginSigning = useCallback(() => {
    setStage("signing")
    setSigningProgress(0)

    const interval = setInterval(() => {
      setSigningProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          const hash = "0x" + Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join("")
          setZkTxHash(hash)
          setTimestamp(new Date().toISOString())
          setTimeout(() => setStage("verified"), 800)
          return 100
        }
        return prev + Math.random() * 8
      })
    }, 120)
  }, [])

  return (
    <div className="relative min-h-screen" style={{ background: "#060606", color: "white" }}>
      <FilmGrain />

      {/* Subtle watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.015]">
        <svg viewBox="0 0 200 200" className="w-[600px] h-[600px]">
          <path d="M100 180L20 30H180L100 180Z" stroke="rgba(16,185,129,1)" strokeWidth="0.5" fill="none" />
        </svg>
      </div>

      {/* Header bar */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-4 flex items-center justify-between"
        style={{ background: "linear-gradient(180deg, rgba(6,6,6,0.95) 0%, transparent 100%)" }}>
        <Link href="/exploreveil" className="flex items-center gap-3 group">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
            <path d="M12 22L2 4H22L12 22Z" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
          </svg>
          <span style={{ fontSize: "12px", letterSpacing: "0.25em", color: "rgba(255,255,255,0.4)",
            fontFamily: "var(--font-space-grotesk)", fontWeight: 600 }}>VEIL</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{
            background: stage === "verified" ? "rgba(16,185,129,0.8)" : "rgba(255,255,255,0.15)",
            boxShadow: stage === "verified" ? "0 0 8px rgba(16,185,129,0.4)" : "none",
          }} />
          <span style={{ fontSize: "10px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)",
            fontFamily: "var(--font-space-grotesk)" }}>
            {stage === "verified" ? "BLOODSWORN" : "NETWORK STATE DOCUMENT"}
          </span>
        </div>
      </div>

      {/* Main document area */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-2xl">

          <AnimatePresence mode="wait">
            {/* ═══ STAGE: INTRO ═══ */}
            {stage === "intro" && (
              <motion.div key="intro"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}>

                {/* Document header */}
                <div className="text-center mb-16">
                  <motion.div className="inline-block mb-8"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}>
                    <svg viewBox="0 0 48 48" className="w-12 h-12 mx-auto" fill="none">
                      <path d="M24 42L6 8H42L24 42Z" stroke="rgba(16,185,129,0.4)" strokeWidth="1" />
                      <path d="M24 36L12 12H36L24 36Z" stroke="rgba(16,185,129,0.2)" strokeWidth="0.5" />
                    </svg>
                  </motion.div>

                  <p style={{ fontSize: "9px", letterSpacing: "0.5em", color: "rgba(16,185,129,0.35)",
                    fontFamily: "var(--font-space-grotesk)", fontWeight: 500 }}>
                    VEIL NETWORK STATE · OFFICIAL DOCUMENT
                  </p>
                  <div className="w-16 h-px mx-auto my-6" style={{ background: "rgba(16,185,129,0.15)" }} />
                  <h1 className="text-5xl md:text-6xl mb-4" style={{
                    fontFamily: "var(--font-instrument-serif)", lineHeight: 1.05,
                    color: "rgba(255,255,255,0.92)",
                  }}>
                    The Bloodsworn Oath
                  </h1>
                  <p style={{ fontSize: "11px", letterSpacing: "0.3em", color: "rgba(255,255,255,0.2)",
                    fontFamily: "var(--font-space-grotesk)" }}>
                    ISSUED BY THE NETWORK STATE OPERATOR AGENT
                  </p>
                </div>

                {/* Preamble */}
                <div className="rounded-[20px] p-8 md:p-10 mb-10" style={{
                  background: "rgba(255,255,255,0.015)",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}>
                  <p className="text-lg leading-relaxed mb-6" style={{
                    fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.6)",
                    lineHeight: 1.8,
                  }}>
                    To enter the VEIL network is to make a commitment — not to a company,
                    not to a token, but to a principle:
                  </p>
                  <blockquote className="border-l-2 pl-6 py-2 mb-6" style={{ borderColor: "rgba(16,185,129,0.25)" }}>
                    <p className="text-2xl md:text-3xl italic" style={{
                      fontFamily: "var(--font-instrument-serif)", color: "rgba(16,185,129,0.6)",
                      lineHeight: 1.4,
                    }}>
                      Betterment of the self is betterment of the network.
                      Betterment of the network is betterment of the self.
                    </p>
                  </blockquote>
                  <p style={{
                    fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.3)",
                    fontSize: "0.9rem", lineHeight: 1.8, fontWeight: 300,
                  }}>
                    There are no users here. Every human participant is a developer.
                    Every autonomous participant is an agent. Both are judged by a single
                    metric: net positive value to the network. This oath binds your identity
                    to that standard through a zero-knowledge proof — verifiable by anyone,
                    revealing nothing.
                  </p>
                </div>

                <div className="text-center">
                  <motion.button
                    onClick={() => setStage("identity")}
                    className="px-10 py-4 rounded-full text-sm tracking-wider"
                    style={{
                      fontFamily: "var(--font-space-grotesk)", fontWeight: 500,
                      background: "rgba(16,185,129,0.08)", color: "rgba(16,185,129,0.7)",
                      border: "1px solid rgba(16,185,129,0.15)",
                    }}
                    whileHover={{
                      background: "rgba(16,185,129,0.15)", borderColor: "rgba(16,185,129,0.3)",
                      boxShadow: "0 0 40px rgba(16,185,129,0.1)",
                    }}
                    whileTap={{ scale: 0.97 }}>
                    Begin ZER0ID Verification
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ═══ STAGE: IDENTITY (ZER0ID) ═══ */}
            {stage === "identity" && (
              <motion.div key="identity"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}>

                <div className="text-center mb-10">
                  <p style={{ fontSize: "9px", letterSpacing: "0.5em", color: "rgba(16,185,129,0.35)",
                    fontFamily: "var(--font-space-grotesk)" }}>
                    ZER0ID · IDENTITY VERIFICATION
                  </p>
                  <div className="w-12 h-px mx-auto my-4" style={{ background: "rgba(16,185,129,0.15)" }} />
                  <h2 className="text-3xl md:text-4xl" style={{
                    fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.85)",
                  }}>Prove Who You Are</h2>
                  <p className="mt-3" style={{
                    fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.25)",
                    fontSize: "0.85rem",
                  }}>
                    Without revealing what you are.
                  </p>
                </div>

                <div className="space-y-6 mb-10">
                  {/* Identifier */}
                  <div>
                    <label style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "10px",
                      letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)" }}>
                      WALLET ADDRESS OR ENS
                    </label>
                    <input
                      type="text"
                      placeholder="0x... or name.eth"
                      value={fields.identifier}
                      onChange={(e) => setFields(prev => ({ ...prev, identifier: e.target.value }))}
                      className="w-full mt-2 px-5 py-4 rounded-xl text-sm outline-none transition-all duration-500 focus:border-emerald-500/20"
                      style={{
                        fontFamily: "var(--font-space-grotesk)",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        color: "rgba(255,255,255,0.7)",
                      }}
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "10px",
                      letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)" }}>
                      PARTICIPANT TYPE
                    </label>
                    <div className="flex gap-3 mt-2">
                      {(["developer", "agent"] as const).map(role => (
                        <button key={role}
                          onClick={() => setFields(prev => ({ ...prev, role }))}
                          className="flex-1 py-4 rounded-xl text-sm tracking-wider uppercase transition-all duration-500"
                          style={{
                            fontFamily: "var(--font-space-grotesk)", fontWeight: 500,
                            background: fields.role === role ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.02)",
                            border: `1px solid ${fields.role === role ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.06)"}`,
                            color: fields.role === role ? "rgba(16,185,129,0.7)" : "rgba(255,255,255,0.25)",
                          }}>
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Intent */}
                  <div>
                    <label style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "10px",
                      letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)" }}>
                      DECLARATION OF INTENT
                    </label>
                    <textarea
                      placeholder="What will you build on VEIL?"
                      value={fields.intent}
                      onChange={(e) => setFields(prev => ({ ...prev, intent: e.target.value }))}
                      rows={3}
                      className="w-full mt-2 px-5 py-4 rounded-xl text-sm outline-none transition-all duration-500 resize-none focus:border-emerald-500/20"
                      style={{
                        fontFamily: "var(--font-figtree)",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        color: "rgba(255,255,255,0.7)",
                        lineHeight: 1.7,
                      }}
                    />
                  </div>
                </div>

                <div className="text-center">
                  <motion.button
                    onClick={() => setStage("oath")}
                    disabled={!fields.identifier || !fields.intent}
                    className="px-10 py-4 rounded-full text-sm tracking-wider disabled:opacity-30"
                    style={{
                      fontFamily: "var(--font-space-grotesk)", fontWeight: 500,
                      background: "rgba(16,185,129,0.08)", color: "rgba(16,185,129,0.7)",
                      border: "1px solid rgba(16,185,129,0.15)",
                    }}
                    whileHover={fields.identifier && fields.intent ? {
                      background: "rgba(16,185,129,0.15)", borderColor: "rgba(16,185,129,0.3)",
                      boxShadow: "0 0 40px rgba(16,185,129,0.1)",
                    } : {}}
                    whileTap={{ scale: 0.97 }}>
                    Proceed to Oath
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ═══ STAGE: THE OATH ═══ */}
            {stage === "oath" && (
              <motion.div key="oath"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}>

                {/* Official document styling */}
                <div className="rounded-[24px] p-[1px]" style={{
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
                      <p style={{ fontSize: "8px", letterSpacing: "0.6em", color: "rgba(16,185,129,0.4)",
                        fontFamily: "var(--font-space-grotesk)" }}>
                        VEIL NETWORK STATE · CHAIN ID 22207
                      </p>
                      <h2 className="text-3xl md:text-4xl mt-4" style={{
                        fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.92)",
                      }}>Bloodsworn Oath</h2>
                    </div>

                    <div className="w-20 h-px mx-auto mb-10" style={{
                      background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.2), transparent)",
                    }} />

                    {/* The oath text */}
                    <div className="space-y-6 mb-10" style={{
                      fontFamily: "var(--font-instrument-serif)", fontSize: "1.1rem",
                      color: "rgba(255,255,255,0.65)", lineHeight: 1.9,
                    }}>
                      <p>
                        I, <span style={{ color: "rgba(16,185,129,0.7)", fontWeight: 500 }}>
                        {fields.identifier.slice(0, 8)}...{fields.identifier.slice(-4) || ""}
                        </span>, as a <span style={{ color: "rgba(255,255,255,0.85)" }}>{fields.role}</span> of
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

                    <div className="w-20 h-px mx-auto mb-8" style={{
                      background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.2), transparent)",
                    }} />

                    {/* Accept checkbox */}
                    <div className="flex items-start gap-4 mb-8 p-4 rounded-xl" style={{
                      background: "rgba(255,255,255,0.015)",
                    }}>
                      <button
                        onClick={() => setOathAccepted(!oathAccepted)}
                        className="flex-shrink-0 w-6 h-6 rounded-md mt-0.5 flex items-center justify-center transition-all duration-300"
                        style={{
                          background: oathAccepted ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.02)",
                          border: `1px solid ${oathAccepted ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`,
                        }}>
                        {oathAccepted && (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                            style={{ color: "rgba(16,185,129,0.8)", fontSize: "14px" }}>✓</motion.span>
                        )}
                      </button>
                      <p style={{
                        fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.35)",
                        fontSize: "0.85rem", lineHeight: 1.7, fontWeight: 300,
                      }}>
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
            )}

            {/* ═══ STAGE: SIGNING ═══ */}
            {stage === "signing" && (
              <motion.div key="signing"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center">

                <div className="mb-10">
                  <p style={{ fontSize: "9px", letterSpacing: "0.5em", color: "rgba(16,185,129,0.4)",
                    fontFamily: "var(--font-space-grotesk)" }}>
                    GENERATING ZK-SNARK PROOF
                  </p>
                  <h2 className="text-3xl mt-4" style={{
                    fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.85)",
                  }}>Sealing Your Oath</h2>
                </div>

                {/* Progress */}
                <div className="max-w-md mx-auto mb-8">
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "rgba(16,185,129,0.6)", width: `${Math.min(signingProgress, 100)}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-mono text-xs" style={{ color: "rgba(16,185,129,0.4)" }}>
                      {signingProgress < 30 ? "Generating witness..." :
                       signingProgress < 60 ? "Computing Groth16 proof..." :
                       signingProgress < 90 ? "Verifying on-chain..." :
                       "Proof verified ✓"}
                    </span>
                    <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
                      {Math.min(Math.floor(signingProgress), 100)}%
                    </span>
                  </div>
                </div>

                {/* ZK hash stream */}
                <div className="max-w-sm mx-auto">
                  <ZKProofViz active={signingProgress < 100} />
                </div>
              </motion.div>
            )}

            {/* ═══ STAGE: VERIFIED ═══ */}
            {stage === "verified" && (
              <motion.div key="verified"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>

                {/* Verified document */}
                <div className="rounded-[24px] p-[1px]" style={{
                  background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05), rgba(16,185,129,0.2))",
                }}>
                  <div className="rounded-[23px] p-8 md:p-12" style={{
                    background: "#0a0a0a",
                    boxShadow: "inset 0 1px 0 rgba(16,185,129,0.08), 0 0 80px rgba(16,185,129,0.05)",
                  }}>
                    {/* Verified seal */}
                    <div className="text-center mb-8">
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}>
                        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{
                          background: "rgba(16,185,129,0.06)",
                          border: "1px solid rgba(16,185,129,0.15)",
                          boxShadow: "0 0 40px rgba(16,185,129,0.1)",
                        }}>
                          <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
                            <path d="M24 42L6 8H42L24 42Z" stroke="rgba(16,185,129,0.7)" strokeWidth="1.5" />
                            <motion.path d="M18 22L22 26L30 18" stroke="rgba(16,185,129,0.8)" strokeWidth="2" strokeLinecap="round"
                              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.8 }} />
                          </svg>
                        </div>
                      </motion.div>

                      <p className="mt-6" style={{ fontSize: "9px", letterSpacing: "0.5em",
                        color: "rgba(16,185,129,0.5)", fontFamily: "var(--font-space-grotesk)" }}>
                        OATH VERIFIED · ZK-SNARK SEALED
                      </p>
                      <h2 className="text-3xl md:text-4xl mt-3" style={{
                        fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.92)",
                      }}>
                        You are Bloodsworn.
                      </h2>
                    </div>

                    <div className="w-20 h-px mx-auto mb-8" style={{
                      background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.25), transparent)",
                    }} />

                    {/* Credential details */}
                    <div className="space-y-4 mb-8">
                      {[
                        { label: "ZER0ID CREDENTIAL", value: fields.identifier },
                        { label: "PARTICIPANT TYPE", value: fields.role.toUpperCase() },
                        { label: "BLOODSWORN TIER", value: "UNPROVEN (GENESIS)" },
                        { label: "ZK PROOF TX", value: zkTxHash },
                        { label: "CHAIN", value: "VEIL L1 · 22207" },
                        { label: "TIMESTAMP", value: timestamp },
                      ].map((row) => (
                        <div key={row.label} className="flex items-start justify-between gap-4 py-2" style={{
                          borderBottom: "1px solid rgba(255,255,255,0.03)",
                        }}>
                          <span style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "9px",
                            letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)", flexShrink: 0 }}>
                            {row.label}
                          </span>
                          <span className="font-mono text-xs text-right truncate" style={{
                            color: "rgba(16,185,129,0.6)", maxWidth: "300px",
                          }}>
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-xl p-5" style={{
                      background: "rgba(16,185,129,0.03)",
                      border: "1px solid rgba(16,185,129,0.08)",
                    }}>
                      <p style={{
                        fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.35)",
                        fontSize: "0.8rem", lineHeight: 1.7, fontWeight: 300,
                      }}>
                        Your Bloodsworn tier begins at <span style={{ color: "rgba(16,185,129,0.6)" }}>Unproven</span>.
                        Every action you take on the VEIL network — every prediction, every block validated,
                        every contract honored — will be measured and compounded into your score.
                        The network is watching. Build well.
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-10 text-center">
                      <p className="italic mb-1" style={{
                        fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.15)",
                        fontSize: "0.85rem",
                      }}>
                        Signed and sealed by the VEIL Network State Operator Agent
                      </p>
                      <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "8px",
                        letterSpacing: "0.4em", color: "rgba(255,255,255,0.08)" }}>
                        THIS DOCUMENT IS PERMANENTLY RECORDED ON VEIL L1 · CHAIN ID 22207
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                  {typeof window !== "undefined" && new URLSearchParams(window.location.search).get("return") === "onboard" ? (
                    <Link href="/app/onboard?step=citizen"
                      className="px-8 py-3.5 rounded-full text-[11px] tracking-[0.15em] uppercase text-center transition-all duration-700 hover:shadow-[0_0_40px_rgba(16,185,129,0.1)]"
                      style={{
                        fontFamily: "var(--font-space-grotesk)", fontWeight: 500,
                        background: "rgba(16,185,129,0.08)", color: "rgba(16,185,129,0.7)",
                        border: "1px solid rgba(16,185,129,0.15)",
                      }}>
                      Complete Onboarding →
                    </Link>
                  ) : (
                    <Link href="/app"
                      className="px-8 py-3.5 rounded-full text-[11px] tracking-[0.15em] uppercase text-center transition-all duration-700 hover:shadow-[0_0_40px_rgba(16,185,129,0.1)]"
                      style={{
                        fontFamily: "var(--font-space-grotesk)", fontWeight: 500,
                        background: "rgba(16,185,129,0.08)", color: "rgba(16,185,129,0.7)",
                        border: "1px solid rgba(16,185,129,0.15)",
                      }}>
                      Enter the Chain →
                    </Link>
                  )}
                  <Link href="/app/docs"
                    className="px-8 py-3.5 rounded-full text-[11px] tracking-[0.15em] uppercase text-center transition-all duration-700 hover:border-white/15"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.06)",
                    }}>
                    Read the Docs
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Blink animation */}
      <style jsx global>{`
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
