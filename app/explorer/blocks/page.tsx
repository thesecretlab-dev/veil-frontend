import Link from "next/link"
import { Card, Crumbs, HashLink } from "@/components/explorer/ui"
import { fetchRecentBlocks } from "@/lib/explorer/rpc"
import { age } from "@/lib/explorer/format"

export const dynamic = "force-dynamic"

export default async function BlocksPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>
}) {
  const sp = await searchParams
  const from = sp.from && Number.isFinite(Number(sp.from)) ? Number(sp.from) : undefined
  let error = ""
  let tip: number | null = null
  let blocks: Awaited<ReturnType<typeof fetchRecentBlocks>>["blocks"] = []
  try {
    const data = await fetchRecentBlocks(20, from)
    tip = data.tip
    blocks = data.blocks
  } catch (e) {
    error = String(e instanceof Error ? e.message : e)
  }
  const oldest = blocks[blocks.length - 1]?.height

  return (
    <div>
      <Crumbs items={[{ label: "Home", href: "/explorer" }, { label: "Blocks" }]} />
      <h1 className="text-[22px] font-semibold x-ui mb-4">Blocks</h1>
      <Card title={tip != null ? `Network latest: ${tip.toLocaleString()}` : "Blocks"}>
        {error && (
          <div className="px-4 py-8 text-[13px]" style={{ color: "var(--x-danger)" }}>
            Could not load blocks: {error}
          </div>
        )}
        {!error && (
          <div className="overflow-x-auto">
            <table className="x-table">
              <thead>
                <tr>
                  <th>Block</th>
                  <th>Age</th>
                  <th>Txn</th>
                  <th>Bandwidth</th>
                  <th>Size</th>
                  <th>Block Hash</th>
                </tr>
              </thead>
              <tbody>
                {blocks.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ color: "var(--x-muted)" }}>
                      No blocks returned from this node.
                    </td>
                  </tr>
                )}
                {blocks.map((b) => (
                  <tr key={b.height}>
                    <td>
                      <Link href={`/explorer/block/${b.height}`} className="font-semibold">
                        {b.height.toLocaleString()}
                      </Link>
                    </td>
                    <td style={{ color: "var(--x-muted)" }}>{age(b.timestamp)}</td>
                    <td>{b.txCount}</td>
                    <td className="tabular-nums">{b.bandwidth.toLocaleString()}</td>
                    <td className="tabular-nums">{b.size.toLocaleString()}</td>
                    <td>
                      <HashLink href={`/explorer/block/${b.height}`} hash={b.blockId} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {oldest != null && oldest > 0 && (
          <div className="px-4 py-3" style={{ borderTop: "1px solid var(--x-line)" }}>
            <Link href={`/explorer/blocks?from=${oldest - 1}`} className="x-btn x-ui">
              Older blocks
            </Link>
          </div>
        )}
      </Card>
    </div>
  )
}
