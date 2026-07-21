import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import type { GlassProps } from '@/types'

export function Glass({ children, className, as: Tag = 'div' }: GlassProps) {
  return (
    <Tag
      className={cn(
        'rounded-xl border border-border/60 bg-surface/80 backdrop-blur-xl',
        'shadow-soft transition-shadow duration-300',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

interface CardProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'article' | 'section'
}

export function Card({ children, className, as: Tag = 'div' }: CardProps) {
  return (
    <Tag
      className={cn(
        'rounded-xl border border-border/50 bg-surface p-6 sm:p-8 shadow-card',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
