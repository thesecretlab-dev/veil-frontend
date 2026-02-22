"use client"

import { motion } from "framer-motion"

/* ═══════════════════════════════════════════════════════════
   GEO 3D ICONS — Geometric 3D icons for the Portal Directory
   
   Each icon is a CSS 3D transformed composition of geometric
   shapes with emerald gradients. No WebGL — pure CSS + SVG
   for performance. Hover to rotate.
   ═══════════════════════════════════════════════════════════ */

const E = "rgba(16,185,129,"     // emerald prefix
const W = "rgba(255,255,255,"    // white prefix

function Wrap({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={`relative w-12 h-12 flex items-center justify-center ${className}`}
      style={{ perspective: "200px" }}
      whileHover={{ rotateY: 15, rotateX: -10 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      {children}
    </motion.div>
  )
}

// ─── MARKETS — Stacked bar chart prism ───────────────────
export function GeoMarkets() {
  return (
    <Wrap>
      <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d", transform: "rotateX(8deg) rotateY(-12deg)" }}>
        {/* Bars */}
        {[
          { h: "60%", l: "10%", o: 0.9 },
          { h: "80%", l: "30%", o: 0.7 },
          { h: "45%", l: "50%", o: 0.5 },
          { h: "95%", l: "70%", o: 0.8 },
        ].map((bar, i) => (
          <div key={i} className="absolute bottom-1" style={{
            left: bar.l, width: "14%", height: bar.h,
            background: `linear-gradient(180deg, ${E}${bar.o}), ${E}0.15))`,
            borderRadius: "3px 3px 1px 1px",
            boxShadow: `0 0 12px ${E}0.1)`,
            transform: `translateZ(${3 + i * 2}px)`,
          }} />
        ))}
        {/* Base line */}
        <div className="absolute bottom-0 left-1 right-1 h-px" style={{ background: `${E}0.2)` }} />
      </div>
    </Wrap>
  )
}

// ─── MARKET DETAIL — Depth/orderbook crystal ─────────────
export function GeoMarketDetail() {
  return (
    <Wrap>
      <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d", transform: "rotateX(10deg) rotateY(-8deg)" }}>
        {/* Central diamond */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div style={{
            width: "28px", height: "28px",
            background: `linear-gradient(135deg, ${E}0.4), ${E}0.08))`,
            border: `1px solid ${E}0.3)`,
            transform: "rotate(45deg) translateZ(6px)",
            borderRadius: "4px",
            boxShadow: `0 0 20px ${E}0.15), inset 0 0 10px ${E}0.1)`,
          }} />
        </div>
        {/* Depth lines radiating */}
        {[-12, -6, 0, 6, 12].map((offset, i) => (
          <div key={i} className="absolute left-1/2 -translate-x-1/2" style={{
            top: `${20 + i * 12}%`, width: `${60 - Math.abs(offset) * 2}%`, height: "1px",
            background: `linear-gradient(90deg, transparent, ${E}${0.1 + i * 0.05}), transparent)`,
            transform: `translateZ(${2 + i}px)`,
          }} />
        ))}
      </div>
    </Wrap>
  )
}

// ─── INSIGHTS — Geometric eye/prism ──────────────────────
export function GeoInsights() {
  return (
    <Wrap>
      <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d", transform: "rotateX(5deg) rotateY(-10deg)" }}>
        {/* Eye shape — two arcs */}
        <svg viewBox="0 0 48 48" className="absolute inset-0 w-full h-full" style={{ transform: "translateZ(4px)" }}>
          <defs>
            <linearGradient id="eye-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(16,185,129,0.6)" />
              <stop offset="100%" stopColor="rgba(16,185,129,0.15)" />
            </linearGradient>
          </defs>
          {/* Top lid */}
          <path d="M6 24 Q24 8 42 24" fill="none" stroke="url(#eye-grad)" strokeWidth="1.5" />
          {/* Bottom lid */}
          <path d="M6 24 Q24 40 42 24" fill="none" stroke="url(#eye-grad)" strokeWidth="1.5" />
          {/* Iris */}
          <circle cx="24" cy="24" r="7" fill="none" stroke="rgba(16,185,129,0.4)" strokeWidth="1.5" />
          {/* Pupil */}
          <circle cx="24" cy="24" r="3" fill="rgba(16,185,129,0.5)" />
          {/* Glint */}
          <circle cx="22" cy="22" r="1.2" fill="rgba(255,255,255,0.4)" />
        </svg>
        {/* Refraction lines */}
        <div className="absolute top-[45%] left-[15%] w-[70%] h-px" style={{ background: `linear-gradient(90deg, transparent, ${E}0.08), transparent)`, transform: "translateZ(8px)" }} />
      </div>
    </Wrap>
  )
}

// ─── DEFI CONSOLE — Layered hexagonal stack ──────────────
export function GeoDeFi() {
  return (
    <Wrap>
      <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d", transform: "rotateX(12deg) rotateY(-15deg)" }}>
        {[0, 1, 2].map(i => (
          <svg key={i} viewBox="0 0 48 48" className="absolute inset-0 w-full h-full"
            style={{ transform: `translateZ(${i * 5}px) scale(${1 - i * 0.12})`, opacity: 1 - i * 0.25 }}>
            <polygon points="24,4 44,16 44,32 24,44 4,32 4,16"
              fill={`rgba(16,185,129,${0.04 + i * 0.04})`}
              stroke={`rgba(16,185,129,${0.3 - i * 0.08})`}
              strokeWidth="1.2" />
          </svg>
        ))}
        {/* Center node */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: "translateZ(16px)" }}>
          <div style={{
            width: "8px", height: "8px", borderRadius: "50%",
            background: `${E}0.6)`,
            boxShadow: `0 0 12px ${E}0.4)`,
          }} />
        </div>
      </div>
    </Wrap>
  )
}

// ─── PORTFOLIO — Stacked cards/layers ────────────────────
export function GeoPortfolio() {
  return (
    <Wrap>
      <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d", transform: "rotateX(15deg) rotateY(-20deg)" }}>
        {[0, 1, 2].map(i => (
          <div key={i} className="absolute" style={{
            left: `${8 + i * 3}px`, top: `${8 + i * 4}px`,
            width: "30px", height: "22px",
            background: `linear-gradient(135deg, ${E}${0.08 + i * 0.06}), ${E}0.02))`,
            border: `1px solid ${E}${0.15 + i * 0.05})`,
            borderRadius: "6px",
            transform: `translateZ(${(2 - i) * 6}px)`,
            boxShadow: `0 2px 8px rgba(0,0,0,${0.2 + i * 0.1})`,
          }}>
            {/* Balance line */}
            <div className="absolute bottom-1.5 left-1.5 right-1.5 h-px" style={{ background: `${E}${0.15 + i * 0.05})` }} />
          </div>
        ))}
      </div>
    </Wrap>
  )
}

// ─── REWARDS — Faceted gem/crystal ───────────────────────
export function GeoRewards() {
  return (
    <Wrap>
      <svg viewBox="0 0 48 48" className="w-full h-full" style={{ transform: "translateZ(4px)" }}>
        <defs>
          <linearGradient id="gem-top" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(16,185,129,0.5)" />
            <stop offset="100%" stopColor="rgba(16,185,129,0.2)" />
          </linearGradient>
          <linearGradient id="gem-bot" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="rgba(16,185,129,0.3)" />
            <stop offset="100%" stopColor="rgba(16,185,129,0.05)" />
          </linearGradient>
        </defs>
        {/* Crown (top facets) */}
        <polygon points="8,18 24,8 40,18 34,18 24,12 14,18" fill="url(#gem-top)" stroke="rgba(16,185,129,0.3)" strokeWidth="0.8" />
        {/* Table */}
        <polygon points="14,18 34,18 40,18 8,18" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.2)" strokeWidth="0.5" />
        {/* Pavilion (bottom facets) */}
        <polygon points="8,18 24,40 40,18" fill="url(#gem-bot)" stroke="rgba(16,185,129,0.25)" strokeWidth="0.8" />
        {/* Internal facet lines */}
        <line x1="24" y1="12" x2="24" y2="40" stroke="rgba(16,185,129,0.1)" strokeWidth="0.5" />
        <line x1="14" y1="18" x2="24" y2="40" stroke="rgba(16,185,129,0.08)" strokeWidth="0.5" />
        <line x1="34" y1="18" x2="24" y2="40" stroke="rgba(16,185,129,0.08)" strokeWidth="0.5" />
        {/* Sparkle */}
        <circle cx="20" cy="16" r="1.5" fill="rgba(255,255,255,0.3)" />
      </svg>
    </Wrap>
  )
}

// ─── LEADERBOARD — Podium/stepped pyramid ────────────────
export function GeoLeaderboard() {
  return (
    <Wrap>
      <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d", transform: "rotateX(12deg) rotateY(-10deg)" }}>
        {/* Three podium blocks */}
        {[
          { l: "6px", b: "6px", w: "10px", h: "18px", z: 4, o: 0.35 },
          { l: "18px", b: "6px", w: "12px", h: "28px", z: 6, o: 0.55 },
          { l: "32px", b: "6px", w: "10px", h: "22px", z: 4, o: 0.4 },
        ].map((block, i) => (
          <div key={i} className="absolute" style={{
            left: block.l, bottom: block.b,
            width: block.w, height: block.h,
            background: `linear-gradient(180deg, ${E}${block.o}), ${E}0.08))`,
            border: `1px solid ${E}0.2)`,
            borderRadius: "3px 3px 1px 1px",
            transform: `translateZ(${block.z}px)`,
            boxShadow: `0 0 10px ${E}0.08)`,
          }} />
        ))}
        {/* Crown on top of center */}
        <svg viewBox="0 0 14 10" className="absolute" style={{ left: "17px", bottom: "34px", width: "14px", height: "10px", transform: "translateZ(8px)" }}>
          <path d="M1,9 L3,3 L7,6 L11,3 L13,9 Z" fill="rgba(16,185,129,0.4)" stroke="rgba(16,185,129,0.5)" strokeWidth="0.8" />
        </svg>
        {/* Base */}
        <div className="absolute bottom-1 left-1 right-1 h-px" style={{ background: `${E}0.15)` }} />
      </div>
    </Wrap>
  )
}

// ─── GOVERNANCE — Balanced scales ────────────────────────
export function GeoGovernance() {
  return (
    <Wrap>
      <svg viewBox="0 0 48 48" className="w-full h-full" style={{ transform: "translateZ(4px)" }}>
        {/* Central pillar */}
        <line x1="24" y1="10" x2="24" y2="40" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" />
        {/* Beam */}
        <line x1="8" y1="18" x2="40" y2="18" stroke="rgba(16,185,129,0.4)" strokeWidth="1.2" />
        {/* Left pan */}
        <path d="M6,18 L8,26 L16,26 L18,18" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.3)" strokeWidth="0.8" />
        {/* Right pan */}
        <path d="M30,18 L32,26 L40,26 L42,18" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.3)" strokeWidth="0.8" />
        {/* Fulcrum triangle */}
        <polygon points="24,10 21,16 27,16" fill="rgba(16,185,129,0.25)" stroke="rgba(16,185,129,0.4)" strokeWidth="0.8" />
        {/* Base */}
        <line x1="18" y1="40" x2="30" y2="40" stroke="rgba(16,185,129,0.2)" strokeWidth="1.5" strokeLinecap="round" />
        {/* Chains */}
        <line x1="8" y1="18" x2="12" y2="18" stroke="rgba(16,185,129,0.15)" strokeWidth="0.5" strokeDasharray="1.5 1.5" />
        <line x1="36" y1="18" x2="40" y2="18" stroke="rgba(16,185,129,0.15)" strokeWidth="0.5" strokeDasharray="1.5 1.5" />
      </svg>
    </Wrap>
  )
}

