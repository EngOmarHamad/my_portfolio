import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

interface StickyBgProps {
  children: ReactNode
  className?: string
}

export function StickyBg({ children, className }: StickyBgProps) {
  return (
    <section className={cn('relative overflow-hidden', className)}>
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      <div className="relative">{children}</div>
    </section>
  )
}
