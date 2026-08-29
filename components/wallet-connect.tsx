"use client"

import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { VeilLogo } from "./brand"

declare global {
  interface Window {
    ethereum?: any
  }
}

function formatAddress(addr: string) {
  if (!addr) return "—"
  if (addr.length <= 16) return addr
  return `${addr.slice(0, 8)}…${addr.slice(-6)}`
}

type Rail = "veilvm" | "companion"
type Health = {
  ok?: boolean
  actor?: string
  veil?: number
  vai?: number
  veil2?: number
  meshActor?: string
  meshVeil?: number
  animaActor?: string
  animaVeil?: number
  zer0Actor?: string
  zer0Veil?: number
  markets?: number
  note?: string
}

function actingVeil(h: Health | null, actor: string): number | null {
  if (!h) return null
  const n =
    actor === "2" || actor === "actor2"
      ? h.veil2
      : actor === "mesh"
        ? h.meshVeil
        : actor === "anima"
          ? h.animaVeil
          : actor === "zer0" || actor === "zero" || actor === "zeroid"
            ? h.zer0Veil
            : h.veil
  return typeof n === "number" ? n : null
}

const ACCENT = "#23E985"
const CHIP_BORDER = "1px solid rgba(35, 233, 133, 0.65)"

export function WalletConnect() {
  const [rail, setRail] = useState<Rail | "">("")
  const [evmAddr, setEvmAddr] = useState("")
  const [health, setHealth] = useState<Health | null>(null)
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(false)
  const [busy, setBusy] = useState("")
  const [error, setError] = useState("")
  const [nativeActor, setNativeActor] = useState("mesh")

  const pullHealth = useCallback(async () => {
    try {
      const j = (await fetch("/api/orders", { cache: "no-store" }).then((r) => r.json())) as Health
      setHealth(j)
      return j
    } catch {
      setHealth({ ok: false })
      return null
    }
  }, [])

  useEffect(() => {
    void pullHealth()
    const id = window.setInterval(() => void pullHealth(), 8000)
    return () => window.clearInterval(id)
  }, [pullHealth])

  useEffect(() => {
    const read = () => setNativeActor(window.localStorage.getItem("veil:native-actor") || "mesh")
    read()
    const id = window.setInterval(read, 1500)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = window.localStorage.getItem("veil:connect-rail")
    if (saved === "veilvm" || saved === "companion") setRail(saved)
    else setRail("veilvm")
    const eth = window.ethereum
    if (!eth?.request) return
    eth.request({ method: "eth_accounts" }).then((accounts: string[]) => {
      if (accounts?.[0] && saved === "companion") setEvmAddr(accounts[0])
    }).catch(() => {})
  }, [])

  const chooseVeil = () => {
    setRail("veilvm")
    window.localStorage.setItem("veil:connect-rail", "veilvm")
    setOpen(false)
    setMenu(false)
    setError("")
    void pullHealth()
  }

  const chooseCompanion = async () => {
    setError("")
    const eth = window.ethereum
    if (!eth?.request) {
      setError("No injected EVM wallet. Companion rails are anvil 31337 — not VeilVM.")
      return
    }
    setBusy("evm")
    try {
      const accounts: string[] = await eth.request({ method: "eth_requestAccounts" })
      if (!accounts?.[0]) {
        setError("No account returned.")
        return
      }
      setEvmAddr(accounts[0])
      setRail("companion")
      window.localStorage.setItem("veil:connect-rail", "companion")
      setOpen(false)
    } catch (err: any) {
      setError(err?.code === 4001 ? "Request rejected." : "Could not connect companion wallet.")
    } finally {
      setBusy("")
    }
  }

  const faucet = async () => {
    setBusy("faucet")
    setError("")
    try {
      const res = await fetch("/api/native/faucet", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ to: window.localStorage.getItem("veil:native-actor") || "mesh" }),
      })
      const json = (await res.json()) as { accepted?: boolean; error?: string; veil?: number }
      if (!res.ok || json.accepted === false) {
        setError(json.error || "faucet failed")
        return
      }
      await pullHealth()
    } catch (e) {
      setError(e instanceof Error ? e.message : "faucet failed")
    } finally {
      setBusy("")
    }
  }

  const veilBal = actingVeil(health, nativeActor)
  const chipLabel = veilBal != null ? `${veilBal.toLocaleString()} VEIL` : "— VEIL"

  return (
    <div className="relative flex items-center gap-2">
      <button
        type="button"
        aria-label="Connect"
        onClick={() => {
          if (!rail) {
            setOpen(true)
            return
          }
          setMenu((v) => !v)
        }}
        className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[12px] tracking-wide transition-colors duration-300"
        style={{
          fontFamily: "var(--font-space-grotesk)",
          color: "#FFFFFF",
          border: CHIP_BORDER,
          background: "transparent",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.8" aria-hidden>
          <rect x="3" y="6" width="18" height="13" rx="2" />
          <path d="M3 10h18" />
          <circle cx="16.5" cy="14.5" r="1.1" fill={ACCENT} stroke="none" />
        </svg>
        {chipLabel}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" aria-hidden>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        data-flow="faucet-native"
        disabled={Boolean(busy)}
        onClick={() => void faucet()}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] disabled:opacity-50"
        style={{
          fontFamily: "var(--font-space-grotesk)",
          color: "#FFFFFF",
          border: CHIP_BORDER,
          background: "transparent",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M4 10h12.5a2.5 2.5 0 0 1 0 5H15" />
          <path d="M8 10V6h5a2 2 0 0 1 0 4" />
          <path d="M15 15v2" />
          <path d="M15 20.2c0 .7-.6 1.3-1.3 1.3s-1.3-.6-1.3-1.3c0-.8 1.3-2.2 1.3-2.2s1.3 1.4 1.3 2.2z" />
        </svg>
        {busy === "faucet" ? "Dripping…" : "Faucet"}
      </button>
      {error ? (
        <span className="hidden max-w-[160px] truncate text-[10px] lg:inline" style={{ color: "rgba(248,113,113,0.85)", fontFamily: "var(--font-figtree)" }} title={error}>
          {error}
        </span>
      ) : null}

      <AnimatePresence>
        {rail && menu && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute right-0 top-[calc(100%+8px)] z-[95] w-64 overflow-hidden rounded-2xl"
            style={{ background: "#0a0c0b", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="text-[9px] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.31)" }}>
                {rail === "veilvm" ? "VeilVM relayer" : "Companion EVM"}
              </div>
              <div className="mt-1 break-all font-mono text-[10px]" style={{ color: "rgba(255,255,255,0.62)" }}>
                {rail === "veilvm" ? health?.actor || "—" : evmAddr || "—"}
              </div>
              {rail === "veilvm" ? (
                <div className="mt-1 text-[11px]" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.5)" }}>
                  {health?.veil ?? "—"} VEIL · {health?.vai ?? "—"} VAI
                </div>
              ) : (
                <div className="mt-1 text-[11px]" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.45)" }}>
                  chain 31337 · not app-id 22207
                </div>
              )}
            </div>
            {rail === "veilvm" ? (
              <button
                type="button"
                disabled={Boolean(busy)}
                onClick={() => void faucet()}
                className="block w-full px-4 py-2.5 text-left text-[12px] hover:bg-white/[0.03] disabled:opacity-50"
                style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(110,231,183,0.9)" }}
              >
                {busy === "faucet" ? "Dripping…" : "Native faucet"}
              </button>
            ) : null}
            <button
              type="button"
              disabled={Boolean(busy)}
              onClick={() => void chooseCompanion()}
              className="block w-full px-4 py-2.5 text-left text-[12px] hover:bg-white/[0.03] disabled:opacity-50"
              style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.78)" }}
            >
              Companion 31337
            </button>
            <button
              type="button"
              onClick={() => {
                setMenu(false)
                setOpen(true)
              }}
              className="block w-full px-4 py-2.5 text-left text-[12px] hover:bg-white/[0.03]"
              style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.5)" }}
            >
              Switch rail
            </button>
            <button
              type="button"
              onClick={() => {
                setRail("")
                setMenu(false)
                window.localStorage.removeItem("veil:connect-rail")
              }}
              className="block w-full px-4 py-2.5 text-left text-[12px] hover:bg-white/[0.03]"
              style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.5)" }}
            >
              Disconnect
            </button>
            {error ? (
              <p className="px-4 py-2 text-[11px]" style={{ color: "rgba(248,113,113,0.85)", fontFamily: "var(--font-figtree)" }}>
                {error}
              </p>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close connect"
              className="fixed inset-0 z-[90]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{ background: "rgba(4,6,5,0.72)" }}
            />
            <motion.div
              role="dialog"
              className="fixed left-1/2 top-1/2 z-[95] w-[min(420px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 rounded-[20px] p-8"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              style={{ background: "#0a0c0b", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="mb-6 flex justify-center">
                <VeilLogo size={22} opacity={0.55} />
              </div>
              <h3 className="text-center text-[28px]" style={{ fontFamily: "var(--font-instrument-serif)" }}>
                Connect
              </h3>
              <p className="mt-3 mb-7 text-center text-[13px] font-light leading-relaxed" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.48)" }}>
                VeilVM is HyperSDK app-id 22207. It is not an EVM chain. MetaMask talks to companion 31337 only.
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={chooseVeil}
                  className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left hover:bg-white/[0.03]"
                  style={{ border: "1px solid rgba(16,185,129,0.25)" }}
                >
                  <span>
                    <span className="block text-[14px]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                      VeilVM on this node
                    </span>
                    <span className="mt-0.5 block text-[11px]" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.42)" }}>
                      Relayer {formatAddress(health?.actor || "")} · {health?.veil ?? "—"} VEIL
                    </span>
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.16em]" style={{ color: "rgba(16,185,129,0.84)" }}>
                    Native
                  </span>
                </button>
                <button
                  type="button"
                  disabled={Boolean(busy)}
                  onClick={() => void chooseCompanion()}
                  className="flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left hover:bg-white/[0.03] disabled:opacity-40"
                  style={{ border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <span>
                    <span className="block text-[14px]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                      Companion wallet
                    </span>
                    <span className="mt-0.5 block text-[11px]" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.42)" }}>
                      Injected EVM · anvil 31337 · not VEIL
                    </span>
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.16em]" style={{ color: "rgba(255,255,255,0.35)" }}>
                    Rails
                  </span>
                </button>
              </div>
              {error ? (
                <p className="mt-4 text-center text-[11px]" style={{ color: "rgba(248,113,113,0.85)", fontFamily: "var(--font-figtree)" }}>
                  {error}
                </p>
              ) : (
                <p className="mt-4 text-center text-[11px]" style={{ color: "rgba(255,255,255,0.32)", fontFamily: "var(--font-figtree)" }}>
                  Native orders are signed by the local router. Faucet drips HyperSDK VEIL, not ETH.
                </p>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-5 w-full rounded-full py-3 text-[10px] tracking-[0.22em] uppercase"
                style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.34)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
