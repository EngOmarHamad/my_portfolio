import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'
import type { GlassProps } from '@/shared/types'

export function Glass({ children, className, as: Tag = 'div' }: GlassProps) {
  return (
    <Tag
      className={cn(
        'rounded-2xl border border-border/70 bg-surface/75 backdrop-blur-xl',
        'shadow-card transition-all duration-300',
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
  hover?: boolean
}

export function Card({ children, className, as: Tag = 'div', hover = false }: CardProps) {
  return (
    <Tag
      className={cn(
        'rounded-2xl border border-border/60 bg-surface p-6 sm:p-8 shadow-card',
        'transition-all duration-300',
        hover && 'hover:-translate-y-1 hover:shadow-elevated hover:border-border',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
