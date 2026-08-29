"use client"

import Link from "next/link"
import { FLOW_NEXT } from "@/lib/flow-nav"

export function FlowNext({
  title = "Continue through the network",
}: {
  title?: string
}) {
  return (
    <section className="relative z-10 mx-auto max-w-5xl px-6 pb-8 pt-4">
      <p
        className="mb-4 text-[10px] tracking-[0.28em] uppercase"
        style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.5)" }}
      >
        {title}
      </p>
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {FLOW_NEXT.map((step, i) => (
          <Link
            key={step.href}
            href={step.href}
            className="rounded-2xl px-4 py-3.5 transition-colors hover:bg-white/[0.03]"
            style={{ border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span className="block text-[10px]" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.28)" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="mt-1 block text-[14px]" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.88)" }}>
              {step.label}
            </span>
            <span className="mt-0.5 block text-[11px]" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.31)" }}>
              {step.hint}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
