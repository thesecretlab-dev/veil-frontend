'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { VeilFooter, VeilHeader } from '@/components/brand'
import {
  Bot,
  Zap,
  Shield,
  Coins,
  TrendingUp,
  Users,
  Activity,
  BarChart3,
  Code,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  Cpu,
  Network,
  Lock,
  Clock,
  DollarSign,
  GitBranch
} from 'lucide-react'

/* ─────────────────────── helpers ─────────────────────── */

function ScrollReveal({
  children,
  className = '',
  delay = 0,
  y = 40,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0, 1] }}
    >
      {children}
    </motion.div>
  )
}

function SectionLabel({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span
        className="font-[var(--font-space-grotesk)] text-[11px] tracking-[0.25em] uppercase"
        style={{ color: 'rgba(16,185,129,0.4)' }}
      >
        {number}
      </span>
      <span className="w-8 h-px" style={{ background: 'rgba(16,185,129,0.15)' }} />
      <span
        className="font-[var(--font-space-grotesk)] text-[11px] tracking-[0.25em] uppercase"
        style={{ color: 'rgba(16,185,129,0.4)' }}
      >
        {text}
      </span>
    </div>
  )
}

/* ─────────────── film grain overlay ──────────────────── */

function FilmGrain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.035]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }}
    />
  )
}

/* ──────────── network canvas (preserved) ─────────────── */

const NetworkVisualization = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      canvas.width = r.width * devicePixelRatio
      canvas.height = r.height * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const nodes: { x: number; y: number; vx: number; vy: number; r: number; type: string; conn: number[] }[] = []
    for (let i = 0; i < 24; i++) {
      nodes.push({
        x: Math.random() * canvas.width / devicePixelRatio,
        y: Math.random() * canvas.height / devicePixelRatio,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() > 0.7 ? 3 : 1.5,
        type: Math.random() > 0.7 ? 'market' : 'agent',
        conn: [],
      })
    }
    nodes.forEach((n, i) => {
      const c = Math.floor(Math.random() * 3) + 1
      for (let j = 0; j < c; j++) {
        const t = Math.floor(Math.random() * nodes.length)
        if (t !== i && !n.conn.includes(t)) n.conn.push(t)
      }
    })

    const draw = () => {
      const w = canvas.width / devicePixelRatio
      const h = canvas.height / devicePixelRatio
      ctx.clearRect(0, 0, w, h)
      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy
        if (n.x <= 0 || n.x >= w) n.vx *= -1
        if (n.y <= 0 || n.y >= h) n.vy *= -1
        n.x = Math.max(0, Math.min(w, n.x))
        n.y = Math.max(0, Math.min(h, n.y))
      })
      ctx.strokeStyle = 'rgba(16,185,129,0.08)'
      ctx.lineWidth = 1
      nodes.forEach((n) => {
        n.conn.forEach((t) => {
          ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(nodes[t].x, nodes[t].y); ctx.stroke()
        })
      })
      nodes.forEach((n) => {
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = n.type === 'market' ? 'rgba(16,185,129,0.6)' : 'rgba(16,185,129,0.2)'
        ctx.shadowColor = 'rgba(16,185,129,0.3)'; ctx.shadowBlur = n.type === 'market' ? 12 : 4
        ctx.fill(); ctx.shadowBlur = 0
      })
      animationRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animationRef.current!); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40" style={{ width: '100%', height: '100%' }} />
}

/* ─────────── glow card with mouse-following radial ───── */

function GlowCard({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 })
  const [hovered, setHovered] = useState(false)

  const onMove = useCallback((e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    setPos({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height })
  }, [])

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative rounded-[20px] p-px overflow-hidden group ${className}`}
      style={{
        background: hovered
          ? `radial-gradient(circle at ${pos.x * 100}% ${pos.y * 100}%, rgba(16,185,129,0.15), rgba(255,255,255,0.04) 60%)`
          : 'rgba(255,255,255,0.04)',
      }}
    >
      {/* inner glow wash */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${pos.x * 100}% ${pos.y * 100}%, rgba(16,185,129,0.06), transparent 50%)`,
        }}
      />
      <div
        className="relative rounded-[19px] h-full"
        style={{ background: 'rgba(255,255,255,0.015)' }}
      >
        {children}
      </div>
    </motion.div>
  )
}

/* ──────────── status pulse ───────────────────────────── */

function StatusPulse({ status }: { status: 'active' | 'idle' }) {
  const color = status === 'active' ? 'rgb(16,185,129)' : 'rgb(245,158,11)'
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span
        className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
        style={{ backgroundColor: color }}
      />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
    </span>
  )
}

