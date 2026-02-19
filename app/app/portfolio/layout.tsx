import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Portfolio",
  description: "View your trading portfolio, active positions, and transaction history on VEIL.",
  openGraph: {
    title: "Portfolio - VEIL",
    description: "Manage your privacy-first prediction market positions.",
  },
}

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
