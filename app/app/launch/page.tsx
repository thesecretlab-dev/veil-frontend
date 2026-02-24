"use client"

import { VeilFooter, VeilHeader } from '@/components/brand'

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { AlertTriangle, ArrowLeft, CheckCircle2, Loader2, Play, RefreshCw } from "lucide-react"

type RunnerStatus = "idle" | "running" | "succeeded" | "failed"

type RunnerState = {
  status: RunnerStatus
  runId: string | null
  paymentTxHash: string | null
  startedAt: string | null
  endedAt: string | null
  exitCode: number | null
  signal: string | null
  error: string | null
  artifactPath: string | null
  stdoutTail: string[]
  stderrTail: string[]
  updatedAt: string
}

type MvpRunStep = {
  id?: string
  name?: string
  status?: string
  durationMs?: number
  error?: string | null
}

type UserFlowState = "pending" | "running" | "passed" | "failed"

type MvpRunArtifact = {
  meta?: {
    passed?: boolean
    strictPassed?: boolean
    continuityPassed?: boolean
    provisionedFresh?: boolean
    provisioningModeRequested?: "auto" | "fresh" | "reuse"
    provisioningModeExecuted?: "fresh" | "reuse" | null
    outcome?: "strict-pass" | "continuity-pass" | "failed"
    startedAt?: string
    endedAt?: string
    totalDurationMs?: number
    targetMinutes?: number
  }
  output?: {
    artifactPath?: string
  }
  steps?: MvpRunStep[]
}

type RunnerApiResponse = {
  runner: RunnerState
  latestRun: MvpRunArtifact | null
}

const DEFAULT_STATE: RunnerState = {
  status: "idle",
  runId: null,
  paymentTxHash: null,
  startedAt: null,
  endedAt: null,
  exitCode: null,
  signal: null,
  error: null,
  artifactPath: null,
  stdoutTail: [],
  stderrTail: [],
  updatedAt: new Date().toISOString(),
}

function isTxHash(value: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/u.test(value.trim())
}

