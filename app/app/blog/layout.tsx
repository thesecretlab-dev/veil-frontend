import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Technical design notes and build journal from the VEIL team on architecture, privacy, and market infrastructure.",
  openGraph: {
    title: "Blog - VEIL",
    description: "Technical design notes and build journal from VEIL.",
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
