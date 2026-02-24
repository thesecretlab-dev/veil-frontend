"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { VeilFooter, VeilHeader, FilmGrain } from "@/components/brand"

/* ===========================================================================
   VEIL DEVELOPER APPLICATION
   
   The gate before A0_ACCEPTED. Developers apply here to join the VEIL network.
   Applications are stored in VEILdb and reviewed by the committee.
   Approved applicants receive an enrollment token to begin onboarding.
   =========================================================================== */

type AppStep = "intro" | "form" | "review" | "submitted"

interface ApplicationData {
  // Identity
  name: string
  handle: string           // GitHub, X, or pseudonym
  walletAddress: string
  
  // Technical
  experience: string       // "beginner" | "intermediate" | "advanced" | "expert"
  background: string[]     // ["solidity", "rust", "go", "typescript", "zkp", "infra", "defi", "ai"]
  
  // Intent
  intent: string           // "validator" | "agent_developer" | "market_maker" | "researcher" | "contributor"
  proposal: string         // What they want to build / why they want in
  
  // Infrastructure
  infraPlan: string        // "home_server" | "cloud" | "undecided"
  
  // Agreement
  acceptsTerms: boolean
  acceptsPermissioned: boolean  // Understands this is a permissioned network
}

const EMPTY_APP: ApplicationData = {
  name: "",
  handle: "",
  walletAddress: "",
  experience: "",
  background: [],
  intent: "",
  proposal: "",
  infraPlan: "",
  acceptsTerms: false,
  acceptsPermissioned: false,
}

const EXPERIENCE_LEVELS = [
  { id: "beginner", label: "Beginner", desc: "Learning blockchain development" },
  { id: "intermediate", label: "Intermediate", desc: "Shipped a few projects" },
  { id: "advanced", label: "Advanced", desc: "Production blockchain experience" },
  { id: "expert", label: "Expert", desc: "Core contributor / protocol developer" },
]

const BACKGROUND_OPTIONS = [
  { id: "solidity", label: "Solidity" },
  { id: "rust", label: "Rust" },
  { id: "go", label: "Go" },
  { id: "typescript", label: "TypeScript" },
  { id: "zkp", label: "ZK Proofs" },
  { id: "infra", label: "Infrastructure" },
  { id: "defi", label: "DeFi" },
  { id: "ai", label: "AI / Agents" },
]

const INTENT_OPTIONS = [
  { id: "validator", label: "Run a Validator", icon: "△", desc: "Secure the network with your own node" },
  { id: "agent_developer", label: "Build Agents", icon: "◈", desc: "Create autonomous ANIMA agents" },
  { id: "market_maker", label: "Market Making", icon: "▽", desc: "Provide liquidity to prediction markets" },
  { id: "researcher", label: "Research", icon: "◎", desc: "ZK proofs, privacy, mechanism design" },
  { id: "contributor", label: "Core Contributor", icon: "⬡", desc: "Contribute to protocol development" },
]

const INFRA_OPTIONS = [
  { id: "home_server", label: "Home Server", desc: "Under $100 — true sovereignty" },
  { id: "cloud", label: "Cloud Instance", desc: "Automated deployment — faster start" },
  { id: "undecided", label: "Not Sure Yet", desc: "I'll decide during onboarding" },
]

/* ═══ Animated Background ═══ */
function GridBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `
          linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }} />
      {/* Radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.03]"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,1) 0%, transparent 70%)" }} />
    </div>
  )
}

/* ═══ Typewriter ═══ */
function Typewriter({ text, speed = 30, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState("")
  const idx = useRef(0)

  useState(() => {
    const interval = setInterval(() => {
      if (idx.current < text.length) {
        setDisplayed(text.slice(0, idx.current + 1))
        idx.current++
      } else {
        clearInterval(interval)
        onComplete?.()
      }
    }, speed)
    return () => clearInterval(interval)
  })

  return <span>{displayed}<span className="animate-pulse">▌</span></span>
}

/* ═══ Form Components ═══ */
function TextInput({ label, value, onChange, placeholder, mono }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.2em] text-white/30 font-[var(--font-space-grotesk)] mb-2">
        {label}
      </label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-[14px] border border-white/[0.08] bg-[#060606] px-4 py-3 text-sm text-white/80 outline-none transition focus:border-emerald-500/30 placeholder:text-white/15 ${mono ? "font-mono text-xs" : ""}`}
      />
    </div>
  )
}

