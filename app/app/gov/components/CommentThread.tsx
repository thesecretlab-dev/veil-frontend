'use client'

import { useState } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { motion, AnimatePresence } from 'framer-motion'
import { AddressAvatar, truncateAddress } from './WalletGate'
import { addComment, type Comment } from '../lib/governance-api'
import { createSignMessage } from '../lib/wallet-verify'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function CommentItem({
  comment,
  proposalId,
  onReply,
  depth = 0,
}: {
  comment: Comment
  proposalId: string
  onReply: () => void
  depth?: number
}) {
  const [showReply, setShowReply] = useState(false)
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const [replyText, setReplyText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleReply() {
    if (!address || !replyText.trim()) return
    setSubmitting(true)
    try {
      const message = createSignMessage(`comment:${proposalId}`)
      const signature = await signMessageAsync({ message })
      await addComment(proposalId, {
        content: replyText,
        parent_id: comment.id,
        address,
        message,
        signature,
      })
      setReplyText('')
      setShowReply(false)
      onReply()
    } catch {
      // silently fail
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={depth > 0 ? 'ml-6 pl-4 border-l border-white/[0.06]' : ''}>
      <div className="py-3">
        <div className="flex items-center gap-2 mb-1.5">
          <AddressAvatar address={comment.author_address} />
          <span className="text-xs font-mono text-white/50">{truncateAddress(comment.author_address)}</span>
          <span className="text-xs text-white/20">·</span>
          <span className="text-xs text-white/20">{timeAgo(comment.created_at)}</span>
        </div>
        <p className="text-sm text-white/70 mb-2">{comment.content}</p>
        <div className="flex items-center gap-3">
          {depth === 0 && isConnected && (
            <button
              onClick={() => setShowReply(!showReply)}
              className="text-xs text-white/20 hover:text-white/50 transition-colors"
            >
              Reply
            </button>
          )}
          {comment.upvotes > 0 && (
            <span className="text-xs text-white/20">▲ {comment.upvotes}</span>
          )}
        </div>

        <AnimatePresence>
          {showReply && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3"
            >
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/30 resize-none"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => setShowReply(false)} className="text-xs text-white/30 hover:text-white/50 px-3 py-1.5">Cancel</button>
                <button
                  onClick={handleReply}
                  disabled={submitting || !replyText.trim()}
                  className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-emerald-500/30 disabled:opacity-50 transition-all"
                >
                  {submitting ? 'Posting...' : 'Reply'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} proposalId={proposalId} onReply={onReply} depth={1} />
      ))}
    </div>
  )
}

export function CommentThread({
  comments,
  proposalId,
  onRefresh,
}: {
  comments: Comment[]
  proposalId: string
  onRefresh: () => void
}) {
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit() {
    if (!address || !newComment.trim()) return
    setSubmitting(true)
    try {
      const message = createSignMessage(`comment:${proposalId}`)
      const signature = await signMessageAsync({ message })
      await addComment(proposalId, {
        content: newComment,
        address,
        message,
        signature,
      })
      setNewComment('')
      onRefresh()
    } catch {
      // silently fail
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">
        Discussion ({comments.length})
      </h3>

      {isConnected && (
        <div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/30 resize-none"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSubmit}
              disabled={submitting || !newComment.trim()}
              className="text-sm bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg hover:bg-emerald-500/30 disabled:opacity-50 transition-all"
            >
              {submitting ? 'Posting...' : 'Comment'}
            </button>
          </div>
        </div>
      )}

      {comments.length === 0 ? (
        <p className="text-sm text-white/20 py-4">No comments yet. Be the first to share your thoughts.</p>
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {comments.map((c) => (
            <CommentItem key={c.id} comment={c} proposalId={proposalId} onReply={onRefresh} />
          ))}
        </div>
      )}
    </div>
  )
}
