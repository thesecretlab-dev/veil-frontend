import type { DecodedAction } from "./actions"

export type Units = {
  bandwidth: number
  compute: number
  storageRead: number
  storageAllocate: number
  storageWrite: number
}

export type TxResult = {
  success: boolean
  error: string
  fee: number
  units: Units | null
}

export type DecodedTx = {
  id: string
  idHex: string
  timestamp: number
  maxFee: number
  chainId: string
  actions: DecodedAction[]
  authHex: string
  from: string
  to: string
  method: string
  value: string
  blockHeight: number | null
  result: TxResult | null
  size: number
}

export type DecodedBlock = {
  height: number
  parent: string
  parentHex: string
  blockId: string
  timestamp: number
  stateRoot: string
  pChainHeight: number | null
  txCount: number
  txs: DecodedTx[]
  units: Units
  unitPrices: Units
  size: number
  chainId: string
}

export type BlockRow = {
  height: number
  parent: string
  blockId: string
  timestamp: number
  txCount: number
  bandwidth: number
  compute: number
  size: number
  actions: string[]
  proposer: string
  gasUsed: number
  gasPct: number
}

export type TxRow = {
  idHex: string
  id: string
  blockHeight: number
  timestamp: number
  method: string
  from: string
  to: string
  value: string
  success: boolean | null
  fee: number
}

export type ExplorerStatus = {
  ok: boolean
  local: true
  height: number | null
  blockId: string | null
  blockTimestamp: number | null
  chainId: string
  appId: number
  node: string
  nodeId: string
  routerOk: boolean
  markets: number
  proverReady: boolean
  pool: {
    asset0: number
    asset1: number
    fee_bips: number
    reserve0: number
    reserve1: number
    total_lp: number
  } | null
  treasury: {
    locked: number
    live: number
    released: number
  } | null
  vai: {
    total_debt: number
    debt_ceiling: number
  } | null
  note: string
}
