"use client"

import { motion } from "framer-motion"

export default function Footer() {
  return (
    <footer className="relative z-10" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex flex-col items-center gap-8">

          {/* Logo mark */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05, transition: { duration: 0.4, type: "spring", stiffness: 300, damping: 20 } }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
              style={{ filter: "drop-shadow(0 0 6px rgba(16,185,129,0.15))" }}>
              <path d="M24 40 L8 12 L40 12 Z" fill="rgba(16,185,129,0.15)" stroke="rgba(255,255,255,0.17)" strokeWidth="1" />
            </svg>
            <span style={{
              fontSize: "12px",
              letterSpacing: "0.3em",
              color: "rgba(255,255,255,0.23)",
              fontFamily: "var(--font-space-grotesk)",
              fontWeight: 600,
              textShadow: "0 0 10px rgba(16,185,129,0.1)",
            }}>VEIL</span>
          </motion.div>

          {/* Links row */}
          <div className="flex items-center gap-6">
            {[
              { href: "/app", label: "APP" },
              { href: "/app/docs", label: "DOCS" },
            ].map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                style={{
                  fontSize: "9px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.30)",
                  fontFamily: "var(--font-space-grotesk)",
                }}
                whileHover={{
                  color: "rgba(255,255,255,0.55)",
                  textShadow: "0 0 8px rgba(16,185,129,0.2)",
                  y: -1,
                  transition: { duration: 0.3 },
                }}
              >
                {i > 0 && <span style={{ color: "rgba(255,255,255,0.30)", marginRight: "24px" }}>{"\u00B7"}</span>}
                {link.label}
              </motion.a>
            ))}

            <span style={{ color: "rgba(255,255,255,0.30)" }}>{"\u00B7"}</span>

            <motion.a
              href="https://x.com/veilmarkets"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5"
              style={{
                fontSize: "9px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.30)",
                fontFamily: "var(--font-space-grotesk)",
              }}
              whileHover={{
                color: "rgba(255,255,255,0.55)",
                y: -1,
                transition: { duration: 0.3 },
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>@veilmarkets</span>
            </motion.a>
          </div>

          {/* Divider */}
          <motion.div
            className="w-24 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.15), transparent)" }}
            whileInView={{ scaleX: [0, 1], transition: { duration: 1, ease: "easeOut" } }}
            viewport={{ once: true }}
          />

          {/* Built by + Avalanche */}
          <div className="flex flex-col items-center gap-3">
            <p style={{
              fontSize: "9px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.23)",
              fontFamily: "var(--font-space-grotesk)",
            }}>
              BUILT BY{" "}
              <motion.a
                href="https://maestro.veil.markets/lab"
                style={{ color: "rgba(255,255,255,0.33)" }}
                whileHover={{
                  color: "rgba(16,185,129,0.6)",
                  textShadow: "0 0 10px rgba(16,185,129,0.3)",
                  transition: { duration: 0.4 },
                }}
              >
                THESECRETLAB
              </motion.a>
            </p>
            <div className="flex items-center gap-2">
              <span style={{
                fontSize: "8px", letterSpacing: "0.25em", color: "rgba(255,255,255,0.17)",
                fontFamily: "var(--font-space-grotesk)",
              }}>POWERED BY AVALANCHE</span>
            </div>
            <span style={{
              fontSize: "8px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.30)",
              fontFamily: "var(--font-space-grotesk)",
            }}>{"\u00A9"} 2026 VEIL PROTOCOL</span>
          </div>

        </div>
      </div>
    </footer>
  )
}
