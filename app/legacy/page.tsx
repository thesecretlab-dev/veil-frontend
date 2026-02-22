"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import ShaderBackground from "@/components/shader-background"
import MusicPlayer from "@/components/music-player"
import TriangleLogo from "@/components/triangle-logo"
import ProblemSection from "@/components/problem-section"
import SolutionSection from "@/components/solution-section"
import PrinciplesSection from "@/components/principles-section"
import ArchitectureSection from "@/components/architecture-section"
import RoadmapSection from "@/components/roadmap-section"
import CTASection from "@/components/cta-section"
import Footer from "@/components/footer"
import Link from "next/link"
import SmokeText from "@/components/smoke-text"
import SmoothScroll from "@/components/smooth-scroll"
import VeilCursor from "@/components/veil-cursor"
import FilmGrain from "@/components/film-grain"
import Magnetic from "@/components/magnetic"
import VeilPreloader from "@/components/veil-preloader"

/* ── Build Games Badge with fireworks ── */
function BuildGamesBadge() {
  const [hovered, setHovered] = useState(false)
  const [particles, setParticles] = useState<Array<{id:number;x:number;y:number;angle:number;speed:number;size:number;hue:number;delay:number}>>([])
  const counter = useRef(0)

  useEffect(() => {
    if (!hovered) return
    // Burst of particles on hover
    const burst: typeof particles = []
    for (let i = 0; i < 28; i++) {
      burst.push({
        id: counter.current++,
        x: 50 + (Math.random() - 0.5) * 20,
        y: 50 + (Math.random() - 0.5) * 10,
        angle: Math.random() * 360,
        speed: 40 + Math.random() * 80,
        size: 1.5 + Math.random() * 3,
        hue: Math.random() > 0.5 ? 0 + Math.random() * 20 : 200 + Math.random() * 40, // red or ice-blue
        delay: Math.random() * 0.3,
      })
    }
    setParticles(burst)
    const t = setTimeout(() => setParticles([]), 1600)
    return () => clearTimeout(t)
  }, [hovered])

  return (
    <motion.div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.04 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Firework particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute pointer-events-none rounded-full"
          style={{
            width: p.size, height: p.size,
            left: `${p.x}%`, top: `${p.y}%`,
            background: `hsl(${p.hue}, 90%, 65%)`,
            boxShadow: `0 0 ${p.size * 3}px hsl(${p.hue}, 90%, 55%), 0 0 ${p.size * 6}px hsl(${p.hue}, 80%, 45%)`,
          }}
          initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
          animate={{
            x: Math.cos(p.angle * Math.PI / 180) * p.speed,
            y: Math.sin(p.angle * Math.PI / 180) * p.speed - 15,
            scale: [0, 1.5, 0],
            opacity: [1, 0.9, 0],
          }}
          transition={{ duration: 0.8 + Math.random() * 0.6, delay: p.delay, ease: "easeOut" }}
        />
      ))}

      {/* Badge */}
      <div
        className="inline-flex items-center gap-3 rounded-full px-6 py-2.5 overflow-hidden"
        style={{
          background: hovered ? "rgba(220,38,38,0.06)" : "rgba(255,255,255,0.02)",
          border: `1px solid ${hovered ? "rgba(220,38,38,0.25)" : "rgba(255,255,255,0.06)"}`,
          backdropFilter: "blur(10px)",
          transition: "all 1.5s ease",
          boxShadow: hovered
            ? "0 0 30px rgba(220,38,38,0.12), 0 0 60px rgba(220,38,38,0.05), inset 0 0 20px rgba(220,38,38,0.03)"
            : "none",
        }}
      >
        {/* Pulsing dot — red */}
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
            style={{ background: "rgba(220,38,38,0.5)" }} />
          <span className="relative inline-flex rounded-full h-2 w-2"
            style={{ background: "rgba(220,38,38,0.8)" }} />
        </span>

        {/* Text — icy red with frost shimmer */}
        <span style={{
          fontSize: "11.5px",
          letterSpacing: "0.25em",
          fontFamily: "var(--font-space-grotesk)",
          fontWeight: 500,
          color: hovered ? "rgba(248,113,113,0.95)" : "rgba(220,38,38,0.65)",
          textShadow: hovered
            ? "0 0 8px rgba(220,38,38,0.4), 0 0 20px rgba(220,38,38,0.2), 0 0 40px rgba(147,197,253,0.15)"
            : "0 0 6px rgba(220,38,38,0.15)",
          transition: "all 1.5s ease",
        }}>
          AVALANCHE BUILD GAMES 2026
        </span>

        {/* Ice crystal accents */}
        {hovered && (
          <>
            <motion.span className="absolute -top-1 left-1/4 text-[6px] pointer-events-none"
              initial={{ opacity: 0, y: 4, scale: 0 }}
              animate={{ opacity: [0, 0.6, 0], y: -8, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.1 }}
              style={{ color: "rgba(147,197,253,0.6)" }}
            >{"\u2744"}</motion.span>
            <motion.span className="absolute -top-2 right-1/3 text-[5px] pointer-events-none"
              initial={{ opacity: 0, y: 4, scale: 0 }}
              animate={{ opacity: [0, 0.5, 0], y: -10, scale: 1.2 }}
              transition={{ duration: 1.4, delay: 0.3 }}
              style={{ color: "rgba(186,230,253,0.5)" }}
            >{"\u2744"}</motion.span>
            <motion.span className="absolute -bottom-1 right-1/4 text-[4px] pointer-events-none"
              initial={{ opacity: 0, y: -2, scale: 0 }}
              animate={{ opacity: [0, 0.4, 0], y: 6, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{ color: "rgba(147,197,253,0.4)" }}
            >{"\u2744"}</motion.span>
          </>
        )}
      </div>
    </motion.div>
  )
}

