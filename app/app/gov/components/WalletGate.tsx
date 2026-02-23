'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { motion } from 'framer-motion'

function AddressAvatar({ address }: { address: string }) {
  // Deterministic color from address
  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899']
  const idx = parseInt(address.slice(2, 4), 16) % colors.length
  const idx2 = parseInt(address.slice(4, 6), 16) % colors.length
  return (
    <div
      className="w-6 h-6 rounded-full flex-shrink-0"
      style={{
        background: `linear-gradient(135deg, ${colors[idx]}, ${colors[idx2]})`,
      }}
    />
  )
}

export function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function WalletIdentity() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()

  if (!address) return null

  return (
    <div className="flex items-center gap-2">
      <AddressAvatar address={address} />
      <span className="text-sm text-white/70 font-mono">{truncateAddress(address)}</span>
      <button
        onClick={() => disconnect()}
        className="text-xs text-white/30 hover:text-white/60 transition-colors ml-1"
      >
        ✕
      </button>
    </div>
  )
}

export function ConnectWalletButton() {
  const { connectors, connect, isPending } = useConnect()
  const { isConnected } = useAccount()

  if (isConnected) return <WalletIdentity />

  return (
    <div className="relative group">
      <button className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm font-medium hover:bg-emerald-500/30 transition-all">
        {isPending ? 'Connecting...' : 'Connect Wallet'}
      </button>
      <div className="absolute right-0 top-full mt-2 w-56 bg-[#111] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            className="w-full text-left px-3 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            {connector.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export function WalletGate({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const { isConnected } = useAccount()

  if (!isConnected) {
    return fallback ?? (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <svg viewBox="0 0 48 48" className="w-12 h-12 mb-4 text-emerald-500/30">
          <path d="M24 40 L8 12 L40 12 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <h3 className="text-lg font-medium text-white/60 mb-2">Wallet Required</h3>
        <p className="text-sm text-white/30 mb-6 max-w-xs">Connect your wallet to participate in VEIL governance.</p>
        <ConnectWalletButton />
      </motion.div>
    )
  }

  return <>{children}</>
}

export { AddressAvatar }
