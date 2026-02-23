'use client'

import { useState } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { motion, AnimatePresence } from 'framer-motion'
import { VoteBar } from './VoteBar'
import { castVote, type Proposal } from '../lib/governance-api'
import { createSignMessage } from '../lib/wallet-verify'

type VoteType = 'for' | 'against' | 'abstain'

const voteConfig: Record<VoteType, { label: string; color: string; hoverBg: string }> = {
  for: { label: 'For', color: 'text-emerald-400', hoverBg: 'hover:bg-emerald-500/20 hover:border-emerald-500/40' },
  against: { label: 'Against', color: 'text-red-400', hoverBg: 'hover:bg-red-500/20 hover:border-red-500/40' },
  abstain: { label: 'Abstain', color: 'text-white/50', hoverBg: 'hover:bg-white/10 hover:border-white/20' },
}

export function VotePanel({ proposal, userVote, onVoted }: {
  proposal: Proposal
  userVote?: string | null
  onVoted: () => void
}) {
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const [voting, setVoting] = useState(false)
  const [selectedVote, setSelectedVote] = useState<VoteType | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isActive = proposal.status === 'active' && new Date(proposal.voting_ends_at) > new Date()
  const votesFor = proposal.votes_for || 0
  const votesAgainst = proposal.votes_against || 0
  const votesAbstain = proposal.votes_abstain || 0

  async function handleVote(voteType: VoteType) {
    if (!address || !isConnected) return
    setSelectedVote(voteType)
    setVoting(true)
    setError(null)

    try {
      const message = createSignMessage(`vote:${voteType}:${proposal.id}`)
      const signature = await signMessageAsync({ message })
      await castVote(proposal.id, { vote_type: voteType, address, message, signature })
      onVoted()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to cast vote')
    } finally {
      setVoting(false)
      setSelectedVote(null)
    }
  }

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-5">
      <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">Votes</h3>

      <VoteBar votesFor={votesFor} votesAgainst={votesAgainst} votesAbstain={votesAbstain} />

      {isActive && isConnected && !userVote && (
        <div className="space-y-3">
          <p className="text-sm text-white/40">Cast your vote</p>
          <div className="flex gap-2">
            {(Object.keys(voteConfig) as VoteType[]).map((type) => (
              <button
                key={type}
                onClick={() => handleVote(type)}
                disabled={voting}
                className={`flex-1 py-2.5 px-3 rounded-lg border border-white/10 text-sm font-medium transition-all ${voteConfig[type].color} ${voteConfig[type].hoverBg} disabled:opacity-50`}
              >
                {voting && selectedVote === type ? (
                  <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  voteConfig[type].label
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {userVote && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-white/40"
        >
          You voted <span className={voteConfig[userVote as VoteType]?.color || 'text-white/60'}>{voteConfig[userVote as VoteType]?.label || userVote}</span>
        </motion.p>
      )}

      {!isActive && (
        <p className="text-sm text-white/30">Voting has ended.</p>
      )}

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
