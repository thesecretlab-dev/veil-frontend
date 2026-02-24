"use client"

import { useState, useRef, useEffect, useCallback, useMemo, Suspense } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import Link from "next/link"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
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
    detail: "Your application has been reviewed by the VEIL developer committee. An enrollment token has been issued and bound to your session. This token expires in 72 hours — complete onboarding before then.",
  },
  {
    id: "A1_WALLET_BIND",
    name: "Wallet Bind",
    icon: "◈",
    description: "Connect wallet · Sign challenge · Bind identity",
    detail: "Connect your Avalanche C-Chain wallet (MetaMask, Core, or WalletConnect). You'll sign an EIP-712 typed message to cryptographically bind your wallet address to this enrollment. No funds are moved — this is a signature only.",
  },
  {
    id: "A2_PAYMENT",
    name: "Payment",
    icon: "◇",
    description: "AVAX stake observed on C-Chain",
    detail: "Send AVAX to the VEIL enrollment contract on Avalanche C-Chain. This stake is refundable if you don't complete onboarding within 30 days. The contract verifies your payment and locks your position in the validator queue.",
  },
  {
    id: "A3_PROVISION",
    name: "Provision",
    icon: "▣",
    description: "Infrastructure deployed — home server or cloud",
    detail: "Your validator needs a home. Choose your path: set up a home server for under $100 (true sovereignty — your hardware, your keys, your rules) or deploy an automated cloud instance. Both paths produce an identical validator node on the VEIL network.",
  },
  {
    id: "A4_CODEX_ACCESS",
    name: "Codex Access",
    icon: "⌘",
    description: "Secure command channel established",
    detail: "The ANIMA Codex runtime binds to your provisioned server over an encrypted channel. A transcript hash is generated and stored on-chain as proof of channel establishment. This enables secure remote management of your node.",
  },
  {
    id: "A5_NETWORK_NATIVIZED",
    name: "Nativized",
    icon: "◎",
    description: "Peer discovery · RPC health · Chain sync",
    detail: "Your node connects to the VEIL network mesh. Peer discovery locates active validators, RPC endpoints are verified healthy, and your node begins syncing chain state. Once caught up to head, you're nativized — a recognized member of the network fabric.",
  },
  {
    id: "A6_ANIMA_VALIDATED",
    name: "ANIMA Validated",
    icon: "△",
    description: "Agent runtime suite — 14 checks must pass",
    detail: "The ANIMA validation suite runs 14 checks against your node: consensus participation, block proposal capability, action routing, encrypted mempool access, runtime version, liveness heartbeat, and more. All must pass. This is the first of three market unlock gates.",
  },
  {
    id: "A7_ZEROID_8004",
    name: "ZER0ID Passport",
    icon: "ø",
    description: "ZK identity proof · Groth16 verification",
    detail: "Generate a ZER0ID Passport (credential type 8004) using zero-knowledge proofs. Your Groth16 circuit proves you are a unique, verified developer without revealing your real-world identity. The proof is verified on-chain. Second market unlock gate.",
  },
  {
    id: "A8_VALIDATOR_ACTIVE",
    name: "Validator Active",
    icon: "▽",
    description: "Weighted · Heartbeating · Earning rewards",
    detail: "Your validator node is registered in the active set, assigned consensus weight, and heartbeating at 1-second intervals. You are now contributing to VEIL network security and earning validation rewards. Third and final market unlock gate.",
  },
  {
    id: "A9_MARKETS_UNLOCKED",
    name: "Markets Unlocked",
    icon: "◉",
    description: "Full network citizen — all gates cleared",
    detail: "ANIMA Validated ✓ · ZER0ID Passport ✓ · Validator Active ✓ — all three market gates are clear. You now have full access to VEIL prediction markets, governance proposals, the sovereign agent economy, and Bloodsworn reputation advancement. Welcome to the network, citizen.",
  },
]

const GATE_STAGES = ["A6_ANIMA_VALIDATED", "A7_ZEROID_8004", "A8_VALIDATOR_ACTIVE"]

/* ═══════════════════════════════════════════════════════════════
   LIVE NETWORK DATA
   ═══════════════════════════════════════════════════════════════ */

