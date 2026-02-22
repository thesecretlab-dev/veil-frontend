"use client"

import type React from "react"

import { useState } from "react"

interface SmokeTextProps {
  text: string
  author: string
}

export default function SmokeText({ text, author }: SmokeTextProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Split text into individual characters while preserving spaces
  const chars = text.split("")
  const authorChars = author.split("")

  return (
    <div
      className="mt-8 max-w-3xl px-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style jsx>{`
        @keyframes coalesce {
          0% {
            opacity: 0;
            transform: translate(var(--x-start), var(--y-start)) scale(0.8);
            filter: blur(8px);
          }
          60% {
            opacity: 1;
            filter: blur(0.2px);
          }
          100% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
            filter: blur(0px);
          }
        }

        @keyframes dissipate {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
            filter: blur(0px);
          }
          100% {
            opacity: 0;
            transform: translate(var(--x-end), var(--y-end)) scale(0.6);
            filter: blur(10px);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes shimmer {
          0%, 100% {
            text-shadow: 
              0 0 10px rgba(16, 185, 129, 0.2),
              0 0 20px rgba(16, 185, 129, 0.1);
          }
          50% {
            text-shadow: 
              0 0 15px rgba(16, 185, 129, 0.3),
              0 0 25px rgba(16, 185, 129, 0.15);
          }
        }

        .char {
          display: inline-block;
          opacity: 0;
          animation: ${isHovered ? "coalesce" : "dissipate"} 0.8s ease-out forwards;
          animation-delay: calc(var(--index) * 0.02s);
        }

        .char.hovered {
          animation: coalesce 0.8s ease-out forwards, float 3s ease-in-out infinite, shimmer 2s ease-in-out infinite;
          animation-delay: calc(var(--index) * 0.02s), calc(var(--index) * 0.02s + 0.8s), calc(var(--index) * 0.02s + 0.8s);
        }
      `}</style>

      <blockquote className="text-center space-y-4">
        <p className="text-xl md:text-2xl font-light tracking-wide leading-relaxed">
          {chars.map((char, index) => {
            // Generate random start and end positions for smoke effect
            const xStart = `${(Math.random() - 0.5) * 100}px`
            const yStart = `${Math.random() * 50 + 20}px`
            const xEnd = `${(Math.random() - 0.5) * 80}px`
            const yEnd = `${-Math.random() * 40 - 10}px`

            return (
              <span
                key={`char-${index}`}
                className={`char ${isHovered ? "hovered" : ""}`}
                style={
                  {
                    "--index": index,
                    "--x-start": xStart,
                    "--y-start": yStart,
                    "--x-end": xEnd,
                    "--y-end": yEnd,
                    color: "rgba(255, 255, 255, 0.66)",
                    textShadow: `
                    0 0 10px rgba(16, 185, 129, 0.22),
                    0 0 20px rgba(16, 185, 129, 0.12),
                    2px 2px 6px rgba(0, 0, 0, 0.45)
                  `,
                    WebkitTextStroke: "0.35px rgba(255, 255, 255, 0.22)",
                  } as React.CSSProperties
                }
              >
                {char === " " ? "\u00A0" : char}
              </span>
            )
          })}
        </p>
        <cite className="block text-sm md:text-base not-italic">
          {authorChars.map((char, index) => {
            const xStart = `${(Math.random() - 0.5) * 80}px`
            const yStart = `${Math.random() * 40 + 15}px`
            const xEnd = `${(Math.random() - 0.5) * 60}px`
            const yEnd = `${-Math.random() * 30 - 5}px`

            return (
              <span
                key={`author-${index}`}
                className={`char ${isHovered ? "hovered" : ""}`}
                style={
                  {
                    "--index": chars.length + index,
                    "--x-start": xStart,
                    "--y-start": yStart,
                    "--x-end": xEnd,
                    "--y-end": yEnd,
                    color: "rgba(255, 255, 255, 0.55)",
                    textShadow: `
                    0 0 8px rgba(16, 185, 129, 0.15),
                    2px 2px 5px rgba(0, 0, 0, 0.45)
                  `,
                  } as React.CSSProperties
                }
              >
                {char === " " ? "\u00A0" : char}
              </span>
            )
          })}
        </cite>
      </blockquote>
    </div>
  )
}
