import { createHash } from "crypto"
import { decodeAction } from "./actions"
import { CanotoReader, WIRE_I64, WIRE_LEN, WIRE_VARINT, bytesToHex, hexToBytes } from "./canoto"
import { encodeCb58 } from "./cb58"
import type { DecodedBlock, DecodedTx, TxResult, Units } from "./types"

const ZERO_UNITS: Units = { bandwidth: 0, compute: 0, storageRead: 0, storageAllocate: 0, storageWrite: 0 }

function sha256(b: Uint8Array): Uint8Array {
  return new Uint8Array(createHash("sha256").update(b).digest())
}

function idCb58(b: Uint8Array): string {
  if (b.length !== 32) return bytesToHex(b)
  return encodeCb58(b)
}

function walk(buf: Uint8Array): Map<number, { wire: number; bytes: Uint8Array; num: number; repeats: { wire: number; bytes: Uint8Array; num: number }[] }> {
  const r = new CanotoReader(buf)
  const map = new Map<number, { wire: number; bytes: Uint8Array; num: number; repeats: { wire: number; bytes: Uint8Array; num: number }[] }>()
  while (r.has()) {
    const { field, wire } = r.tag()
    let bytes = new Uint8Array(0)
    let num = 0
    const start = r.i
    if (wire === WIRE_LEN) {
      bytes = r.bytes()
    } else if (wire === WIRE_I64) {
      num = r.fint64()
      bytes = r.buf.subarray(start, r.i)
    } else if (wire === WIRE_VARINT) {
      num = r.varint()
    } else {
      r.skip(wire)
      continue
    }
    const prev = map.get(field)
    if (prev) {
      prev.repeats.push({ wire, bytes, num })
    } else {
      map.set(field, { wire, bytes, num, repeats: [{ wire, bytes, num }] })
    }
  }
  return map
}

function unitsFromBytes(b: Uint8Array): Units {
  const r = new CanotoReader(b)
  const vals: number[] = []
  if (b.length === 40) {
    for (let i = 0; i < 5; i++) vals.push(r.fint64())
  } else {
    const inner = walk(b)
    for (const [_, v] of inner) {
      if (v.wire === WIRE_I64) vals.push(...v.repeats.map((x) => x.num))
      else if (v.bytes.length >= 40) {
        const rr = new CanotoReader(v.bytes)
        for (let i = 0; i < 5 && rr.remaining() >= 8; i++) vals.push(rr.fint64())
      }
    }
  }
  return {
    bandwidth: vals[0] || 0,
    compute: vals[1] || 0,
    storageRead: vals[2] || 0,
    storageAllocate: vals[3] || 0,
    storageWrite: vals[4] || 0,
  }
}

function unzigzag(n: number): number {
  const neg = n % 2 === 1
  const half = Math.floor(n / 2)
  return neg ? -half - 1 : half
}

function decodeBase(buf: Uint8Array): { timestamp: number; chainId: string; maxFee: number } {
  const f = walk(buf)
  const chainBytes = f.get(2)?.bytes || new Uint8Array()
  return {
    timestamp: unzigzag(f.get(1)?.num || 0),
    chainId: chainBytes.length === 32 ? idCb58(chainBytes) : "",
    maxFee: f.get(3)?.num || 0,
  }
}

function decodeResult(buf: Uint8Array): TxResult {
  const f = walk(buf)
  const errBytes = f.get(2)?.bytes
  return {
    success: Boolean(f.get(1)?.num),
    error: errBytes && errBytes.length ? new TextDecoder().decode(errBytes) : "",
    fee: f.get(5)?.num || 0,
    units: f.get(4)?.bytes ? unitsFromBytes(f.get(4)!.bytes) : null,
  }
}

function actorFromAuth(auth: Uint8Array): string {
  if (auth.length < 33) return ""
  const typeId = auth[0]
  const pk = auth.subarray(1, 33)
  const id = sha256(pk)
  const addr = new Uint8Array(33)
  addr[0] = typeId
  addr.set(id, 1)
  return bytesToHex(addr)
}

