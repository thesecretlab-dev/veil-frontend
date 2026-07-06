import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Bloodsworn Oath | VEIL",
  description: "Take the Bloodsworn Oath to begin reputation advancement on VEIL.",
}

export default function OathLayout({ children }: { children: React.ReactNode }) {
  return children
}
