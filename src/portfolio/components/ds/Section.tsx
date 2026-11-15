import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'
import { Container } from './Container'

interface SectionProps {
  id: string
  /** id of the heading that names this landmark. */
  labelledBy?: string
  className?: string
  containerClassName?: string
  children: ReactNode
}

/** Vertical rhythm: 64px mobile → 96px tablet → 128px desktop. */
export function Section({ id, labelledBy, className, containerClassName, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy ?? `${id}-title`}
      className={cn('relative scroll-mt-(--nav-h) py-16 md:py-24 lg:py-32', className)}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  )
}
