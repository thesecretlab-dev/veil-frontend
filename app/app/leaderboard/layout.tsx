import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "Top traders on VEIL prediction markets. See rankings, profits, and trading statistics.",
  openGraph: {
    title: "Leaderboard - VEIL",
    description: "Top traders on privacy-first prediction markets.",
  },
}

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
