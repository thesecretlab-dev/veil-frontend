"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef, type ReactNode } from "react"

/* ── Shared interactive card with 3D tilt, border glow, and spring physics ── */
export default function VeilCard({
  children,
  className = "",
  emerald = false,
  style,
}: {
  children: ReactNode
  className?: string
  emerald?: boolean
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)

  const rotateX = useSpring(useTransform(y, [0, 1], [3, -3]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [0, 1], [-3, 3]), { stiffness: 300, damping: 30 })

  function handleMove(e: React.PointerEvent) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - rect.left) / rect.width)
    y.set((e.clientY - rect.top) / rect.height)
  }

  function handleLeave() {
    x.set(0.5)
    y.set(0.5)
  }

  const base = emerald ? "rgba(16, 185, 129, 0.03)" : "rgba(0, 0, 0, 0.3)"
  const border = emerald ? "rgba(16, 185, 129, 0.08)" : "rgba(16, 185, 129, 0.1)"
  const hoverBorder = emerald ? "rgba(16, 185, 129, 0.25)" : "rgba(16, 185, 129, 0.2)"
  const hoverShadow = "0 0 30px rgba(16,185,129,0.08), 0 4px 20px rgba(0,0,0,0.3)"

  return (
    <motion.div
      ref={ref}
      className={`rounded-xl ${className}`}
      style={{
        background: base,
        backdropFilter: "blur(15px)",
        border: `1px solid ${border}`,
        perspective: 800,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        ...style,
      }}
      whileHover={{
        borderColor: hoverBorder,
        boxShadow: hoverShadow,
        transition: { duration: 0.6, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.985, transition: { duration: 0.1 } }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
    </motion.div>
  )
}
