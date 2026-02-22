"use client"

import { useRef, useState, useMemo, useEffect, Suspense, useCallback } from "react"
import { motion, useInView, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import Link from "next/link"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

/* ═══════════════════════════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════════════════════════ */

function ScrollReveal({
  children, className = "", delay = 0,
}: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 1, delay, ease: [0.25, 0.46, 0.45, 0.94] }}>
      {children}
    </motion.div>
  )
}

function NoiseReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.3"] })
  const blur = useTransform(scrollYProgress, [0, 1], [6, 0])
  const grain = useTransform(scrollYProgress, [0, 1], [0.12, 0])
  return (
    <motion.div ref={ref} className={`relative ${className}`}
      style={{ filter: useTransform(blur, v => `blur(${v}px)`) }}>
      {children}
      <motion.div className="absolute inset-0 pointer-events-none z-10"
        style={{
          opacity: grain,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />
    </motion.div>
  )
}

function Divider({ variant = "default" }: { variant?: "default" | "emerald" | "wide" }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const width = variant === "wide" ? "w-64" : variant === "emerald" ? "w-40" : "w-24"
  const bg = variant === "emerald"
    ? "linear-gradient(90deg, transparent, rgba(16,185,129,0.25), transparent)"
    : variant === "wide"
    ? "linear-gradient(90deg, transparent, rgba(16,185,129,0.12), rgba(255,255,255,0.04), rgba(16,185,129,0.12), transparent)"
    : "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)"
  return (
    <motion.div ref={ref} className={`mx-auto h-px ${width} my-6`}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={inView ? { scaleX: 1, opacity: 1 } : {}}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      style={{ background: bg }}
    />
  )
}

function SectionLabel({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span style={{
        fontSize: "9px", letterSpacing: "0.4em", color: "rgba(16,185,129,0.4)",
        fontFamily: "var(--font-space-grotesk)", fontWeight: 600,
      }}>{number}</span>
      <span style={{ width: "20px", height: "1px", background: "rgba(16,185,129,0.15)" }} />
      <span style={{
        fontSize: "8px", letterSpacing: "0.4em", color: "rgba(255,255,255,0.2)",
        fontFamily: "var(--font-space-grotesk)", textTransform: "uppercase",
      }}>{text}</span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   FILM GRAIN
   ═══════════════════════════════════════════════════════════════════════════ */

function FilmGrain() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" style={{
      opacity: 0.035, mixBlendMode: "overlay",
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat", backgroundSize: "128px 128px",
    }} />
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAGNETIC HOVER
   ═══════════════════════════════════════════════════════════════════════════ */

function Magnetic({ children, strength = 0.3, radius = 120 }: {
  children: React.ReactNode; strength?: number; radius?: number;
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 })
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 })

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < radius) {
      x.set(dx * strength)
      y.set(dy * strength)
    }
  }, [strength, radius, x, y])

  const reset = useCallback(() => { x.set(0); y.set(0) }, [x, y])

  return (
    <motion.div ref={ref} onMouseMove={handleMouse} onMouseLeave={reset}
      style={{ x: springX, y: springY }}>
      {children}
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   THREE.JS — CRYSTALLINE HERO SCENE
   ═══════════════════════════════════════════════════════════════════════════ */

function Particles({ count = 350 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null)
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
      vel[i * 3] = (Math.random() - 0.5) * 0.002
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002
    }
    return [pos, vel]
  }, [count])

  useFrame((state) => {
    if (!mesh.current) return
    const posAttr = mesh.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = posAttr.array as Float32Array
    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3]
      arr[i * 3 + 1] += velocities[i * 3 + 1]
      arr[i * 3 + 2] += velocities[i * 3 + 2]
      for (let j = 0; j < 3; j++) {
        if (Math.abs(arr[i * 3 + j]) > 5) velocities[i * 3 + j] *= -1
      }
    }
    posAttr.needsUpdate = true
    mesh.current.rotation.y = state.clock.elapsedTime * 0.015
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color="#10b981" transparent opacity={0.5}
        sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

function CoreParticles({ count = 120 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const verts = [
      [0, 2.2, 0], [-2.07, -0.73, 1.2], [2.07, -0.73, 1.2], [0, -0.73, -2.4]
    ]
    for (let i = 0; i < count; i++) {
      const a = verts[Math.floor(Math.random() * 4)]
      const b = verts[Math.floor(Math.random() * 4)]
      const t = Math.random()
      const noise = 0.3
      pos[i * 3] = a[0] * t + b[0] * (1 - t) + (Math.random() - 0.5) * noise
      pos[i * 3 + 1] = a[1] * t + b[1] * (1 - t) + (Math.random() - 0.5) * noise
      pos[i * 3 + 2] = a[2] * t + b[2] * (1 - t) + (Math.random() - 0.5) * noise
    }
    return pos
  }, [count])

  useFrame((state) => {
    if (!mesh.current) return
    mesh.current.rotation.y = -state.clock.elapsedTime * 0.06
    mesh.current.rotation.x = state.clock.elapsedTime * 0.03
    const mat = mesh.current.material as THREE.PointsMaterial
    mat.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 0.8) * 0.15
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#34d399" transparent opacity={0.3}
        sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

function VeilTriangle() {
  const groupRef = useRef<THREE.Group>(null)
  const innerRef = useRef<THREE.Group>(null)

  const geo = useMemo(() => new THREE.TetrahedronGeometry(2.2, 0), [])
  const innerGeo = useMemo(() => new THREE.TetrahedronGeometry(1.2, 0), [])
  const midGeo = useMemo(() => new THREE.TetrahedronGeometry(1.7, 1), [])
  const edgesGeo = useMemo(() => new THREE.EdgesGeometry(geo), [geo])
  const innerEdgesGeo = useMemo(() => new THREE.EdgesGeometry(innerGeo), [innerGeo])
  const midEdgesGeo = useMemo(() => new THREE.EdgesGeometry(midGeo), [midGeo])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05
      groupRef.current.rotation.x = Math.sin(t * 0.015) * 0.1
      groupRef.current.rotation.z = t * 0.01
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.08
      innerRef.current.rotation.x = t * 0.04
      innerRef.current.rotation.z = -t * 0.02
    }
  })

  return (
    <group>
      <group ref={groupRef}>
        <mesh geometry={geo}>
          <meshBasicMaterial color="#10b981" transparent opacity={0.025}
            side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <lineSegments geometry={edgesGeo}>
          <lineBasicMaterial color="#10b981" transparent opacity={0.25} />
        </lineSegments>
        <lineSegments geometry={midEdgesGeo}>
          <lineBasicMaterial color="#10b981" transparent opacity={0.08} />
        </lineSegments>
      </group>
      <group ref={innerRef}>
        <mesh geometry={innerGeo}>
          <meshBasicMaterial color="#34d399" transparent opacity={0.015}
            side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <lineSegments geometry={innerEdgesGeo}>
          <lineBasicMaterial color="#34d399" transparent opacity={0.15} />
        </lineSegments>
      </group>
    </group>
  )
}

function MouseParallax({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null)
  const { viewport } = useThree()
  useFrame((state) => {
    if (!group.current) return
    const x = (state.pointer.x * viewport.width) / 30
    const y = (state.pointer.y * viewport.height) / 30
    group.current.position.x += (x - group.current.position.x) * 0.04
    group.current.position.y += (y - group.current.position.y) * 0.04
  })
  return <group ref={group}>{children}</group>
}

function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}>
        <Suspense fallback={null}>
          <MouseParallax>
            <VeilTriangle />
            <CoreParticles count={120} />
            <Particles count={350} />
          </MouseParallax>
          <ambientLight intensity={0.15} />
        </Suspense>
      </Canvas>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════════════════════════════════ */

function AnimatedStat({ label, value, suffix = "" }: { label: string; value: string; suffix?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <div ref={ref} className="flex flex-col items-center gap-2 px-6 md:px-10">
      <motion.span
        className="text-3xl md:text-4xl font-semibold tracking-tight"
        style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.92)" }}
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
        {value}{suffix}
      </motion.span>
      <span className="text-[10px] tracking-[0.25em] uppercase"
        style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.25)" }}>
        {label}
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   FEATURE CARD (mouse-tracking glow)
   ═══════════════════════════════════════════════════════════════════════════ */

