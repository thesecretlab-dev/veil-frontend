import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Latest updates, insights, and news from the VEIL team about privacy, prediction markets, and decentralized finance.",
  openGraph: {
    title: "Blog - VEIL",
    description: "Latest updates from VEIL on privacy and prediction markets.",
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
