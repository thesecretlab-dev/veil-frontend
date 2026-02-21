import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Developer Journal | VEIL",
  description: "Community-facing build journal covering where VEIL started, what is shipped, and what remains before launch.",
}

export default function TransparencyLayout({ children }: { children: React.ReactNode }) {
  return children
}
