"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FilmGrain, VeilFooter, VeilHeader } from "@/components/brand"
import { FlowNext } from "@/components/flow-next"

type Status = {
  ok?: boolean
  veilvm?: { healthy?: boolean; height?: number | null; blockId?: string | null }
  companion?: { chainId?: number | null; ok?: boolean }
  stats?: { requests?: number; lastMethod?: string }
}

type Catalog = {
  note?: string
  defaultKey?: string
  networks?: Array<{
    id: string
    label?: string
    kind?: string
    chainId?: string | number
    appId?: number
    lanes?: Record<string, string>
  }>
}

type Signers = {
  ok?: boolean
  meshActor?: string
  meshVeil?: number
  animaActor?: string
  animaVeil?: number
  zer0Actor?: string
  zer0Veil?: number
  actor2?: string
  veil2?: number
}

export default function MeshPage() {
  const [status, setStatus] = useState<Status | null>(null)
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [signers, setSigners] = useState<Signers | null>(null)
  const [copied, setCopied] = useState("")

  useEffect(() => {
    let dead = false
    const pull = async () => {
      try {
        const [h, c, s] = await Promise.all([
          fetch("/api/mesh/health", { cache: "no-store" }).then((r) => r.json()),
          fetch("/api/mesh", { cache: "no-store" }).then((r) => r.json()),
          fetch("/api/orders", { cache: "no-store" }).then((r) => r.json()).catch(() => null),
        ])
        if (!dead) {
          setStatus(h)
          setCatalog(c)
          setSigners(s as Signers)
        }
      } catch {
        if (!dead) setStatus({ ok: false })
      }
    }
    void pull()
    const id = window.setInterval(() => void pull(), 4000)
    return () => {
      dead = true
      window.clearInterval(id)
    }
  }, [])

  const copy = (label: string, value: string) => {
    void navigator.clipboard.writeText(value)
    setCopied(label)
    window.setTimeout(() => setCopied(""), 1500)
  }

  const key = catalog?.defaultKey || "mesh_local_dev"
  const live = Boolean(status?.ok)

  return (
    <div className="relative min-h-screen" style={{ background: "#060606", color: "white", paddingRight: 48 }}>
      <FilmGrain />
      <VeilHeader />
      <main className="relative z-10 mx-auto max-w-3xl px-8 pt-36 pb-24">
        <p
          className="mb-4 text-[10px] tracking-[0.4em] uppercase"
          style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.56)" }}
        >
          THE SECRET LAB · product
        </p>
        <h1
          className="mb-4 text-5xl md:text-6xl font-light"
          style={{ fontFamily: "var(--font-instrument-serif)", letterSpacing: "-0.03em" }}
        >
          Mesh
        </h1>
        <p
          className="mb-8 max-w-xl text-lg font-light leading-relaxed"
          style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.47)" }}
        >
          RPC for VeilVM and the companion EVM. Operated by THE SECRET LAB. Local only — not Fuji, not mainnet,
          not a public Infura.
        </p>

        <div
          className="mb-10 flex flex-wrap items-center gap-3 rounded-2xl px-5 py-4"
          style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: live ? "rgb(52,211,153)" : "rgba(248,113,113,0.85)", boxShadow: live ? "0 0 10px rgba(16,185,129,0.7)" : "none" }}
          />
          <span className="text-[13px]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {live ? "Mesh live" : "Mesh cannot reach the node"}
          </span>
          <span className="text-[12px]" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.36)" }}>
            VeilVM ht {status?.veilvm?.height?.toLocaleString() ?? "—"}
            {status?.companion?.ok ? " · companion 31337" : " · companion down"}
          </span>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          {(catalog?.networks || []).flatMap((n) =>
            Object.entries(n.lanes || {}).map(([lane, href]) => (
              <button
                key={href}
                type="button"
                onClick={() => copy(lane, href)}
                className="rounded-2xl px-5 py-4 text-left transition-colors hover:bg-white/[0.03]"
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span className="block text-[11px] tracking-[0.16em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.67)" }}>
                  {n.label} · {lane}
                </span>
                <span className="mt-2 block break-all text-[12px]" style={{ fontFamily: "ui-monospace, monospace", color: "rgba(255,255,255,0.78)" }}>
                  {copied === lane ? "copied" : href}
                </span>
              </button>
            )),
          )}
        </div>

        <div
          className="mb-8 rounded-2xl px-5 py-4"
          data-flow="mesh-signers"
          style={{ border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="mb-2 text-[11px] tracking-[0.16em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.36)" }}>
            Native signers
          </div>
          <div className="space-y-2 text-[13px]" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.72)" }}>
            <p>
              ANIMA signer {signers?.animaActor ? `${signers.animaActor.slice(0, 10)}…` : "—"} ·{" "}
              {typeof signers?.animaVeil === "number" ? `${signers.animaVeil.toLocaleString()} VEIL` : "— VEIL"}
            </p>
            <p>
              Mesh signer {signers?.meshActor ? `${signers.meshActor.slice(0, 10)}…` : "—"} ·{" "}
              {typeof signers?.meshVeil === "number" ? `${signers.meshVeil.toLocaleString()} VEIL` : "— VEIL"}
            </p>
            <p>
              ZER0 signer {signers?.zer0Actor ? `${signers.zer0Actor.slice(0, 10)}…` : "—"} ·{" "}
              {typeof signers?.zer0Veil === "number" ? `${signers.zer0Veil.toLocaleString()} VEIL` : "— VEIL"}
            </p>
            <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.38)" }}>
              ANIMA HTTP :8080 is newborn and does not load this key. The router signs commit-as anima. Not a validator. Not Fuji.
            </p>
          </div>
        </div>

        <div className="mb-8 rounded-2xl px-5 py-4" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="mb-2 text-[11px] tracking-[0.16em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.36)" }}>
            Local key
          </div>
          <button
            type="button"
            className="font-mono text-[13px]"
            style={{ color: "rgba(255,255,255,0.84)" }}
            onClick={() => copy("key", key)}
          >
            {copied === "key" ? "copied" : key}
          </button>
          <p className="mt-3 text-[12px] leading-relaxed" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.31)" }}>
            Header <span className="font-mono">x-mesh-key</span>. Open on localhost unless MESH_REQUIRE_KEY=1.
            Standalone provider: <span className="font-mono">npm run mesh</span> → http://127.0.0.1:8787
          </p>
        </div>

        <pre
          className="mb-10 overflow-x-auto rounded-2xl px-5 py-4 text-[12px] leading-relaxed"
          style={{ fontFamily: "ui-monospace, monospace", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.56)" }}
        >{`curl -s http://127.0.0.1:3000/api/mesh/v1/core \\
  -H "content-type: application/json" \\
  -H "x-mesh-key: ${key}" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"hypersdk.lastAccepted","params":{}}'`}
        </pre>

        <div className="flex flex-wrap gap-6 text-sm" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          <Link href="/explorer" style={{ color: "rgba(16,185,129,0.73)" }}>
            Explorer →
          </Link>
          <Link href="/lab" style={{ color: "rgba(255,255,255,0.45)" }}>
            Lab
          </Link>
          <Link href="/app" style={{ color: "rgba(255,255,255,0.45)" }}>
            Markets
          </Link>
        </div>
      </main>
      <FlowNext />
      <VeilFooter />
    </div>
  )
}
