"use client"

import { useState, useRef, useCallback, useEffect, useMemo, Suspense } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion"
import Link from "next/link"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { VeilFooter, VeilHeader, FilmGrain } from "@/components/brand"

/* ===========================================================================
   VEIL DEVELOPER APPLICATION — AAA CINEMATIC EXPERIENCE
   
   Full R3F 3D scenes, particle systems, interactive geometry,
   referral system, cinematic transitions between steps.
   =========================================================================== */

type AppStep = "intro" | "identity" | "technical" | "intent" | "infra" | "referral" | "review" | "submitting" | "submitted"

interface ApplicationData {
  name: string
  handle: string
  walletAddress: string
  experience: string
  background: string[]
  intent: string
  proposal: string
  infraPlan: string
  referralCode: string
  referrerHandle: string
  acceptsTerms: boolean
  acceptsPermissioned: boolean
}

const EMPTY_APP: ApplicationData = {
  name: "", handle: "", walletAddress: "", experience: "", background: [],
  intent: "", proposal: "", infraPlan: "", referralCode: "", referrerHandle: "",
  acceptsTerms: false, acceptsPermissioned: false,
}

/* ═══════════════════════════════════════════════════════════════════════════
   3D COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */

function FloatingParticles({ count = 200, color = "#10b981", speed = 0.3 }: { count?: number; color?: string; speed?: number }) {
  const mesh = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return arr
  }, [count])

  const sizes = useMemo(() => {
    const arr = new Float32Array(count)
    for (let i = 0; i < count; i++) arr[i] = Math.random() * 2 + 0.5
    return arr
  }, [count])

  useFrame((state) => {
    if (!mesh.current) return
    mesh.current.rotation.y = state.clock.elapsedTime * speed * 0.05
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.03) * 0.1
    const pos = mesh.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += Math.sin(state.clock.elapsedTime * speed + i * 0.1) * 0.001
    }
    mesh.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.04} transparent opacity={0.4} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

function GateStructure({ open, progress }: { open: boolean; progress: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const leftRef = useRef<THREE.Mesh>(null)
  const rightRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05
    
    // Gate opening animation
    const openAmount = open ? 1.5 : 0
    if (leftRef.current) {
      leftRef.current.position.x = THREE.MathUtils.lerp(leftRef.current.position.x, -0.3 - openAmount, 0.02)
    }
    if (rightRef.current) {
      rightRef.current.position.x = THREE.MathUtils.lerp(rightRef.current.position.x, 0.3 + openAmount, 0.02)
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Left gate pillar */}
      <mesh ref={leftRef} position={[-0.3, 0, 0]}>
        <boxGeometry args={[0.15, 3, 0.15]} />
        <meshStandardMaterial color="#10b981" transparent opacity={0.15} wireframe />
      </mesh>
      {/* Right gate pillar */}
      <mesh ref={rightRef} position={[0.3, 0, 0]}>
        <boxGeometry args={[0.15, 3, 0.15]} />
        <meshStandardMaterial color="#10b981" transparent opacity={0.15} wireframe />
      </mesh>
      {/* Top beam */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[2.5, 0.08, 0.08]} />
        <meshStandardMaterial color="#10b981" transparent opacity={0.1} emissive="#10b981" emissiveIntensity={0.3} />
      </mesh>
      {/* Center inverted triangle (VEIL logo) */}
      <mesh position={[0, 0.8, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.3, 0.5, 3]} />
        <meshStandardMaterial color="#10b981" transparent opacity={0.08 + progress * 0.15} emissive="#10b981" emissiveIntensity={progress * 0.5} wireframe />
      </mesh>
      {/* Glow rings */}
      {[0, 0.5, 1.0].map((y, i) => (
        <mesh key={i} position={[0, -1 + y * 3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.2 - i * 0.2, 0.005, 8, 64]} />
          <meshStandardMaterial color="#10b981" transparent opacity={0.06 + progress * 0.05} emissive="#10b981" emissiveIntensity={0.2} />
        </mesh>
      ))}
    </group>
  )
}