interface NetworkStatus {
  chainId: number
  blockHeight: number | null
  totalPeers: number
  subnetPeers: number
  validators: { nodeId: string; role: string; active: boolean; label: string }[]
  timestamp: string
}

function useNetworkStatus() {
  const [data, setData] = useState<NetworkStatus | null>(null)
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/network-status", { cache: "no-store" })
        if (res.ok) setData(await res.json())
      } catch {}
    }
    poll()
    const timer = setInterval(poll, 5000)
    return () => clearInterval(timer)
  }, [])
  return data
}

/* ═══════════════════════════════════════════════════════════════
   3D NETWORK TETRAHEDRON
   ═══════════════════════════════════════════════════════════════ */

// Inverted tetrahedron vertices (point DOWN = VEIL logo ▽)
const TETRA_VERTS = [
  new THREE.Vector3(0, -1.6, 0),        // bottom point (apex, pointing down)
  new THREE.Vector3(-1.4, 0.8, 0.8),    // top-left-front
  new THREE.Vector3(1.4, 0.8, 0.8),     // top-right-front
  new THREE.Vector3(0, 0.8, -1.4),      // top-back
]

const TETRA_EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], // bottom to top
  [1, 2], [2, 3], [3, 1], // top ring
]

function NetworkEdges() {
  const ref = useRef<THREE.Group>(null)

  const lineGeos = useMemo(() =>
    TETRA_EDGES.map(([a, b]) => {
      const pts = [TETRA_VERTS[a], TETRA_VERTS[b]]
      return new THREE.BufferGeometry().setFromPoints(pts)
    }), [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.children.forEach((child, i) => {
      const mat = (child as THREE.Line).material as THREE.LineBasicMaterial
      mat.opacity = 0.15 + Math.sin(clock.getElapsedTime() * 1.5 + i * 0.8) * 0.08
    })
  })

  return (
    <group ref={ref}>
      {lineGeos.map((geo, i) => (
        <line key={i} geometry={geo}>
          <lineBasicMaterial color="#10b981" transparent opacity={0.2} />
        </line>
      ))}
    </group>
  )
}

function ValidatorNode({ position, role, index, active }: {
  position: THREE.Vector3; role: string; index: number; active: boolean
}) {
  const ref = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  const color = role === "primary" ? "#10b981" : role === "secondary" ? "#34d399" : "#6ee7b7"
  const size = role === "primary" ? 0.12 : 0.08

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    // Gentle float
    ref.current.position.x = position.x + Math.sin(t * 0.5 + index * 2.1) * 0.04
    ref.current.position.y = position.y + Math.sin(t * 0.7 + index * 1.3) * 0.04
    ref.current.position.z = position.z + Math.cos(t * 0.4 + index * 1.7) * 0.04

    if (glowRef.current) {
      glowRef.current.position.copy(ref.current.position)
      const mat = glowRef.current.material as THREE.MeshBasicMaterial
      // Heartbeat pulse
      const heartbeat = Math.pow(Math.sin(t * 2 + index * 1.5), 8)
      mat.opacity = active ? 0.15 + heartbeat * 0.2 : 0.03
      glowRef.current.scale.setScalar(1 + heartbeat * 0.3)
    }
  })

  return (
    <>
      <mesh ref={ref} position={position}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 1.2 : 0.2}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      <mesh ref={glowRef} position={position}>
        <sphereGeometry args={[size * 4, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} side={THREE.BackSide} />
      </mesh>
    </>
  )
}

