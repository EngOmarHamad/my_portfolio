import { cn } from '@/shared/utils/cn'

/** "OH" drawn as a two-node system diagram: O ── H. Same geometry as the intro and favicon. */
export function Monogram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 64" className={cn('overflow-visible', className)} aria-hidden fill="none">
      <circle cx="30" cy="32" r="23" stroke="currentColor" strokeWidth="5" />
      <path d="M74 9V55M106 9V55M74 32H106" stroke="currentColor" strokeWidth="5" />
      <path d="M53 32H74" stroke="var(--accent)" strokeWidth="5" />
      <circle cx="53" cy="32" r="5" fill="var(--accent)" />
      <circle cx="74" cy="32" r="5" fill="var(--accent)" />
    </svg>
  )
}
