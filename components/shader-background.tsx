"use client"

import { useEffect, useRef } from "react"
import { clock, effect, frameLoop, init, surface } from "vgpu"
import shaderSource from "@/shaders/veil-mesh.wgsl"

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let disposed = false
    let gpu: Awaited<ReturnType<typeof init>> | null = null

    ;(async () => {
      try {
        gpu = await init({ powerPreference: "low-power" })
        if (disposed) {
          gpu.dispose()
          return
        }
        const out = surface(gpu, canvas, { dpr: [1, 1.5], alphaMode: "opaque" })
        const fx = effect(gpu, shaderSource, {
          set: { params: { resolution: out.size, time: 0 } },
        })
        out.onResize(({ width, height }) => {
          fx.set({ params: { resolution: [width, height] } })
        })
        const g = gpu
        frameLoop(g, (f) => {
          fx.set({ params: { time: clock(g).time } })
          f.pass(out, fx)
        }, { fps: 30 })
      } catch (err) {
        console.warn("vgpu mesh background unavailable", err)
      }
    })()

    return () => {
      disposed = true
      gpu?.dispose()
    }
  }, [])

  return (
    <div className="fixed inset-0 w-full h-full bg-black -z-10">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}

export default ShaderBackground
