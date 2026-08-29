"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  AddrLink,
  Card,
  HashLink,
  IconBook,
  IconClock,
  IconCube,
  IconShield,
  Identicon,
  MethodBadge,
  SkeletonRows,
  ViewAll,
  age,
  fmt,
  veilAddr,
} from "@/components/explorer/ui"
import type { BlockRow, ExplorerStatus, TxRow } from "@/lib/explorer/types"

type Home = {
  status?: ExplorerStatus
  tip?: number
  blockTimeMs?: number | null
  blocks?: BlockRow[]
  txs?: TxRow[]
  error?: string
}

function SpotMark() {
  return (
    <span className="relative inline-flex h-7 w-10 shrink-0" aria-hidden>
      <span
        className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold"
        style={{ background: "#10B981", color: "#04140c", zIndex: 1 }}
      >
        V
      </span>
      <span
        className="absolute right-0 top-0 flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-semibold"
        style={{ background: "#7c3aed", color: "#fff" }}
      >
        VAI
      </span>
    </span>
  )
}

export default function ExplorerHome() {
  const [home, setHome] = useState<Home | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let dead = false
    const load = async () => {
      try {
        const j = await fetch("/api/explorer/home", { cache: "no-store" }).then((r) => r.json())
        if (!dead) {
          setHome(j)
          setReady(true)
        }
      } catch (e) {
        if (!dead) {
          setHome({ error: String(e) })
          setReady(true)
        }
      }
    }
    void load()
    const id = setInterval(() => void load(), 4000)
    return () => {
      dead = true
      clearInterval(id)
    }
  }, [])

  const s = home?.status
  const blocks = home?.blocks || []
  const txs = home?.txs || []
  const r0 = s?.pool?.reserve0
  const r1 = s?.pool?.reserve1
  const spot = r0 && r0 > 0 && r1 != null ? (r1 / r0).toFixed(2) : "—"
  const sample = Math.max(blocks.length, 1)

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="x-stat">
          <div className="flex items-center gap-2 text-[12px] x-ui mb-2" style={{ color: "var(--x-muted)" }}>
            <span style={{ color: "#3ee0a4" }}>
              <IconCube />
            </span>
            Latest Block
          </div>
          <div className="text-[26px] font-semibold tabular-nums x-ui">{fmt(home?.tip ?? s?.height)}</div>
          <div className="text-[12px] mt-1" style={{ color: "var(--x-faint)" }}>
            {s?.blockTimestamp ? age(s.blockTimestamp) : "—"}
          </div>
        </div>
        <div className="x-stat">
          <div className="flex items-center gap-2 text-[12px] x-ui mb-2" style={{ color: "var(--x-muted)" }}>
            <span style={{ color: "#3ee0a4" }}>
              <IconClock />
            </span>
            Avg Block Time
          </div>
          <div className="text-[26px] font-semibold tabular-nums x-ui">
            {home?.blockTimeMs != null ? `${(home.blockTimeMs / 1000).toFixed(1)}s` : "—"}
          </div>
          <div className="text-[12px] mt-1" style={{ color: "var(--x-faint)" }}>
            Last {sample} blocks
          </div>
        </div>
        <div className="x-stat">
          <div className="flex items-center gap-2 text-[12px] x-ui mb-2" style={{ color: "var(--x-muted)" }}>
            <span style={{ color: "#3ee0a4" }}>{s?.proverReady ? <IconShield /> : <IconBook />}</span>
            Markets
          </div>
          <div className="text-[26px] font-semibold tabular-nums x-ui">{fmt(s?.markets)}</div>
          <div className="text-[12px] mt-1" style={{ color: s?.proverReady ? "#3ee0a4" : "var(--x-faint)" }}>
            {s?.proverReady ? "prover ready" : "prover cold"}
          </div>
        </div>
        <div className="x-stat">
          <div className="flex items-center justify-between gap-2 text-[12px] x-ui mb-2" style={{ color: "var(--x-muted)" }}>
            <span className="inline-flex items-center gap-2">
              <SpotMark />
              VEIL / VAI Spot
            </span>
          </div>
          <div className="text-[26px] font-semibold tabular-nums x-ui">{spot}</div>
          <div className="mt-1 text-right text-[11px] leading-4" style={{ color: "var(--x-muted)" }}>
            <div className="x-ui" style={{ color: "var(--x-faint)" }}>
              Reserves
            </div>
            <div className="tabular-nums">
              {r0 != null ? r0.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—"} VEIL
            </div>
            <div className="tabular-nums">
              {r1 != null ? r1.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—"} VAI
            </div>
          </div>
        </div>
      </div>

      {home?.error && (
        <p className="mb-4 text-[13px]" style={{ color: "var(--x-danger)" }}>
          {home.error}
        </p>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        <Card title="Latest Blocks" icon={<IconCube />} extra={<ViewAll href="/explorer/blocks" label="View all blocks" />}>
          {!ready ? (
            <SkeletonRows />
          ) : (
            <>
              <table className="x-table">
                <thead>
                  <tr>
                    <th>Height</th>
                    <th>Age</th>
                    <th>Proposer</th>
                    <th>Txs</th>
                    <th>Gas Used</th>
                  </tr>
                </thead>
                <tbody>
                  {blocks.slice(0, 8).map((b) => (
                    <tr key={b.height}>
                      <td>
                        <Link href={`/explorer/block/${b.height}`} className="font-semibold">
                          {b.height.toLocaleString()}
                        </Link>
                      </td>
                      <td style={{ color: "var(--x-muted)" }}>{age(b.timestamp)}</td>
                      <td>
                        <span className="inline-flex items-center gap-1.5">
                          <Identicon seed={b.proposer || String(b.height)} />
                          <span className="x-mono text-[12px]" style={{ color: "var(--x-muted)" }}>
                            {veilAddr(b.proposer)}
                          </span>
                        </span>
                      </td>
                      <td>
                        <Link href={`/explorer/block/${b.height}`}>{b.txCount}</Link>
                      </td>
                      <td>
                        <div className="x-gas">
                          <span className="tabular-nums">{(b.gasUsed ?? b.bandwidth).toLocaleString()}</span>
                          <span style={{ color: "var(--x-faint)" }}>({b.gasPct ?? 0}%)</span>
                          <span className="x-gas-bar">
                            <span style={{ width: `${Math.max(4, b.gasPct ?? 0)}%` }} />
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="py-3 text-center">
                <ViewAll href="/explorer/blocks" label="View all blocks" />
              </div>
            </>
          )}
        </Card>

        <Card
          title="Latest Transactions"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
              <path d="M7 7h11l-3-3M17 17H6l3 3" />
            </svg>
          }
          extra={<ViewAll href="/explorer/txs" label="View all transactions" />}
        >
          {!ready ? (
            <SkeletonRows />
          ) : txs.length === 0 ? (
            <div className="px-4 py-10 text-[13px] text-center" style={{ color: "var(--x-muted)" }}>
              No transactions in the last {blocks.length} blocks.
            </div>
          ) : (
            <>
              <table className="x-table">
                <thead>
                  <tr>
                    <th>Tx Hash</th>
                    <th>Age</th>
                    <th>Method</th>
                    <th>From</th>
                    <th>To</th>
                  </tr>
                </thead>
                <tbody>
                  {txs.slice(0, 8).map((t) => (
                    <tr key={t.idHex}>
                      <td>
                        <HashLink href={`/explorer/tx/${t.idHex}`} hash={t.idHex} head={8} tail={6} eye />
                      </td>
                      <td style={{ color: "var(--x-muted)" }}>{age(t.timestamp)}</td>
                      <td>
                        <MethodBadge name={t.method} />
                      </td>
                      <td>
                        <AddrLink addr={t.from} head={6} tail={4} />
                      </td>
                      <td>
                        {t.to.startsWith("0x") ? (
                          <AddrLink addr={t.to} head={6} tail={4} />
                        ) : (
                          <span style={{ color: "var(--x-muted)" }}>{t.to || "—"}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="py-3 text-center">
                <ViewAll href="/explorer/txs" label="View all transactions" />
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