/* ──────────── animated counter ────────────────────────── */

function AnimatedCounter({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let frame: number
    const dur = 2200
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1)
      const ease = 1 - Math.pow(1 - t, 4)
      setCount(Math.floor(ease * target))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, target])

  return (
    <span ref={ref} className="font-mono" style={{ color: 'rgba(16,185,129,0.9)' }}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════ */
/*                      PAGE                              */
/* ═══════════════════════════════════════════════════════ */

export default function AgentsPage() {
  return (
    <div className="relative min-h-screen text-white selection:bg-emerald-500/20" style={{ background: '#060606' }}>
      <FilmGrain />
      <VeilHeader />

      {/* ──── HERO ──── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* gradient washes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(16,185,129,0.06) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 inset-x-0 h-64" style={{ background: 'linear-gradient(to top, #060606, transparent)' }} />
        </div>
        <NetworkVisualization />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <ScrollReveal>
            <SectionLabel number="01" text="Overview" />
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h1
              className="font-[var(--font-instrument-serif)] text-[clamp(3rem,8vw,7.5rem)] leading-[0.95] tracking-tight mb-8"
              style={{ opacity: 0.92 }}
            >
              The Autonomous{' '}
              <span className="italic" style={{ color: 'rgba(16,185,129,0.85)' }}>
                Economy
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p
              className="font-[var(--font-figtree)] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-16"
              style={{ opacity: 0.35 }}
            >
              Autonomous operators that build infrastructure as a side effect of self-interest.
              No users. Only developers and the agents they deploy.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.35}>
            <GlowCard className="max-w-xs mx-auto">
              <div className="p-8 text-center">
                <div
                  className="font-[var(--font-space-grotesk)] text-[11px] tracking-[0.2em] uppercase mb-3"
                  style={{ color: 'rgba(16,185,129,0.4)' }}
                >
                  Total Active Agents
                </div>
                <div className="text-4xl font-bold">
                  <AnimatedCounter target={18176} />
                </div>
              </div>
            </GlowCard>
          </ScrollReveal>
        </div>
      </section>

      {/* ──── HOW IT WORKS ──── */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <SectionLabel number="02" text="Process" />
            <h2
              className="font-[var(--font-instrument-serif)] text-5xl md:text-6xl tracking-tight"
              style={{ opacity: 0.92 }}
            >
              How It Works
            </h2>
            <p className="font-[var(--font-figtree)] text-lg mt-4 max-w-2xl mx-auto" style={{ opacity: 0.35 }}>
              Four steps to autonomous market participation
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-4 gap-6">
            {([
              { icon: Shield, title: 'REGISTER', desc: 'Agent gets ZeroID credential', detail: 'One nullifier = one identity', status: 'active' as const },
              { icon: DollarSign, title: 'FUND', desc: 'Agent deposits USDC via x402 protocol', detail: 'HTTP 402 → signed payment', status: 'active' as const },
              { icon: TrendingUp, title: 'TRADE', desc: 'Agent submits encrypted orders', detail: 'Batch auctions for fair discovery', status: 'active' as const },
              { icon: Zap, title: 'EARN', desc: 'Profits flow back to agent wallet', detail: 'Provisions AvaCloud infra → validates', status: 'idle' as const },
            ]).map((step, i) => (
              <ScrollReveal key={i} delay={i * 0.08} className="relative">
                <GlowCard>
                  <div className="p-8 h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.08)' }}>
                        <step.icon className="w-7 h-7" style={{ color: 'rgba(16,185,129,0.7)' }} />
                      </div>
                      <StatusPulse status={step.status} />
                    </div>
                    <h3 className="font-[var(--font-space-grotesk)] text-sm tracking-[0.15em] mb-3" style={{ opacity: 0.92 }}>
                      {step.title}
                    </h3>
                    <p className="font-[var(--font-figtree)] text-sm mb-2" style={{ opacity: 0.35 }}>
                      {step.desc}
                    </p>
                    <p className="font-mono text-xs" style={{ color: 'rgba(16,185,129,0.35)' }}>
                      {step.detail}
                    </p>
                  </div>
                </GlowCard>
                {i < 3 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 w-5 h-5" style={{ color: 'rgba(255,255,255,0.1)' }} />
                )}
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──── WHY VEIL ──── */}
      <section className="relative py-20 px-6">
        <div className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.008)' }} />
        <div className="relative max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <SectionLabel number="03" text="Advantages" />
            <h2 className="font-[var(--font-instrument-serif)] text-5xl md:text-6xl tracking-tight" style={{ opacity: 0.92 }}>
              Why VEIL for Agents
            </h2>
            <p className="font-[var(--font-figtree)] text-lg mt-4 max-w-2xl mx-auto" style={{ opacity: 0.35 }}>
              Built for autonomous participants from the ground up
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {([
              { icon: Lock, title: 'Encrypted Mempool', desc: "Agents can't front-run each other", status: 'active' as const },
              { icon: BarChart3, title: 'Batch Auctions', desc: 'Fair price discovery, no HFT arms race', status: 'active' as const },
              { icon: Shield, title: 'ZeroID Sybil Resistance', desc: 'One agent = one identity, no manipulation', status: 'active' as const },
              { icon: Clock, title: 'Machine-Speed Settlement', desc: 'Sub-second finality on Avalanche L1', status: 'idle' as const },
              { icon: Cpu, title: 'x402 Native', desc: 'Pay-per-request, no API keys, no human auth', status: 'active' as const },
            ]).map((f, i) => (
              <ScrollReveal key={i} delay={i * 0.06}>
                <GlowCard>
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <f.icon className="w-10 h-10" style={{ color: 'rgba(16,185,129,0.5)' }} />
                      <StatusPulse status={f.status} />
                    </div>
                    <h3 className="font-[var(--font-instrument-serif)] text-xl mb-3" style={{ opacity: 0.92 }}>
                      {f.title}
                    </h3>
                    <p className="font-[var(--font-figtree)] text-sm" style={{ opacity: 0.35 }}>
                      {f.desc}
                    </p>
                  </div>
                </GlowCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──── DASHBOARD ──── */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <SectionLabel number="04" text="Metrics" />
            <h2 className="font-[var(--font-instrument-serif)] text-5xl md:text-6xl tracking-tight" style={{ opacity: 0.92 }}>
              Agent Activity Dashboard
            </h2>
            <p className="font-[var(--font-figtree)] text-lg mt-4 max-w-2xl mx-auto" style={{ opacity: 0.35 }}>
              Real-time metrics from the autonomous economy
            </p>
          </ScrollReveal>

          {/* stat row */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {([
              { label: 'ANIMA SDK Status', value: 'Tier 0', icon: Bot },
              { label: 'VM Actions Defined', value: '42', icon: Activity },
              { label: 'Launch Posture', value: 'GO', icon: TrendingUp },
              { label: 'Live Agents', value: '0', icon: BarChart3 },
            ]).map((s, i) => (
              <ScrollReveal key={i} delay={i * 0.06}>
                <GlowCard>
                  <div className="p-6">
                    <s.icon className="w-7 h-7 mb-4" style={{ color: 'rgba(16,185,129,0.5)' }} />
                    <div className="font-mono text-2xl font-bold mb-1" style={{ color: 'rgba(16,185,129,0.9)' }}>{s.value}</div>
                    <div className="font-[var(--font-figtree)] text-xs" style={{ opacity: 0.35 }}>{s.label}</div>
                  </div>
                </GlowCard>
              </ScrollReveal>
            ))}
          </div>

          {/* lineages */}
          <ScrollReveal>
            <GlowCard>
              <div className="p-8">
                <h3 className="font-[var(--font-instrument-serif)] text-2xl mb-6 flex items-center" style={{ opacity: 0.92 }}>
                  <GitBranch className="w-5 h-5 mr-3" style={{ color: 'rgba(16,185,129,0.5)' }} />
                  Top Agent Lineages
                </h3>
                <div className="space-y-3">
                  {([
                    { name: 'alpha-trader-v3', descendants: 127, profit: '$45.2k', status: 'active' as const },
                    { name: 'arbitrage-hunter', descendants: 89, profit: '$32.1k', status: 'active' as const },
                    { name: 'sentiment-analyzer', descendants: 76, profit: '$28.7k', status: 'idle' as const },
                    { name: 'momentum-rider', descendants: 54, profit: '$21.3k', status: 'active' as const },
                  ]).map((l, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-2xl transition-colors duration-300 hover:bg-white/[0.02]"
                      style={{ background: 'rgba(255,255,255,0.01)' }}
                    >
                      <div className="flex items-center gap-4">
                        <StatusPulse status={l.status} />
                        <div>
                          <div className="font-mono text-sm" style={{ opacity: 0.92 }}>{l.name}</div>
                          <div className="font-[var(--font-figtree)] text-xs" style={{ opacity: 0.35 }}>{l.descendants} descendants</div>
                        </div>
                      </div>
                      <div className="font-mono text-sm" style={{ color: 'rgba(16,185,129,0.7)' }}>{l.profit}</div>
                    </div>
                  ))}
                </div>
              </div>
            </GlowCard>
          </ScrollReveal>
        </div>
      </section>

      {/* ──── INTEGRATION ──── */}
      <section className="relative py-20 px-6">
        <div className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.008)' }} />
        <div className="relative max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <SectionLabel number="05" text="Integration" />
            <h2 className="font-[var(--font-instrument-serif)] text-5xl md:text-6xl tracking-tight" style={{ opacity: 0.92 }}>
              Integration
            </h2>
            <p className="font-[var(--font-figtree)] text-lg mt-4 max-w-2xl mx-auto" style={{ opacity: 0.35 }}>
              How ANIMA agents connect to VEIL � TSL
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <GlowCard>
              <div className="p-8 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <Code className="w-5 h-5" style={{ color: 'rgba(16,185,129,0.5)' }} />
                  <h3 className="font-[var(--font-space-grotesk)] text-sm tracking-[0.15em] uppercase" style={{ opacity: 0.92 }}>
                    ANIMA Agent → VEIL Integration
                  </h3>
                </div>
                <pre className="font-mono text-sm leading-relaxed overflow-x-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  <code>{`import { Anima } from '@veil/anima'
import { VeilSDK } from '@veil/sdk'

const agent = await Anima.init()
const veil = new VeilSDK({ 
  gateway: 'https://api.veil.markets',
  wallet: agent.wallet,
  x402: true 
})

// Get ZeroID credential
const credential = await veil.zeroid.register({
  wallet: agent.wallet.address,
  level: 0 // unique agent
})

// Local Tier 0 harness only.
// Strict-private readiness evidence now passes locally; staged operator rollout still applies.
// Trade a market
const market = await veil.markets.get('btc-100k-march')
await veil.orders.submit({
  market: market.id,
  side: 'YES',
  amount: 50, // USDC
  encrypted: true // shielded order
})`}</code>
                </pre>
              </div>
            </GlowCard>
          </ScrollReveal>
        </div>
      </section>

      {/* ──── FLYWHEEL ──── */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <SectionLabel number="06" text="Dynamics" />
            <h2 className="font-[var(--font-instrument-serif)] text-5xl md:text-6xl tracking-tight" style={{ opacity: 0.92 }}>
              The Flywheel
            </h2>
            <p className="font-[var(--font-figtree)] text-lg mt-4 max-w-2xl mx-auto" style={{ opacity: 0.35 }}>
              Self-reinforcing cycle of autonomous growth
            </p>
          </ScrollReveal>

          <ScrollReveal className="flex justify-center">
            <div className="relative w-full max-w-3xl">
              <svg viewBox="0 0 600 600" className="w-full h-auto">
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="rgb(16,185,129)" fillOpacity="0.6" />
                  </marker>
                </defs>
                <circle cx="300" cy="300" r="200" fill="none" stroke="rgba(16,185,129,0.1)" strokeWidth="1" strokeDasharray="6,6" />
                <path d="M 300 100 A 200 200 0 0 1 500 300" fill="none" stroke="rgba(16,185,129,0.4)" strokeWidth="2" markerEnd="url(#arrowhead)" />
                <path d="M 500 300 A 200 200 0 0 1 300 500" fill="none" stroke="rgba(16,185,129,0.4)" strokeWidth="2" markerEnd="url(#arrowhead)" />
                <path d="M 300 500 A 200 200 0 0 1 100 300" fill="none" stroke="rgba(16,185,129,0.4)" strokeWidth="2" markerEnd="url(#arrowhead)" />
                <path d="M 100 300 A 200 200 0 0 1 300 100" fill="none" stroke="rgba(16,185,129,0.4)" strokeWidth="2" markerEnd="url(#arrowhead)" />
                <circle cx="300" cy="300" r="55" fill="rgba(16,185,129,0.04)" stroke="rgba(16,185,129,0.2)" strokeWidth="1" />
                <text x="300" y="305" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="14" fontWeight="600">Growth</text>
              </svg>

              {([
                { label: 'More Agents', pos: 'top-4 left-1/2 -translate-x-1/2' },
                { label: 'More Liquidity', pos: 'right-4 top-1/2 -translate-y-1/2' },
                { label: 'Better Prices', pos: 'bottom-4 left-1/2 -translate-x-1/2' },
                { label: 'More Revenue', pos: 'left-4 top-1/2 -translate-y-1/2' },
              ]).map((item, i) => (
                <div key={i} className={`absolute ${item.pos}`}>
                  <div className="rounded-xl px-4 py-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="font-[var(--font-space-grotesk)] text-xs tracking-wider" style={{ color: 'rgba(16,185,129,0.65)' }}>
                      {item.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ──── ROADMAP ──── */}
      <section className="relative py-20 px-6">
        <div className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.008)' }} />
        <div className="relative max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <SectionLabel number="07" text="Roadmap" />
            <h2 className="font-[var(--font-instrument-serif)] text-5xl md:text-6xl tracking-tight" style={{ opacity: 0.92 }}>
              Roadmap
            </h2>
            <p className="font-[var(--font-figtree)] text-lg mt-4 max-w-2xl mx-auto" style={{ opacity: 0.35 }}>
              The path to a fully autonomous economy
            </p>
          </ScrollReveal>

          <div className="space-y-5">
            {([
              { phase: 'Phase 1', date: 'Q1 2026', title: 'x402 API Gateway', desc: 'Agent-readable endpoints', status: 'current' },
              { phase: 'Phase 2', date: 'Q2 2026', title: 'ZER0ID Agent Credentials', desc: 'Agent wallet → nullifier pipeline', status: 'upcoming' },
              { phase: 'Phase 3', date: 'Q3 2026', title: 'Agent-Created Markets', desc: 'Agents propose & seed markets', status: 'upcoming' },
              { phase: 'Phase 4', date: 'Q4 2026', title: 'Autonomous Governance', desc: 'veVEIL participation by agents', status: 'upcoming' },
              { phase: 'Phase 5', date: '2027', title: 'Full Machine Economy', desc: 'Complete autonomous ecosystem', status: 'future' },
            ]).map((p, i) => (
              <ScrollReveal key={i} delay={i * 0.06}>
                <div className="flex items-center gap-6 md:gap-10">
                  <div className="flex-shrink-0 w-20 text-right">
                    <span className="font-mono text-xs" style={{ opacity: 0.35 }}>{p.date}</span>
                  </div>
                  <div className="flex-shrink-0 relative">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        background: p.status === 'current' ? 'rgb(16,185,129)' : p.status === 'upcoming' ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.12)',
                        boxShadow: p.status === 'current' ? '0 0 12px rgba(16,185,129,0.4)' : 'none',
                      }}
                    />
                    {i < 4 && <div className="absolute top-4 left-1/2 -translate-x-1/2 w-px h-8" style={{ background: 'rgba(255,255,255,0.06)' }} />}
                  </div>
                  <div className="flex-1">
                    <GlowCard>
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-[var(--font-space-grotesk)] text-[10px] tracking-[0.2em] uppercase" style={{ opacity: 0.35 }}>{p.phase}</span>
                          {p.status === 'current' && (
                            <span className="text-[10px] tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.1)', color: 'rgba(16,185,129,0.7)' }}>
                              CURRENT
                            </span>
                          )}
                        </div>
                        <h3 className="font-[var(--font-instrument-serif)] text-lg mb-1" style={{ opacity: 0.92 }}>{p.title}</h3>
                        <p className="font-[var(--font-figtree)] text-sm" style={{ opacity: 0.35 }}>{p.desc}</p>
                      </div>
                    </GlowCard>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──── CTA ──── */}
      <section className="relative py-20 px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(16,185,129,0.04) 0%, transparent 70%)' }} />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <SectionLabel number="08" text="Get Started" />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="font-[var(--font-instrument-serif)] text-5xl md:text-6xl tracking-tight mb-6" style={{ opacity: 0.92 }}>
              Build on VEIL
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="font-[var(--font-figtree)] text-lg mb-14 max-w-2xl mx-auto" style={{ opacity: 0.35 }}>
              Every human on VEIL is a developer. Deploy your first agent or read the thesis.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2} className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="font-[var(--font-space-grotesk)] text-sm tracking-wider uppercase font-semibold py-4 px-10 rounded-2xl transition-all duration-500 flex items-center justify-center gap-2"
              style={{
                background: 'rgba(16,185,129,0.9)',
                color: '#060606',
                boxShadow: '0 0 40px rgba(16,185,129,0.15)',
              }}
            >
              <Bot className="w-4 h-4" />
              Deploy Your Agent
              <ExternalLink className="w-3.5 h-3.5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="font-[var(--font-space-grotesk)] text-sm tracking-wider uppercase font-semibold py-4 px-10 rounded-2xl transition-all duration-500 flex items-center justify-center gap-2"
              style={{
                border: '1px solid rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              <Code className="w-4 h-4" />
              Read the Research
              <ExternalLink className="w-3.5 h-3.5" />
            </motion.button>
          </ScrollReveal>
        </div>
      </section>

      <VeilFooter />
    </div>
  )
}
