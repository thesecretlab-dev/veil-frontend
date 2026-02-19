"use client"

import { motion } from "framer-motion"
import VeilCard from "./veil-card"
import CharReveal from "./char-reveal"

export default function SolutionSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-5xl">
        <CharReveal
          text="Solutions"
          tag="h2"
          className="text-4xl md:text-5xl font-bold tracking-wide mb-12 font-sans cursor-default"
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

        <div className="space-y-8">
          <VeilCard className="p-8 rounded-2xl" style={{ backdropFilter: "blur(20px)" }}>
            <motion.h3
              className="text-3xl font-semibold mb-4 font-sans cursor-default"
              style={{
                color: "rgba(255, 255, 255, 0.25)",
                textShadow: "0 0 15px rgba(16, 185, 129, 0.2), inset 0 0 5px rgba(255, 255, 255, 0.1)",
                WebkitTextStroke: "0.5px rgba(255, 255, 255, 0.15)",
                filter: "blur(0.3px)",
              }}
              whileHover={{
                color: "rgba(255, 255, 255, 0.45)",
                filter: "blur(0.2px) brightness(1.4)",
                textShadow: `
                  0 0 20px rgba(16, 185, 129, 0.7),
                  0 0 40px rgba(16, 185, 129, 0.5),
                  0 0 60px rgba(16, 185, 129, 0.3),
                  inset 0 0 15px rgba(255, 255, 255, 0.2)
                `,
                transition: { duration: 0.6 },
              }}
            >
              Batch Auctions + Sealed Orders
            </motion.h3>
            <p className="text-lg leading-relaxed mb-6 font-sans" style={{ color: "rgba(255, 255, 255, 0.55)" }}>
              VEIL batches orders in short windows (2-5 seconds), clears them as a batch, and only publishes final
              prices and fills{"\u2014"}never individual orders. You click once, your order is sealed. A few seconds later, a
              batch price prints. No visible order trail. No mempool gossip to exploit.
            </p>
            <div className="flex flex-wrap items-center gap-4 font-sans" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
              {["Sealed Commitments", "Batch Clearing", "Privacy First"].map((label) => (
                <motion.div
                  key={label}
                  className="flex items-center gap-2"
                  whileHover={{ color: "rgba(255, 255, 255, 0.65)", x: 2, transition: { duration: 0.3 } }}
                >
                  <motion.div
                    className="w-3 h-3 rounded-full bg-emerald-500/30"
                    whileHover={{ scale: 1.4, backgroundColor: "rgba(16,185,129,0.6)", transition: { duration: 0.3 } }}
                  />
                  <span>{label}</span>
                </motion.div>
              ))}
            </div>
          </VeilCard>
        </div>
      </div>
    </section>
  )
}
