"use client"

import { useEffect, useRef } from "react"

export default function FilmGrain() {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = canvas.current
    if (!c) return
    const ctx = c.getContext("2d")
    if (!ctx) return

    // Reduced motion check
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let raf: number
    const resize = () => {
      c.width = window.innerWidth / 2
      c.height = window.innerHeight / 2
    }
    resize()
    window.addEventListener("resize", resize)

    function draw() {
      const w = c!.width
      const h = c!.height
      const img = ctx!.createImageData(w, h)
      const d = img.data
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255
        d[i] = d[i + 1] = d[i + 2] = v
        d[i + 3] = 12 // very subtle
      }
      ctx!.putImageData(img, 0, 0)
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvas}
      className="fixed inset-0 z-[90] pointer-events-none"
      style={{
        width: "100vw",
        height: "100vh",
        opacity: 0.4,
        mixBlendMode: "overlay",
      }}
    />
  )
}
