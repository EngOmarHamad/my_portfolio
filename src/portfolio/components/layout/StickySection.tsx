import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

interface StickySectionProps {
  children: ReactNode
  className?: string
  id?: string
  imageSide?: 'left' | 'right'
}

export function StickySection({ children, className, id, imageSide = 'right' }: StickySectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative px-5 sm:px-8 lg:px-12 py-20 sm:py-28 lg:py-32 overflow-hidden',
        className,
      )}
    >
      <div className="mx-auto w-full max-w-7xl relative">
        <div className={cn(
          'grid gap-12 lg:gap-16 items-start',
          imageSide === 'right' ? 'lg:grid-cols-[1fr_400px]' : 'lg:grid-cols-[400px_1fr]',
        )}>
          <div className={imageSide === 'left' ? 'lg:order-2' : ''}>
            {children}
          </div>
        </div>
      </div>

      <div className={cn(
        'hidden lg:block absolute top-0 h-full w-[400px]',
        imageSide === 'right' ? 'right-[calc((100%-1280px)/2)]' : 'left-[calc((100%-1280px)/2)]',
      )}>
        <div className="sticky top-24 h-[70vh] w-full rounded-3xl bg-gradient-to-br from-primary/8 via-secondary/8 to-accent/8 border border-border/40 overflow-hidden">
          <div className="absolute inset-4 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />
          <div className="absolute inset-8 rounded-xl bg-gradient-to-br from-primary/15 via-secondary/15 to-accent/15" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-9xl font-bold text-primary/[0.06] select-none tracking-tighter">
                P
              </div>
              <div className="mt-2 text-xs text-text-tertiary tracking-widest uppercase">
                Portfolio
              </div>
            </div>
          </div>
          <div className="absolute -top-6 -right-6 w-20 h-20 border border-primary/20 rounded-2xl" />
          <div className="absolute -bottom-6 -left-6 w-14 h-14 border border-secondary/20 rounded-xl" />
        </div>
      </div>
    </section>
  )
}
