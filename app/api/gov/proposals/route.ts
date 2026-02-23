import { NextRequest, NextResponse } from 'next/server'
import { verifyMessage } from 'viem'
import { getSupabase } from '../supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const filter = searchParams.get('filter')
  const voter = searchParams.get('voter')

  let query = getSupabase().from('proposals').select('*').order('created_at', { ascending: false })

  if (filter === 'active') query = query.eq('status', 'active')
  else if (filter === 'passed') query = query.eq('status', 'passed')
  else if (filter === 'failed') query = query.eq('status', 'failed')

  const { data: proposals, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Get vote counts for each proposal
  const proposalIds = (proposals || []).map((p) => p.id)

  if (proposalIds.length === 0) return NextResponse.json([])

  const { data: votes } = await getSupabase().from('votes').select('proposal_id, vote_type, voter_address').in('proposal_id', proposalIds)

  const voteCounts: Record<string, { for: number; against: number; abstain: number }> = {}
  for (const v of votes || []) {
    if (!voteCounts[v.proposal_id]) voteCounts[v.proposal_id] = { for: 0, against: 0, abstain: 0 }
    voteCounts[v.proposal_id][v.vote_type as 'for' | 'against' | 'abstain']++
  }

  let result = (proposals || []).map((p) => ({
    ...p,
    votes_for: voteCounts[p.id]?.for || 0,
    votes_against: voteCounts[p.id]?.against || 0,
    votes_abstain: voteCounts[p.id]?.abstain || 0,
  }))

  // Filter my-votes: only proposals the user voted on
  if (filter === 'my-votes' && voter) {
    const votedIds = new Set((votes || []).filter((v) => v.voter_address?.toLowerCase() === voter.toLowerCase()).map((v) => v.proposal_id))
    result = result.filter((p) => votedIds.has(p.id))
  }

  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { title, description, discussion_url, voting_days, address, message, signature } = body

  if (!title || !description || !address || !message || !signature) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Verify signature
  try {
    const valid = await verifyMessage({
      address: address as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
    })
    if (!valid) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  } catch {
    return NextResponse.json({ error: 'Signature verification failed' }, { status: 401 })
  }

  const voting_ends_at = new Date(Date.now() + (voting_days || 5) * 86400000).toISOString()

  const { data, error } = await getSupabase()
    .from('proposals')
    .insert({
      title,
      description,
      discussion_url: discussion_url || null,
      author_address: address.toLowerCase(),
      voting_ends_at,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
