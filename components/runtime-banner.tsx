"use client"

import Link from "next/link"
import { profileBannerText } from "@/lib/runtime-profile"

export function RuntimeBanner({ compact = false }: { compact?: boolean }) {
  const text = profileBannerText()
  const local = text.startsWith("LOCAL")
  return (
    <Link
      href="/app/network"
      className="inline-flex items-center gap-1.5"
      style={{
        fontFamily: "var(--font-space-grotesk)",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.78)",
        background: "rgba(12, 16, 14, 0.95)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 999,
        padding: "5px 10px 5px 8px",
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
      title="Stack status"
    >
      <span
        aria-hidden
        style={{
          width: 6,
          height: 6,
          borderRadius: 999,
          background: local ? "#10B981" : "rgba(251,191,36,0.9)",
          flexShrink: 0,
        }}
      />
      {text}
    </Link>
  )
}