function DataStream({ active }: { active: boolean }) {
  const ref = useRef<THREE.Points>(null)
  const count = 500
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const t = i / count
      arr[i * 3] = (Math.random() - 0.5) * 0.3
      arr[i * 3 + 1] = t * 8 - 4
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.3
    }
    return arr
  }, [])

  useFrame((state) => {
    if (!ref.current || !active) return
    const pos = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= 0.03
      if (pos[i * 3 + 1] < -4) {
        pos[i * 3 + 1] = 4
        pos[i * 3] = (Math.random() - 0.5) * 0.3
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.3
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#10b981" size={0.015} transparent opacity={active ? 0.6 : 0.1} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

function NetworkMesh({ nodeCount = 8 }: { nodeCount?: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const nodes = useMemo(() => {
    return Array.from({ length: nodeCount }, (_, i) => {
      const angle = (i / nodeCount) * Math.PI * 2
      const r = 1.5 + Math.random() * 0.5
      return new THREE.Vector3(Math.cos(angle) * r, (Math.random() - 0.5) * 1.5, Math.sin(angle) * r)
    })
  }, [nodeCount])

  const edges = useMemo(() => {
    const e: [number, number][] = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 2.5) e.push([i, j])
      }
    }
    return e
  }, [nodes])

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.08
  })

  return (
    <group ref={groupRef}>
      {nodes.map((pos, i) => (
        <mesh key={`n${i}`} position={pos}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
        </mesh>
      ))}
      {edges.map(([a, b], i) => {
        const start = nodes[a]
        const end = nodes[b]
        const mid = new THREE.Vector3().lerpVectors(start, end, 0.5)
        const dir = new THREE.Vector3().subVectors(end, start)
        const len = dir.length()
        return (
          <mesh key={`e${i}`} position={mid} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())}>
            <cylinderGeometry args={[0.003, 0.003, len, 4]} />
            <meshStandardMaterial color="#10b981" transparent opacity={0.12} />
          </mesh>
        )
      })}
    </group>
  )
}

function HeroScene({ step, progress }: { step: AppStep; progress: number }) {
  const isGateOpen = ["submitted", "submitting"].includes(step)
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }} style={{ position: "absolute", inset: 0 }} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={0.1} />
      <pointLight position={[5, 5, 5]} intensity={0.3} color="#10b981" />
      <pointLight position={[-5, -3, 3]} intensity={0.15} color="#34d399" />
      <Suspense fallback={null}>
        <FloatingParticles count={300} speed={0.2} />
        <GateStructure open={isGateOpen} progress={progress} />
        <DataStream active={step !== "intro"} />
        <NetworkMesh nodeCount={10} />
      </Suspense>
    </Canvas>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   STEP PROGRESS BAR
   ═══════════════════════════════════════════════════════════════════════════ */

const STEPS: AppStep[] = ["intro", "identity", "technical", "intent", "infra", "referral", "review", "submitted"]
const STEP_LABELS: Record<string, string> = {
  intro: "Gate", identity: "Identity", technical: "Skills", intent: "Purpose",
  infra: "Hardware", referral: "Network", review: "Seal", submitted: "Citizen"
}

