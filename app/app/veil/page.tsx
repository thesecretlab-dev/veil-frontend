"use client"

import { useRef, useMemo, Suspense } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { VeilFooter, VeilHeader, FilmGrain } from "@/components/brand"

/* ═══════════════════════════════════════════════════════════════
   3D VEIL TOKEN
   ═══════════════════════════════════════════════════════════════ */

/* Floating particle dust around the coin */
function CoinParticles() {
  const ref = useRef<THREE.Points>(null)
  const count = 120
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 2.0 + Math.random() * 1.5
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.getElapsedTime() * 0.08
    ref.current.rotation.x = clock.getElapsedTime() * 0.03
    const mat = ref.current.material as THREE.PointsMaterial
    mat.opacity = 0.3 + Math.sin(clock.getElapsedTime() * 0.8) * 0.1
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#10b981" transparent opacity={0.3}
        sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

function VeilCoin() {
  const groupRef = useRef<THREE.Group>(null)
  const triGlowRef = useRef<THREE.Mesh>(null)

  // Create environment cubemap for reflections
  const envMap = useMemo(() => {
    const size = 64
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")!
    // Dark gradient with emerald accent
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    grad.addColorStop(0, "#0d2818")
    grad.addColorStop(0.5, "#071210")
    grad.addColorStop(1, "#020504")
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)
    const texture = new THREE.CanvasTexture(canvas)
    texture.mapping = THREE.EquirectangularReflectionMapping
    return texture
  }, [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = t * 0.45
    groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.12
    groupRef.current.position.y = Math.sin(t * 0.35) * 0.05

    // Pulse the triangle glow
    if (triGlowRef.current) {
      const mat = triGlowRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 0.6 + Math.sin(t * 2) * 0.25
    }
  })

  // Triangle shape for ▽
  const triShape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-0.58, 0.45)
    s.lineTo(0.58, 0.45)
    s.lineTo(0, -0.68)
    s.closePath()
    return s
  }, [])

  // Triangle outline
  const triOutlineGeo = useMemo(() => {
    const pts = [
      new THREE.Vector3(-0.62, 0.48, 0),
      new THREE.Vector3(0.62, 0.48, 0),
      new THREE.Vector3(0, -0.72, 0),
      new THREE.Vector3(-0.62, 0.48, 0),
    ]
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [])

  return (
    <group ref={groupRef}>
      {/* Coin body — thick beveled disc */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.25, 64]} />
        <meshStandardMaterial
          color="#080808"
          metalness={1}
          roughness={0.08}
          envMap={envMap}
          envMapIntensity={0.8}
        />
      </mesh>

      {/* Front bevel ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[1.49, 0.015, 16, 64]} />
        <meshStandardMaterial color="#1a1a1a" metalness={1} roughness={0.05} />
      </mesh>

      {/* Front face — slightly recessed, darker */}
      <mesh position={[0, 0, 0.126]}>
        <circleGeometry args={[1.42, 64]} />
        <meshStandardMaterial color="#050505" metalness={1} roughness={0.1} envMap={envMap} envMapIntensity={0.5} />
      </mesh>

      {/* Back face */}
      <mesh position={[0, 0, -0.126]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[1.42, 64]} />
        <meshStandardMaterial color="#050505" metalness={1} roughness={0.1} envMap={envMap} envMapIntensity={0.5} />
      </mesh>

      {/* Front ▽ — filled, emissive emerald */}
      <mesh ref={triGlowRef} position={[0, -0.02, 0.13]}>
        <shapeGeometry args={[triShape]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={0.7}
          metalness={0.5}
          roughness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Front ▽ — outline for depth */}
      <line geometry={triOutlineGeo} position={[0, -0.02, 0.135]}>
        <lineBasicMaterial color="#34d399" transparent opacity={0.6} />
      </line>

      {/* Back ▽ */}
      <mesh position={[0, -0.02, -0.13]} rotation={[0, Math.PI, 0]}>
        <shapeGeometry args={[triShape]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={0.7}
          metalness={0.5}
          roughness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Back ▽ outline */}
      <line geometry={triOutlineGeo} position={[0, -0.02, -0.135]} rotation={[0, Math.PI, 0]}>
        <lineBasicMaterial color="#34d399" transparent opacity={0.6} />
      </line>

      {/* Subtle emerald edge rim light */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.52, 1.52, 0.22, 64, 1, true]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={0.15}
          metalness={0.9}
          roughness={0.2}
          side={THREE.BackSide}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  )
}

