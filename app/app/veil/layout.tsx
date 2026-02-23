import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "VEILfi Preview - Staking, Liquidity & Governance | VEIL Protocol",
  description:
    "Preview VEILfi staking, liquidity, and governance mechanics. Launch authority is GO FOR PRODUCTION while feature execution remains operator-staged.",
  openGraph: {
    title: "VEILfi Preview - Staking, Liquidity & Governance",
    description:
      "Preview VEILfi staking, liquidity, and governance mechanics with GO FOR PRODUCTION launch authority and staged feature rollout.",
    type: "website",
    url: "https://veil.exchange/app/veil",
  },
  twitter: {
    card: "summary_large_image",
    title: "VEILfi Preview - Staking, Liquidity & Governance",
    description: "Preview VEILfi staking and liquidity mechanics; launch authority is GO FOR PRODUCTION and feature rollout remains staged.",
  },
}

export default function VeilLayout({ children }: { children: React.ReactNode }) {
  return children
}
