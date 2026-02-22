import Link from "next/link"

export default function DefiPage() {
  return (
    <main className="min-h-screen bg-[#060606] px-6 py-24 text-white">
      <div className="mx-auto max-w-2xl rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 text-center">
        <p className="mb-3 font-[var(--font-space-grotesk)] text-[11px] uppercase tracking-[0.2em] text-emerald-400/70">
          DeFi Preview
        </p>
        <h1 className="mb-4 font-[var(--font-instrument-serif)] text-4xl text-white/90">
          Execution Is Gated
        </h1>
        <p className="mb-8 font-[var(--font-figtree)] text-sm leading-relaxed text-white/50">
          Live DeFi execution and wallet-driven private trading remain disabled while launch gates are still NO-GO.
          This route is documentation and readiness context only.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/app/transparency"
            className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-2 text-xs tracking-wide text-emerald-300"
          >
            View Launch Status
          </Link>
          <Link
            href="/app/docs"
            className="rounded-full border border-white/[0.08] px-5 py-2 text-xs tracking-wide text-white/55"
          >
            Read Technical Docs
          </Link>
        </div>
      </div>
    </main>
  )
}
