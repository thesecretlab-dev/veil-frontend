"use client"

import { motion } from "framer-motion"
import VeilCard from "./veil-card"
import CharReveal from "./char-reveal"

export default function ProblemSection() {
  return (
    <section id="problem" className="relative w-full min-h-screen flex items-center justify-center px-6 py-24">
      <div className="max-w-5xl">
        <CharReveal
          text="Friction"
          tag="h2"
          className="text-5xl md:text-6xl font-bold tracking-wide mb-12 font-sans cursor-default"
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
              Prediction Markets Leak Alpha
            </motion.h3>
            <p className="text-lg leading-relaxed font-sans" style={{ color: "rgba(255, 255, 255, 0.55)" }}>
              Today{"\u2019"}s on-chain prediction markets expose every order to public mempools. Bots watch, copy, and sandwich
              trades. Market makers who invest in sophisticated models end up subsidizing free riders. The result: thin
              liquidity, wide spreads, and serious traders sitting on the sidelines.
            </p>
          </VeilCard>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Front-Running", desc: "Orders visible before execution" },
              { title: "Copy Trading", desc: "Sophisticated strategies exploited" },
              { title: "Thin Liquidity", desc: "Traders avoid leaky venues" },
            ].map((item, i) => (
              <VeilCard key={i} className="p-6" emerald>
                <motion.h4
                  className="text-xl font-semibold mb-2 font-sans"
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
                  {item.title}
                </motion.h4>
                <p className="font-sans" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                  {item.desc}
                </p>
              </VeilCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
