import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Autonomous Agents | VEIL',
  description: 'Preview the sovereign-agent architecture and staged rollout plan for VEIL.',
}

export default function AgentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black">
      {children}
    </div>
  )
}
