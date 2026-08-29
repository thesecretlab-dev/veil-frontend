"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

type Tick = { t: string; kind: string; text: string; hash?: string }

type Tape = {
  ok: boolean
  markets: number
  height: number | null
  proverReady: boolean
  pool: { reserve0?: number; reserve1?: number; total_lp?: number } | null
  ticks: Tick[]
}

const KIND_COLOR: Record<string, string> = {
  swap: "rgba(16,185,129,0.95)",
  lp: "rgba(52,211,153,0.8)",
  order: "rgba(251,191,36,0.85)",
  clear: "rgba(125,211,252,0.9)",
  vai: "rgba(245,158,11,0.85)",
  fee: "rgba(167,139,250,0.85)",
  fail: "rgba(248,113,113,0.9)",
  sys: "rgba(255,255,255,0.39)",
}

function shortHash(h?: string) {
  if (!h) return ""
  return `${h.slice(0, 6)}…${h.slice(-4)}`
}

export function LiveChainTape() {
  const [tape, setTape] = useState<Tape | null>(null)

  useEffect(() => {
    let dead = false
    const load = async () => {
      try {
        const res = await fetch("/api/live-tape", { cache: "no-store" })
        const json = (await res.json()) as Tape
        if (!dead) setTape(json)
      } catch {
        if (!dead) setTape(null)
      }
    }
    void load()
    const id = setInterval(() => void load(), 3000)
    return () => {
      dead = true
      clearInterval(id)
    }
  }, [])

  const ticks = (tape?.ticks || []).slice(0, 6)
  const pool = tape?.pool

  return (
    <div
      className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden text-left"
      style={{
        background: "rgba(8,12,10,0.72)",
        border: "1px solid rgba(16,185,129,0.18)",
        boxShadow: "0 0 40px rgba(16,185,129,0.08)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="flex flex-wrap items-center gap-3 px-5 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <span className="relative flex h-2.5 w-2.5">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-40"
            style={{
              background:
                tape == null || tape.ok || (tape.height ?? 0) > 0 ? "rgb(16,185,129)" : "rgb(248,113,113)",
            }}
          />
          <span
            className="relative inline-flex h-2.5 w-2.5 rounded-full"
            style={{
              background:
                tape == null || tape.ok || (tape.height ?? 0) > 0 ? "rgb(52,211,153)" : "rgb(248,113,113)",
            }}
          />
        </span>
        <span
          className="text-[10px] tracking-[0.28em] uppercase"
          style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.84)" }}
        >
          {tape == null
            ? "Syncing local chain"
            : tape.ok || (tape.height ?? 0) > 0
              ? "Local chain live"
              : "Chain offline"}
        </span>
        <span className="ml-auto text-[11px] tabular-nums" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.45)" }}>
          ht {tape?.height ?? "—"} · {tape?.markets ?? 0} mkts
          {tape?.proverReady ? " · prover" : ""}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-0 px-5 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        {[
          { k: "VEIL", v: pool?.reserve0 },
          { k: "VAI", v: pool?.reserve1 },
          { k: "LP", v: pool?.total_lp },
        ].map((row) => (
          <div key={row.k} className="text-center">
            <div className="text-lg tabular-nums" style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.9)" }}>
              {typeof row.v === "number" ? row.v.toLocaleString() : "—"}
            </div>
            <div className="text-[9px] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.31)" }}>
              pool {row.k}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 space-y-1.5 min-h-[148px] font-mono text-[11px]">
        <AnimatePresence initial={false}>
          {ticks.length === 0 && (
            <div style={{ color: "rgba(255,255,255,0.31)" }}>waiting for tape…</div>
          )}
          {ticks.map((tick) => (
            <motion.div
              key={`${tick.t}-${tick.hash || tick.text}`}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-baseline gap-2"
            >
              <span style={{ color: "rgba(255,255,255,0.25)" }}>{tick.t.slice(11, 19)}</span>
              <span style={{ color: KIND_COLOR[tick.kind] || "rgba(255,255,255,0.56)" }}>{tick.text}</span>
              {tick.hash && (
                <span style={{ color: "rgba(255,255,255,0.31)" }}>{shortHash(tick.hash)}</span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
