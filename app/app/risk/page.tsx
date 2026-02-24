"use client"

import { VeilFooter, VeilHeader } from '@/components/brand'

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

function ScrollReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}

const sections = [
  {
    num: "01",
    title: "Market Risk",
    content: [
      "Prediction markets are highly volatile and speculative. Share prices can fluctuate dramatically based on news, events, and trader sentiment. There is no guarantee that you will profit from any trade.",
      "Market outcomes are uncertain by nature. Even markets with high probability outcomes can resolve unexpectedly. Past performance and current odds do not guarantee future results.",
      "You may lose your entire investment in any market. Never invest more than you can afford to lose, and diversify your positions to manage risk.",
    ],
  },
  {
    num: "02",
    title: "Smart Contract Risk",
    content: [
      "VEIL operates on smart contracts deployed to the Avalanche blockchain. Validation coverage is staged and evolving; smart contracts may contain bugs, vulnerabilities, or design flaws that could result in loss of funds.",
      "Smart contract code is immutable once deployed. If a vulnerability is discovered, it may not be possible to fix it without migrating to new contracts, which could be disruptive or result in temporary loss of access to funds.",
      "You should review available source code and published validation evidence before using the Platform. VEIL is not liable for losses resulting from smart contract vulnerabilities.",
    ],
  },
  {
    num: "03",
    title: "Oracle Risk",
    content: [
      "Market resolution depends on decentralized oracles that provide real-world data to the blockchain. While designed to be accurate and tamper-resistant, oracles may occasionally provide incorrect data or be subject to manipulation.",
      "Oracle failures or disputes can delay market resolution or result in incorrect outcomes. VEIL uses multiple oracle sources and dispute resolution mechanisms to minimize this risk, but it cannot be eliminated entirely.",
      "In the event of an oracle dispute, market resolution may be delayed while the community votes on the correct outcome. This could temporarily lock your funds.",
    ],
  },
  {
    num: "04",
    title: "Liquidity Risk",
    content: [
      "Some markets may have low liquidity, making it difficult to enter or exit positions at desired prices. You may not be able to sell your shares when you want to, or you may have to accept unfavorable prices.",
      "Low liquidity can also lead to high price slippage, where the execution price differs significantly from the displayed price. Always check the order book depth before placing large trades.",
      "VEIL does not guarantee liquidity in any market. Market makers may withdraw liquidity at any time, especially during periods of high volatility or uncertainty.",
    ],
  },
  {
    num: "05",
    title: "Regulatory Risk",
    content: [
      "Prediction markets may be subject to regulatory restrictions or prohibitions in certain jurisdictions. Laws and regulations are evolving rapidly, and future regulatory changes could affect your ability to use VEIL.",
      "You are solely responsible for ensuring compliance with all applicable local, state, national, and international laws and regulations. VEIL does not provide legal advice and cannot guarantee that the Platform is legal in your jurisdiction.",
      "Regulatory enforcement actions could result in the Platform being shut down, restricted, or modified in ways that affect your positions or ability to withdraw funds.",
    ],
  },
  {
    num: "06",
    title: "Blockchain & Network Risk",
    content: [
      "VEIL operates on the Avalanche blockchain. Blockchain networks can experience congestion, downtime, or forks that may affect your ability to trade or access funds.",
      "High network congestion can lead to increased gas fees and delayed transaction confirmations. In extreme cases, transactions may fail or be stuck pending for extended periods.",
      "Blockchain forks or protocol upgrades could result in temporary disruptions or require manual intervention to access your funds. VEIL will communicate any necessary actions during such events.",
    ],
  },
  {
    num: "07",
    title: "Wallet & Key Management Risk",
    content: [
      "You are solely responsible for maintaining the security of your wallet and private keys. If you lose your private keys or they are stolen, you will permanently lose access to your funds. VEIL cannot recover lost or stolen funds.",
      "Phishing attacks, malware, and social engineering scams are common in the cryptocurrency space. Always verify that you are interacting with the official VEIL website and never share your private keys with anyone.",
      "Use hardware wallets or other secure key management solutions for large amounts. Enable all available security features in your wallet, including two-factor authentication where supported.",
    ],
  },
  {
    num: "08",
    title: "Counterparty Risk",
    content: [
      "When you trade on VEIL, you are trading against other users. If the Platform experiences a catastrophic failure or exploit, there may not be sufficient funds to honor all positions.",
      "While VEIL uses smart contracts to minimize counterparty risk, extreme scenarios such as oracle failures or smart contract exploits could result in losses that cannot be recovered.",
    ],
  },
  {
    num: "09",
    title: "Tax & Accounting Risk",
    content: [
      "Trading on prediction markets may have tax implications in your jurisdiction. You are responsible for understanding and complying with all applicable tax laws and reporting requirements.",
      "VEIL does not provide tax advice or reporting. You should consult with a qualified tax professional to understand your obligations. Failure to properly report and pay taxes could result in penalties and legal consequences.",
    ],
  },
  {
    num: "10",
    title: "Operational Risk",
    content: [
      "VEIL may experience technical issues, bugs, or downtime that affect your ability to trade or access the Platform. While we strive for high availability, we cannot guarantee uninterrupted service.",
      "User interface bugs or errors could result in unintended trades or actions. Always double-check transaction details before confirming, as blockchain transactions are irreversible.",
    ],
  },
  {
    num: "11",
    title: "Acknowledgment of Risks",
    content: [
      "By using VEIL, you acknowledge that you have read, understood, and accepted all risks outlined in this disclosure. You agree that you are solely responsible for your trading decisions and any resulting losses.",
      "If you do not understand these risks or are not comfortable accepting them, you should not use the Platform. Consider consulting with financial, legal, and technical advisors before participating in prediction markets.",
    ],
  },
  {
    num: "12",
    title: "Contact & Support",
    contact: true,
    content: [],
  },
]

