import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Alerts | VEIL",
  description: "Preview alert and notification mechanics for VEIL prediction markets.",
}

export default function AlertsLayout({ children }: { children: React.ReactNode }) {
  return children
}