/* ── Scroll-triggered reveal wrapper ── */
function ScrollReveal({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 1, delay, ease: [0.25, 0.46, 0.45, 0.94] }}>
      {children}
    </motion.div>
  )
}

/* ── Section divider ── */
function Divider({ variant = "default" }: { variant?: "default" | "emerald" | "wide" }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const width = variant === "wide" ? "w-64" : variant === "emerald" ? "w-40" : "w-24"
  const bg = variant === "emerald"
    ? "linear-gradient(90deg, transparent, rgba(16,185,129,0.2), transparent)"
    : variant === "wide"
    ? "linear-gradient(90deg, transparent, rgba(16,185,129,0.1), rgba(255,255,255,0.04), rgba(16,185,129,0.1), transparent)"
    : "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)"
  return (
    <motion.div ref={ref} className={`mx-auto h-px ${width} my-4`}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={inView ? { scaleX: 1, opacity: 1 } : {}}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      style={{ background: bg }}
    />
  )
}

/* ── Section label ── */
function SectionLabel({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex items-center justify-center gap-3 pb-2">
      <span style={{
        fontSize: "9px", letterSpacing: "0.4em", color: "rgba(16,185,129,0.35)",
        fontFamily: "var(--font-space-grotesk)", fontWeight: 600,
      }}>{number}</span>
      <span style={{ width: "20px", height: "1px", background: "rgba(16,185,129,0.1)" }} />
      <span style={{
        fontSize: "8px", letterSpacing: "0.4em", color: "rgba(255,255,255,0.26)",
        fontFamily: "var(--font-space-grotesk)",
      }}>{text}</span>
    </div>
  )
}

/* ── Noise-to-clear section wrapper ── */
function NoiseReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.3"],
  })
  const blur = useTransform(scrollYProgress, [0, 1], [6, 0])
  const grain = useTransform(scrollYProgress, [0, 1], [0.15, 0])
  
  return (
    <motion.div ref={ref} className={`relative ${className}`} style={{ filter: useTransform(blur, v => `blur(${v}px)`) }}>
      {children}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          opacity: grain,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "128px 128px",
        }}
      />
    </motion.div>
  )
}