// ─── TRANSPARENCY — Glass cube ───────────────────────────
export function GeoTransparency() {
  return (
    <Wrap>
      <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d", transform: "rotateX(10deg) rotateY(-25deg)" }}>
        <svg viewBox="0 0 48 48" className="w-full h-full">
          {/* Front face */}
          <polygon points="12,14 32,14 32,36 12,36" fill="rgba(16,185,129,0.04)" stroke="rgba(16,185,129,0.25)" strokeWidth="0.8" />
          {/* Top face */}
          <polygon points="12,14 32,14 40,8 20,8" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.2)" strokeWidth="0.8" />
          {/* Right face */}
          <polygon points="32,14 40,8 40,30 32,36" fill="rgba(16,185,129,0.06)" stroke="rgba(16,185,129,0.2)" strokeWidth="0.8" />
          {/* Internal wireframe lines (transparency effect) */}
          <line x1="12" y1="36" x2="20" y2="30" stroke="rgba(16,185,129,0.08)" strokeWidth="0.5" strokeDasharray="2 2" />
          <line x1="20" y1="8" x2="20" y2="30" stroke="rgba(16,185,129,0.08)" strokeWidth="0.5" strokeDasharray="2 2" />
          <line x1="20" y1="30" x2="40" y2="30" stroke="rgba(16,185,129,0.08)" strokeWidth="0.5" strokeDasharray="2 2" />
          {/* Glint */}
          <line x1="14" y1="17" x2="18" y2="17" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>
    </Wrap>
  )
}

