import { cn } from '@/utils/cn'

interface StatusBadgeProps {
  status: string
}

const statusStyles: Record<string, string> = {
  published: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  draft: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  archived: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  inactive: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  online: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  maintenance: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  offline: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  read: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  unread: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status.toLowerCase()] || 'bg-gray-500/10 text-gray-500 border-gray-500/20'

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      style
    )}>
      {status}
    </span>
  )
}
