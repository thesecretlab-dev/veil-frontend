"use client"

import { memo, Suspense, useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { NeuroNoise } from "@paper-design/shaders-react"

type TapeSnap = {
  ok?: boolean
  height?: number | null
  markets?: number
  pool?: { reserve0?: number; reserve1?: number } | null
}

const MESH_NODES: { short: string; kind: "validator" | "agent" | "rail"; pos: [number, number, number] }[] = [
  { short: "VEIL-1", kind: "validator", pos: [0, 0.08, 0] },
  { short: "ANIMA-1", kind: "agent", pos: [0, 1.35, 0] },
  { short: "EVM", kind: "rail", pos: [-1.15, -0.48, 0.68] },
  { short: "9098", kind: "rail", pos: [1.15, -0.48, 0.68] },
  { short: "TAPE", kind: "rail", pos: [0, -0.48, -1.32] },
]
const MESH_LINKS: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [2, 3],
  [1, 4],
]

function useDotMap() {
  return useMemo(() => {
    const size = 64
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")
    if (!ctx) return null
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    g.addColorStop(0, "rgba(255,255,255,1)")
    g.addColorStop(0.28, "rgba(255,255,255,0.78)")
    g.addColorStop(0.62, "rgba(255,255,255,0.20)")
    g.addColorStop(1, "rgba(255,255,255,0)")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }, [])
}

function FieldDust({ count = 420 }: { count?: number }) {
  const map = useDotMap()
  const mesh = useRef<THREE.Points>(null)
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
      vel[i * 3] = (Math.random() - 0.5) * 0.006
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.005
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005
    }
    return [pos, vel]
  }, [count])

  useFrame((state) => {
    if (!mesh.current) return
    const attr = mesh.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = attr.array as Float32Array
    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3]
      arr[i * 3 + 1] += velocities[i * 3 + 1]
      arr[i * 3 + 2] += velocities[i * 3 + 2]
      for (let j = 0; j < 3; j++) {
        if (Math.abs(arr[i * 3 + j]) > 7) velocities[i * 3 + j] *= -1
      }
    }
    attr.needsUpdate = true
    mesh.current.rotation.y = state.clock.elapsedTime * 0.028
    const mat = mesh.current.material as THREE.PointsMaterial
    mat.opacity = 0.38 + Math.sin(state.clock.elapsedTime * 0.7) * 0.12
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        map={map ?? undefined}
        size={0.085}
        color="#10b981"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        alphaTest={0.04}
      />
    </points>
  )
}

function CoreDust({ count = 140 }: { count?: number }) {
  const map = useDotMap()
  const mesh = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const verts = [
      [0, 2.2, 0],
      [-2.07, -0.73, 1.2],
      [2.07, -0.73, 1.2],
      [0, -0.73, -2.4],
    ]
    for (let i = 0; i < count; i++) {
      const a = verts[Math.floor(Math.random() * 4)]
      const b = verts[Math.floor(Math.random() * 4)]
      const t = Math.random()
      const n = 0.28
      pos[i * 3] = a[0] * t + b[0] * (1 - t) + (Math.random() - 0.5) * n
      pos[i * 3 + 1] = a[1] * t + b[1] * (1 - t) + (Math.random() - 0.5) * n
      pos[i * 3 + 2] = a[2] * t + b[2] * (1 - t) + (Math.random() - 0.5) * n
    }
    return pos
  }, [count])

  useFrame((state) => {
    if (!mesh.current) return
    mesh.current.rotation.y = -state.clock.elapsedTime * 0.06
    mesh.current.rotation.x = state.clock.elapsedTime * 0.03
    const mat = mesh.current.material as THREE.PointsMaterial
    mat.opacity = 0.28 + Math.sin(state.clock.elapsedTime * 0.8) * 0.12
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        map={map ?? undefined}
        size={0.1}
        color="#34d399"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        alphaTest={0.04}
      />
    </points>
  )
}

