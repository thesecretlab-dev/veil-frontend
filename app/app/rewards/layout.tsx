import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Rewards",
  description: "Preview reward mechanics and incentive structure for VEIL prediction markets.",
  openGraph: {
    title: "Rewards - VEIL",
    description: "Preview reward mechanics for VEIL's staged launch environment.",
  },
}

export default function RewardsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