// ─── DOCUMENTATION — Open book prism ─────────────────────
export function GeoDocs() {
  return (
    <Wrap>
      <svg viewBox="0 0 48 48" className="w-full h-full" style={{ transform: "translateZ(4px)" }}>
        {/* Left page */}
        <path d="M6,12 L24,10 L24,40 L6,38 Z" fill="rgba(16,185,129,0.06)" stroke="rgba(16,185,129,0.25)" strokeWidth="0.8" />
        {/* Right page */}
        <path d="M24,10 L42,12 L42,38 L24,40 Z" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.3)" strokeWidth="0.8" />
        {/* Spine */}
        <line x1="24" y1="10" x2="24" y2="40" stroke="rgba(16,185,129,0.4)" strokeWidth="1.2" />
        {/* Text lines — left */}
        {[16, 20, 24, 28].map(y => (
          <line key={`l${y}`} x1="10" y1={y} x2="21" y2={y - 0.3} stroke="rgba(16,185,129,0.1)" strokeWidth="0.8" />
        ))}
        {/* Text lines — right */}
        {[16, 20, 24, 28].map(y => (
          <line key={`r${y}`} x1="27" y1={y - 0.3} x2="38" y2={y} stroke="rgba(16,185,129,0.1)" strokeWidth="0.8" />
        ))}
      </svg>
    </Wrap>
  )
}

