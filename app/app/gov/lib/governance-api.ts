export interface Proposal {
  id: string
  title: string
  description: string
  author_address: string
  discussion_url?: string
  status: 'active' | 'passed' | 'failed' | 'pending' | 'executed'
  voting_ends_at: string
  created_at: string
  updated_at: string
  votes_for?: number
  votes_against?: number
  votes_abstain?: number
  user_vote?: string | null
}

export interface Vote {
  id: string
  proposal_id: string
  voter_address: string
  vote_type: 'for' | 'against' | 'abstain'
  created_at: string
}

export interface Comment {
  id: string
  proposal_id: string
  parent_id: string | null
  author_address: string
  content: string
  upvotes: number
  created_at: string
  replies?: Comment[]
}

const BASE = '/api/gov/proposals'

export async function fetchProposals(filter?: string, voterAddress?: string): Promise<Proposal[]> {
  const params = new URLSearchParams()
  if (filter && filter !== 'all') params.set('filter', filter)
  if (voterAddress) params.set('voter', voterAddress)
  const res = await fetch(`${BASE}?${params}`)
  if (!res.ok) throw new Error('Failed to fetch proposals')
  return res.json()
}

export async function fetchProposal(id: string, voterAddress?: string): Promise<Proposal & { comments: Comment[] }> {
  const params = new URLSearchParams()
  if (voterAddress) params.set('voter', voterAddress)
  const res = await fetch(`${BASE}/${id}?${params}`)
  if (!res.ok) throw new Error('Failed to fetch proposal')
  return res.json()
}

export async function createProposal(data: {
  title: string
  description: string
  discussion_url?: string
  voting_days: number
  address: string
  message: string
  signature: string
}): Promise<Proposal> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to create proposal')
  }
  return res.json()
}

export async function castVote(
  proposalId: string,
  data: {
    vote_type: 'for' | 'against' | 'abstain'
    address: string
    message: string
    signature: string
  }
): Promise<Vote> {
  const res = await fetch(`${BASE}/${proposalId}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to cast vote')
  }
  return res.json()
}

export async function addComment(
  proposalId: string,
  data: {
    content: string
    parent_id?: string
    address: string
    message: string
    signature: string
  }
): Promise<Comment> {
  const res = await fetch(`${BASE}/${proposalId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to add comment')
  }
  return res.json()
}
