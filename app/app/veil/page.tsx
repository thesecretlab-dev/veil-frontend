"use client"

import { VeilFooter, VeilHeader } from '@/components/brand'

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"

import { getFeature } from "@/app/lib/surface-translation-registry"
import type { PortalStatusResponse } from "@/lib/portal-status"

/* ─── Types ─── */
type ActionTab = "swap" | "stake" | "bond"
type Token = "VEIL" | "wVEIL" | "VAI" | "USDC"
type BondAsset = "VEIL-USDC LP" | "wVEIL-VAI LP" | "AVAX-VAI LP"

type Position = {
  token: Token | "LP" | "vVEIL" | "gVEIL"
  amount: string
}

type LiquidityDepthPolicy = {
  recommendedApyPct: number
  recommendedEpochRebasePct: number
  formula: string
}

type LiquidityDepthTarget = {
  targetReserveVai: number
  targetSlippagePct: number
  referenceTradeVai: number
}

type LiquidityDepthObserved = {
  reserveVai: number
  impactAtReferencePct: number
  targetMet: boolean
}

type LiquidityDepthGap = {
  pct: number
  ratio: number
  deficitReserveVai: number
}

type LiquidityDepthResponse = {
  available: boolean
  generatedAt: string | null
  target: LiquidityDepthTarget
  observed: LiquidityDepthObserved
  gap: LiquidityDepthGap
  policy: LiquidityDepthPolicy
}

/* ─── Constants ─── */
const TABS: Array<{ id: ActionTab; label: string; helper: string }> = [
  { id: "swap", label: "Swap", helper: "Trade between supported assets." },
  { id: "stake", label: "Stake", helper: "Mint rebasing vVEIL; wrap to gVEIL for non-rebasing governance units." },
  { id: "bond", label: "Bond", helper: "Bond LP assets into treasury flow." },
]

const POOLS: Array<{ pair: string; status: string; mode: string }> = [
  { pair: "wVEIL / VAI", status: "Active", mode: "Staged rollout" },
  { pair: "VEIL / USDC", status: "Active", mode: "Staged rollout" },
  { pair: "AVAX / VAI", status: "Pending", mode: "Awaiting depth bootstrap" },
]

const CHECKLIST: Array<{ id: string; label: string }> = [
  { id: "marketFeed", label: "Market feed online" },
  { id: "bridge", label: "Bridge snapshot passing" },
  { id: "chainlink", label: "Chainlink feeds fresh" },
  { id: "router", label: "Order router reachable" },
  { id: "prelaunch", label: "Prelaunch gates passing" },
]

const TOKEN_ROLES: Array<{ token: string; role: string }> = [
  { token: "VEIL", role: "Base utility + staking asset." },
  { token: "wVEIL", role: "Liquid wrapper used in swaps and LP routes." },
  { token: "vVEIL", role: "Rebasing staked balance (VEIL-native emission lane)." },
  { token: "gVEIL", role: "Non-rebasing wrapper + governance units backed by vVEIL index." },
  { token: "VAI", role: "Stable execution and treasury routing rail." },
]

const ECOSYSTEM_FLOW: Array<{ step: string; detail: string }> = [
  { step: "1. Swap In", detail: "Users enter VEIL rails through VEIL, wVEIL, and VAI pools." },
  { step: "2. Stake", detail: "Staking mints rebasing vVEIL." },
  { step: "3. Rebase", detail: "vVEIL APY is raised or cooled by liquidity target gap monitoring." },
  { step: "4. Wrap", detail: "gVEIL wraps rebasing value into non-rebasing governance units." },
  { step: "5. Bond", detail: "LP positions can be bonded into chain-owned liquidity lanes." },
  { step: "6. Execute", detail: "Keepers and governance-approved jobs run treasury and market operations." },
]

const COMPANION_RAILS = getFeature("companion_evm_rails")
const WALLET_COMPAT = getFeature("evm_wallet_compatibility")
const EXECUTION_ENABLED = COMPANION_RAILS?.ui_action_policy.cta_state === "enabled"
const WALLET_ENABLED = WALLET_COMPAT?.ui_action_policy.cta_state === "enabled"
const EXECUTION_REASON =
  COMPANION_RAILS?.ui_action_policy.cta_reason ?? "Execution remains staged by operator rollout policy."
const WALLET_REASON =
  WALLET_COMPAT?.ui_action_policy.cta_reason ?? "Wallet compatibility remains in staged rollout."

/* ─── Helpers ─── */
function shortAddress(value: string): string {
  if (value.length < 12) return value
  return `${value.slice(0, 6)}...${value.slice(-4)}`
}

function statusTone(ok: boolean | null): string {
  if (ok === null) return "border-white/10 bg-white/5 text-white/50"
  if (ok) return "border-emerald-500/30 bg-emerald-500/8 text-emerald-400"
  return "border-amber-500/30 bg-amber-500/8 text-amber-300"
}

