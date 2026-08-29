"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FilmGrain, VeilFooter, VeilHeader } from "@/components/brand"
import { FlowNext } from "@/components/flow-next"
import { ZeroidConsole } from "@/components/zeroid/console"

const STEPS = [
  { n: "01", title: "Secret", body: "This device hashes a 32-byte secret into tagged SHA-256 commitment and nullifier. The secret never leaves the browser." },
  { n: "02", title: "Issue", body: "Mesh HMAC-signs the 8004 credential on this node. Same domain separation as VeilVM digest-binding." },
  { n: "03", title: "Registry", body: "Nullifier uniqueness is written to the companion contract on anvil 31337. Duplicate issue fails closed." },
]

type CatalogLead = {
  groth16WasmServed?: boolean
  companion?: { deployed?: boolean; registry?: string | null; chainCount?: number | null }
}

function shortHex(h: string, n = 4) {
  if (!h) return "—"
  if (h.length <= n * 2 + 3) return h
  return `${h.slice(0, n + 2)}…${h.slice(-n)}`
}

export default function ZeroidPage() {
  const [catalog, setCatalog] = useState<CatalogLead | null>(null)

  useEffect(() => {
    let dead = false
    const pull = () =>
      fetch("/api/zeroid", { cache: "no-store" })
        .then((r) => r.json())
        .then((j) => {
          if (!dead) setCatalog(j as CatalogLead)
        })
        .catch(() => {})
    void pull()
    const id = window.setInterval(() => void pull(), 8000)
    return () => {
      dead = true
      window.clearInterval(id)
    }
  }, [])

  const served = Boolean(catalog?.groth16WasmServed)
  const deployed = Boolean(catalog?.companion?.deployed)
  const registry = catalog?.companion?.registry || ""
  const lead = !catalog
    ? "Type 8004. Commitment-nullifier identity for this node. HMAC-issued here, unique on the companion registry. Groth16 probe loading…"
    : served
      ? `Type 8004. HMAC-issued here, unique on companion registry ${deployed ? shortHex(registry) : "(probing)"}. Local Groth16 wasm/zkey served from /circuits. Setup is local, not a public ceremony. No KYC camera.`
      : "Type 8004. HMAC-issued here, unique on the companion registry. Groth16 wasm/zkey not on disk yet. HMAC 8004 still issues L1 uniqueness. No KYC camera."

  return (
    <div className="relative min-h-screen" style={{ background: "#060606", color: "white", paddingRight: 48 }}>
      <FilmGrain />
      <VeilHeader />
      <main className="relative z-10 mx-auto max-w-5xl px-8 pt-36 pb-16">
        <p
          className="mb-4 text-[10px] tracking-[0.4em] uppercase"
          style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.7)" }}
        >
          THE SECRET LAB · identity
        </p>
        <h1
          className="mb-5 text-5xl md:text-6xl font-light"
          style={{ fontFamily: "var(--font-instrument-serif)", letterSpacing: "-0.03em" }}
        >
          ZER0ID
        </h1>
        <p
          className="mb-10 max-w-2xl text-lg font-light leading-relaxed"
          style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.53)" }}
        >
          {lead}
        </p>

        <div className="mb-12 grid gap-3 md:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="rounded-2xl px-5 py-5"
              style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
            >
              <p className="text-[10px] tracking-[0.22em]" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.72)" }}>
                {step.n}
              </p>
              <p className="mt-2 text-[16px]" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.92)" }}>
                {step.title}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.48)" }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>

        <ZeroidConsole />

        <div className="mt-10 flex flex-wrap gap-4 text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          <Link href="/app/onboard" style={{ color: "rgba(16,185,129,0.82)" }}>
            Onboard A7 →
          </Link>
          <Link href="/app/apply" style={{ color: "rgba(255,255,255,0.5)" }}>
            Apply
          </Link>
          <Link href="/app/oath" style={{ color: "rgba(255,255,255,0.5)" }}>
            Oath
          </Link>
          <Link href="/mesh" style={{ color: "rgba(255,255,255,0.5)" }}>
            Mesh
          </Link>
        </div>
      </main>
      <FlowNext />
      <VeilFooter />
    </div>
  )
}
