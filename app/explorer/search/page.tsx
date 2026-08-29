"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Card, Crumbs, SkeletonRows } from "@/components/explorer/ui"

type Hit = { kind: string; href: string; label: string }

function SearchInner() {
  const params = useSearchParams()
  const q = params.get("q") || ""
  const [hits, setHits] = useState<Hit[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!q) {
      setHits([])
      return
    }
    setLoading(true)
    void fetch(`/api/explorer/search?q=${encodeURIComponent(q)}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => setHits(j.hits || []))
      .finally(() => setLoading(false))
  }, [q])

  return (
    <div>
      <Crumbs items={[{ label: "Home", href: "/explorer" }, { label: "Search" }]} />
      <h1 className="text-[22px] font-semibold x-ui mb-4">Search</h1>
      <Card title={q ? `Search results for "${q}"` : "Query"}>
        {loading && <SkeletonRows n={4} />}
        {!loading && q && hits.length === 0 && (
          <div className="px-4 py-10 text-center text-[13px]" style={{ color: "var(--x-muted)" }}>
            There are no matching entries for this query.
          </div>
        )}
        {hits.map((h) => (
          <Link
            key={h.href}
            href={h.href}
            className="flex items-center gap-3 px-4 py-3 text-[13px]"
            style={{ borderTop: "1px solid var(--x-line)", textDecoration: "none" }}
          >
            <span className="x-pill x-pill-method x-ui uppercase">{h.kind}</span>
            <span>{h.label}</span>
          </Link>
        ))}
      </Card>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SkeletonRows />}>
      <SearchInner />
    </Suspense>
  )
}