function MeshLive() {
  const [tape, setTape] = useState<TapeSnap | null>(null)
  const pulses = useRef<{ link: number; t: number; speed: number }[]>([])
  const lastH = useRef<number | null>(null)
  const pulseMesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const core = useRef<THREE.MeshBasicMaterial>(null)

  useEffect(() => {
    let dead = false
    const pull = async () => {
      try {
        const res = await fetch("/api/live-tape", { cache: "no-store" })
        const json = (await res.json()) as TapeSnap
        if (dead) return
        setTape(json)
        const h = typeof json.height === "number" ? json.height : null
        if (h != null && h !== lastH.current) {
          lastH.current = h
          const fromCore = MESH_LINKS.map((e, i) => (e[0] === 0 || e[1] === 0 ? i : -1)).filter((i) => i >= 0)
          pulses.current.push({
            link: fromCore[Math.floor(Math.random() * fromCore.length)] ?? 0,
            t: 0,
            speed: 0.018 + Math.random() * 0.012,
          })
        }
      } catch {
        /* keep last */
      }
    }
    void pull()
    const id = window.setInterval(() => void pull(), 2500)
    return () => {
      dead = true
      window.clearInterval(id)
    }
  }, [])

  const live = Boolean(tape?.ok || (typeof tape?.height === "number" && tape.height > 0))

  useFrame((state) => {
    if (core.current) {
      core.current.opacity = (live ? 0.85 : 0.28) + Math.sin(state.clock.elapsedTime * 1.7) * 0.12
    }
    for (let i = pulses.current.length - 1; i >= 0; i--) {
      pulses.current[i].t += pulses.current[i].speed
      if (pulses.current[i].t > 1) pulses.current.splice(i, 1)
    }
    if (!pulseMesh.current) return
    for (let i = 0; i < 8; i++) {
      const p = pulses.current[i]
      if (!p) {
        dummy.scale.setScalar(0)
        dummy.position.set(0, 0, 0)
      } else {
        const [ai, bi] = MESH_LINKS[p.link]
        const a = MESH_NODES[ai].pos
        const b = MESH_NODES[bi].pos
        dummy.position.set(a[0] + (b[0] - a[0]) * p.t, a[1] + (b[1] - a[1]) * p.t, a[2] + (b[2] - a[2]) * p.t)
        dummy.scale.setScalar(1)
      }
      dummy.updateMatrix()
      pulseMesh.current.setMatrixAt(i, dummy.matrix)
    }
    pulseMesh.current.instanceMatrix.needsUpdate = true
  })

  const linkGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pts: number[] = []
    for (const [a, b] of MESH_LINKS) pts.push(...MESH_NODES[a].pos, ...MESH_NODES[b].pos)
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3))
    return g
  }, [])

  return (
    <group>
      <lineSegments geometry={linkGeo}>
        <lineBasicMaterial color="#10b981" transparent opacity={live ? 0.28 : 0.1} />
      </lineSegments>
      {MESH_NODES.map((n) => {
        const r = n.kind === "validator" ? 0.08 : n.kind === "agent" ? 0.05 : 0.035
        const color = n.kind === "validator" ? "#34d399" : n.kind === "agent" ? "#6ee7b7" : "#a7f3d0"
        return (
          <group key={n.short} position={n.pos}>
            {n.kind !== "validator" && (
              <mesh>
                <sphereGeometry args={[r * 2.4, 16, 16]} />
                <meshBasicMaterial color={color} transparent opacity={0.07} depthWrite={false} />
              </mesh>
            )}
            <mesh>
              <sphereGeometry args={[r, 16, 16]} />
              <meshBasicMaterial
                ref={n.kind === "validator" ? core : undefined}
                color={color}
                transparent
                opacity={live ? 0.95 : 0.35}
              />
            </mesh>
          </group>
        )
      })}
      <instancedMesh ref={pulseMesh} args={[undefined, undefined, 8]}>
        <sphereGeometry args={[0.04, 10, 10]} />
        <meshBasicMaterial color="#ecfdf5" transparent opacity={0.9} />
      </instancedMesh>
    </group>
  )
}

