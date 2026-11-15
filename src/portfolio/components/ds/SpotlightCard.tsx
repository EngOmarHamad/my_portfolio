import type { HTMLAttributes, PointerEvent } from 'react'
import { trackSpotlight } from '@/portfolio/lib/spotlight'
import { cn } from '@/shared/utils/cn'

type SpotlightCardProps = HTMLAttributes<HTMLElement> & { as?: 'div' | 'article' | 'li' }

export function SpotlightCard({ as: Tag = 'div', className, onPointerMove, ...rest }: SpotlightCardProps) {
  return (
    <Tag
      className={cn('spotlight rounded-card border border-line bg-panel', className)}
      onPointerMove={(event: PointerEvent<HTMLElement>) => {
        trackSpotlight(event)
        onPointerMove?.(event)
      }}
      {...rest}
    />
  )
}
