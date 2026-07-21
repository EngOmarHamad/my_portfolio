import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'

const variants = {
  primary:
    'bg-primary text-white shadow-soft hover:bg-primary-light hover:shadow-elevated',
  accent:
    'bg-accent text-white shadow-soft hover:bg-accent-light hover:shadow-elevated',
  ghost:
    'bg-transparent text-text-secondary hover:text-text hover:bg-surface-hover',
  outline:
    'bg-transparent text-text border border-border hover:border-primary hover:text-primary',
  subtle:
    'bg-surface text-text-secondary border border-border/60 hover:text-text hover:bg-surface-hover',
} as const

const sizes = {
  xs: 'px-3 py-1.5 text-xs',
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
  xl: 'px-8 py-3.5 text-base',
} as const

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  children: ReactNode
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      className,
      children,
      icon,
      iconPosition = 'left',
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
          'transition-all duration-200 active:scale-[0.97]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
          'disabled:opacity-40 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {icon && iconPosition === 'left' && (
          <span className="shrink-0">{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <span className="shrink-0">{icon}</span>
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'
