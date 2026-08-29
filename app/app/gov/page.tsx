"use client"

import Link from "next/link"
import { VeilFooter, VeilHeader, FilmGrain, ScrollReveal, SectionLabel } from "@/components/brand"
import { FlowNext } from "@/components/flow-next"
import { WalletConnect } from "@/components/wallet-connect"

export default function GovernancePage() {
  return (
    <div className="relative min-h-screen text-white" style={{ background: "#060606" }}>
      <FilmGrain />
      <VeilHeader />

      <main className="relative z-10 mx-auto max-w-4xl px-6 pt-28 pb-20">
        <ScrollReveal>
          <SectionLabel number="01" text="Governance" />
          <h1
            className="text-5xl md:text-6xl leading-[1.05] tracking-[-0.02em] mb-5"
            style={{ fontFamily: "var(--font-instrument-serif)" }}
          >
            Shape the network
            <br />
            when it can vote.
          </h1>
          <p
            className="max-w-xl text-[17px] leading-relaxed mb-10"
            style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.39)", fontWeight: 300 }}
          >
            This page is a surface, not a live DAO. There is no veVEIL balance, no treasury figure, and no
            fabricated proposal tape on this node. The February 2026 operator packet labeled GO FOR PRODUCTION
            is local evidence — not public launch, not Fuji, not mainnet.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <WalletConnect />
            <Link
              href="/app/docs"
              className="px-6 py-3 rounded-full text-[12px] tracking-[0.08em] uppercase transition-colors"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.50)",
              }}
            >
              Read the spec
            </Link>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            { label: "veVEIL", value: "—", sub: "not minted here" },
            { label: "Proposals", value: "0", sub: "no on-chain votes" },
            { label: "Treasury", value: "—", sub: "no public figure" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-[20px] p-6"
              style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}
            >
              <p
                className="text-[9px] uppercase tracking-[0.3em] mb-2"
                style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.50)" }}
              >
                {s.label}
              </p>
              <p className="text-3xl" style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.9)" }}>
                {s.value}
              </p>
              <p className="mt-1 text-[11px]" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.34)" }}>
                {s.sub}
              </p>
            </div>
          ))}
        </div>

        <ScrollReveal delay={0.08}>
          <div className="mt-16">
            <SectionLabel number="02" text="Proposals" />
            <h2
              className="text-3xl mb-6"
              style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.92)" }}
            >
              Empty book
            </h2>
            <div
              className="rounded-[20px] p-8"
              style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}
            >
              <p className="text-[15px] leading-relaxed mb-6" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.45)" }}>
                Commit-reveal voting is specified. This UI will not invent VIP numbers, vote percents, or a
                connected wallet with 24,500 veVEIL. Drafts can be discussed on GitHub until the native
                governance actions are live.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="https://github.com/thesecretlab-dev/veilvm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm"
                  style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.84)" }}
                >
                  GitHub →
                </Link>
                <Link
                  href="/app/gov/new"
                  className="text-sm"
                  style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.45)" }}
                >
                  Draft form (local) →
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
          <div className="mt-16">
            <SectionLabel number="03" text="Delegation" />
            <h2
              className="text-3xl mb-6"
              style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.92)" }}
            >
              Not wired
            </h2>
            <p className="max-w-xl text-[15px] leading-relaxed" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.45)" }}>
              Companion wallet connect on anvil 31337 does not grant voting power. Delegation stays off until
              veVEIL exists on this chain.
            </p>
          </div>
        </ScrollReveal>
      </main>

      <FlowNext />
      <VeilFooter />
    </div>
  )
}
