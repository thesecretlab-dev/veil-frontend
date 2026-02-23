'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount, useSignMessage } from 'wagmi'
import { motion, AnimatePresence } from 'framer-motion'
import { createProposal } from '../lib/governance-api'
import { createSignMessage } from '../lib/wallet-verify'

export function ProposalForm() {
  const router = useRouter()
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [discussionUrl, setDiscussionUrl] = useState('')
  const [votingDays, setVotingDays] = useState(5)
  const [preview, setPreview] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!address || !title.trim() || !description.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const message = createSignMessage('create-proposal')
      const signature = await signMessageAsync({ message })
      const proposal = await createProposal({
        title: title.trim(),
        description: description.trim(),
        discussion_url: discussionUrl.trim() || undefined,
        voting_days: votingDays,
        address,
        message,
        signature,
      })
      router.push(`/app/gov/${proposal.id}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create proposal')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif text-white">New Proposal</h1>
        <button
          onClick={() => setPreview(!preview)}
          className="text-sm text-white/40 hover:text-white/60 transition-colors"
        >
          {preview ? 'Edit' : 'Preview'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-6"
          >
            <h2 className="text-xl text-white font-medium">{title || 'Untitled'}</h2>
            <div className="text-sm text-white/60 whitespace-pre-wrap">{description || 'No description'}</div>
            {discussionUrl && (
              <a href={discussionUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-400 hover:underline">
                Discussion Link ↗
              </a>
            )}
            <p className="text-xs text-white/30">Voting period: {votingDays} days</p>
          </motion.div>
        ) : (
          <motion.div
            key="edit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="text-sm text-white/40 mb-1.5 block">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Proposal title"
                className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/30"
              />
            </div>

            <div>
              <label className="text-sm text-white/40 mb-1.5 block">Description (Markdown)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your proposal..."
                rows={12}
                className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/30 resize-none font-mono"
              />
            </div>

            <div>
              <label className="text-sm text-white/40 mb-1.5 block">Discussion Link (optional)</label>
              <input
                value={discussionUrl}
                onChange={(e) => setDiscussionUrl(e.target.value)}
                placeholder="https://forum.veil.markets/..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/30"
              />
            </div>

            <div>
              <label className="text-sm text-white/40 mb-1.5 block">Voting Period</label>
              <select
                value={votingDays}
                onChange={(e) => setVotingDays(Number(e.target.value))}
                className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/30 appearance-none"
              >
                <option value={3}>3 days</option>
                <option value={5}>5 days</option>
                <option value={7}>7 days</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3 justify-end">
        <button
          onClick={() => router.push('/app/gov')}
          className="px-4 py-2.5 text-sm text-white/40 hover:text-white/60 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting || !title.trim() || !description.trim()}
          className="px-6 py-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm font-medium hover:bg-emerald-500/30 disabled:opacity-50 transition-all"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              Submitting...
            </span>
          ) : (
            'Submit Proposal'
          )}
        </button>
      </div>
    </div>
  )
}
