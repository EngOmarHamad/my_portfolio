import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/shared/utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost'

const base =
  'group/btn relative inline-flex min-h-12 items-center justify-center gap-2 rounded-chip px-6 text-sm font-medium transition-[background-color,border-color,color] duration-200 ease-precise disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary: 'bg-signal text-on-signal hover:bg-[color-mix(in_srgb,var(--accent)_88%,var(--text))]',
  secondary: 'border border-line-strong bg-panel/60 text-ink hover:border-ink-muted',
  ghost: 'text-ink-muted hover:text-ink',
}

interface CommonProps {
  variant?: Variant
  className?: string
  children: ReactNode
}

type ButtonAsLink = CommonProps & { to: string; href?: never } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className'>
type ButtonAsAnchor = CommonProps & { href: string; to?: never } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className'>
type ButtonAsButton = CommonProps & { to?: never; href?: never } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>

export type ButtonProps = ButtonAsLink | ButtonAsAnchor | ButtonAsButton

/** Router link, external anchor or button — one visual language. */
export function Button(props: ButtonProps) {
  const { variant = 'primary', className, children, ...rest } = props
  const classes = cn(base, variants[variant], className)

  if ('to' in rest && rest.to !== undefined) {
    const { to, ...anchor } = rest as ButtonAsLink
    return (
      <Link to={to} className={classes} {...anchor}>
        {children}
      </Link>
    )
  }
  if ('href' in rest && rest.href !== undefined) {
    return (
      <a className={classes} {...(rest as ButtonAsAnchor)}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={classes} {...(rest as ButtonAsButton)}>
      {children}
    </button>
  )
}