function statusText(ok: boolean | null): string {
  if (ok === null) return "unknown"
  return ok ? "ready" : "attention"
}

function inferEnvironment(status: PortalStatusResponse | null): "testnet" | "mainnet" | "unknown" {
  const chainId = status?.bridge.chainId
  if (!chainId) return "unknown"
  if (chainId === 43114) return "mainnet"
  return "testnet"
}

function isMainnet(status: PortalStatusResponse | null): boolean {
  return inferEnvironment(status) === "mainnet"
}

declare global {
  interface Window {
    ethereum?: any
  }
}

/* ─── ScrollReveal wrapper ─── */
function ScrollReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Section label ─── */
function SectionLabel({ number, title, sub }: { number: string; title: string; sub?: string }) {
  return (
    <div className="mb-6 flex items-end gap-4">
      <span className="font-[var(--font-instrument-serif)] text-[clamp(2rem,4vw,3.5rem)] leading-none text-emerald-500/20">{number}</span>
      <div>
        <h2 className="font-[var(--font-space-grotesk)] text-lg font-medium tracking-tight text-white/90">{title}</h2>
        {sub && <p className="mt-0.5 font-[var(--font-figtree)] text-xs text-white/40">{sub}</p>}
      </div>
    </div>
  )
}

/* ─── Card shell ─── */
function Card({ children, className = "", glow = false }: { children: React.ReactNode; className?: string; glow?: boolean }) {
  return (
    <div
      className={`rounded-[20px] border border-white/[0.06] bg-white/[0.02] backdrop-blur-2xl ${
        glow ? "shadow-[0_0_80px_rgba(16,185,129,0.06)]" : ""
      } ${className}`}
    >
      {children}
    </div>
  )
}

/* ─── Film grain overlay ─── */
function FilmGrain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.035]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
      }}
    />
  )
}

