import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "API Docs | VEIL",
  description: "REST API reference for VEIL markets, orders, positions, and account data.",
}

export default function ApiDocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
