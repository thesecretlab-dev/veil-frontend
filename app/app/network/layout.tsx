import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Live Network Topology | VEIL",
  description: "Live visual of VEIL mainnet core and orbiting child validator lanes.",
}

export default function NetworkLayout({ children }: { children: React.ReactNode }) {
  return children
}
