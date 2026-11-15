import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

const variants = {
  primary:
    'bg-gradient-to-br from-primary to-[var(--color-primary-dark)] text-white shadow-[0_10px_28px_-10px_var(--color-primary-glow)] hover:shadow-[0_16px_38px_-10px_var(--color-primary-glow)] hover:-translate-y-px border border-white/10',
  accent:
    'bg-gradient-to-br from-accent-light to-accent-dark text-white shadow-[0_10px_28px_-12px_var(--color-accent-glow)] hover:-translate-y-px',
  ghost:
    'bg-transparent text-text-secondary hover:text-text hover:bg-surface-hover',
  outline:
    'bg-transparent text-text border-[1.5px] border-border hover:border-primary hover:text-primary-light hover:bg-primary/5',
  subtle:
    'bg-surface text-text-secondary border border-border/70 hover:text-text hover:bg-surface-hover hover:border-border',
} as const

const sizes = {
  xs: 'px-3 py-1.5 text-xs rounded-lg',
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3 text-[15px] rounded-xl',
  xl: 'px-8 py-3.5 text-base rounded-xl',
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
