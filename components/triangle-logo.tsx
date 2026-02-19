"use client"

import { useEffect, useState, useRef } from "react"

export function TriangleLogo({ size }: { size?: number } = {}) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }

      rafRef.current = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 10
        const y = (e.clientY / window.innerHeight - 0.5) * 10
        setRotation({ x: y, y: -x })
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="transition-transform duration-[1500ms] ease-out cursor-pointer"
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
      }}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: isHovered
            ? "drop-shadow(0 0 12px rgba(16, 185, 129, 0.8)) drop-shadow(0 0 24px rgba(16, 185, 129, 0.6)) drop-shadow(0 0 36px rgba(16, 185, 129, 0.4)) brightness(1.5)"
            : "drop-shadow(0 0 4px rgba(16, 185, 129, 0.2)) drop-shadow(0 0 8px rgba(16, 185, 129, 0.1))",
          transition: "filter 1.5s ease",
        }}
      >
        <defs>
          <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isHovered ? "rgba(16, 185, 129, 0.4)" : "rgba(255, 255, 255, 0.12)"}>
              <animate
                attributeName="stopColor"
                values="rgba(16, 185, 129, 0.4); rgba(16, 185, 129, 0.6); rgba(16, 185, 129, 0.4)"
                dur="2s"
                repeatCount="indefinite"
                begin={isHovered ? "0s" : "indefinite"}
              />
            </stop>
            <stop offset="30%" stopColor={isHovered ? "rgba(16, 185, 129, 0.3)" : "rgba(255, 255, 255, 0.08)"}>
              <animate
                attributeName="stopColor"
                values="rgba(16, 185, 129, 0.3); rgba(16, 185, 129, 0.5); rgba(16, 185, 129, 0.3)"
                dur="2s"
                repeatCount="indefinite"
                begin={isHovered ? "0s" : "indefinite"}
              />
            </stop>
            <stop offset="60%" stopColor={isHovered ? "rgba(16, 185, 129, 0.5)" : "rgba(16, 185, 129, 0.15)"}>
              <animate
                attributeName="stopColor"
                values="rgba(16, 185, 129, 0.5); rgba(16, 185, 129, 0.7); rgba(16, 185, 129, 0.5)"
                dur="2s"
                repeatCount="indefinite"
                begin={isHovered ? "0s" : "indefinite"}
              />
            </stop>
            <stop offset="100%" stopColor={isHovered ? "rgba(16, 185, 129, 0.35)" : "rgba(255, 255, 255, 0.1)"}>
              <animate
                attributeName="stopColor"
                values="rgba(16, 185, 129, 0.35); rgba(16, 185, 129, 0.55); rgba(16, 185, 129, 0.35)"
                dur="2s"
                repeatCount="indefinite"
                begin={isHovered ? "0s" : "indefinite"}
              />
            </stop>
          </linearGradient>
        </defs>
        <path
          d="M24 40 L8 12 L40 12 Z"
          fill="url(#triangleGradient)"
          stroke={isHovered ? "rgba(16, 185, 129, 0.6)" : "rgba(255, 255, 255, 0.15)"}
          strokeWidth={isHovered ? "1.5" : "1"}
          style={{
            transition: "stroke 1.5s ease, stroke-width 1.5s ease",
          }}
        />
      </svg>
    </div>
  )
}

export default TriangleLogo
