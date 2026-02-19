import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Rewards",
  description: "Earn rewards for trading and participating in VEIL prediction markets.",
  openGraph: {
    title: "Rewards - VEIL",
    description: "Earn rewards for trading on privacy-first prediction markets.",
  },
}

export default function RewardsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
