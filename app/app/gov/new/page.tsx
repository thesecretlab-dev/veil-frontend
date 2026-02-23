'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

const WalletGate = dynamic(
  () => import('../components/WalletGate').then((mod) => mod.WalletGate),
  { ssr: false },
)
const ConnectWalletButton = dynamic(
  () => import('../components/WalletGate').then((mod) => mod.ConnectWalletButton),
  { ssr: false },
)
const ProposalForm = dynamic(
  () => import('../components/ProposalForm').then((mod) => mod.ProposalForm),
  { ssr: false },
)

export default function NewProposalPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] relative">
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")' }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <Link href="/app/gov" className="text-sm text-white/30 hover:text-white/50 transition-colors">
              ← Back to Governance
            </Link>
            <ConnectWalletButton />
          </div>

          <WalletGate>
            <ProposalForm />
          </WalletGate>
        </motion.div>
      </div>
    </div>
  )
}
