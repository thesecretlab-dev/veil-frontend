"use client"

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
    title: "Regulatory Framework",
    content: [
      "VEIL operates as a decentralized protocol on the Avalanche blockchain. We are committed to operating within applicable legal frameworks while preserving user privacy, decentralization, and the core principles of Web3.",
      "As a decentralized platform, VEIL does not act as a financial intermediary or custodian of user funds. Trading and execution capabilities may vary by launch stage, and users maintain custody through their Web3 wallets when routes are enabled.",
      "We actively monitor regulatory developments in key jurisdictions and adapt our compliance approach as needed to ensure continued operation while protecting user rights.",
    ],
  },
  {
    num: "02",
    title: "Know Your Customer (KYC)",
    content: [
      "VEIL does not currently require Know Your Customer (KYC) verification for platform access. Our zero-knowledge architecture is designed to protect user privacy while maintaining platform security and integrity.",
      "However, we reserve the right to implement KYC procedures in the future if:",
    ],
    list: [
      "Required by law or regulatory authorities in key jurisdictions",
      "Necessary to comply with anti-money laundering (AML) regulations",
      "Needed to prevent fraud, abuse, or other illicit activities",
      "Required to maintain banking or payment processor relationships",
    ],
    after: "If KYC is implemented, we will provide advance notice to users and ensure that verification processes are secure, privacy-preserving, and compliant with data protection laws.",
  },
  {
    num: "03",
    title: "Anti-Money Laundering (AML)",
    content: [
      "VEIL is committed to preventing money laundering, terrorist financing, and other financial crimes. We employ multiple measures to detect and prevent illicit activity:",
    ],
    list: [
      "Blockchain analytics and transaction monitoring",
      "Screening against known sanctioned addresses and entities",
      "Suspicious activity detection and reporting",
      "Cooperation with law enforcement when legally required",
    ],
    after: "We reserve the right to freeze, suspend, or terminate accounts suspected of involvement in illegal activities. Users engaging in money laundering or other financial crimes will be reported to appropriate authorities.\n\nIf your account is flagged for suspicious activity, we may request additional information or documentation to verify the legitimacy of your transactions.",
  },
  {
    num: "04",
    title: "Sanctions Compliance",
    content: ["VEIL complies with international sanctions programs, including those administered by:"],
    list: [
      "U.S. Office of Foreign Assets Control (OFAC)",
      "United Nations Security Council",
      "European Union sanctions regimes",
      "Other applicable international sanctions authorities",
    ],
    after: "We screen wallet addresses against sanctions lists and prohibit access from sanctioned individuals, entities, and jurisdictions. Attempting to circumvent sanctions restrictions is strictly prohibited and may result in legal action.",
  },
  {
    num: "05",
    title: "Restricted Jurisdictions",
    content: [
      "VEIL may not be available in certain jurisdictions due to regulatory restrictions or legal prohibitions on prediction markets. Currently restricted jurisdictions include:",
    ],
    list: [
      "Countries subject to comprehensive international sanctions",
      "Jurisdictions where prediction markets are explicitly prohibited",
      "Regions where we cannot ensure regulatory compliance",
    ],
    after: "Users are solely responsible for ensuring they are legally permitted to use VEIL in their location. We employ geolocation and IP blocking to restrict access from prohibited jurisdictions, but these measures are not foolproof.\n\nAttempting to access VEIL from a restricted jurisdiction using VPNs, proxies, or other circumvention tools is a violation of our Terms of Service and may result in account termination and loss of funds.",
  },
  {
    num: "06",
    title: "Tax Reporting and Compliance",
    content: [
      "Users may be required to report their trading activity and profits to tax authorities in their jurisdiction. Tax obligations vary by country and individual circumstances.",
      "VEIL does not provide tax advice, reporting, or withholding services. You are solely responsible for:",
    ],
    list: [
      "Understanding your tax obligations in your jurisdiction",
      "Maintaining accurate records of your trades and profits",
      "Filing required tax returns and paying applicable taxes",
      "Consulting with qualified tax professionals",
    ],
    after: "We may provide transaction history and export tools to assist with tax reporting, but we do not guarantee the accuracy or completeness of this data for tax purposes.\n\nIn some jurisdictions, we may be required to report user information to tax authorities. We will comply with such requirements while minimizing disclosure to the extent permitted by law.",
  },
  {
    num: "07",
    title: "Data Protection & Privacy Compliance",
    content: ["VEIL complies with applicable data protection laws, including:"],
    list: [
      "General Data Protection Regulation (GDPR) for European users",
      "California Consumer Privacy Act (CCPA) for California residents",
      "Other applicable regional data protection regulations",
    ],
    after: "Our zero-knowledge architecture minimizes data collection and processing. We do not sell user data to third parties and only share information when legally required or necessary for platform operation.\n\nFor more details on how we handle your data, please review our Privacy Policy.",
  },
  {
    num: "08",
    title: "Securities Law Compliance",
    content: [
      "VEIL prediction market shares are not intended to be securities, commodities, or other regulated financial instruments. They are utility tokens used solely for participation in prediction markets.",
      "However, regulatory classification of prediction market instruments is evolving and may vary by jurisdiction. We monitor regulatory developments and will adapt our compliance approach as needed.",
      "Users should not treat prediction market shares as investments or securities. They are speculative instruments for expressing opinions about future events, not investment products.",
    ],
  },
  {
    num: "09",
    title: "Market Integrity & Manipulation",
    content: [
      "VEIL prohibits market manipulation, insider trading, and other activities that undermine market integrity. Prohibited activities include:",
    ],
    list: [
      "Wash trading or self-dealing to create artificial volume",
      "Spoofing or layering to manipulate prices",
      "Trading on material non-public information",
      "Coordinated manipulation schemes",
      "Exploiting bugs or vulnerabilities for unfair advantage",
    ],
    after: "We employ monitoring systems to detect suspicious trading patterns and will investigate potential violations. Users found to be manipulating markets will face account termination and may be reported to authorities.",
  },
  {
    num: "10",
    title: "Audit & Transparency",
    content: [
      "VEIL publishes internal and staged validation evidence. External third-party audits are listed only after publication and should not be assumed for all surfaces.",
      "We maintain transparency through:",
    ],
    list: [
      "Open-source smart contract code",
      "Public blockchain transactions",
      "Staged validation evidence and security review updates",
      "Transparent governance and decision-making processes",
    ],
  },
  {
    num: "11",
    title: "Cooperation with Authorities",
    content: [
      "VEIL will cooperate with law enforcement and regulatory authorities when legally required. This may include:",
    ],
    list: [
      "Responding to valid subpoenas and court orders",
      "Providing information in criminal investigations",
      "Reporting suspicious activity to financial intelligence units",
      "Complying with regulatory inquiries and examinations",
    ],
    after: "We will resist overly broad or unjustified requests and will notify affected users when legally permitted.",
  },
  {
    num: "12",
    title: "Compliance Updates",
    content: [
      "Our compliance policies and procedures are subject to change as regulations evolve. We will communicate material changes to users via email or platform notification.",
      "Users are responsible for staying informed about compliance requirements and ensuring their continued eligibility to use the Platform.",
    ],
  },
  {
    num: "13",
    title: "Contact Compliance Team",
    content: [],
    contact: true,
  },
]

