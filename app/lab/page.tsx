"use client"

import Link from "next/link"
import { VeilFooter, VeilHeader, FilmGrain } from "@/components/brand"

const PRODUCTS = [
  { label: "VEIL", href: "/exploreveil", hint: "Private execution network · local testnet" },
  { label: "ZER0ID", href: "/app/zeroid", hint: "Identity · 8004 · HMAC + companion registry" },
  { label: "Mesh", href: "/mesh", hint: "RPC · VeilVM + companion EVM" },
]

const LINKS = [
  { label: "thesecretlab.app", href: "https://thesecretlab.app", hint: "Lab home" },
  { label: "GitHub org", href: "https://github.com/thesecretlab-dev", hint: "thesecretlab-dev" },
  { label: "veilvm", href: "https://github.com/thesecretlab-dev/veilvm", hint: "Protocol repo" },
  { label: "X", href: "https://x.com/veilmarkets", hint: "@veilmarkets" },
]

export default function LabPage() {
  return (
    <div className="relative min-h-screen" style={{ background: "#060606", color: "white" }}>
      <FilmGrain />
      <VeilHeader />
      <main className="relative z-10 mx-auto max-w-2xl px-8 pt-36 pb-24">
        <p
          className="mb-6 text-[10px] tracking-[0.4em] uppercase"
          style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.56)" }}
        >
          Builder
        </p>
        <h1
          className="mb-6 text-5xl md:text-6xl font-light"
          style={{ fontFamily: "var(--font-instrument-serif)", letterSpacing: "-0.03em" }}
        >
          THE SECRET LAB
        </h1>
        <p
          className="mb-12 max-w-xl text-lg font-light leading-relaxed"
          style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.45)" }}
        >
          VEIL is built by THE SECRET LAB. Protocol, identity, and agent runtime come from the same lab.
          Local testnet only — not Fuji, not mainnet.
        </p>
        <p
          className="mb-3 text-[10px] tracking-[0.28em] uppercase"
          style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.36)" }}
        >
          Products
        </p>
        <ul className="mb-10 space-y-3">
          {PRODUCTS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex items-center justify-between rounded-2xl px-5 py-4 transition-colors hover:bg-white/[0.03]"
                style={{ border: "1px solid rgba(16,185,129,0.18)" }}
              >
                <span>
                  <span
                    className="block text-[16px]"
                    style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.94)" }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="mt-0.5 block text-[11px]"
                    style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.31)" }}
                  >
                    {item.hint}
                  </span>
                </span>
                <span style={{ color: "rgba(16,185,129,0.56)" }}>→</span>
              </Link>
            </li>
          ))}
        </ul>
        <ul className="space-y-3">
          {LINKS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-2xl px-5 py-4 transition-colors hover:bg-white/[0.03]"
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span>
                  <span
                    className="block text-[16px] group-hover:text-white"
                    style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.94)" }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="mt-0.5 block text-[11px]"
                    style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.31)" }}
                  >
                    {item.hint}
                  </span>
                </span>
                <span style={{ color: "rgba(16,185,129,0.56)" }}>↗</span>
              </a>
            </li>
          ))}
        </ul>
        <Link
          href="/exploreveil"
          className="mt-10 inline-block text-sm"
          style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.73)" }}
        >
          ← Thesis
        </Link>
      </main>
      <VeilFooter />
    </div>
  )
}
