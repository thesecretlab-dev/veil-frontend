export function polygonRouteMessage(input: {
  marketId: string
  side: string
  outcome: string
  amountUsd: number
  wallet: string
  nonce: string
  feeBps: number
}): string {
  return [
    "VEIL polygon route v1",
    "venue:polymarket",
    `feeBps:${input.feeBps}`,
    `market:${input.marketId}`,
    `side:${input.side.toLowerCase()}`,
    `outcome:${input.outcome.toLowerCase()}`,
    `amountUsd:${input.amountUsd.toFixed(8)}`,
    `wallet:${input.wallet.toLowerCase()}`,
    `nonce:${input.nonce.toLowerCase()}`,
  ].join("\n")
}
