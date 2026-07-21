import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface StatsCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  trend?: {
    value: number
    positive: boolean
  }
  className?: string
}

export function StatsCard({ title, value, icon, trend, className }: StatsCardProps) {
  return (
    <div className={cn(
      'rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all hover:shadow-elevated',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-[var(--color-text-secondary)]">{title}</p>
          <p className="text-2xl font-bold text-[var(--color-text)]">{value}</p>
          {trend && (
            <p className={cn(
              'text-xs font-medium',
              trend.positive ? 'text-emerald-500' : 'text-red-500'
            )}>
              {trend.positive ? '+' : ''}{trend.value}% from last month
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2.5 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
