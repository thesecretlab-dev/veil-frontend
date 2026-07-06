import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | VEIL",
  description: "How VEIL collects, uses, and protects your information.",
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
