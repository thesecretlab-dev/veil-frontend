"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import "./explorer.css"
import { SearchBar } from "./ui"
import { LOCAL_VEILVM_APP_ID } from "@/lib/local-runtime"

export function ExplorerChrome({ children }: { children: React.ReactNode }) {
  const [netOpen, setNetOpen] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [info, setInfo] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null
    setTheme(saved || "dark")
  }, [])

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
    localStorage.setItem("theme", next)
    document.documentElement.classList.toggle("dark", next === "dark")
  }

  return (
    <div className="veil-x">
      <header className="x-header">
        <div className="mx-auto max-w-[1180px] px-4 h-[64px] flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0" style={{ color: "var(--x-text)", textDecoration: "none" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-[22px] h-[22px]" aria-hidden>
              <path d="M12 22L2 4H22L12 22Z" fill="#3ee0a4" />
            </svg>
            <span className="x-ui font-semibold tracking-wide text-[15px]">VEIL</span>
          </Link>
          <span style={{ color: "var(--x-line-2)" }}>/</span>
          <Link href="/explorer" className="x-ui text-[15px]" style={{ color: "var(--x-muted)", textDecoration: "none", fontWeight: 500 }}>
            Explorer
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setNetOpen((v) => !v)}
                className="hidden sm:flex items-center gap-2 rounded-full px-2.5 h-8 text-[12px] x-ui"
                style={{ border: "1px solid var(--x-line-2)", color: "var(--x-text)", background: "transparent" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#3ee0a4] shadow-[0_0_8px_#3ee0a4]" />
                VEIL Local Testnet
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {netOpen ? (
                <div
                  className="absolute right-0 top-[calc(100%+6px)] z-30 min-w-[220px] rounded-xl py-1"
                  style={{ background: "var(--x-elev)", border: "1px solid var(--x-line)" }}
                >
                  <div className="flex items-center gap-2 px-3 py-2 text-[12px] x-ui" style={{ color: "var(--x-text)" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3ee0a4]" />
                    VEIL Local Testnet
                  </div>
                  <div className="px-3 py-2 text-[11px]" style={{ color: "var(--x-faint)" }}>
                    Fuji and mainnet are parked.
                  </div>
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ border: "1px solid var(--x-line-2)", color: "var(--x-muted)" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M21 14.5A8.5 8.5 0 1111.5 3 7 7 0 0021 14.5z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1180px] px-4 pt-6">
        <SearchBar hero />
        <div className="mt-2.5 mb-5 flex items-center gap-1.5 text-[12.5px]" style={{ color: "var(--x-muted)" }}>
          <span className="x-ui">HyperSDK app-id {LOCAL_VEILVM_APP_ID}</span>
          <button
            type="button"
            aria-label="About app-id"
            onClick={() => setInfo((v) => !v)}
            className="flex h-4 w-4 items-center justify-center rounded-full text-[10px]"
            style={{ border: "1px solid var(--x-line-2)", color: "var(--x-faint)" }}
          >
            i
          </button>
          {info ? (
            <span className="text-[12px]" style={{ color: "var(--x-faint)" }}>
              VeilVM chain id is not an EVM chain. Local ≠ Fuji ≠ mainnet.
            </span>
          ) : null}
        </div>
      </div>

      <main className="mx-auto max-w-[1180px] px-4 pb-6">{children}</main>

      <footer className="mt-16 pb-10">
        <div className="flex flex-col items-center gap-2 text-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden>
            <path d="M12 22L2 4H22L12 22Z" fill="#3ee0a4" />
          </svg>
          <p className="x-ui text-[13px]" style={{ color: "var(--x-muted)" }}>
            VEIL Explorer • Built for developers, traders, and provers.
          </p>
        </div>
      </footer>
    </div>
  )
}
