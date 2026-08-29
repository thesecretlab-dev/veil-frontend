"use client"

import type { ReactNode } from "react"
import Link from "next/link"


function FilmGrain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{
        opacity: 0.035,
        mixBlendMode: "overlay",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
      }}
    />
  )
}

function TriangleMark({ className = "w-6 h-6", stroke = "rgba(16,185,129,0.45)" }: { className?: string; stroke?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 22L2 4H22L12 22Z" stroke={stroke} strokeWidth="1.5" />
    </svg>
  )
}

export function ExplorerShell({
  children,
  current = "explorer",
}: {
  children: ReactNode
  current?: "explorer" | "home"
}) {
  return (
    <div className="relative min-h-screen" style={{ background: "#060606", color: "white", overflowX: "hidden" }}>
      <FilmGrain />

      <nav
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 flex items-center justify-between"
        style={{ background: "linear-gradient(180deg, rgba(6,6,6,0.9) 0%, transparent 100%)" }}
      >
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-6 h-6 relative">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path
                d="M12 22L2 4H22L12 22Z"
                stroke="rgba(16,185,129,0.45)"
                strokeWidth="1.5"
                className="group-hover:stroke-emerald-400/60 transition-all duration-700"
              />
            </svg>
          </div>
          <span
            className="group-hover:text-white/[0.78] transition-colors duration-700"
            style={{
              fontSize: "13px",
              letterSpacing: "0.25em",
              color: "rgba(255,255,255,0.56)",
              fontFamily: "var(--font-space-grotesk)",
              fontWeight: 600,
            }}
          >
            VEIL
          </span>
        </Link>
        <div />
      </nav>

      <div className="relative z-10">{children}</div>

      <footer className="relative z-10 px-6 py-16 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <TriangleMark className="w-5 h-5" stroke="rgba(16,185,129,0.34)" />
              <span
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  fontSize: "12px",
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,0.22)",
                }}
              >
                VEIL
              </span>
            </div>
            <div className="flex items-center gap-8 flex-wrap justify-center">
              {[
                { label: "Markets", href: "/app/markets" },
                { label: "Agents", href: "/app/agents" },
                { label: "DeFi", href: "/app/defi" },
                { label: "Explorer", href: "/explorer" },
                { label: "Gov", href: "/app/gov" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[11px] tracking-[0.15em] uppercase transition-colors duration-500 hover:text-emerald-400/50"
                  style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.22)" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <p
              style={{
                fontFamily: "var(--font-space-grotesk)",
                fontSize: "10px",
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.25)",
              }}
            >
              © 2026 VEIL
            </p>
            <Link
              href="https://thesecretlab.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] tracking-[0.16em] uppercase transition-colors duration-500 hover:text-emerald-400/70"
              style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.39)" }}
            >
              Built by THE SECRET LAB
            </Link>
            <Link
              href="https://github.com/thesecretlab-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] tracking-[0.14em] uppercase transition-colors duration-500 hover:text-emerald-400/70"
              style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.31)" }}
            >
              GitHub
            </Link>
          </div>
        </div>
      </footer>

      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.015) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.01) 0%, transparent 70%)" }}
        />
      </div>
    </div>
  )
}

export function SectionLabel({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span
        style={{
          fontSize: "9px",
          letterSpacing: "0.4em",
          color: "rgba(16,185,129,0.45)",
          fontFamily: "var(--font-space-grotesk)",
          fontWeight: 600,
        }}
      >
        {number}
      </span>
      <span style={{ width: "20px", height: "1px", background: "rgba(16,185,129,0.15)" }} />
      <span
        style={{
          fontSize: "8px",
          letterSpacing: "0.4em",
          color: "rgba(255,255,255,0.22)",
          fontFamily: "var(--font-space-grotesk)",
          textTransform: "uppercase",
        }}
      >
        {text}
      </span>
    </div>
  )
}
