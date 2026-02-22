"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

export function AppFooter() {
  const router = useRouter()

  const handleCategoryClick = (category: string) => {
    router.push(`/app?category=${category.toLowerCase()}`)
  }

  return (
    <footer
      className="relative z-10 mt-24"
      style={{
        background: "rgba(6, 6, 6, 0.9)",
        borderTop: "1px solid rgba(255, 255, 255, 0.04)",
      }}
    >
      <div className="mx-auto max-w-[1440px] px-8 py-16 md:px-10">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/app" className="group mb-6 inline-flex items-center gap-3">
              <svg
                width="24"
                height="24"
                viewBox="0 0 48 48"
                fill="none"
                style={{ filter: "drop-shadow(0 0 6px rgba(16, 185, 129, 0.3))" }}
              >
                <defs>
                  <linearGradient id="ftGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(16, 185, 129, 0.5)" />
                    <stop offset="100%" stopColor="rgba(255, 255, 255, 0.2)" />
                  </linearGradient>
                </defs>
                <path d="M24 42 L6 8 L42 8 Z" fill="url(#ftGrad)" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="1" />
              </svg>
              <span
                className="text-lg tracking-[0.2em] transition-all duration-700 group-hover:text-white/50"
                style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255, 255, 255, 0.3)" }}
              >
                VEIL
              </span>
            </Link>
            <div className="mt-4">
              <a
                href="https://x.com/veilmarkets"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[12px] transition-all duration-500 hover:text-emerald-400"
                style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255, 255, 255, 0.2)" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                @veilmarkets
              </a>
            </div>
            <span
              className="mt-4 inline-block text-[9px] uppercase tracking-[0.2em] transition-opacity duration-500 hover:opacity-40"
              style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255, 255, 255, 0.15)" }}
            >
              Powered by Avalanche
            </span>
          </div>

          {/* Markets */}
          <div>
            <h3
              className="mb-5 text-[11px] uppercase tracking-[0.15em]"
              style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255, 255, 255, 0.3)" }}
            >
              Markets
            </h3>
            <ul className="space-y-2.5">
              {["Politics", "Sports", "Crypto", "Tech", "Economy"].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => handleCategoryClick(item)}
                    className="text-[12px] transition-all duration-500 hover:text-emerald-400"
                    style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255, 255, 255, 0.2)" }}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3
              className="mb-5 text-[11px] uppercase tracking-[0.15em]"
              style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255, 255, 255, 0.3)" }}
            >
              Resources
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "Documentation", href: "/app/docs" },
                { label: "API", href: "/app/api-docs" },
                { label: "DeFi Console", href: "/app/defi" },
                { label: "Ecosystem", href: "/app/ecosystem" },
                { label: "MAIEV Audits", href: "/maiev" },
                { label: "Transparency", href: "/app/transparency" },
                { label: "Support", href: "/app/support" },
                { label: "Blog", href: "/app/blog" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[12px] transition-all duration-500 hover:text-emerald-400"
                    style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255, 255, 255, 0.2)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3
              className="mb-5 text-[11px] uppercase tracking-[0.15em]"
              style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255, 255, 255, 0.3)" }}
            >
              Legal
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "Terms of Service", href: "/app/terms" },
                { label: "Privacy Policy", href: "/app/privacy" },
                { label: "Risk Disclosure", href: "/app/risk" },
                { label: "Compliance", href: "/app/compliance" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[12px] transition-all duration-500 hover:text-emerald-400"
                    style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255, 255, 255, 0.2)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom line */}
        <div
          className="mt-14 flex items-center justify-between pt-6 text-[11px]"
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.04)",
            fontFamily: "var(--font-space-grotesk)",
            color: "rgba(255, 255, 255, 0.15)",
          }}
        >
          <span>© {new Date().getFullYear()} VEIL · TSL — No users. Only developers.</span>
          <a href="https://thesecretlab.app" target="_blank" rel="noopener noreferrer"
            className="group flex items-center gap-2 transition-opacity duration-700 hover:opacity-80">
            <span style={{ fontSize: "8px", letterSpacing: "0.3em", color: "rgba(255,255,255,0.08)", textTransform: "uppercase" as const }}>Built by</span>
            <span style={{ fontSize: "10px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.18)", fontWeight: 600 }}
              className="group-hover:text-white/30 transition-colors duration-700">THE SECRET LAB</span>
            <span style={{ fontSize: "8px", color: "rgba(16,185,129,0.3)" }}>⬡</span>
          </a>
          <span>Built on Avalanche</span>
        </div>
      </div>
    </footer>
  )
}
