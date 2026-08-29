"use client"

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import Link from "next/link"
import {
  bindWallet,
  loadPassport,
  mintLocalPassport,
  revokePassport,
  verifyPassport,
  type LocalPassport,
} from "@/lib/zeroid/passport"

type Catalog = {
  note?: string
  circuits?: Array<{ id: string; name: string; file: string; proves: string; status: string }>
  levels?: Array<{ id: string; name: string; proves: string }>
  bloodsworn?: {
    signals?: Array<{ id: string; name: string; live: boolean }>
    nativeActions?: { inV1?: boolean }
    oath?: string
  }
  companion?: {
    chainId?: number
    registry?: string | null
    deployed?: boolean
    issued?: number
    chainCount?: number | null
    issuer?: string | null
    hmac?: string
    artifact?: string
    groth16Gate?: string
  }
  veilvm?: { registerIdentity?: boolean; nativeActions?: string }
}

type Check = { ok?: boolean; reasons?: string[]; onChain?: boolean | null; registry?: string | null }

type Lookup = {
  ok?: boolean
  error?: string
  chain?: {
    used?: boolean
    commitment?: string
    credential?: string
    issuerSig?: string
    wallet?: string
    registry?: string
    error?: string
  }
  file?: { issuedAt?: string; issueTx?: string; wallet?: string } | null
}

const TABS = ["Passport", "Registry", "Circuits", "Bloodsworn"] as const
const ZERO = "0x0000000000000000000000000000000000000000"

function shortHex(h: string, n = 8) {
  if (!h || h === "—") return "—"
  if (h.length <= n * 2 + 3) return h
  return `${h.slice(0, n + 2)}…${h.slice(-n)}`
}

function isHex32(value: string) {
  return /^0x[0-9a-fA-F]{64}$/.test(value.trim())
}

