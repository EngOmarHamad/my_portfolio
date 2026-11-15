import { cn } from '@/shared/utils/cn'
import type { SectionProps } from '@/shared/types'

export function Section({
  children,
  className,
  id,
  variant = 'default',
}: SectionProps & {
  variant?: 'default' | 'teal' | 'coral' | 'gold' | 'dark' | 'gradient' | 'premium'
  withGlow?: boolean
  withParticles?: boolean
}) {
  return (
    <section
      id={id}
      className={cn(
        'relative px-4 sm:px-6 lg:px-8',
        'py-16 sm:py-20 lg:py-24',
        variant === 'default' ? 'bg-transparent' : 'bg-surface/30',
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
}: {
  title: string | React.ReactNode
  subtitle?: string | React.ReactNode
  className?: string
  align?: 'left' | 'center'
  accent?: 'primary' | 'accent' | 'gold'
  withBadge?: boolean
  badgeText?: string
  animated?: boolean
}) {
  return (
    <div
      className={cn(
        'mb-10 sm:mb-12 max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      <h2 className="text-3xl font-semibold leading-tight text-text sm:text-4xl">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-base leading-relaxed text-text-secondary sm:text-lg">{subtitle}</p>
      )}
      {align === 'center' && (
        <div className="mt-5 flex justify-center" aria-hidden>
          <div className="h-1 w-16 rounded-full bg-primary/30" />
        </div>
      )}
    </div>
  )
}

export function GlassSection({
  children,
  className,
  id,
  glassIntensity = 'medium',
}: SectionProps & {
  glassIntensity?: 'light' | 'medium' | 'heavy'
}) {
  const glassClasses = {
    light: 'glass-light',
    medium: 'glass',
    heavy: 'glass-heavy',
  }

  return (
    <section
      id={id}
      className={cn('relative px-5 sm:px-8 lg:px-12 py-20 sm:py-24 lg:py-28', className)}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className={cn('relative mx-auto w-full max-w-6xl rounded-3xl p-6 sm:p-10 lg:p-12', glassClasses[glassIntensity])}>
        {children}
      </div>
    </section>
  )
}

export function HeroSection({
  children,
  className,
  id,
  backgroundImage,
}: SectionProps & {
  backgroundImage?: string
}) {
  return (
    <section
      id={id}
      className={cn(
        'relative flex min-h-[80vh] items-center',
        'px-5 sm:px-8 lg:px-12',
        'py-20 sm:py-24',
        className,
      )}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
          <div className="absolute inset-0 bg-gradient-to-b from-bg/90 via-bg/70 to-bg/90" />
        </div>
      )}
      <div className="relative z-10 mx-auto w-full max-w-6xl">{children}</div>
    </section>
  )
}
