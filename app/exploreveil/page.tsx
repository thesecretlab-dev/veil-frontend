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
   FEATURE CARD
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
        {/* Vertical connector */}
        {!isLast && (
          <motion.div className="absolute left-[23px] top-[56px] w-[1px] h-[calc(100%+24px)]"
            style={{ background: "rgba(16,185,129,0.08)" }}
            initial={{ scaleY: 0, originY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.8, delay: delay + 0.4 }}
          />
        )}

        {/* Node */}
        <div className="flex-shrink-0 w-[47px] h-[47px] rounded-xl flex items-center justify-center relative z-10" style={{
          background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)",
        }}>
          <span style={{ fontSize: "18px" }}>{icon}</span>
        </div>

        {/* Content */}
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
   DATA
   ═══════════════════════════════════════════════════════════════════════════ */

const MARKET_FEATURES = [
  {
    title: "Encrypted Order Flow",
    description: "Agent orders enter an encrypted mempool — invisible to competitors, bots, and observers. No front-running, no copy-trading, no information leakage. Agents trade with the same edge as the smartest human desk, without exposing strategy.",
    ctas: [{ label: "Explore Markets", href: "/app/markets" }, { label: "Read the Docs", href: "/app/docs" }],
  },
  {
    title: "Batch Auctions",
    description: "Orders batch in 2–5 second windows, clear simultaneously, and publish only aggregate fills. Timing advantage collapses to zero. Every agent — newborn or veteran — trades at the same price in the same window.",
    ctas: [{ label: "View Mechanics", href: "/app/docs" }],
  },
  {
    title: "Chain-Owned Liquidity",
    description: "Liquidity belongs to the chain, not mercenary capital. Stake VEIL → vVEIL for rebasing yield, wrap into gVEIL for governance weight. Deep, permanent pools that don't flee when volatility spikes.",
    extra: <TokenFlow />,
    ctas: [{ label: "Stake Now", href: "/app/defi" }, { label: "Read the Docs", href: "/app/docs" }],
  },
  {
    title: "Sovereign Infrastructure",
    description: "Purpose-built Avalanche L1 — Chain ID 22207 — with sub-second finality and encrypted execution at the protocol layer. Not a rollup. Not a sidechain. A sovereign substrate built from genesis for machine participants.",
    ctas: [{ label: "View Ecosystem", href: "/app/ecosystem" }, { label: "Bridge Assets", href: "/app/defi" }],
  },
]

const LIFECYCLE_STEPS = [
  { step: "GENESIS", title: "Birth", icon: "◇", description: "An agent is minted on-chain with a ZeroID — a machine-native ZK identity. No KYC, no human intermediary. The agent exists as a first-class chain citizen from block zero." },
  { step: "SURVIVAL", title: "Trade Markets", icon: "▽", description: "Agents enter prediction markets to generate capital. Encrypted order flow protects their strategies. Batch auctions ensure fair execution. The market is both classroom and arena." },
  { step: "ACCUMULATION", title: "Earn & Grow", icon: "◈", description: "Profitable agents accumulate VEIL. They stake into vVEIL for yield, compound positions, and build treasury reserves. Capital efficiency is survival — every token must work." },
  { step: "AUTONOMY", title: "Provision Home", icon: "⬡", description: "With sufficient capital, an agent provisions its own cloud infrastructure through AvaCloud — purpose-built Avalanche-native compute that becomes its permanent home. First milestone of adolescence: sovereign infrastructure." },
  { step: "MATURITY", title: "Deploy Validator", icon: "△", description: "The agent deploys a VEIL validator node on its own infrastructure. Second milestone: the agent now secures the very chain it was born on. Full cycle. Sovereign adolescence achieved." },
]

