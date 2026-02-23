'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { StatusBadge } from './StatusBadge'
import { VoteBar } from './VoteBar'
import { AddressAvatar, truncateAddress } from './WalletGate'
import type { Proposal } from '../lib/governance-api'

function timeRemaining(endsAt: string): string {
  const end = new Date(endsAt).getTime()
  const now = Date.now()
  if (now >= end) {
    const d = new Date(endsAt)
    return `Ended ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
  }
  const diff = end - now
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  if (days > 0) return `${days}d ${hours}h remaining`
  const mins = Math.floor((diff % 3600000) / 60000)
  return hours > 0 ? `${hours}h ${mins}m remaining` : `${mins}m remaining`
}

export function ProposalCard({ proposal, index }: { proposal: Proposal; index: number }) {
  const votesFor = proposal.votes_for || 0
  const votesAgainst = proposal.votes_against || 0
  const votesAbstain = proposal.votes_abstain || 0
  const total = votesFor + votesAgainst + votesAbstain

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/app/gov/${proposal.id}`}>
        <div className="group p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-emerald-500/20 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="text-white font-medium group-hover:text-emerald-400 transition-colors line-clamp-2">
              {proposal.title}
            </h3>
            <StatusBadge status={proposal.status} />
          </div>

          <div className="flex items-center gap-2 mb-4 text-xs text-white/30">
            <AddressAvatar address={proposal.author_address} />
            <span className="font-mono">{truncateAddress(proposal.author_address)}</span>
            <span>·</span>
            <span>{timeRemaining(proposal.voting_ends_at)}</span>
          </div>

          <VoteBar votesFor={votesFor} votesAgainst={votesAgainst} votesAbstain={votesAbstain} compact />

          <div className="flex items-center gap-4 mt-3 text-xs text-white/30">
            <span>{total} vote{total !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function ProposalCardSkeleton() {
  return (
    <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="h-5 bg-white/5 rounded w-2/3" />
        <div className="h-5 bg-white/5 rounded w-16" />
      </div>
      <div className="flex gap-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-white/5" />
        <div className="h-4 bg-white/5 rounded w-24" />
      </div>
      <div className="h-1.5 bg-white/5 rounded-full w-full" />
    </div>
  )
}
