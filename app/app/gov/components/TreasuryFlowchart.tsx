'use client'

import { motion } from 'framer-motion'

const EMERALD = 'rgb(16,185,129)'
const DARK = '#0f172a'
const LIGHT_BG = '#94a3b8'
const WARM = '#f59e0b'

function Diamond({ x, y, label, size = 56 }: { x: number; y: number; label: string; size?: number }) {
  const half = size / 2
  return (
    <g>
      <polygon
        points={`${x},${y - half} ${x + half},${y} ${x},${y + half} ${x - half},${y}`}
        fill={DARK}
        stroke={EMERALD}
        strokeWidth={1.5}
      />
      <foreignObject x={x - half + 6} y={y - half + 6} width={size - 12} height={size - 12}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'white', fontSize: '7px', textAlign: 'center', lineHeight: 1.2, fontWeight: 600 }}>
          {label}
        </div>
      </foreignObject>
    </g>
  )
}

function ProcessBox({ x, y, label, w = 90, h = 30 }: { x: number; y: number; label: string; w?: number; h?: number }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={3} fill={LIGHT_BG} stroke="none" />
      <foreignObject x={x - w / 2 + 4} y={y - h / 2 + 2} width={w - 8} height={h - 4}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#1e293b', fontSize: '7px', textAlign: 'center', lineHeight: 1.2, fontWeight: 600 }}>
          {label}
        </div>
      </foreignObject>
    </g>
  )
}

function TerminalBox({ x, y, label, w = 100, h = 30 }: { x: number; y: number; label: string; w?: number; h?: number }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} fill={WARM} stroke="none" />
      <foreignObject x={x - w / 2 + 4} y={y - h / 2 + 2} width={w - 8} height={h - 4}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#1e293b', fontSize: '7px', textAlign: 'center', lineHeight: 1.2, fontWeight: 700 }}>
          {label}
        </div>
      </foreignObject>
    </g>
  )
}

function Arrow({ path, label, labelPos }: { path: string; label?: string; labelPos?: { x: number; y: number } }) {
  return (
    <g>
      <path d={path} fill="none" stroke="white" strokeWidth={1.2} markerEnd="url(#arrowhead2)" />
      {label && labelPos && (
        <text x={labelPos.x} y={labelPos.y} fill="white" fontSize="7" fontWeight={600} textAnchor="middle">{label}</text>
      )}
    </g>
  )
}

