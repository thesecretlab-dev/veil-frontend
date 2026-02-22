import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Preview portfolio UX and position analytics for VEIL while live execution remains gated.",
  openGraph: {
    title: "Portfolio - VEIL",
    description: "Preview portfolio UX for VEIL's staged launch environment.",
  },
}

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