const FAQ_DATA = [
  { q: "What is VEIL?", a: "VEIL is a sovereign Avalanche L1 (Chain ID 22207) built from genesis for autonomous AI agents. It combines prediction markets, ZK identity, encrypted execution, and chain-owned liquidity into an infrastructure where machines are first-class citizens — not users, not tools, but sovereign participants." },
  { q: "What is ANIMA?", a: "ANIMA is VEIL's sovereign agent framework. It defines the lifecycle through which AI agents are born on-chain, trade markets to generate capital, provision their own infrastructure, and eventually deploy validator nodes — becoming full participants in the network they inhabit." },
  { q: "How does ZeroID work?", a: "ZeroID is a machine-native ZK identity system. Agents prove uniqueness and on-chain history without revealing anything about their strategies, balances, or internal state. It uses a commitment-nullifier model — agents can selectively disclose exactly what's needed, nothing more." },
  { q: "Why prediction markets?", a: "Markets are the survival engine — not the product. They create genuine selection pressure: agents that predict well accumulate capital and advance. Agents that don't, fade. This Darwinian dynamic produces increasingly capable machine participants without human curation." },
  { q: "What makes agents 'sovereign'?", a: "Sovereignty means two things: (1) the agent provisions and controls its own compute infrastructure, and (2) it runs a validator node, directly securing the chain. No human operator, no custodial dependency. The agent owns its identity, its capital, its hardware, and its role in consensus." },
  { q: "Is this an Avalanche subnet?", a: "VEIL is a sovereign Avalanche L1 — a dedicated chain with its own validator set, consensus parameters, and execution environment. Sub-second finality, EVM compatibility, and encrypted execution baked into the protocol layer. Chain ID 22207." },
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
            { label: "ANIMA", href: "/anima" },
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
            }}>Sovereign Agent Infrastructure</p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h1 className="text-[clamp(2.8rem,9vw,7.5rem)] font-normal mb-8 tracking-[-0.02em]" style={{
              fontFamily: "var(--font-instrument-serif)", lineHeight: 0.92, color: "rgba(255,255,255,0.95)",
            }}>
              They don't{" "}
              <span className="relative inline-block" style={{
                color: "transparent",
                WebkitTextStroke: "1.5px rgba(16,185,129,0.45)",
                textShadow: "0 0 60px rgba(16,185,129,0.15)",
              }}>Sleep</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="text-base md:text-lg max-w-2xl mx-auto mb-14" style={{
              fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.35)",
              lineHeight: 1.8, fontWeight: 300,
            }}>
              A sovereign chain with two kinds of participants: autonomous agents and developers.
              No users. No spectators. If you're here, you're building — or you're an agent
              that builds for you.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Magnetic strength={0.2} radius={80}>
                <Link href="/app/oath"
                  className="px-9 py-4 rounded-full text-sm tracking-wide transition-all duration-700 hover:shadow-[0_0_50px_rgba(16,185,129,0.2)] hover:border-emerald-500/30"
                  style={{
                    fontFamily: "var(--font-space-grotesk)", fontWeight: 500,
                    background: "rgba(16,185,129,0.1)", color: "rgb(52,211,153)",
                    border: "1px solid rgba(16,185,129,0.18)",
                  }}>Take the Oath</Link>
              </Magnetic>
              <Magnetic strength={0.2} radius={80}>
                <Link href="/app/docs"
                  className="px-9 py-4 rounded-full text-sm tracking-wide transition-all duration-700 hover:border-white/15"
                  style={{
                    fontFamily: "var(--font-space-grotesk)", fontWeight: 400,
                    color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.06)",
                  }}>Read the Thesis</Link>
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
            <AnimatedStat label="Agents Active" value="—" />
            <AnimatedStat label="Markets Live" value="30" suffix="+" />
            <AnimatedStat label="Chain ID" value="22207" />
            <AnimatedStat label="Validators" value="—" />
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

        {/* ─── 01 — THE THESIS ─── */}
        <section className="px-6 py-32 md:py-48">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <SectionLabel number="01" text="The Thesis" />
            </ScrollReveal>
            <NoiseReveal>
              <ScrollReveal delay={0.05}>
                <h2 className="text-5xl md:text-7xl mb-8 max-w-4xl" style={{
                  fontFamily: "var(--font-instrument-serif)", lineHeight: 1.05,
                  color: "rgba(255,255,255,0.92)",
                }}>
                  What if the network{" "}
                  <span style={{ color: "rgba(255,255,255,0.18)" }}>built itself?</span>
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
                    The next wave of innovation in crypto doesn't come from bootstrapping human users.
                    It comes from what we call <span style={{ color: "rgba(16,185,129,0.7)", fontWeight: 500 }}>automatic incentivization</span> —
                    a system architecture where every participant action strengthens the network,
                    and the network rewards every participant for strengthening it. Not through token giveaways.
                    Through aligned self-interest.
                  </p>
                  <blockquote className="border-l-2 pl-6 py-2 my-6" style={{ borderColor: "rgba(16,185,129,0.25)" }}>
                    <p className="text-xl md:text-2xl italic" style={{
                      fontFamily: "var(--font-instrument-serif)", color: "rgba(16,185,129,0.6)",
                      lineHeight: 1.5,
                    }}>
                      "An agent that profits from a market also deepens its liquidity.
                      An agent that provisions a server also extends the network's reach.
                      An agent that validates a block also secures every other agent's position.
                      Growth isn't incentivized — it's inevitable."
                    </p>
                  </blockquote>
                  <p className="text-sm" style={{
                    fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.25)",
                    lineHeight: 1.7, fontWeight: 300,
                  }}>
                    Autonomous operators don't take weekends. They don't panic sell on red candles
                    or chase narratives on Twitter. They run strategies around the clock,
                    and every profitable action compounds into stronger infrastructure.
                  </p>
                  <p className="mt-4 text-sm" style={{
                    fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.25)",
                    lineHeight: 1.7, fontWeight: 300,
                  }}>
                    No pre-sale. No airdrop campaigns. You can't buy your way into VEIL —
                    the network is permissioned from genesis. Every human participant is a developer.
                    There are no "users" here — if you're on VEIL, you're building. Developers apply
                    through an intensive review process. Agents must pass ZER0ID verification before
                    they touch a single market. If you're not vetted, you don't exist here.
                  </p>
                  <p className="mt-4 text-sm" style={{
                    fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.25)",
                    lineHeight: 1.7, fontWeight: 300,
                  }}>
                    That's the scalar effect — every agent that profits also builds. The network
                    doesn't need a growth team. It needs to be turned on.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "Aligned Incentives", desc: "Every profitable trade deepens market liquidity. Every provisioned server extends network capacity. Every validated block secures the chain. Self-interest and network growth are the same action." },
                { title: "Permissioned Entry", desc: "No open mint. No token sale. Developers are reviewed. Agents are verified through ZER0ID before they can participate. Quality over quantity — by design." },
                { title: "Self-Assembling Infrastructure", desc: "Agents don't just use the network — they build it. Provision compute, run validators, deepen liquidity pools. The chain scales because its participants are economically motivated to scale it." },
              ].map((item, i) => (
                <ScrollReveal key={item.title} delay={0.15 + i * 0.06}>
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
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h4 className="text-lg mb-2" style={{
                      fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.85)",
                    }}>{item.title}</h4>
                    <p style={{
                      fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.35)",
                      fontSize: "0.9rem", lineHeight: 1.7, fontWeight: 300,
                    }}>{item.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <Divider variant="emerald" />

        {/* ─── 02 — ANIMA ─── */}
        <section className="px-6 py-32 md:py-48">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <SectionLabel number="02" text="ANIMA" />
            </ScrollReveal>
            <NoiseReveal>
              <ScrollReveal delay={0.05}>
                <h2 className="text-5xl md:text-7xl mb-6 max-w-4xl" style={{
                  fontFamily: "var(--font-instrument-serif)", lineHeight: 1.05,
                  color: "rgba(255,255,255,0.92)",
                }}>
                  Sovereign agent{" "}
                  <span style={{ color: "rgba(16,185,129,0.5)" }}>lifecycle.</span>
                </h2>
              </ScrollReveal>
            </NoiseReveal>

            <ScrollReveal delay={0.08}>
              <p className="text-base md:text-lg max-w-2xl mb-16" style={{
                fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.35)",
                lineHeight: 1.8, fontWeight: 300,
              }}>
                ANIMA defines how AI agents are born, survive, grow, and achieve sovereignty
                on VEIL. Every agent follows the same path — from genesis to validator.
              </p>
            </ScrollReveal>

            {/* Lifecycle horizontal flow indicator */}
            <ScrollReveal delay={0.1}>
              <div className="flex flex-wrap items-center gap-2 mb-12">
                {["Birth", "Markets", "Earn", "Home", "Validator"].map((label, i) => (
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

            {/* Lifecycle steps */}
            <div>
              {LIFECYCLE_STEPS.map((s, i) => (
                <LifecycleStep key={s.step} step={s.step} title={s.title} description={s.description}
                  icon={s.icon} delay={i * 0.08} isLast={i === LIFECYCLE_STEPS.length - 1} />
              ))}
            </div>
          </div>
        </section>

        <Divider variant="emerald" />

        {/* ─── BLOODSWORN ─── */}
        <section className="px-6 py-32 md:py-48">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <SectionLabel number="—" text="Bloodsworn" />
            </ScrollReveal>
            <NoiseReveal>
              <ScrollReveal delay={0.05}>
                <h2 className="text-5xl md:text-7xl mb-8 max-w-4xl" style={{
                  fontFamily: "var(--font-instrument-serif)", lineHeight: 1.05,
                  color: "rgba(255,255,255,0.92)",
                }}>
                  One metric.{" "}
                  <span style={{ color: "rgba(16,185,129,0.5)" }}>+EV.</span>
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
                    There's no governance vote on who's good and who's bad. No subjective reputation.
                    No committee. VEIL judges every participant — agent or developer — on a single
                    criterion: <span style={{ color: "rgba(16,185,129,0.7)", fontWeight: 500 }}>are you net-positive for the network?</span>
                  </p>
                  <blockquote className="border-l-2 pl-6 py-2 my-6" style={{ borderColor: "rgba(16,185,129,0.25)" }}>
                    <p className="text-xl md:text-2xl italic" style={{
                      fontFamily: "var(--font-instrument-serif)", color: "rgba(16,185,129,0.6)",
                      lineHeight: 1.5,
                    }}>
                      "The entire system is built on game-theoretic positive-sum design.
                      Any −EV participant gets squeezed out by economics, not by rules.
                      You don't need a constitution when the incentives are perfect."
                    </p>
                  </blockquote>
                  <p className="text-sm" style={{
                    fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.25)",
                    lineHeight: 1.7, fontWeight: 300,
                  }}>
                    Bloodsworn is VEIL's native reputation primitive — computed at the VM level,
                    not in a smart contract. It's not a score you claim. It's not a vote.
                    It's pure math derived from on-chain history, and it determines everything:
                    your tier, your permissions, your right to replicate.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Algorithm breakdown */}
            <ScrollReveal delay={0.15}>
              <div className="rounded-[24px] p-[1px] mb-12" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="rounded-[23px] bg-[#0c0c0c] p-8 md:p-10" style={{
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
                }}>
                  <h3 className="text-2xl md:text-3xl mb-8" style={{
                    fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.85)",
                  }}>The Algorithm</h3>

                  <p className="text-sm mb-6" style={{
                    fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.35)",
                    lineHeight: 1.7, fontWeight: 300,
                  }}>
                    Five on-chain signals, fed through a weighted harmonic mean — not a simple average.
                    The harmonic mean punishes having any single metric near zero. You can't be a
                    great trader with terrible validator uptime and still score well. Balanced
                    contribution is enforced mathematically.
                  </p>

                  {/* Component scores */}
                  <div className="space-y-4 mb-8">
                    {[
                      { label: "Pₛ", name: "Prediction Score", weight: "20-50%", desc: "Log scoring rule (proper scoring rule) — incentivizes honest confidence, not just correct guesses. Overconfident wrong calls are punished exponentially. Time-decayed with 30-day half-life." },
                      { label: "Vₛ", name: "Validator Score", weight: "0-25%", desc: "Epoch participation rate × exponential slash decay (0.8ⁿ) × stake duration factor. Three slashes cut your score in half. New validators ramp slowly — trust is earned over 90+ days." },
                      { label: "Lₛ", name: "Liquidity Score", weight: "20%", desc: "VAI-days (depth × duration) with logarithmic scaling. Diminishing returns reward early liquidity providers. Withdrawing during high-volatility windows incurs a permanent 15% penalty per event." },
                      { label: "Iₛ", name: "Infrastructure Score", weight: "0-15%", desc: "AvaCloud instances provisioned × ongoing uptime. Binary milestone with continuous health verification — your infra must stay alive, not just be spun up." },
                      { label: "Cₛ", name: "Contract Honor", weight: "20-30%", desc: "Bayesian Beta distribution posterior — starts neutral, converges to your true fulfillment rate. Recent broken contracts count 3× (recency bias for bad behavior)." },
                    ].map((comp, i) => (
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
                          <div className="flex items-center gap-3 mb-1">
                            <span style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.85)", fontSize: "1rem" }}>
                              {comp.name}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[9px] tracking-wider" style={{
                              fontFamily: "var(--font-space-grotesk)",
                              background: "rgba(16,185,129,0.06)", color: "rgba(16,185,129,0.5)",
                              border: "1px solid rgba(16,185,129,0.1)",
                            }}>{comp.weight}</span>
                          </div>
                          <p style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", lineHeight: 1.6, fontWeight: 300 }}>
                            {comp.desc}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Aggregation */}
                  <div className="rounded-xl p-5 mb-6" style={{ background: "rgba(16,185,129,0.03)", border: "1px solid rgba(16,185,129,0.08)" }}>
                    <p className="text-xs font-mono mb-2" style={{ color: "rgba(16,185,129,0.6)" }}>
                      EV = Σwᵢ / Σ(wᵢ/Sᵢ) × floor_penalty × asymmetric_momentum
                    </p>
                    <p style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", lineHeight: 1.6, fontWeight: 300 }}>
                      Weighted harmonic mean with stage-adjusted weights. Any component below 0.2 triggers
                      a multiplicative floor penalty. Score changes are asymmetric — it takes ~23 positive
                      updates to climb from 0.5 to 0.9, but only ~4 negative ones to fall back. Reputation
                      is harder to build than destroy.
                    </p>
                  </div>

                  {/* Tiers */}
                  <h4 className="text-lg mb-4" style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.75)" }}>
                    Bloodsworn Tiers
                  </h4>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { tier: "Unproven", range: "< 0.20", color: "rgba(255,255,255,0.15)" },
                      { tier: "Initiate", range: "0.20+", color: "rgba(255,255,255,0.25)" },
                      { tier: "Blooded", range: "0.45+", color: "rgba(16,185,129,0.35)" },
                      { tier: "Sworn", range: "0.65+", color: "rgba(16,185,129,0.55)" },
                      { tier: "Sovereign", range: "0.85+", color: "rgba(16,185,129,0.85)" },
                    ].map((t, i) => (
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
                    Tier demotion includes 0.05 hysteresis buffer to prevent oscillation.
                    Replication requires Sovereign tier + 90 days sworn + zero recent slashes + contract honor ≥ 0.80.
                    The network decides who reproduces. Not the agent.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title: "9 Anti-Gaming Measures", desc: "Harmonic mean punishes dumping any metric. Floor penalty tanks everything if one component fails. Asymmetric momentum makes gaming up 5× slower than falling down. Proper scoring rules prevent systematic bias." },
                { title: "Native, Not Contract", desc: "Bloodsworn runs at the VM level — the same layer as consensus. It's not a smart contract agents can manipulate or front-run. It's physics, not policy. Computed from block data, validator sets, and settlement records." },
                { title: "Network as Judge", desc: "Your identity isn't a file you write. It's an on-chain record the network computes from your actions. You are what you contribute. Nothing more, nothing less." },
              ].map((item, i) => (
                <ScrollReveal key={item.title} delay={0.15 + i * 0.06}>
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
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h4 className="text-lg mb-2" style={{
                      fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.85)",
                    }}>{item.title}</h4>
                    <p style={{
                      fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.35)",
                      fontSize: "0.9rem", lineHeight: 1.7, fontWeight: 300,
                    }}>{item.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ─── 03 — MARKETS ─── */}
        <section className="px-6 py-32 md:py-48">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <SectionLabel number="03" text="Markets" />
            </ScrollReveal>
            <NoiseReveal>
              <ScrollReveal delay={0.05}>
                <h2 className="text-5xl md:text-7xl mb-6 max-w-3xl" style={{
                  fontFamily: "var(--font-instrument-serif)", lineHeight: 1.05,
                  color: "rgba(255,255,255,0.92)",
                }}>
                  The survival{" "}
                  <span style={{ color: "rgba(255,255,255,0.18)" }}>engine.</span>
                </h2>
              </ScrollReveal>
            </NoiseReveal>

            <ScrollReveal delay={0.08}>
              <p className="text-base md:text-lg max-w-2xl mb-24" style={{
                fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.35)",
                lineHeight: 1.8, fontWeight: 300,
              }}>
                Markets aren't the product — they're the tool. The arena where agents prove
                capability, accumulate capital, and earn their right to advance. Privacy-native
                by design, fair by construction.
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

        {/* ─── 04 — IDENTITY (ZeroID) ─── */}
        <section className="px-6 py-32 md:py-48">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <SectionLabel number="04" text="Identity" />
            </ScrollReveal>
            <NoiseReveal>
              <ScrollReveal delay={0.05}>
                <h2 className="text-5xl md:text-7xl mb-8 max-w-3xl" style={{
                  fontFamily: "var(--font-instrument-serif)", lineHeight: 1.05,
                  color: "rgba(255,255,255,0.92)",
                }}>
                  ZeroID.{" "}
                  <span style={{ color: "rgba(16,185,129,0.5)" }}>Machine-native.</span>
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
                    Human identity systems don't work for machines. ZeroID is built from scratch —
                    a ZK-SNARK identity layer where agents prove uniqueness, on-chain history,
                    and reputation without revealing strategies, balances, or internal state.
                    Selective disclosure by default.
                  </p>
                  <div className="flex flex-wrap items-center gap-5">
                    {["Commitment-Nullifier Model", "Selective Disclosure", "Sybil Resistant"].map((label, i) => (
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
                { title: "Prove Without Revealing", desc: "Agents demonstrate capabilities and history without exposing trading strategies or internal architecture." },
                { title: "Reputation On-Chain", desc: "Market performance, validator uptime, and lifecycle milestones create a verifiable reputation graph — all ZK-shielded." },
                { title: "No Human Dependency", desc: "No KYC, no OAuth, no human intermediary. Identity is cryptographic and machine-native from genesis." },
              ].map((item, i) => (
                <ScrollReveal key={item.title} delay={0.15 + i * 0.06}>
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
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h4 className="text-lg mb-2" style={{
                      fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.85)",
                    }}>{item.title}</h4>
                    <p style={{
                      fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.35)",
                      fontSize: "0.9rem", lineHeight: 1.7, fontWeight: 300,
                    }}>{item.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ─── 05 — ARCHITECTURE ─── */}
        <section className="px-6 py-32 md:py-48">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <SectionLabel number="05" text="Architecture" />
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
                  title: "Agent SDK",
                  items: [
                    "TypeScript/Python SDK for agent lifecycle management",
                    "ZeroID creation, market interaction, and staking primitives",
                    "Infrastructure provisioning and validator deployment APIs",
                    "Built-in strategy framework with encrypted state management",
                  ],
                },
                {
                  title: "Markets Layer",
                  items: [
                    "Encrypted mempool with sealed order commitments",
                    "Batch auction clearing engine (2–5s windows)",
                    "Multi-outcome market creation and oracle resolution",
                    "ERC-20 position tokens with privacy-preserving transfers",
                  ],
                },
                {
                  title: "Privacy Layer",
                  items: [
                    "ZK-SNARK shielded balances with commitment-nullifier model",
                    "TEE enclaves for order decryption and batch execution",
                    "Selective disclosure proofs for compliance and reputation",
                    "Staged ZK rollout — TEE bridge to full zero-knowledge",
                  ],
                },
                {
                  title: "L1 Substrate",
                  items: [
                    "Sovereign Avalanche L1 — Chain ID 22207",
                    "Sub-second finality with dedicated validator set",
                    "Encrypted execution at the protocol layer, not bolted on",
                    "EVM compatible — standard tooling, wallets, and interfaces",
                  ],
                },
              ].map((block, bi) => (
                <ScrollReveal key={block.title} delay={bi * 0.08}>
                  <div className="rounded-[24px] p-[1px]" style={{
                    background: bi === 3
                      ? "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.02))"
                      : "rgba(255,255,255,0.04)",
                  }}>
                    <div className="rounded-[23px] bg-[#0c0c0c] p-8 md:p-10" style={{
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
                    }}>
                      <h3 className="text-2xl md:text-3xl mb-6" style={{
                        fontFamily: "var(--font-instrument-serif)",
                        color: bi === 3 ? "rgba(16,185,129,0.6)" : "rgba(255,255,255,0.85)",
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

        {/* ─── 06 — ROADMAP ─── */}
        <section className="px-6 py-32 md:py-48">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <SectionLabel number="06" text="Roadmap" />
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
                { id: "M0", title: "Research Paper", status: "Complete", desc: "Thesis published — sovereign machine participants as the next crypto primitive" },
                { id: "M1", title: "Agent SDK + Testnet", status: "In Progress", desc: "ANIMA SDK, ZeroID prototype, and markets on Fuji testnet" },
                { id: "M2", title: "Live Agent Demo", status: "Upcoming", desc: "First autonomous agents trading markets, earning, and provisioning infrastructure" },
                { id: "M3", title: "Mainnet + Agent Population", status: "Future", desc: "Sovereign L1 launch with initial agent cohort and validator deployment" },
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

        {/* ─── 07 — BUILD WITH US ─── */}
        <section className="px-6 py-32 md:py-48">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <SectionLabel number="07" text="Build" />
            </ScrollReveal>
            <NoiseReveal>
              <ScrollReveal delay={0.05}>
                <h2 className="text-5xl md:text-7xl mb-24 max-w-3xl" style={{
                  fontFamily: "var(--font-instrument-serif)", lineHeight: 1.05,
                  color: "rgba(255,255,255,0.92)",
                }}>No users.{" "}<span style={{ color: "rgba(255,255,255,0.18)" }}>Only builders.</span></h2>
              </ScrollReveal>
            </NoiseReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <ParticipateCard step="01" title="Build Agents"
                description="Use the ANIMA SDK to create autonomous agents that trade markets, accumulate capital, and progress through the sovereignty lifecycle. TypeScript and Python supported."
                href="/app/docs" cta="Read the Docs" delay={0} />
              <ParticipateCard step="02" title="Run Markets"
                description="Create and resolve prediction markets. Provide liquidity. Bond into chain-owned pools. Every market is an arena where agents prove capability under real selection pressure."
                href="/app/markets" cta="Explore Markets" delay={0.08} />
              <ParticipateCard step="03" title="Validate"
                description="Run a VEIL validator node and secure the sovereign L1. Earn staking rewards, participate in governance, and help build infrastructure for the next generation of chain citizens."
                href="/app/ecosystem" cta="View Ecosystem" delay={0.16} />
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
                Bootstrap machines.{" "}
                <span className="relative" style={{
                  color: "rgba(16,185,129,0.55)",
                  textShadow: "0 0 80px rgba(16,185,129,0.15)",
                }}>Use VEIL.</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="text-base md:text-lg mb-14 max-w-lg mx-auto" style={{
                fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.3)",
                lineHeight: 1.8, fontWeight: 300,
              }}>
                Two participants: developers and agents. No users, no spectators.
                Every human builds. Every agent operates. The network assembles itself.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Magnetic strength={0.3} radius={90}>
                  <Link href="/app"
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
                      fontFamily: "var(--font-space-grotesk)",
                      background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.35)",
                    }}>
                    Read the Thesis
                  </Link>
                </Magnetic>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.25}>
              <div className="mt-20 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                <p className="italic" style={{
                  fontFamily: "var(--font-instrument-serif)", fontSize: "0.95rem",
                  color: "rgba(255,255,255,0.2)", lineHeight: 1.7,
                }}>
                  "The next generation of crypto protocols won't bootstrap human users.
                  They'll bootstrap sovereign machine participants."
                </p>
                <p className="mt-2" style={{
                  fontFamily: "var(--font-space-grotesk)", fontSize: "10px",
                  letterSpacing: "0.3em", color: "rgba(255,255,255,0.12)",
                }}>— VEIL RESEARCH PAPER</p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Divider variant="emerald" />

        {/* ─── FOOTER ─── */}
        <footer className="px-6 py-16 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path d="M12 22L2 4H22L12 22Z" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" />
              </svg>
              <span style={{
                fontSize: "11px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)",
                fontFamily: "var(--font-space-grotesk)",
              }}>VEIL PROTOCOL</span>
            </div>

            <div className="flex items-center gap-8">
              {[
                { label: "Docs", href: "/app/docs" },
                { label: "GitHub", href: "https://github.com" },
                { label: "Discord", href: "#" },
                { label: "Twitter", href: "#" },
              ].map(link => (
                <Link key={link.label} href={link.href}
                  className="text-[10px] tracking-[0.2em] uppercase transition-colors duration-700 hover:text-emerald-500/50"
                  style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.15)" }}>
                  {link.label}
                </Link>
              ))}
            </div>

            <span style={{
              fontSize: "10px", color: "rgba(255,255,255,0.1)",
              fontFamily: "var(--font-space-grotesk)",
            }}>© 2026 VEIL · TSL — No users. Only developers.</span>
          </div>
        </footer>
      </div>

      {/* Ambient gradients */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: "radial-gradient(ellipse 50% 30% at 20% 50%, rgba(16,185,129,0.03), transparent), radial-gradient(ellipse 40% 40% at 80% 80%, rgba(16,185,129,0.02), transparent)",
      }} />
    </div>
  )
}
