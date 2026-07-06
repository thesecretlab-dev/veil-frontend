import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Launch | VEIL",
  description: "Validator launch and onboarding flow: payment verification, provisioning, and activation.",
}

export default function LaunchLayout({ children }: { children: React.ReactNode }) {
  return children
}
