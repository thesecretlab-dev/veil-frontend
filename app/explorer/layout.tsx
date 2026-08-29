import type { Metadata } from "next"
import { ExplorerChrome } from "@/components/explorer/chrome"

export const metadata: Metadata = {
  title: "VEIL Explorer",
  description: "Block explorer for the local VeilVM node. HyperSDK app-id 22207. Not Fuji. Not mainnet.",
}

export default function ExplorerLayout({ children }: { children: React.ReactNode }) {
  return <ExplorerChrome>{children}</ExplorerChrome>
}
