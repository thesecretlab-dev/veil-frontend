import type React from "react"
import type { Metadata } from "next"
import { ViolaChat } from "@/components/viola-chat"

export const metadata: Metadata = {
  title: "Markets",
  description:
    "Browse and trade on privacy-first prediction markets. Explore crypto, politics, sports, and more with complete anonymity.",
  openGraph: {
    title: "VEIL Markets - Trade Anonymously",
    description: "Browse and trade on privacy-first prediction markets with zero-knowledge proofs.",
  },
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <ViolaChat />
    </>
  )
}
