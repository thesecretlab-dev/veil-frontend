"use client"

import Link from "next/link"
import { FilmGrain, VeilFooter, VeilHeader } from "@/components/brand"
import { FlowNext } from "@/components/flow-next"
import { ZeroidConsole } from "@/components/zeroid/console"

const STEPS = [
  { n: "01", title: "Secret", body: "This device hashes a 32-byte secret into tagged SHA-256 commitment and nullifier. The secret never leaves the browser." },
  { n: "02", title: "Issue", body: "Mesh HMAC-signs the 8004 credential on this node. Same domain separation as VeilVM digest-binding." },
  { n: "03", title: "Registry", body: "Nullifier uniqueness is written to the companion contract on anvil 31337. Duplicate issue fails closed." },
]

export default function ZeroidPage() {
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
          Type 8004. Commitment-nullifier identity for this node. HMAC-issued here, unique on the companion registry.
          Groth16 circuits are in-repo; wasm/zkey are not served. No KYC camera.
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
