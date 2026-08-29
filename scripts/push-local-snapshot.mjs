/**
 * Push loopback explorer/tape numbers to the public gist veil.markets reads.
 * Not an RPC. Not a public L1. Requires GITHUB_TOKEN (gh auth).
 *
 *   node scripts/push-local-snapshot.mjs
 *   node scripts/push-local-snapshot.mjs --watch
 */
const GIST = process.env.VEIL_SNAPSHOT_GIST || "fc35461824cb48ebe3b4df887f7b0532"
const ORIGIN = (process.env.VEIL_SNAPSHOT_FROM || "http://127.0.0.1:3000").replace(/\/+$/, "")
const WATCH = process.argv.includes("--watch")

async function token() {
  const env = (process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "").trim()
  if (env) return env
  const { execFileSync } = await import("node:child_process")
  return execFileSync("gh", ["auth", "token"], { encoding: "utf8" }).trim()
}

async function pull(path) {
  const res = await fetch(`${ORIGIN}${path}`, { cache: "no-store", signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`${path} ${res.status}`)
  return res.json()
}

async function once() {
  const [explorer, tape, orders, status] = await Promise.all([
    pull("/api/explorer/status").catch(() => null),
    pull("/api/live-tape").catch(() => null),
    pull("/api/orders").catch(() => null),
    pull("/api/status").catch(() => null),
  ])
  const snap = {
    ok: Boolean(explorer?.ok || status?.ok),
    at: new Date().toISOString(),
    nodeId: explorer?.nodeId || status?.veilvm?.nodeId || "",
    chainId: explorer?.chainId || status?.veilvm?.chainId || "",
    height: explorer?.height ?? status?.veilvm?.height ?? null,
    markets: explorer?.markets ?? status?.router?.markets ?? 0,
    proverReady: Boolean(explorer?.proverReady || status?.router?.proverReady),
    explorer,
    tape: tape
      ? { ok: Boolean(tape.ok), height: tape.height ?? null, pool: tape.pool ?? null, ticks: tape.ticks || [] }
      : null,
    actors: orders
      ? {
          veil: orders.veil,
          vai: orders.vai,
          meshVeil: orders.meshVeil,
          animaVeil: orders.animaVeil,
          zer0Veil: orders.zer0Veil,
        }
      : null,
    note: "Mirrored from loopback. Not a public L1.",
  }
  const tok = await token()
  const res = await fetch(`https://api.github.com/gists/${GIST}`, {
    method: "PATCH",
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${tok}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      files: { "veil-local-snapshot.json": { content: JSON.stringify(snap, null, 2) + "\n" } },
    }),
  })
  if (!res.ok) throw new Error(`gist PATCH ${res.status} ${await res.text()}`)
  console.log(`snapshot ht=${snap.height} books=${snap.markets} pool=${snap.tape?.pool?.reserve0}/${snap.tape?.pool?.reserve1}`)
}

await once()
if (WATCH) {
  setInterval(() => {
    once().catch((err) => console.error(err instanceof Error ? err.message : err))
  }, 15000)
}