function VeilTetra() {
  const cage = useRef<THREE.Group>(null)
  const outer = useRef<THREE.Group>(null)
  const inner = useRef<THREE.Group>(null)
  const ico = useMemo(() => new THREE.IcosahedronGeometry(3.2, 0), [])
  const geo = useMemo(() => new THREE.TetrahedronGeometry(2.4, 0), [])
  const mid = useMemo(() => new THREE.OctahedronGeometry(1.55, 0), [])
  const core = useMemo(() => new THREE.TetrahedronGeometry(0.95, 0), [])
  const icoEdges = useMemo(() => new THREE.EdgesGeometry(ico), [ico])
  const edges = useMemo(() => new THREE.EdgesGeometry(geo), [geo])
  const midEdges = useMemo(() => new THREE.EdgesGeometry(mid), [mid])
  const coreEdges = useMemo(() => new THREE.EdgesGeometry(core), [core])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (cage.current) {
      cage.current.rotation.y = t * 0.016
      cage.current.rotation.x = Math.sin(t * 0.012) * 0.06
    }
    if (outer.current) {
      outer.current.rotation.y = t * 0.05
      outer.current.rotation.x = Math.sin(t * 0.018) * 0.1
      outer.current.rotation.z = t * 0.01
    }
    if (inner.current) {
      inner.current.rotation.y = -t * 0.08
      inner.current.rotation.x = t * 0.035
    }
  })

  return (
    <group>
      <group ref={cage}>
        <lineSegments geometry={icoEdges}>
          <lineBasicMaterial color="#065f46" transparent opacity={0.28} />
        </lineSegments>
      </group>
      <group ref={outer}>
        <MeshLive />
        <mesh geometry={geo}>
          <meshBasicMaterial color="#10b981" transparent opacity={0.05} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <lineSegments geometry={edges}>
          <lineBasicMaterial color="#6ee7b7" transparent opacity={0.95} />
        </lineSegments>
        <lineSegments geometry={midEdges}>
          <lineBasicMaterial color="#34d399" transparent opacity={0.4} />
        </lineSegments>
      </group>
      <group ref={inner}>
        <mesh geometry={core}>
          <meshBasicMaterial color="#34d399" transparent opacity={0.06} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <lineSegments geometry={coreEdges}>
          <lineBasicMaterial color="#a7f3d0" transparent opacity={0.7} />
        </lineSegments>
      </group>
    </group>
  )
}

type BoltSeg = { x: number; y: number }
type Bolt = {
  segs: BoltSeg[]
  forks: BoltSeg[][]
  born: number
  life: number
}

function displace(ax: number, ay: number, bx: number, by: number, jitter: number, detail: number): BoltSeg[] {
  if (detail < 5) return [{ x: ax, y: ay }, { x: bx, y: by }]
  const mx = (ax + bx) * 0.5 + (Math.random() - 0.5) * jitter
  const my = (ay + by) * 0.5 + (Math.random() - 0.5) * jitter * 0.4
  const left = displace(ax, ay, mx, my, jitter * 0.52, detail * 0.5)
  const right = displace(mx, my, bx, by, jitter * 0.52, detail * 0.5)
  return left.concat(right.slice(1))
}

function strokeBolt(ctx: CanvasRenderingContext2D, segs: BoltSeg[], width: number, alpha: number, color: string) {
  if (segs.length < 2 || alpha <= 0) return
  ctx.beginPath()
  ctx.moveTo(segs[0].x, segs[0].y)
  for (let i = 1; i < segs.length; i++) ctx.lineTo(segs[i].x, segs[i].y)
  ctx.strokeStyle = color
  ctx.globalAlpha = alpha
  ctx.lineWidth = width
  ctx.lineJoin = "round"
  ctx.lineCap = "round"
  ctx.stroke()
}

