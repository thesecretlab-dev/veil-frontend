export const ECOSYSTEM_FLOW = [
  { href: "/app", label: "Markets" },
  { href: "/explorer", label: "Explorer" },
  { href: "/app/onboard", label: "Onboard" },
  { href: "/app/defi", label: "DeFi Mesh" },
] as const

export function flowActive(path: string, href: string): boolean {
  if (href === "/app") return path === "/app" || path.startsWith("/app/market")
  if (href === "/app/onboard") {
    return (
      path === "/app/onboard" ||
      path.startsWith("/app/onboard/") ||
      path === "/app/apply" ||
      path === "/app/launch" ||
      path === "/app/zeroid" ||
      path.startsWith("/app/zeroid/") ||
      path === "/app/oath"
    )
  }
  if (href === "/app/defi") {
    return (
      path === "/app/defi" ||
      path.startsWith("/app/defi/") ||
      path === "/mesh" ||
      path.startsWith("/mesh/")
    )
  }
  return path === href || path.startsWith(`${href}/`)
}

export const FLOW_NEXT = [
  { href: "/app/apply", label: "Apply", hint: "Request entry" },
  { href: "/app/onboard", label: "Onboard", hint: "Local citizen path" },
  { href: "/app/zeroid", label: "ZER0ID", hint: "8004 · registry" },
  { href: "/app", label: "Markets", hint: "Native books" },
  { href: "/explorer", label: "Explorer", hint: "VeilVM ledger" },
  { href: "/mesh", label: "Mesh", hint: "TSL RPC" },
] as const
