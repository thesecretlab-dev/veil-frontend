import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "VEILfi Preview - Staking, Liquidity & Governance | VEIL Protocol",
  description:
    "Preview VEILfi staking, liquidity, and governance mechanics. Local testnet — not Fuji, not public mainnet. Staking and bonds are spec.",
  openGraph: {
    title: "VEILfi Preview - Staking, Liquidity & Governance",
    description:
      "Preview VEILfi staking, liquidity, and governance mechanics on this local node. Spec where not executing.",
    type: "website",
    url: "https://veil.markets/app/veil",
  },
  twitter: {
    card: "summary_large_image",
    title: "VEILfi Preview - Staking, Liquidity & Governance",
    description: "Preview VEILfi staking and liquidity mechanics on the local VeilVM testnet. Spec where not executing.",
  },
}

export default function VeilLayout({ children }: { children: React.ReactNode }) {
  return children
}
