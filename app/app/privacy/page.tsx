"use client"

import { VeilFooter, VeilHeader } from '@/components/brand'

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"

/* ─── ScrollReveal ─── */
function SR({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}

/* ─── Legal Section ─── */
function Section({
  number,
  title,
  children,
  delay = 0,
}: {
  number: string
  title: string
  children: React.ReactNode
  delay?: number
}) {
  return (
    <SR delay={delay}>
      <section className="mb-14">
        <div className="mb-5 flex items-center gap-4">
          <span
            className="text-[11px] font-medium tracking-[0.3em] uppercase"
            style={{ color: "rgba(16,185,129,0.45)", fontFamily: "var(--font-space-grotesk)" }}
          >
            {number}
          </span>
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.04)" }} />
        </div>
        <h2
          className="mb-4 text-2xl font-light"
          style={{
            fontFamily: "var(--font-instrument-serif)",
            color: "rgba(255,255,255,0.85)",
            textShadow: "0 0 30px rgba(16,185,129,0.06)",
          }}
        >
          {title}
        </h2>
        <div
          className="space-y-4 text-sm leading-[1.8]"
          style={{ color: "rgba(255,255,255,0.42)", fontFamily: "var(--font-figtree)" }}
        >
          {children}
        </div>
      </section>
    </SR>
  )
}

