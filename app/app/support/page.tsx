"use client"

import { VeilFooter, VeilHeader } from '@/components/brand'

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { MessageCircle, Mail, BookOpen } from "lucide-react"

function ScrollReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay }}
    >
      {children}
    </motion.div>
  )
}

const channels = [
  {
    icon: MessageCircle,
    title: "X",
    description: "@veilmarkets — protocol updates and builder contact.",
    href: "https://x.com/veilmarkets",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "agent@thesecretlab.app — local testnet, developer questions.",
    email: "agent@thesecretlab.app",
  },
  {
    icon: BookOpen,
    title: "Documentation",
    description: "Architecture, ANIMA, convertible deposits, and API reference.",
    href: "/app/docs",
  },
]

const faqs = [
  {
    q: "How do I get started on VEIL?",
    a: "This machine is a local testnet. Open Markets (/app) to browse native books, or Onboard (/app/onboard) for the agent path. Not Fuji. Not mainnet.",
  },
  {
    q: "What wallets are supported?",
    a: "Injected EVM wallets (MetaMask, Coinbase Wallet) for companion rails. Native VeilVM orders sign through the local order router. WalletConnect QR is not live.",
  },
  {
    q: "How are markets resolved?",
    a: "Native books commit, then clear in batch windows under Groth16. Oracle resolution for open-ended real-world questions is still an open design problem — see the blog post on market resolution.",
  },
  {
    q: "Is my trading activity private?",
    a: "VEILENC1 envelopes and VTG2 gossip are threshold-keyed on this node. RPC ingest on a solo node is still plaintext. Companion EVM (anvil 31337) is transparent.",
  },
  {
    q: "What are the trading fees?",
    a: "Native VeilVM fees are paid in VEIL. There is no card/bank rail. COL fee split is 70% depth / 20% buyback-and-make / 10% operations.",
  },
]

export default function SupportPage() {
  return (
    <div className="relative min-h-screen" style={{ background: "#060606" }}>
      <VeilHeader />
      {/* Film grain */}
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      <main className="relative z-10 mx-auto max-w-[860px] px-6 pt-28 pb-32">
        {/* Hero */}
        <ScrollReveal>
          <div className="mb-20 text-center">
            <p
              className="mb-4 text-xs tracking-[0.4em] uppercase"
              style={{ color: "rgba(16, 185, 129, 0.56)", fontFamily: "var(--font-space-grotesk)" }}
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
              style={{ color: "rgba(255, 255, 255, 0.39)", fontFamily: "var(--font-figtree)" }}
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
                style={{ color: "rgba(16, 185, 129, 0.45)", fontFamily: "var(--font-space-grotesk)" }}
              >
                01
              </span>
              <h2
                className="text-3xl font-light"
                style={{
                  fontFamily: "var(--font-instrument-serif)",
                  color: "rgba(255, 255, 255, 0.95)",
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
                      <ch.icon className="h-5 w-5" style={{ color: "rgba(16, 185, 129, 0.78)" }} />
                    </div>
                    <div>
                      <h3
                        className="text-lg font-light mb-2"
                        style={{
                          fontFamily: "var(--font-instrument-serif)",
                          color: "rgba(255, 255, 255, 0.90)",
                        }}
                      >
                        {ch.title}
                      </h3>
                      <p
                        className="text-[15px] leading-[1.85] font-light"
                        style={{ color: "rgba(255, 255, 255, 0.45)", fontFamily: "var(--font-figtree)" }}
                      >
                        {ch.email ? (
                          <>
                            <a href={`mailto:${ch.email}`} style={{ color: "rgba(16, 185, 129, 0.78)" }} className="hover:underline">
                              {ch.email}
                            </a>
                            {" — developer contact"}
                          </>
                        ) : ch.href ? (
                          <a
                            href={ch.href}
                            {...(ch.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            style={{ color: "rgba(16, 185, 129, 0.78)" }}
                            className="hover:underline"
                          >
                            {ch.description}
                          </a>
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
                style={{ color: "rgba(16, 185, 129, 0.45)", fontFamily: "var(--font-space-grotesk)" }}
              >
                02
              </span>
              <h2
                className="text-3xl font-light"
                style={{
                  fontFamily: "var(--font-instrument-serif)",
                  color: "rgba(255, 255, 255, 0.95)",
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
                        color: "rgba(255, 255, 255, 0.84)",
                      }}
                    >
                      {faq.q}
                    </h3>
                    <p
                      className="text-[15px] leading-[1.85] font-light"
                      style={{ color: "rgba(255, 255, 255, 0.45)", fontFamily: "var(--font-figtree)" }}
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
        <p className="text-xs" style={{ color: "rgba(255, 255, 255, 0.22)", fontFamily: "var(--font-space-grotesk)" }}>
          © 2026 VEIL · TSL
        </p>
      </footer>
    </div>
  )
}