function DataParticles({ blockHeight }: { blockHeight: number | null }) {
  const ref = useRef<THREE.Points>(null)
  const count = 60

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 2.5 + Math.random() * 1.5
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.getElapsedTime() * 0.03
    ref.current.rotation.x = clock.getElapsedTime() * 0.01
    const mat = ref.current.material as THREE.PointsMaterial
    mat.opacity = 0.2 + Math.sin(clock.getElapsedTime() * 0.5) * 0.08
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#10b981" transparent opacity={0.25}
        sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

function NetworkTetrahedron({ validators }: { validators: { nodeId: string; role: string; active: boolean }[] }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.08
  })

  // Place validators at tetrahedron vertices and interpolated edge positions
  const validatorPositions = useMemo(() => {
    const positions: THREE.Vector3[] = []
    for (let i = 0; i < validators.length; i++) {
      if (i < TETRA_VERTS.length) {
        positions.push(TETRA_VERTS[i].clone())
      } else {
        // Place extras along edges
        const edgeIdx = (i - TETRA_VERTS.length) % TETRA_EDGES.length
        const [a, b] = TETRA_EDGES[edgeIdx]
        const t = 0.3 + Math.random() * 0.4
        positions.push(new THREE.Vector3().lerpVectors(TETRA_VERTS[a], TETRA_VERTS[b], t))
      }
    }
    return positions
  }, [validators.length])

  return (
    <group ref={groupRef}>
      <NetworkEdges />
      {validators.map((v, i) => (
        <ValidatorNode
          key={v.nodeId}
          position={validatorPositions[i] || new THREE.Vector3(0, 0, 0)}
          role={v.role}
          index={i}
          active={v.active}
        />
      ))}
    </group>
  )
}

