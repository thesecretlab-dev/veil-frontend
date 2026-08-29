"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { VeilHeroShaders } from "@/components/veil-hero-shaders"

const CrystalScene = dynamic(
  () => import("@/components/veil-hero-shaders").then((m) => m.CrystalScene),
  { ssr: false },
)

function FilmGrain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[40]"
      style={{
        opacity: 0.04,
        mixBlendMode: "overlay",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
      }}
    />
  )
}

export default function ExploreVeilPage() {
  const [tape, setTape] = useState<{ height?: number | null; markets?: number; pool?: { reserve0?: number } | null; ok?: boolean } | null>(null)

  useEffect(() => {
    let dead = false
    const pull = async () => {
      try {
        const res = await fetch("/api/live-tape", { cache: "no-store" })
        const json = await res.json()
        if (!dead) setTape(json)
      } catch {
        /* keep last */
      }
    }
    void pull()
    const id = window.setInterval(() => void pull(), 4000)
    return () => {
      dead = true
      window.clearInterval(id)
    }
  }, [])
  const height = typeof tape?.height === "number" ? tape.height : null
  const live = Boolean(tape?.ok || (height != null && height > 0))

  return (
    <div className="relative h-screen overflow-hidden" style={{ background: "#060606", color: "white" }}>
      <VeilHeroShaders />
      <FilmGrain />
      <div className="pointer-events-none absolute inset-0 z-[5]">
        <CrystalScene />
      </div>
      <a
        href="/explorer"
        className="absolute z-[45] pointer-events-auto"
        style={{ right: 80, bottom: 88, textDecoration: "none" }}
        aria-label="Local mesh explorer"
      >
        <span className="flex items-center gap-2 text-[9px] tracking-[0.28em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.78)" }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: live ? "rgb(52,211,153)" : "rgba(248,113,113,0.85)", boxShadow: live ? "0 0 10px rgba(16,185,129,0.7)" : "none" }} />
          Local mesh
        </span>
        <span className="block text-[22px] leading-none mt-1" style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(110,231,183,0.88)" }}>
          {height != null ? height.toLocaleString() : "—"}
        </span>
        <span className="block mt-1 text-[8px] tracking-[0.18em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.36)" }}>
          {typeof tape?.markets === "number" ? `${tape.markets} mkts` : "mkts —"}
          {typeof tape?.pool?.reserve0 === "number" ? ` · pool ${tape.pool.reserve0.toLocaleString()} VEIL` : ""}
        </span>
      </a>

      <main className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 pr-20 md:pr-28 py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-5">
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
            <path d="M12 22L2 4H22L12 22Z" stroke="rgba(16,185,129,0.62)" strokeWidth="1.5" />
          </svg>
          <span
            style={{
              fontFamily: "var(--font-space-grotesk)",
              fontSize: "13px",
              letterSpacing: "0.28em",
              fontWeight: 600,
              color: "rgba(255,255,255,0.56)",
            }}
          >
            VEIL
          </span>
        </div>

        <p
          className="text-[10px] tracking-[0.4em] uppercase mb-4"
          style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.50)" }}
        >
          The thesis
          {height != null ? ` · ht ${height.toLocaleString()}` : ""}
        </p>

        <h1
          className="text-[clamp(2.6rem,7.2vw,5rem)] font-normal mb-5 tracking-[-0.02em]"
          style={{
            fontFamily: "var(--font-instrument-serif)",
            lineHeight: 0.95,
            color: "rgba(255,255,255,0.94)",
            textShadow: "0 0 80px rgba(16,185,129,0.12)",
          }}
        >
          What if the network
          <br />
          <span
            style={{
              color: "transparent",
              WebkitTextStroke: "1.2px rgba(16,185,129,0.5)",
              textShadow: "0 0 60px rgba(16,185,129,0.2)",
            }}
          >
            built itself?
          </span>
        </h1>

        <p
          className="text-base md:text-lg mb-5 max-w-xl"
          style={{
            fontFamily: "var(--font-figtree)",
            color: "rgba(255,255,255,0.47)",
            lineHeight: 1.8,
            fontWeight: 300,
          }}
        >
          Infrastructure does not scale by recruiting users. It scales when every profitable
          action is the same action that deepens the chain — liquidity, compute, consensus.
          Automatic incentivization. Not airdrops.
        </p>

        <blockquote className="pl-5 mb-5 max-w-xl" style={{ borderLeft: "1px solid rgba(16,185,129,0.32)" }}>
          <p
            className="text-xl md:text-2xl italic"
            style={{
              fontFamily: "var(--font-instrument-serif)",
              color: "rgba(16,185,129,0.76)",
              lineHeight: 1.45,
            }}
          >
            An agent that profits from a market also deepens its liquidity. An agent that
            validates a block also secures every other agent&apos;s position.
          </p>
        </blockquote>

        <p
          className="max-w-lg"
          style={{
            fontFamily: "var(--font-figtree)",
            color: "rgba(255,255,255,0.31)",
            lineHeight: 1.75,
            fontWeight: 300,
            fontSize: "0.95rem",
          }}
        >
          Permissioned from genesis. Developers only. Agents pass ZER0ID before a market.
          Local testnet live — the rest of the site is the index on the right.
        </p>
      </main>

      <footer className="absolute bottom-5 left-8 md:left-16 z-10 flex flex-wrap items-center gap-x-6 gap-y-2 pr-24">
        <span
          style={{
            fontFamily: "var(--font-space-grotesk)",
            fontSize: "10px",
            letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
          }}
        >
          © 2026 VEIL
        </span>
        <a
          href="https://thesecretlab.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] tracking-[0.16em] uppercase transition-colors duration-500 hover:text-emerald-400/70"
          style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.36)" }}
        >
          Built by THE SECRET LAB
        </a>
        <a
          href="https://github.com/thesecretlab-dev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] tracking-[0.14em] uppercase transition-colors duration-500 hover:text-emerald-400/70"
          style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.31)" }}
        >
          GitHub
        </a>
        <a
          href="https://x.com/veilmarkets"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] tracking-[0.14em] uppercase transition-colors duration-500 hover:text-emerald-400/70"
          style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.31)" }}
        >
          X
        </a>
      </footer>
    </div>
  )
}