/** Rare emerald sheet + branching bolts over NeuroNoise. Skipped when reduce is on. */
function ThunderLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    let w = 0
    let h = 0
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)

    const rand = (a: number, b: number) => a + Math.random() * (b - a)

    const spawnBolt = (): Bolt => {
      const x0 = rand(w * 0.1, w * 0.9)
      const y0 = rand(-h * 0.06, h * 0.1)
      const x1 = x0 + rand(-w * 0.16, w * 0.16)
      const y1 = rand(h * 0.42, h * 0.88)
      const segs = displace(x0, y0, x1, y1, w * 0.07, 28)
      const forks: BoltSeg[][] = []
      const n = 1 + Math.floor(Math.random() * 2)
      for (let i = 0; i < n; i++) {
        const p = segs[Math.floor(rand(segs.length * 0.22, segs.length * 0.72))]
        if (!p) continue
        forks.push(displace(p.x, p.y, p.x + rand(-w * 0.1, w * 0.1), p.y + rand(h * 0.08, h * 0.24), w * 0.04, 14))
      }
      return { segs, forks, born: performance.now(), life: rand(240, 420) }
    }

    let bolts: Bolt[] = []
    let sheet = 0
    let nextAt = performance.now() + rand(500, 1400)
    let echoAt: number | null = null
    let raf = 0
    let hidden = document.hidden

    const onVis = () => {
      hidden = document.hidden
    }
    document.addEventListener("visibilitychange", onVis)

    const strike = (now: number, echo: boolean) => {
      const rumbleOnly = !echo && Math.random() < 0.22
      if (!rumbleOnly) bolts.push(spawnBolt())
      sheet = Math.max(sheet, echo ? 0.72 : rumbleOnly ? rand(0.22, 0.38) : rand(0.42, 0.68))
      if (!echo && !rumbleOnly && Math.random() < 0.4) echoAt = now + rand(90, 180)
      if (!echo) nextAt = now + rand(3200, 8200)
    }

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      if (hidden) {
        ctx.clearRect(0, 0, w, h)
        return
      }
      if (now >= nextAt) strike(now, false)
      if (echoAt != null && now >= echoAt) {
        echoAt = null
        strike(now, true)
      }

      ctx.clearRect(0, 0, w, h)
      sheet *= 0.88
      if (sheet < 0.004) sheet = 0

      if (sheet > 0) {
        const gx = w * (0.48 + Math.sin(now * 0.0007) * 0.1)
        const g = ctx.createRadialGradient(gx, h * 0.02, 4, w * 0.52, h * 0.16, h * 0.92)
        g.addColorStop(0, `rgba(167, 243, 208, ${sheet * 0.42})`)
        g.addColorStop(0.22, `rgba(52, 211, 153, ${sheet * 0.22})`)
        g.addColorStop(0.55, `rgba(16, 185, 129, ${sheet * 0.1})`)
        g.addColorStop(1, "rgba(0,0,0,0)")
        ctx.globalAlpha = 1
        ctx.globalCompositeOperation = "lighter"
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
        ctx.globalCompositeOperation = "source-over"
      }

      bolts = bolts.filter((b) => {
        const t = (now - b.born) / b.life
        if (t >= 1.2) return false
        let a = 0
        if (t < 0.08) a = 1
        else if (t < 0.18) a = 0.18
        else if (t < 0.4) a = 0.82
        else a = Math.max(0, 1 - (t - 0.4) / 0.6) * 0.38

        ctx.save()
        ctx.globalCompositeOperation = "lighter"
        ctx.shadowColor = "rgba(52, 211, 153, 0.85)"
        ctx.shadowBlur = 22
        strokeBolt(ctx, b.segs, 5.5, a * 0.28, "#059669")
        strokeBolt(ctx, b.segs, 2.2, a * 0.7, "#34d399")
        strokeBolt(ctx, b.segs, 0.9, a, "#ecfdf5")
        for (const fork of b.forks) {
          strokeBolt(ctx, fork, 2.0, a * 0.4, "#10b981")
          strokeBolt(ctx, fork, 0.7, a * 0.85, "#a7f3d0")
        }
        ctx.restore()
        return true
      })
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      data-veil="thunder"
      className="absolute inset-0 z-[1] mix-blend-screen"
      style={{ mixBlendMode: "screen", opacity: 0.9 }}
    />
  )
}

export const CrystalScene = memo(function CrystalScene() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0.15, 0.1, 6.5], fov: 40 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent", pointerEvents: "none" }}
      >
        <Suspense fallback={null}>
          <group position={[1.72, 0.02, 0]}>
            <FieldDust count={320} />
            <VeilTetra />
            <CoreDust count={120} />
          </group>
        </Suspense>
      </Canvas>
    </div>
  )
})

export function VeilHeroShaders() {
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduce(mq.matches)
    const onChange = () => setReduce(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <NeuroNoise
        colorBack="#060606"
        colorMid="#134e3a"
        colorFront="#34d399"
        brightness={0.085}
        contrast={0.38}
        scale={1.15}
        rotation={0}
        speed={reduce ? 0 : 0.55}
        originX={0.52}
        originY={0.48}
        offsetX={0}
        offsetY={0}
        fit="cover"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        minPixelRatio={1}
        maxPixelCount={1_600_000}
      />
      {!reduce && <ThunderLayer />}
      <div
        className="absolute inset-0 z-[3]"
        style={{
          background:
            "linear-gradient(90deg, rgba(6,6,6,0.5) 0%, rgba(6,6,6,0.18) 36%, rgba(6,6,6,0) 62%, rgba(6,6,6,0.12) 100%)",
        }}
      />
    </div>
  )
}