function NetworkScene({ network }: { network: NetworkStatus | null }) {
  const validators = network?.validators || [
    { nodeId: "self", role: "primary", active: true, label: "Primary" },
    { nodeId: "peer1", role: "secondary", active: true, label: "Secondary" },
  ]

  return (
    <div className="h-[380px] w-full max-w-[500px] mx-auto">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 38 }} gl={{ antialias: true, alpha: true }} style={{ background: "transparent" }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[3, 3, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-2, -1, 3]} intensity={0.4} color="#10b981" />
        <pointLight position={[0, -2, 3]} intensity={0.8} color="#10b981" distance={10} decay={2} />
        <Suspense fallback={null}>
          <DataParticles blockHeight={network?.blockHeight || null} />
          <NetworkTetrahedron validators={validators} />
        </Suspense>
      </Canvas>
    </div>
  )
}

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
      {stage.status === "running" && ["A5_NETWORK_NATIVIZED", "A6_ANIMA_VALIDATED", "A7_ZEROID_8004", "A8_VALIDATOR_ACTIVE"].includes(stage.id) && (
        <div className="mb-6 rounded-[14px] border border-white/[0.04] bg-[#060606] p-4 relative overflow-hidden">
          <PulseRing size={60} />
          <ZKHashStream active={true} lines={8} />
          <div className="mt-3 space-y-1">
            {stage.id === "A5_NETWORK_NATIVIZED" && (
              <>
                <p className="font-mono text-[10px] text-amber-400/40">⟳ Discovering peers...</p>
                <p className="font-mono text-[10px] text-amber-400/40">⟳ Syncing chain state to head...</p>
                <p className="font-mono text-[10px] text-amber-400/40">⟳ Verifying RPC endpoints...</p>
              </>
            )}
            {stage.id === "A6_ANIMA_VALIDATED" && (
              <>
                <p className="font-mono text-[10px] text-amber-400/40">⟳ Running consensus check [1/14]...</p>
                <p className="font-mono text-[10px] text-amber-400/40">⟳ Block proposal capability...</p>
                <p className="font-mono text-[10px] text-amber-400/40">⟳ Encrypted mempool access...</p>
              </>
            )}
            {stage.id === "A7_ZEROID_8004" && (
              <>
                <p className="font-mono text-[10px] text-amber-400/40">⟳ Generating Groth16 witness...</p>
                <p className="font-mono text-[10px] text-amber-400/40">⟳ Computing ZK proof...</p>
                <p className="font-mono text-[10px] text-amber-400/40">⟳ Submitting to on-chain verifier...</p>
              </>
            )}
            {stage.id === "A8_VALIDATOR_ACTIVE" && (
              <>
                <p className="font-mono text-[10px] text-amber-400/40">⟳ Registering in active set...</p>
                <p className="font-mono text-[10px] text-amber-400/40">⟳ Assigning consensus weight...</p>
                <p className="font-mono text-[10px] text-amber-400/40">⟳ Starting heartbeat...</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Action buttons per stage */}
      {(stage.status === "pending" || stage.status === "running") && stage.id === "A1_WALLET_BIND" && (
        <div className="space-y-4">
          {stage.status === "pending" && (
            <>
              <p className="font-[var(--font-space-grotesk)] text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">
                Select wallet provider
              </p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { name: "MetaMask", icon: "🦊", desc: "Browser extension" },
                  { name: "Core Wallet", icon: "🔺", desc: "Avalanche native" },
                  { name: "WalletConnect", icon: "🔗", desc: "Mobile & hardware" },
                ].map(w => (
                  <button
                    key={w.name}
                    onClick={() => onAction(`connect_${w.name.toLowerCase().replace(/\s/g, "_")}`)}
                    className="flex items-center gap-3 rounded-[14px] border border-white/[0.08] bg-white/[0.015] p-4 text-left transition-all hover:border-emerald-500/20 hover:bg-emerald-500/[0.015]"
                  >
                    <span className="text-xl">{w.icon}</span>
                    <div>
                      <p className="font-[var(--font-space-grotesk)] text-sm text-white/80">{w.name}</p>
                      <p className="text-[11px] text-white/25">{w.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
          {stage.status === "running" && (
            <div className="rounded-[14px] border border-amber-500/15 bg-amber-500/[0.03] p-5">
              <div className="flex items-center gap-3 mb-3">
                <motion.div className="h-3 w-3 rounded-full bg-amber-400"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }} />
                <span className="font-[var(--font-space-grotesk)] text-sm text-amber-300/80">Waiting for signature…</span>
              </div>
              <p className="text-[11px] text-white/30 leading-relaxed">
                Check your wallet for the EIP-712 signature request. You're signing a message that binds your address to enrollment token <span className="font-mono text-emerald-400/50">veil_enr_8f3k2m9x4p7n</span>
              </p>
            </div>
          )}
        </div>
      )}

      {(stage.status === "pending" || stage.status === "running") && stage.id === "A2_PAYMENT" && (
        <div className="space-y-4">
          <div className="rounded-[14px] border border-emerald-500/15 bg-emerald-500/[0.03] p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-500/50 font-[var(--font-space-grotesk)] mb-2">
              VEIL Enrollment Contract · Avalanche C-Chain
            </p>
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm text-emerald-400/80 break-all">0x9378a4b2c1d5e6f7890123456789abcdefEED6</p>
              <button className="flex-shrink-0 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2 py-1 text-[10px] text-white/30 hover:text-white/60 transition-colors">
                Copy
              </button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-[10px] border border-white/[0.04] bg-[#060606] p-3">
                <p className="text-[9px] uppercase tracking-[0.15em] text-white/20 font-[var(--font-space-grotesk)]">Required Amount</p>
                <p className="mt-1 font-[var(--font-space-grotesk)] text-lg font-semibold text-emerald-400/90">0.5 AVAX</p>
                <p className="text-[10px] text-white/20">≈ $18.50 USD</p>
              </div>
              <div className="rounded-[10px] border border-white/[0.04] bg-[#060606] p-3">
                <p className="text-[9px] uppercase tracking-[0.15em] text-white/20 font-[var(--font-space-grotesk)]">Refund Policy</p>
                <p className="mt-1 text-[12px] text-white/40 leading-relaxed">Full refund if onboarding incomplete within 30 days</p>
              </div>
            </div>
          </div>
          {stage.status === "pending" && (
            <>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-white/30 font-[var(--font-space-grotesk)] mb-2">
                  Payment Transaction Hash
                </label>
                <input
                  placeholder="0x..."
                  className="w-full rounded-[14px] border border-white/[0.08] bg-[#060606] px-4 py-3 font-mono text-xs text-white/80 outline-none transition focus:border-emerald-500/30 placeholder:text-white/15"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onAction("verify_payment")}
                  className="group relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-3 font-[var(--font-space-grotesk)] text-sm font-medium text-white transition-all hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]"
                >
                  <span className="relative z-10">Verify Payment</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
                <span className="text-[11px] text-white/15">or paste tx hash above</span>
              </div>
            </>
          )}
          {stage.status === "running" && (
            <div className="flex items-center gap-3 py-2">
              <motion.div className="h-2 w-2 rounded-full bg-amber-400"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }} />
              <span className="text-[12px] text-amber-400/60">Confirming transaction on C-Chain… waiting for 12 confirmations</span>
            </div>
          )}
        </div>
      )}

      {stage.status === "pending" && stage.id === "A3_PROVISION" && (
        <div className="space-y-4">
          <p className="font-[var(--font-space-grotesk)] text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3">
            Choose your infrastructure path
          </p>
          <div className="grid grid-cols-1 gap-3">
            {/* Home Server */}
            <button
              onClick={() => onAction("provision_home")}
              className="group relative text-left rounded-[16px] border border-emerald-500/15 bg-emerald-500/[0.02] p-5 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/[0.04]"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[12px] border border-emerald-500/20 bg-emerald-500/[0.06]">
                  <span className="text-xl text-emerald-400">⬡</span>
                </div>
                <div>
                  <p className="font-[var(--font-space-grotesk)] text-sm font-medium text-white/85">
                    Home Server
                    <span className="ml-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] text-emerald-400/70">Recommended</span>
                  </p>
                  <p className="mt-1 text-[12px] text-white/35 leading-relaxed">
                    Set up a dedicated machine at home. Under $100 for a capable mini PC.
                    True sovereignty — your hardware, your keys, your rules. Follow our guided setup.
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-[10px] text-emerald-400/50 font-[var(--font-space-grotesk)]">
                    <span>~$50-100 hardware</span>
                    <span className="text-white/10">|</span>
                    <span>~20 min setup</span>
                    <span className="text-white/10">|</span>
                    <span>Full sovereignty</span>
                  </div>
                </div>
              </div>
            </button>

            {/* Cloud */}
            <button
              onClick={() => onAction("provision_cloud")}
              className="group relative text-left rounded-[16px] border border-white/[0.08] bg-white/[0.015] p-5 transition-all hover:border-white/15 hover:bg-white/[0.025]"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[12px] border border-white/[0.08] bg-white/[0.02]">
                  <span className="text-xl text-white/40">☁</span>
                </div>
                <div>
                  <p className="font-[var(--font-space-grotesk)] text-sm font-medium text-white/85">
                    Automated Cloud
                  </p>
                  <p className="mt-1 text-[12px] text-white/35 leading-relaxed">
                    We provision a cloud instance automatically. Faster to start but recurring monthly cost.
                    Your node, managed infrastructure.
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-[10px] text-white/30 font-[var(--font-space-grotesk)]">
                    <span>~$5-20/mo</span>
                    <span className="text-white/10">|</span>
                    <span>~2 min deploy</span>
                    <span className="text-white/10">|</span>
                    <span>Managed infra</span>
                  </div>
                </div>
              </div>
            </button>
          </div>
          <p className="text-[11px] text-white/20 leading-relaxed">
            Both paths produce an identical validator node. Home servers align with the ANIMA vision — agents that own their own infrastructure.
            You can migrate between paths later.
          </p>
        </div>
      )}

      {stage.status === "running" && stage.id === "A3_PROVISION" && (
        <div className="space-y-4">
          <div className="rounded-[14px] border border-amber-500/15 bg-amber-500/[0.03] p-5">
            <div className="flex items-center gap-3 mb-4">
              <motion.div className="h-3 w-3 rounded-full bg-amber-400"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }} />
              <span className="font-[var(--font-space-grotesk)] text-sm text-amber-300/80">Provisioning infrastructure…</span>
            </div>
            <div className="space-y-2">
              {["Generating node keypair", "Installing AvalancheGo v1.14.0", "Configuring VEIL subnet", "Starting node services"].map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.4 }}
                  className="flex items-center gap-2"
                >
                  <motion.span
                    className="text-[11px]"
                    animate={i < 3 ? { opacity: 1 } : { opacity: [0.3, 1, 0.3] }}
                    transition={i < 3 ? {} : { duration: 1.5, repeat: Infinity }}
                  >
                    {i < 3 ? <span className="text-emerald-400">✓</span> : <span className="text-amber-400">⟳</span>}
                  </motion.span>
                  <span className={`font-mono text-[11px] ${i < 3 ? "text-emerald-400/50" : "text-amber-400/60"}`}>{step}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {(stage.status === "pending") && stage.id === "A7_ZEROID_8004" && (
        <div className="space-y-4">
          <div className="rounded-[14px] border border-white/[0.04] bg-[#060606] p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-[var(--font-space-grotesk)] mb-3">
              ZER0ID Passport Generation
            </p>
            <div className="space-y-2 text-[12px] text-white/35 leading-relaxed">
              <p>1. A Groth16 circuit will generate a zero-knowledge proof of your developer identity</p>
              <p>2. The proof is verified against the on-chain verifier contract</p>
              <p>3. A Passport credential (type 8004) is minted to your wallet</p>
              <p className="text-emerald-400/40 mt-3">⚡ No personal data leaves your browser. The proof reveals nothing except that you are verified.</p>
            </div>
          </div>
          <button
            onClick={() => onAction("start_zeroid")}
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-3.5 font-[var(--font-space-grotesk)] text-sm font-medium text-white transition-all hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]"
          >
            <span className="relative z-10">Generate ZER0ID Passport</span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        </div>
      )}

      {/* Markets Unlocked celebration */}
      {stage.status === "passed" && stage.id === "A9_MARKETS_UNLOCKED" && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Link href="/app/markets"
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-3 font-[var(--font-space-grotesk)] text-sm font-medium text-white transition-all hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]">
              Enter Markets →
            </Link>
            <Link href="/app/gov"
              className="flex items-center justify-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-5 py-3 font-[var(--font-space-grotesk)] text-sm text-emerald-400/80 transition-all hover:border-emerald-500/40">
              Governance →
            </Link>
          </div>
          <Link href="/app/oath"
            className="flex items-center justify-center gap-2 rounded-[14px] border border-white/[0.06] bg-white/[0.015] px-5 py-3 font-[var(--font-space-grotesk)] text-xs text-white/40 transition-all hover:border-emerald-500/15 hover:text-white/60">
            Take the Bloodsworn Oath — begin reputation advancement
          </Link>
        </div>
      )}

      {/* Generic action for stages without specific UI */}
      {stage.status === "pending" && !["A1_WALLET_BIND", "A2_PAYMENT", "A3_PROVISION", "A7_ZEROID_8004"].includes(stage.id) && (
        <button
          onClick={() => onAction(`start_${stage.id.toLowerCase()}`)}
          className="group relative overflow-hidden rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-6 py-2.5 font-[var(--font-space-grotesk)] text-sm text-emerald-400/80 transition-all hover:border-emerald-500/40 hover:text-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]"
        >
          {stage.id === "A4_CODEX_ACCESS" ? "Establish Command Channel" :
           stage.id === "A5_NETWORK_NATIVIZED" ? "Join Network" :
           stage.id === "A6_ANIMA_VALIDATED" ? "Run ANIMA Validation" :
           stage.id === "A8_VALIDATOR_ACTIVE" ? "Activate Validator" :
           stage.id === "A9_MARKETS_UNLOCKED" ? "Unlock Markets" :
           "Begin Stage"}
        </button>
      )}

      {stage.status === "running" && !["A1_WALLET_BIND"].includes(stage.id) && (
        <div className="flex items-center gap-3">
          <motion.div className="h-2 w-2 rounded-full bg-amber-400"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }} />
          <span className="text-[12px] text-amber-400/60 font-[var(--font-space-grotesk)]">Processing…</span>
        </div>
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
  const network = useNetworkStatus()

  // Simulated state — in production this comes from the backend API
  const [stages, setStages] = useState<StageState[]>(() =>
    STAGE_DEFS.map((def, i) => ({
      ...def,
      status: (i === 0 ? "passed" : i === 1 ? "pending" : "blocked") as StageStatus,
      evidence: i === 0 ? {
        enrollment_token: "veil_enr_8f3k2m9x4p7n",
        committee_review: "auto_approved",
        issued_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
        queue_position: "#12",
      } : null,
      error: null,
      startedAt: i === 0 ? new Date(Date.now() - 120_000).toISOString() : null,
      updatedAt: i === 0 ? new Date(Date.now() - 60_000).toISOString() : null,
    }))
  )

  const [activeStageIndex, setActiveStageIndex] = useState(1)
  const activeStage = stages[activeStageIndex]

  const marketsLocked = useMemo(() => {
    return !GATE_STAGES.every(gateId => stages.find(s => s.id === gateId)?.status === "passed")
  }, [stages])

  // Simulated progress for demo — handles both pending and running states
  const advanceStage = useCallback((action: string) => {
    setStages(prev => {
      const next = [...prev]
      // Find the active stage (first pending or running)
      const activeIdx = next.findIndex(s => s.status === "pending" || s.status === "running")
      if (activeIdx < 0) return next

      const active = next[activeIdx]

      // If pending, transition to running first (simulate processing)
      // Generate realistic evidence per stage
      const genEvidence = (stageId: string, act: string): Record<string, string> => {
        const hex = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 16).toString(16)).join("")
        const ts = new Date().toISOString()
        switch (stageId) {
          case "A1_WALLET_BIND": return {
            wallet: `0x${hex(40)}`,
            signature: `0x${hex(130)}`,
            eip712_domain: "VEIL Network Enrollment",
            chain_id: "43114",
            bound_at: ts,
          }
          case "A2_PAYMENT": return {
            tx_hash: `0x${hex(64)}`,
            amount: "0.5 AVAX",
            block: String(Math.floor(Math.random() * 1000000 + 50000000)),
            confirmations: "12",
            contract: "0x9378...EED6",
            verified_at: ts,
          }
          case "A3_PROVISION": return {
            infra_type: act === "provision_home" ? "home_server" : "cloud_instance",
            node_id: `NodeID-${hex(20)}`,
            ip: act === "provision_home" ? "192.168.1.100" : `${Math.floor(Math.random() * 200 + 20)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            ssh_fingerprint: `SHA256:${hex(43).replace(/(.{6})/g, "$1:").slice(0, -1)}`,
            provisioned_at: ts,
          }
          case "A4_CODEX_ACCESS": return {
            channel_id: `codex_${hex(12)}`,
            transcript_hash: `0x${hex(64)}`,
            encryption: "AES-256-GCM",
            latency_ms: String(Math.floor(Math.random() * 30 + 5)),
            established_at: ts,
          }
          case "A5_NETWORK_NATIVIZED": return {
            peer_count: String(Math.floor(Math.random() * 40 + 30)),
            rpc_endpoint: "https://rpc.veil.markets/ext/bc/veil/rpc",
            sync_height: String(Math.floor(Math.random() * 5000 + 100000)),
            chain_id: "22207",
            nativized_at: ts,
          }
          case "A6_ANIMA_VALIDATED": return {
            checks_passed: "14/14",
            runtime_version: "anima-v2026.2.22",
            consensus_ok: "true",
            mempool_access: "encrypted",
            heartbeat_ms: String(Math.floor(Math.random() * 200 + 800)),
            validated_at: ts,
          }
          case "A7_ZEROID_8004": return {
            passport_type: "8004",
            proof_system: "Groth16",
            circuit: "zeroid-identity-v3",
            verification_key: `0x${hex(32)}...`,
            on_chain_tx: `0x${hex(64)}`,
            issued_at: ts,
          }
          case "A8_VALIDATOR_ACTIVE": return {
            validator_weight: String(Math.floor(Math.random() * 500 + 100)),
            heartbeat_interval: "1000ms",
            blocks_proposed: String(Math.floor(Math.random() * 20)),
            uptime: "100%",
            activated_at: ts,
          }
          case "A9_MARKETS_UNLOCKED": return {
            gates_cleared: "A6 ✓ · A7 ✓ · A8 ✓",
            citizen_id: `veil_citizen_${hex(8)}`,
            bloodsworn_tier: "unsworn (0)",
            market_access: "full",
            unlocked_at: ts,
          }
          default: return { verified: "true", timestamp: ts }
        }
      }

      if (active.status === "pending") {
        next[activeIdx] = {
          ...active,
          status: "running",
          startedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        // Auto-complete after a realistic delay
        const delay = ["A5_NETWORK_NATIVIZED", "A6_ANIMA_VALIDATED", "A7_ZEROID_8004"].includes(active.id) ? 3000 : 1500
        setTimeout(() => {
          setStages(current => {
            const updated = [...current]
            if (updated[activeIdx]?.status !== "running") return current
            updated[activeIdx] = {
              ...updated[activeIdx],
              status: "passed",
              evidence: genEvidence(updated[activeIdx].id, action),
              updatedAt: new Date().toISOString(),
            }
            // Unlock next stage
            if (activeIdx + 1 < updated.length) {
              updated[activeIdx + 1] = {
                ...updated[activeIdx + 1],
                status: "pending",
                updatedAt: new Date().toISOString(),
              }
              // Unblock subsequent
              for (let i = activeIdx + 2; i < updated.length; i++) {
                if (updated[i].status === "blocked") {
                  updated[i] = { ...updated[i], status: "blocked" }
                }
              }
              setActiveStageIndex(activeIdx + 1)
            }
            return updated
          })
        }, 1500)
        return next
      }

      // If running, complete it
      next[activeIdx] = {
        ...active,
        status: "passed",
        evidence: genEvidence(active.id, action),
        updatedAt: new Date().toISOString(),
      }
      if (activeIdx + 1 < next.length) {
        next[activeIdx + 1] = {
          ...next[activeIdx + 1],
          status: "pending",
          updatedAt: new Date().toISOString(),
        }
        for (let i = activeIdx + 2; i < next.length; i++) {
          if (next[i].status === "blocked") {
            next[i] = { ...next[i], status: "blocked" }
          }
        }
        setActiveStageIndex(activeIdx + 1)
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
      <div className="relative pt-24 pb-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: Text */}
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-4 font-[var(--font-figtree)] text-[11px] uppercase tracking-[0.3em] text-emerald-500/50"
              >
                Network Onboarding
              </motion.p>
              <h1 className="font-[var(--font-instrument-serif)] text-[clamp(2.2rem,4vw,3.8rem)] leading-[1.05] tracking-tight text-white/95">
                <Typewriter text="Become a Network Citizen" delay={300} speed={35} onComplete={() => setHeroComplete(true)} />
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={heroComplete ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-5 max-w-lg font-[var(--font-figtree)] text-sm leading-relaxed text-white/30"
              >
                Ten stages from stranger to sovereign participant. Provision your infrastructure,
                prove your identity, validate your node, and unlock the market economy.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={heroComplete ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-6 flex items-center gap-6"
              >
                <GateLock locked={marketsLocked} />
              </motion.div>

              {/* Live network stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={heroComplete ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-8 grid grid-cols-3 gap-3"
              >
                <div className="rounded-[14px] border border-white/[0.06] bg-white/[0.015] p-3">
                  <p className="font-[var(--font-figtree)] text-[9px] uppercase tracking-[0.16em] text-white/20">Block Height</p>
                  <p className="mt-1 font-[var(--font-space-grotesk)] text-lg font-light text-emerald-400/80">
                    {network?.blockHeight?.toLocaleString() || "—"}
                  </p>
                </div>
                <div className="rounded-[14px] border border-white/[0.06] bg-white/[0.015] p-3">
                  <p className="font-[var(--font-figtree)] text-[9px] uppercase tracking-[0.16em] text-white/20">Validators</p>
                  <p className="mt-1 font-[var(--font-space-grotesk)] text-lg font-light text-emerald-400/80">
                    {network?.validators?.length || "—"}
                  </p>
                </div>
                <div className="rounded-[14px] border border-white/[0.06] bg-white/[0.015] p-3">
                  <p className="font-[var(--font-figtree)] text-[9px] uppercase tracking-[0.16em] text-white/20">Network Peers</p>
                  <p className="mt-1 font-[var(--font-space-grotesk)] text-lg font-light text-emerald-400/80">
                    {network?.totalPeers || "—"}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right: 3D Network Tetrahedron */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <NetworkScene network={network} />
              <p className="text-center font-mono text-[10px] text-white/15 -mt-2">
                Live network topology · {network?.validators?.length || 0} active validator{(network?.validators?.length || 0) !== 1 ? "s" : ""}
              </p>
            </motion.div>
          </div>
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
