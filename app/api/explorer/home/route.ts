import { NextResponse } from "next/server"
import { fetchRecentBlocks, fetchRecentTxs, fetchStatus } from "@/lib/explorer/rpc"
import { publicCatalogOrigin } from "@/lib/runtime-profile"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    if (publicCatalogOrigin()) {
      const status = await fetchStatus()
      return NextResponse.json({
        status,
        tip: status.height,
        blocks: [],
        txs: [],
        note: "Local numbers mirrored. Block tape stays on loopback Mesh.",
      })
    }
    const [status, recent, txPack] = await Promise.all([
      fetchStatus(),
      fetchRecentBlocks(12),
      fetchRecentTxs(8, 400),
    ])
    return NextResponse.json({
      status,
      ...recent,
      txs: txPack.txs.length ? txPack.txs : recent.txs,
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 })
  }
}