function StatusBadge({ status }: { status: RunnerStatus }) {
  const map: Record<RunnerStatus, { label: string; className: string }> = {
    idle: { label: "Idle", className: "border-white/20 bg-white/5 text-white/70" },
    running: { label: "Running", className: "border-amber-400/30 bg-amber-500/10 text-amber-200" },
    succeeded: { label: "Succeeded", className: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200" },
    failed: { label: "Failed", className: "border-red-400/30 bg-red-500/10 text-red-200" },
  }
  const item = map[status]
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs uppercase tracking-[0.14em] ${item.className}`}>
      {item.label}
    </span>
  )
}

function StepBadge({ status }: { status: string | undefined }) {
  if (status === "passed") {
    return <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-emerald-200">Passed</span>
  }
  if (status === "failed") {
    return <span className="rounded-full border border-red-400/30 bg-red-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-red-200">Failed</span>
  }
  return <span className="rounded-full border border-white/20 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-white/60">Pending</span>
}

function UserFlowBadge({ status }: { status: UserFlowState }) {
  if (status === "passed") {
    return (
      <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-emerald-200">
        Passed
      </span>
    )
  }
  if (status === "failed") {
    return (
      <span className="rounded-full border border-red-400/30 bg-red-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-red-200">
        Failed
      </span>
    )
  }
  if (status === "running") {
    return (
      <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-amber-200">
        Running
      </span>
    )
  }
  return (
    <span className="rounded-full border border-white/20 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-white/60">
      Pending
    </span>
  )
}

const USER_FLOW_STAGES = [
  {
    id: "M1_PAYMENT",
    title: "Payment Verification",
    detail: "Confirm inbound AVAX payment against minimum and target value.",
  },
  {
    id: "M2_PROVISION",
    title: "Cloud Provisioning",
    detail: "Create a fresh cloud server for this run and return sandbox details.",
  },
  {
    id: "M3_CODEX_ACCESS",
    title: "Codex Access",
    detail: "Bind the launched server to Codex workflow and validate command channel.",
  },
  {
    id: "M4_ANIMA_VALIDATE_VEIL",
    title: "ANIMA + VEIL Validation",
    detail: "Bring ANIMA online and verify VEIL validation/runtime checks.",
  },
  {
    id: "M5_ARTIFACT",
    title: "Evidence + Surface Update",
    detail: "Write run artifact and push latest status to live transparency surfaces.",
  },
] as const

export default function LaunchPage() {
  const [txHash, setTxHash] = useState("")
  const [api, setApi] = useState<RunnerApiResponse>({ runner: DEFAULT_STATE, latestRun: null })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<string | null>(null)

  const refresh = async () => {
    try {
      const response = await fetch("/api/mvp-run", { cache: "no-store" })
      if (!response.ok) {
        throw new Error("Unable to load runner status")
      }
      const payload = (await response.json()) as RunnerApiResponse
      setApi(payload)
      setLastRefresh(new Date().toISOString())
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to refresh runner status")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
    const timer = setInterval(() => void refresh(), 3_000)
    return () => clearInterval(timer)
  }, [])

  const run = async () => {
    const hash = txHash.trim()
    if (!isTxHash(hash)) {
      setError("Enter a valid 0x-prefixed 32-byte tx hash.")
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      const response = await fetch("/api/mvp-run", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          paymentTxHash: hash,
          provisionMode: "fresh",
          minAvax: 0.1,
          targetUsd: 100,
        }),
      })
      const payload = (await response.json()) as Partial<RunnerApiResponse> & { error?: string }
      if (!response.ok) {
        throw new Error(payload.error || `Failed to start run (${response.status})`)
      }
      await refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start run")
    } finally {
      setSubmitting(false)
    }
  }

  const steps = api.latestRun?.steps || []
  const durationMinutes =
    typeof api.latestRun?.meta?.totalDurationMs === "number"
      ? Number((api.latestRun.meta.totalDurationMs / 60_000).toFixed(2))
      : null
  const strictPassed = api.latestRun?.meta?.strictPassed ?? api.latestRun?.meta?.passed ?? null
  const continuityPassed = api.latestRun?.meta?.continuityPassed ?? strictPassed
  const provisionModeSummary = api.latestRun?.meta
    ? `${api.latestRun.meta.provisioningModeRequested || "auto"} -> ${api.latestRun.meta.provisioningModeExecuted || "n/a"}`
    : null

  const runError = useMemo(() => {
    const fromRunner = api.runner.error
    if (fromRunner) return fromRunner
    const failedStep = steps.find((step) => step.status === "failed")
    return failedStep?.error || null
  }, [api.runner.error, steps])

  const userFlowStages = useMemo(() => {
    const byId = new Map<string, MvpRunStep>()
    for (const step of steps) {
      if (step.id) byId.set(step.id, step)
    }

    const firstOpenIndex = USER_FLOW_STAGES.findIndex((stage) => {
      const status = byId.get(stage.id)?.status
      return status !== "passed" && status !== "failed"
    })

    return USER_FLOW_STAGES.map((stage, index) => {
      const step = byId.get(stage.id)
      let state: UserFlowState = "pending"
      if (step?.status === "passed") {
        state = "passed"
      } else if (step?.status === "failed") {
        state = "failed"
      } else if (api.runner.status === "running" && firstOpenIndex === index) {
        state = "running"
      }

      return {
        ...stage,
        state,
        durationMs: step?.durationMs,
        error: step?.error ?? null,
      }
    })
  }, [api.runner.status, steps])

  return (
    <div className="min-h-screen bg-[#050505] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/app/agents" className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to Agents
          </Link>
          <button
            onClick={() => void refresh()}
            className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-white/70 transition hover:border-white/35 hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>

        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/5 p-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-emerald-300/80">Build Games 2026 MVP Runner</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Payment TX -&gt; Server Provision -&gt; VEIL Validation</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/65">
            Submit the AVAX payment tx hash and launch the scripted MVP run. Launch runs default to strict mode (fresh server provision, no sandbox reuse), then write artifacts to MAIEV and update the handshake tracker.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-white/60">End-User Flow (Target: &lt; 20m)</p>
              <p className="mt-1 text-sm text-white/70">
                {api.latestRun?.definition ||
                  "User sends AVAX, receives cloud runtime + Codex access, and ANIMA validates VEIL in one guided flow."}
              </p>
            </div>
            <StatusBadge status={api.runner.status} />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {userFlowStages.map((stage, index) => (
              <div key={stage.id} className="rounded-lg border border-white/10 bg-[#060606]/25 p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-[11px] text-white/65">{String(index + 1).padStart(2, "0")} · {stage.id}</p>
                    <p className="text-sm text-white/90">{stage.title}</p>
                  </div>
                  <UserFlowBadge status={stage.state} />
                </div>
                <p className="text-xs leading-relaxed text-white/60">{stage.detail}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-white/50">
                  <span>Duration: {typeof stage.durationMs === "number" ? `${stage.durationMs}ms` : "-"}</span>
                  {stage.error && <span className="text-red-200/85">Error: {stage.error}</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-white/10 bg-[#060606]/25 p-4 text-xs text-white/60">
            <p className="uppercase tracking-[0.14em] text-white/70">Surface Split</p>
            <p className="mt-1">VeilVM runtime surface: <Link className="text-emerald-200 underline-offset-4 hover:underline" href="/app/network">/app/network</Link> and <Link className="text-emerald-200 underline-offset-4 hover:underline" href="/app/transparency">/app/transparency</Link></p>
            <p className="mt-1">Companion EVM explorer (Blockscout): tracks EVM rails, not VeilVM-native actions.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.14em] text-white/60">Runner Status</p>
            <StatusBadge status={api.runner.status} />
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <div>
              <label className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-white/60">Payment tx hash (Avalanche C-Chain)</label>
              <input
                value={txHash}
                onChange={(event) => setTxHash(event.target.value)}
                placeholder="0x..."
                className="w-full rounded-lg border border-white/15 bg-[#060606]/30 px-3 py-2 font-mono text-xs text-white outline-none transition focus:border-emerald-300/45"
              />
            </div>
            <button
              onClick={run}
              disabled={submitting || api.runner.status === "running"}
              className="inline-flex h-fit items-center gap-2 self-end rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-xs uppercase tracking-[0.14em] text-emerald-200 transition hover:border-emerald-300/55 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting || api.runner.status === "running" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Start Run
            </button>
          </div>

          <div className="mt-4 grid gap-2 text-xs text-white/60 md:grid-cols-2">
            <p>Run ID: <span className="font-mono text-white/80">{api.runner.runId || "none"}</span></p>
            <p>Started: <span className="font-mono text-white/80">{api.runner.startedAt || "-"}</span></p>
            <p>Ended: <span className="font-mono text-white/80">{api.runner.endedAt || "-"}</span></p>
            <p>Updated: <span className="font-mono text-white/80">{lastRefresh || api.runner.updatedAt || "-"}</span></p>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
            {error}
          </div>
        )}

        {runError && (
          <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-100">
            <div className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-amber-200">
              <AlertTriangle className="h-4 w-4" />
              Latest failure
            </div>
            <p className="font-mono text-xs leading-relaxed">{runError}</p>
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <p className="text-xs uppercase tracking-[0.14em] text-white/60">Latest Run Evidence</p>
            {strictPassed === true && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Strict Pass
              </span>
            )}
            {strictPassed !== true && continuityPassed === true && (
              <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-amber-200">
                Continuity Pass
              </span>
            )}
            {strictPassed !== true && continuityPassed !== true && api.latestRun?.meta?.outcome === "failed" && (
              <span className="rounded-full border border-red-400/30 bg-red-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-red-200">
                Failed
              </span>
            )}
          </div>

          <div className="mb-5 grid gap-2 text-xs text-white/65 md:grid-cols-3">
            <p>Duration: <span className="font-mono text-white/80">{durationMinutes !== null ? `${durationMinutes}m` : "-"}</span></p>
            <p>Target: <span className="font-mono text-white/80">{api.latestRun?.meta?.targetMinutes ?? "-"}m</span></p>
            <p>Artifact: <span className="font-mono text-white/80 break-all">{api.latestRun?.output?.artifactPath || api.runner.artifactPath || "-"}</span></p>
            <p>Provision mode: <span className="font-mono text-white/80">{provisionModeSummary || "-"}</span></p>
            <p>Provisioned fresh: <span className="font-mono text-white/80">{api.latestRun?.meta?.provisionedFresh === true ? "yes" : api.latestRun?.meta ? "no" : "-"}</span></p>
            <p>Outcome: <span className="font-mono text-white/80">{api.latestRun?.meta?.outcome || "-"}</span></p>
          </div>

          <div className="space-y-2">
            {steps.length === 0 && (
              <p className="text-sm text-white/45">{loading ? "Loading run data..." : "No run artifacts yet."}</p>
            )}
            {steps.map((step) => (
              <div key={`${step.id}-${step.name}`} className="rounded-lg border border-white/10 bg-[#060606]/20 p-3">
                <div className="mb-1 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-white/90">{step.id || "step"}</p>
                    <p className="text-sm text-white/75">{step.name || "Unnamed step"}</p>
                  </div>
                  <StepBadge status={step.status} />
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-white/50">
                  <span>Duration: {typeof step.durationMs === "number" ? `${step.durationMs}ms` : "-"}</span>
                  {step.error && <span className="text-red-200/85">Error: {step.error}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#060606]/30 p-6">
          <p className="mb-2 text-xs uppercase tracking-[0.14em] text-white/60">Runner Logs (tail)</p>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-[#060606]/50 p-3">
              <p className="mb-2 text-[11px] uppercase tracking-[0.14em] text-emerald-200/70">stdout</p>
              <pre className="max-h-72 overflow-auto whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-white/75">
                {(api.runner.stdoutTail || []).join("\n") || "(empty)"}
              </pre>
            </div>
            <div className="rounded-lg border border-white/10 bg-[#060606]/50 p-3">
              <p className="mb-2 text-[11px] uppercase tracking-[0.14em] text-red-200/70">stderr</p>
              <pre className="max-h-72 overflow-auto whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-white/75">
                {(api.runner.stderrTail || []).join("\n") || "(empty)"}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
