"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import {
  AddrLink,
  Card,
  CopyBtn,
  Crumbs,
  HashLink,
  Identicon,
  MethodBadge,
  Row,
  SuccessPill,
  age,
} from "@/components/explorer/ui"
import type { TxRow } from "@/lib/explorer/types"

type Addr = { address: string; veil: number; vai: number }

export default function AddressPage() {
  const params = useParams<{ id: string }>()
  const [data, setData] = useState<Addr | null>(null)
  const [txs, setTxs] = useState<TxRow[]>([])
  const [error, setError] = useState("")
  const [tab, setTab] = useState<"overview" | "txs">("overview")

  useEffect(() => {
    const id = decodeURIComponent(params.id || "")
    if (!id) return
    void fetch(`/api/explorer/address?id=${encodeURIComponent(id)}`, { cache: "no-store" })
      .then(async (r) => {
        const j = await r.json()
        if (!r.ok) throw new Error(j.error || "not found")
        setData(j)
      })
      .catch((e) => setError(String(e.message || e)))
    void fetch("/api/explorer/blocks?count=40", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        const all: TxRow[] = j.txs || []
        const needle = id.toLowerCase()
        setTxs(all.filter((t) => t.from?.toLowerCase() === needle || t.to?.toLowerCase() === needle))
      })
  }, [params.id])

  const addr = data?.address || decodeURIComponent(params.id || "")

  return (
    <div>
      <Crumbs items={[{ label: "Home", href: "/explorer" }, { label: "Address" }]} />
      <div className="flex items-start gap-3 mb-5">
        <Identicon seed={addr} size={40} />
        <div className="min-w-0">
          <h1 className="text-[22px] font-semibold x-ui">Address</h1>
          <p className="x-mono text-[13px] break-all" style={{ color: "var(--x-muted)" }}>
            {addr} <CopyBtn text={addr} />
          </p>
        </div>
      </div>
      {error && <p className="text-[13px] mb-3" style={{ color: "var(--x-danger)" }}>{error}</p>}

      <div className="flex gap-4 mb-4 text-[14px] x-ui" style={{ borderBottom: "1px solid var(--x-line)" }}>
        {(["overview", "txs"] as const).map((t) => (
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
            {t === "overview" ? "Overview" : `Transactions (${txs.length})`}
          </button>
        ))}
      </div>

      {data && tab === "overview" && (
        <div className="grid lg:grid-cols-2 gap-4">
          <Card title="Overview">
            <Row k="VEIL Balance" v={<b>{data.veil.toLocaleString()} VEIL</b>} />
            <Row k="VAI Balance" v={<b>{data.vai.toLocaleString()} VAI</b>} />
            <Row k="Chain" v="VeilVM · app-id 22207 · local" />
          </Card>
          <Card title="Token Holdings">
            <table className="x-table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>VEIL</td>
                  <td className="tabular-nums">{data.veil.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>VAI</td>
                  <td className="tabular-nums">{data.vai.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {tab === "txs" && (
        <Card title="Transactions">
          {txs.length === 0 ? (
            <div className="px-4 py-10 text-center text-[13px]" style={{ color: "var(--x-muted)" }}>
              No matching transactions in the last 40 blocks.
            </div>
          ) : (
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
                        <a href={`/explorer/block/${t.blockHeight}`}>{t.blockHeight.toLocaleString()}</a>
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
      )}
    </div>
  )
}
