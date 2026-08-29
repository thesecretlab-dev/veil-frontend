"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

type Kind = "validator" | "agent" | "rail"

type NetNode = {
  id: string
  label: string
  short: string
  x: number
  y: number
  size: number
  type: Kind
  ox: number
  oy: number
}

const SEED: Omit<NetNode, "ox" | "oy">[] = [
  { id: "veil-1", label: "NodeID-HMqe…hy94H", short: "VEIL-1", x: 0.5, y: 0.4, size: 26, type: "validator" },
  { id: "anima", label: "Agent child", short: "ANIMA-1", x: 0.72, y: 0.62, size: 20, type: "agent" },
  { id: "companion", label: "Companion 31337", short: "EVM", x: 0.28, y: 0.62, size: 18, type: "rail" },
  { id: "router", label: "Order router", short: "9098", x: 0.18, y: 0.34, size: 14, type: "rail" },
  { id: "tape", label: "Live tape", short: "TAPE", x: 0.82, y: 0.34, size: 14, type: "rail" },
]

const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [2, 3],
  [1, 4],
]

export function NetworkVisualization({ compact = false }: { compact?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const hoverRef = useRef<number | null>(null)
  const heightRef = useRef(0)
  const pulseRef = useRef(0)
  const pulses = useRef<{ edge: number; t: number; speed: number }[]>([])
  const nodes = useRef<NetNode[]>(SEED.map((n) => ({ ...n, ox: n.x, oy: n.y })))
  const [height, setHeight] = useState<number | null>(null)
  const [hover, setHover] = useState<number | null>(null)

  useEffect(() => {
    let dead = false
    const pull = async () => {
      try {
        const res = await fetch("/api/live-tape", { cache: "no-store" })
        const json = (await res.json()) as { height?: number | null }
        if (dead || typeof json.height !== "number") return
        if (json.height !== heightRef.current) {
          heightRef.current = json.height
          setHeight(json.height)
          pulseRef.current = 1
          const fromVal = EDGES.map((e, i) => (e[0] === 0 || e[1] === 0 ? i : -1)).filter((i) => i >= 0)
          const edge = fromVal[Math.floor(Math.random() * fromVal.length)]
          pulses.current.push({ edge, t: 0, speed: 0.014 + Math.random() * 0.01 })
        }
      } catch {
        /* keep last */
      }
    }
    void pull()
    const id = window.setInterval(() => void pull(), 2000)
    return () => {
      dead = true
      window.clearInterval(id)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const box = boxRef.current
    if (!canvas || !box) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    let raf = 0
    let t = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = box.getBoundingClientRect()
      canvas.width = r.width * dpr
      canvas.height = r.height * dpr
      canvas.style.width = `${r.width}px`
      canvas.style.height = `${r.height}px`
    }
    resize()
    window.addEventListener("resize", resize)

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.width / dpr
      const h = canvas.height / dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      t += 0.005
      const ns = nodes.current
      for (let i = 0; i < ns.length; i++) {
        ns[i].x = ns[i].ox + Math.sin(t * 0.7 + i * 1.3) * 0.01
        ns[i].y = ns[i].oy + Math.cos(t * 0.55 + i * 1.1) * 0.008
      }
      for (const [a, b] of EDGES) {
        ctx.beginPath()
        ctx.moveTo(ns[a].x * w, ns[a].y * h)
        ctx.lineTo(ns[b].x * w, ns[b].y * h)
        ctx.strokeStyle = "rgba(16,185,129,0.1)"
        ctx.lineWidth = 1
        ctx.stroke()
      }
      for (let i = pulses.current.length - 1; i >= 0; i--) {
        const p = pulses.current[i]
        p.t += p.speed
        if (p.t > 1) {
          pulses.current.splice(i, 1)
          continue
        }
        const [ai, bi] = EDGES[p.edge]
        const px = (ns[ai].x + (ns[bi].x - ns[ai].x) * p.t) * w
        const py = (ns[ai].y + (ns[bi].y - ns[ai].y) * p.t) * h
        const a = p.t < 0.2 ? p.t / 0.2 : p.t > 0.8 ? (1 - p.t) / 0.2 : 1
        const g = ctx.createRadialGradient(px, py, 0, px, py, 12)
        g.addColorStop(0, `rgba(16,185,129,${0.55 * a})`)
        g.addColorStop(1, "rgba(16,185,129,0)")
        ctx.beginPath()
        ctx.arc(px, py, 12, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
        ctx.beginPath()
        ctx.arc(px, py, 2.4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(52,211,153,${0.9 * a})`
        ctx.fill()
      }
      for (let i = 0; i < ns.length; i++) {
        const n = ns[i]
        const nx = n.x * w
        const ny = n.y * h
        const hot = hoverRef.current === i
        if (n.type !== "rail") {
          const pulse = Math.sin(t * 2 + i) * 0.15 + 0.85
          const glow = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.size * 2.4 * pulse)
          glow.addColorStop(0, `rgba(16,185,129,${0.1 * pulse})`)
          glow.addColorStop(1, "rgba(16,185,129,0)")
          ctx.beginPath()
          ctx.arc(nx, ny, n.size * 2.4 * pulse, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.fill()
        }
        if (i === 0 && pulseRef.current > 0) {
          const bp = pulseRef.current
          ctx.beginPath()
          ctx.arc(nx, ny, n.size + (1 - bp) * 36, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(16,185,129,${bp * 0.4})`
          ctx.lineWidth = 1.4
          ctx.stroke()
          pulseRef.current = Math.max(0, bp - 0.016)
        }
        ctx.beginPath()
        ctx.arc(nx, ny, n.size * (hot ? 1.12 : 1), 0, Math.PI * 2)
        ctx.fillStyle =
          n.type === "validator"
            ? `rgba(16,185,129,${hot ? 0.22 : 0.1})`
            : n.type === "agent"
              ? `rgba(52,211,153,${hot ? 0.16 : 0.07})`
              : `rgba(255,255,255,${hot ? 0.07 : 0.025})`
        ctx.fill()
        ctx.strokeStyle =
          n.type === "validator"
            ? "rgba(16,185,129,0.50)"
            : n.type === "agent"
              ? "rgba(52,211,153,0.3)"
              : "rgba(255,255,255,0.08)"
        ctx.lineWidth = n.type === "validator" ? 1.5 : 1
        ctx.stroke()
        if (n.type !== "rail") {
          ctx.beginPath()
          ctx.arc(nx, ny, 2.8, 0, Math.PI * 2)
          ctx.fillStyle = "rgba(52,211,153,0.85)"
          ctx.fill()
        }
        ctx.font = "500 9px 'Space Grotesk', sans-serif"
        ctx.textAlign = "center"
        ctx.fillStyle = n.type === "validator" ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.28)"
        ctx.fillText(n.short, nx, ny + n.size + 13)
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [])

  const onMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mx = (e.clientX - rect.left) / rect.width
    const my = (e.clientY - rect.top) / rect.height
    let hit: number | null = null
    let best = 0.045
    nodes.current.forEach((n, i) => {
      const d = Math.hypot(mx - n.x, my - n.y)
      if (d < best) {
        best = d
        hit = i
      }
    })
    hoverRef.current = hit
    setHover(hit)
  }, [])

  const label = hover != null ? nodes.current[hover]?.label : null

  return (
    <div
      ref={boxRef}
      className="relative overflow-hidden rounded-[20px]"
      style={{
        background: "rgba(255,255,255,0.012)",
        border: "1px solid rgba(255,255,255,0.045)",
        height: compact ? 220 : 280,
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full cursor-crosshair"
        onMouseMove={onMove}
        onMouseLeave={() => {
          hoverRef.current = null
          setHover(null)
        }}
      />
      <div className="absolute top-4 left-5 z-10 flex items-center gap-2.5 pointer-events-none">
        <motion.span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: "rgb(16,185,129)" }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
        <span
          className="text-[9px] tracking-[0.22em] uppercase"
          style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.62)" }}
        >
          Local mesh
        </span>
      </div>
      <div className="absolute top-4 right-5 z-10 text-right pointer-events-none">
        <div
          className="text-[8px] tracking-[0.18em] uppercase"
          style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.25)" }}
        >
          Height
        </div>
        <div
          className="text-lg tabular-nums"
          style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(16,185,129,0.84)" }}
        >
          {height != null ? height.toLocaleString() : "—"}
        </div>
      </div>
      <div className="absolute bottom-4 left-5 right-5 z-10 flex items-end justify-between pointer-events-none">
        <span
          className="text-[10px]"
          style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.31)", fontWeight: 300 }}
        >
          {label || "1 validator · companion rails · local only"}
        </span>
        {!compact && (
          <Link
            href="/explorer"
            className="pointer-events-auto text-[10px] tracking-[0.16em] uppercase"
            style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.50)" }}
          >
            Explorer →
          </Link>
        )}
      </div>
    </div>
  )
}