export default function ShaderShowcase() {
  const [loaded, setLoaded] = useState(false)
  const onPreloaderComplete = useCallback(() => setLoaded(true), [])
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.08], [1, 0.96])
  const heroY = useTransform(scrollYProgress, [0, 0.1], [0, -50])
  // Parallax for hero elements
  const badgeY = useTransform(scrollYProgress, [0, 0.1], [0, -20])
  const quoteY = useTransform(scrollYProgress, [0, 0.1], [0, 30])

  return (
    <div className="relative w-full min-h-screen veil-custom-cursor landing-readable">
      <SmoothScroll />
      <VeilCursor />
      <FilmGrain />
      <VeilPreloader onComplete={onPreloaderComplete} />

      <ShaderBackground />
      <div className="veil-readability-scrim pointer-events-none absolute inset-0 z-[1]" />

      {/* ── Scroll progress bar ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[1px] z-[100] origin-left"
        style={{
          scaleX: scrollYProgress,
          background: "linear-gradient(90deg, rgba(16,185,129,0.3), rgba(16,185,129,0.6), rgba(16,185,129,0.3))",
          boxShadow: "0 0 8px rgba(16,185,129,0.3)",
        }}
      />

      {/* ── Launch App ── */}
      <Magnetic strength={0.4} radius={100}>
        <Link
          href="/app"
          className="veil-launch-btn fixed top-8 right-8 z-50 flex items-center gap-2.5 px-5 py-2.5 rounded-full"
        >
          <span className="veil-launch-dot" />
          <span className="veil-launch-text">Launch App</span>
          <span className="veil-launch-arrow">{"\u2192"}</span>
        </Link>
      </Magnetic>

      {/* ── Nav / Logo ── */}
      <div className="fixed top-8 left-8 pointer-events-auto z-50 flex items-center gap-4">
        <Magnetic strength={0.25} radius={80}>
          <Link href="/lab" className="flex items-center gap-1.5 group/tsl" style={{ transition: "all 1.5s ease" }}>
            <img src="/tsl-logo.png" alt="" className="h-4 w-4 invert opacity-[0.28] group-hover/tsl:opacity-40" style={{ transition: "opacity 1.5s ease" }} />
            <span style={{
              fontSize: "9px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.44)",
              fontFamily: "var(--font-space-grotesk)", transition: "color 1.5s ease",
            }} className="group-hover/tsl:!text-white/15">tsl</span>
          </Link>
        </Magnetic>
        <span style={{ color: "rgba(255,255,255,0.42)", fontSize: "10px" }}>/</span>
        <Magnetic strength={0.25} radius={80}>
          <div className="flex items-center gap-2.5">
            <TriangleLogo />
            <span style={{
              fontSize: "13px", letterSpacing: "0.25em", color: "rgba(255,255,255,0.56)",
              fontFamily: "var(--font-space-grotesk)", fontWeight: 600,
              textShadow: "0 0 16px rgba(16,185,129,0.2)", transition: "all 1.5s ease",
            }}>VEIL</span>
          </div>
        </Magnetic>
      </div>

      {/* ══════════ HERO ══════════ */}
      <motion.div className="relative z-10 flex flex-col items-center justify-center min-h-screen group veil-adaptive-text"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}>

        {/* Build Games badge — parallax offset */}
        <motion.div className="mb-6" style={{ y: badgeY }}
          initial={{ opacity: 0, y: 15 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}>
          <BuildGamesBadge />
        </motion.div>

        <motion.h1
          className="text-[16vw] md:text-[18vw] font-bold tracking-[0.3em] select-none cursor-default veil-adaptive-text--hero"
          initial={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
          animate={loaded ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
          transition={{ delay: 0.1, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "var(--font-space-grotesk)",
            color: "rgba(255, 255, 255, 0.56)",
            textShadow: "0 0 18px rgba(16,185,129,0.22), 0 0 36px rgba(16,185,129,0.12), 0 2px 6px rgba(0,0,0,0.45)",
            WebkitTextStroke: "1px rgba(16,185,129,0.18)",
            transition: "color 1.5s ease, text-shadow 1.5s ease",
          }}
          whileHover={{
            color: "rgba(255,255,255,0.40)",
            textShadow: "0 0 20px rgba(16,185,129,0.35), 0 0 40px rgba(16,185,129,0.2), 0 0 80px rgba(16,185,129,0.1)",
          }}
        >
          VEIL
        </motion.h1>

        {/* Quote — parallax offset (slower) */}
        <motion.div style={{ y: quoteY }}
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 1 }}>
          <SmokeText
            text={'"Privacy is necessary for an open society in the electronic age."'}
            author={"\u2014 Eric Hughes, A Cypherpunk\u2019s Manifesto (1993)"}
          />
        </motion.div>

        {/* Scroll hint */}
        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : {}}
          transition={{ delay: 2, duration: 1 }}>
          <motion.div
            animate={{ y: [0, 6, 0], opacity: [0.20, 0.35, 0.20] }}
            transition={{ duration: 3, repeat: Infinity }}>
            <div className="w-5 h-8 rounded-full border border-white/[0.08] flex items-start justify-center p-1.5">
              <motion.div className="w-1 h-1.5 rounded-full bg-emerald-500/30"
                animate={{ y: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity }} />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ══════════ CONTENT SECTIONS ══════════ */}
      <div className="relative z-10 veil-adaptive-text">

        <Divider variant="emerald" />

        {/* 01 — FRICTION */}
        <ScrollReveal>
          <SectionLabel number="01" text="THE PROBLEM" />
        </ScrollReveal>
        <NoiseReveal>
          <ScrollReveal delay={0.1}>
            <ProblemSection />
          </ScrollReveal>
        </NoiseReveal>

        <Divider />

        {/* 02 — SOLUTIONS */}
        <ScrollReveal>
          <SectionLabel number="02" text="THE ANSWER" />
        </ScrollReveal>
        <NoiseReveal>
          <ScrollReveal delay={0.1}>
            <SolutionSection />
          </ScrollReveal>
        </NoiseReveal>

        <Divider variant="emerald" />

        {/* 03 — PRINCIPLES */}
        <ScrollReveal>
          <SectionLabel number="03" text="CORE TENETS" />
        </ScrollReveal>
        <NoiseReveal>
          <ScrollReveal delay={0.1}>
            <PrinciplesSection />
          </ScrollReveal>
        </NoiseReveal>

        <Divider />

        {/* 04 — ARCHITECTURE */}
        <ScrollReveal>
          <SectionLabel number="04" text="UNDER THE HOOD" />
        </ScrollReveal>
        <NoiseReveal>
          <ScrollReveal delay={0.1}>
            <ArchitectureSection />
          </ScrollReveal>
        </NoiseReveal>

        <Divider variant="wide" />

        {/* 05 — PROGRESS */}
        <ScrollReveal>
          <SectionLabel number="05" text="ROADMAP" />
        </ScrollReveal>
        <NoiseReveal>
          <ScrollReveal delay={0.1}>
            <RoadmapSection />
          </ScrollReveal>
        </NoiseReveal>

        <Divider variant="emerald" />

        {/* 06 — CTA */}
        <ScrollReveal>
          <CTASection />
        </ScrollReveal>

        <Divider />

        <Footer />
      </div>

      <MusicPlayer />
    </div>
  )
}
