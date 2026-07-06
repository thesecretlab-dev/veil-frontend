import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ecosystem | VEIL",
  description: "Partners, integrations, and infrastructure across the VEIL ecosystem.",
}

export default function EcosystemLayout({ children }: { children: React.ReactNode }) {
  return children
}
