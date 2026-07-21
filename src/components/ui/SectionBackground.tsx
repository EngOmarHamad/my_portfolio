import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/utils/cn'

const variants = {
  dots: 'bg-dot',
  grid: 'bg-grid',
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