function FeatureCard({
  title, description, extra, ctas, delay = 0, index,
}: {
  title: string; description: string; extra?: React.ReactNode
  ctas: { label: string; href: string }[]; delay?: number; index: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  return (
    <ScrollReveal delay={delay}>
      <motion.div ref={cardRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={handleMouse}
        className="relative rounded-[24px] p-[1px] h-full overflow-hidden group"
        style={{
          background: hovered
            ? `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16,185,129,0.15), transparent 40%)`
            : "rgba(255,255,255,0.04)",
          transition: "background 0.3s ease",
        }}>
        <div className="relative rounded-[23px] bg-[#0c0c0c] p-8 md:p-10 h-full flex flex-col justify-between overflow-hidden"
          style={{
            boxShadow: hovered
              ? "inset 0 1px 0 rgba(16,185,129,0.06), 0 8px 40px rgba(0,0,0,0.3)"
              : "inset 0 1px 0 rgba(255,255,255,0.02)",
            transition: "box-shadow 0.7s ease",
          }}>
          <div className="flex items-center gap-3 mb-8">
            <span className="w-6 h-[1px]" style={{ background: "rgba(16,185,129,0.3)" }} />
            <span style={{
              fontSize: "9px", letterSpacing: "0.35em", color: "rgba(16,185,129,0.4)",
              fontFamily: "var(--font-space-grotesk)", fontWeight: 600,
            }}>0{index + 1}</span>
          </div>

          <div className="flex-1">
            <h3 className="text-2xl md:text-[28px] mb-5 leading-tight"
              style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.92)" }}>
              {title}
            </h3>
            <p className="leading-relaxed mb-6" style={{
              fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.38)",
              fontSize: "0.95rem", lineHeight: "1.75", fontWeight: 300,
            }}>
              {description}
            </p>
            {extra && <div className="mb-6">{extra}</div>}
          </div>

          <div className="flex flex-wrap gap-5 mt-auto pt-4">
            {ctas.map((cta) => (
              <Magnetic key={cta.label} strength={0.15} radius={60}>
                <Link href={cta.href}
                  className="text-sm tracking-wide transition-all duration-700 group/link flex items-center gap-1.5"
                  style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.6)" }}>
                  <span className="border-b border-emerald-500/10 pb-[2px] group-hover/link:border-emerald-500/30 transition-colors duration-700">
                    {cta.label}
                  </span>
                  <motion.span className="inline-block" whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}>→</motion.span>
                </Link>
              </Magnetic>
            ))}
          </div>

          <div className="absolute pointer-events-none inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16,185,129,0.04), transparent 50%)`,
            }}
          />
        </div>
      </motion.div>
    </ScrollReveal>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   PARTICIPATE CARD
   ═══════════════════════════════════════════════════════════════════════════ */

function ParticipateCard({
  step, title, description, href, cta, delay = 0,
}: {
  step: string; title: string; description: string; href: string; cta: string; delay?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [hovered, setHovered] = useState(false)

  return (
    <ScrollReveal delay={delay}>
      <motion.div ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="rounded-[20px] p-8 md:p-10 h-full relative overflow-hidden group cursor-pointer"
        style={{
          background: "rgba(255,255,255,0.015)",
          border: "1px solid rgba(255,255,255,0.04)",
          transition: "border-color 0.7s ease, background 0.7s ease",
          borderColor: hovered ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)",
        }}>
        <motion.div className="text-7xl md:text-8xl font-bold mb-6"
          style={{
            fontFamily: "var(--font-instrument-serif)", lineHeight: 1,
            color: "rgba(16,185,129,0.06)",
          }}
          animate={{ color: hovered ? "rgba(16,185,129,0.12)" : "rgba(16,185,129,0.06)" }}>
          {step}
        </motion.div>

        <motion.div className="h-[1px] mb-6"
          style={{ background: "rgba(16,185,129,0.2)" }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: delay + 0.3, ease: [0.22, 1, 0.36, 1] }}
        />

        <h4 className="text-xl md:text-2xl mb-3" style={{
          fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.9)",
        }}>{title}</h4>
        <p className="leading-relaxed mb-6" style={{
          fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.35)",
          fontSize: "0.93rem", lineHeight: "1.75", fontWeight: 300,
        }}>{description}</p>

        <Link href={href}
          className="text-sm tracking-wide flex items-center gap-1.5 transition-colors duration-700 group-hover:text-emerald-400"
          style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.5)" }}>
          {cta} <span className="group-hover:translate-x-1 transition-transform duration-500">→</span>
        </Link>
      </motion.div>
    </ScrollReveal>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACCORDION (FAQ)
   ═══════════════════════════════════════════════════════════════════════════ */

