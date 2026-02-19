import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Alerts | VEIL",
  description: "Set price alerts and market resolution notifications for your favorite prediction markets.",
}

export default function AlertsLayout({ children }: { children: React.ReactNode }) {
  return children
}
