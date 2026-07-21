import { cn } from '@/shared/utils/cn'
import type { SectionProps } from '@/shared/types'

const bgVariants = {
  default: '',
  teal: 'bg-section-teal',
  coral: 'bg-section-coral',
  gold: 'bg-section-gold',
}

export function Section({ children, className, id, variant = 'default' }: SectionProps & { variant?: 'default' | 'teal' | 'coral' | 'gold' }) {
  return (
    <section
      id={id}
      className={cn(
        'relative px-5 sm:px-8 lg:px-12',
        'py-20 sm:py-28 lg:py-32',
        bgVariants[variant],
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  )
}

export function SectionHeader({
  title,
  subtitle,
  className,
  align = 'center',
  accent = 'primary',
}: {
  title: string
  subtitle?: string
  className?: string
  align?: 'left' | 'center'
  accent?: 'primary' | 'accent' | 'gold'
}) {
  const hairlineClass = accent === 'accent' ? 'hairline-accent' : accent === 'gold' ? 'hairline-gold' : 'hairline-primary'

  return (
    <div
      className={cn(
        'mb-14 sm:mb-16 max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      <hr className={cn(hairlineClass, 'mb-5 sm:mb-6')} />
      <h2 className="text-3xl sm:text-4xl lg:text-5xl text-text leading-[1.08]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 sm:mt-5 text-base sm:text-lg text-text-secondary leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}