export default function RiskPage() {
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
          VEIL / Risk Disclosure
        </span>
      </nav>

      <main className="relative z-10 mx-auto max-w-[860px] px-6 pt-32 pb-32">
        {/* Hero */}
        <ScrollReveal>
          <div className="mb-12 text-center">
            <p
              className="mb-4 text-xs tracking-[0.4em] uppercase"
              style={{ color: "rgba(16, 185, 129, 0.5)", fontFamily: "var(--font-space-grotesk)" }}
            >
              Legal
            </p>
            <h1
              className="text-6xl md:text-7xl font-light mb-6"
              style={{
                fontFamily: "var(--font-instrument-serif)",
                color: "rgba(255, 255, 255, 0.92)",
                letterSpacing: "-0.03em",
              }}
            >
              Risk Disclosure
            </h1>
            <p
              className="text-base font-light"
              style={{ color: "rgba(255, 255, 255, 0.35)", fontFamily: "var(--font-figtree)" }}
            >
              Last updated January 10, 2025
            </p>
          </div>
        </ScrollReveal>

        {/* Warning banner */}
        <ScrollReveal>
          <div
            className="mb-14 rounded-[20px] p-8"
            style={{
              background: "rgba(239, 68, 68, 0.04)",
              border: "1px solid rgba(239, 68, 68, 0.15)",
              boxShadow: "0 0 60px rgba(239, 68, 68, 0.06)",
            }}
          >
            <p
              className="text-sm font-medium mb-3"
              style={{ color: "rgba(239, 68, 68, 0.85)", fontFamily: "var(--font-space-grotesk)" }}
            >
              ⚠️ Important Warning
            </p>
            <p
              className="text-[15px] leading-[1.85] font-light"
              style={{ color: "rgba(255, 255, 255, 0.5)", fontFamily: "var(--font-figtree)" }}
            >
              Trading on prediction markets involves significant financial risk. You may lose your entire investment. Only
              trade with funds you can afford to lose. This disclosure outlines the key risks associated with using VEIL.
            </p>
          </div>
        </ScrollReveal>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((s) => (
            <ScrollReveal key={s.num}>
              <div
                className="rounded-[20px] p-8 md:p-10"
                style={{
                  background: "rgba(255, 255, 255, 0.015)",
                  border: "1px solid rgba(255, 255, 255, 0.04)",
                }}
              >
                <div className="flex items-baseline gap-4 mb-6">
                  <span
                    className="text-xs tracking-[0.2em]"
                    style={{ color: "rgba(16, 185, 129, 0.4)", fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {s.num}
                  </span>
                  <h2
                    className="text-2xl font-light"
                    style={{
                      fontFamily: "var(--font-instrument-serif)",
                      color: "rgba(255, 255, 255, 0.85)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {s.title}
                  </h2>
                </div>

                <div className="space-y-4" style={{ fontFamily: "var(--font-figtree)" }}>
                  {s.content.map((p, i) => (
                    <p key={i} className="text-[15px] leading-[1.85] font-light" style={{ color: "rgba(255, 255, 255, 0.45)" }}>
                      {p}
                    </p>
                  ))}

                  {s.contact && (
                    <div className="text-[15px] leading-[1.85] font-light" style={{ color: "rgba(255, 255, 255, 0.45)" }}>
                      <p>If you have questions about these risks or need assistance, please contact us at:</p>
                      <p className="mt-3">
                        Email: <span style={{ color: "rgba(16, 185, 129, 0.7)" }}>risk@veil.market</span>
                      </p>
                      <p>
                        Support:{" "}
                        <Link href="/app/support" style={{ color: "rgba(16, 185, 129, 0.7)" }} className="hover:underline">
                          veil.market/support
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
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
