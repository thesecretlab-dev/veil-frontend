"use client"

export function nativeOrderMessage(input: {
  chainId: string
  marketId: string
  side: string
  outcome: string
  amountUsd: number
  wallet: string
  nonce: string
}): string {
  return [
    "VEIL native order v1",
    `chain:${input.chainId}`,
    `market:${input.marketId}`,
    `side:${input.side.toLowerCase()}`,
    `outcome:${input.outcome.toLowerCase()}`,
    `amountUsd:${input.amountUsd.toFixed(8)}`,
    `wallet:${input.wallet.toLowerCase()}`,
    `nonce:${input.nonce.toLowerCase()}`,
  ].join("\n")
}

export function randomWalletNonce(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return `0x${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}`
}

export async function personalSign(message: string, address: string): Promise<string> {
  const ethereum = window.ethereum
  if (!ethereum?.request) {
    throw new Error("Connect a wallet to sign the order")
  }
  try {
    return (await ethereum.request({ method: "personal_sign", params: [message, address] })) as string
  } catch {
    return (await ethereum.request({ method: "personal_sign", params: [address, message] })) as string
  }
}

export async function connectedWallet(): Promise<string> {
  const ethereum = window.ethereum
  if (!ethereum?.request) {
    throw new Error("Connect a wallet to sign the order")
  }
  const accounts = (await ethereum.request({ method: "eth_requestAccounts" })) as string[]
  const addr = Array.isArray(accounts) ? accounts[0] : ""
  if (!addr) {
    throw new Error("Wallet returned no address")
  }
  return addr.toLowerCase()
}
