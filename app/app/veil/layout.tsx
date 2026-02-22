import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "VEILfi - Staking, Liquidity & Governance | VEIL Protocol",
  description:
    "Stake into rebasing vVEIL, wrap to gVEIL governance units, provide liquidity to chain-owned pools, and participate in governance. Track POL depth, liquidity targets, and reward policy.",
  openGraph: {
    title: "VEILfi - Staking, Liquidity & Governance",
    description:
      "Stake into rebasing vVEIL, wrap to gVEIL governance units, provide liquidity to chain-owned pools, and participate in governance.",
    type: "website",
    url: "https://veil.exchange/app/veil",
  },
  twitter: {
    card: "summary_large_image",
    title: "VEILfi - Staking, Liquidity & Governance",
    description: "Stake into rebasing vVEIL, wrap to gVEIL, provide liquidity, and govern the protocol.",
  },
}

export default function VeilLayout({ children }: { children: React.ReactNode }) {
  return children
}