export default function CompliancePage() {
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
          VEIL / Compliance
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
              Compliance
            </h1>
            <p
              className="text-base font-light"
              style={{ color: "rgba(255, 255, 255, 0.35)", fontFamily: "var(--font-figtree)" }}
            >
              Last updated January 10, 2025
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

                  {s.list && (
                    <ul className="space-y-2.5 pl-0">
                      {s.list.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-[15px] leading-[1.85] font-light" style={{ color: "rgba(255, 255, 255, 0.45)" }}>
                          <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full" style={{ background: "rgba(16, 185, 129, 0.4)" }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {s.after && s.after.split("\n\n").map((p, i) => (
                    <p key={`a${i}`} className="text-[15px] leading-[1.85] font-light" style={{ color: "rgba(255, 255, 255, 0.45)" }}>
                      {p}
                    </p>
                  ))}

                  {s.contact && (
                    <div className="text-[15px] leading-[1.85] font-light" style={{ color: "rgba(255, 255, 255, 0.45)" }}>
                      <p>
                        If you have questions about our compliance policies or need to report suspicious activity, please contact us at:
                      </p>
                      <p className="mt-3">
                        Email:{" "}
                        <span style={{ color: "rgba(16, 185, 129, 0.7)" }}>compliance@veil.market</span>
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
