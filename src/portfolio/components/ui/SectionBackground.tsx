import { useReducedMotion } from '@/portfolio/hooks/useReducedMotion'
import { cn } from '@/shared/utils/cn'

const variants = {
  dots: 'bg-noise',
  grid: 'bg-grid mask-fade-b',
}

interface SectionBackgroundProps {
  variant?: keyof typeof variants
  className?: string
}

export function SectionBackground({
  variant = 'dots',
  className,
}: SectionBackgroundProps) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) return null

  return (
    <div
      className={cn(
        'absolute inset-0 pointer-events-none overflow-hidden',
        className,
      )}
      aria-hidden
    >
      <div className={cn('absolute inset-0 opacity-[0.3] dark:opacity-[0.15]', variants[variant])} />
    </div>
  )
}