/* ─── Styled input ─── */
function LuxInput({ value, onChange, placeholder, className = "" }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <input
      className={`w-full rounded-[14px] border border-white/[0.06] bg-white/[0.03] px-4 py-3 font-[var(--font-space-grotesk)] text-sm text-white/90 outline-none transition-colors placeholder:text-white/25 focus:border-emerald-500/30 focus:bg-white/[0.04] ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  )
}

function LuxSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      className="w-full rounded-[14px] border border-white/[0.06] bg-white/[0.03] px-4 py-3 font-[var(--font-space-grotesk)] text-sm text-white/90 outline-none transition-colors focus:border-emerald-500/30"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════ */
export default function VeilDeFiPage() {
  const [status, setStatus] = useState<PortalStatusResponse | null>(null)
  const [isStatusLoading, setIsStatusLoading] = useState(true)
  const [liquidityDepth, setLiquidityDepth] = useState<LiquidityDepthResponse | null>(null)
  const [isLiquidityLoading, setIsLiquidityLoading] = useState(true)

  const [activeTab, setActiveTab] = useState<ActionTab>("swap")
  const [toast, setToast] = useState("")

  const [walletAddress, setWalletAddress] = useState("")
  const [walletError, setWalletError] = useState("")
  const [isWalletConnecting, setIsWalletConnecting] = useState(false)

  const [swapFromToken, setSwapFromToken] = useState<Token>("wVEIL")
  const [swapToToken, setSwapToToken] = useState<Token>("VAI")
  const [swapAmount, setSwapAmount] = useState("100")
  const [swapSlippage, setSwapSlippage] = useState("0.50")

  const [stakeAmount, setStakeAmount] = useState("1000")
  const [stakeDurationDays, setStakeDurationDays] = useState("30")
  const [autoCompound, setAutoCompound] = useState(true)

  const [bondAsset, setBondAsset] = useState<BondAsset>("wVEIL-VAI LP")
  const [bondAmount, setBondAmount] = useState("50")
  const [bondVestDays, setBondVestDays] = useState("7")

  const [positions, setPositions] = useState<Position[]>([
    { token: "VEIL", amount: "0.00" },
    { token: "wVEIL", amount: "0.00" },
    { token: "vVEIL", amount: "0.00" },
    { token: "gVEIL", amount: "0.00" },
    { token: "VAI", amount: "0.00" },
    { token: "USDC", amount: "0.00" },
    { token: "LP", amount: "0.00" },
  ])

  /* ─── Data fetching (unchanged logic) ─── */
  useEffect(() => {
    let cancelled = false
    const loadStatus = async () => {
      try {
        const response = await fetch("/api/portal-status", { cache: "no-store" })
        if (!response.ok) throw new Error("portal-status unavailable")
        const payload = (await response.json()) as PortalStatusResponse
        if (!cancelled) setStatus(payload)
      } catch {
        if (!cancelled) setStatus(null)
      } finally {
        if (!cancelled) setIsStatusLoading(false)
      }
    }
    void loadStatus()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    const loadLiquidityDepth = async () => {
      try {
        const response = await fetch("/api/liquidity-depth", { cache: "no-store" })
        if (!response.ok) throw new Error("liquidity-depth unavailable")
        const payload = (await response.json()) as LiquidityDepthResponse
        if (!cancelled && payload.available) setLiquidityDepth(payload)
      } catch {
        if (!cancelled) setLiquidityDepth(null)
      } finally {
        if (!cancelled) setIsLiquidityLoading(false)
      }
    }
    void loadLiquidityDepth()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!WALLET_ENABLED) {
      setWalletAddress("")
      return
    }
    if (typeof window === "undefined" || typeof window.ethereum === "undefined") return
    let mounted = true
    const syncAccounts = async () => {
      try {
        const accounts = await window.ethereum?.request({ method: "eth_accounts" })
        if (!mounted) return
        if (Array.isArray(accounts) && accounts.length > 0) {
          setWalletAddress(String(accounts[0]))
          setPositions([
            { token: "VEIL", amount: "12,500.00" },
            { token: "wVEIL", amount: "11,200.00" },
            { token: "vVEIL", amount: "8,400.00" },
            { token: "gVEIL", amount: "5,950.00" },
            { token: "VAI", amount: "4,120.50" },
            { token: "USDC", amount: "3,890.00" },
            { token: "LP", amount: "245.77" },
          ])
        } else {
          setWalletAddress("")
        }
      } catch {
        if (mounted) setWalletAddress("")
      }
    }
    const onAccountsChanged = (accounts: string[]) => {
      if (!mounted) return
      const next = Array.isArray(accounts) && accounts.length > 0 ? String(accounts[0]) : ""
      setWalletAddress(next)
      if (!next) {
        setPositions([
          { token: "VEIL", amount: "0.00" }, { token: "wVEIL", amount: "0.00" },
          { token: "vVEIL", amount: "0.00" }, { token: "gVEIL", amount: "0.00" },
          { token: "VAI", amount: "0.00" }, { token: "USDC", amount: "0.00" },
          { token: "LP", amount: "0.00" },
        ])
      }
    }
    void syncAccounts()
    window.ethereum.on?.("accountsChanged", onAccountsChanged)
    return () => { mounted = false; window.ethereum?.removeListener?.("accountsChanged", onAccountsChanged) }
  }, [])

  useEffect(() => {
    if (!toast) return
    const timeout = setTimeout(() => setToast(""), 2800)
    return () => clearTimeout(timeout)
  }, [toast])

  /* ─── Derived ─── */
  const env = inferEnvironment(status)
  const showTestnetBanner = !isMainnet(status)

  const summaryCards = useMemo(() => {
    const dynamicApy = liquidityDepth?.policy.recommendedApyPct ?? 0
    const gapPct = liquidityDepth?.gap.pct ?? 0
    return [
      { label: "Environment", value: env === "mainnet" ? "Mainnet" : env === "testnet" ? "Testnet" : "Unknown", helper: status?.bridge.chainId ? `Chain ID ${status.bridge.chainId}` : "Chain not detected" },
      { label: "Active Markets", value: isStatusLoading ? "..." : `${status?.markets.active ?? 0}`, helper: `${status?.markets.total ?? 0} tracked` },
      { label: "Router", value: status?.orderRouter.configured ? (status.orderRouter.reachable ? "Online" : "Offline") : "Unconfigured", helper: status?.orderRouter.configured ? `HTTP ${status.orderRouter.statusCode ?? "n/a"}` : "VEIL_ORDER_API_BASE missing" },
      { label: "Dynamic vVEIL APY", value: isLiquidityLoading ? "..." : `${dynamicApy.toFixed(2)}%`, helper: isLiquidityLoading ? "Liquidity model loading" : `Target gap ${gapPct.toFixed(2)}%` },
      { label: "Open Gates", value: isStatusLoading ? "..." : `${status?.prelaunch.failingGateCount ?? 0}`, helper: "Readiness checklist" },
    ]
  }, [env, isLiquidityLoading, isStatusLoading, liquidityDepth, status])

  const readinessRows = useMemo(() => {
    if (!status) return { marketFeed: null, bridge: null, chainlink: null, router: null, prelaunch: null } as Record<string, boolean | null>
    return {
      marketFeed: status.flags.liveMarketsAvailable,
      bridge: status.bridge.overallPass,
      chainlink: status.flags.chainlinkFresh,
      router: status.orderRouter.configured ? status.orderRouter.reachable : null,
      prelaunch: status.prelaunch.overallPass,
    } as Record<string, boolean | null>
  }, [status])

  const swapPreview = useMemo(() => {
    const amount = Number.parseFloat(swapAmount || "0")
    const slip = Number.parseFloat(swapSlippage || "0")
    if (!Number.isFinite(amount) || amount <= 0) return "Enter amount to preview."
    if (!Number.isFinite(slip) || slip < 0) return "Invalid slippage."
    return `Swap ${amount.toLocaleString()} ${swapFromToken} → ${swapToToken} with max slippage ${slip.toFixed(2)}%.`
  }, [swapAmount, swapFromToken, swapToToken, swapSlippage])

  const stakePreview = useMemo(() => {
    const amount = Number.parseFloat(stakeAmount || "0")
    const duration = Number.parseInt(stakeDurationDays || "0", 10)
    if (!Number.isFinite(amount) || amount <= 0) return "Enter amount to preview."
    if (!Number.isFinite(duration) || duration <= 0) return "Set projection horizon."
    return `Stake ${amount.toLocaleString()} into rebasing vVEIL for ${duration} days${autoCompound ? " with auto-compound." : "."}`
  }, [autoCompound, stakeAmount, stakeDurationDays])

  const stakeModel = useMemo(() => {
    const amount = Number.parseFloat(stakeAmount || "0")
    const duration = Number.parseInt(stakeDurationDays || "0", 10)
    const apyPct = liquidityDepth?.policy.recommendedApyPct ?? 12.5
    const epochRebasePct = liquidityDepth?.policy.recommendedEpochRebasePct ?? 0.032
    const currentIndex = 1
    if (!Number.isFinite(amount) || amount <= 0 || !Number.isFinite(duration) || duration <= 0) {
      return { vVeilNow: "0.00", projectedVVeil: "0.00", gVeilWrapped: "0.00", apyPct: "0.00", epochRebasePct: "0.0000" }
    }
    const cappedDays = Math.min(Math.max(duration, 1), 1460)
    const projectedGrowthFactor = Math.pow(1 + apyPct / 100, cappedDays / 365)
    const vVeilNow = amount
    const projectedVVeil = amount * projectedGrowthFactor
    const gVeilWrapped = amount / currentIndex
    return {
      vVeilNow: vVeilNow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      projectedVVeil: projectedVVeil.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      gVeilWrapped: gVeilWrapped.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      apyPct: apyPct.toFixed(2),
      epochRebasePct: epochRebasePct.toFixed(4),
    }
  }, [liquidityDepth, stakeAmount, stakeDurationDays])

  const bondPreview = useMemo(() => {
    const amount = Number.parseFloat(bondAmount || "0")
    const vest = Number.parseInt(bondVestDays || "0", 10)
    if (!Number.isFinite(amount) || amount <= 0) return "Enter amount to preview."
    if (!Number.isFinite(vest) || vest <= 0) return "Set vesting days."
    return `Bond ${amount.toLocaleString()} ${bondAsset} with ${vest} day vesting.`
  }, [bondAmount, bondAsset, bondVestDays])

  /* ─── Wallet ─── */
  const connectWallet = async () => {
    if (!WALLET_ENABLED) {
      setWalletError(`Wallet connection is currently gated: ${WALLET_REASON}.`)
      return
    }
    if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
      setWalletError("No injected wallet found. Install VEIL Wallet or MetaMask.")
      return
    }
    setIsWalletConnecting(true)
    setWalletError("")
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      if (!Array.isArray(accounts) || accounts.length === 0) { setWalletError("No account returned from wallet."); return }
      setWalletAddress(String(accounts[0]))
      setPositions([
        { token: "VEIL", amount: "12,500.00" }, { token: "wVEIL", amount: "11,200.00" },
        { token: "vVEIL", amount: "8,400.00" }, { token: "gVEIL", amount: "5,950.00" },
        { token: "VAI", amount: "4,120.50" }, { token: "USDC", amount: "3,890.00" },
        { token: "LP", amount: "245.77" },
      ])
    } catch (error: any) {
      if (error?.code === 4001) setWalletError("Wallet connection rejected.")
      else setWalletError("Failed to connect wallet.")
    } finally {
      setIsWalletConnecting(false)
    }
  }

  const executeAction = () => {
    if (!EXECUTION_ENABLED) {
      setToast(`Execution is gated: ${EXECUTION_REASON}.`)
      return
    }
    if (!walletAddress) { setWalletError("Connect wallet first."); return }
    if (activeTab === "swap") { setToast("Swap request queued in testnet execution lane."); return }
    if (activeTab === "stake") { setToast("Stake request queued. vVEIL rebases by dynamic APY; gVEIL wrapper index updates each epoch."); return }
    setToast("Bond request queued in testnet execution lane.")
  }

  /* ─── Action panels ─── */
  const renderActionPanel = () => {
    if (activeTab === "swap") {
      return (
        <div className="space-y-5">
          <div>
            <p className="mb-2 font-[var(--font-figtree)] text-[11px] uppercase tracking-[0.16em] text-white/40">From</p>
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <LuxInput value={swapAmount} onChange={setSwapAmount} placeholder="0.00" />
              <LuxSelect value={swapFromToken} onChange={(v) => setSwapFromToken(v as Token)} options={["VEIL", "wVEIL", "VAI", "USDC"]} />
            </div>
          </div>
          <div>
            <p className="mb-2 font-[var(--font-figtree)] text-[11px] uppercase tracking-[0.16em] text-white/40">To</p>
            <LuxSelect value={swapToToken} onChange={(v) => setSwapToToken(v as Token)} options={["VEIL", "wVEIL", "VAI", "USDC"]} />
          </div>
          <div>
            <p className="mb-2 font-[var(--font-figtree)] text-[11px] uppercase tracking-[0.16em] text-white/40">Slippage (%)</p>
            <LuxInput value={swapSlippage} onChange={setSwapSlippage} placeholder="0.50" />
          </div>
          <div className="rounded-[14px] border border-white/[0.04] bg-white/[0.02] px-4 py-3 font-[var(--font-figtree)] text-sm text-white/60">{swapPreview}</div>
        </div>
      )
    }

    if (activeTab === "stake") {
      return (
        <div className="space-y-5">
          <div>
            <p className="mb-2 font-[var(--font-figtree)] text-[11px] uppercase tracking-[0.16em] text-white/40">Stake Amount (wVEIL)</p>
            <LuxInput value={stakeAmount} onChange={setStakeAmount} placeholder="0.00" />
          </div>
          <div>
            <p className="mb-2 font-[var(--font-figtree)] text-[11px] uppercase tracking-[0.16em] text-white/40">Projection Horizon (days, max 1460)</p>
            <LuxInput value={stakeDurationDays} onChange={setStakeDurationDays} placeholder="30" />
          </div>
          <label className="flex cursor-pointer items-center gap-3 rounded-[14px] border border-white/[0.04] bg-white/[0.02] px-4 py-3 font-[var(--font-figtree)] text-sm text-white/70 transition-colors hover:bg-white/[0.03]">
            <input type="checkbox" checked={autoCompound} onChange={(e) => setAutoCompound(e.target.checked)} className="h-4 w-4 accent-emerald-500" />
            Auto-wrap rebases to gVEIL
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "vVEIL Now", value: stakeModel.vVeilNow, sub: "Rebasing staking balance." },
              { label: "Projected vVEIL", value: stakeModel.projectedVVeil, sub: "At current dynamic APY." },
              { label: "gVEIL Wrapped", value: stakeModel.gVeilWrapped, sub: "Non-rebasing governance wrapper units." },
              { label: "Epoch Rebase", value: `${stakeModel.epochRebasePct}%`, sub: `Target APY ${stakeModel.apyPct}%.` },
            ].map((card) => (
              <div key={card.label} className="rounded-[14px] border border-white/[0.04] bg-white/[0.02] px-4 py-3">
                <p className="font-[var(--font-figtree)] text-[10px] uppercase tracking-[0.14em] text-white/35">{card.label}</p>
                <p className="mt-1.5 font-[var(--font-space-grotesk)] text-base text-white/85">{card.value}</p>
                <p className="mt-0.5 font-[var(--font-figtree)] text-[10px] text-white/30">{card.sub}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[14px] border border-white/[0.04] bg-white/[0.02] px-4 py-3 font-[var(--font-figtree)] text-sm text-white/60">{stakePreview}</div>
          <p className="font-[var(--font-figtree)] text-[11px] text-white/30">Model: VEIL-native rebase. vVEIL rebases each epoch; gVEIL stays non-rebasing via index wrapper.</p>
          <p className="font-[var(--font-figtree)] text-[11px] text-white/30">
            Dynamic APY is algorithmically controlled from liquidity target gap
            {liquidityDepth ? ` (current gap ${liquidityDepth.gap.pct.toFixed(2)}%).` : "."}
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-5">
        <div>
          <p className="mb-2 font-[var(--font-figtree)] text-[11px] uppercase tracking-[0.16em] text-white/40">Bond Asset</p>
          <LuxSelect value={bondAsset} onChange={(v) => setBondAsset(v as BondAsset)} options={["wVEIL-VAI LP", "VEIL-USDC LP", "AVAX-VAI LP"]} />
        </div>
        <div>
          <p className="mb-2 font-[var(--font-figtree)] text-[11px] uppercase tracking-[0.16em] text-white/40">Amount</p>
          <LuxInput value={bondAmount} onChange={setBondAmount} placeholder="0.00" />
        </div>
        <div>
          <p className="mb-2 font-[var(--font-figtree)] text-[11px] uppercase tracking-[0.16em] text-white/40">Vesting (days)</p>
          <LuxInput value={bondVestDays} onChange={setBondVestDays} placeholder="7" />
        </div>
        <div className="rounded-[14px] border border-white/[0.04] bg-white/[0.02] px-4 py-3 font-[var(--font-figtree)] text-sm text-white/60">{bondPreview}</div>
      </div>
    )
  }

  /* ═══ RENDER ═══ */
  return (
    <>
      <FilmGrain />
      <VeilHeader />

      {/* ─── Fixed Nav ─── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 right-0 left-0 z-50 border-b border-white/[0.04] bg-[#060606]/80 backdrop-blur-2xl"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
            <span className="font-[var(--font-instrument-serif)] text-lg tracking-tight text-white/90">VEIL</span>
            <span className="font-[var(--font-figtree)] text-[10px] uppercase tracking-[0.2em] text-white/25">DeFi Preview</span>
          </div>
          <div className="flex items-center gap-1">
            {[
              { label: "Markets", href: "/app/markets" },
              { label: "Ecosystem", href: "/app/ecosystem" },
              { label: "MAIEV", href: "/maiev" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-full px-4 py-2 font-[var(--font-figtree)] text-[11px] uppercase tracking-[0.14em] text-white/45 transition-colors hover:bg-white/[0.04] hover:text-emerald-400"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </motion.nav>

      <main className="min-h-screen bg-[#060606] pt-16 text-white">
        {/* Ambient glow */}
        <div className="pointer-events-none fixed top-0 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-500/[0.03] blur-[160px]" />

        <div className="mx-auto w-full max-w-7xl px-6 py-12">

          {/* ─── Hero Header ─── */}
          <ScrollReveal>
            <header className="mb-16 text-center">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-4 font-[var(--font-figtree)] text-[11px] uppercase tracking-[0.3em] text-emerald-500/60"
              >
                Protocol Console
              </motion.p>
              <h1 className="font-[var(--font-instrument-serif)] text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] tracking-tight text-white/95">
                Swap, Stake, Bond
              </h1>
              <p className="mx-auto mt-4 max-w-xl font-[var(--font-figtree)] text-sm leading-relaxed text-white/35">
                Preview console for VEIL-native staking, bonding, and liquidity mechanics. Launch authority is GO FOR
                PRODUCTION while execution remains staged by operator policy.
              </p>
            </header>
          </ScrollReveal>

          {/* ─── Testnet Banner ─── */}
          {showTestnetBanner && (
            <ScrollReveal>
              <div className="mb-10 rounded-[16px] border border-amber-500/20 bg-amber-500/[0.04] px-5 py-3.5 text-center font-[var(--font-figtree)] text-sm text-amber-200/70">
                Non-mainnet environment detected for this route. Treat financial outcomes here as staged preview
                behavior, not finalized performance reporting.
              </div>
            </ScrollReveal>
          )}

          {(!EXECUTION_ENABLED || !WALLET_ENABLED) && (
            <ScrollReveal>
              <div className="mb-10 rounded-[16px] border border-white/[0.08] bg-white/[0.02] px-5 py-3.5 text-center font-[var(--font-figtree)] text-sm text-white/60">
                Preview mode only. Execution: {EXECUTION_REASON}. Wallet: {WALLET_REASON}.
              </div>
            </ScrollReveal>
          )}

          {/* ─── 01 · Summary Cards ─── */}
          <ScrollReveal>
            <SectionLabel number="01" title="Overview" sub="Protocol health at a glance" />
            <div className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {summaryCards.map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Card className="p-5">
                    <p className="font-[var(--font-figtree)] text-[10px] uppercase tracking-[0.16em] text-white/30">{card.label}</p>
                    <p className="mt-3 font-[var(--font-space-grotesk)] text-2xl font-light tracking-tight text-white/90">{card.value}</p>
                    <p className="mt-1 font-[var(--font-figtree)] text-[11px] text-white/25">{card.helper}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>

          {/* ─── 02 · Action Console + Sidebar ─── */}
          <ScrollReveal>
            <SectionLabel number="02" title="Console" sub="Preview protocol operations (execution gated)" />
          </ScrollReveal>
          <div className="mb-16 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
            <ScrollReveal>
              <Card className="p-6" glow>
                {/* Tab bar */}
                <div className="mb-5 flex gap-2">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`rounded-full px-5 py-2.5 font-[var(--font-figtree)] text-[11px] uppercase tracking-[0.14em] transition-all ${
                        activeTab === tab.id
                          ? "border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.08)]"
                          : "border border-white/[0.04] text-white/40 hover:border-white/[0.08] hover:text-white/60"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <p className="mb-5 font-[var(--font-figtree)] text-sm text-white/35">{TABS.find((t) => t.id === activeTab)?.helper}</p>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    {renderActionPanel()}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={executeAction}
                    disabled={!EXECUTION_ENABLED}
                    className="group relative overflow-hidden rounded-[14px] border border-emerald-500/25 bg-emerald-500/10 px-6 py-3 font-[var(--font-space-grotesk)] text-sm text-emerald-400 transition-all hover:bg-emerald-500/15 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-emerald-500/10 disabled:hover:shadow-none"
                  >
                    <span className="relative z-10">Execute {activeTab}</span>
                  </button>
                  <button
                    onClick={() => setToast("Preview refreshed.")}
                    className="rounded-[14px] border border-white/[0.06] px-5 py-3 font-[var(--font-figtree)] text-sm text-white/40 transition-colors hover:border-white/[0.1] hover:text-white/60"
                  >
                    Refresh Preview
                  </button>
                </div>
              </Card>
            </ScrollReveal>

            {/* ─── Sidebar ─── */}
            <div className="space-y-5">
              {/* Wallet */}
              <ScrollReveal delay={0.1}>
                <Card className="p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-[var(--font-space-grotesk)] text-sm font-medium text-white/80">Wallet</h3>
                    {walletAddress ? (
                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/8 px-2.5 py-1 font-[var(--font-figtree)] text-[10px] uppercase tracking-[0.1em] text-emerald-400">Connected</span>
                    ) : (
                      <span className="rounded-full border border-white/[0.06] px-2.5 py-1 font-[var(--font-figtree)] text-[10px] uppercase tracking-[0.1em] text-white/30">Not connected</span>
                    )}
                  </div>
                  {walletAddress ? (
                    <p className="mb-4 font-mono text-xs text-white/50">{shortAddress(walletAddress)}</p>
                  ) : (
                    <button
                      onClick={connectWallet}
                      disabled={isWalletConnecting || !WALLET_ENABLED}
                      className="mb-4 w-full rounded-[14px] border border-emerald-500/20 bg-emerald-500/8 px-4 py-3 font-[var(--font-space-grotesk)] text-sm text-emerald-400 transition-all hover:bg-emerald-500/12 disabled:opacity-50"
                    >
                      {!WALLET_ENABLED ? "Wallet Waitlist" : isWalletConnecting ? "Connecting..." : "Connect Wallet"}
                    </button>
                  )}
                  {walletError && <p className="mb-3 font-[var(--font-figtree)] text-xs text-amber-300/80">{walletError}</p>}
                  <div className="space-y-1.5">
                    {positions.map((p) => (
                      <div key={p.token} className="flex items-center justify-between rounded-[12px] border border-white/[0.03] bg-white/[0.015] px-4 py-2.5">
                        <span className="font-[var(--font-space-grotesk)] text-[11px] uppercase tracking-[0.12em] text-white/35">{p.token}</span>
                        <span className="font-[var(--font-space-grotesk)] text-sm text-white/75">{p.amount}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 font-[var(--font-figtree)] text-[10px] text-white/20">Balances shown are wallet-snapshot placeholders in testnet mode.</p>
                </Card>
              </ScrollReveal>

              {/* Launch Checklist */}
              <ScrollReveal delay={0.15}>
                <Card className="p-5">
                  <h3 className="mb-4 font-[var(--font-space-grotesk)] text-sm font-medium text-white/80">Launch Checklist</h3>
                  <div className="space-y-1.5">
                    {CHECKLIST.map((check) => (
                      <div key={check.id} className="flex items-center justify-between rounded-[12px] border border-white/[0.03] bg-white/[0.015] px-4 py-2.5">
                        <span className="font-[var(--font-figtree)] text-xs text-white/50">{check.label}</span>
                        <span className={`rounded-full border px-2 py-0.5 font-[var(--font-figtree)] text-[10px] uppercase tracking-[0.1em] ${statusTone(readinessRows[check.id])}`}>
                          {statusText(readinessRows[check.id])}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </ScrollReveal>

              {/* Emission Controller */}
              <ScrollReveal delay={0.2}>
                <Card className="p-5">
                  <h3 className="mb-4 font-[var(--font-space-grotesk)] text-sm font-medium text-white/80">vVEIL Emission Controller</h3>
                  {isLiquidityLoading || !liquidityDepth ? (
                    <p className="font-[var(--font-figtree)] text-xs text-white/30">Loading liquidity controller snapshot...</p>
                  ) : (
                    <div className="space-y-1.5">
                      {[
                        { label: "Target Reserve (VAI)", value: liquidityDepth.target.targetReserveVai.toFixed(2) },
                        { label: "Observed Reserve (VAI)", value: liquidityDepth.observed.reserveVai.toFixed(2) },
                        { label: "Target Gap", value: `${liquidityDepth.gap.pct.toFixed(2)}%` },
                      ].map((row) => (
                        <div key={row.label} className="rounded-[12px] border border-white/[0.03] bg-white/[0.015] px-4 py-3">
                          <p className="font-[var(--font-figtree)] text-[10px] uppercase tracking-[0.14em] text-white/30">{row.label}</p>
                          <p className="mt-1 font-[var(--font-space-grotesk)] text-sm text-white/75">{row.value}</p>
                        </div>
                      ))}
                      <div className="rounded-[12px] border border-emerald-500/15 bg-emerald-500/[0.04] px-4 py-3">
                        <p className="font-[var(--font-figtree)] text-[10px] uppercase tracking-[0.14em] text-emerald-400/70">Recommended APY</p>
                        <p className="mt-1 font-[var(--font-space-grotesk)] text-sm text-emerald-300">{liquidityDepth.policy.recommendedApyPct.toFixed(2)}%</p>
                        <p className="mt-0.5 font-[var(--font-figtree)] text-[10px] text-emerald-300/40">Epoch rebase {liquidityDepth.policy.recommendedEpochRebasePct.toFixed(4)}%</p>
                      </div>
                    </div>
                  )}
                  <p className="mt-3 font-[var(--font-figtree)] text-[10px] text-white/20">Formula: gap-aware APY with floor/cap and growth bias to push liquidity expansion.</p>
                </Card>
              </ScrollReveal>

              {/* Token Roles */}
              <ScrollReveal delay={0.25}>
                <Card className="p-5">
                  <h3 className="mb-4 font-[var(--font-space-grotesk)] text-sm font-medium text-white/80">Token Roles</h3>
                  <div className="space-y-1.5">
                    {TOKEN_ROLES.map((row) => (
                      <div key={row.token} className="rounded-[12px] border border-white/[0.03] bg-white/[0.015] px-4 py-3">
                        <p className="font-[var(--font-space-grotesk)] text-[11px] uppercase tracking-[0.12em] text-emerald-400/60">{row.token}</p>
                        <p className="mt-1 font-[var(--font-figtree)] text-xs leading-relaxed text-white/45">{row.role}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </ScrollReveal>
            </div>
          </div>

          {/* ─── 03 · Ecosystem Mechanics ─── */}
          <ScrollReveal>
            <SectionLabel number="03" title="Ecosystem Mechanics" sub="How value moves through VEIL" />
            <Card className="mb-16 p-6">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {ECOSYSTEM_FLOW.map((item, i) => (
                  <ScrollReveal key={item.step} delay={0.05 * i}>
                    <div className="rounded-[14px] border border-white/[0.03] bg-white/[0.015] p-4">
                      <p className="font-[var(--font-space-grotesk)] text-[11px] uppercase tracking-[0.12em] text-emerald-400/60">{item.step}</p>
                      <p className="mt-2 font-[var(--font-figtree)] text-xs leading-relaxed text-white/45">{item.detail}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </Card>
          </ScrollReveal>

          {/* ─── 04 · Pools ─── */}
          <ScrollReveal>
            <SectionLabel number="04" title="Pools" sub="Traditional DeFi table" />
            <Card className="mb-16 overflow-hidden p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-1.5">
                  <thead>
                    <tr>
                      {["Pair", "Status", "Mode", "Action"].map((h) => (
                        <th key={h} className="px-4 py-2 text-left font-[var(--font-figtree)] text-[10px] uppercase tracking-[0.16em] text-white/25">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {POOLS.map((pool) => (
                      <tr key={pool.pair}>
                        <td className="rounded-l-[12px] border border-r-0 border-white/[0.03] bg-white/[0.015] px-4 py-3 font-[var(--font-space-grotesk)] text-sm text-white/75">{pool.pair}</td>
                        <td className="border-y border-white/[0.03] bg-white/[0.015] px-4 py-3 font-[var(--font-figtree)] text-sm text-white/50">{pool.status}</td>
                        <td className="border-y border-white/[0.03] bg-white/[0.015] px-4 py-3 font-[var(--font-figtree)] text-sm text-white/50">{pool.mode}</td>
                        <td className="rounded-r-[12px] border border-l-0 border-white/[0.03] bg-white/[0.015] px-4 py-3">
                          <button className="rounded-[10px] border border-emerald-500/15 bg-emerald-500/[0.06] px-4 py-2 font-[var(--font-figtree)] text-[11px] uppercase tracking-[0.1em] text-emerald-400 transition-all hover:bg-emerald-500/10">
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </ScrollReveal>
        </div>

        {/* ─── Fixed Footer ─── */}
        <footer className="fixed right-0 bottom-0 left-0 z-50 border-t border-white/[0.04] bg-[#060606]/80 backdrop-blur-2xl">
          <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-6">
            <p className="font-[var(--font-figtree)] text-[10px] uppercase tracking-[0.2em] text-white/20">VEIL Protocol © 2026</p>
            <div className="flex items-center gap-3">
              <div className={`h-1.5 w-1.5 rounded-full ${status ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-white/20"}`} />
              <p className="font-[var(--font-figtree)] text-[10px] uppercase tracking-[0.2em] text-white/20">
                {isStatusLoading ? "Connecting" : status ? "Systems Nominal" : "Offline"}
              </p>
            </div>
          </div>
        </footer>

        {/* ─── Toast ─── */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-6 bottom-20 z-[60] rounded-[16px] border border-emerald-500/20 bg-[#0a0a0a]/95 px-5 py-3.5 font-[var(--font-figtree)] text-sm text-emerald-400 shadow-[0_8px_60px_rgba(16,185,129,0.15)] backdrop-blur-2xl"
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  )
}

