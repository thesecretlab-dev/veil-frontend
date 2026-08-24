"use client"

import { useState } from "react"
import { createNativeMarket } from "@/lib/market-api-client"

export function NativeCreateBar({ onCreated }: { onCreated?: () => void }) {
  const [question, setQuestion] = useState("")
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState("")

  async function onCreate() {
    const q = question.trim()
    if (!q) {
      setMsg("Enter a question")
      return
    }
    setBusy(true)
    setMsg("")
    try {
      const result = await createNativeMarket(q)
      if (!result?.accepted || !result.marketId) {
        setMsg(result?.error || "create failed — is the local router up?")
        return
      }
      setQuestion("")
      setMsg(`created ${result.marketId.slice(0, 12)}…`)
      onCreated?.()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto mb-6 flex max-w-5xl flex-col gap-2 px-6 md:px-10">
      <div className="flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Create a VeilVM native market…"
          className="flex-1 bg-transparent px-4 py-3 text-sm outline-none"
          style={{
            fontFamily: "var(--font-figtree)",
            borderRadius: "12px",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            color: "rgba(255, 255, 255, 0.8)",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") void onCreate()
          }}
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => void onCreate()}
          className="px-5 text-[13px] disabled:opacity-50"
          style={{
            fontFamily: "var(--font-space-grotesk)",
            borderRadius: "12px",
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            color: "rgba(16, 185, 129, 0.95)",
          }}
        >
          {busy ? "Creating…" : "Create"}
        </button>
      </div>
      {msg ? (
        <div className="text-[11px]" style={{ fontFamily: "var(--font-figtree)", color: "rgba(16, 185, 129, 0.7)" }}>
          {msg}
        </div>
      ) : (
        <div className="text-[11px]" style={{ fontFamily: "var(--font-figtree)", color: "rgba(255, 255, 255, 0.25)" }}>
          Native markets settle on local VeilVM. Polymarket rows are catalog only.
        </div>
      )}
    </div>
  )
}