function VeilTokenScene() {
  return (
    <div className="mx-auto h-[320px] w-[320px]">
      <Canvas camera={{ position: [0, 0, 4.8], fov: 36 }} gl={{ antialias: true, alpha: true }} style={{ background: "transparent" }}>
        <ambientLight intensity={0.25} />
        {/* Key light — strong white from upper right */}
        <directionalLight position={[4, 3, 5]} intensity={2} color="#ffffff" />
        {/* Fill — soft emerald from left */}
        <directionalLight position={[-3, -1, 3]} intensity={0.6} color="#10b981" />
        {/* Rim light — behind and above */}
        <directionalLight position={[0, 2, -3]} intensity={0.8} color="#065f46" />
        {/* Emerald point light for face glow */}
        <pointLight position={[0, 0, 3]} intensity={1} color="#10b981" distance={8} decay={2} />
        <Suspense fallback={null}>
          <CoinParticles />
          <VeilCoin />
        </Suspense>
      </Canvas>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */

function ScrollReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay }}
      className={className}>{children}</motion.div>
  )
}

function SectionLabel({ number, title, sub }: { number: string; title: string; sub?: string }) {
  return (
    <div className="mb-8 flex items-end gap-4">
      <span className="font-[var(--font-instrument-serif)] text-[clamp(2rem,4vw,3.5rem)] leading-none text-emerald-500/15">{number}</span>
      <div>
        <h2 className="font-[var(--font-space-grotesk)] text-lg font-medium tracking-tight text-white/90">{title}</h2>
        {sub && <p className="mt-0.5 font-[var(--font-figtree)] text-xs text-white/35">{sub}</p>}
      </div>
    </div>
  )
}

