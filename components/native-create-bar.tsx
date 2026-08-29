"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createNativeMarket } from "@/lib/market-api-client"

export function NativeCreateBar({ onCreated }: { onCreated?: () => void }) {
  const router = useRouter()
  const [question, setQuestion] = useState("")
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState("")
  const [kind, setKind] = useState("YES / NO")
  const [kindOpen, setKindOpen] = useState(false)

  async function onCreate() {
    const q = question.trim()
    if (!q) {
      setMsg("Enter a market question")
      return
    }
    setBusy(true)
    setMsg("")
    try {
      const result = await createNativeMarket(q)
      if (!result?.accepted || !result.marketId) {
        const err = result?.error || "create failed"
        if (/invalid balance|could not subtract/i.test(err)) {
          setMsg("Relayer has 0 VEIL. Use Faucet in the header, then retry.")
          return
        }
        setMsg(err)
        return
      }
      setQuestion("")
      setMsg(`created ${result.marketId.slice(0, 12)}… opening book`)
      onCreated?.()
      router.push(`/app/market/${encodeURIComponent(result.marketId)}`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto mb-7 max-w-[1100px] px-6 md:px-10">
      <div
        className="flex flex-col gap-2 sm:flex-row sm:items-center"
        style={{
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.02)",
          padding: "8px 8px 8px 16px",
        }}
      >
        <span
          className="shrink-0 text-[13px]"
          style={{ fontFamily: "var(--font-space-grotesk)", color: "#34d399", fontWeight: 600 }}
        >
          Create native market
        </span>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter market question..."
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-[14px] outline-none"
          style={{
            fontFamily: "var(--font-figtree)",
            color: "rgba(255, 255, 255, 0.92)",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") void onCreate()
          }}
        />
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setKindOpen((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-2 text-[12px]"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: "rgba(255,255,255,0.72)",
              borderLeft: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {kind}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {kindOpen ? (
            <div
              className="absolute right-0 top-[calc(100%+6px)] z-20 min-w-[140px] overflow-hidden rounded-xl py-1"
              style={{ background: "#0a0c0b", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {["YES / NO"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className="block w-full px-3 py-2 text-left text-[12px]"
                  style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(255,255,255,0.8)" }}
                  onClick={() => {
                    setKind(opt)
                    setKindOpen(false)
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => void onCreate()}
          className="shrink-0 px-4 py-2 text-[13px] disabled:opacity-50"
          style={{
            fontFamily: "var(--font-space-grotesk)",
            borderRadius: 10,
            background: "transparent",
            border: "1px solid rgba(16, 185, 129, 0.55)",
            color: "#34d399",
          }}
        >
          {busy ? "Creating…" : "Create"}
        </button>
      </div>
      {msg ? (
        <div className="mt-2 text-[11px]" style={{ fontFamily: "var(--font-figtree)", color: "rgba(16, 185, 129, 0.78)" }}>
          {msg}
        </div>
      ) : null}
    </div>
  )
}
