import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "VEILfi Preview - Staking, Liquidity & Governance | VEIL Protocol",
  description:
    "Preview VEILfi staking, liquidity, and governance mechanics. Execution is gated while launch readiness remains in-progress.",
  openGraph: {
    title: "VEILfi Preview - Staking, Liquidity & Governance",
    description:
      "Preview VEILfi staking, liquidity, and governance mechanics while launch gates remain in-progress.",
    type: "website",
    url: "https://veil.exchange/app/veil",
  },
  twitter: {
    card: "summary_large_image",
    title: "VEILfi Preview - Staking, Liquidity & Governance",
    description: "Preview VEILfi staking and liquidity mechanics; execution is currently gated by launch readiness.",
  },
}

export default function VeilLayout({ children }: { children: React.ReactNode }) {
  return children
}
