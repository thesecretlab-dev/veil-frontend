"use client"

import { VeilFooter } from '@/components/brand'

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, MessageCircle, Mail, BookOpen } from "lucide-react"

function ScrollReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay }}
    >
      {children}
    </motion.div>
  )
}

const channels = [
  {
    icon: MessageCircle,
    title: "Discord Community",
    description: "Join our Discord for real-time support, community discussions, and direct access to the VEIL team.",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "support@veil.markets — Response within 24 hours",
    email: "support@veil.markets",
  },
  {
    icon: BookOpen,
    title: "Documentation",
    description: "Check our comprehensive documentation for guides, tutorials, and technical references.",
  },
]

const faqs = [
  {
    q: "How do I get started on VEIL?",
    a: "Connect a compatible wallet, review launch status, and follow onboarding steps. Launch authority is GO FOR PRODUCTION, while market enablement is still staged by operator rollout policy.",
  },
  {
    q: "What wallets are supported?",
    a: "VEIL currently supports injected EVM wallets including MetaMask and Coinbase Wallet. VEIL Wallet is now listed in-app as the privacy-first preferred option, with WalletConnect QR flow rolling out next.",
  },
  {
    q: "How are markets resolved?",
    a: "Markets are resolved by decentralized oracle consensus based on verifiable real-world data sources. Resolution is transparent and auditable on-chain.",
  },
  {
    q: "Is my trading activity private?",
    a: "Privacy is route-dependent. Shielded VM lanes are designed for private order and balance flows, while companion EVM actions (addresses, calldata, and events) remain visible on public explorers.",
  },
  {
    q: "What are the trading fees?",
    a: "VEIL charges a small protocol fee on winning positions. There are no deposit or withdrawal fees, and no bet limits.",
  },
]

export default function SupportPage() {
  return (
    <div className="relative min-h-screen" style={{ background: "#060606" }}>
      {/* Film grain */}
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Fixed nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-5"
        style={{
          background: "rgba(6, 6, 6, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
        }}
      >
        <Link
          href="/app"
          className="flex items-center gap-2 text-sm transition-all hover:gap-3"
          style={{ color: "rgba(16, 185, 129, 0.7)", fontFamily: "var(--font-space-grotesk)" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Markets
        </Link>
        <span
          className="text-xs tracking-[0.3em] uppercase"
          style={{ color: "rgba(255, 255, 255, 0.25)", fontFamily: "var(--font-space-grotesk)" }}
        >
          VEIL / Support
        </span>
      </nav>

      <main className="relative z-10 mx-auto max-w-[860px] px-6 pt-32 pb-32">
        {/* Hero */}
        <ScrollReveal>
          <div className="mb-20 text-center">
            <p
              className="mb-4 text-xs tracking-[0.4em] uppercase"
              style={{ color: "rgba(16, 185, 129, 0.5)", fontFamily: "var(--font-space-grotesk)" }}
            >
              Help
            </p>
            <h1
              className="text-6xl md:text-7xl font-light mb-6"
              style={{
                fontFamily: "var(--font-instrument-serif)",
                color: "rgba(255, 255, 255, 0.92)",
                letterSpacing: "-0.03em",
              }}
            >
              Support Center
            </h1>
            <p
              className="text-lg font-light max-w-lg mx-auto"
              style={{ color: "rgba(255, 255, 255, 0.35)", fontFamily: "var(--font-figtree)" }}
            >
              Need assistance? Our community and support team are here to help you navigate VEIL.
            </p>
          </div>
        </ScrollReveal>

        {/* 01 — Get Help */}
        <ScrollReveal>
          <div className="mb-16">
            <div className="flex items-baseline gap-4 mb-8">
              <span
                className="text-xs tracking-[0.2em]"
                style={{ color: "rgba(16, 185, 129, 0.4)", fontFamily: "var(--font-space-grotesk)" }}
              >
                01
              </span>
              <h2
                className="text-3xl font-light"
                style={{
                  fontFamily: "var(--font-instrument-serif)",
                  color: "rgba(255, 255, 255, 0.85)",
                  letterSpacing: "-0.02em",
                }}
              >
                Get Help
              </h2>
            </div>

            <div className="grid gap-5">
              {channels.map((ch, i) => (
                <ScrollReveal key={ch.title} delay={i * 0.1}>
                  <div
                    className="rounded-[20px] p-8 flex items-start gap-6 group"
                    style={{
                      background: "rgba(255, 255, 255, 0.015)",
                      border: "1px solid rgba(255, 255, 255, 0.04)",
                    }}
                  >
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: "rgba(16, 185, 129, 0.06)", border: "1px solid rgba(16, 185, 129, 0.1)" }}
                    >
                      <ch.icon className="h-5 w-5" style={{ color: "rgba(16, 185, 129, 0.7)" }} />
                    </div>
                    <div>
                      <h3
                        className="text-lg font-light mb-2"
                        style={{
                          fontFamily: "var(--font-instrument-serif)",
                          color: "rgba(255, 255, 255, 0.8)",
                        }}
                      >
                        {ch.title}
                      </h3>
                      <p
                        className="text-[15px] leading-[1.85] font-light"
                        style={{ color: "rgba(255, 255, 255, 0.4)", fontFamily: "var(--font-figtree)" }}
                      >
                        {ch.email ? (
                          <>
                            <a href={`mailto:${ch.email}`} style={{ color: "rgba(16, 185, 129, 0.7)" }} className="hover:underline">
                              {ch.email}
                            </a>
                            {" — Response within 24 hours"}
                          </>
                        ) : (
                          ch.description
                        )}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* 02 — FAQs */}
        <ScrollReveal>
          <div>
            <div className="flex items-baseline gap-4 mb-8">
              <span
                className="text-xs tracking-[0.2em]"
                style={{ color: "rgba(16, 185, 129, 0.4)", fontFamily: "var(--font-space-grotesk)" }}
              >
                02
              </span>
              <h2
                className="text-3xl font-light"
                style={{
                  fontFamily: "var(--font-instrument-serif)",
                  color: "rgba(255, 255, 255, 0.85)",
                  letterSpacing: "-0.02em",
                }}
              >
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-5">
              {faqs.map((faq, i) => (
                <ScrollReveal key={i} delay={i * 0.08}>
                  <div
                    className="rounded-[20px] p-8"
                    style={{
                      background: "rgba(255, 255, 255, 0.015)",
                      border: "1px solid rgba(255, 255, 255, 0.04)",
                    }}
                  >
                    <h3
                      className="text-[17px] font-medium mb-3"
                      style={{
                        fontFamily: "var(--font-space-grotesk)",
                        color: "rgba(255, 255, 255, 0.75)",
                      }}
                    >
                      {faq.q}
                    </h3>
                    <p
                      className="text-[15px] leading-[1.85] font-light"
                      style={{ color: "rgba(255, 255, 255, 0.4)", fontFamily: "var(--font-figtree)" }}
                    >
                      {faq.a}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </main>

      {/* Footer */}
      <footer
        className="relative z-10 border-t px-8 py-8 text-center"
        style={{
          borderColor: "rgba(255, 255, 255, 0.04)",
          background: "rgba(6, 6, 6, 0.6)",
        }}
      >
        <p className="text-xs" style={{ color: "rgba(255, 255, 255, 0.2)", fontFamily: "var(--font-space-grotesk)" }}>
          © 2026 VEIL � TSL
        </p>
      </footer>
    </div>
  )
}
