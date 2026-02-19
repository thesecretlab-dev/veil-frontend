import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "VEILfi - Staking, Liquidity & Governance | VEIL Protocol",
  description:
    "Stake VEIL, lock for veVEIL voting power, provide liquidity to protocol-owned pools, and participate in governance. Track POL TVL, MSRB depth, buybacks, and claim rewards.",
  openGraph: {
    title: "VEILfi - Staking, Liquidity & Governance",
    description:
      "Stake VEIL, lock for veVEIL voting power, provide liquidity to protocol-owned pools, and participate in governance.",
    type: "website",
    url: "https://veil.exchange/app/veil",
  },
  twitter: {
    card: "summary_large_image",
    title: "VEILfi - Staking, Liquidity & Governance",
    description: "Stake VEIL, lock for veVEIL, provide liquidity, and govern the protocol.",
  },
}

export default function VeilLayout({ children }: { children: React.ReactNode }) {
  return children
}
