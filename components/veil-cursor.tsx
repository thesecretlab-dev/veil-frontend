"use client"

import { useEffect, useRef, useState } from "react"

export default function VeilCursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [hovering, setHovering] = useState(false)
  const hue = useRef(160) // emerald starting hue

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (!visible) setVisible(true)
    }
    const onDown = () => setClicking(true)
    const onUp = () => setClicking(false)
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    // Detect hoverable elements
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (t.closest("a, button, [role=button], input, textarea, select, .magnetic")) {
        setHovering(true)
      }
    }
    const onOut = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (t.closest("a, button, [role=button], input, textarea, select, .magnetic")) {
        setHovering(false)
      }
    }

    window.addEventListener("mousemove", onMove)
    window.addEventListener("mousedown", onDown)
    window.addEventListener("mouseup", onUp)
    document.addEventListener("mouseleave", onLeave)
    document.addEventListener("mouseenter", onEnter)
    document.addEventListener("mouseover", onOver)
    document.addEventListener("mouseout", onOut)

    let raf: number
    function loop() {
      // Lerp ring toward dot
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12

      // Slow hue cycle
      hue.current = (hue.current + 0.02) % 360

      if (dot.current) {
        dot.current.style.transform = `translate(${pos.current.x - 3}px, ${pos.current.y - 3}px)`
      }
      if (ring.current) {
        const s = clicking ? 0.6 : hovering ? 1.8 : 1
        ring.current.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px) scale(${s})`
        ring.current.style.borderColor = `hsla(${hue.current}, 70%, 55%, ${hovering ? 0.35 : 0.12})`
      }

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    // Hide default cursor
    document.documentElement.style.cursor = "none"

    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mousedown", onDown)
      window.removeEventListener("mouseup", onUp)
      document.removeEventListener("mouseleave", onLeave)
      document.removeEventListener("mouseenter", onEnter)
      document.removeEventListener("mouseover", onOver)
      document.removeEventListener("mouseout", onOut)
      cancelAnimationFrame(raf)
      document.documentElement.style.cursor = ""
    }
  }, [visible, clicking, hovering])

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return null

  return (
    <>
      {/* Dot */}
      <div
        ref={dot}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "rgba(16, 185, 129, 0.7)",
          boxShadow: "0 0 8px rgba(16, 185, 129, 0.4)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease",
          mixBlendMode: "difference",
        }}
      />
      {/* Ring */}
      <div
        ref={ring}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1px solid rgba(16, 185, 129, 0.12)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease, border-color 0.4s ease, transform 0.15s ease",
          mixBlendMode: "difference",
        }}
      />
    </>
  )
}
