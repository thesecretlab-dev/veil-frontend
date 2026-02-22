"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

export default function VeilPreloader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"draw" | "text" | "done">("draw")

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 1200)
    const t2 = setTimeout(() => setPhase("done"), 2800)
    const t3 = setTimeout(onComplete, 3400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onComplete])

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black"
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Triangle draws itself */}
          <motion.svg
            width="80" height="80" viewBox="0 0 48 48" fill="none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.path
              d="M24 42 L6 8 L42 8 Z"
              stroke="rgba(16, 185, 129, 0.6)"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.path
              d="M24 42 L6 8 L42 8 Z"
              fill="rgba(16, 185, 129, 0.08)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            />
          </motion.svg>

          {/* VEIL text */}
          <motion.div
            className="mt-6 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={phase === "text" ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            <motion.span
              style={{
                fontSize: "14px",
                letterSpacing: "0.5em",
                color: "rgba(255, 255, 255, 0.25)",
                fontFamily: "var(--font-space-grotesk)",
                fontWeight: 600,
              }}
              initial={{ y: 20 }}
              animate={phase === "text" ? { y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              VEIL
            </motion.span>
          </motion.div>

          {/* Progress line */}
          <motion.div
            className="mt-8 h-px w-32"
            style={{ background: "rgba(16, 185, 129, 0.1)" }}
          >
            <motion.div
              className="h-full"
              style={{
                background: "linear-gradient(90deg, rgba(16,185,129,0.4), rgba(16,185,129,0.8), rgba(16,185,129,0.4))",
                boxShadow: "0 0 12px rgba(16,185,129,0.3)",
              }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
