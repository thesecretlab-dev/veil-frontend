"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  AddrLink,
  Card,
  CopyBtn,
  Crumbs,
  HashLink,
  MethodBadge,
  Row,
  SkeletonRows,
  SuccessPill,
  age,
  timeUtc,
} from "@/components/explorer/ui"
import type { DecodedBlock } from "@/lib/explorer/types"

export default function BlockPage() {
  const params = useParams<{ height: string }>()
  const [block, setBlock] = useState<DecodedBlock | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"overview" | "txs">("overview")

  useEffect(() => {
    const h = params.height
    if (!h) return
    setLoading(true)
    setError("")
    const q = /^\d+$/.test(h) ? `height=${h}` : `id=${encodeURIComponent(h)}`
    void fetch(`/api/explorer/block?${q}`, { cache: "no-store" })
      .then(async (r) => {
        const j = await r.json()
        if (!r.ok) throw new Error(j.error || "not found")
        setBlock(j)
        setTab(j.txCount ? "overview" : "overview")
      })
      .catch((e) => setError(String(e.message || e)))
      .finally(() => setLoading(false))
  }, [params.height])

  const n = Number(params.height)
  const prev = Number.isFinite(n) && n > 0 ? n - 1 : null
  const next = Number.isFinite(n) ? n + 1 : null
  const heightLabel = (block?.height ?? n).toLocaleString()

  return (
    <div>
      <Crumbs items={[{ label: "Home", href: "/explorer" }, { label: "Blocks", href: "/explorer/blocks" }, { label: `#${heightLabel}` }]} />
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h1 className="text-[22px] font-semibold x-ui">Block #{heightLabel}</h1>
        <div className="flex gap-2">
          {prev != null && (
            <Link href={`/explorer/block/${prev}`} className="x-btn x-ui">
              ← Previous
            </Link>
          )}
          {next != null && (
            <Link href={`/explorer/block/${next}`} className="x-btn x-ui">
              Next →
            </Link>
          )}
        </div>
      </div>

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
            {t === "overview" ? "Overview" : `Transactions (${block?.txCount ?? 0})`}
          </button>
        ))}
      </div>

      {loading && (
        <Card title="Overview">
          <SkeletonRows n={8} />
        </Card>
      )}
      {error && <p className="text-[13px]" style={{ color: "var(--x-danger)" }}>{error}</p>}

      {block && tab === "overview" && (
        <Card title="Block Details">
          <Row k="Block Height" v={<>{block.height.toLocaleString()} <CopyBtn text={String(block.height)} /></>} />
          <Row k="Status" v={<SuccessPill ok />} />
          <Row k="Timestamp" v={`${timeUtc(block.timestamp)} (${age(block.timestamp)})`} />
          <Row k="Transactions" v={`${block.txCount} transaction${block.txCount === 1 ? "" : "s"} in this block`} />
          <Row
            k="Block Hash"
            v={
              <span className="x-mono">
                {block.blockId} <CopyBtn text={block.blockId} />
              </span>
            }
          />
          <Row
            k="Parent Hash"
            v={<HashLink href={prev != null ? `/explorer/block/${prev}` : `/explorer`} hash={block.parent} head={20} tail={16} />}
          />
          <Row k="State Root" v={<span className="x-mono">{block.stateRoot}</span>} />
          <Row k="Size" v={`${block.size.toLocaleString()} bytes`} />
          <Row k="Bandwidth used" v={block.units.bandwidth.toLocaleString()} />
          <Row k="Compute used" v={block.units.compute.toLocaleString()} />
          {block.pChainHeight != null && <Row k="P-Chain Height" v={block.pChainHeight.toLocaleString()} />}
        </Card>
      )}

      {block && tab === "txs" && (
        <Card title={`Transactions`}>
          {block.txs.length === 0 ? (
            <div className="px-4 py-10 text-center text-[13px]" style={{ color: "var(--x-muted)" }}>
              This block contains 0 transactions.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="x-table">
                <thead>
                  <tr>
                    <th>Txn Hash</th>
                    <th>Method</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Value</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {block.txs.map((tx) => (
                    <tr key={tx.idHex}>
                      <td>
                        <HashLink href={`/explorer/tx/${tx.idHex}`} hash={tx.idHex} />
                      </td>
                      <td>
                        <MethodBadge name={tx.method} />
                      </td>
                      <td>
                        <AddrLink addr={tx.from} />
                      </td>
                      <td>{tx.to?.startsWith("0x") ? <AddrLink addr={tx.to} /> : tx.to || "—"}</td>
                      <td>{tx.value || "—"}</td>
                      <td>
                        <SuccessPill ok={tx.result ? tx.result.success : null} />
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
