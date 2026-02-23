'use client'

import { motion } from 'framer-motion'

interface VoteBarProps {
  votesFor: number
  votesAgainst: number
  votesAbstain: number
  compact?: boolean
}

export function VoteBar({ votesFor, votesAgainst, votesAbstain, compact }: VoteBarProps) {
  const total = votesFor + votesAgainst + votesAbstain
  const pctFor = total > 0 ? (votesFor / total) * 100 : 0
  const pctAgainst = total > 0 ? (votesAgainst / total) * 100 : 0
  const pctAbstain = total > 0 ? (votesAbstain / total) * 100 : 0

  if (total === 0) {
    return (
      <div className={compact ? '' : 'space-y-2'}>
        <div className={`w-full ${compact ? 'h-1.5' : 'h-2'} rounded-full bg-white/5`} />
        {!compact && <p className="text-xs text-white/30">No votes yet</p>}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className={`w-full ${compact ? 'h-1.5' : 'h-2.5'} rounded-full bg-white/5 flex overflow-hidden`}>
        <motion.div
          className="bg-emerald-500 rounded-l-full"
          initial={{ width: 0 }}
          animate={{ width: `${pctFor}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <motion.div
          className="bg-red-500"
          initial={{ width: 0 }}
          animate={{ width: `${pctAgainst}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        />
        <motion.div
          className="bg-white/20 rounded-r-full"
          initial={{ width: 0 }}
          animate={{ width: `${pctAbstain}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
      {!compact && (
        <div className="flex justify-between text-xs text-white/50">
          <span className="text-emerald-400">For {votesFor} ({pctFor.toFixed(0)}%)</span>
          <span className="text-red-400">Against {votesAgainst} ({pctAgainst.toFixed(0)}%)</span>
          <span className="text-white/40">Abstain {votesAbstain} ({pctAbstain.toFixed(0)}%)</span>
        </div>
      )}
    </div>
  )
}