function Chip({ on, label }: { on: boolean; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px]"
      style={{
        fontFamily: "var(--font-space-grotesk)",
        border: on ? "1px solid rgba(16,185,129,0.32)" : "1px solid rgba(255,255,255,0.08)",
        color: on ? "rgba(110,231,183,0.95)" : "rgba(255,255,255,0.42)",
        background: on ? "rgba(16,185,129,0.1)" : "transparent",
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: on ? "rgb(52,211,153)" : "rgba(255,255,255,0.22)" }}
      />
      {label}
    </span>
  )
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl px-5 py-4 ${className}`}
      style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.025)" }}
    >
      {children}
    </div>
  )
}

export function ZeroidConsole() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Passport")
  const [passport, setPassport] = useState<LocalPassport | null>(null)
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [busy, setBusy] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState("")
  const [check, setCheck] = useState<Check | null>(null)
  const [lookupHex, setLookupHex] = useState("")
  const [lookup, setLookup] = useState<Lookup | null>(null)

  const pullCatalog = useCallback(async () => {
    const j = (await fetch("/api/zeroid", { cache: "no-store" }).then((r) => r.json())) as Catalog
    setCatalog(j)
    return j
  }, [])

  useEffect(() => {
    const p = loadPassport()
    setPassport(p)
    void pullCatalog().catch(() => {})
    if (p?.issuerSig) {
      void verifyPassport(p).then(setCheck).catch(() => {})
    }
    const id = window.setInterval(() => void pullCatalog().catch(() => {}), 8000)
    return () => window.clearInterval(id)
  }, [pullCatalog])

  const copy = (label: string, value: string) => {
    if (!value || value === "—") return
    void navigator.clipboard.writeText(value)
    setCopied(label)
    window.setTimeout(() => setCopied(""), 1400)
  }

  const mint = useCallback(async () => {
    setBusy("mint")
    setError("")
    try {
      const mintedP = await mintLocalPassport(passport?.wallet || "")
      setPassport(mintedP)
      setLookupHex(mintedP.nullifier)
      setCheck(await verifyPassport(mintedP))
      await pullCatalog()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy("")
    }
  }, [passport?.wallet, pullCatalog])

  const bind = useCallback(async () => {
    if (!passport) return
    setBusy("bind")
    setError("")
    try {
      const bound = await bindWallet(passport)
      setPassport(bound)
      setCheck(await verifyPassport(bound))
      await pullCatalog()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy("")
    }
  }, [passport, pullCatalog])

  const verify = useCallback(async () => {
    if (!passport) return
    setBusy("verify")
    setError("")
    try {
      setCheck(await verifyPassport(passport))
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy("")
    }
  }, [passport])

  const runLookup = useCallback(async (hex?: string) => {
    const n = (hex || lookupHex).trim()
    if (!isHex32(n)) {
      setLookup({ ok: false, error: "nullifier must be 32-byte hex" })
      return
    }
    setBusy("lookup")
    setError("")
    try {
      const res = await fetch(`/api/zeroid/lookup?nullifier=${encodeURIComponent(n.toLowerCase())}`, {
        cache: "no-store",
      })
      setLookup((await res.json()) as Lookup)
    } catch (e) {
      setLookup({ ok: false, error: e instanceof Error ? e.message : String(e) })
    } finally {
      setBusy("")
    }
  }, [lookupHex])

  const minted = Boolean(passport?.nullifier)
  const verified = Boolean(check?.ok && check.onChain === true)
  const bound = Boolean(passport?.wallet)
  const registry = passport?.registry || catalog?.companion?.registry || "—"
  const deployed = Boolean(catalog?.companion?.deployed)

  const identityRows = useMemo(() => {
    if (!passport) return []
    return [
      ["Type", passport.type],
      ["App-id", passport.appId],
      ["Commitment", passport.commitment],
      ["Nullifier", passport.nullifier],
      ["Credential", passport.credentialHash],
      ["Issuer sig", passport.issuerSig || "—"],
    ]
  }, [passport])

  const chainRows = useMemo(() => {
    if (!passport) return []
    return [
      ["On-chain", passport.onChain ? "yes" : "no"],
      ["Registry", registry],
      ["Issue tx", passport.issueTx || "—"],
      ["Wallet", passport.wallet || "unbound"],
      ["Bind tx", passport.bindTx || "—"],
      ["Issued", passport.issuedAt],
    ]
  }, [passport, registry])

  return (
    <div>
      <div
        className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl px-5 py-4"
        style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.025)" }}
      >
        <span
          className="h-2 w-2 rounded-full"
          style={{
            background: verified ? "rgb(52,211,153)" : minted ? "rgba(251,191,36,0.9)" : "rgba(255,255,255,0.28)",
            boxShadow: verified ? "0 0 10px rgba(16,185,129,0.7)" : "none",
          }}
        />
        <span className="text-[14px]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          {verified ? "Passport verified on companion registry" : minted ? "Passport on this device — verify pending" : "No 8004 passport on this device"}
        </span>
        <span className="text-[13px]" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.42)" }}>
          type 8004 · app-id 22207 · {deployed ? `registry ×${catalog?.companion?.chainCount ?? 0}` : "registry down"}
        </span>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <Chip on={minted} label="Device secret" />
        <Chip on={Boolean(passport?.issuerSig)} label="HMAC issued" />
        <Chip on={Boolean(passport?.onChain && check?.onChain !== false)} label="On-chain nullifier" />
        <Chip on={bound} label={bound ? "Wallet bound" : "Wallet unbound"} />
      </div>

      <div
        className="mb-8 flex gap-5 text-[13px]"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", fontFamily: "var(--font-space-grotesk)" }}
      >
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className="pb-2"
            style={{
              color: tab === t ? "rgba(255,255,255,0.94)" : "rgba(255,255,255,0.42)",
              borderBottom: tab === t ? "2px solid #3ee0a4" : "2px solid transparent",
              fontWeight: tab === t ? 600 : 400,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-4 text-[13px]" style={{ color: "rgba(248,113,113,0.9)", fontFamily: "var(--font-figtree)" }}>
          {error}
        </p>
      )}

      {tab === "Passport" && (
        <div className="space-y-5">
          <p className="text-[15px] leading-relaxed" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.53)" }}>
            Secret stays on this device. This node HMAC-issues the credential and writes the nullifier to the companion
            registry. Onboard A7 only passes after verify.
          </p>

          {minted && passport ? (
            <>
              <Panel>
                <p className="mb-2 text-[10px] tracking-[0.22em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.72)" }}>
                  Issuer check
                </p>
                {check ? (
                  <p style={{ fontFamily: "var(--font-figtree)", color: check.ok ? "rgba(110,231,183,0.95)" : "rgba(248,113,113,0.9)" }}>
                    {check.ok ? "HMAC + on-chain record match." : (check.reasons || []).join(" · ") || "verify failed"}
                  </p>
                ) : (
                  <p style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.42)" }}>Not checked yet.</p>
                )}
              </Panel>
              <div className="grid gap-3 md:grid-cols-2">
                <Panel>
                  <p className="mb-3 text-[10px] tracking-[0.22em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.72)" }}>
                    Identity
                  </p>
                  {identityRows.map(([k, v]) => (
                    <Field key={k} label={k} value={v} copied={copied} onCopy={copy} />
                  ))}
                </Panel>
                <Panel>
                  <p className="mb-3 text-[10px] tracking-[0.22em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.72)" }}>
                    Companion 31337
                  </p>
                  {chainRows.map(([k, v]) => (
                    <Field key={k} label={k} value={v} copied={copied} onCopy={copy} />
                  ))}
                  <p className="mt-3 text-[12px] leading-relaxed" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.42)" }}>
                    Issue and bind txs live on anvil, not the VeilVM explorer.
                  </p>
                </Panel>
              </div>
            </>
          ) : (
            <Panel className="py-10">
              <p className="text-[15px] leading-relaxed" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.48)" }}>
                No 8004 profile on this device. Generate one to unlock onboard gate A7. Rotating later spends a new
                nullifier; the old one stays used on-chain.
              </p>
            </Panel>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={Boolean(busy)}
              onClick={() => void mint()}
              className="rounded-full px-5 py-2.5 text-[12px] tracking-wide uppercase disabled:opacity-50"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                background: "rgba(16,185,129,0.16)",
                border: "1px solid rgba(16,185,129,0.3)",
                color: "rgba(110,231,183,0.95)",
              }}
            >
              {busy === "mint" ? "Issuing…" : minted ? "Rotate passport" : "Generate 8004 passport"}
            </button>
            {minted ? (
              <>
                <button
                  type="button"
                  disabled={Boolean(busy)}
                  onClick={() => void verify()}
                  className="rounded-full px-5 py-2.5 text-[12px] tracking-wide uppercase disabled:opacity-50"
                  style={{ fontFamily: "var(--font-space-grotesk)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.78)" }}
                >
                  {busy === "verify" ? "Verifying…" : "Verify issuer"}
                </button>
                <button
                  type="button"
                  disabled={Boolean(busy)}
                  onClick={() => void bind()}
                  className="rounded-full px-5 py-2.5 text-[12px] tracking-wide uppercase disabled:opacity-50"
                  style={{ fontFamily: "var(--font-space-grotesk)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.78)" }}
                >
                  {busy === "bind" ? "Waiting for signature…" : bound ? "Rebind wallet" : "Bind wallet"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    revokePassport()
                    setPassport(null)
                    setCheck(null)
                    setLookup(null)
                  }}
                  className="rounded-full px-5 py-2.5 text-[12px] tracking-wide uppercase"
                  style={{ fontFamily: "var(--font-space-grotesk)", border: "1px solid rgba(248,113,113,0.28)", color: "rgba(248,113,113,0.85)" }}
                >
                  Revoke local
                </button>
              </>
            ) : null}
            <Link
              href="/app/onboard"
              className="rounded-full px-5 py-2.5 text-[12px] tracking-wide uppercase"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                border: verified ? "1px solid rgba(16,185,129,0.35)" : "1px solid rgba(255,255,255,0.12)",
                color: verified ? "rgba(110,231,183,0.95)" : "rgba(255,255,255,0.78)",
              }}
            >
              Onboard A7
            </Link>
          </div>
        </div>
      )}

      {tab === "Registry" && (
        <div className="space-y-5">
          <p className="text-[15px] leading-relaxed" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.53)" }}>
            Companion uniqueness register. VeilVM has no registerIdentity in v1 (actions 0–18). Groth16 gate is compiled
            and unused until wasm/zkey are served.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Chain", String(catalog?.companion?.chainId ?? 31337)],
              ["Nullifiers", catalog?.companion?.chainCount == null ? "—" : String(catalog.companion.chainCount)],
              ["HMAC", catalog?.companion?.hmac || "—"],
            ].map(([k, v]) => (
              <Panel key={k}>
                <p className="text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.42)" }}>
                  {k}
                </p>
                <p className="mt-2 text-[18px]" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.92)" }}>
                  {v}
                </p>
              </Panel>
            ))}
          </div>
          <Panel>
            <Field label="Registry" value={registry} copied={copied} onCopy={copy} />
            <Field label="Issuer" value={catalog?.companion?.issuer || "—"} copied={copied} onCopy={copy} />
            <Field label="Bytecode" value={deployed ? "live" : "not deployed"} copied={copied} onCopy={copy} />
            <Field label="Artifact" value={catalog?.companion?.artifact || "—"} copied={copied} onCopy={copy} />
            <p className="mt-3 text-[13px] leading-relaxed" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.45)" }}>
              {catalog?.note}
            </p>
          </Panel>
          <Panel>
            <p className="mb-3 text-[10px] tracking-[0.22em] uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.72)" }}>
              Lookup nullifier
            </p>
            <div className="flex flex-wrap gap-2">
              <input
                value={lookupHex}
                onChange={(e) => setLookupHex(e.target.value)}
                placeholder="0x…"
                className="min-w-[16rem] flex-1 rounded-full bg-transparent px-4 py-2 font-mono text-[12px] outline-none"
                style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.86)" }}
              />
              <button
                type="button"
                disabled={Boolean(busy)}
                onClick={() => void runLookup()}
                className="rounded-full px-5 py-2 text-[12px] tracking-wide uppercase disabled:opacity-50"
                style={{ fontFamily: "var(--font-space-grotesk)", border: "1px solid rgba(16,185,129,0.3)", color: "rgba(110,231,183,0.95)" }}
              >
                {busy === "lookup" ? "Looking up…" : "Lookup"}
              </button>
              {passport?.nullifier ? (
                <button
                  type="button"
                  disabled={Boolean(busy)}
                  onClick={() => {
                    setLookupHex(passport.nullifier)
                    void runLookup(passport.nullifier)
                  }}
                  className="rounded-full px-5 py-2 text-[12px] tracking-wide uppercase disabled:opacity-50"
                  style={{ fontFamily: "var(--font-space-grotesk)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.72)" }}
                >
                  This passport
                </button>
              ) : null}
            </div>
            {lookup ? (
              <div className="mt-4 space-y-1 font-mono text-[12px]" style={{ color: "rgba(255,255,255,0.72)" }}>
                {lookup.error ? (
                  <p style={{ color: "rgba(248,113,113,0.9)", fontFamily: "var(--font-figtree)" }}>{lookup.error}</p>
                ) : (
                  <>
                    <Field label="Used" value={lookup.chain?.used ? "yes" : "no"} copied={copied} onCopy={copy} />
                    <Field label="Commitment" value={lookup.chain?.commitment || "—"} copied={copied} onCopy={copy} />
                    <Field label="Credential" value={lookup.chain?.credential || "—"} copied={copied} onCopy={copy} />
                    <Field
                      label="Wallet"
                      value={!lookup.chain?.wallet || lookup.chain.wallet === ZERO ? "unbound" : lookup.chain.wallet}
                      copied={copied}
                      onCopy={copy}
                    />
                    {lookup.chain?.error ? (
                      <p className="pt-2" style={{ color: "rgba(248,113,113,0.9)", fontFamily: "var(--font-figtree)" }}>
                        {lookup.chain.error}
                      </p>
                    ) : null}
                  </>
                )}
              </div>
            ) : null}
          </Panel>
          <div className="flex flex-wrap gap-4">
            <Link href="/mesh" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.82)" }}>
              Mesh RPC →
            </Link>
            <Link href="/explorer" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.5)" }}>
              VeilVM explorer
            </Link>
          </div>
        </div>
      )}

      {tab === "Circuits" && (
        <div className="space-y-3">
          <p className="mb-4 text-[15px] leading-relaxed" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.53)" }}>
            Groth16 on BN254 lives in the zeroid repo. Wasm/zkey are not served here. This node issues L1 uniqueness
            via tagged SHA-256. L2–L4 are not issued.
          </p>
          {(catalog?.circuits || []).map((c) => (
            <Panel key={c.id}>
              <div className="flex items-center justify-between gap-3">
                <span style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.92)" }}>{c.name}</span>
                <span className="text-[11px]" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.42)" }}>
                  {c.status}
                </span>
              </div>
              <p className="mt-1 text-[13px]" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.45)" }}>
                {c.proves}
              </p>
              <p className="mt-1 font-mono text-[11px]" style={{ color: "rgba(255,255,255,0.32)" }}>
                {c.file}
              </p>
            </Panel>
          ))}
          <div className="pt-2">
            {(catalog?.levels || []).map((l) => {
              const live = l.id === "L1" && minted
              return (
                <div key={l.id} className="flex gap-3 py-2.5 text-[13px]" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <span className="w-8" style={{ fontFamily: "var(--font-space-grotesk)", color: live ? "rgba(110,231,183,0.95)" : "rgba(16,185,129,0.7)" }}>
                    {l.id}
                  </span>
                  <span>
                    <span style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.88)" }}>
                      {l.name}
                      {live ? " · this passport" : ""}
                    </span>
                    <span className="mt-0.5 block text-[12px]" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.45)" }}>
                      {l.proves}
                    </span>
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {tab === "Bloodsworn" && (
        <div>
          <p className="mb-5 text-[15px] leading-relaxed" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255,255,255,0.53)" }}>
            Five signals, staged. Native actions 37–38 are spec-only — not in VeilVM v1 (0–18). This node does not invent a score.
          </p>
          <div className="space-y-2">
            {(catalog?.bloodsworn?.signals || []).map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-2xl px-5 py-3"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.88)" }}>{s.name}</span>
                <span className="text-[11px]" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.38)" }}>
                  {s.live ? "live" : "not scored here"}
                </span>
              </div>
            ))}
          </div>
          <Link href="/app/oath" className="mt-5 inline-block text-[13px]" style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(16,185,129,0.82)" }}>
            Bloodsworn oath →
          </Link>
        </div>
      )}
    </div>
  )
}

function Field({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string
  value: string
  copied: string
  onCopy: (label: string, value: string) => void
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3 py-1">
      <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.42)", fontFamily: "var(--font-figtree)" }}>
        {label}
      </span>
      <button
        type="button"
        onClick={() => onCopy(label, value)}
        className="text-left font-mono text-[12px]"
        style={{ color: "rgba(110,231,183,0.9)" }}
      >
        {copied === label ? "copied" : shortHex(value, 7)}
      </button>
    </div>
  )
}
