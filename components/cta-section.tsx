"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Magnetic from "./magnetic"
import CharReveal from "./char-reveal"

export default function CTASection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-4xl w-full text-center">
        <motion.span
          style={{
            fontSize: "10px",
            letterSpacing: "0.5em",
            color: "rgba(16, 185, 129, 0.35)",
            fontFamily: "var(--font-space-grotesk)",
          }}
          whileHover={{ color: "rgba(16, 185, 129, 0.6)", transition: { duration: 0.4 } }}
        >
          EARLY ACCESS
        </motion.span>

        <CharReveal
          text="Build With Us"
          tag="h2"
          className="text-4xl md:text-5xl font-bold tracking-wide mt-6 mb-8 font-sans cursor-default justify-center"
          style={{
            color: "rgba(255, 255, 255, 0.30)",
            textShadow: `
              0 0 10px rgba(16, 185, 129, 0.2),
              0 0 20px rgba(16, 185, 129, 0.1),
              0 0 40px rgba(16, 185, 129, 0.05)
            `,
            WebkitTextStroke: "1px rgba(255, 255, 255, 0.12)",
          }}
          stagger={0.04}
          duration={0.8}
        />

        <p
          className="text-base leading-relaxed mb-12 max-w-xl mx-auto"
          style={{ color: "rgba(255, 255, 255, 0.33)", fontFamily: "var(--font-figtree)" }}
        >
          Join the first wave of traders, market makers, and builders on VEIL. Get early access to testnet, propose
          markets, and shape the future of privacy-native prediction markets.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Magnetic strength={0.35} radius={100}>
          <motion.button
            className="px-8 py-3.5 rounded-full font-medium tracking-[0.15em] text-[12px]"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              background: "rgba(16, 185, 129, 0.06)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(16, 185, 129, 0.1)",
              color: "rgba(255, 255, 255, 0.40)",
            }}
            whileHover={{
              background: "rgba(16, 185, 129, 0.15)",
              borderColor: "rgba(16, 185, 129, 0.3)",
              color: "rgba(255, 255, 255, 0.8)",
              boxShadow: "0 0 30px rgba(16, 185, 129, 0.15), 0 0 60px rgba(16, 185, 129, 0.05)",
              scale: 1.03,
              transition: { duration: 0.4, ease: "easeOut" },
            }}
            whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
          >
            REQUEST EARLY ACCESS
          </motion.button>
          </Magnetic>

          <Magnetic strength={0.35} radius={100}>
          <motion.div
            whileHover={{
              scale: 1.03,
              transition: { duration: 0.4, ease: "easeOut" },
            }}
            whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
          >
            <Link
              href="/app/docs"
              className="px-8 py-3.5 rounded-full tracking-[0.15em] text-[12px] inline-block text-center"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                background: "rgba(255, 255, 255, 0.02)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                color: "rgba(255, 255, 255, 0.35)",
                transition: "all 0.6s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)"
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.55)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)"
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.35)"
              }}
            >
              READ DOCUMENTATION
            </Link>
          </motion.div>
          </Magnetic>
        </div>

        <div className="mt-20 pt-8" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.04)" }}>
          <motion.p
            style={{
              color: "rgba(255, 255, 255, 0.28)",
              fontSize: "10px",
              letterSpacing: "0.3em",
              fontFamily: "var(--font-space-grotesk)",
            }}
            whileHover={{
              color: "rgba(255, 255, 255, 0.45)",
              transition: { duration: 0.8 },
            }}
          >
            The windows are short. The horizon is long.
          </motion.p>
        </div>
      </div>
    </section>
  )
}