function TextArea({ label, value, onChange, placeholder, rows }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.2em] text-white/30 font-[var(--font-space-grotesk)] mb-2">
        {label}
      </label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows || 4}
        className="w-full rounded-[14px] border border-white/[0.08] bg-[#060606] px-4 py-3 text-sm text-white/80 outline-none transition focus:border-emerald-500/30 placeholder:text-white/15 resize-none leading-relaxed"
      />
    </div>
  )
}

function SelectGrid({ label, options, value, onChange, multi }: {
  label: string; options: { id: string; label: string; desc?: string; icon?: string }[]
  value: string | string[]; onChange: (v: any) => void; multi?: boolean
}) {
  const isSelected = (id: string) => multi ? (value as string[]).includes(id) : value === id
  const toggle = (id: string) => {
    if (multi) {
      const arr = value as string[]
      onChange(arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id])
    } else {
      onChange(id)
    }
  }

  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.2em] text-white/30 font-[var(--font-space-grotesk)] mb-3">
        {label} {multi && <span className="text-white/15">(select all that apply)</span>}
      </label>
      <div className={`grid gap-2 ${options.length <= 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-4"}`}>
        {options.map(opt => (
          <button
            key={opt.id}
            onClick={() => toggle(opt.id)}
            className={`text-left rounded-[14px] border p-3 transition-all ${
              isSelected(opt.id)
                ? "border-emerald-500/30 bg-emerald-500/[0.06]"
                : "border-white/[0.06] bg-white/[0.01] hover:border-white/[0.12]"
            }`}
          >
            <div className="flex items-center gap-2">
              {opt.icon && <span className="text-lg">{opt.icon}</span>}
              <span className={`font-[var(--font-space-grotesk)] text-sm ${
                isSelected(opt.id) ? "text-emerald-400" : "text-white/60"
              }`}>{opt.label}</span>
            </div>
            {opt.desc && (
              <p className={`mt-1 text-[11px] ${
                isSelected(opt.id) ? "text-emerald-400/40" : "text-white/20"
              }`}>{opt.desc}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function Checkbox({ label, checked, onChange }: {
  label: string; checked: boolean; onChange: (v: boolean) => void
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-start gap-3 text-left group"
    >
      <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border transition-all flex items-center justify-center ${
        checked
          ? "border-emerald-500/40 bg-emerald-500/10"
          : "border-white/10 bg-white/[0.02] group-hover:border-white/20"
      }`}>
        {checked && <span className="text-emerald-400 text-xs">✓</span>}
      </div>
      <span className="text-[13px] text-white/40 leading-relaxed">{label}</span>
    </button>
  )
}

/* ═══ Main Page ═══ */
export default function ApplyPage() {
  const [step, setStep] = useState<AppStep>("intro")
  const [app, setApp] = useState<ApplicationData>(EMPTY_APP)
  const [submitting, setSubmitting] = useState(false)
  const [applicationId, setApplicationId] = useState("")

  const update = useCallback((field: keyof ApplicationData, value: any) => {
    setApp(prev => ({ ...prev, [field]: value }))
  }, [])

  const isFormValid = app.name && app.handle && app.experience && app.background.length > 0 &&
    app.intent && app.proposal.length >= 50 && app.infraPlan && app.acceptsTerms && app.acceptsPermissioned

  const handleSubmit = useCallback(async () => {
    if (!isFormValid) return
    setSubmitting(true)

    // Generate application ID
    const t = Date.now().toString(36).padStart(9, "0")
    const r = Array.from({ length: 8 }, () => Math.floor(Math.random() * 36).toString(36)).join("")
    const id = `veil_app_${t}${r}`
    setApplicationId(id)

    // Simulate API call (in production: POST to VEILdb via API)
    await new Promise(resolve => setTimeout(resolve, 2000))

    setStep("submitted")
    setSubmitting(false)
  }, [app, isFormValid])

  return (
    <div className="relative min-h-screen bg-[#060606] text-white overflow-hidden">
      <FilmGrain />
      <GridBackground />
      <VeilHeader current="apply" />

      <main className="relative z-10 max-w-2xl mx-auto px-6 pt-32 pb-32">
        <AnimatePresence mode="wait">
          {/* ═══ INTRO ═══ */}
          {step === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <p className="text-[10px] tracking-[0.4em] uppercase mb-4"
                  style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.4)" }}>
                  Developer Application
                </p>
                <h1 className="text-4xl md:text-5xl font-light leading-[1.1] mb-6"
                  style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.9)" }}>
                  Join the VEIL Network
                </h1>
                <div className="text-[15px] text-white/35 leading-relaxed space-y-4"
                  style={{ fontFamily: "var(--font-figtree)" }}>
                  <p>
                    VEIL is a permissioned Avalanche L1. There are no users — only developers and
                    autonomous agents. Every human participant builds. Every agent operates.
                  </p>
                  <p>
                    This application determines whether you're admitted to the network. We're not
                    looking for credentials — we're looking for builders who understand what they're
                    signing up for.
                  </p>
                </div>
              </div>

              {/* What you're getting into */}
              <div className="rounded-[20px] border border-white/[0.04] bg-white/[0.01] p-6 space-y-4">
                <p className="text-[10px] tracking-[0.2em] uppercase text-emerald-400/50 font-[var(--font-space-grotesk)]">
                  What you're signing up for
                </p>
                {[
                  { icon: "⬡", text: "Provision your own infrastructure — home server or cloud" },
                  { icon: "△", text: "Deploy and maintain a VEIL validator node" },
                  { icon: "◇", text: "Generate a ZER0ID — privacy-preserving ZK identity" },
                  { icon: "▽", text: "Participate in prediction markets and governance" },
                  { icon: "◈", text: "Build and operate autonomous ANIMA agents" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-emerald-400/40 text-sm w-5 text-center">{item.icon}</span>
                    <span className="text-[13px] text-white/40">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Requirements */}
              <div className="rounded-[20px] border border-amber-500/10 bg-amber-500/[0.02] p-6">
                <p className="text-[10px] tracking-[0.2em] uppercase text-amber-400/50 font-[var(--font-space-grotesk)] mb-3">
                  Requirements
                </p>
                <ul className="space-y-2 text-[13px] text-white/35">
                  <li>• 0.5 AVAX enrollment stake (refundable within 30 days)</li>
                  <li>• Hardware for a validator node OR cloud budget (~$5-20/mo)</li>
                  <li>• Avalanche C-Chain wallet (MetaMask, Core, or WalletConnect)</li>
                  <li>• Technical ability to maintain a running node</li>
                </ul>
              </div>

              <button
                onClick={() => setStep("form")}
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-10 py-4 font-[var(--font-space-grotesk)] text-sm font-medium tracking-wider uppercase text-white transition-all hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]"
              >
                <span className="relative z-10">Begin Application</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            </motion.div>
          )}

          {/* ═══ FORM ═══ */}
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <button onClick={() => setStep("intro")}
                  className="text-[11px] text-white/20 hover:text-white/40 transition-colors mb-4 font-[var(--font-space-grotesk)]">
                  ← Back
                </button>
                <h2 className="text-3xl font-light mb-2"
                  style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.9)" }}>
                  Developer Application
                </h2>
                <p className="text-[13px] text-white/30">All fields required unless noted.</p>
              </div>

              {/* Identity */}
              <div className="space-y-4">
                <p className="text-[10px] tracking-[0.2em] uppercase text-emerald-400/40 font-[var(--font-space-grotesk)]">
                  Identity
                </p>
                <TextInput label="Name or Pseudonym" value={app.name} onChange={v => update("name", v)} placeholder="How should we address you?" />
                <TextInput label="Handle" value={app.handle} onChange={v => update("handle", v)} placeholder="GitHub, X, or any public handle" />
                <TextInput label="Wallet Address (optional)" value={app.walletAddress} onChange={v => update("walletAddress", v)} placeholder="0x..." mono />
                <p className="text-[11px] text-white/15">Wallet can be connected later during onboarding.</p>
              </div>

              {/* Technical */}
              <div className="space-y-4">
                <p className="text-[10px] tracking-[0.2em] uppercase text-emerald-400/40 font-[var(--font-space-grotesk)]">
                  Technical Background
                </p>
                <SelectGrid label="Experience Level" options={EXPERIENCE_LEVELS} value={app.experience} onChange={v => update("experience", v)} />
                <SelectGrid label="Skills" options={BACKGROUND_OPTIONS} value={app.background} onChange={v => update("background", v)} multi />
              </div>

              {/* Intent */}
              <div className="space-y-4">
                <p className="text-[10px] tracking-[0.2em] uppercase text-emerald-400/40 font-[var(--font-space-grotesk)]">
                  What You Want to Build
                </p>
                <SelectGrid label="Primary Role" options={INTENT_OPTIONS} value={app.intent} onChange={v => update("intent", v)} />
                <TextArea
                  label="Proposal"
                  value={app.proposal}
                  onChange={v => update("proposal", v)}
                  placeholder="What do you want to build on VEIL? Why does this network matter to you? What will you contribute? (minimum 50 characters)"
                  rows={5}
                />
                {app.proposal.length > 0 && app.proposal.length < 50 && (
                  <p className="text-[11px] text-amber-400/50">{50 - app.proposal.length} more characters needed</p>
                )}
              </div>

              {/* Infrastructure */}
              <div className="space-y-4">
                <p className="text-[10px] tracking-[0.2em] uppercase text-emerald-400/40 font-[var(--font-space-grotesk)]">
                  Infrastructure Plan
                </p>
                <SelectGrid label="How will you run your node?" options={INFRA_OPTIONS} value={app.infraPlan} onChange={v => update("infraPlan", v)} />
              </div>

              {/* Agreements */}
              <div className="space-y-4 pt-4 border-t border-white/[0.04]">
                <Checkbox
                  label="I understand VEIL is a permissioned network. My application may be reviewed and rejected. There is no guarantee of admission."
                  checked={app.acceptsPermissioned}
                  onChange={v => update("acceptsPermissioned", v)}
                />
                <Checkbox
                  label="I accept the network terms and understand the 0.5 AVAX enrollment stake requirement. I will maintain my infrastructure and participate in good faith."
                  checked={app.acceptsTerms}
                  onChange={v => update("acceptsTerms", v)}
                />
              </div>

              {/* Review */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setStep("review")}
                  disabled={!isFormValid}
                  className={`group relative overflow-hidden rounded-full px-10 py-4 font-[var(--font-space-grotesk)] text-sm font-medium tracking-wider uppercase transition-all ${
                    isFormValid
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]"
                      : "bg-white/[0.03] text-white/20 cursor-not-allowed"
                  }`}
                >
                  Review Application
                </button>
                {!isFormValid && (
                  <span className="text-[11px] text-white/15">Complete all fields to continue</span>
                )}
              </div>
            </motion.div>
          )}

          {/* ═══ REVIEW ═══ */}
          {step === "review" && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <button onClick={() => setStep("form")}
                  className="text-[11px] text-white/20 hover:text-white/40 transition-colors mb-4 font-[var(--font-space-grotesk)]">
                  ← Edit
                </button>
                <h2 className="text-3xl font-light mb-2"
                  style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.9)" }}>
                  Review & Submit
                </h2>
                <p className="text-[13px] text-white/30">Verify your application before submitting.</p>
              </div>

              <div className="rounded-[20px] border border-white/[0.04] bg-white/[0.01] p-6 space-y-5">
                {[
                  { label: "Name", value: app.name },
                  { label: "Handle", value: app.handle },
                  { label: "Wallet", value: app.walletAddress || "Not provided yet" },
                  { label: "Experience", value: EXPERIENCE_LEVELS.find(e => e.id === app.experience)?.label },
                  { label: "Skills", value: app.background.join(", ") },
                  { label: "Role", value: INTENT_OPTIONS.find(i => i.id === app.intent)?.label },
                  { label: "Infrastructure", value: INFRA_OPTIONS.find(i => i.id === app.infraPlan)?.label },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-start">
                    <span className="text-[11px] uppercase tracking-[0.15em] text-white/25 font-[var(--font-space-grotesk)] w-28 flex-shrink-0">{item.label}</span>
                    <span className="text-[13px] text-white/60 text-right">{item.value}</span>
                  </div>
                ))}
                <div className="pt-3 border-t border-white/[0.04]">
                  <span className="text-[11px] uppercase tracking-[0.15em] text-white/25 font-[var(--font-space-grotesk)] block mb-2">Proposal</span>
                  <p className="text-[13px] text-white/50 leading-relaxed">{app.proposal}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={`group relative overflow-hidden rounded-full px-10 py-4 font-[var(--font-space-grotesk)] text-sm font-medium tracking-wider uppercase transition-all ${
                    submitting
                      ? "bg-amber-600/50 text-white cursor-wait"
                      : "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]"
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>⟳</motion.span>
                      Submitting to IPFS…
                    </span>
                  ) : "Submit Application"}
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══ SUBMITTED ═══ */}
          {step === "submitted" && (
            <motion.div
              key="submitted"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] mb-6"
                >
                  <span className="text-3xl text-emerald-400">✓</span>
                </motion.div>
                <h2 className="text-3xl font-light mb-3"
                  style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.9)" }}>
                  Application Received
                </h2>
                <p className="text-[15px] text-white/35 max-w-md mx-auto leading-relaxed">
                  Your application has been stored on IPFS and queued for review.
                  The committee will evaluate your proposal and respond within 72 hours.
                </p>
              </div>

              <div className="rounded-[20px] border border-emerald-500/10 bg-emerald-500/[0.02] p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/40 font-[var(--font-space-grotesk)]">Application ID</span>
                    <span className="font-mono text-xs text-emerald-400/70">{applicationId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/40 font-[var(--font-space-grotesk)]">Status</span>
                    <span className="text-xs text-amber-400/70">Pending Review</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/40 font-[var(--font-space-grotesk)]">Storage</span>
                    <span className="text-xs text-white/40">VEILdb (IPFS + OrbitDB)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/40 font-[var(--font-space-grotesk)]">Response Time</span>
                    <span className="text-xs text-white/40">≤ 72 hours</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[20px] border border-white/[0.04] bg-white/[0.01] p-6">
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/25 font-[var(--font-space-grotesk)] mb-3">
                  What happens next
                </p>
                <div className="space-y-3 text-[13px] text-white/35">
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400/40 mt-0.5">1.</span>
                    <span>Committee reviews your application and proposal</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400/40 mt-0.5">2.</span>
                    <span>If approved, you receive an enrollment token via the handle you provided</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400/40 mt-0.5">3.</span>
                    <span>Use the token to begin the 10-stage onboarding process at <Link href="/app/onboard" className="text-emerald-400/60 hover:text-emerald-400/80 transition-colors">/onboard</Link></span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400/40 mt-0.5">4.</span>
                    <span>Token expires in 72 hours — complete onboarding before then</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 justify-center">
                <Link href="/exploreveil"
                  className="rounded-full border border-white/[0.08] bg-white/[0.02] px-6 py-3 font-[var(--font-space-grotesk)] text-sm text-white/40 hover:text-white/60 transition-colors">
                  ← Back to VEIL
                </Link>
                <Link href="/app/docs"
                  className="rounded-full border border-emerald-500/15 bg-emerald-500/[0.04] px-6 py-3 font-[var(--font-space-grotesk)] text-sm text-emerald-400/60 hover:text-emerald-400/80 transition-colors">
                  Read the Docs →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <VeilFooter />
    </div>
  )
}