export default function TreasuryFlowchart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="w-full my-8"
    >
      <div className="border border-white/10 rounded-xl bg-black/40 backdrop-blur-sm p-6 overflow-x-auto">
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-widest mb-1">
          Treasury Allocation Process
        </h3>
        <p className="text-xs text-white/40 mb-4">
          Every decision must go through a rigorous process prior to execution which includes internal consensus as well as public governance.
        </p>

        <div className="min-w-[900px]">
          <svg viewBox="0 0 920 310" className="w-full" style={{ minHeight: 220 }}>
            <defs>
              <marker id="arrowhead2" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="white" />
              </marker>
            </defs>

            {/* Row 0: Open thread + Quorum */}
            <ProcessBox x={130} y={60} label="Open a new proposal-focused thread & post all relevant information" w={110} h={40} />
            <Diamond x={260} y={60} label="Quorum & Consensus" size={60} />

            {/* Row 1: Team members provided input? */}
            <Diamond x={340} y={140} label="Team members provided input?" size={60} />

            {/* Row 2: Actionable vote + Treasury explain */}
            <ProcessBox x={420} y={200} label="Actionable vote in #vote-tr" w={105} h={28} />
            <ProcessBox x={550} y={200} label="Treasury team members vote & explain" w={115} h={28} />

            {/* Row 3: Vote Passed + Whitelist */}
            <Diamond x={560} y={260} label="Vote Passed?" size={56} />
            <Diamond x={670} y={260} label="Whitelist / Proposal Needed?" size={64} />

            {/* Row 4: Proposal & snapshot + Proposal Passed + Allocators */}
            <ProcessBox x={720} y={220} label="Proposal & snapshot" w={95} h={26} />
            <Diamond x={720} y={280} label="Proposal Passed?" size={52} />
            <Diamond x={800} y={220} label="Allocators Needed?" size={60} />

            {/* Row 5: Notify Engineering + Notify Multisig + Funds Allocation */}
            <ProcessBox x={820} y={270} label="Notify Engineering" w={95} h={24} />
            <ProcessBox x={850} y={220} label="Notify Multisig" w={80} h={24} />
            <TerminalBox x={900} y={220} label="Funds Allocation" w={80} h={24} />

            {/* Internal Discussion (bottom-left) */}
            <TerminalBox x={70} y={240} label="Internal Discussion" w={110} h={28} />

            {/* ---- ARROWS ---- */}

            {/* Open thread → Quorum */}
            <Arrow path="M186,60 L228,60" />

            {/* Quorum → No (right-down to Team input) */}
            <Arrow path="M290,60 Q320,60 320,100 Q320,120 340,110" label="No" labelPos={{ x: 305, y: 80 }} />

            {/* Team input → No (loop right, back up) — back to open thread area */}
            <Arrow path="M370,140 Q400,140 400,100 Q400,60 340,60 Q300,60 290,60" label="No" labelPos={{ x: 390, y: 125 }} />

            {/* Team input → Yes (down to Actionable vote) */}
            <Arrow path="M340,170 Q340,200 366,200" label="Yes" labelPos={{ x: 330, y: 190 }} />

            {/* Quorum → Yes (down-left to long path → Internal Discussion → back up) */}
            {/* Actually: Quorum Yes → down to team input path merges. Let me re-read the diagram */}
            {/* Quorum has a Yes going down-left, and there's a Yes line from left going to Actionable vote */}
            {/* Looking more carefully: Open thread → Quorum, Quorum No→right, Quorum Yes→down to Team input */}
            {/* Team input Yes→down, Team input No→loop back */}

            {/* Actionable vote → Treasury explain */}
            <Arrow path="M473,200 L491,200" />

            {/* Treasury explain → Vote Passed */}
            <Arrow path="M550,214 L555,232" />

            {/* Vote Passed → Yes → Whitelist */}
            <Arrow path="M588,260 L638,260" label="Yes" labelPos={{ x: 613, y: 254 }} />

            {/* Whitelist → No → Allocators area (right, up) */}
            <Arrow path="M702,260 Q740,260 770,240 Q790,220 800,190" label="No" labelPos={{ x: 740, y: 248 }} />

            {/* Whitelist → Yes → Proposal & snapshot */}
            <Arrow path="M670,292 Q690,300 700,300 Q710,300 720,292 L720,233" label="Yes" labelPos={{ x: 690, y: 300 }} />

            {/* Proposal & snapshot → Proposal Passed */}
            <Arrow path="M720,233 L720,253" />

            {/* Proposal Passed → Yes → Allocators */}
            <Arrow path="M746,280 Q770,280 780,260 Q790,240 800,250" label="Yes" labelPos={{ x: 762, y: 274 }} />

            {/* Allocators → Yes → Notify Engineering */}
            <Arrow path="M800,250 L810,258" label="Yes" labelPos={{ x: 798, y: 262 }} />

            {/* Allocators → No → Notify Multisig */}
            <Arrow path="M830,220 L838,220" label="No" labelPos={{ x: 835, y: 214 }} />

            {/* Notify Multisig → Funds Allocation */}
            <Arrow path="M890,220 L858,220" />

            {/* Notify Engineering → (merges to Funds Allocation area) */}
            <Arrow path="M868,270 Q900,270 900,232" />

            {/* Vote Passed → No → Internal Discussion */}
            <Arrow
              path="M532,260 Q400,260 250,260 Q70,260 70,254"
              label="No"
              labelPos={{ x: 350, y: 270 }}
            />

            {/* Proposal Passed → No → Internal Discussion */}
            <Arrow
              path="M694,280 Q600,300 350,300 Q70,300 70,254"
              label="No"
              labelPos={{ x: 500, y: 305 }}
            />

            {/* Internal Discussion → (back up to Open thread) */}
            <Arrow path="M70,226 Q70,60 73,60" />

          </svg>
        </div>
      </div>
    </motion.div>
  )
}
