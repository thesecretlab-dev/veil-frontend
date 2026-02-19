"use client"

import { motion } from "framer-motion"
import VeilCard from "./veil-card"
import CharReveal from "./char-reveal"

export default function PrinciplesSection() {
  const principles = [
    { title: "Privacy by Default", desc: "Orders sealed on submission, only used inside trusted execution environments" },
    { title: "Batch Auctions", desc: "Discrete 2-5 second windows minimize timing advantage and compress information" },
    { title: "EVM Compatible", desc: "Standard ERC-20 tokens, familiar wallets, and developer-friendly interfaces" },
    { title: "Own the Base Layer", desc: "Avalanche L1 Subnet for full control over latency, gas, and cross-chain messaging" },
    { title: "Composable Privacy", desc: "Start with TEE-backed clearing, graduate to zero-knowledge proofs incrementally" },
    { title: "Transparent Settlement", desc: "Verifiable oracle resolution with on-chain proof, ensuring fair outcomes for all participants" },
  ]

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-6xl w-full">
        <CharReveal
          text="Principles"
          tag="h2"
          className="text-4xl md:text-5xl font-bold tracking-wide mb-12 text-center font-sans cursor-default"
          style={{
            color: "rgba(255, 255, 255, 0.35)",
            textShadow: `
              0 0 10px rgba(16, 185, 129, 0.3),
              0 0 20px rgba(16, 185, 129, 0.2),
              0 0 30px rgba(16, 185, 129, 0.1),
              inset 0 0 10px rgba(255, 255, 255, 0.1),
              2px 2px 4px rgba(0, 0, 0, 0.3)
            `,
            WebkitTextStroke: "1px rgba(255, 255, 255, 0.15)",
          }}
          stagger={0.035}
          duration={0.8}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.map((principle, i) => (
            <VeilCard key={i} className="p-6" emerald>
              <motion.div
                className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
                style={{
                  background: "rgba(16, 185, 129, 0.08)",
                  border: "1px solid rgba(16, 185, 129, 0.15)",
                }}
                whileHover={{
                  background: "rgba(16, 185, 129, 0.15)",
                  borderColor: "rgba(16, 185, 129, 0.35)",
                  scale: 1.1,
                  transition: { duration: 0.3 },
                }}
              >
                <span className="text-2xl font-sans" style={{ color: "rgba(16, 185, 129, 0.5)" }}>
                  {i + 1}
                </span>
              </motion.div>
              <motion.h3
                className="text-xl font-semibold mb-3 font-sans"
                style={{
                  color: "rgba(255, 255, 255, 0.30)",
                  textShadow: "0 0 10px rgba(16, 185, 129, 0.15)",
                  WebkitTextStroke: "0.3px rgba(255, 255, 255, 0.15)",
                }}
                whileHover={{
                  color: "rgba(255, 255, 255, 0.50)",
                  textShadow: "0 0 15px rgba(16, 185, 129, 0.4)",
                  transition: { duration: 0.4 },
                }}
              >
                {principle.title}
              </motion.h3>
              <p className="leading-relaxed font-sans" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                {principle.desc}
              </p>
            </VeilCard>
          ))}
        </div>
      </div>
    </section>
  )
}