// ─── API DOCS — Terminal/code block ──────────────────────
export function GeoApiDocs() {
  return (
    <Wrap>
      <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d", transform: "rotateX(8deg) rotateY(-10deg)" }}>
        <div className="absolute inset-1.5 rounded-lg overflow-hidden" style={{
          background: "rgba(16,185,129,0.03)",
          border: "1px solid rgba(16,185,129,0.15)",
          transform: "translateZ(4px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}>
          {/* Title bar */}
          <div className="flex items-center gap-1 px-2 py-1.5" style={{ borderBottom: "1px solid rgba(16,185,129,0.08)" }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(16,185,129,0.3)" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(16,185,129,0.2)" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(16,185,129,0.1)" }} />
          </div>
          {/* Code lines */}
          <div className="px-2 py-1.5 space-y-1">
            <div className="h-[2px] rounded-full" style={{ width: "70%", background: "rgba(16,185,129,0.2)" }} />
            <div className="h-[2px] rounded-full" style={{ width: "50%", background: "rgba(16,185,129,0.12)" }} />
            <div className="h-[2px] rounded-full" style={{ width: "85%", background: "rgba(16,185,129,0.15)" }} />
            <div className="h-[2px] rounded-full" style={{ width: "40%", background: "rgba(16,185,129,0.1)" }} />
          </div>
          {/* Cursor blink */}
          <motion.div
            className="absolute bottom-2 left-2 w-[3px] h-[6px] rounded-sm"
            style={{ background: "rgba(16,185,129,0.5)" }}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        </div>
      </div>
    </Wrap>
  )
}

// ─── MAIEV — Shield with checkmark ───────────────────────
export function GeoMaiev() {
  return (
    <Wrap>
      <svg viewBox="0 0 48 48" className="w-full h-full" style={{ transform: "translateZ(4px)" }}>
        <defs>
          <linearGradient id="shield-grad" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="rgba(16,185,129,0.3)" />
            <stop offset="100%" stopColor="rgba(16,185,129,0.05)" />
          </linearGradient>
        </defs>
        {/* Shield shape */}
        <path d="M24,6 L40,14 L40,26 C40,34 32,42 24,44 C16,42 8,34 8,26 L8,14 Z"
          fill="url(#shield-grad)" stroke="rgba(16,185,129,0.35)" strokeWidth="1.2" />
        {/* Inner ring */}
        <path d="M24,12 L34,18 L34,27 C34,32 29,37 24,38 C19,37 14,32 14,27 L14,18 Z"
          fill="none" stroke="rgba(16,185,129,0.12)" strokeWidth="0.8" />
        {/* Checkmark */}
        <path d="M17,24 L22,29 L31,19" fill="none" stroke="rgba(16,185,129,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Wrap>
  )
}

// ─── AUDIT CLOSURE — Clipboard with seal ─────────────────
export function GeoAuditClosure() {
  return (
    <Wrap>
      <svg viewBox="0 0 48 48" className="w-full h-full" style={{ transform: "translateZ(4px)" }}>
        {/* Clipboard body */}
        <rect x="10" y="10" width="28" height="34" rx="3" fill="rgba(16,185,129,0.05)" stroke="rgba(16,185,129,0.25)" strokeWidth="1" />
        {/* Clip */}
        <rect x="18" y="6" width="12" height="8" rx="2" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.3)" strokeWidth="0.8" />
        {/* Lines */}
        {[18, 23, 28].map(y => (
          <line key={y} x1="16" y1={y} x2="32" y2={y} stroke="rgba(16,185,129,0.1)" strokeWidth="0.8" />
        ))}
        {/* Seal stamp (circle at bottom) */}
        <circle cx="30" cy="36" r="5" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.35)" strokeWidth="0.8" />
        <path d="M28,36 L29.5,37.5 L32.5,34" fill="none" stroke="rgba(16,185,129,0.5)" strokeWidth="1" strokeLinecap="round" />
      </svg>
    </Wrap>
  )
}

// ─── VM PRIVACY — Lock with circuit traces ───────────────
export function GeoPrivacy() {
  return (
    <Wrap>
      <svg viewBox="0 0 48 48" className="w-full h-full" style={{ transform: "translateZ(4px)" }}>
        {/* Lock body */}
        <rect x="12" y="22" width="24" height="18" rx="4" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.3)" strokeWidth="1.2" />
        {/* Shackle */}
        <path d="M16,22 L16,16 A8,8 0 0 1 32,16 L32,22" fill="none" stroke="rgba(16,185,129,0.35)" strokeWidth="1.5" strokeLinecap="round" />
        {/* Keyhole */}
        <circle cx="24" cy="30" r="2.5" fill="rgba(16,185,129,0.3)" />
        <rect x="23" y="31" width="2" height="5" rx="1" fill="rgba(16,185,129,0.25)" />
        {/* Circuit traces */}
        <line x1="6" y1="28" x2="12" y2="28" stroke="rgba(16,185,129,0.1)" strokeWidth="0.5" />
        <line x1="36" y1="28" x2="42" y2="28" stroke="rgba(16,185,129,0.1)" strokeWidth="0.5" />
        <line x1="6" y1="34" x2="12" y2="34" stroke="rgba(16,185,129,0.08)" strokeWidth="0.5" />
        <line x1="36" y1="34" x2="42" y2="34" stroke="rgba(16,185,129,0.08)" strokeWidth="0.5" />
        {/* Circuit dots */}
        <circle cx="5" cy="28" r="1" fill="rgba(16,185,129,0.15)" />
        <circle cx="43" cy="28" r="1" fill="rgba(16,185,129,0.15)" />
      </svg>
    </Wrap>
  )
}

/* ─── ICON MAP ─────────────────────────────────────────── */
export const GEO_ICON_MAP: Record<string, () => JSX.Element> = {
  "Markets": GeoMarkets,
  "Market Detail": GeoMarketDetail,
  "Insights": GeoInsights,
  "DeFi Console": GeoDeFi,
  "Portfolio": GeoPortfolio,
  "Rewards": GeoRewards,
  "Leaderboard": GeoLeaderboard,
  "Governance": GeoGovernance,
  "Transparency": GeoTransparency,
  "Documentation": GeoDocs,
  "API Docs": GeoApiDocs,
  "MAIEV Home": GeoMaiev,
  "Audit Closure": GeoAuditClosure,
  "VM Privacy Audits": GeoPrivacy,
}

export function GeoIcon({ name }: { name: string }) {
  const Component = GEO_ICON_MAP[name]
  if (!Component) return null
  return <Component />
}