function StepProgress({ current, onNavigate }: { current: AppStep; onNavigate: (s: AppStep) => void }) {
  const currentIdx = STEPS.indexOf(current)
  return (
    <div className="flex items-center gap-1 justify-center mb-10">
      {STEPS.filter(s => s !== "submitted").map((s, i) => {
        const isPast = i < currentIdx
        const isCurrent = s === current
        return (
          <button
            key={s}
            onClick={() => isPast && onNavigate(s)}
            disabled={!isPast}
            className="flex items-center gap-1"
          >
            <motion.div
              className={`h-1.5 rounded-full transition-all duration-500 ${
                isCurrent ? "w-8 bg-emerald-400" : isPast ? "w-4 bg-emerald-400/40 cursor-pointer hover:bg-emerald-400/60" : "w-4 bg-white/[0.06]"
              }`}
              layoutId={`step-${s}`}
            />
          </button>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   FORM COMPONENTS (upgraded)
   ═══════════════════════════════════════════════════════════════════════════ */

function GlowInput({ label, value, onChange, placeholder, mono, icon }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean; icon?: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
      <label className="block text-[10px] uppercase tracking-[0.2em] text-white/30 font-[var(--font-space-grotesk)] mb-2">
        {icon && <span className="mr-1">{icon}</span>}{label}
      </label>
      <div className="relative">
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className={`w-full rounded-[16px] border bg-[#060606]/80 backdrop-blur-sm px-5 py-4 text-sm text-white/90 outline-none transition-all duration-300 placeholder:text-white/15 ${
            mono ? "font-mono text-xs" : ""
          } ${focused ? "border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.08)]" : "border-white/[0.06]"}`}
        />
        {focused && (
          <motion.div
            className="absolute inset-0 rounded-[16px] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ boxShadow: "inset 0 0 30px rgba(16,185,129,0.03)" }}
          />
        )}
      </div>
    </motion.div>
  )
}

function GlowTextArea({ label, value, onChange, placeholder, rows }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number
}) {
  const [focused, setFocused] = useState(false)
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
      <label className="block text-[10px] uppercase tracking-[0.2em] text-white/30 font-[var(--font-space-grotesk)] mb-2">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        rows={rows || 4}
        className={`w-full rounded-[16px] border bg-[#060606]/80 backdrop-blur-sm px-5 py-4 text-sm text-white/90 outline-none transition-all duration-300 placeholder:text-white/15 resize-none leading-relaxed ${
          focused ? "border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.08)]" : "border-white/[0.06]"
        }`}
      />
    </motion.div>
  )
}

function HexCard({ selected, onClick, icon, label, desc, delay }: {
  selected: boolean; onClick: () => void; icon: string; label: string; desc?: string; delay?: number
}) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay || 0 }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative text-left rounded-[18px] border p-5 transition-all duration-300 overflow-hidden ${
        selected
          ? "border-emerald-500/30 bg-emerald-500/[0.06] shadow-[0_0_30px_rgba(16,185,129,0.06)]"
          : "border-white/[0.05] bg-white/[0.01] hover:border-white/[0.1] hover:bg-white/[0.015]"
      }`}
    >
      {selected && (
        <motion.div layoutId="hex-glow" className="absolute inset-0 rounded-[18px]"
          style={{ background: "radial-gradient(circle at 30% 30%, rgba(16,185,129,0.06), transparent 70%)" }} />
      )}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-1">
          <span className={`text-xl transition-colors ${selected ? "text-emerald-400" : "text-white/30"}`}>{icon}</span>
          <span className={`font-[var(--font-space-grotesk)] text-sm font-medium transition-colors ${
            selected ? "text-emerald-300" : "text-white/70"
          }`}>{label}</span>
          {selected && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto text-emerald-400 text-xs">✓</motion.span>
          )}
        </div>
        {desc && <p className={`text-[11px] mt-1 transition-colors ${selected ? "text-emerald-400/40" : "text-white/20"}`}>{desc}</p>}
      </div>
    </motion.button>
  )
}

function SkillChip({ selected, onClick, label, delay }: {
  selected: boolean; onClick: () => void; label: string; delay?: number
}) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: delay || 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`rounded-full border px-5 py-2.5 text-sm font-[var(--font-space-grotesk)] transition-all duration-300 ${
        selected
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.08)]"
          : "border-white/[0.06] bg-white/[0.01] text-white/40 hover:border-white/[0.12] hover:text-white/60"
      }`}
    >
      {label}
    </motion.button>
  )
}

function GlowCheckbox({ label, checked, onChange }: {
  label: string; checked: boolean; onChange: (v: boolean) => void
}) {
  return (
    <motion.button
      onClick={() => onChange(!checked)}
      whileTap={{ scale: 0.98 }}
      className="flex items-start gap-4 text-left group"
    >
      <motion.div
        animate={checked ? { borderColor: "rgba(16,185,129,0.4)", backgroundColor: "rgba(16,185,129,0.1)" } : { borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.01)" }}
        className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center"
      >
        <AnimatePresence>
          {checked && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-emerald-400 text-sm">✓</motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <span className="text-[13px] text-white/35 leading-relaxed group-hover:text-white/50 transition-colors">{label}</span>
    </motion.button>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUBMISSION ANIMATION (cinematic)
   ═══════════════════════════════════════════════════════════════════════════ */

function SubmissionSequence({ applicationId, onComplete }: { applicationId: string; onComplete: () => void }) {
  const [phase, setPhase] = useState(0)
  const phases = [
    "Encrypting application data...",
    "Generating IPFS content hash...",
    "Pinning to VEILdb...",
    "Registering in OrbitDB...",
    "Queuing for committee review...",
    "Application sealed.",
  ]

  useEffect(() => {
    const timers = phases.map((_, i) =>
      setTimeout(() => {
        setPhase(i)
        if (i === phases.length - 1) setTimeout(onComplete, 1200)
      }, i * 800)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      {/* Spinning hexagon */}
      <div className="relative w-32 h-32">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-emerald-500/20"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-3 rounded-full border border-emerald-500/10"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="text-4xl text-emerald-400">▽</span>
        </motion.div>
      </div>

      {/* Phase text */}
      <div className="text-center space-y-3">
        <AnimatePresence mode="wait">
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="font-mono text-sm text-emerald-400/70"
          >
            {phases[phase]}
          </motion.p>
        </AnimatePresence>
        <p className="font-mono text-[10px] text-white/15">{applicationId}</p>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-1 bg-white/[0.04] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${((phase + 1) / phases.length) * 100}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>

      {/* Hash stream */}
      <div className="font-mono text-[9px] text-white/10 max-w-md text-center leading-relaxed overflow-hidden h-12">
        {Array.from({ length: 6 }, (_, i) => (
          <motion.div
            key={`${phase}-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            {Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

const EXPERIENCE_LEVELS = [
  { id: "beginner", icon: "◇", label: "Beginner", desc: "Learning blockchain dev" },
  { id: "intermediate", icon: "◈", label: "Intermediate", desc: "Shipped a few projects" },
  { id: "advanced", icon: "⬡", label: "Advanced", desc: "Production experience" },
  { id: "expert", icon: "△", label: "Expert", desc: "Protocol-level contributor" },
]

const SKILLS = ["Solidity", "Rust", "Go", "TypeScript", "ZK Proofs", "Infrastructure", "DeFi", "AI / Agents"]

const INTENTS = [
  { id: "validator", icon: "△", label: "Run a Validator", desc: "Secure the network with your own node" },
  { id: "agent_developer", icon: "◈", label: "Build Agents", desc: "Create autonomous ANIMA agents" },
  { id: "market_maker", icon: "▽", label: "Market Making", desc: "Provide liquidity to prediction markets" },
  { id: "researcher", icon: "◎", label: "Research", desc: "ZK proofs, privacy, mechanism design" },
  { id: "contributor", icon: "⬡", label: "Core Contributor", desc: "Contribute to the protocol" },
]

const INFRA = [
  { id: "home_server", icon: "⬡", label: "Home Server", desc: "Under $100 — true sovereignty. Your hardware, your rules." },
  { id: "cloud", icon: "☁", label: "Cloud", desc: "Automated deploy — $5-20/mo. Faster start, managed infra." },
  { id: "undecided", icon: "◎", label: "Undecided", desc: "Choose later during onboarding. No pressure." },
]

export default function ApplyPage() {
  const [step, setStep] = useState<AppStep>("intro")
  const [app, setApp] = useState<ApplicationData>(EMPTY_APP)
  const [applicationId, setApplicationId] = useState("")
  const [referralGenerated, setReferralGenerated] = useState("")

  const update = useCallback((field: keyof ApplicationData, value: any) => {
    setApp(prev => ({ ...prev, [field]: value }))
  }, [])

  const toggleSkill = useCallback((skill: string) => {
    setApp(prev => ({
      ...prev,
      background: prev.background.includes(skill)
        ? prev.background.filter(s => s !== skill)
        : [...prev.background, skill]
    }))
  }, [])

  const progress = STEPS.indexOf(step) / (STEPS.length - 1)

  const canAdvance = (s: AppStep) => {
    switch (s) {
      case "identity": return app.name && app.handle
      case "technical": return app.experience && app.background.length > 0
      case "intent": return app.intent && app.proposal.length >= 50
      case "infra": return app.infraPlan
      case "referral": return true // optional
      case "review": return app.acceptsTerms && app.acceptsPermissioned
      default: return true
    }
  }

  const nextStep = () => {
    const idx = STEPS.indexOf(step)
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1])
  }

  const prevStep = () => {
    const idx = STEPS.indexOf(step)
    if (idx > 0) setStep(STEPS[idx - 1])
  }

  const handleSubmit = useCallback(() => {
    const t = Date.now().toString(36).padStart(9, "0")
    const r = Array.from({ length: 8 }, () => Math.floor(Math.random() * 36).toString(36)).join("")
    setApplicationId(`veil_app_${t}${r}`)
    setReferralGenerated(`veil_ref_${Array.from({ length: 12 }, () => Math.floor(Math.random() * 36).toString(36)).join("")}`)
    setStep("submitting")
  }, [])

  return (
    <div className="relative min-h-screen bg-[#060606] text-white overflow-hidden">
      <FilmGrain />
      <VeilHeader current="apply" />

      {/* 3D Background — persistent across all steps */}
      <div className="fixed inset-0 z-0 opacity-60">
        <HeroScene step={step} progress={progress} />
      </div>

      {/* Dark gradient overlay for readability */}
      <div className="fixed inset-0 z-[1] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(6,6,6,0.4) 0%, rgba(6,6,6,0.85) 70%)" }} />

      <main className="relative z-10 max-w-2xl mx-auto px-6 pt-28 pb-32">
        {!["intro", "submitting", "submitted"].includes(step) && (
          <StepProgress current={step} onNavigate={setStep} />
        )}

        <AnimatePresence mode="wait">
          {/* ═══ INTRO ═══ */}
          {step === "intro" && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }} className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-8">
              <motion.div initial={{ y: 30 }} animate={{ y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
                <p className="text-[10px] tracking-[0.5em] uppercase mb-6"
                  style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.5)" }}>
                  Permissioned Access · Avalanche L1 · Chain 22207
                </p>
                <h1 className="text-5xl md:text-7xl font-light leading-[1.05] mb-6"
                  style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.95)" }}>
                  Request Entry
                </h1>
                <p className="text-[16px] text-white/30 max-w-lg mx-auto leading-relaxed"
                  style={{ fontFamily: "var(--font-figtree)" }}>
                  No users. No spectators. Every human builds.<br />
                  Every agent operates. The gate opens for builders.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                className="flex flex-col items-center gap-4">
                <button
                  onClick={() => setStep("identity")}
                  className="group relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-12 py-5 font-[var(--font-space-grotesk)] text-sm font-semibold tracking-[0.2em] uppercase text-white transition-all hover:shadow-[0_0_60px_rgba(16,185,129,0.3)]"
                >
                  <span className="relative z-10">Approach the Gate</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
                <p className="text-[11px] text-white/15">0.5 AVAX stake · ~5 min · Reviewed in ≤72h</p>
              </motion.div>
            </motion.div>
          )}

          {/* ═══ IDENTITY ═══ */}
          {step === "identity" && (
            <motion.div key="identity" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-light" style={{ fontFamily: "var(--font-instrument-serif)" }}>Who are you?</h2>
                <p className="text-[13px] text-white/25 mt-2">Pseudonyms welcome. This is a permissioned network, not a surveillance state.</p>
              </div>
              <div className="space-y-5">
                <GlowInput icon="◇" label="Name or Pseudonym" value={app.name} onChange={v => update("name", v)} placeholder="How should the network know you?" />
                <GlowInput icon="◈" label="Handle" value={app.handle} onChange={v => update("handle", v)} placeholder="GitHub, X, Telegram — we'll reach you here" />
                <GlowInput icon="⬡" label="Wallet Address" value={app.walletAddress} onChange={v => update("walletAddress", v)} placeholder="0x... (optional — connect during onboarding)" mono />
              </div>
              <div className="flex items-center gap-4 pt-4">
                <button onClick={prevStep} className="text-[11px] text-white/20 hover:text-white/40 transition-colors font-[var(--font-space-grotesk)]">← Back</button>
                <button onClick={nextStep} disabled={!canAdvance("identity")}
                  className={`ml-auto rounded-full px-8 py-3.5 font-[var(--font-space-grotesk)] text-sm font-medium transition-all ${
                    canAdvance("identity") ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/30" : "bg-white/[0.02] text-white/15 cursor-not-allowed"
                  }`}>Continue →</button>
              </div>
            </motion.div>
          )}

          {/* ═══ TECHNICAL ═══ */}
          {step === "technical" && (
            <motion.div key="technical" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-light" style={{ fontFamily: "var(--font-instrument-serif)" }}>What do you know?</h2>
                <p className="text-[13px] text-white/25 mt-2">Beginners build too. Be honest — we'll match you to the right path.</p>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-[var(--font-space-grotesk)] mb-3">Experience Level</p>
                  <div className="grid grid-cols-2 gap-2">
                    {EXPERIENCE_LEVELS.map((exp, i) => (
                      <HexCard key={exp.id} icon={exp.icon} label={exp.label} desc={exp.desc}
                        selected={app.experience === exp.id} onClick={() => update("experience", exp.id)} delay={i * 0.08} />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-[var(--font-space-grotesk)] mb-3">Skills <span className="text-white/10">(select all)</span></p>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.map((skill, i) => (
                      <SkillChip key={skill} label={skill} selected={app.background.includes(skill)}
                        onClick={() => toggleSkill(skill)} delay={i * 0.05} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <button onClick={prevStep} className="text-[11px] text-white/20 hover:text-white/40 transition-colors font-[var(--font-space-grotesk)]">← Back</button>
                <button onClick={nextStep} disabled={!canAdvance("technical")}
                  className={`ml-auto rounded-full px-8 py-3.5 font-[var(--font-space-grotesk)] text-sm font-medium transition-all ${
                    canAdvance("technical") ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/30" : "bg-white/[0.02] text-white/15 cursor-not-allowed"
                  }`}>Continue →</button>
              </div>
            </motion.div>
          )}

          {/* ═══ INTENT ═══ */}
          {step === "intent" && (
            <motion.div key="intent" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-light" style={{ fontFamily: "var(--font-instrument-serif)" }}>What will you build?</h2>
                <p className="text-[13px] text-white/25 mt-2">The network needs purpose. Tell us yours.</p>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-2">
                  {INTENTS.map((intent, i) => (
                    <HexCard key={intent.id} icon={intent.icon} label={intent.label} desc={intent.desc}
                      selected={app.intent === intent.id} onClick={() => update("intent", intent.id)} delay={i * 0.08} />
                  ))}
                </div>
                <GlowTextArea label="Your Proposal" value={app.proposal} onChange={v => update("proposal", v)} rows={5}
                  placeholder="What will you build? Why VEIL? What's your edge? (min 50 chars)" />
                {app.proposal.length > 0 && app.proposal.length < 50 && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-white/[0.04] rounded-full overflow-hidden">
                      <motion.div className="h-full bg-amber-500/50 rounded-full" style={{ width: `${(app.proposal.length / 50) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-amber-400/50 font-mono">{50 - app.proposal.length}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 pt-4">
                <button onClick={prevStep} className="text-[11px] text-white/20 hover:text-white/40 transition-colors font-[var(--font-space-grotesk)]">← Back</button>
                <button onClick={nextStep} disabled={!canAdvance("intent")}
                  className={`ml-auto rounded-full px-8 py-3.5 font-[var(--font-space-grotesk)] text-sm font-medium transition-all ${
                    canAdvance("intent") ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/30" : "bg-white/[0.02] text-white/15 cursor-not-allowed"
                  }`}>Continue →</button>
              </div>
            </motion.div>
          )}

          {/* ═══ INFRASTRUCTURE ═══ */}
          {step === "infra" && (
            <motion.div key="infra" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-light" style={{ fontFamily: "var(--font-instrument-serif)" }}>Where will your node live?</h2>
                <p className="text-[13px] text-white/25 mt-2">Infrastructure first. Agents need a home before they can exist.</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {INFRA.map((opt, i) => (
                  <HexCard key={opt.id} icon={opt.icon} label={opt.label} desc={opt.desc}
                    selected={app.infraPlan === opt.id} onClick={() => update("infraPlan", opt.id)} delay={i * 0.1} />
                ))}
              </div>
              {app.infraPlan === "home_server" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  className="rounded-[16px] border border-emerald-500/10 bg-emerald-500/[0.02] p-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/50 font-[var(--font-space-grotesk)] mb-2">Recommended Hardware</p>
                  <p className="text-[12px] text-white/30 leading-relaxed">
                    Any mini PC: Intel N100+, 8GB RAM, 128GB SSD. ~$50-80 on Amazon.
                    We'll guide you through the full setup during onboarding.
                  </p>
                </motion.div>
              )}
              <div className="flex items-center gap-4 pt-4">
                <button onClick={prevStep} className="text-[11px] text-white/20 hover:text-white/40 transition-colors font-[var(--font-space-grotesk)]">← Back</button>
                <button onClick={nextStep} disabled={!canAdvance("infra")}
                  className={`ml-auto rounded-full px-8 py-3.5 font-[var(--font-space-grotesk)] text-sm font-medium transition-all ${
                    canAdvance("infra") ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/30" : "bg-white/[0.02] text-white/15 cursor-not-allowed"
                  }`}>Continue →</button>
              </div>
            </motion.div>
          )}

          {/* ═══ REFERRAL ═══ */}
          {step === "referral" && (
            <motion.div key="referral" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-light" style={{ fontFamily: "var(--font-instrument-serif)" }}>The Network Effect</h2>
                <p className="text-[13px] text-white/25 mt-2">VEIL grows through its builders. Referrals accelerate your review.</p>
              </div>

              <div className="rounded-[20px] border border-emerald-500/10 bg-emerald-500/[0.02] p-6 space-y-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/50 font-[var(--font-space-grotesk)]">How Referrals Work</p>
                <div className="space-y-3 text-[13px] text-white/35 leading-relaxed">
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400/50 font-mono text-sm mt-0.5">01</span>
                    <span><strong className="text-white/50">Priority Review</strong> — Referred applications jump the queue. Existing network members vouch for you.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400/50 font-mono text-sm mt-0.5">02</span>
                    <span><strong className="text-white/50">Bloodsworn Bonus</strong> — Both referrer and referee start with +50 Bloodsworn reputation points. That's a head start toward Initiate tier.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400/50 font-mono text-sm mt-0.5">03</span>
                    <span><strong className="text-white/50">Network Growth</strong> — Every successful referral strengthens the referrer's Bloodsworn score. Sovereign-tier members can refer unlimited builders.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400/50 font-mono text-sm mt-0.5">04</span>
                    <span><strong className="text-white/50">Your Code</strong> — Once accepted, you'll receive your own referral code. Share it. Grow the network. Earn reputation.</span>
                  </div>
                </div>
              </div>

              <GlowInput icon="🔗" label="Referral Code (optional)" value={app.referralCode} onChange={v => update("referralCode", v)}
                placeholder="veil_ref_... (paste if you have one)" mono />
              <GlowInput icon="◈" label="Who Referred You? (optional)" value={app.referrerHandle} onChange={v => update("referrerHandle", v)}
                placeholder="Their handle or wallet address" />

              {!app.referralCode && (
                <p className="text-[11px] text-white/15">No referral? No problem. Applications without referrals take slightly longer to review but are treated equally.</p>
              )}

              <div className="flex items-center gap-4 pt-4">
                <button onClick={prevStep} className="text-[11px] text-white/20 hover:text-white/40 transition-colors font-[var(--font-space-grotesk)]">← Back</button>
                <button onClick={nextStep}
                  className="ml-auto rounded-full px-8 py-3.5 font-[var(--font-space-grotesk)] text-sm font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/30 transition-all">
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══ REVIEW ═══ */}
          {step === "review" && (
            <motion.div key="review" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-light" style={{ fontFamily: "var(--font-instrument-serif)" }}>Seal Your Application</h2>
                <p className="text-[13px] text-white/25 mt-2">Review. Agree. Submit to the network.</p>
              </div>

              <div className="rounded-[20px] border border-white/[0.04] bg-[#060606]/60 backdrop-blur-sm p-6 space-y-4">
                {[
                  { l: "Identity", v: `${app.name} (@${app.handle})` },
                  { l: "Experience", v: EXPERIENCE_LEVELS.find(e => e.id === app.experience)?.label || "" },
                  { l: "Skills", v: app.background.join(" · ") },
                  { l: "Role", v: INTENTS.find(i => i.id === app.intent)?.label || "" },
                  { l: "Infrastructure", v: INFRA.find(i => i.id === app.infraPlan)?.label || "" },
                  ...(app.referralCode ? [{ l: "Referral", v: app.referralCode }] : []),
                ].map((item, i) => (
                  <motion.div key={item.l} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="flex justify-between items-start py-2 border-b border-white/[0.03] last:border-0">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-white/20 font-[var(--font-space-grotesk)]">{item.l}</span>
                    <span className="text-[13px] text-white/60 text-right max-w-[60%]">{item.v}</span>
                  </motion.div>
                ))}
                <div className="pt-2">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-white/20 font-[var(--font-space-grotesk)] block mb-2">Proposal</span>
                  <p className="text-[13px] text-white/40 leading-relaxed">{app.proposal}</p>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <GlowCheckbox
                  label="I understand VEIL is a permissioned network. My application will be reviewed. Admission is not guaranteed."
                  checked={app.acceptsPermissioned}
                  onChange={v => update("acceptsPermissioned", v)}
                />
                <GlowCheckbox
                  label="I accept the 0.5 AVAX enrollment stake. I will maintain my infrastructure and participate in good faith. I understand the network assembles itself through its builders."
                  checked={app.acceptsTerms}
                  onChange={v => update("acceptsTerms", v)}
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button onClick={prevStep} className="text-[11px] text-white/20 hover:text-white/40 transition-colors font-[var(--font-space-grotesk)]">← Edit</button>
                <button onClick={handleSubmit} disabled={!canAdvance("review")}
                  className={`ml-auto group relative overflow-hidden rounded-full px-12 py-4 font-[var(--font-space-grotesk)] text-sm font-semibold tracking-[0.15em] uppercase transition-all ${
                    canAdvance("review")
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:shadow-[0_0_60px_rgba(16,185,129,0.3)]"
                      : "bg-white/[0.02] text-white/15 cursor-not-allowed"
                  }`}>
                  <span className="relative z-10">Submit to IPFS</span>
                  {canAdvance("review") && <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-0 transition-opacity group-hover:opacity-100" />}
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══ SUBMITTING (cinematic) ═══ */}
          {step === "submitting" && (
            <SubmissionSequence applicationId={applicationId} onComplete={() => setStep("submitted")} />
          )}

          {/* ═══ SUBMITTED ═══ */}
          {step === "submitted" && (
            <motion.div key="submitted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
              className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-8">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring", stiffness: 150 }}>
                <div className="relative inline-block">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-28 h-28 rounded-full border border-emerald-500/15" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl text-emerald-400">▽</span>
                  </div>
                </div>
              </motion.div>

              <div>
                <h2 className="text-4xl font-light mb-3" style={{ fontFamily: "var(--font-instrument-serif)" }}>Application Sealed</h2>
                <p className="text-[15px] text-white/30 max-w-md mx-auto">
                  Encrypted. Pinned to IPFS. Queued for committee review.<br />
                  The gate will open if you belong here.
                </p>
              </div>

              <div className="rounded-[20px] border border-emerald-500/10 bg-emerald-500/[0.02] p-6 w-full max-w-md space-y-3 text-left">
                {[
                  { l: "Application", v: applicationId },
                  { l: "Status", v: "Pending Review", color: "text-amber-400/70" },
                  { l: "Storage", v: "VEILdb · IPFS · OrbitDB" },
                  { l: "Response", v: app.referralCode ? "≤24h (referred)" : "≤72h" },
                ].map(item => (
                  <div key={item.l} className="flex justify-between">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-emerald-400/30 font-[var(--font-space-grotesk)]">{item.l}</span>
                    <span className={`font-mono text-xs ${item.color || "text-emerald-400/60"}`}>{item.v}</span>
                  </div>
                ))}
              </div>

              {/* Referral code generation */}
              <div className="rounded-[20px] border border-white/[0.04] bg-white/[0.01] p-6 w-full max-w-md text-left space-y-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-[var(--font-space-grotesk)]">Your Referral Code</p>
                <p className="text-[12px] text-white/30 leading-relaxed">
                  Once accepted, this code activates. Share it with other builders.
                  Both of you start with +50 Bloodsworn reputation.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <code className="flex-1 font-mono text-xs text-emerald-400/50 bg-emerald-500/[0.04] border border-emerald-500/10 rounded-lg px-4 py-2.5">
                    {referralGenerated}
                  </code>
                  <button
                    onClick={() => navigator.clipboard?.writeText(referralGenerated)}
                    className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-[10px] text-white/30 hover:text-white/60 transition-colors font-[var(--font-space-grotesk)]"
                  >Copy</button>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Link href="/exploreveil"
                  className="rounded-full border border-white/[0.06] bg-white/[0.01] px-6 py-3 font-[var(--font-space-grotesk)] text-sm text-white/30 hover:text-white/50 transition-colors">
                  ← Back to VEIL
                </Link>
                <Link href="/app/docs"
                  className="rounded-full border border-emerald-500/15 bg-emerald-500/[0.03] px-6 py-3 font-[var(--font-space-grotesk)] text-sm text-emerald-400/50 hover:text-emerald-400/70 transition-colors">
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
