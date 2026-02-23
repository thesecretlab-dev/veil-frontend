'use client'

import { motion } from 'framer-motion'

// Decision-making process flowchart for amending/creating policies
// Nodes: diamond = decision, rect = process, rounded = start/end

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
      <path d={path} fill="none" stroke="white" strokeWidth={1.2} markerEnd="url(#arrowhead)" />
      {label && labelPos && (
        <text x={labelPos.x} y={labelPos.y} fill="white" fontSize="7" fontWeight={600} textAnchor="middle">{label}</text>
      )}
    </g>
  )
}

export default function DecisionFlowchart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full my-8"
    >
      <div className="border border-white/10 rounded-xl bg-black/40 backdrop-blur-sm p-6 overflow-x-auto">
        <h3 className="text-sm font-semibold text-white/70 uppercase tracking-widest mb-1">
          Decision Process
        </h3>
        <p className="text-xs text-white/40 mb-4">
          The diagram below illustrates the decision-making process for amending/creating policies.
        </p>

        <div className="min-w-[800px]">
          <svg viewBox="0 0 820 260" className="w-full" style={{ minHeight: 200 }}>
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="white" />
              </marker>
            </defs>

            {/* Row 1: Main flow */}
            {/* Internal Discussion (start) */}
            <TerminalBox x={70} y={170} label="Internal Discussion" w={110} h={28} />

            {/* Quorum & Consensus */}
            <Diamond x={200} y={80} label="Quorum & Consensus" size={64} />

            {/* Actionable vote in #vote-tr */}
            <ProcessBox x={310} y={80} label="Actionable vote in #vote-tr" w={100} h={28} />

            {/* Policy members explain votes */}
            <ProcessBox x={430} y={80} label="Policy members explain votes" w={110} h={28} />

            {/* Vote Passed? */}
            <Diamond x={480} y={170} label="Vote Passed?" size={56} />

            {/* Whitelist / Proposal Needed? */}
            <Diamond x={590} y={170} label="Whitelist / Proposal Needed?" size={64} />

            {/* Proposal & snapshot */}
            <ProcessBox x={630} y={230} label="Proposal & snapshot" w={95} h={26} />

            {/* Proposal Passed? */}
            <Diamond x={700} y={230} label="Proposal Passed?" size={56} />

            {/* Communicate Change */}
            <TerminalBox x={760} y={130} label="Communicate Change" w={105} h={28} />

            {/* Implement Policy */}
            <TerminalBox x={760} y={170} label="Implement Policy" w={90} h={28} />

            {/* ---- ARROWS ---- */}

            {/* Internal Discussion → Quorum (up-right) */}
            <Arrow path="M125,170 Q125,80 168,80" />

            {/* Quorum → Yes → Actionable vote */}
            <Arrow path="M232,80 L258,80" label="Yes" labelPos={{ x: 245, y: 74 }} />

            {/* Actionable vote → Policy members */}
            <Arrow path="M360,80 L373,80" />

            {/* Policy members → Vote Passed (down) */}
            <Arrow path="M480,94 L480,142" />

            {/* Vote Passed → Yes → Whitelist */}
            <Arrow path="M508,170 L558,170" label="Yes" labelPos={{ x: 533, y: 164 }} />

            {/* Whitelist → No → Communicate Change */}
            <Arrow path="M622,170 Q660,130 707,130" label="No" labelPos={{ x: 660, y: 124 }} />

            {/* Whitelist → Yes → Proposal & snapshot */}
            <Arrow path="M590,202 L600,230" label="Yes" labelPos={{ x: 588, y: 220 }} />

            {/* Proposal & snapshot → Proposal Passed */}
            <Arrow path="M678,230 L672,230" />

            {/* Proposal Passed → Yes → Communicate Change */}
            <Arrow path="M728,230 Q780,230 780,158" label="Yes" labelPos={{ x: 748, y: 224 }} />

            {/* Communicate Change → Implement Policy */}
            <Arrow path="M760,144 L760,156" />

            {/* Vote Passed → No → Internal Discussion (loop back) */}
            <Arrow
              path="M452,170 Q400,170 400,200 Q400,230 250,230 Q70,230 70,184"
              label="No"
              labelPos={{ x: 430, y: 190 }}
            />

            {/* Quorum → No → Internal Discussion (loop back left) */}
            <Arrow
              path="M200,112 Q200,170 135,170"
              label="No"
              labelPos={{ x: 185, y: 145 }}
            />

            {/* Proposal Passed → No → Internal Discussion (loop back bottom) */}
            <Arrow
              path="M700,258 Q700,250 400,250 Q70,250 70,184"
              label="No"
              labelPos={{ x: 400, y: 258 }}
            />
          </svg>
        </div>
      </div>
    </motion.div>
  )
}
