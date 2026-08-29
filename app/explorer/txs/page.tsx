import Link from "next/link"
import { AddrLink, Card, Crumbs, HashLink, MethodBadge, SuccessPill } from "@/components/explorer/ui"
import { fetchRecentTxs } from "@/lib/explorer/rpc"
import { age } from "@/lib/explorer/format"

export const dynamic = "force-dynamic"

export default async function TxsPage() {
  let error = ""
  let scanned = 0
  let txs: Awaited<ReturnType<typeof fetchRecentTxs>>["txs"] = []
  try {
    const data = await fetchRecentTxs(30)
    scanned = data.scanned
    txs = data.txs
  } catch (e) {
    error = String(e instanceof Error ? e.message : e)
  }

  return (
    <div>
      <Crumbs items={[{ label: "Home", href: "/explorer" }, { label: "Transactions" }]} />
      <h1 className="text-[22px] font-semibold x-ui mb-4">Transactions</h1>
      <Card title={scanned ? `Latest native txs (${scanned} heights scanned)` : "Latest native txs"}>
        {error && (
          <div className="px-4 py-8 text-[13px]" style={{ color: "var(--x-danger)" }}>
            Could not load transactions: {error}
          </div>
        )}
        {!error && txs.length === 0 && (
          <div className="px-4 py-10 text-center text-[13px]" style={{ color: "var(--x-muted)" }}>
            No transactions in the recent window.
          </div>
        )}
        {!error && txs.length > 0 && (
          <div className="overflow-x-auto">
            <table className="x-table">
              <thead>
                <tr>
                  <th>Txn Hash</th>
                  <th>Method</th>
                  <th>Block</th>
                  <th>Age</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {txs.map((t) => (
                  <tr key={t.idHex}>
                    <td>
                      <HashLink href={`/explorer/tx/${t.idHex}`} hash={t.idHex} />
                    </td>
                    <td>
                      <MethodBadge name={t.method} />
                    </td>
                    <td>
                      <Link href={`/explorer/block/${t.blockHeight}`}>{t.blockHeight.toLocaleString()}</Link>
                    </td>
                    <td style={{ color: "var(--x-muted)" }}>{age(t.timestamp)}</td>
                    <td>
                      <AddrLink addr={t.from} head={6} tail={4} />
                    </td>
                    <td>{t.to?.startsWith("0x") ? <AddrLink addr={t.to} head={6} tail={4} /> : t.to || "—"}</td>
                    <td>{t.value || "—"}</td>
                    <td>
                      <SuccessPill ok={t.success} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
