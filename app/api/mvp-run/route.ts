import { spawn, type ChildProcessByStdio } from "node:child_process"
import { promises as fs } from "node:fs"
import os from "node:os"
import path from "node:path"
import type { Readable } from "node:stream"

import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const DEFAULT_AUTOMATON_DIR = "C:/Users/Josh/Desktop/veil-automaton"
const RUNNER_STATE_PATH = path.join(process.cwd(), "public", "maiev", "mvp-runner-state.json")
const LATEST_MVP_RUN_PATH = path.join(process.cwd(), "public", "maiev", "mvp-run-latest.json")
const MAX_TAIL_LINES = 100

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

type StartRunPayload = {
  paymentTxHash?: string
  paymentTo?: string
  provisionMode?: "auto" | "fresh" | "reuse"
  minAvax?: number
  targetUsd?: number
  usdPerAvax?: number
  operatorAddress?: string
  veilRpcUrlLocal?: string
  veilRpcUrlRemote?: string
}

let currentProcess: ChildProcessByStdio<null, Readable, Readable> | null = null
let currentState: RunnerState = {
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
  return /^0x[a-fA-F0-9]{64}$/u.test(value)
}

function isAddress(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/u.test(value)
}

function normalizeUrl(raw: string, field: string): string {
  const trimmed = raw.trim()
  if (!trimmed) {
    throw new Error(`Invalid ${field}: empty`)
  }
  if (/['"`;$|&<>]/u.test(trimmed)) {
    throw new Error(`Invalid ${field}: contains forbidden characters`)
  }
  let parsed: URL
  try {
    parsed = new URL(trimmed)
  } catch {
    throw new Error(`Invalid ${field}: expected absolute URL`)
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(`Invalid ${field}: protocol must be http/https`)
  }
  return parsed.toString().replace(/\/+$/u, "")
}

function tailLines(existing: string[], chunk: string): string[] {
  const lines = chunk
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean)
  if (lines.length === 0) return existing
  return [...existing, ...lines].slice(-MAX_TAIL_LINES)
}

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8")
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

async function writeRunnerState(next: RunnerState): Promise<void> {
  currentState = {
    ...next,
    updatedAt: new Date().toISOString(),
  }
  await fs.mkdir(path.dirname(RUNNER_STATE_PATH), { recursive: true })
  await fs.writeFile(RUNNER_STATE_PATH, JSON.stringify(currentState, null, 2), "utf8")
}

function parseEnvLine(line: string): [string, string] | null {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith("#")) return null
  const idx = trimmed.indexOf("=")
  if (idx <= 0) return null
  const key = trimmed.slice(0, idx).trim()
  const value = trimmed.slice(idx + 1).trim()
  return [key, value]
}

async function loadConwayApiKey(): Promise<string | null> {
  const envKey = process.env.BUILD_GAMES_CONWAY_API_KEY || process.env.CONWAY_API_KEY
  if (envKey && envKey.trim()) {
    return envKey.trim()
  }

  const homeDir = os.homedir()
  const configPath = path.join(homeDir, ".conway", "config.json")
  const config = await readJsonFile<{ apiKey?: string }>(configPath)
  if (config?.apiKey && config.apiKey.trim()) {
    return config.apiKey.trim()
  }

  const veilSecretsPath = path.join(homeDir, ".veil-secrets", "conway", "active.env")
  try {
    const raw = await fs.readFile(veilSecretsPath, "utf8")
    for (const line of raw.split(/\r?\n/u)) {
      const kv = parseEnvLine(line)
      if (!kv) continue
      if (kv[0] === "CONWAY_API_KEY" && kv[1]) {
        return kv[1]
      }
    }
  } catch {
    return null
  }

  return null
}

function extractArtifactPath(logs: string[]): string | null {
  for (let i = logs.length - 1; i >= 0; i -= 1) {
    const line = logs[i]
    const match = line.match(/artifact:\s*(.+)$/iu)
    if (match?.[1]) {
      return match[1].trim()
    }
  }
  return null
}

