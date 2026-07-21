import { cn } from '@/utils/cn'

export function SkipNav() {
  return (
    <a
      href="#main-content"
      className={cn(
        'fixed top-2 left-2 z-[100] px-4 py-2 text-sm font-medium rounded-lg',
        'bg-surface text-text border border-border shadow-elevated',
        '-translate-y-20 focus:translate-y-0 transition-transform duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
      )}
    >
      Skip to main content
    </a>
  )
}
