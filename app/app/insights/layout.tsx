import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Insights Hub | VEIL",
  description: "Preview market data surfaces, API management, and data receipt mechanics.",
}

export default function InsightsLayout({ children }: { children: React.ReactNode }) {
  return children
}
