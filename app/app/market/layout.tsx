import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Market | VEIL",
  description: "Live order book, price history, and position details for a VEIL prediction market.",
}

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return children
}
