import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Compliance | VEIL",
  description: "VEIL's regulatory framework: KYC, AML, and jurisdictional compliance posture.",
}

export default function ComplianceLayout({ children }: { children: React.ReactNode }) {
  return children
}
