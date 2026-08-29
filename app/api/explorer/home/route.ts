import { NextResponse } from "next/server"
import { fetchRecentBlocks, fetchRecentTxs, fetchStatus } from "@/lib/explorer/rpc"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
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
