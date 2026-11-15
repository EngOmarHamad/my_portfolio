import { useRef, type PointerEvent, type ReactNode } from 'react'
import { m, useMotionValue, useSpring } from 'framer-motion'
import { useFinePointer, usePrefersReducedMotion } from '@/portfolio/lib/environment'
import { cn } from '@/shared/utils/cn'

const MAX_PULL = 8
// Over-damped spring: settles without overshoot (no elastic bounce).
const SPRING = { stiffness: 260, damping: 32, mass: 0.6 }

interface MagneticProps {
  children: ReactNode
  className?: string
  strength?: number
}

/** Pulls its child toward the pointer by at most 8px. Inert on touch / reduced motion. */
export function Magnetic({ children, className, strength = MAX_PULL }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const fine = useFinePointer()
  const reduced = usePrefersReducedMotion()
  const x = useSpring(useMotionValue(0), SPRING)
  const y = useSpring(useMotionValue(0), SPRING)
  const active = fine && !reduced

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const node = ref.current
    if (!node || !active) return
    const rect = node.getBoundingClientRect()
    const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
    const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
    x.set(Math.max(-1, Math.min(1, dx)) * strength)
    y.set(Math.max(-1, Math.min(1, dy)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <m.div
      ref={ref}
      className={cn('inline-flex', className)}
      style={active ? { x, y } : undefined}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </m.div>
  )
}
