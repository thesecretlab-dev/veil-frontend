"use client"

import { motion } from "framer-motion"
import VeilCard from "./veil-card"
import CharReveal from "./char-reveal"

export default function RoadmapSection() {
  const milestones = [
    { id: "M0", title: "Local Demo", status: "Complete", desc: "Windowed commit \u2192 batch clear \u2192 price print loop" },
    { id: "M1", title: "Public Testnet", status: "In Progress", desc: "Subnet live on AvaCloud with commit/clear contracts" },
    { id: "M2", title: "Privacy POC", status: "Upcoming", desc: "TEE path with remote attestation and sealed keys" },
    { id: "M3", title: "Audit & Mainnet Beta", status: "Upcoming", desc: "Security audits, bug bounty, gradual launch" },
    { id: "M4", title: "ZK Expansion", status: "Future", desc: "Replace TEE checks with ZK proofs, shielded pool" },
  ]

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-5xl w-full">
        <CharReveal
          text="Progress"
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
          stagger={0.04}
          duration={0.8}
        />

        <div className="space-y-4">
          {milestones.map((milestone, i) => (
            <VeilCard key={i} className="p-6 flex items-start gap-6" emerald>
              <div className="flex-shrink-0">
                <motion.div
                  className="w-16 h-16 rounded-lg flex items-center justify-center"
                  style={{
                    background: "rgba(16, 185, 129, 0.08)",
                    border: "1px solid rgba(16, 185, 129, 0.15)",
                  }}
                  whileHover={{
                    background: "rgba(16, 185, 129, 0.18)",
                    borderColor: "rgba(16, 185, 129, 0.35)",
                    scale: 1.08,
                    rotate: 2,
                    transition: { duration: 0.3, type: "spring", stiffness: 400, damping: 20 },
                  }}
                >
                  <span className="text-xl font-bold font-sans" style={{ color: "rgba(16, 185, 129, 0.5)" }}>
                    {milestone.id}
                  </span>
                </motion.div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <motion.h3
                    className="text-xl font-semibold font-sans"
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
                    {milestone.title}
                  </motion.h3>
                  <motion.span
                    className="px-3 py-1 rounded-full text-xs font-medium font-sans"
                    style={{
                      background: milestone.status === "Complete" ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.05)",
                      color: milestone.status === "Complete" ? "rgba(16, 185, 129, 0.7)" : "rgba(255, 255, 255, 0.55)",
                    }}
                    whileHover={{
                      scale: 1.05,
                      background: milestone.status === "Complete" ? "rgba(16, 185, 129, 0.25)" : "rgba(255, 255, 255, 0.1)",
                      transition: { duration: 0.3 },
                    }}
                  >
                    {milestone.status}
                  </motion.span>
                </div>
                <p className="font-sans" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                  {milestone.desc}
                </p>
              </div>
            </VeilCard>
          ))}
        </div>
      </div>
    </section>
  )
}
