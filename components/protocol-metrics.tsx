"use client"

import { useEffect, useState } from "react"
import type { ExplorerStatus } from "@/lib/explorer/types"

function veilAmt(n: number | null | undefined) {
  if (typeof n !== "number" || !Number.isFinite(n)) return "—"
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 2 })}M`
  return n.toLocaleString()
}

function bipsPct(bips: number | null | undefined) {
  if (typeof bips !== "number" || !Number.isFinite(bips)) return "—"
  return `${(bips / 100).toFixed(0)}%`
}

export const VVEIL_POLICY = {
  band: "18–24%",
  point: "22%",
  cap: "30%",
  emission: "≤4%/yr",
  unbond: "14d",
}

export function ProtocolMetrics({ initial = null }: { initial?: ExplorerStatus | null }) {
  const [s, setS] = useState<ExplorerStatus | null>(initial)

  useEffect(() => {
    let dead = false
    const pull = async () => {
      try {
        const r = await fetch("/api/explorer/status", { cache: "no-store" })
        if (!r.ok) return
        const j = (await r.json()) as ExplorerStatus
        if (!dead) setS(j)
      } catch {
        /* keep last */
      }
    }
    void pull()
    const id = window.setInterval(() => void pull(), 8000)
    return () => {
      dead = true
      window.clearInterval(id)
    }
  }, [])

  const t = s?.treasury
  const v = s?.vai
  const f = s?.fees
  const r = s?.reserve
  const cells = [
    { label: "COL locked", value: veilAmt(t?.locked), sub: "treasury vault" },
    { label: "COL deployable", value: veilAmt(t?.live), sub: "live tranche" },
    { label: "COL released", value: veilAmt(t?.released), sub: "tranches out" },
    { label: "VAI debt", value: `${veilAmt(v?.total_debt)} / ${veilAmt(v?.debt_ceiling)}`, sub: "mint vs ceiling" },
    {
      label: "Fee split",
      value: f ? `${bipsPct(f.msrb_bips)} / ${bipsPct(f.col_bips)} / ${bipsPct(f.ops_bips)}` : "70% / 20% / 10%",
      sub: "MSRB / COL / ops",
    },
    {
      label: "Backing",
      value: r ? `${(Number(r.backing_ratio_bips) / 100).toFixed(0)}%` : "—",
      sub: r?.meets_floor ? "floor held" : "floor n/a",
    },
    { label: "vVEIL APY", value: VVEIL_POLICY.point, sub: `band ${VVEIL_POLICY.band} · spec mint` },
    { label: "Unbond", value: VVEIL_POLICY.unbond, sub: `cap ${VVEIL_POLICY.cap}` },
  ]

  return (
    <section aria-label="Staking and treasury metrics">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h2
          className="text-[11px] tracking-[0.2em] uppercase"
          style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(110,231,183,0.8)" }}
        >
          Treasury · COL · stake policy
        </h2>
        <span className="text-[10px]" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.35)" }}>
          COL numbers are on-chain. vVEIL mint is spec (actions 30–34).
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {cells.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl px-4 py-3"
            style={{ background: "rgba(8,16,12,0.72)", border: "1px solid rgba(16,185,129,0.18)" }}
          >
            <div className="text-[10px] tracking-[0.16em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(110,231,183,0.7)" }}>
              {c.label}
            </div>
            <div className="mt-1 truncate text-[20px] tabular-nums" style={{ fontFamily: "var(--font-space-grotesk)", color: "#ecfdf5", fontWeight: 600 }}>
              {c.value}
            </div>
            <div className="mt-1 text-[10px]" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.4)" }}>
              {c.sub}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
