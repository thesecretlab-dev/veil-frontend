import { verifyMessage } from 'viem'

export async function verifyWalletSignature({
  address,
  message,
  signature,
}: {
  address: string
  message: string
  signature: `0x${string}`
}): Promise<boolean> {
  try {
    const valid = await verifyMessage({
      address: address as `0x${string}`,
      message,
      signature,
    })
    return valid
  } catch {
    return false
  }
}

export function createSignMessage(action: string, nonce?: string): string {
  const ts = Date.now()
  return `VEIL Governance\n\nAction: ${action}\nTimestamp: ${ts}${nonce ? `\nNonce: ${nonce}` : ''}`
}