function parsePayload(body: StartRunPayload): {
  paymentTxHash: string
  paymentTo?: string
  provisionMode?: "auto" | "fresh" | "reuse"
  minAvax?: string
  targetUsd?: string
  usdPerAvax?: string
  operatorAddress?: string
  veilRpcUrlLocal?: string
  veilRpcUrlRemote?: string
} {
  const tx = body.paymentTxHash?.trim()
  if (!tx || !isTxHash(tx)) {
    throw new Error("paymentTxHash must be a 0x-prefixed 32-byte hash")
  }

  const parsed: {
    paymentTxHash: string
    paymentTo?: string
    provisionMode?: "auto" | "fresh" | "reuse"
    minAvax?: string
    targetUsd?: string
    usdPerAvax?: string
    operatorAddress?: string
    veilRpcUrlLocal?: string
    veilRpcUrlRemote?: string
  } = {
    paymentTxHash: tx,
  }

  if (body.paymentTo) {
    const addr = body.paymentTo.trim()
    if (!isAddress(addr)) throw new Error("paymentTo must be a valid 0x address")
    parsed.paymentTo = addr
  }
  if (body.operatorAddress) {
    const addr = body.operatorAddress.trim()
    if (!isAddress(addr)) throw new Error("operatorAddress must be a valid 0x address")
    parsed.operatorAddress = addr
  }
  if (body.provisionMode !== undefined) {
    const mode = String(body.provisionMode).trim().toLowerCase()
    if (mode !== "auto" && mode !== "fresh" && mode !== "reuse") {
      throw new Error("provisionMode must be one of auto|fresh|reuse")
    }
    parsed.provisionMode = mode as "auto" | "fresh" | "reuse"
  }

  const maybePositive = (value: unknown, label: string): string | undefined => {
    if (value === undefined || value === null) return undefined
    const num = Number(value)
    if (!Number.isFinite(num) || num <= 0) {
      throw new Error(`${label} must be a positive number`)
    }
    return String(num)
  }

  parsed.minAvax = maybePositive(body.minAvax, "minAvax")
  parsed.targetUsd = maybePositive(body.targetUsd, "targetUsd")
  parsed.usdPerAvax = maybePositive(body.usdPerAvax, "usdPerAvax")

  if (body.veilRpcUrlLocal) {
    parsed.veilRpcUrlLocal = normalizeUrl(body.veilRpcUrlLocal, "veilRpcUrlLocal")
  }
  if (body.veilRpcUrlRemote) {
    parsed.veilRpcUrlRemote = normalizeUrl(body.veilRpcUrlRemote, "veilRpcUrlRemote")
  }

  return parsed
}

async function getState(): Promise<RunnerState> {
  if (currentProcess) return currentState
  const disk = await readJsonFile<RunnerState>(RUNNER_STATE_PATH)
  if (disk) {
    currentState = disk
  }
  return currentState
}

export async function GET() {
  const [runner, latestRun] = await Promise.all([
    getState(),
    readJsonFile<MvpRunArtifact>(LATEST_MVP_RUN_PATH),
  ])

  return NextResponse.json({
    runner,
    latestRun,
  })
}

