import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Documentation | VEIL",
  description: "Technical architecture, token economics, and ANIMA agent documentation for the VEIL protocol.",
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children
}
