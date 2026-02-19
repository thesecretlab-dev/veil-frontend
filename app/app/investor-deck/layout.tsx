import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Investor Deck | VEIL",
  description:
    "Investment opportunity in VEIL - the future of private prediction markets on Avalanche. Market size, traction, roadmap, and funding details.",
  openGraph: {
    title: "Investor Deck | VEIL",
    description:
      "Investment opportunity in VEIL - the future of private prediction markets on Avalanche. Market size, traction, roadmap, and funding details.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Investor Deck | VEIL",
    description:
      "Investment opportunity in VEIL - the future of private prediction markets on Avalanche. Market size, traction, roadmap, and funding details.",
  },
}

export default function InvestorDeckLayout({ children }: { children: React.ReactNode }) {
  return children
}
