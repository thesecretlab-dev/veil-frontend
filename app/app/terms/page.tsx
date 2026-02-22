"use client"

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
export default function TermsPage() {
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
            {[{ label: "API Docs", href: "/app/api-docs" }, { label: "Privacy", href: "/app/privacy" }].map((l) => (
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
              Terms of Service
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
          <Section number="01" title="Acceptance of Terms" delay={0}>
            <p>
              By accessing and using VEIL (&ldquo;the Platform&rdquo;), you accept and agree to be bound by these Terms of Service
              (&ldquo;Terms&rdquo;). If you do not agree to these Terms, please do not use the Platform. These Terms constitute a
              legally binding agreement between you and VEIL.
            </p>
            <p>
              We reserve the right to modify these Terms at any time. Continued use of the Platform after changes
              constitutes acceptance of the modified Terms. We will notify users of material changes via email or platform
              notification.
            </p>
          </Section>

          <Section number="02" title="Eligibility and Account Requirements" delay={0.05}>
            <p>
              You must be at least 18 years old and legally permitted to participate in prediction markets in your
              jurisdiction. By using VEIL, you represent and warrant that you meet these eligibility requirements.
            </p>
            <p>
              You are responsible for ensuring compliance with all applicable local, state, national, and international laws
              and regulations. VEIL is not available in jurisdictions where prediction markets are prohibited or restricted
              by law.
            </p>
            <p>
              You must connect a compatible Web3 wallet to use the Platform. You are solely responsible for maintaining the
              security of your wallet and private keys. VEIL cannot recover lost or stolen funds.
            </p>
          </Section>

          <Section number="03" title="Market Participation and Trading" delay={0.05}>
            <p>
              VEIL is currently in staged launch mode. Trading surfaces shown in this frontend may be preview-only until
              launch gates are fully closed and production activation is announced.
            </p>
            <p>
              Market outcomes are determined by decentralized oracle consensus. VEIL does not control or manipulate market
              outcomes. Users trade at their own risk and should conduct their own research before participating in any
              market.
            </p>
            <p>
              Trading fees and gas costs apply to all transactions. These fees are clearly displayed before you confirm any
              trade. VEIL reserves the right to adjust fee structures with advance notice to users.
            </p>
          </Section>

          <Section number="04" title="Privacy and Zero-Knowledge Technology" delay={0.05}>
            <p>
              VEIL implements privacy primitives with local validation coverage. Production privacy guarantees remain gated
              pending final launch criteria and operational controls.
            </p>
            <p>
              Some transaction metadata may be visible on public infrastructure depending on route and environment. Review
              route-specific privacy scope before assuming shielded execution.
            </p>
            <p>For more details on how we handle your data, please review our Privacy Policy.</p>
          </Section>

          <Section number="05" title="Prohibited Activities" delay={0.05}>
            <p>You agree not to:</p>
            <ul className="list-none space-y-2 pl-0">
              {[
                "Use the Platform for any illegal or unauthorized purpose",
                "Manipulate markets or engage in wash trading",
                "Attempt to exploit bugs or vulnerabilities in smart contracts",
                "Use bots or automated systems without prior authorization",
                "Impersonate other users or provide false information",
                "Interfere with the proper functioning of the Platform",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: "rgba(16,185,129,0.4)" }} />
                  {item}
                </li>
              ))}
            </ul>
            <p>
              Violation of these prohibitions may result in immediate suspension or termination of your access to the
              Platform, and we may report illegal activities to appropriate authorities.
            </p>
          </Section>

          <Section number="06" title="Intellectual Property" delay={0.05}>
            <p>
              All content, trademarks, logos, and intellectual property on the Platform are owned by VEIL or its licensors.
              You may not copy, modify, distribute, or create derivative works without explicit written permission.
            </p>
            <p>
              The VEIL smart contracts are open source and available under the MIT License. However, the VEIL brand, design,
              and user interface remain proprietary.
            </p>
          </Section>

          <Section number="07" title="Disclaimers and Limitation of Liability" delay={0.05}>
            <p>
              VEIL is provided &ldquo;as is&rdquo; without warranties of any kind, either express or implied. We do not guarantee that
              the Platform will be uninterrupted, secure, or error-free.
            </p>
            <p>
              Trading on prediction markets involves significant risk, and you may lose your entire investment. Past
              performance does not guarantee future results. VEIL is not responsible for any losses incurred through use of
              the Platform.
            </p>
            <p>
              To the maximum extent permitted by law, VEIL shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages, including loss of profits, data, or other intangible losses.
            </p>
          </Section>

          <Section number="08" title="Indemnification" delay={0.05}>
            <p>
              You agree to indemnify, defend, and hold harmless VEIL and its officers, directors, employees, and agents from
              any claims, damages, losses, liabilities, and expenses arising from your use of the Platform or violation of
              these Terms.
            </p>
          </Section>

          <Section number="09" title="Dispute Resolution and Governing Law" delay={0.05}>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which VEIL
              operates, without regard to conflict of law principles.
            </p>
            <p>
              Any disputes arising from these Terms or use of the Platform shall be resolved through binding arbitration,
              except where prohibited by law. You waive your right to participate in class action lawsuits.
            </p>
          </Section>

          <Section number="10" title="Termination" delay={0.05}>
            <p>
              We reserve the right to suspend or terminate your access to the Platform at any time, with or without cause,
              and with or without notice. Upon termination, your right to use the Platform will immediately cease.
            </p>
            <p>
              Provisions of these Terms that by their nature should survive termination shall survive, including ownership
              provisions, warranty disclaimers, and limitations of liability.
            </p>
          </Section>

          <Section number="11" title="Contact Information" delay={0.05}>
            <p>
              If you have questions about these Terms, please contact us at:
            </p>
            <p>
              Email: legal@veil.market
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
                { label: "Privacy", href: "/app/privacy" },
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
