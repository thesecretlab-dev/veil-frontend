import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Promo | VEIL",
  description: "VEIL promotional showcase.",
}

export default function PromoLayout({ children }: { children: React.ReactNode }) {
  return children
}
