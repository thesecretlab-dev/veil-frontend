'use client'

import { cn } from '@/lib/utils'

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  passed: { label: 'Passed', className: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
  failed: { label: 'Failed', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
  pending: { label: 'Pending', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  executed: { label: 'Executed', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
}

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig.pending
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', config.className)}>
      {status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />}
      {config.label}
    </span>
  )
}
