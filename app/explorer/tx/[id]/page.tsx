"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  AddrLink,
  Card,
  CopyBtn,
  Crumbs,
  MethodBadge,
  Row,
  SkeletonRows,
  SuccessPill,
  age,
  timeUtc,
} from "@/components/explorer/ui"
import type { DecodedTx } from "@/lib/explorer/types"

export default function TxPage() {
  const params = useParams<{ id: string }>()
  const [tx, setTx] = useState<DecodedTx | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"overview" | "logs">("overview")
  const [more, setMore] = useState(false)

  useEffect(() => {
    const id = decodeURIComponent(params.id || "")
    if (!id) return
    setLoading(true)
    void fetch(`/api/explorer/tx?id=${encodeURIComponent(id)}`, { cache: "no-store" })
      .then(async (r) => {
        const j = await r.json()
        if (!r.ok) throw new Error(j.error || "Transaction not found")
        setTx(j)
      })
      .catch((e) => setError(String(e.message || e)))
      .finally(() => setLoading(false))
  }, [params.id])

  return (
    <div>
      <Crumbs items={[{ label: "Home", href: "/explorer" }, { label: "Transactions", href: "/explorer/txs" }, { label: "Overview" }]} />
      <h1 className="text-[22px] font-semibold x-ui mb-4">Transaction Details</h1>

      <div className="flex gap-4 mb-4 text-[14px] x-ui" style={{ borderBottom: "1px solid var(--x-line)" }}>
        {(["overview", "logs"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className="pb-2"
            style={{
              color: tab === t ? "var(--x-text)" : "var(--x-muted)",
              borderBottom: tab === t ? "2px solid #3ee0a4" : "2px solid transparent",
              fontWeight: tab === t ? 600 : 500,
            }}
          >
            {t === "overview" ? "Overview" : "Logs"}
          </button>
        ))}
      </div>

      {loading && (
        <Card title="Overview">
          <SkeletonRows n={9} />
        </Card>
      )}
      {error && <p className="text-[13px]" style={{ color: "var(--x-danger)" }}>{error}</p>}

      {tx && tab === "overview" && (
        <Card title="Transaction Details">
          <Row
            k="Transaction Hash"
            v={
              <span className="x-mono">
                {tx.idHex} <CopyBtn text={tx.idHex} />
              </span>
            }
          />
          <Row k="Status" v={<SuccessPill ok={tx.result ? tx.result.success : null} />} />
          {tx.blockHeight != null && (
            <Row
              k="Block"
              v={
                <Link href={`/explorer/block/${tx.blockHeight}`}>
                  {tx.blockHeight.toLocaleString()}
                </Link>
              }
            />
          )}
          <Row k="Timestamp" v={tx.timestamp ? `${timeUtc(tx.timestamp)} (${age(tx.timestamp)})` : "—"} />
          <Row k="From" v={<AddrLink addr={tx.from} head={16} tail={10} />} />
          <Row k="To" v={tx.to?.startsWith("0x") ? <AddrLink addr={tx.to} head={16} tail={10} /> : tx.to || "—"} />
          <Row k="Transaction Action" v={tx.actions[0]?.summary || tx.method} />
          <Row k="Method" v={<MethodBadge name={tx.method} />} />
          <Row k="Value" v={tx.value || "0"} />
          <Row k="Transaction Fee" v={tx.result?.fee != null ? `${tx.result.fee.toLocaleString()} units` : "—"} />
          <Row k="Max Fee" v={`${tx.maxFee.toLocaleString()} units`} />
          {tx.result?.error && <Row k="Revert reason" v={tx.result.error} />}
          <div className="px-4 py-3">
            <button type="button" className="text-[13px]" onClick={() => setMore((v) => !v)}>
              {more ? "Hide additional details" : "Click to see more ▾"}
            </button>
            {more && (
              <div className="mt-3 space-y-2 text-[12px] x-mono" style={{ color: "var(--x-muted)" }}>
                <div>CB58: {tx.id}</div>
                <div>Size: {tx.size} bytes</div>
                <div className="break-all">Auth: {tx.authHex}</div>
                {tx.actions.map((a, i) => (
                  <pre key={i} className="whitespace-pre-wrap">
                    {JSON.stringify({ name: a.name, fields: a.fields }, null, 2)}
                  </pre>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      {tx && tab === "logs" && (
        <Card title="Transaction Receipt Event Logs">
          <div className="px-4 py-10 text-center text-[13px]" style={{ color: "var(--x-muted)" }}>
            No event logs. VeilVM native actions do not emit EVM logs.
          </div>
        </Card>
      )}
    </div>
  )
}
