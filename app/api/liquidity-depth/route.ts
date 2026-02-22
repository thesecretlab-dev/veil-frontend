import { promises as fs } from "fs"
import path from "path"

import { NextResponse } from "next/server"

type LiquidityDepthReport = {
  generatedAt?: string
  target?: {
    referenceTradeVai?: number
    targetSlippagePct?: number
    bufferBps?: number
  }
  before?: {
    reserveVai?: number
    impactAtReferencePct?: number
  }
  after?: {
    reserveVai?: number
    impactAtReferencePct?: number
    targetMet?: boolean
  }
  plan?: {
    requiredReserveVaiRaw?: number
    requiredReserveVaiBuffered?: number
    addVai?: number
  }
}

const APY_BASE_PCT = 10
const APY_GROWTH_FLOOR_PCT = 4
const APY_FLOOR_PCT = 8
const APY_CAP_PCT = 34
const APY_GAP_GAIN_PER_1X = 60
const APY_MAX_GAP_BONUS_PCT = 20
const REBASE_EPOCH_SECONDS = 86400

function asNumber(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0
  }
  return value
}

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8")
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

async function readLatestLiquidityDepth(): Promise<LiquidityDepthReport | null> {
  const baseDir = path.join(process.cwd(), "public", "maiev", "liquidity-depth")
  try {
    const entries = await fs.readdir(baseDir, { withFileTypes: true })
    const dirs = entries
      .filter((entry) => entry.isDirectory() && /^liquidity-\d{8}-\d{6}$/i.test(entry.name))
      .map((entry) => entry.name)
      .sort()
      .reverse()

    for (const dirName of dirs) {
      const reportPath = path.join(baseDir, dirName, "liquidity-depth.json")
      const report = await readJsonFile<LiquidityDepthReport>(reportPath)
      if (report) {
        return report
      }
    }
  } catch {
    return null
  }

  return null
}

export const dynamic = "force-dynamic"

export async function GET() {
  const report = await readLatestLiquidityDepth()

  if (!report) {
    return NextResponse.json(
      {
        available: false,
        message: "No liquidity depth report found.",
      },
      { status: 200 },
    )
  }

  const targetReserveVai = Math.max(
    asNumber(report.plan?.requiredReserveVaiBuffered),
    asNumber(report.plan?.requiredReserveVaiRaw),
  )
  const observedReserveVai = Math.max(asNumber(report.after?.reserveVai), asNumber(report.before?.reserveVai))
  const deficitReserveVai = Math.max(0, targetReserveVai - observedReserveVai)
  const gapRatio = targetReserveVai > 0 ? deficitReserveVai / targetReserveVai : 0

  const gapBonusPct = Math.min(APY_MAX_GAP_BONUS_PCT, gapRatio * APY_GAP_GAIN_PER_1X)
  const proposedApyPct = APY_BASE_PCT + APY_GROWTH_FLOOR_PCT + gapBonusPct
  const recommendedApyPct = Math.min(APY_CAP_PCT, Math.max(APY_FLOOR_PCT, proposedApyPct))

  const epochYears = REBASE_EPOCH_SECONDS / (365 * 24 * 60 * 60)
  const recommendedEpochRebasePct = (Math.pow(1 + recommendedApyPct / 100, epochYears) - 1) * 100

  const targetImpactPct = asNumber(report.target?.targetSlippagePct)
  const observedImpactPct = Math.max(asNumber(report.after?.impactAtReferencePct), asNumber(report.before?.impactAtReferencePct))

  return NextResponse.json({
    available: true,
    generatedAt: report.generatedAt || null,
    target: {
      referenceTradeVai: asNumber(report.target?.referenceTradeVai),
      targetSlippagePct: targetImpactPct,
      bufferBps: asNumber(report.target?.bufferBps),
      targetReserveVai,
    },
    observed: {
      reserveVai: observedReserveVai,
      impactAtReferencePct: observedImpactPct,
      targetMet: report.after?.targetMet ?? gapRatio === 0,
    },
    gap: {
      deficitReserveVai,
      ratio: gapRatio,
      pct: gapRatio * 100,
    },
    policy: {
      model: "VEIL-native-growth-controller",
      baseApyPct: APY_BASE_PCT,
      growthFloorPct: APY_GROWTH_FLOOR_PCT,
      gapBonusPct,
      apyFloorPct: APY_FLOOR_PCT,
      apyCapPct: APY_CAP_PCT,
      recommendedApyPct,
      epochSeconds: REBASE_EPOCH_SECONDS,
      recommendedEpochRebasePct,
      formula:
        "apy = clamp(base + growthFloor + min(maxGapBonus, gapRatio * gain), apyFloor, apyCap)",
    },
  })
}
