import { http, createConfig } from 'wagmi'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'
import { defineChain } from 'viem'

/** Companion EVM rails (local anvil). HyperSDK app-id 22207 is not an EVM chain. */
export const veilCompanion = defineChain({
  id: 31337,
  name: 'VEIL companion (local)',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_COMPANION_RPC_URL || 'http://127.0.0.1:3000/api/mesh/v1/evm'],
    },
  },
})

/** @deprecated Use veilCompanion. Kept so existing imports compile. */
export const veil2 = veilCompanion

export const wagmiConfig = createConfig({
  chains: [veilCompanion],
  connectors: [
    injected({ target: 'metaMask' }),
    injected({ target: { id: 'phantom', name: 'Phantom', provider: (window: any) => (window as any)?.phantom?.ethereum } }),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'PLACEHOLDER' }),
    coinbaseWallet({ appName: 'VEIL Governance' }),
    injected({ target: { id: 'veil-wallet', name: 'VEIL Wallet', provider: (window: any) => (window as any)?.veilWallet } }),
  ],
  transports: {
    [veilCompanion.id]: http(),
  },
})
