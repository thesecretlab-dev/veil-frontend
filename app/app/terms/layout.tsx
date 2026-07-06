import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms | VEIL",
  description: "Terms of Service for the VEIL network.",
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
