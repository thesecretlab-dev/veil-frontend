import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "DeFi | VEIL",
  description: "Wrapped VEIL, VAI stablecoin, and liquidity mechanics on the VEIL network.",
}

export default function DefiLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>
}
