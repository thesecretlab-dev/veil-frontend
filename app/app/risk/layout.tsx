import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Risk Disclosures | VEIL",
  description: "Risk disclosures for market, protocol, oracle, and liquidity risk on VEIL.",
}

export default function RiskLayout({ children }: { children: React.ReactNode }) {
  return children
}