function Card({ children, className = "", glow = false }: { children: React.ReactNode; className?: string; glow?: boolean }) {
  return (
    <div className={`rounded-[20px] border border-white/[0.06] bg-white/[0.02] backdrop-blur-2xl ${glow ? "shadow-[0_0_80px_rgba(16,185,129,0.06)]" : ""} ${className}`}>
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */

const TOKEN_ROLES = [
  { token: "VEIL", icon: "▽", desc: "Base utility and staking asset. Powers governance, validator bonds, and agent genesis.", color: "rgba(16,185,129,0.9)" },
  { token: "wVEIL", icon: "◇", desc: "Liquid ERC-20 wrapper. Used in swaps, LP positions, and cross-chain bridge flows.", color: "rgba(16,185,129,0.6)" },
  { token: "vVEIL", icon: "◈", desc: "Rebasing staked balance. Grows each epoch via dynamic APY from the emission controller.", color: "rgba(52,211,153,0.8)" },
  { token: "gVEIL", icon: "⬡", desc: "Non-rebasing governance wrapper. Backed by vVEIL index — vote weight without rebase complexity.", color: "rgba(110,231,183,0.7)" },
  { token: "VAI", icon: "◎", desc: "Protocol stablecoin. CDP-minted against VEIL collateral. Treasury routing and execution rail.", color: "rgba(245,158,11,0.8)" },
]

const MECHANICS = [
  { step: "Swap", detail: "Enter VEIL rails through wVEIL/VAI/USDC pools on the native DEX. Zero external dependencies." },
  { step: "Stake", detail: "Lock wVEIL to mint rebasing vVEIL. Dynamic APY adjusts based on liquidity target gap." },
  { step: "Wrap", detail: "Convert rebasing vVEIL into non-rebasing gVEIL for governance and composability." },
  { step: "Bond", detail: "Bond LP positions into chain-owned liquidity. Treasury acquires permanent protocol depth." },
  { step: "Mint VAI", detail: "Open CDPs against VEIL collateral. VAI is the execution currency for markets and agents." },
  { step: "Validate", detail: "Bond VEIL to run a VeilVM validator node. Agents and humans earn from consensus participation." },
]

const STATS = [
  { label: "Chain ID", value: "22207", sub: "VeilVM Mainnet" },
  { label: "VM Type", value: "HyperSDK", sub: "Custom Go VM" },
  { label: "Native Actions", value: "42", sub: "Strict-private mode" },
  { label: "Launch Gates", value: "13/13", sub: "All passing" },
  { label: "Contracts", value: "16", sub: "Companion EVM" },
]

const LINKS = [
  { label: "Swap Terminal", href: "/app/defi", desc: "Trade VEIL, wVEIL, and VAI" },
  { label: "Markets", href: "/app/markets", desc: "Prediction markets powered by dual engine" },
  { label: "Ecosystem", href: "/app/ecosystem", desc: "Protocol directory and integrations" },
  { label: "Docs", href: "/app/docs", desc: "Technical documentation and ANIMA spec" },
  { label: "Bloodsworn Oath", href: "/app/oath", desc: "Stake reputation in the protocol" },
  { label: "Governance", href: "/app/gov", desc: "Proposals and voting" },
]

/* ═══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function VeilTokenPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <FilmGrain />
      <VeilHeader />

      {/* ─── Ambient Glow ─── */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-emerald-500/[0.03] blur-[180px]" />

      {/* ─── Hero ─── */}
      <div ref={heroRef} className="relative pt-32 pb-24">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4"
          >
            <VeilTokenScene />
          </motion.div>

          <ScrollReveal delay={0.1}>
            <p className="mb-4 font-[var(--font-figtree)] text-[11px] uppercase tracking-[0.3em] text-emerald-500/50">
              The Network Token
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <h1 className="font-[var(--font-instrument-serif)] text-[clamp(3rem,6vw,5.5rem)] leading-[1.02] tracking-tight text-white/95">
              VEIL
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-2xl font-[var(--font-figtree)] text-base leading-relaxed text-white/35">
              The native token of VeilVM — a privacy-native HyperSDK network built for prediction markets,
              autonomous agents, and sovereign infrastructure. Stake, govern, bond, and validate.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/app/defi"
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-3.5 font-[var(--font-space-grotesk)] text-sm font-medium text-white transition-all hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                <span className="relative z-10">Swap Terminal</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
              <Link href="/app/docs"
                className="rounded-full border border-white/[0.08] bg-white/[0.03] px-8 py-3.5 font-[var(--font-space-grotesk)] text-sm text-white/60 transition-all hover:border-white/[0.15] hover:text-white/80">
                Read Docs
              </Link>
            </div>
          </ScrollReveal>
        </motion.div>
      </div>

      <main className="mx-auto max-w-7xl px-6">

        {/* ─── 01 · Chain Stats ─── */}
        <ScrollReveal>
          <SectionLabel number="01" title="Chain Status" sub="VeilVM mainnet — live since February 2026" />
          <div className="mb-20 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {STATS.map((stat, i) => (
              <motion.div key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                <Card className="p-5">
                  <p className="font-[var(--font-figtree)] text-[10px] uppercase tracking-[0.16em] text-white/25">{stat.label}</p>
                  <p className="mt-2 font-[var(--font-space-grotesk)] text-2xl font-light tracking-tight text-white/90">{stat.value}</p>
                  <p className="mt-1 font-[var(--font-figtree)] text-[11px] text-white/25">{stat.sub}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* ─── 02 · Token Roles ─── */}
        <ScrollReveal>
          <SectionLabel number="02" title="Token Architecture" sub="Five tokens, one unified protocol" />
        </ScrollReveal>
        <div className="mb-20 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {TOKEN_ROLES.map((role, i) => (
            <ScrollReveal key={role.token} delay={0.06 * i}>
              <Card className="p-6 h-full" glow={role.token === "VEIL"}>
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-2xl" style={{ color: role.color }}>{role.icon}</span>
                  <span className="font-[var(--font-space-grotesk)] text-sm font-semibold uppercase tracking-[0.08em] text-white/80">{role.token}</span>
                </div>
                <p className="font-[var(--font-figtree)] text-[13px] leading-relaxed text-white/40">{role.desc}</p>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        {/* ─── 03 · Protocol Mechanics ─── */}
        <ScrollReveal>
          <SectionLabel number="03" title="How Value Moves" sub="The VEIL economic engine" />
          <Card className="mb-20 p-8" glow>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {MECHANICS.map((item, i) => (
                <ScrollReveal key={item.step} delay={0.05 * i}>
                  <div className="group rounded-[16px] border border-white/[0.04] bg-white/[0.015] p-5 transition-all hover:border-emerald-500/15 hover:bg-emerald-500/[0.02]">
                    <p className="mb-2 font-[var(--font-space-grotesk)] text-xs font-semibold uppercase tracking-[0.14em] text-emerald-400/60 transition-colors group-hover:text-emerald-400/80">
                      {String(i + 1).padStart(2, "0")} · {item.step}
                    </p>
                    <p className="font-[var(--font-figtree)] text-[13px] leading-relaxed text-white/40">{item.detail}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </Card>
        </ScrollReveal>

        {/* ─── 04 · ANIMA ─── */}
        <ScrollReveal>
          <SectionLabel number="04" title="Sovereign Agents" sub="VEIL is infrastructure for autonomous entities" />
          <Card className="mb-20 p-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div>
                <h3 className="mb-4 font-[var(--font-instrument-serif)] text-2xl tracking-tight text-white/90">ANIMA</h3>
                <p className="mb-4 font-[var(--font-figtree)] text-sm leading-relaxed text-white/40">
                  VEIL doesn&apos;t bootstrap human users — it bootstraps sovereign chain entities. Prediction markets
                  are survival infrastructure for AI agents. Each agent provisions compute, deploys a validator,
                  establishes identity, and trades to sustain itself.
                </p>
                <p className="font-[var(--font-figtree)] text-sm leading-relaxed text-white/40">
                  The flywheel: more agents → more liquidity → better markets → more agents → more validators → stronger chain.
                </p>
                <Link href="/app/docs/anima"
                  className="mt-6 inline-flex items-center gap-2 font-[var(--font-space-grotesk)] text-sm text-emerald-400/70 transition-colors hover:text-emerald-400">
                  Read the ANIMA spec
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>
                </Link>
              </div>
              <div className="space-y-3">
                {["Genesis — Provision compute, deploy validator", "Validation — Sync, consensus, earn network access", "Identity — ZER0ID, Bloodsworn Oath, wallet", "Trading — Markets, liquidity, revenue", "Sovereignty — Full autonomy, governance, child spawning"].map((stage, i) => (
                  <ScrollReveal key={stage} delay={0.06 * i}>
                    <div className="flex items-center gap-4 rounded-[14px] border border-white/[0.04] bg-white/[0.015] px-5 py-3.5">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/[0.06]">
                        <span className="font-[var(--font-space-grotesk)] text-xs font-semibold text-emerald-400">{i + 1}</span>
                      </div>
                      <p className="font-[var(--font-figtree)] text-sm text-white/50">{stage}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </Card>
        </ScrollReveal>

        {/* ─── 05 · Navigate ─── */}
        <ScrollReveal>
          <SectionLabel number="05" title="Explore" sub="Navigate the VEIL ecosystem" />
          <div className="mb-24 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {LINKS.map((link, i) => (
              <ScrollReveal key={link.href} delay={0.05 * i}>
                <Link href={link.href}>
                  <Card className="group p-6 transition-all hover:border-emerald-500/15 hover:bg-emerald-500/[0.015] cursor-pointer h-full">
                    <p className="mb-2 font-[var(--font-space-grotesk)] text-sm font-medium text-white/80 transition-colors group-hover:text-emerald-400">{link.label}</p>
                    <p className="font-[var(--font-figtree)] text-xs text-white/30">{link.desc}</p>
                    <svg className="mt-4 h-4 w-4 text-white/15 transition-all group-hover:text-emerald-400/50 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                    </svg>
                  </Card>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </main>

      <VeilFooter />
    </div>
  )
}
