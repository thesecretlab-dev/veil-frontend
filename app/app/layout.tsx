import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Markets",
  description:
    "Browse and trade on privacy-scoped prediction markets with shielded VM lanes and transparent companion EVM rails.",
  openGraph: {
    title: "VEIL Markets - Privacy-Scoped Trading",
    description: "Browse and trade with route-level privacy guarantees and transparent EVM companion rails.",
  },
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
