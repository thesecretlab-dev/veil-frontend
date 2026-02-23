import { http, createConfig } from 'wagmi'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'
import { defineChain } from 'viem'

export const veil2 = defineChain({
  id: 22207,
  name: 'VEIL2',
  nativeCurrency: { name: 'VEIL', symbol: 'VEIL', decimals: 18 },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_VEIL_RPC_URL || 'http://127.0.0.1:9650/ext/bc/2L5JWLhXnDm8dPyBFMjBuqsbPSytL4bfbGJJj37jk5ri1KdXhd/rpc'],
    },
  },
})

export const wagmiConfig = createConfig({
  chains: [veil2],
  connectors: [
    injected({ target: 'metaMask' }),
    injected({ target: { id: 'phantom', name: 'Phantom', provider: (window: any) => (window as any)?.phantom?.ethereum } }),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'PLACEHOLDER' }),
    coinbaseWallet({ appName: 'VEIL Governance' }),
    injected({ target: { id: 'veil-wallet', name: 'VEIL Wallet', provider: (window: any) => (window as any)?.veilWallet } }),
  ],
  transports: {
    [veil2.id]: http(),
  },
})
