import { bytesToHex, readU64BE } from "./canoto"

export const ACTION_TABLE: Record<number, { name: string; domain: string }> = {
  0: { name: "Transfer", domain: "transfer" },
  1: { name: "CreateMarket", domain: "markets" },
  2: { name: "CommitOrder", domain: "markets" },
  3: { name: "RevealBatch", domain: "markets" },
  4: { name: "ClearBatch", domain: "markets" },
  5: { name: "ResolveMarket", domain: "markets" },
  6: { name: "Dispute", domain: "markets" },
  7: { name: "RouteFees", domain: "fees" },
  8: { name: "ReleaseCOLTranche", domain: "fees" },
  9: { name: "MintVAI", domain: "stable" },
  10: { name: "BurnVAI", domain: "stable" },
  11: { name: "CreatePool", domain: "amm" },
  12: { name: "AddLiquidity", domain: "amm" },
  13: { name: "RemoveLiquidity", domain: "amm" },
  14: { name: "SwapExactIn", domain: "amm" },
  15: { name: "UpdateReserveState", domain: "risk" },
  16: { name: "SetRiskParams", domain: "risk" },
  17: { name: "SubmitBatchProof", domain: "zk" },
  18: { name: "SetProofConfig", domain: "zk" },
}

export const ASSET: Record<number, string> = {
  0: "VEIL",
  1: "VAI",
}

export type DecodedAction = {
  typeId: number
  name: string
  domain: string
  summary: string
  fields: Record<string, string | number>
  raw: string
}

function assetName(id: number): string {
  return ASSET[id] || `asset${id}`
}

export function decodeAction(raw: Uint8Array): DecodedAction {
  const typeId = raw.length ? raw[0] : -1
  const meta = ACTION_TABLE[typeId] || { name: `Action ${typeId}`, domain: "unknown" }
  const fields: Record<string, string | number> = { typeId }
  let summary = meta.name
  const body = raw.subarray(1)

  try {
    if (typeId === 14 && body.length >= 18) {
      const assetIn = body[0]
      const assetOut = body[1]
      const amountIn = readU64BE(body, 2)
      const minOut = readU64BE(body, 10)
      fields.assetIn = assetName(assetIn)
      fields.assetOut = assetName(assetOut)
      fields.amountIn = amountIn
      fields.minAmountOut = minOut
      summary = `Swap ${amountIn} ${assetName(assetIn)} -> ${assetName(assetOut)}`
    } else if (typeId === 12 && body.length >= 19) {
      const a0 = body[0]
      const a1 = body[1]
      const amount0 = readU64BE(body, 2)
      const amount1 = readU64BE(body, 10)
      fields.asset0 = assetName(a0)
      fields.asset1 = assetName(a1)
      fields.amount0 = amount0
      fields.amount1 = amount1
      summary = `Add LP ${amount0} ${assetName(a0)} + ${amount1} ${assetName(a1)}`
    } else if (typeId === 9 && body.length >= 8) {
      const amount = readU64BE(body, body.length >= 41 ? 33 : 0)
      fields.amount = amount
      summary = `Mint ${amount} VAI`
    } else if (typeId === 10 && body.length >= 8) {
      const amount = readU64BE(body, 0)
      fields.amount = amount
      summary = `Burn ${amount} VAI`
    } else if (typeId === 0 && body.length >= 41) {
      fields.to = bytesToHex(body.subarray(0, 33))
      fields.value = readU64BE(body, 33)
      summary = `Transfer ${fields.value} VEIL`
    } else if (typeId === 7) {
      summary = "Route fees"
    } else if (typeId === 17) {
      summary = "Submit Groth16 batch proof"
    } else if (typeId === 4) {
      summary = "Clear batch"
    } else if (typeId === 1) {
      summary = "Create market"
    }
  } catch {
    /* keep type name */
  }

  return {
    typeId,
    name: meta.name,
    domain: meta.domain,
    summary,
    fields,
    raw: bytesToHex(raw),
  }
}
