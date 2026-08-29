"use client"

import { FormEvent, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { shortId, fmt, timeUtc, age, veilAddr } from "@/lib/explorer/format"

export { shortId, fmt, timeUtc, age, veilAddr }

export function SearchBar({
  initial = "",
  autoFocus = false,
  hero = false,
}: {
  initial?: string
  autoFocus?: boolean
  hero?: boolean
}) {
  const router = useRouter()
  const [q, setQ] = useState(initial)
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) return
      if (e.key === "/") {
        e.preventDefault()
        input.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])
  const go = (e: FormEvent) => {
    e.preventDefault()
    const s = q.trim()
    if (!s) return
    if (/^\d+$/.test(s)) router.push(`/explorer/block/${s}`)
    else if (/^0x[0-9a-fA-F]{66}$/.test(s)) router.push(`/explorer/address/${encodeURIComponent(s)}`)
    else if (/^0x[0-9a-fA-F]{64}$/.test(s) || /^[0-9a-fA-F]{64}$/.test(s))
      router.push(`/explorer/tx/${s.startsWith("0x") ? s : `0x${s}`}`)
    else router.push(`/explorer/search?q=${encodeURIComponent(s)}`)
  }
  return (
    <form onSubmit={go} className={`x-search x-ui ${hero ? "x-search-hero" : ""}`}>
      <span className="pl-3 text-[var(--x-faint)]" aria-hidden>
        <SearchIcon />
      </span>
      <input
        ref={input}
        value={q}
        autoFocus={autoFocus}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by address / transaction / block"
      />
      <kbd className="x-kbd" aria-hidden>
        /
      </kbd>
    </form>
  )
}

export function Identicon({ seed, size = 18 }: { seed: string; size?: number }) {
  const cells = useMemo(() => {
    const s = seed.replace(/^0x/i, "") || "00"
    const out: string[] = []
    for (let i = 0; i < 16; i++) {
      const n = parseInt(s.slice((i * 2) % Math.max(2, s.length - 1), (i * 2) % Math.max(2, s.length - 1) + 2) || "0", 16)
      out.push(`hsl(${(n * 17) % 360} 55% ${30 + (n % 35)}%)`)
    }
    return out
  }, [seed])
  return (
    <span
      className="inline-grid grid-cols-4 overflow-hidden rounded-[4px] shrink-0"
      style={{ width: size, height: size, gap: 0 }}
    >
      {cells.map((c, i) => (
        <span key={i} style={{ background: c }} />
      ))}
    </span>
  )
}

export function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false)
  return (
    <button
      type="button"
      title="Copy to clipboard"
      onClick={() => {
        void navigator.clipboard.writeText(text)
        setOk(true)
        setTimeout(() => setOk(false), 1100)
      }}
      className="inline-flex items-center ml-1.5 align-middle"
      style={{ color: ok ? "var(--x-link)" : "var(--x-faint)" }}
    >
      {ok ? <CheckIcon /> : <CopyIcon />}
    </button>
  )
}

export function HashLink({
  href,
  hash,
  head = 10,
  tail = 8,
  eye = false,
}: {
  href: string
  hash: string
  head?: number
  tail?: number
  eye?: boolean
}) {
  return (
    <span className="inline-flex items-center min-w-0 gap-1.5">
      {eye ? (
        <span style={{ color: "var(--x-faint)" }} aria-hidden>
          <EyeIcon />
        </span>
      ) : null}
      <Link href={href} className="x-mono truncate" style={{ fontSize: 13 }}>
        {shortId(hash, head, tail)}
      </Link>
      <CopyBtn text={hash} />
    </span>
  )
}

export function AddrLink({ addr, head = 8, tail = 6 }: { addr: string; head?: number; tail?: number }) {
  if (!addr) return <span style={{ color: "var(--x-faint)" }}>—</span>
  if (!addr.startsWith("0x")) return <span>{addr}</span>
  return (
    <span className="inline-flex items-center gap-1.5 min-w-0">
      <Identicon seed={addr} />
      <Link href={`/explorer/address/${encodeURIComponent(addr)}`} className="x-mono truncate" style={{ fontSize: 13 }}>
        {veilAddr(addr, head > 6 ? 6 : head, tail > 4 ? 4 : tail)}
      </Link>
      <CopyBtn text={addr} />
    </span>
  )
}

export function MethodBadge({ name }: { name: string }) {
  if (!name || name === "—") return <span style={{ color: "var(--x-faint)" }}>—</span>
  const tone =
    name === "SwapExactIn"
      ? "x-pill-swap"
      : name === "CommitOrder" || name === "RevealBatch" || name === "ClearBatch"
        ? "x-pill-commit"
        : name === "CreateMarket"
          ? "x-pill-create"
          : name === "AddLiquidity" || name === "RemoveLiquidity" || name === "CreatePool"
            ? "x-pill-lp"
            : "x-pill-method"
  return <span className={`x-pill x-ui ${tone}`}>{name}</span>
}

export function SuccessPill({ ok }: { ok: boolean | null }) {
  if (ok == null) return <span style={{ color: "var(--x-faint)" }}>—</span>
  return <span className={`x-pill x-ui ${ok ? "x-pill-ok" : "x-pill-bad"}`}>{ok ? "Success" : "Failed"}</span>
}

export function Card({
  title,
  extra,
  icon,
  children,
}: {
  title: string
  extra?: ReactNode
  icon?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="x-card">
      <div className="x-card-h x-ui">
        <h2 className="inline-flex items-center gap-2">
          {icon ? <span style={{ color: "var(--x-link)" }}>{icon}</span> : null}
          {title}
        </h2>
        {extra}
      </div>
      {children}
    </section>
  )
}

export function Row({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="x-row">
      <div className="x-ui">{k}:</div>
      <div>{v}</div>
    </div>
  )
}

export function Crumbs({ items }: { items: { label: string; href?: string }[] }) {
  const trail = [{ label: "VEIL", href: "/" }, ...items]
  return (
    <div className="x-crumb x-ui">
      {trail.map((it, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-1.5">/</span>}
          {it.href ? <Link href={it.href}>{it.label}</Link> : <span style={{ color: "var(--x-text)" }}>{it.label}</span>}
        </span>
      ))}
    </div>
  )
}

export function ViewAll({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="x-link-more x-ui">
      {label} →
    </Link>
  )
}

export function SkeletonRows({ n = 8 }: { n?: number }) {
  return (
    <div className="p-4 space-y-3">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="x-skel" style={{ width: `${70 + (i % 3) * 10}%`, height: 14 }} />
      ))}
    </div>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" />
    </svg>
  )
}
function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5h10" />
    </svg>
  )
}
function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M5 12l5 5L20 7" />
    </svg>
  )
}
function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
export function IconShield() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
      <path d="M8.5 12.5l2.2 2.2 4.8-5" />
    </svg>
  )
}

export function IconCube() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
      <path d="M12 21V12M20 7.5L12 12 4 7.5" />
    </svg>
  )
}
export function IconClock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v5l3 2" />
    </svg>
  )
}
export function IconBook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M5 5h11a3 3 0 013 3v12H8a3 3 0 00-3 3V5z" />
      <path d="M5 20a3 3 0 013-3h14" />
    </svg>
  )
}
export function IconSwap() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M7 7h11l-3-3M17 17H6l3 3" />
    </svg>
  )
}
export function IconTx() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 3v18M7 8l5-5 5 5M7 16l5 5 5-5" />
    </svg>
  )
}
