import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Onboarding | VEIL",
  description: "Developer and validator onboarding flow for the VEIL network.",
}

export default function OnboardLayout({ children }: { children: React.ReactNode }) {
  return children
}
