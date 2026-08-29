"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { VeilFooter, VeilHeader, FilmGrain } from "@/components/brand"
import { FlowNext } from "@/components/flow-next"

type Check = { id: string; ok: boolean; detail: string }

type Stack = {
  ok?: boolean
  readyForUsers?: boolean
  error?: string
  blockHeight?: number | null
  profile?: {
    profile?: string
    parked?: boolean
    claims?: Record<string, boolean>
    notes?: string[]
    doNotDeployUnder?: string
    contact?: string
  }
  veilvm?: { healthy?: boolean; chainId?: string; height?: number | null; nodeId?: string; node?: string }
  companion?: { ok?: boolean; chainId?: number | null; expectedChainId?: number }
  identity?: { deployed?: boolean; registry?: string | null }
  mesh?: { ok?: boolean; http?: string }
  router?: { ok?: boolean; markets?: number; proverReady?: boolean }
  checks?: Check[]
  failed?: string[]
}

export default function NetworkPage() {
  const [stack, setStack] = useState<Stack | null>(null)

  useEffect(() => {
    let dead = false
    const pull = async () => {
      try {
        const j = (await fetch("/api/status", { cache: "no-store" }).then((r) => r.json())) as Stack
        if (!dead) setStack(j)
      } catch {
        if (!dead) setStack({ ok: false, readyForUsers: false, error: "status unreachable" })
      }
    }
    void pull()
    const id = window.setInterval(() => void pull(), 4000)
    return () => {
      dead = true
      window.clearInterval(id)
    }
  }, [])

  const ready = Boolean(stack?.readyForUsers)
  const checks = stack?.checks || []

  return (
    <div className="relative min-h-screen" style={{ background: "#060606", color: "white", paddingRight: 48 }}>
      <FilmGrain />
      <VeilHeader />
      <main className="relative z-10 mx-auto max-w-5xl px-8 pt-36 pb-16">
        <p className="mb-4 text-[10px] tracking-[0.4em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.7)" }}>
          THE SECRET LAB · stack
        </p>
        <h1 className="mb-5 text-5xl md:text-6xl font-light" style={{ fontFamily: "var(--font-instrument-serif)", letterSpacing: "-0.03em" }}>
          Network
        </h1>
        <p className="mb-8 max-w-2xl text-lg font-light leading-relaxed" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.53)" }}>
          What this node is actually running. Local ≠ Fuji ≠ mainnet. No invented peers.
        </p>

        <div
          className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl px-5 py-4"
          style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.025)" }}
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{
              background: ready ? "rgb(52,211,153)" : "rgba(248,113,113,0.85)",
              boxShadow: ready ? "0 0 10px rgba(16,185,129,0.7)" : "none",
            }}
          />
          <span style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {ready ? "Ready for local users" : stack?.error || "Not ready"}
          </span>
          <span className="text-[13px]" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.42)" }}>
            profile {stack?.profile?.profile || "local"} · ht {stack?.veilvm?.height?.toLocaleString() ?? "—"}
          </span>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {checks.map((c) => (
            <div key={c.id} className="rounded-2xl px-5 py-4" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: c.ok ? "rgba(110,231,183,0.9)" : "rgba(248,113,113,0.85)" }}>
                {c.ok ? "up" : "down"} · {c.id}
              </p>
              <p className="mt-2 text-[14px]" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.72)" }}>
                {c.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl px-5 py-4 font-mono text-[12px]" style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}>
            <div>VeilVM {stack?.veilvm?.chainId || "—"}</div>
            <div className="mt-1">Node {stack?.veilvm?.nodeId || "—"}</div>
            <div className="mt-1">{stack?.veilvm?.node || "—"}</div>
            <div className="mt-3">Companion {stack?.companion?.chainId ?? "—"} / {stack?.companion?.expectedChainId ?? 31337}</div>
            <div className="mt-1 break-all">ZER0ID {stack?.identity?.registry || "—"}</div>
            <div className="mt-1">Mesh {stack?.mesh?.http || "—"}</div>
            <div className="mt-1">Router books {stack?.router?.markets ?? 0} · prover {stack?.router?.proverReady ? "ready" : "cold"}</div>
          </div>
          <div className="rounded-2xl px-5 py-4" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="mb-3 text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.72)" }}>
              Not claimed
            </p>
            <ul className="space-y-1.5 text-[13px]" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.48)" }}>
              <li>Private mempool from AES or t=1</li>
              <li>In-circuit matching</li>
              <li>Public explorer DNS / Blockscout</li>
              <li>KYC camera · OFAC live feed</li>
              <li>VeilVM registerIdentity</li>
              <li>2000 AVAX primary stake</li>
              <li>Lost owner {stack?.profile?.doNotDeployUnder || "0xB9a05AFC…"} — do not deploy under</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          <Link href="/mesh" style={{ color: "rgba(16,185,129,0.82)" }}>Mesh →</Link>
          <Link href="/explorer" style={{ color: "rgba(255,255,255,0.5)" }}>Explorer</Link>
          <Link href="/app/zeroid" style={{ color: "rgba(255,255,255,0.5)" }}>ZER0ID</Link>
          <Link href="/app" style={{ color: "rgba(255,255,255,0.5)" }}>Markets</Link>
        </div>
      </main>
      <FlowNext />
      <VeilFooter />
    </div>
  )
}
