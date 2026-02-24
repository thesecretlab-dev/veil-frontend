"use client"

import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { useRef, type ReactNode } from "react"

/* ═══════════════════════════════════════════════════════════════════════════
   VEIL BRAND SYSTEM — Shared Components
   
   Typography:
     - Headings (h1, h2):   var(--font-instrument-serif)  | white/90
     - Labels, numbers:      var(--font-space-grotesk)     | emerald or white/25
     - Body text:            var(--font-figtree)           | white/35-55, weight 300-400
     - Code:                 var(--font-space-mono)        | emerald/50
   
   Colors:
     - Background:           #060606
     - Primary accent:       emerald (16,185,129)
     - Text hierarchy:       white/92 → white/55 → white/35 → white/25 → white/10
     - Borders:              white/[0.04] → white/[0.06] (hover: emerald/15)
     - Glow:                 emerald shadow 0 0 40-80px at 0.15-0.2 opacity
   
   Spacing:
     - Section padding:      py-24 to py-40
     - Card border radius:   rounded-[20px]
     - Button border radius: rounded-full (primary) or rounded-2xl (secondary)
   
   Buttons:
     - Primary: gradient bg emerald/12 → emerald/06, emerald border, emerald text
     - Secondary: white/06 border, white/35 text, uppercase tracking-[0.2em]
     - Link: emerald/60, underline on hover, → arrow
   ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Film Grain Overlay ─── */
export function FilmGrain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.035]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        mixBlendMode: "overlay",
      }}
    />
  )
}

/* ─── VEIL Logo (Inverted Triangle) ─── */
export function VeilLogo({ size = 20, opacity = 0.3 }: { size?: number; opacity?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: size, height: size }}>
      <path d="M12 22L2 4H22L12 22Z" stroke={`rgba(16,185,129,${opacity})`} strokeWidth="1.5" />
    </svg>
  )
}

/* ─── ScrollReveal ─── */
export function ScrollReveal({
  children, className = "", delay = 0,
}: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Section Label (numbered) ─── */
export function SectionLabel({ number, text }: { number: string; text: string }) {
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

/* ─── Divider ─── */
export function Divider({ variant = "default" }: { variant?: "default" | "emerald" | "wide" }) {
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

/* ─── VEIL Nav Header (matches landing page nav) ─── */
export function VeilHeader({ current }: { current?: string }) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 flex items-center justify-between"
      style={{ background: "linear-gradient(180deg, rgba(6,6,6,0.9) 0%, transparent 100%)" }}
    >
      <Link href="/exploreveil" className="flex items-center gap-3 group">
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
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: current === link.label.toLowerCase() ? "rgba(16,185,129,0.7)" : "rgba(255,255,255,0.3)",
            }}>
            {link.label}
          </Link>
        ))}
        <Link href="/app"
          className="px-5 py-2 rounded-full text-xs tracking-wider transition-all duration-700 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]"
          style={{
            fontFamily: "var(--font-space-grotesk)", fontWeight: 500,
            background: "rgba(16,185,129,0.08)", color: "rgba(16,185,129,0.7)",
            border: "1px solid rgba(16,185,129,0.15)",
          }}>
          Enter Chain
        </Link>
      </div>
    </nav>
  )
}

/* ─── VEIL Footer (canonical) ─── */
export function VeilFooter() {
  return (
    <footer className="px-6 py-16 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <VeilLogo opacity={0.3} />
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
  )
}

/* ─── Page Shell (bg + grain + footer) ─── */
export function VeilPageShell({
  children,
  header = true,
  footer = true,
  grain = true,
  current,
}: {
  children: ReactNode
  header?: boolean
  footer?: boolean
  grain?: boolean
  current?: string
}) {
  return (
    <div className="relative min-h-screen" style={{ background: "#060606", color: "white" }}>
      {grain && <FilmGrain />}
      {header && <VeilHeader current={current} />}
      {children}
      {footer && <VeilFooter />}
    </div>
  )
}
