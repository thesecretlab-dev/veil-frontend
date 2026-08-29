import type { ExplorerStatus } from "@/lib/explorer/types"

/** Public gist of loopback metrics. Not an RPC. Not a public L1. */
export const LOCAL_SNAPSHOT_GIST = (process.env.VEIL_SNAPSHOT_GIST || "fc35461824cb48ebe3b4df887f7b0532").trim()

export type LocalSnapshot = {
  ok: boolean
  at?: string
  nodeId?: string
  chainId?: string
  height?: number | null
  markets?: number
  proverReady?: boolean
  explorer?: ExplorerStatus | null
  tape?: {
    ok?: boolean
    height?: number | null
    pool?: ExplorerStatus["pool"]
    ticks?: Array<{ t: string; kind: string; text: string; hash?: string }>
  } | null
  actors?: {
    veil?: number
    vai?: number
    meshVeil?: number
    animaVeil?: number
    zer0Veil?: number
  } | null
  note?: string
}

export async function fetchLocalSnapshot(): Promise<LocalSnapshot | null> {
  if (!LOCAL_SNAPSHOT_GIST) return null
  const ua = { "user-agent": "veil-markets" }
  try {
    const res = await fetch(`https://api.github.com/gists/${LOCAL_SNAPSHOT_GIST}`, {
      headers: { accept: "application/vnd.github+json", ...ua },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    })
    if (res.ok) {
      const gist = (await res.json()) as { files?: Record<string, { content?: string }> }
      const raw = gist.files?.["veil-local-snapshot.json"]?.content
      if (raw) return JSON.parse(raw) as LocalSnapshot
    }
  } catch {
    /* fall through to raw gist */
  }
  try {
    const res = await fetch(
      `https://gist.githubusercontent.com/0x12371C/${LOCAL_SNAPSHOT_GIST}/raw/veil-local-snapshot.json?t=${Date.now()}`,
      { headers: ua, cache: "no-store", signal: AbortSignal.timeout(8000) },
    )
    if (!res.ok) return null
    return (await res.json()) as LocalSnapshot
  } catch {
    return null
  }
}

export function explorerFromSnapshot(snap: LocalSnapshot | null): ExplorerStatus | null {
  if (!snap?.explorer) return null
  return snap.explorer
}
