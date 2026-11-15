import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

interface TagProps {
  children: ReactNode
  tone?: 'default' | 'signal' | 'circuit'
  className?: string
}

const tones = {
  default: 'border-line text-ink-muted',
  signal: 'border-[color-mix(in_srgb,var(--accent)_45%,transparent)] text-signal-ink',
  circuit: 'border-[color-mix(in_srgb,var(--accent-2)_45%,transparent)] text-circuit',
}

/** Mono micro-label: technologies, categories, versions. */
export function Tag({ children, tone = 'default', className }: TagProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-chip border px-3 py-1 font-mono text-label', tones[tone], className)}>
      {children}
    </span>
  )
}
