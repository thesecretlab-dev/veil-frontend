import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Transparency | VEIL",
  description: "Our commitment to open, verifiable, and accountable prediction markets.",
}

export default function TransparencyLayout({ children }: { children: React.ReactNode }) {
  return children
}