/* ═══════════════════════════════════════════════ */
export default function PrivacyPage() {
  return (
    <>
      {/* Film Grain */}
      <div
        className="pointer-events-none fixed inset-0 z-[9999]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          opacity: 0.5,
        }}
      />

      <div className="min-h-screen" style={{ background: "#060606" }}>
      <VeilHeader />
        {/* ─── Fixed Nav ─── */}
        <nav
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5"
          style={{
            background: "rgba(6,6,6,0.8)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <Link href="/app" className="text-lg font-semibold tracking-wider" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-instrument-serif)" }}>
            VEIL
          </Link>
          <div className="flex gap-6">
            {[{ label: "API Docs", href: "/app/api-docs" }, { label: "Terms", href: "/app/terms" }].map((l) => (
              <Link key={l.href} href={l.href} className="text-xs tracking-wider uppercase transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-space-grotesk)" }}>
                {l.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* ─── Hero ─── */}
        <header className="flex flex-col items-center justify-center px-6 pt-40 pb-20 text-center">
          <SR>
            <p
              className="mb-4 text-xs tracking-[0.4em] uppercase"
              style={{ color: "rgba(16,185,129,0.5)", fontFamily: "var(--font-space-grotesk)" }}
            >
              Legal
            </p>
          </SR>
          <SR delay={0.1}>
            <h1
              className="mb-4 text-5xl font-light leading-[1.1] md:text-6xl"
              style={{
                fontFamily: "var(--font-instrument-serif)",
                color: "rgba(255,255,255,0.9)",
                textShadow: "0 0 60px rgba(16,185,129,0.08)",
              }}
            >
              Privacy Policy
            </h1>
          </SR>
          <SR delay={0.2}>
            <p
              className="max-w-lg text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-figtree)" }}
            >
              Last updated January 10, 2025
            </p>
          </SR>
        </header>

        {/* ─── Content ─── */}
        <main className="mx-auto max-w-3xl px-6 pb-32">
          <Section number="01" title="Introduction" delay={0}>
            <p>
              VEIL is designed with privacy as a core principle. This Privacy Policy explains how we collect, use, and
              protect your information when you use our decentralized prediction market platform.
            </p>
            <p>
              We use zero-knowledge proofs and cryptographic techniques in staged and local environments. Privacy behavior
              is route-dependent; VeilVM proof-gated lanes are shielded while companion EVM rails remain transparent.
            </p>
          </Section>

          <Section number="02" title="Information We Collect" delay={0.05}>
            <p>
              <strong style={{ color: "rgba(255,255,255,0.6)" }}>Wallet Address:</strong> We collect your public wallet address when you connect to the Platform. This
              is necessary for blockchain transactions and cannot be avoided in a decentralized system.
            </p>
            <p>
              <strong style={{ color: "rgba(255,255,255,0.6)" }}>Transaction Data:</strong> Your trades and transactions are recorded on the Avalanche blockchain.
              While transaction hashes and timestamps are public, your trading positions and balances are encrypted using
              zero-knowledge technology.
            </p>
            <p>
              <strong style={{ color: "rgba(255,255,255,0.6)" }}>Usage Analytics:</strong> We collect minimal, anonymized analytics data to improve the Platform,
              including page views, feature usage, and performance metrics. No personally identifiable information is
              collected.
            </p>
          </Section>

          <Section number="03" title="How We Use Your Information" delay={0.05}>
            <p>We use collected information to:</p>
            <ul className="list-none space-y-2 pl-0">
              {[
                "Process your trades and transactions on the blockchain",
                "Provide customer support and respond to inquiries",
                "Improve Platform functionality and user experience",
                "Detect and prevent fraud, abuse, and security threats",
                "Comply with legal obligations and regulatory requirements",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: "rgba(16,185,129,0.4)" }} />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section number="04" title="Zero-Knowledge Privacy" delay={0.05}>
            <p>
              VEIL implements zero-knowledge cryptography to protect privacy on supported routes. Privacy scope depends on
              environment and execution lane.
            </p>
            <p>
              Do not assume universal shielding. Some interoperability or public-lane activity may remain observable on
              public infrastructure.
            </p>
          </Section>

          <Section number="05" title="Blockchain Transparency" delay={0.05}>
            <p>
              While your trades are private, certain information is recorded on the public Avalanche blockchain for
              transparency and security. This includes:
            </p>
            <ul className="list-none space-y-2 pl-0">
              {[
                "Transaction hashes and timestamps",
                "Smart contract interactions",
                "Gas fees and transaction costs",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: "rgba(16,185,129,0.4)" }} />
                  {item}
                </li>
              ))}
            </ul>
            <p>
              This blockchain data is permanent and cannot be deleted. However, it does not reveal your trading positions or
              balances due to zero-knowledge encryption.
            </p>
          </Section>

          <Section number="06" title="Third-Party Services" delay={0.05}>
            <p>VEIL integrates with third-party services, including:</p>
            <ul className="list-none space-y-2 pl-0">
              {[
                "Wallet providers (MetaMask, WalletConnect, Coinbase Wallet, etc.)",
                "Blockchain infrastructure providers (RPC nodes, indexers)",
                "Analytics services (anonymized usage data only)",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: "rgba(16,185,129,0.4)" }} />
                  {item}
                </li>
              ))}
            </ul>
            <p>
              These services have their own privacy policies that govern how they handle your data. We encourage you to
              review their policies before using their services.
            </p>
          </Section>

          <Section number="07" title="Cookies and Tracking" delay={0.05}>
            <p>We use minimal cookies and local storage to maintain your session and preferences. These include:</p>
            <ul className="list-none space-y-2 pl-0">
              {[
                "Session cookies for authentication and security",
                "Preference cookies for UI settings and language",
                "Analytics cookies for anonymized usage tracking",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: "rgba(16,185,129,0.4)" }} />
                  {item}
                </li>
              ))}
            </ul>
            <p>You can disable cookies in your browser settings, but this may affect Platform functionality.</p>
          </Section>

          <Section number="08" title="Data Security" delay={0.05}>
            <p>We implement industry-standard security measures to protect your information, including:</p>
            <ul className="list-none space-y-2 pl-0">
              {[
                "End-to-end encryption for sensitive data",
                "Secure HTTPS connections",
                "Regular security audits and penetration testing",
                "Multi-signature wallet controls for platform funds",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: "rgba(16,185,129,0.4)" }} />
                  {item}
                </li>
              ))}
            </ul>
            <p>
              However, no system is completely secure. You are responsible for maintaining the security of your wallet and
              private keys.
            </p>
          </Section>

          <Section number="09" title="Your Privacy Rights" delay={0.05}>
            <p>You have the right to:</p>
            <ul className="list-none space-y-2 pl-0">
              {[
                "Access any personal data we hold about you",
                "Request correction of inaccurate data",
                "Request deletion of off-chain data (blockchain data cannot be deleted)",
                "Opt out of analytics and marketing communications",
                "Export your data in a portable format",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: "rgba(16,185,129,0.4)" }} />
                  {item}
                </li>
              ))}
            </ul>
            <p>To exercise these rights, contact us at privacy@veil.market.</p>
          </Section>

          <Section number="10" title="International Users" delay={0.05}>
            <p>
              VEIL is a decentralized platform accessible globally. If you access the Platform from outside our primary
              jurisdiction, you acknowledge that your data may be transferred and processed in different countries.
            </p>
            <p>
              We comply with applicable data protection laws, including GDPR for European users and CCPA for California
              residents.
            </p>
          </Section>

          <Section number="11" title="Changes to This Policy" delay={0.05}>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes via email or
              platform notification. Continued use of the Platform after changes constitutes acceptance of the updated
              policy.
            </p>
          </Section>

          <Section number="12" title="Contact Us" delay={0.05}>
            <p>
              If you have questions about this Privacy Policy or how we handle your data, please contact us at:
            </p>
            <p>
              Email: privacy@veil.market
              <br />
              Support:{" "}
              <Link href="/app/support" className="transition-colors hover:text-white" style={{ color: "rgba(16,185,129,0.7)" }}>
                veil.market/support
              </Link>
            </p>
          </Section>
        </main>

        {/* ─── Footer ─── */}
        <footer
          className="border-t px-8 py-8"
          style={{ borderColor: "rgba(255,255,255,0.04)", background: "rgba(6,6,6,0.6)" }}
        >
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-space-grotesk)" }}>
              © 2026 VEIL
            </span>
            <div className="flex gap-6">
              {[
                { label: "API Docs", href: "/app/api-docs" },
                { label: "Terms", href: "/app/terms" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="text-xs transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-space-grotesk)" }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
