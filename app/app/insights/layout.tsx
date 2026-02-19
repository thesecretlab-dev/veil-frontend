import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Insights Hub | VEIL",
  description: "Access delayed market data, API management, and verified receipts. We sell probabilities, not people.",
}

export default function InsightsLayout({ children }: { children: React.ReactNode }) {
  return children
}
