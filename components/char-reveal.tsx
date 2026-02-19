"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

/* Split text into characters and stagger-reveal on scroll */
export default function CharReveal({
  text,
  className = "",
  style,
  tag = "h2",
  stagger = 0.02,
  duration = 0.6,
}: {
  text: string
  className?: string
  style?: React.CSSProperties
  tag?: "h1" | "h2" | "h3" | "span"
  stagger?: number
  duration?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })
  const Tag = motion[tag]

  // Split into words, then chars within each word
  const words = text.split(" ")

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ ...style, display: "flex", flexWrap: "wrap", gap: "0.25em" }}
    >
      {words.map((word, wi) => (
        <span key={wi} style={{ display: "inline-flex", whiteSpace: "nowrap" }}>
          {word.split("").map((char, ci) => {
            const idx = words.slice(0, wi).join(" ").length + (wi > 0 ? 1 : 0) + ci
            return (
              <motion.span
                key={ci}
                initial={{ opacity: 0, y: 30, filter: "blur(6px)", rotateX: -60 }}
                animate={inView ? {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  rotateX: 0,
                } : {}}
                transition={{
                  duration,
                  delay: idx * stagger,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ display: "inline-block", transformOrigin: "bottom" }}
              >
                {char}
              </motion.span>
            )
          })}
        </span>
      ))}
    </Tag>
  )
}
