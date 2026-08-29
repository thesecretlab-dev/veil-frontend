"use client"

import type React from "react"
import Link from "next/link"
import { AppShaderBackground } from "./app-shader-background"
import { VeilFooter, VeilHeader } from "./brand"
import { FlowNext } from "./flow-next"

interface LegalPageLayoutProps {
  title: string
  lastUpdated?: string
  children: React.ReactNode
}

export function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <div className="relative min-h-screen">
      <AppShaderBackground />

      <VeilHeader />

      <main className="relative mx-auto max-w-4xl px-8 pb-16 pt-32">
        {/* Title section */}
        <div className="mb-12">
          <h1
            className="mb-4 text-5xl font-bold leading-tight"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: "rgba(255, 255, 255, 0.95)",
              textShadow: "0 0 40px rgba(16, 185, 129, 0.3), 0 2px 8px rgba(0, 0, 0, 0.4)",
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </h1>
          <p
            className="text-sm"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: "rgba(255, 255, 255, 0.45)",
            }}
          >
            {lastUpdated && <>Last updated: {lastUpdated}</>}
          </p>
        </div>

        {/* Content container */}
        <div
          className="space-y-8 rounded-2xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl"
          style={{
            boxShadow: "0 0 60px rgba(16, 185, 129, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          {children}
        </div>

        {/* Footer navigation */}
        <div className="mt-12 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div>
            <p
              className="mb-1 text-sm font-semibold"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: "rgba(255, 255, 255, 0.78)",
              }}
            >
              Questions?
            </p>
            <p
              className="text-sm"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: "rgba(255, 255, 255, 0.45)",
              }}
            >
              Contact us at{" "}
              <a href="mailto:agent@thesecretlab.app" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                agent@thesecretlab.app
              </a>
            </p>
          </div>
          <Link
            href="/app/support"
            className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-emerald-500/50"
            style={{
              fontFamily: "var(--font-space-grotesk)",
            }}
          >
            Get Support
          </Link>
        </div>
      </main>
      <FlowNext />
      <VeilFooter />
    </div>
  )
}

interface SectionProps {
  title: string
  children: React.ReactNode
}

export function LegalSection({ title, children }: SectionProps) {
  return (
    <section className="scroll-mt-8">
      <h2
        className="mb-4 text-2xl font-bold"
        style={{
          fontFamily: "var(--font-space-grotesk)",
          color: "rgba(255, 255, 255, 0.9)",
          textShadow: "0 0 20px rgba(16, 185, 129, 0.2)",
        }}
      >
        {title}
      </h2>
      <div
        className="space-y-4 leading-relaxed"
        style={{
          fontFamily: "var(--font-space-grotesk)",
          color: "rgba(255, 255, 255, 0.67)",
          lineHeight: "1.8",
        }}
      >
        {children}
      </div>
    </section>
  )
}
