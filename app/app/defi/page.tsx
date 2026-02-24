"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import Link from "next/link"
import { VeilFooter, VeilHeader, FilmGrain } from "@/components/brand"

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */

function ScrollReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay }}
      className={className}>{children}</motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SWAP TERMINAL
   ═══════════════════════════════════════════════════════════════ */

type Token = { symbol: string; name: string; balance: string; icon: string; color: string }

const TOKENS: Token[] = [
  { symbol: "VEIL", name: "VEIL", balance: "0.00", icon: "▽", color: "rgba(16,185,129,0.8)" },
  { symbol: "WVEIL", name: "Wrapped VEIL", balance: "0.00", icon: "◇", color: "rgba(16,185,129,0.6)" },
  { symbol: "VAI", name: "VAI Stablecoin", balance: "0.00", icon: "◎", color: "rgba(245,158,11,0.8)" },
]

function TokenSelector({ selected, onSelect, exclude }: { selected: Token; onSelect: (t: Token) => void; exclude?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 hover:bg-white/[0.04]"
        style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
        <span className="text-lg" style={{ color: selected.color }}>{selected.icon}</span>
        <span className="text-sm font-semibold text-white/80" style={{ fontFamily: "var(--font-space-grotesk)" }}>{selected.symbol}</span>
        <svg className="w-3 h-3 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 z-50 rounded-2xl overflow-hidden backdrop-blur-xl"
            style={{ background: "rgba(12,12,12,0.95)", border: "1px solid rgba(255,255,255,0.06)", minWidth: "180px" }}>
            {TOKENS.filter(t => t.symbol !== exclude).map(t => (
              <button key={t.symbol} onClick={() => { onSelect(t); setOpen(false) }}
                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/[0.04] transition-colors">
                <span className="text-lg" style={{ color: t.color }}>{t.icon}</span>
                <div className="text-left">
                  <div className="text-sm font-medium text-white/80" style={{ fontFamily: "var(--font-space-grotesk)" }}>{t.symbol}</div>
                  <div className="text-[10px] text-white/25" style={{ fontFamily: "var(--font-figtree)" }}>{t.name}</div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SwapTerminal() {
  const [fromToken, setFromToken] = useState(TOKENS[0])
  const [toToken, setToToken] = useState(TOKENS[2])
  const [fromAmount, setFromAmount] = useState("")
  const [slippage, setSlippage] = useState("0.5")
  const [showSettings, setShowSettings] = useState(false)

  const estimatedOut = fromAmount ? (parseFloat(fromAmount) * 0.9847).toFixed(4) : ""
  const rate = "1 VEIL ≈ 0.9847 VAI"
  const priceImpact = fromAmount && parseFloat(fromAmount) > 100 ? "0.12%" : "<0.01%"

  const flipTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount("")
  }

  return (
    <div className="rounded-[24px] overflow-hidden" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
      {/* Terminal header */}
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center gap-4">
          {["Swap", "Limit"].map((tab, i) => (
            <button key={tab} className="text-[12px] tracking-[0.1em] uppercase transition-colors duration-300"
              style={{ fontFamily: "var(--font-space-grotesk)", color: i === 0 ? "rgba(16,185,129,0.8)" : "rgba(255,255,255,0.25)" }}>
              {tab}
            </button>
          ))}
        </div>
        <button onClick={() => setShowSettings(!showSettings)}
          className="p-1.5 rounded-lg hover:bg-white/[0.04] transition-colors">
          <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Slippage settings */}
      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <div className="px-6 py-4">
              <p className="text-[10px] tracking-[0.15em] uppercase text-white/30 mb-3" style={{ fontFamily: "var(--font-space-grotesk)" }}>Slippage Tolerance</p>
              <div className="flex gap-2">
                {["0.1", "0.5", "1.0"].map(s => (
                  <button key={s} onClick={() => setSlippage(s)}
                    className="px-3 py-1.5 rounded-lg text-[12px] transition-all duration-300"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      background: slippage === s ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${slippage === s ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.04)"}`,
                      color: slippage === s ? "rgba(16,185,129,0.8)" : "rgba(255,255,255,0.4)",
                    }}>
                    {s}%
                  </button>
                ))}
                <input type="text" placeholder="Custom" value={!["0.1", "0.5", "1.0"].includes(slippage) ? slippage : ""}
                  onChange={e => setSlippage(e.target.value)}
                  className="w-20 px-3 py-1.5 rounded-lg text-[12px] text-white/60 bg-white/[0.02] outline-none focus:border-emerald-500/20 transition-colors"
                  style={{ fontFamily: "var(--font-space-grotesk)", border: "1px solid rgba(255,255,255,0.04)" }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* From input */}
      <div className="px-6 pt-5 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] tracking-[0.15em] uppercase text-white/25" style={{ fontFamily: "var(--font-space-grotesk)" }}>You Pay</span>
          <span className="text-[11px] text-white/20" style={{ fontFamily: "var(--font-space-grotesk)" }}>Balance: {fromToken.balance}</span>
        </div>
        <div className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
          <input type="text" placeholder="0.0" value={fromAmount} onChange={e => setFromAmount(e.target.value)}
            className="flex-1 bg-transparent text-2xl font-light text-white/90 outline-none placeholder:text-white/15"
            style={{ fontFamily: "var(--font-instrument-serif)" }} />
          <TokenSelector selected={fromToken} onSelect={setFromToken} exclude={toToken.symbol} />
        </div>
      </div>

      {/* Flip button */}
      <div className="flex justify-center -my-2 relative z-10">
        <motion.button onClick={flipTokens} whileHover={{ scale: 1.1, rotate: 180 }} whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
          <svg className="w-4 h-4" style={{ color: "rgba(16,185,129,0.6)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </motion.button>
      </div>

      {/* To input */}
      <div className="px-6 pt-2 pb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] tracking-[0.15em] uppercase text-white/25" style={{ fontFamily: "var(--font-space-grotesk)" }}>You Receive</span>
          <span className="text-[11px] text-white/20" style={{ fontFamily: "var(--font-space-grotesk)" }}>Balance: {toToken.balance}</span>
        </div>
        <div className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
          <span className="flex-1 text-2xl font-light" style={{ fontFamily: "var(--font-instrument-serif)", color: estimatedOut ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.15)" }}>
            {estimatedOut || "0.0"}
          </span>
          <TokenSelector selected={toToken} onSelect={setToToken} exclude={fromToken.symbol} />
        </div>
      </div>

      {/* Rate + details */}
      {fromAmount && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="px-6 pb-4 overflow-hidden">
          <div className="rounded-xl px-4 py-3 space-y-2" style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)" }}>
            {[
              { label: "Rate", value: rate },
              { label: "Price Impact", value: priceImpact },
              { label: "Slippage", value: `${slippage}%` },
              { label: "Route", value: `${fromToken.symbol} → ${toToken.symbol}` },
              { label: "Fee", value: "0.03%" },
            ].map(r => (
              <div key={r.label} className="flex justify-between">
                <span className="text-[11px] text-white/25" style={{ fontFamily: "var(--font-space-grotesk)" }}>{r.label}</span>
                <span className="text-[11px] text-white/50" style={{ fontFamily: "var(--font-space-grotesk)" }}>{r.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action button */}
      <div className="px-6 pb-6">
        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          className="w-full py-4 rounded-2xl text-[13px] tracking-wider font-semibold uppercase transition-all duration-500"
          style={{
            fontFamily: "var(--font-space-grotesk)",
            background: fromAmount ? "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.08) 100%)" : "rgba(255,255,255,0.02)",
            border: `1px solid ${fromAmount ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.04)"}`,
            color: fromAmount ? "rgb(52,211,153)" : "rgba(255,255,255,0.2)",
            boxShadow: fromAmount ? "0 0 40px rgba(16,185,129,0.08)" : "none",
          }}>
          {fromAmount ? "Connect Wallet" : "Enter Amount"}
        </motion.button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   LIQUIDITY PANEL
   ═══════════════════════════════════════════════════════════════ */

function LiquidityPanel() {
  return (
    <div className="rounded-[24px] overflow-hidden" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <span className="text-[12px] tracking-[0.1em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.8)" }}>Liquidity Pools</span>
        <span className="text-[10px] text-white/20" style={{ fontFamily: "var(--font-space-grotesk)" }}>UniV2</span>
      </div>

      {/* Pool card */}
      <div className="p-6">
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg" style={{ color: "rgba(16,185,129,0.8)" }}>▽</span>
              <span className="text-lg" style={{ color: "rgba(245,158,11,0.8)" }}>◎</span>
              <span className="text-sm font-semibold text-white/80 ml-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>WVEIL / VAI</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] tracking-wider uppercase" style={{ fontFamily: "var(--font-space-grotesk)", background: "rgba(16,185,129,0.08)", color: "rgba(16,185,129,0.6)", border: "1px solid rgba(16,185,129,0.15)" }}>Active</span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-5">
            {[
              { label: "TVL", value: "—" },
              { label: "APR", value: "—" },
              { label: "Volume 24h", value: "—" },
            ].map(s => (
              <div key={s.label}>
                <div className="text-[9px] tracking-[0.15em] uppercase text-white/20 mb-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>{s.label}</div>
                <div className="text-lg font-light text-white/60" style={{ fontFamily: "var(--font-instrument-serif)" }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button className="flex-1 py-2.5 rounded-xl text-[11px] tracking-wider uppercase font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
              style={{ fontFamily: "var(--font-space-grotesk)", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)", color: "rgba(16,185,129,0.7)" }}>
              Add Liquidity
            </button>
            <button className="flex-1 py-2.5 rounded-xl text-[11px] tracking-wider uppercase font-medium transition-all duration-300"
              style={{ fontFamily: "var(--font-space-grotesk)", border: "1px solid rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)" }}>
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   STAKING PANEL
   ═══════════════════════════════════════════════════════════════ */

function StakingPanel() {
  const [amount, setAmount] = useState("")
  return (
    <div className="rounded-[24px] overflow-hidden" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <span className="text-[12px] tracking-[0.1em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.8)" }}>Stake VEIL</span>
        <span className="text-[10px] text-white/20" style={{ fontFamily: "var(--font-space-grotesk)" }}>Olympus-style</span>
      </div>

      <div className="p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "APY", value: "—", sub: "variable" },
            { label: "Index", value: "—", sub: "vVEIL" },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.03)" }}>
              <div className="text-[9px] tracking-[0.15em] uppercase text-white/20 mb-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>{s.label}</div>
              <div className="text-2xl font-light text-white/70" style={{ fontFamily: "var(--font-instrument-serif)" }}>{s.value}</div>
              <div className="text-[10px] text-white/15 mt-0.5" style={{ fontFamily: "var(--font-space-grotesk)" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Stake input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] tracking-[0.15em] uppercase text-white/25" style={{ fontFamily: "var(--font-space-grotesk)" }}>Stake Amount</span>
            <button className="text-[10px] text-emerald-500/50 hover:text-emerald-400/70 transition-colors" style={{ fontFamily: "var(--font-space-grotesk)" }}>MAX</button>
          </div>
          <div className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <input type="text" placeholder="0.0" value={amount} onChange={e => setAmount(e.target.value)}
              className="flex-1 bg-transparent text-xl font-light text-white/90 outline-none placeholder:text-white/15"
              style={{ fontFamily: "var(--font-instrument-serif)" }} />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.1)" }}>
              <span style={{ color: "rgba(16,185,129,0.8)" }}>▽</span>
              <span className="text-sm font-medium text-white/70" style={{ fontFamily: "var(--font-space-grotesk)" }}>VEIL</span>
            </div>
          </div>
        </div>

        {/* You receive */}
        {amount && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="rounded-xl px-4 py-3" style={{ background: "rgba(16,185,129,0.02)", border: "1px solid rgba(16,185,129,0.06)" }}>
            <div className="flex justify-between">
              <span className="text-[11px] text-white/25" style={{ fontFamily: "var(--font-space-grotesk)" }}>You receive</span>
              <span className="text-[11px] text-emerald-400/60" style={{ fontFamily: "var(--font-space-grotesk)" }}>{amount} vVEIL</span>
            </div>
          </motion.div>
        )}

        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          className="w-full py-3.5 rounded-2xl text-[12px] tracking-wider font-semibold uppercase transition-all duration-500"
          style={{
            fontFamily: "var(--font-space-grotesk)",
            background: amount ? "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.08) 100%)" : "rgba(255,255,255,0.02)",
            border: `1px solid ${amount ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.04)"}`,
            color: amount ? "rgb(52,211,153)" : "rgba(255,255,255,0.2)",
          }}>
          {amount ? "Connect Wallet" : "Enter Amount"}
        </motion.button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   CDP / VAI PANEL
   ═══════════════════════════════════════════════════════════════ */

function CDPPanel() {
  return (
    <div className="rounded-[24px] overflow-hidden" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <span className="text-[12px] tracking-[0.1em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(245,158,11,0.8)" }}>Mint VAI</span>
        <span className="text-[10px] text-white/20" style={{ fontFamily: "var(--font-space-grotesk)" }}>CDP</span>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Stability Fee", value: "—" },
            { label: "Min Ratio", value: "150%" },
            { label: "VAI Supply", value: "—" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-[9px] tracking-[0.12em] uppercase text-white/20 mb-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>{s.label}</div>
              <div className="text-sm font-medium text-white/50" style={{ fontFamily: "var(--font-space-grotesk)" }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(245,158,11,0.02)", border: "1px solid rgba(245,158,11,0.08)" }}>
          <p className="text-[12px] text-white/35 leading-relaxed" style={{ fontFamily: "var(--font-figtree)" }}>
            Deposit VEIL as collateral to mint VAI stablecoin. MakerDAO-style CDPs with on-chain liquidation via Dog/Clip.
          </p>
        </div>

        <button className="w-full py-3 rounded-2xl text-[11px] tracking-wider uppercase font-medium transition-all duration-300"
          style={{ fontFamily: "var(--font-space-grotesk)", background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.12)", color: "rgba(245,158,11,0.6)" }}>
          Open Vault
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   BONDS PANEL
   ═══════════════════════════════════════════════════════════════ */

function BondsPanel() {
  return (
    <div className="rounded-[24px] overflow-hidden" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <span className="text-[12px] tracking-[0.1em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(168,85,247,0.8)" }}>Bond Market</span>
        <span className="text-[10px] text-white/20" style={{ fontFamily: "var(--font-space-grotesk)" }}>Olympus-style</span>
      </div>

      <div className="p-6 space-y-3">
        {[
          { asset: "WVEIL-VAI LP", discount: "—", vesting: "5 days", icon: "◆" },
          { asset: "VAI", discount: "—", vesting: "5 days", icon: "◎" },
        ].map(bond => (
          <div key={bond.asset} className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-white/[0.02] transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.03)" }}>
            <div className="flex items-center gap-3">
              <span className="text-white/30">{bond.icon}</span>
              <div>
                <div className="text-[13px] font-medium text-white/70" style={{ fontFamily: "var(--font-space-grotesk)" }}>{bond.asset}</div>
                <div className="text-[10px] text-white/20" style={{ fontFamily: "var(--font-space-grotesk)" }}>Vesting: {bond.vesting}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[13px] font-medium text-white/50" style={{ fontFamily: "var(--font-space-grotesk)" }}>{bond.discount}</div>
              <div className="text-[9px] text-white/15 uppercase tracking-wider" style={{ fontFamily: "var(--font-space-grotesk)" }}>Discount</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PROTOCOL STATS
   ═══════════════════════════════════════════════════════════════ */

function ProtocolStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        { label: "Treasury", value: "—", sub: "VEIL" },
        { label: "TVL", value: "—", sub: "Total" },
        { label: "VEIL Price", value: "—", sub: "vs VAI" },
        { label: "Backing", value: "—", sub: "per VEIL" },
      ].map(s => (
        <div key={s.label} className="rounded-[20px] p-5 text-center" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="text-[9px] tracking-[0.2em] uppercase text-white/20 mb-2" style={{ fontFamily: "var(--font-space-grotesk)" }}>{s.label}</div>
          <div className="text-2xl md:text-3xl font-light text-white/70 mb-1" style={{ fontFamily: "var(--font-instrument-serif)" }}>{s.value}</div>
          <div className="text-[10px] text-white/15" style={{ fontFamily: "var(--font-space-grotesk)" }}>{s.sub}</div>
        </div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function DefiPage() {
  const [activeTab, setActiveTab] = useState<"swap" | "liquidity" | "stake" | "cdp" | "bonds">("swap")

  return (
    <div className="relative min-h-screen" style={{ background: "#060606", color: "white" }}>
      <FilmGrain />
      <VeilHeader />

      {/* Ambient gradient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full" style={{ background: "radial-gradient(ellipse, rgba(16,185,129,0.03) 0%, transparent 70%)" }} />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20">
        {/* Hero */}
        <ScrollReveal>
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[9px] tracking-[0.4em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.4)", fontWeight: 600 }}>01</span>
              <span className="h-px w-5" style={{ background: "rgba(16,185,129,0.15)" }} />
              <span className="text-[8px] tracking-[0.4em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.2)" }}>DeFi Terminal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-3" style={{ fontFamily: "var(--font-instrument-serif)", color: "rgba(255,255,255,0.92)" }}>
              Execute on VEIL
            </h1>
            <p className="text-base text-white/35 max-w-xl" style={{ fontFamily: "var(--font-figtree)", fontWeight: 300, lineHeight: 1.8 }}>
              Swap, stake, provide liquidity, mint VAI, and bond — all through the privacy-preserving VEIL companion EVM. Every transaction routed through encrypted intent rails.
            </p>
          </div>
        </ScrollReveal>

        {/* Protocol stats */}
        <ScrollReveal delay={0.05}>
          <div className="mb-10">
            <ProtocolStats />
          </div>
        </ScrollReveal>

        {/* Tab navigation */}
        <ScrollReveal delay={0.1}>
          <div className="flex gap-1 mb-8 p-1 rounded-2xl inline-flex" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
            {([
              { key: "swap", label: "Swap" },
              { key: "liquidity", label: "Liquidity" },
              { key: "stake", label: "Stake" },
              { key: "cdp", label: "Mint VAI" },
              { key: "bonds", label: "Bonds" },
            ] as const).map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className="px-5 py-2.5 rounded-xl text-[11px] tracking-[0.1em] uppercase font-medium transition-all duration-300"
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  background: activeTab === tab.key ? "rgba(16,185,129,0.08)" : "transparent",
                  color: activeTab === tab.key ? "rgba(16,185,129,0.8)" : "rgba(255,255,255,0.25)",
                  border: activeTab === tab.key ? "1px solid rgba(16,185,129,0.12)" : "1px solid transparent",
                }}>
                {tab.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Terminal panels */}
        <ScrollReveal delay={0.15}>
          <div className="grid lg:grid-cols-2 gap-6">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}>
                {activeTab === "swap" && <SwapTerminal />}
                {activeTab === "liquidity" && <LiquidityPanel />}
                {activeTab === "stake" && <StakingPanel />}
                {activeTab === "cdp" && <CDPPanel />}
                {activeTab === "bonds" && <BondsPanel />}
              </motion.div>
            </AnimatePresence>

            {/* Side info */}
            <div className="space-y-4">
              <div className="rounded-[20px] p-6" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <h3 className="text-[11px] tracking-[0.15em] uppercase mb-4" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.6)" }}>How It Works</h3>
                <div className="space-y-3">
                  {[
                    { step: "01", text: "Submit encrypted intent via companion EVM gateway" },
                    { step: "02", text: "Relayer verifies commitment, forwards to VeilVM" },
                    { step: "03", text: "ZK-proof-gated execution in private batch" },
                    { step: "04", text: "Settlement confirmed on-chain, tokens delivered" },
                  ].map(s => (
                    <div key={s.step} className="flex gap-3">
                      <span className="text-[10px] font-semibold shrink-0 pt-0.5" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.3)" }}>{s.step}</span>
                      <span className="text-[13px] text-white/35" style={{ fontFamily: "var(--font-figtree)" }}>{s.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[20px] p-6" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <h3 className="text-[11px] tracking-[0.15em] uppercase mb-3" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.6)" }}>Contracts</h3>
                <div className="space-y-2">
                  {[
                    { name: "WVEIL", addr: "0x7c93...8116" },
                    { name: "VAI", addr: "0x05e0...1F2Eb" },
                    { name: "Router", addr: "0xe0Ea...9cf1" },
                    { name: "Treasury", addr: "0x9378...EED6" },
                  ].map(c => (
                    <div key={c.name} className="flex justify-between">
                      <span className="text-[11px] text-white/30" style={{ fontFamily: "var(--font-space-grotesk)" }}>{c.name}</span>
                      <span className="text-[11px] text-emerald-500/30 font-mono">{c.addr}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[20px] p-6" style={{ background: "rgba(16,185,129,0.015)", border: "1px solid rgba(16,185,129,0.06)" }}>
                <p className="text-[12px] text-white/30 leading-relaxed" style={{ fontFamily: "var(--font-figtree)" }}>
                  All DeFi operations execute through privacy-preserving intent rails. No cleartext order data touches the companion EVM.
                  <Link href="/app/docs" className="text-emerald-500/40 hover:text-emerald-400/60 ml-1 transition-colors">Read the architecture →</Link>
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </main>

      <VeilFooter />
    </div>
  )
}