function routeFromActions(actions: ReturnType<typeof decodeAction>[]): { to: string; value: string; method: string } {
  const first = actions[0]
  if (!first) return { to: "", value: "", method: "—" }
  if (first.name === "SwapExactIn") {
    return {
      to: "VEIL/VAI Pool",
      value: `${first.fields.amountIn ?? ""} ${first.fields.assetIn ?? ""}`.trim(),
      method: first.name,
    }
  }
  if (first.name === "AddLiquidity" || first.name === "RemoveLiquidity" || first.name === "CreatePool") {
    return { to: "VEIL/VAI Pool", value: "", method: first.name }
  }
  if (first.name === "Transfer") {
    return { to: String(first.fields.to || ""), value: `${first.fields.value ?? ""} VEIL`, method: first.name }
  }
  if (first.name === "MintVAI" || first.name === "BurnVAI") {
    return { to: "VAI", value: String(first.fields.amount ?? ""), method: first.name }
  }
  return { to: "", value: "", method: first.name }
}

export function decodeTxBytes(raw: Uint8Array, result: TxResult | null = null, blockHeight: number | null = null): DecodedTx {
  const f = walk(raw)
  const base = decodeBase(f.get(1)?.bytes || new Uint8Array())
  const actionMsgs = f.get(2)?.repeats.map((x) => x.bytes) || []
  const auth = f.get(3)?.bytes || new Uint8Array()
  const idHash = sha256(raw)
  const actions = actionMsgs.map(decodeAction)
  const route = routeFromActions(actions)
  return {
    id: idCb58(idHash),
    idHex: bytesToHex(idHash),
    timestamp: base.timestamp,
    maxFee: base.maxFee,
    chainId: base.chainId,
    actions,
    authHex: bytesToHex(auth),
    from: actorFromAuth(auth),
    to: route.to,
    method: route.method,
    value: route.value,
    blockHeight,
    result,
    size: raw.length,
  }
}

export function decodeExecutedBlock(blockBytesHex: string, jsonHint?: {
  height?: number
  parent?: string
  timestamp?: number
  stateRoot?: string
  blockContext?: { pChainHeight?: number }
}): DecodedBlock {
  const raw = hexToBytes(blockBytesHex)
  const top = walk(raw)
  const blockMsg = top.get(1)?.bytes || new Uint8Array()
  const resultsMsg = top.get(2)?.bytes || new Uint8Array()
  const bf = walk(blockMsg)
  const parentBytes = bf.get(1)?.bytes || new Uint8Array()
  const ts = bf.get(2)?.num || jsonHint?.timestamp || 0
  const height = bf.get(3)?.num || jsonHint?.height || 0
  const ctxMsg = bf.get(4)?.bytes
  const pChain = ctxMsg ? walk(ctxMsg).get(1)?.num ?? null : jsonHint?.blockContext?.pChainHeight ?? null
  const txMsgs = bf.get(5)?.repeats.map((x) => x.bytes) || []
  const stateBytes = bf.get(6)?.bytes || new Uint8Array()

  const rf = walk(resultsMsg)
  const resultMsgs = rf.get(1)?.repeats.map((x) => x.bytes) || []
  const unitPrices = rf.get(2)?.bytes ? unitsFromBytes(rf.get(2)!.bytes) : ZERO_UNITS
  const units = rf.get(3)?.bytes ? unitsFromBytes(rf.get(3)!.bytes) : ZERO_UNITS

  const txs = txMsgs.map((bytes, i) =>
    decodeTxBytes(bytes, resultMsgs[i] ? decodeResult(resultMsgs[i]) : null, height),
  )
  const blockId = idCb58(sha256(blockMsg))

  return {
    height,
    parent: parentBytes.length === 32 ? idCb58(parentBytes) : jsonHint?.parent || "",
    parentHex: parentBytes.length ? bytesToHex(parentBytes) : "",
    blockId,
    timestamp: ts,
    stateRoot: stateBytes.length === 32 ? idCb58(stateBytes) : jsonHint?.stateRoot || "",
    pChainHeight: pChain,
    txCount: txs.length,
    txs,
    units,
    unitPrices,
    size: raw.length,
    chainId: txs[0]?.chainId || "",
  }
}

export function decodeTxHex(hex: string, result: TxResult | null = null, blockHeight: number | null = null): DecodedTx {
  return decodeTxBytes(hexToBytes(hex), result, blockHeight)
}