export async function POST(request: NextRequest) {
  if (currentProcess) {
    return NextResponse.json(
      {
        error: "MVP runner is already active",
        runner: currentState,
      },
      { status: 409 },
    )
  }

  let payload: StartRunPayload
  try {
    payload = (await request.json()) as StartRunPayload
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  let parsed: ReturnType<typeof parsePayload>
  try {
    parsed = parsePayload(payload)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid payload" },
      { status: 400 },
    )
  }

  const automatonDir = process.env.VEIL_AUTOMATON_DIR || DEFAULT_AUTOMATON_DIR
  const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm"
  const args = ["mvp:build-games", "--", "--payment-tx", parsed.paymentTxHash]
  const provisionMode = parsed.provisionMode || "fresh"

  if (parsed.paymentTo) args.push("--payment-to", parsed.paymentTo)
  args.push("--provision-mode", provisionMode)
  if (parsed.minAvax) args.push("--min-avax", parsed.minAvax)
  if (parsed.targetUsd) args.push("--target-usd", parsed.targetUsd)
  if (parsed.usdPerAvax) args.push("--usd-per-avax", parsed.usdPerAvax)
  if (parsed.operatorAddress) args.push("--operator-address", parsed.operatorAddress)
  if (parsed.veilRpcUrlLocal) args.push("--veil-rpc-url-local", parsed.veilRpcUrlLocal)
  if (parsed.veilRpcUrlRemote) args.push("--veil-rpc-url-remote", parsed.veilRpcUrlRemote)

  const runId = `mvp-${Date.now()}`
  await writeRunnerState({
    status: "running",
    runId,
    paymentTxHash: parsed.paymentTxHash,
    startedAt: new Date().toISOString(),
    endedAt: null,
    exitCode: null,
    signal: null,
    error: null,
    artifactPath: null,
    stdoutTail: [],
    stderrTail: [],
    updatedAt: new Date().toISOString(),
  })

  const conwayApiKey = await loadConwayApiKey()
  const childEnv: NodeJS.ProcessEnv = {
    ...process.env,
    BUILD_GAMES_PAYMENT_TX_HASH: parsed.paymentTxHash,
  }
  if (conwayApiKey) {
    childEnv.BUILD_GAMES_CONWAY_API_KEY = conwayApiKey
  }

  try {
    const child = spawn(command, args, {
      cwd: automatonDir,
      env: childEnv,
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    })

    currentProcess = child

    child.stdout.on("data", (chunk: Buffer) => {
      currentState = {
        ...currentState,
        stdoutTail: tailLines(currentState.stdoutTail, chunk.toString("utf8")),
      }
    })

    child.stderr.on("data", (chunk: Buffer) => {
      currentState = {
        ...currentState,
        stderrTail: tailLines(currentState.stderrTail, chunk.toString("utf8")),
      }
    })

    child.on("error", async (error) => {
      currentProcess = null
      await writeRunnerState({
        ...currentState,
        status: "failed",
        endedAt: new Date().toISOString(),
        exitCode: null,
        signal: null,
        error: error.message,
        artifactPath: extractArtifactPath([...currentState.stdoutTail, ...currentState.stderrTail]),
        stdoutTail: currentState.stdoutTail,
        stderrTail: currentState.stderrTail,
      })
    })

    child.on("close", async (code, signal) => {
      currentProcess = null
      const latest = await readJsonFile<MvpRunArtifact>(LATEST_MVP_RUN_PATH)
      const artifactPath =
        latest?.output?.artifactPath ||
        extractArtifactPath([...currentState.stdoutTail, ...currentState.stderrTail])

      const status: RunnerStatus = code === 0 ? "succeeded" : "failed"
      let error: string | null = null
      if (status === "failed") {
        error =
          currentState.stderrTail.at(-1) ||
          currentState.stdoutTail.at(-1) ||
          `Runner exited with code ${code ?? "unknown"}`
      }

      await writeRunnerState({
        ...currentState,
        status,
        endedAt: new Date().toISOString(),
        exitCode: code,
        signal: signal ?? null,
        error,
        artifactPath: artifactPath ?? null,
        stdoutTail: currentState.stdoutTail,
        stderrTail: currentState.stderrTail,
      })
    })
  } catch (error) {
    currentProcess = null
    await writeRunnerState({
      ...currentState,
      status: "failed",
      endedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Failed to start runner",
    })
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to start runner" },
      { status: 500 },
    )
  }

  return NextResponse.json(
    {
      ok: true,
      message: "MVP runner started",
      runner: currentState,
      hasConwayApiKey: Boolean(conwayApiKey),
    },
    { status: 202 },
  )
}