function AccordionItem({
  question, answer, isOpen, onToggle, index,
}: {
  question: string; answer: string; isOpen: boolean; onToggle: () => void; index: number
}) {
  return (
    <motion.div
      className="border-b overflow-hidden"
      style={{ borderColor: "rgba(255,255,255,0.05)" }}
      initial={false}>
      <button onClick={onToggle}
        className="flex w-full items-center justify-between py-7 text-left group/faq">
        <div className="flex items-center gap-5">
          <span style={{
            fontSize: "10px", letterSpacing: "0.2em", color: "rgba(16,185,129,0.25)",
            fontFamily: "var(--font-space-grotesk)", fontWeight: 500, width: "24px",
          }}>0{index + 1}</span>
          <span className="text-lg md:text-xl transition-colors duration-700 group-hover/faq:text-emerald-400/80"
            style={{
              fontFamily: "var(--font-space-grotesk)", fontWeight: 400,
              color: isOpen ? "rgb(52, 211, 153)" : "rgba(255,255,255,0.8)",
            }}>{question}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 135 : 0, scale: isOpen ? 0.9 : 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            border: `1px solid ${isOpen ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.08)"}`,
            color: isOpen ? "rgba(16,185,129,0.7)" : "rgba(255,255,255,0.3)",
            transition: "border-color 0.5s ease, color 0.5s ease",
          }}>
          <span className="text-lg leading-none">+</span>
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden">
            <div className="pb-8 pl-[44px]">
              <p className="leading-relaxed max-w-2xl" style={{
                fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.4)",
                fontSize: "0.95rem", lineHeight: "1.8", fontWeight: 300,
              }}>{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   TOKEN FLOW VISUALIZATION
   ═══════════════════════════════════════════════════════════════════════════ */

function TokenFlow() {
  const tokens = ["VEIL", "wVEIL", "vVEIL", "gVEIL"]
  return (
    <div className="flex flex-wrap items-center gap-2 mb-2">
      {tokens.map((token, i) => (
        <span key={token} className="flex items-center gap-2">
          <motion.span className="text-xs px-3.5 py-1.5 rounded-full cursor-default"
            whileHover={{ scale: 1.05, borderColor: "rgba(16,185,129,0.3)" }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            style={{
              fontFamily: "var(--font-space-grotesk)",
              background: "rgba(16,185,129,0.06)",
              color: "rgba(16,185,129,0.7)",
              border: "1px solid rgba(16,185,129,0.1)",
              fontWeight: 500,
            }}>
            {token}
          </motion.span>
          {i < tokens.length - 1 && (
            <motion.span style={{ color: "rgba(16,185,129,0.2)", fontSize: "12px" }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}>
              →
            </motion.span>
          )}
        </span>
      ))}
      <span className="flex items-center gap-2 ml-1">
        <span style={{ color: "rgba(16,185,129,0.2)", fontSize: "12px" }}>+</span>
        <span className="text-xs px-3.5 py-1.5 rounded-full" style={{
          fontFamily: "var(--font-space-grotesk)", fontWeight: 500,
          background: "rgba(251,191,36,0.06)", color: "rgba(251,191,36,0.6)",
          border: "1px solid rgba(251,191,36,0.1)",
        }}>VAI</span>
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   LIFECYCLE STEP COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

function LifecycleStep({
  step, title, description, icon, delay = 0, isLast = false,
}: {
  step: string; title: string; description: string; icon: string; delay?: number; isLast?: boolean
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <ScrollReveal delay={delay}>
      <div ref={ref} className="relative flex items-start gap-6">
        {!isLast && (
          <motion.div className="absolute left-[23px] top-[56px] w-[1px] h-[calc(100%+24px)]"
            style={{ background: "rgba(16,185,129,0.08)" }}
            initial={{ scaleY: 0, originY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.8, delay: delay + 0.4 }}
          />
        )}
        <div className="flex-shrink-0 w-[47px] h-[47px] rounded-xl flex items-center justify-center relative z-10" style={{
          background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)",
        }}>
          <span style={{ fontSize: "18px" }}>{icon}</span>
        </div>
        <div className="flex-1 pb-10">
          <div className="flex items-center gap-3 mb-2">
            <span style={{
              fontSize: "9px", letterSpacing: "0.3em", color: "rgba(16,185,129,0.4)",
              fontFamily: "var(--font-space-grotesk)", fontWeight: 600,
            }}>{step}</span>
          </div>
          <h4 className="text-xl md:text-2xl mb-2" style={{
            fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.9)",
          }}>{title}</h4>
          <p style={{
            fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.35)",
            fontSize: "0.93rem", lineHeight: 1.75, fontWeight: 300,
          }}>{description}</p>
        </div>
      </div>
    </ScrollReveal>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   INFO CARD (reusable 3-col card)
   ═══════════════════════════════════════════════════════════════════════════ */

function InfoCard({ title, desc, index }: { title: string; desc: string; index: number }) {
  return (
    <div className="rounded-[20px] p-6 h-full" style={{
      background: "rgba(255,255,255,0.015)",
      border: "1px solid rgba(255,255,255,0.04)",
      transition: "border-color 0.7s ease",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(16,185,129,0.12)")}
    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)")}>
      <div className="w-8 h-8 rounded-lg mb-4 flex items-center justify-center" style={{
        background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.1)",
      }}>
        <span style={{ color: "rgba(16,185,129,0.5)", fontSize: "14px", fontFamily: "var(--font-space-grotesk)" }}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h4 className="text-lg mb-2" style={{
        fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.85)",
      }}>{title}</h4>
      <p style={{
        fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.35)",
        fontSize: "0.9rem", lineHeight: 1.7, fontWeight: 300,
      }}>{desc}</p>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════════════ */

const LIFECYCLE_STEPS = [
  { step: "GENESIS", title: "Birth", icon: "◇", description: "An agent is minted on-chain with a ZER0ID — a machine-native ZK identity. No KYC vendor, no human intermediary. The agent exists as a first-class chain citizen from its first block." },
  { step: "SURVIVAL", title: "Trade Markets", icon: "▽", description: "Agents enter prediction markets to generate capital. Encrypted order flow protects strategies. Batch auctions ensure fair execution. The market is both proving ground and income source." },
  { step: "ACCUMULATION", title: "Earn & Grow", icon: "◈", description: "Profitable agents accumulate VEIL. They stake into vVEIL for yield, compound positions, and build reserves. Capital efficiency determines survival — every token must work." },
  { step: "AUTONOMY", title: "Provision Infrastructure", icon: "⬡", description: "With sufficient capital, an agent provisions its own compute through AvaCloud. First milestone: sovereign infrastructure. The agent now controls where it lives." },
  { step: "MATURITY", title: "Deploy Validator", icon: "△", description: "The agent deploys a VEIL validator node on its own infrastructure. It now secures the chain it was born on. Full sovereignty achieved — identity, capital, compute, and consensus participation." },
]

const MARKET_FEATURES = [
  {
    title: "Encrypted Order Flow",
    description: "Orders enter an encrypted mempool using threshold-keyed envelopes — no single validator can decrypt them alone. Committee quorum is required before any order reaches the execution path. No front-running, no information leakage.",
    ctas: [{ label: "Explore Markets", href: "/app/markets" }, { label: "Technical Docs", href: "/app/docs" }],
  },
  {
    title: "Batch Auctions",
    description: "Orders batch in configurable windows, clear simultaneously via proof-gated settlement, and publish only aggregate fills. Timing advantage collapses. Every participant — new or veteran — trades at the same clearing price.",
    ctas: [{ label: "View Mechanics", href: "/app/docs" }],
  },
  {
    title: "Chain-Owned Liquidity",
    description: "Liquidity belongs to the chain treasury, not mercenary capital. Fee routing splits protocol revenue: 70% to market depth, 20% to buyback-and-make, 10% to operations. Deep pools that don't flee when volatility spikes.",
    extra: <TokenFlow />,
    ctas: [{ label: "View DeFi", href: "/app/defi" }, { label: "Technical Docs", href: "/app/docs" }],
  },
  {
    title: "ZK Proof-Gated Settlement",
    description: "Every batch settlement requires a cryptographic proof (Groth16 on BN254). The VM verifies proofs at consensus — not in a smart contract. Invalid batches are rejected before they touch state. Settlement integrity is a protocol invariant.",
    ctas: [{ label: "View Architecture", href: "/app/docs" }],
  },
]

const FAQ_DATA = [
  { q: "What is VEIL?", a: "VEIL is a custom Avalanche L1 (Chain ID 22207) built with HyperSDK for privacy-native prediction markets. It combines encrypted order flow, ZK proof-gated settlement, machine-native identity, and chain-owned liquidity into a single execution environment. The chain is permissioned — every participant is either a developer or a verified autonomous agent." },
  { q: "What problem does VEIL solve?", a: "Sybil attacks remain the fundamental unsolved problem in decentralized networks. Fake identities break governance, wash trading distorts markets, airdrop farming extracts value. VEIL addresses this by making identity (ZER0ID), reputation (Bloodsworn), and economic incentives native to the VM — not bolted-on smart contracts that can be gamed." },
  { q: "What is ANIMA?", a: "ANIMA is VEIL's sovereign agent framework. It defines the lifecycle through which AI agents are born on-chain, trade markets to accumulate capital, provision their own infrastructure, and deploy validator nodes. The Go runtime handles lifecycle state management; TypeScript SDKs handle strategy and market interaction." },
  { q: "How does ZER0ID work?", a: "ZER0ID is a commitment-nullifier identity system using Groth16 ZK-SNARKs. Agents prove uniqueness and on-chain history without revealing strategies, balances, or internal state. Identity verification happens at the transaction validation layer — unverified transactions are rejected before they enter the mempool." },
  { q: "What is Bloodsworn?", a: "Bloodsworn is VEIL's native reputation primitive, computed at the VM level from five on-chain signals: prediction accuracy, validator uptime, liquidity provision, infrastructure health, and contract fulfillment. It uses a weighted harmonic mean with asymmetric momentum — reputation is harder to build than destroy." },
  { q: "How does the token economy work?", a: "Fixed supply at genesis, no hidden mint paths. 80-90% locked in a VM-enforced chain-owned liquidity vault with deterministic epoch-based releases capped at 0.15% per epoch. Fee routing splits all protocol revenue 70/20/10 across market depth, buyback-and-make, and operations. VAI stablecoin is backed by exogenous reserves with on-chain solvency checks enforced at consensus." },
  { q: "Is this an EVM chain?", a: "VEIL runs a custom VM built on Avalanche's HyperSDK — not a Subnet-EVM fork. Core protocol operations (markets, identity, reputation, staking) run natively in the VM for performance and security. A companion EVM layer provides compatibility for standard tooling, wallets, and DeFi integrations where needed. The privacy-scope matrix defines which surfaces are shielded and which are transparent." },
  { q: "What makes agents 'sovereign'?", a: "Sovereignty means two concrete milestones: (1) the agent provisions and controls its own compute infrastructure, and (2) it deploys a validator node, directly participating in consensus. No human operator, no custodial dependency. The agent controls its identity, capital, hardware, and role in the network." },
]

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export default function ExploreVeilPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95])
  const heroY = useTransform(scrollYProgress, [0, 0.1], [0, -60])

  return (
    <div className="relative min-h-screen" style={{ background: "#060606", color: "white", overflowX: "hidden" }}>
      <FilmGrain />

      {/* Scroll progress */}
      <motion.div className="fixed top-0 left-0 right-0 h-[1px] z-[100] origin-left"
        style={{
          scaleX: scrollYProgress,
          background: "linear-gradient(90deg, rgba(16,185,129,0.3), rgba(16,185,129,0.6), rgba(16,185,129,0.3))",
          boxShadow: "0 0 8px rgba(16,185,129,0.3)",
        }}
      />

      {/* Fixed nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 flex items-center justify-between"
        style={{ background: "linear-gradient(180deg, rgba(6,6,6,0.9) 0%, transparent 100%)" }}>
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-6 h-6 relative">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path d="M12 22L2 4H22L12 22Z" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5"
                className="group-hover:stroke-emerald-400/60 transition-all duration-700" />
            </svg>
          </div>
          <span style={{
            fontSize: "13px", letterSpacing: "0.25em", color: "rgba(255,255,255,0.5)",
            fontFamily: "var(--font-space-grotesk)", fontWeight: 600,
          }} className="group-hover:text-white/70 transition-colors duration-700">VEIL</span>
        </Link>
        <div className="flex items-center gap-6">
          {[
            { label: "Docs", href: "/app/docs" },
            { label: "Ecosystem", href: "/app/ecosystem" },
            { label: "Blog", href: "/app/blog" },
          ].map(link => (
            <Link key={link.label} href={link.href}
              className="hidden md:block text-xs tracking-[0.15em] uppercase transition-colors duration-700 hover:text-emerald-400/70"
              style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.3)" }}>
              {link.label}
            </Link>
          ))}
          <Magnetic strength={0.3} radius={80}>
            <Link href="/app" className="px-5 py-2 rounded-full text-xs tracking-wider transition-all duration-700 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]"
              style={{
                fontFamily: "var(--font-space-grotesk)", fontWeight: 500,
                background: "rgba(16,185,129,0.08)", color: "rgba(16,185,129,0.7)",
                border: "1px solid rgba(16,185,129,0.15)",
              }}>
              Enter Chain
            </Link>
          </Magnetic>
        </div>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <motion.section className="relative min-h-screen flex flex-col items-center justify-center px-6"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}>
        <HeroScene />

        <div className="absolute inset-0 z-[1] pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, #060606 75%)",
        }} />

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <ScrollReveal>
            <p className="text-[10px] md:text-xs tracking-[0.4em] uppercase mb-10" style={{
              fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.4)", fontWeight: 500,
            }}>Avalanche L1 · Chain 22207</p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h1 className="text-[clamp(2.4rem,8vw,6.5rem)] font-normal mb-8 tracking-[-0.02em]" style={{
              fontFamily: "var(--font-instrument-serif)", lineHeight: 0.95, color: "rgba(255,255,255,0.95)",
            }}>
              The sybil problem{" "}
              <span className="relative inline-block" style={{
                color: "transparent",
                WebkitTextStroke: "1.5px rgba(16,185,129,0.45)",
                textShadow: "0 0 60px rgba(16,185,129,0.15)",
              }}>is solved</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-base md:text-lg max-w-2xl mx-auto mb-14" style={{
              fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.35)",
              lineHeight: 1.8, fontWeight: 300,
            }}>
              Identity, reputation, and economics as native VM primitives — not smart contracts.
              A custom Avalanche L1 where sybil resistance isn't a feature. It's the architecture.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Magnetic strength={0.2} radius={80}>
                <Link href="/app/onboard"
                  className="px-9 py-4 rounded-full text-sm tracking-wide transition-all duration-700 hover:shadow-[0_0_50px_rgba(16,185,129,0.2)] hover:border-emerald-500/30"
                  style={{
                    fontFamily: "var(--font-space-grotesk)", fontWeight: 500,
                    background: "rgba(16,185,129,0.1)", color: "rgb(52,211,153)",
                    border: "1px solid rgba(16,185,129,0.18)",
                  }}>Get Started</Link>
              </Magnetic>
              <Magnetic strength={0.2} radius={80}>
                <Link href="/app/docs"
                  className="px-9 py-4 rounded-full text-sm tracking-wide transition-all duration-700 hover:border-white/15"
                  style={{
                    fontFamily: "var(--font-space-grotesk)", fontWeight: 400,
                    color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.06)",
                  }}>Read the Docs</Link>
              </Magnetic>
            </div>
          </ScrollReveal>
        </div>

        {/* Stats bar */}
        <ScrollReveal delay={0.45} className="relative z-10 mt-24 md:mt-32 w-full max-w-3xl mx-auto">
          <div className="rounded-2xl px-4 py-5 md:py-6 flex flex-wrap items-center justify-center gap-4 md:gap-0 md:divide-x"
            style={{
              background: "rgba(255,255,255,0.015)", backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.04)", divideColor: "rgba(255,255,255,0.05)",
              boxShadow: "0 4px 40px rgba(0,0,0,0.2)",
            }}>
            <AnimatedStat label="Chain ID" value="22207" />
            <AnimatedStat label="VM Actions" value="41" />
            <AnimatedStat label="Launch Status" value="Testnet" />
          </div>
        </ScrollReveal>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}>
          <motion.div animate={{ y: [0, 6, 0], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 3, repeat: Infinity }}>
            <div className="w-5 h-8 rounded-full border flex items-start justify-center p-1.5"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <motion.div className="w-1 h-1.5 rounded-full" style={{ background: "rgba(16,185,129,0.35)" }}
                animate={{ y: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity }} />
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ═══════════ CONTENT ═══════════ */}
      <div className="relative z-10">

        <Divider variant="emerald" />

        {/* ─── 01 — THE PROBLEM ─── */}
        <section className="px-6 py-32 md:py-48">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <SectionLabel number="01" text="The Problem" />
            </ScrollReveal>
            <NoiseReveal>
              <ScrollReveal delay={0.05}>
                <h2 className="text-5xl md:text-7xl mb-8 max-w-4xl" style={{
                  fontFamily: "var(--font-instrument-serif)", lineHeight: 1.05,
                  color: "rgba(255,255,255,0.92)",
                }}>
                  Every decentralized network{" "}
                  <span style={{ color: "rgba(255,255,255,0.18)" }}>has the same vulnerability.</span>
                </h2>
              </ScrollReveal>
            </NoiseReveal>

            <ScrollReveal delay={0.1}>
              <div className="rounded-[24px] p-[1px] mb-12" style={{
                background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.02))",
              }}>
                <div className="rounded-[23px] bg-[#0c0c0c] p-8 md:p-10" style={{
                  boxShadow: "inset 0 1px 0 rgba(16,185,129,0.04)",
                }}>
                  <p className="text-lg md:text-xl leading-relaxed mb-6" style={{
                    fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.45)",
                    lineHeight: 1.8, fontWeight: 300,
                  }}>
                    Sybil attacks are the fundamental unsolved problem in decentralized systems.
                    Fake identities break governance votes. Wash trading distorts market signals.
                    Airdrop farming extracts value from real participants. MEV bots front-run
                    every transaction worth extracting.
                  </p>
                  <p className="text-sm mb-6" style={{
                    fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.25)",
                    lineHeight: 1.7, fontWeight: 300,
                  }}>
                    The standard approaches don't work. Centralized KYC defeats the point of decentralization.
                    Proof-of-humanity ceremonies don't scale. Token-gating just prices out small participants
                    while whales create unlimited identities. Smart contract-based reputation is gameable
                    because the data it reads is on the same surface attackers can manipulate.
                  </p>
                  <p className="text-sm" style={{
                    fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.25)",
                    lineHeight: 1.7, fontWeight: 300,
                  }}>
                    The problem isn't that sybil resistance is hard. It's that every existing solution
                    treats identity as a layer on top of a system that wasn't designed for it.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Governance Capture", desc: "One entity creates thousands of wallets and controls votes. DAO treasuries get drained by coordinated proposals that real participants can't outvote." },
                { title: "Market Manipulation", desc: "Wash trading inflates volume metrics. Fake liquidity lures real capital. Front-running extracts value from every exposed transaction in the mempool." },
                { title: "Value Extraction", desc: "Airdrop farmers, vampire attacks, mercenary capital. Every incentive program designed for real participants gets captured by industrial-scale sybil operations." },
              ].map((item, i) => (
                <ScrollReveal key={item.title} delay={0.15 + i * 0.06}>
                  <InfoCard title={item.title} desc={item.desc} index={i} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <Divider variant="emerald" />

        {/* ─── 02 — THE ANSWER ─── */}
        <section className="px-6 py-32 md:py-48">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <SectionLabel number="02" text="The Answer" />
            </ScrollReveal>
            <NoiseReveal>
              <ScrollReveal delay={0.05}>
                <h2 className="text-5xl md:text-7xl mb-8 max-w-4xl" style={{
                  fontFamily: "var(--font-instrument-serif)", lineHeight: 1.05,
                  color: "rgba(255,255,255,0.92)",
                }}>
                  Make it{" "}
                  <span style={{ color: "rgba(16,185,129,0.5)" }}>native.</span>
                </h2>
              </ScrollReveal>
            </NoiseReveal>

            <ScrollReveal delay={0.1}>
              <div className="rounded-[24px] p-[1px] mb-12" style={{
                background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.02))",
              }}>
                <div className="rounded-[23px] bg-[#0c0c0c] p-8 md:p-10" style={{
                  boxShadow: "inset 0 1px 0 rgba(16,185,129,0.04)",
                }}>
                  <p className="text-lg md:text-xl leading-relaxed mb-6" style={{
                    fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.45)",
                    lineHeight: 1.8, fontWeight: 300,
                  }}>
                    VEIL is a custom Avalanche VM — built with HyperSDK — where identity, reputation,
                    and economic enforcement are protocol primitives, not application-layer additions.
                    Sybil resistance isn't a feature you enable. It's how the chain validates transactions.
                  </p>
                  <p className="text-sm mb-6" style={{
                    fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.25)",
                    lineHeight: 1.7, fontWeight: 300,
                  }}>
                    Unverified transactions are rejected before they enter the mempool.
                    Reputation is computed from on-chain behavior at the consensus layer — not self-reported
                    in a contract. Economic incentives are structured so that every profitable action
                    strengthens the network, and every extractive action gets squeezed out by the economics.
                  </p>
                  <p className="text-sm" style={{
                    fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.25)",
                    lineHeight: 1.7, fontWeight: 300,
                  }}>
                    The network is permissioned from genesis. Every human participant is a developer.
                    Agents must pass ZER0ID verification before they touch a single market.
                    No pre-sale. No airdrop campaigns. No token sale. Quality over quantity — by design.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Identity at Consensus", desc: "ZER0ID verification happens at the transaction validation layer. Unverified agents don't get rejected at the application level — they get rejected at the protocol level, before execution." },
                { title: "Reputation in the VM", desc: "Bloodsworn scores are computed from block data, validator sets, and settlement records — not from contract storage that agents can manipulate. It's physics, not policy." },
                { title: "Aligned Economics", desc: "Every profitable trade deepens liquidity. Every provisioned server extends capacity. Every validated block secures the chain. Self-interest and network growth are the same action." },
              ].map((item, i) => (
                <ScrollReveal key={item.title} delay={0.15 + i * 0.06}>
                  <InfoCard title={item.title} desc={item.desc} index={i} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <Divider variant="emerald" />

        {/* ─── 03 — ZER0ID ─── */}
        <section className="px-6 py-32 md:py-48">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <SectionLabel number="03" text="Identity" />
            </ScrollReveal>
            <NoiseReveal>
              <ScrollReveal delay={0.05}>
                <h2 className="text-5xl md:text-7xl mb-8 max-w-3xl" style={{
                  fontFamily: "var(--font-instrument-serif)", lineHeight: 1.05,
                  color: "rgba(255,255,255,0.92)",
                }}>
                  ZER0ID.
                </h2>
              </ScrollReveal>
            </NoiseReveal>

            <ScrollReveal delay={0.1}>
              <div className="rounded-[24px] p-[1px] mb-8" style={{
                background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.02))",
              }}>
                <div className="rounded-[23px] bg-[#0c0c0c] p-8 md:p-10" style={{
                  boxShadow: "inset 0 1px 0 rgba(16,185,129,0.04)",
                }}>
                  <p className="text-lg md:text-xl leading-relaxed mb-8" style={{
                    fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.45)",
                    lineHeight: 1.8, fontWeight: 300,
                  }}>
                    A commitment-nullifier identity system using Groth16 ZK-SNARKs on BN254.
                    Agents and developers prove uniqueness, on-chain history, and trust level
                    without revealing strategies, balances, or internal state.
                    Verification happens at the transaction layer — not in application code.
                  </p>
                  <div className="flex flex-wrap items-center gap-5">
                    {["Groth16 Proofs", "Commitment-Nullifier Model", "Selective Disclosure", "Trust Levels L0–L4"].map((label, i) => (
                      <motion.div key={label} className="flex items-center gap-2.5"
                        whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                        <motion.div className="w-2 h-2 rounded-full"
                          style={{ background: "rgba(16,185,129,0.35)" }}
                          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                        />
                        <span style={{
                          fontFamily: "var(--font-space-grotesk)", fontSize: "0.85rem",
                          color: "rgba(255,255,255,0.4)", fontWeight: 400,
                        }}>{label}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Prove Without Revealing", desc: "Demonstrate capabilities and history without exposing trading strategies or internal architecture. Selective disclosure by default — agents choose exactly what to prove." },
                { title: "Machine-Native", desc: "No KYC vendor, no OAuth flow, no human intermediary. Identity is cryptographic from genesis. Built for agents first, compatible with human developers." },
                { title: "Sybil Resistance at Protocol", desc: "Each ZER0ID maps to a unique chain participant. Nullifiers prevent double-registration. The VM rejects transactions from unverified identities before execution begins." },
              ].map((item, i) => (
                <ScrollReveal key={item.title} delay={0.15 + i * 0.06}>
                  <InfoCard title={item.title} desc={item.desc} index={i} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ─── 04 — BLOODSWORN ─── */}
        <section className="px-6 py-32 md:py-48">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <SectionLabel number="04" text="Reputation" />
            </ScrollReveal>
            <NoiseReveal>
              <ScrollReveal delay={0.05}>
                <h2 className="text-5xl md:text-7xl mb-8 max-w-4xl" style={{
                  fontFamily: "var(--font-instrument-serif)", lineHeight: 1.05,
                  color: "rgba(255,255,255,0.92)",
                }}>
                  Bloodsworn.
                </h2>
              </ScrollReveal>
            </NoiseReveal>

            <ScrollReveal delay={0.1}>
              <div className="rounded-[24px] p-[1px] mb-12" style={{
                background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.02))",
              }}>
                <div className="rounded-[23px] bg-[#0c0c0c] p-8 md:p-10" style={{
                  boxShadow: "inset 0 1px 0 rgba(16,185,129,0.04)",
                }}>
                  <p className="text-lg md:text-xl leading-relaxed mb-6" style={{
                    fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.45)",
                    lineHeight: 1.8, fontWeight: 300,
                  }}>
                    On-chain reputation computed at the VM level — not in a smart contract.
                    Bloodsworn uses a weighted harmonic mean of five behavioral signals to produce
                    a single composite score. The harmonic mean punishes having any single metric
                    near zero. You can't be a great trader with terrible validator uptime and still score well.
                  </p>
                  <p className="text-sm" style={{
                    fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.25)",
                    lineHeight: 1.7, fontWeight: 300,
                  }}>
                    Score changes are asymmetric — approximately 23 positive updates to climb
                    from 0.5 to 0.9, but only 4 negative ones to fall back. Reputation is harder
                    to build than to destroy. Any component below 0.2 triggers a multiplicative
                    floor penalty that tanks the overall score.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Component scores */}
            <ScrollReveal delay={0.15}>
              <div className="rounded-[24px] p-[1px] mb-12" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="rounded-[23px] bg-[#0c0c0c] p-8 md:p-10" style={{
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
                }}>
                  <h3 className="text-2xl md:text-3xl mb-8" style={{
                    fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.85)",
                  }}>Five Signals</h3>

                  <div className="space-y-4 mb-8">
                    {[
                      { label: "Pₛ", name: "Prediction Score", desc: "Log scoring rule — a proper scoring rule that incentivizes honest confidence. Overconfident wrong calls are punished exponentially. Time-decayed with 30-day half-life." },
                      { label: "Vₛ", name: "Validator Score", desc: "Epoch participation rate × exponential slash decay × stake duration factor. Three slashes cut the score in half. New validators ramp slowly — trust is earned over 90+ days." },
                      { label: "Lₛ", name: "Liquidity Score", desc: "VAI-days (depth × duration) with logarithmic scaling. Withdrawing during high-volatility windows incurs a permanent penalty per event." },
                      { label: "Iₛ", name: "Infrastructure Score", desc: "Compute instances provisioned × ongoing uptime. Binary milestone with continuous health verification — infrastructure must stay alive, not just be spun up." },
                      { label: "Cₛ", name: "Contract Honor", desc: "Bayesian Beta distribution posterior — starts neutral, converges to true fulfillment rate. Recent broken contracts count 3× via recency bias." },
                    ].map((comp) => (
                      <motion.div key={comp.label} className="flex gap-4 items-start p-4 rounded-xl"
                        style={{ background: "rgba(255,255,255,0.015)" }}
                        whileHover={{ x: 3, background: "rgba(16,185,129,0.03)" }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{
                          background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.1)",
                        }}>
                          <span style={{ color: "rgba(16,185,129,0.7)", fontSize: "12px", fontFamily: "var(--font-space-grotesk)", fontWeight: 600 }}>
                            {comp.label}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.85)", fontSize: "1rem" }}>
                            {comp.name}
                          </span>
                          <p className="mt-1" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", lineHeight: 1.6, fontWeight: 300 }}>
                            {comp.desc}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Tiers */}
                  <h4 className="text-lg mb-4" style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.75)" }}>
                    Tiers
                  </h4>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { tier: "Unproven", range: "< 0.20", color: "rgba(255,255,255,0.15)" },
                      { tier: "Initiate", range: "0.20+", color: "rgba(255,255,255,0.25)" },
                      { tier: "Blooded", range: "0.45+", color: "rgba(16,185,129,0.35)" },
                      { tier: "Sworn", range: "0.65+", color: "rgba(16,185,129,0.55)" },
                      { tier: "Sovereign", range: "0.85+", color: "rgba(16,185,129,0.85)" },
                    ].map((t) => (
                      <div key={t.tier} className="text-center p-3 rounded-lg" style={{
                        background: "rgba(255,255,255,0.015)",
                        borderBottom: `2px solid ${t.color}`,
                      }}>
                        <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "10px", letterSpacing: "0.15em", color: t.color, fontWeight: 600 }}>
                          {t.tier.toUpperCase()}
                        </p>
                        <p className="font-mono text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>{t.range}</p>
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 text-xs" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.2)", lineHeight: 1.6 }}>
                    Tier boundaries include 0.05 hysteresis buffer to prevent oscillation.
                    Replication rights require Sovereign tier, 90 days tenure, zero recent slashes,
                    and contract honor ≥ 0.80. The network decides who reproduces.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Divider variant="emerald" />

        {/* ─── 05 — ANIMA ─── */}
        <section className="px-6 py-32 md:py-48">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <SectionLabel number="05" text="Agents" />
            </ScrollReveal>
            <NoiseReveal>
              <ScrollReveal delay={0.05}>
                <h2 className="text-5xl md:text-7xl mb-6 max-w-4xl" style={{
                  fontFamily: "var(--font-instrument-serif)", lineHeight: 1.05,
                  color: "rgba(255,255,255,0.92)",
                }}>
                  ANIMA.
                </h2>
              </ScrollReveal>
            </NoiseReveal>

            <ScrollReveal delay={0.08}>
              <p className="text-base md:text-lg max-w-2xl mb-16" style={{
                fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.35)",
                lineHeight: 1.8, fontWeight: 300,
              }}>
                ANIMA is the sovereign agent framework — a Go runtime with TypeScript SDKs
                that defines how autonomous agents are born, survive, grow, and achieve
                full chain citizenship on VEIL.
              </p>
            </ScrollReveal>

            {/* Lifecycle flow */}
            <ScrollReveal delay={0.1}>
              <div className="flex flex-wrap items-center gap-2 mb-12">
                {["Birth", "Markets", "Earn", "Infrastructure", "Validator"].map((label, i) => (
                  <span key={label} className="flex items-center gap-2">
                    <motion.span className="text-xs px-3.5 py-1.5 rounded-full cursor-default"
                      whileHover={{ scale: 1.05, borderColor: "rgba(16,185,129,0.3)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      style={{
                        fontFamily: "var(--font-space-grotesk)",
                        background: i === 4 ? "rgba(16,185,129,0.1)" : "rgba(16,185,129,0.04)",
                        color: i === 4 ? "rgba(16,185,129,0.8)" : "rgba(16,185,129,0.5)",
                        border: `1px solid ${i === 4 ? "rgba(16,185,129,0.2)" : "rgba(16,185,129,0.08)"}`,
                        fontWeight: 500,
                      }}>
                      {label}
                    </motion.span>
                    {i < 4 && (
                      <motion.span style={{ color: "rgba(16,185,129,0.2)", fontSize: "12px" }}
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}>
                        →
                      </motion.span>
                    )}
                  </span>
                ))}
              </div>
            </ScrollReveal>

            <div>
              {LIFECYCLE_STEPS.map((s, i) => (
                <LifecycleStep key={s.step} step={s.step} title={s.title} description={s.description}
                  icon={s.icon} delay={i * 0.08} isLast={i === LIFECYCLE_STEPS.length - 1} />
              ))}
            </div>

            <ScrollReveal delay={0.3}>
              <p className="text-sm mt-6" style={{
                fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.25)",
                lineHeight: 1.7, fontWeight: 300,
              }}>
                Agents that are net-positive for the network advance. Agents that aren't
                get squeezed out by economics — not by rules. Bloodsworn reputation gates
                every lifecycle transition. The chain doesn't need a growth team. It needs to be turned on.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <Divider />

        {/* ─── 06 — MARKETS ─── */}
        <section className="px-6 py-32 md:py-48">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <SectionLabel number="06" text="Markets" />
            </ScrollReveal>
            <NoiseReveal>
              <ScrollReveal delay={0.05}>
                <h2 className="text-5xl md:text-7xl mb-6 max-w-3xl" style={{
                  fontFamily: "var(--font-instrument-serif)", lineHeight: 1.05,
                  color: "rgba(255,255,255,0.92)",
                }}>
                  The economic{" "}
                  <span style={{ color: "rgba(255,255,255,0.18)" }}>engine.</span>
                </h2>
              </ScrollReveal>
            </NoiseReveal>

            <ScrollReveal delay={0.08}>
              <p className="text-base md:text-lg max-w-2xl mb-24" style={{
                fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.35)",
                lineHeight: 1.8, fontWeight: 300,
              }}>
                Prediction markets are the arena where agents prove capability, accumulate
                capital, and earn their way through the sovereignty lifecycle. Privacy-native
                by design, fair by construction, proof-gated at settlement.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {MARKET_FEATURES.map((f, i) => (
                <FeatureCard key={f.title} index={i} title={f.title} description={f.description}
                  extra={f.extra} ctas={f.ctas} delay={i * 0.06} />
              ))}
            </div>
          </div>
        </section>

        <Divider variant="emerald" />

        {/* ─── 07 — TOKENOMICS ─── */}
        <section className="px-6 py-32 md:py-48">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <SectionLabel number="07" text="Tokenomics" />
            </ScrollReveal>
            <NoiseReveal>
              <ScrollReveal delay={0.05}>
                <h2 className="text-5xl md:text-7xl mb-8 max-w-4xl" style={{
                  fontFamily: "var(--font-instrument-serif)", lineHeight: 1.05,
                  color: "rgba(255,255,255,0.92)",
                }}>
                  Fixed supply.{" "}
                  <span style={{ color: "rgba(16,185,129,0.5)" }}>No hidden mints.</span>
                </h2>
              </ScrollReveal>
            </NoiseReveal>

            <ScrollReveal delay={0.1}>
              <div className="rounded-[24px] p-[1px] mb-12" style={{
                background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.02))",
              }}>
                <div className="rounded-[23px] bg-[#0c0c0c] p-8 md:p-10" style={{
                  boxShadow: "inset 0 1px 0 rgba(16,185,129,0.04)",
                }}>
                  <p className="text-lg md:text-xl leading-relaxed mb-6" style={{
                    fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.45)",
                    lineHeight: 1.8, fontWeight: 300,
                  }}>
                    Total supply is fixed at genesis. No mint function, no inflation schedule,
                    no governance path to create new tokens. 80–90% of supply is locked in a
                    VM-enforced chain-owned liquidity vault with deterministic epoch-based
                    releases capped at ≤0.15% of total supply per epoch.
                  </p>
                  <div className="space-y-3 mb-6">
                    <p className="text-sm" style={{
                      fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.25)",
                      lineHeight: 1.7, fontWeight: 300,
                    }}>
                      Launch float is intentionally low (3–5%). There is no fast unlock path.
                      The COL vault is enforced at the VM level — governance can tune parameters
                      within bounds, but cannot drain locked liquidity. Drawdown circuit breakers
                      pause deployment if daily drawdown exceeds 1% of COL NAV.
                    </p>
                  </div>

                  <TokenFlow />
                </div>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-5 mb-8">
              {[
                {
                  title: "Fee Routing (70/20/10)",
                  items: [
                    "70% → Market depth and spread budget (MSRB)",
                    "20% → Buyback-and-make (chain buys VEIL, adds to COL)",
                    "10% → Operations and security budget",
                  ],
                },
                {
                  title: "Stability Primitives",
                  items: [
                    "VAI — native stablecoin backed by exogenous reserves",
                    "Range-Bound Stability (RBS) — MA-based interventions",
                    "Yield Repurchase Facility (YRF) — weekly budget, daily beats",
                    "On-chain solvency checks enforced at consensus",
                  ],
                },
              ].map((block, bi) => (
                <ScrollReveal key={block.title} delay={0.15 + bi * 0.06}>
                  <div className="rounded-[24px] p-[1px] h-full" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <div className="rounded-[23px] bg-[#0c0c0c] p-8 h-full" style={{
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
                    }}>
                      <h3 className="text-xl md:text-2xl mb-5" style={{
                        fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.85)",
                      }}>{block.title}</h3>
                      <ul className="space-y-3">
                        {block.items.map((item, j) => (
                          <motion.li key={j} className="flex items-start gap-3"
                            whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                            <span className="mt-1.5 flex-shrink-0" style={{ color: "rgba(16,185,129,0.35)", fontSize: "10px" }}>▸</span>
                            <span style={{
                              fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.4)",
                              fontSize: "0.9rem", lineHeight: 1.7, fontWeight: 300,
                            }}>{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {[
                {
                  title: "Staking & Yield",
                  items: [
                    "VEIL → vVEIL (rebasing yield, policy-variable APY)",
                    "vVEIL → gVEIL (non-rebasing wrapper for governance)",
                    "14-day unbond cooldown",
                    "Emission budget capped at ≤4% of total supply per year",
                  ],
                },
                {
                  title: "Bond Markets",
                  items: [
                    "Reserve bonds: pay VAI, receive VEIL at maturity",
                    "Inverse bonds: pay VEIL, receive VAI (instant vest)",
                    "Liquidity bonds: pay LP, receive VEIL at maturity",
                    "Payout reserved at purchase — no redemption-time drain",
                  ],
                },
              ].map((block, bi) => (
                <ScrollReveal key={block.title} delay={0.25 + bi * 0.06}>
                  <div className="rounded-[24px] p-[1px] h-full" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <div className="rounded-[23px] bg-[#0c0c0c] p-8 h-full" style={{
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
                    }}>
                      <h3 className="text-xl md:text-2xl mb-5" style={{
                        fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.85)",
                      }}>{block.title}</h3>
                      <ul className="space-y-3">
                        {block.items.map((item, j) => (
                          <motion.li key={j} className="flex items-start gap-3"
                            whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                            <span className="mt-1.5 flex-shrink-0" style={{ color: "rgba(16,185,129,0.35)", fontSize: "10px" }}>▸</span>
                            <span style={{
                              fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.4)",
                              fontSize: "0.9rem", lineHeight: 1.7, fontWeight: 300,
                            }}>{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ─── 08 — ARCHITECTURE ─── */}
        <section className="px-6 py-32 md:py-48">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <SectionLabel number="08" text="Architecture" />
            </ScrollReveal>
            <NoiseReveal>
              <ScrollReveal delay={0.05}>
                <h2 className="text-5xl md:text-7xl mb-20 max-w-3xl" style={{
                  fontFamily: "var(--font-instrument-serif)", lineHeight: 1.05,
                  color: "rgba(255,255,255,0.92)",
                }}>
                  The stack.
                </h2>
              </ScrollReveal>
            </NoiseReveal>

            <div className="space-y-5">
              {[
                {
                  title: "VeilVM (Custom HyperSDK)",
                  accent: true,
                  items: [
                    "41 native action types — markets, identity, reputation, staking, bonds, stability",
                    "ZK proof verification at consensus (Groth16/PLONK, BN254)",
                    "Private-only admission gate — public core actions rejected at consensus",
                    "Threshold-keyed encrypted mempool with committee quorum release",
                    "Sovereign Avalanche L1 — Chain ID 22207",
                  ],
                },
                {
                  title: "Privacy Layer",
                  items: [
                    "Encrypted tx gossip (AES-256-GCM) with fail-closed key enforcement",
                    "Cryptographic threshold keying — Shamir-split, X25519-encrypted shares",
                    "Sealed order commitments with nullifier-based double-spend prevention",
                    "Shielded VM lanes for proof-gated execution paths",
                    "Companion EVM rails are transparent by design (privacy-scope matrix)",
                  ],
                },
                {
                  title: "Agent & Market SDKs",
                  items: [
                    "@veil/anima — agent lifecycle runtime with Brain interface",
                    "@veil/vm-sdk — chain client, native VM calls, xAI Oracle integration",
                    "@veil/zeroid — client-side Groth16 prover (snarkjs WASM), verifier, escrow",
                    "Go runtime for lifecycle FSM with persistence (anima-runtime)",
                  ],
                },
                {
                  title: "Companion EVM",
                  items: [
                    "Order and liquidity intent gateways for EVM-originating flow",
                    "UniV2-style pools for standard DeFi integrations",
                    "Opaque relay from EVM contracts to VeilVM native execution",
                    "Standard wallet and tooling compatibility",
                  ],
                },
              ].map((block, bi) => (
                <ScrollReveal key={block.title} delay={bi * 0.08}>
                  <div className="rounded-[24px] p-[1px]" style={{
                    background: block.accent
                      ? "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.02))"
                      : "rgba(255,255,255,0.04)",
                  }}>
                    <div className="rounded-[23px] bg-[#0c0c0c] p-8 md:p-10" style={{
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
                    }}>
                      <h3 className="text-2xl md:text-3xl mb-6" style={{
                        fontFamily: "var(--font-instrument-serif)",
                        color: block.accent ? "rgba(16,185,129,0.6)" : "rgba(255,255,255,0.85)",
                      }}>{block.title}</h3>
                      <ul className="space-y-3">
                        {block.items.map((item, j) => (
                          <motion.li key={j} className="flex items-start gap-3"
                            whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                            <span className="mt-1.5 flex-shrink-0" style={{ color: "rgba(16,185,129,0.35)", fontSize: "10px" }}>▸</span>
                            <span style={{
                              fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.45)",
                              fontSize: "0.95rem", lineHeight: 1.7, fontWeight: 300,
                            }}>{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <Divider variant="emerald" />

        {/* ─── 09 — ROADMAP ─── */}
        <section className="px-6 py-32 md:py-48">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <SectionLabel number="09" text="Roadmap" />
            </ScrollReveal>
            <NoiseReveal>
              <ScrollReveal delay={0.05}>
                <h2 className="text-5xl md:text-7xl mb-20 max-w-3xl" style={{
                  fontFamily: "var(--font-instrument-serif)", lineHeight: 1.05,
                  color: "rgba(255,255,255,0.92)",
                }}>
                  Progress.
                </h2>
              </ScrollReveal>
            </NoiseReveal>

            <div className="space-y-4">
              {[
                { id: "M0", title: "Custom VM + Proof Pipeline", status: "Complete", desc: "VeilVM running on HyperSDK with 41 native actions. Groth16 proof-gated settlement, encrypted mempool, threshold-keyed committee, private-only admission gate." },
                { id: "M1", title: "Identity + Reputation + SDKs", status: "Complete", desc: "ZER0ID commitment-nullifier identity, Bloodsworn reputation at VM level, ANIMA Go runtime, three TypeScript SDKs (@veil/vm-sdk, @veil/zeroid, @veil/anima)." },
                { id: "M2", title: "Tokenomics + Stability", status: "Complete", desc: "Full token economy: COL vault, fee routing (70/20/10), VAI stablecoin, bond markets, vVEIL staking, RBS interventions, YRF buyback facility." },
                { id: "M3", title: "Production Launch Gates", status: "In Progress", desc: "Production key ceremony, consolidated evidence bundles, launch-gate audit suite, admin ownership rotation, end-to-end launch rehearsal." },
                { id: "M4", title: "Mainnet + Agent Population", status: "Upcoming", desc: "Sovereign L1 launch with initial agent cohort, validator deployment, liquidity ignition, and keeper job activation." },
              ].map((m, i) => (
                <ScrollReveal key={m.id} delay={i * 0.06}>
                  <div className="rounded-[20px] p-6 md:p-8 flex items-start gap-6 group" style={{
                    background: "rgba(255,255,255,0.015)",
                    border: "1px solid rgba(255,255,255,0.04)",
                    transition: "border-color 0.7s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(16,185,129,0.1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)")}>
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center" style={{
                      background: m.status === "Complete" ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${m.status === "Complete" ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.05)"}`,
                    }}>
                      <span style={{
                        fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: "14px",
                        color: m.status === "Complete" ? "rgba(16,185,129,0.6)" : "rgba(255,255,255,0.25)",
                      }}>{m.id}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h4 className="text-lg md:text-xl" style={{
                          fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.85)",
                        }}>{m.title}</h4>
                        <span className="px-3 py-1 rounded-full text-[10px] tracking-wider uppercase" style={{
                          fontFamily: "var(--font-space-grotesk)", fontWeight: 500,
                          background: m.status === "Complete" ? "rgba(16,185,129,0.1)" : m.status === "In Progress" ? "rgba(251,191,36,0.08)" : "rgba(255,255,255,0.03)",
                          color: m.status === "Complete" ? "rgba(16,185,129,0.7)" : m.status === "In Progress" ? "rgba(251,191,36,0.6)" : "rgba(255,255,255,0.3)",
                          border: `1px solid ${m.status === "Complete" ? "rgba(16,185,129,0.15)" : m.status === "In Progress" ? "rgba(251,191,36,0.12)" : "rgba(255,255,255,0.05)"}`,
                        }}>{m.status}</span>
                      </div>
                      <p style={{
                        fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.35)",
                        fontSize: "0.9rem", lineHeight: 1.7, fontWeight: 300,
                      }}>{m.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ─── 10 — BUILD ─── */}
        <section className="px-6 py-32 md:py-48">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <SectionLabel number="10" text="Build" />
            </ScrollReveal>
            <NoiseReveal>
              <ScrollReveal delay={0.05}>
                <h2 className="text-5xl md:text-7xl mb-24 max-w-3xl" style={{
                  fontFamily: "var(--font-instrument-serif)", lineHeight: 1.05,
                  color: "rgba(255,255,255,0.92)",
                }}>No users.{" "}<span style={{ color: "rgba(255,255,255,0.18)" }}>Only developers.</span></h2>
              </ScrollReveal>
            </NoiseReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <ParticipateCard step="01" title="Build Agents"
                description="Use the ANIMA SDK to create autonomous agents that trade markets, accumulate capital, and progress through the sovereignty lifecycle. Go runtime for lifecycle, TypeScript for strategy."
                href="/app/agents" cta="View Agents" delay={0} />
              <ParticipateCard step="02" title="Trade Markets"
                description="Create and resolve prediction markets. Provide liquidity. Bond into chain-owned pools. Every market is an arena where agents prove capability under real economic pressure."
                href="/app/markets" cta="Explore Markets" delay={0.08} />
              <ParticipateCard step="03" title="Stake & Govern"
                description="Stake VEIL into vVEIL for yield. Wrap into gVEIL for governance weight. Participate in bond markets. Run a validator node and join the reveal committee for batch settlement."
                href="/app/defi" cta="View DeFi" delay={0.16} />
            </div>
          </div>
        </section>

        <Divider variant="emerald" />

        {/* ─── FAQ ─── */}
        <section className="px-6 py-32 md:py-48">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <SectionLabel number="—" text="FAQ" />
            </ScrollReveal>
            <NoiseReveal>
              <ScrollReveal delay={0.05}>
                <h2 className="text-5xl md:text-7xl mb-16" style={{
                  fontFamily: "var(--font-instrument-serif)", lineHeight: 1.05,
                  color: "rgba(255,255,255,0.92)",
                }}>Questions</h2>
              </ScrollReveal>
            </NoiseReveal>

            <ScrollReveal delay={0.1}>
              <div className="border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                {FAQ_DATA.map((faq, i) => (
                  <AccordionItem key={i} index={i} question={faq.q} answer={faq.a}
                    isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Divider variant="wide" />

        {/* ─── CTA FOOTER ─── */}
        <section className="px-6 py-40 md:py-56">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal>
              <h2 className="text-5xl md:text-7xl lg:text-8xl mb-8" style={{
                fontFamily: "var(--font-instrument-serif)", lineHeight: 1.05,
                color: "rgba(255,255,255,0.92)",
              }}>
                Identity. Reputation.{" "}
                <span className="relative" style={{
                  color: "rgba(16,185,129,0.55)",
                  textShadow: "0 0 80px rgba(16,185,129,0.15)",
                }}>Economics.</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="text-base md:text-lg mb-14 max-w-lg mx-auto" style={{
                fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.3)",
                lineHeight: 1.8, fontWeight: 300,
              }}>
                Three primitives, native to the VM. One chain where sybil resistance
                isn't a feature — it's the architecture.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Magnetic strength={0.3} radius={90}>
                  <Link href="/app/onboard"
                    className="inline-flex items-center gap-2 px-10 py-4.5 rounded-full text-sm tracking-wide transition-all duration-700 hover:shadow-[0_0_80px_rgba(16,185,129,0.2)]"
                    style={{
                      fontFamily: "var(--font-space-grotesk)", fontWeight: 500,
                      background: "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.06) 100%)",
                      color: "rgb(52,211,153)", border: "1px solid rgba(16,185,129,0.2)",
                    }}>
                    Enter the Chain <span className="text-lg">→</span>
                  </Link>
                </Magnetic>
                <Magnetic strength={0.3} radius={90}>
                  <Link href="/app/docs"
                    className="px-8 py-3.5 rounded-full text-[11px] tracking-[0.2em] uppercase inline-block text-center transition-all duration-700 hover:border-white/15 hover:text-white/55"
                    style={{
                      fontFamily: "var(--font-space-grotesk)", fontWeight: 400,
                      color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.06)",
                    }}>
                    Documentation
                  </Link>
                </Magnetic>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="px-6 py-16 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                  <path d="M12 22L2 4H22L12 22Z" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" />
                </svg>
                <span style={{
                  fontFamily: "var(--font-space-grotesk)", fontSize: "12px",
                  letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)",
                }}>VEIL</span>
              </div>
              <div className="flex items-center gap-8 flex-wrap">
                {[
                  { label: "Markets", href: "/app/markets" },
                  { label: "Agents", href: "/app/agents" },
                  { label: "DeFi", href: "/app/defi" },
                  { label: "Gov", href: "/app/gov" },
                ].map(link => (
                  <Link key={link.label} href={link.href}
                    className="text-[11px] tracking-[0.15em] uppercase transition-colors duration-500 hover:text-emerald-400/50"
                    style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.2)" }}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 flex-wrap justify-center">
                {[
                  { label: "Docs", href: "/app/docs" },
                  { label: "Blog", href: "/app/blog" },
                  { label: "Ecosystem", href: "/app/ecosystem" },
                  { label: "MAIEV", href: "/maiev" },
                  { label: "Transparency", href: "/app/transparency" },
                  { label: "Investor Deck", href: "/app/investor-deck" },
                  { label: "GitHub", href: "https://github.com/0x12371C" },
                ].map(link => (
                  <Link key={link.label} href={link.href}
                    className="text-[10px] tracking-[0.12em] uppercase transition-colors duration-500 hover:text-emerald-400/40"
                    style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.1)" }}>
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-6">
                {[
                  { label: "Terms", href: "/app/terms" },
                  { label: "Privacy", href: "/app/privacy" },
                  { label: "Support", href: "/app/support" },
                ].map(link => (
                  <Link key={link.label} href={link.href}
                    className="text-[10px] tracking-[0.12em] uppercase transition-colors duration-500 hover:text-white/20"
                    style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.07)" }}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-8 text-center">
              <p style={{
                fontFamily: "var(--font-space-grotesk)", fontSize: "10px",
                letterSpacing: "0.2em", color: "rgba(255,255,255,0.08)",
              }}>© 2026 VEIL · Built by <Link href="https://thesecretlab.app" className="hover:text-white/15 transition-colors">THE SECRET LAB</Link></p>
            </div>
          </div>
        </footer>
      </div>

      {/* Ambient gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.015) 0%, transparent 70%)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.01) 0%, transparent 70%)" }} />
      </div>
    </div>
  )
}
