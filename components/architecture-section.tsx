"use client"

import { motion } from "framer-motion"
import VeilCard from "./veil-card"
import CharReveal from "./char-reveal"

export default function ArchitectureSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-5xl w-full">
        <CharReveal
          text="Architecture"
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
          stagger={0.03}
          duration={0.8}
        />

        {/* Diagram */}
        <VeilCard className="mb-12 rounded-2xl overflow-hidden p-6" style={{ border: "1px solid rgba(16, 185, 129, 0.2)" }}>
          <motion.img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-337PUDXjLGN3CrCiqV0ylcWe5urkCS.png"
            alt="VEIL Architecture Diagram"
            className="w-full h-auto"
            style={{ filter: "brightness(0.7) contrast(1.05)", opacity: 0.65 }}
            whileHover={{
              opacity: 0.85,
              filter: "brightness(0.85) contrast(1.1)",
              transition: { duration: 0.8 },
            }}
          />
        </VeilCard>

        <div className="space-y-6">
          {[
            {
              title: "Public L1 (Subnet-EVM)",
              items: [
                "Commit contract receives sealed envelopes and stores Merkle roots",
                "Batch clear contract posts price/fill summaries per window",
                "ERC-20 assets with EIP-2612 permit for gasless approvals",
              ],
            },
            {
              title: "Private Clearing Layer",
              items: [
                "TEE enclaves decrypt orders inside secure hardware",
                "Batch auction runs privately, posts aggregate results",
                "ZK proofs for constraints (staged rollout)",
              ],
            },
          ].map((block) => (
            <VeilCard key={block.title} className="p-8 rounded-2xl" style={{ backdropFilter: "blur(20px)" }}>
              <motion.h3
                className="text-2xl font-semibold mb-4 font-sans cursor-default"
                style={{
                  color: "rgba(16, 185, 129, 0.4)",
                  textShadow: "0 0 15px rgba(16, 185, 129, 0.3)",
                  WebkitTextStroke: "0.3px rgba(16, 185, 129, 0.2)",
                  filter: "blur(0.2px)",
                }}
                whileHover={{
                  color: "rgba(16, 185, 129, 0.65)",
                  filter: "blur(0.1px) brightness(1.4)",
                  textShadow: `
                    0 0 20px rgba(16, 185, 129, 0.7),
                    0 0 40px rgba(16, 185, 129, 0.5),
                    0 0 60px rgba(16, 185, 129, 0.3)
                  `,
                  transition: { duration: 0.6 },
                }}
              >
                {block.title}
              </motion.h3>
              <ul className="space-y-2 font-sans" style={{ color: "rgba(255, 255, 255, 0.55)" }}>
                {block.items.map((item, j) => (
                  <motion.li
                    key={j}
                    className="flex items-start gap-3"
                    whileHover={{ x: 4, color: "rgba(255, 255, 255, 0.7)", transition: { duration: 0.3 } }}
                  >
                    <span className="text-emerald-500/40 mt-1">{"\u25B8"}</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </VeilCard>
          ))}
        </div>
      </div>
    </section>
  )
}
