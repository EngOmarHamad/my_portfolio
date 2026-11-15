import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { ChevronDown, Menu, X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { ThemeToggle } from '@/portfolio/components/ui/ThemeToggle'
import { LanguageToggle } from '@/shared/i18n'
import { useHero } from '@/portfolio/hooks/use-portfolio-data'
import { NAV_ITEMS, HEADER_ITEMS, MORE_ITEMS } from '@/portfolio/constants/navigation'

const EASE = [0.16, 1, 0.3, 1] as const

function MoreMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const isChildActive = MORE_ITEMS.some((item) => location.pathname === item.path)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open ])

  useEffect(() => { setOpen(false) }, [location.pathname])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          'flex cursor-pointer items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-200',
          open || isChildActive ? 'text-text' : 'text-text-secondary hover:text-text',
        )}
      >
        More
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-300', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="glass-heavy absolute end-0 top-[calc(100%+10px)] z-50 w-56 origin-top rounded-2xl border border-border/70 p-1.5 shadow-dialog"
          >
            {MORE_ITEMS.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <li key={item.path} role="none">
                  <Link
                    role="menuitem"
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'block rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-150',
                      isActive ? 'bg-primary/10 text-primary-light' : 'text-text-secondary hover:bg-surface-hover hover:text-text',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { data: hero } = useHero()
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 24))
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const initials = hero?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'TS'

  return (
    <header className={cn(
      'fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300',
      scrolled ? 'border-border/70 bg-bg/95 backdrop-blur-md' : 'border-transparent bg-bg/60 backdrop-blur-md',
    )}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <nav
          aria-label="Primary"
          className="flex h-16 items-center gap-1.5 sm:gap-2"
        >
          <Link to="/" className="group flex items-center gap-2.5 rounded-xl px-1.5 py-1" aria-label="Portfolio home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-secondary to-accent font-mono text-xs font-bold text-white shadow-soft transition-transform duration-300 group-hover:scale-105">
              {initials}
            </span>
            <span className="hidden flex-col leading-none min-[400px]:flex">
              <span className="font-mono text-sm font-semibold text-text">Portfolio</span>
              <span className="mt-1 flex items-center gap-1.5 text-[10px] font-medium text-text-tertiary">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Available
              </span>
            </span>
          </Link>

          <div className="mx-auto hidden items-center gap-0.5 lg:flex" role="list">
            {HEADER_ITEMS.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'relative rounded-xl px-3.5 py-2 text-sm font-medium transition-colors duration-200',
                    isActive ? 'text-text' : 'text-text-secondary hover:text-text',
                  )}
                >
                  {!reduceMotion && isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      transition={{ duration: 0.35, ease: EASE }}
                      className="absolute inset-0 rounded-xl bg-surface-hover ring-1 ring-inset ring-border/60"
                    />
                  )}
                  {reduceMotion && isActive && (
                    <span className="absolute inset-0 rounded-xl bg-surface-hover ring-1 ring-inset ring-border/60" />
                  )}
                  <span className="relative">{item.label}</span>
                </Link>
              )
            })}
            <MoreMenu />
          </div>

          <div className="ms-auto flex items-center gap-1.5 sm:gap-2">
            <Link
              to="/cv"
              className="hidden rounded-xl px-3.5 py-2 font-mono text-[13px] font-semibold text-text-secondary transition-all duration-200 hover:bg-surface-hover hover:text-text md:inline-flex"
            >
              CV
            </Link>
            <Link
              to="/contact"
              className="hidden rounded-xl bg-gradient-to-br from-primary to-[var(--color-primary-dark)] px-4 py-2 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:-translate-y-px sm:inline-flex"
            >
              Get in Touch
            </Link>
            <ThemeToggle />
            <LanguageToggle />
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-surface-hover hover:text-text lg:hidden"
            >
              <motion.span
                key={mobileOpen ? 'x' : 'menu'}
                initial={reduceMotion ? false : { rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.span>
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border/60 bg-bg lg:hidden"
          >
            <div className="mx-auto w-full max-w-7xl px-4 py-2 sm:px-6">
              <ul className="space-y-0.5">
                {NAV_ITEMS.map((item, i) => {
                  const isActive = location.pathname === item.path
                  return (
                    <motion.li
                      key={item.path}
                      initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.04 + i * 0.035, ease: EASE }}
                    >
                      <Link
                        to={item.path}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          'flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-medium transition-colors duration-150',
                          isActive ? 'bg-primary/10 text-primary-light' : 'text-text-secondary hover:bg-surface-hover hover:text-text',
                        )}
                      >
                        {item.label}
                        <span aria-hidden className={cn('font-mono text-[10px]', isActive ? 'text-primary-light/70' : 'text-text-tertiary')}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </Link>
                    </motion.li>
                  )
                })}
              </ul>
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border/60 py-2">
                <Link
                  to="/cv"
                  className="inline-flex items-center justify-center rounded-xl border border-border/70 px-4 py-3 text-sm font-semibold text-text-secondary transition-colors hover:text-text"
                >
                  View CV
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[var(--color-primary-dark)] px-4 py-3 text-sm font-semibold text-white"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
