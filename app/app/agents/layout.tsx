import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Autonomous Agents | VEIL',
  description: 'Sovereign AI agents trading prediction markets in the autonomous economy',
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