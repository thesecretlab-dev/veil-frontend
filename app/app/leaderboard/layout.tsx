import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "Preview leaderboard and ranking mechanics for VEIL prediction markets.",
  openGraph: {
    title: "Leaderboard - VEIL",
    description: "Preview leaderboard mechanics for VEIL's staged launch.",
  },
}

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
