import { useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, m } from 'framer-motion'
import { X } from 'lucide-react'
import { useLanguage } from '@/shared/i18n'
import { cn } from '@/shared/utils/cn'
import { Container, Monogram } from '@/portfolio/components/ds'
import { HOME_SECTIONS, useGoToSection, type HomeSection } from '@/portfolio/hooks/use-section-nav'
import { useFocusTrap } from '@/portfolio/lib/use-focus-trap'
import { lockScroll } from '@/portfolio/lib/smooth-scroll'
import { DURATION, EASE, transition } from '@/portfolio/lib/motion'
import { LanguageSwitch, ThemeSwitch } from './Controls'
import { SECONDARY_LINKS } from './links'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  active: HomeSection | null
}

/** Full-screen menu: focus-trapped dialog with masked, staggered links. */
export function MobileMenu({ open, onClose, active }: MobileMenuProps) {
  const { t } = useLanguage()
  const panel = useRef<HTMLDivElement>(null)
  const goTo = useGoToSection()
  const close = useCallback(() => onClose(), [onClose])

  useFocusTrap(panel, open, close)
  useEffect(() => {
    if (!open) return
    lockScroll(true)
    return () => lockScroll(false)
  }, [open])

  const go = (id: string) => {
    onClose()
    // Wait for the scroll lock to release before scrolling.
    window.setTimeout(() => goTo(id), 50)
  }

  return (
    <AnimatePresence>
      {open && (
        <m.div
          ref={panel}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={t.site.nav.primary}
          className="fixed inset-0 z-[70] flex flex-col bg-canvas lg:hidden"
          initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={transition(DURATION.base)}
          data-lenis-prevent
        >
          <Container className="flex h-(--nav-h) items-center justify-between">
            <Monogram className="h-5 w-auto text-ink" />
            <button
              type="button"
              onClick={onClose}
              aria-label={t.site.nav.closeMenu}
              className="inline-flex size-11 items-center justify-center rounded-chip border border-line text-ink"
              data-autofocus
            >
              <X className="size-5" aria-hidden />
            </button>
          </Container>

          <Container className="flex flex-1 flex-col justify-between overflow-y-auto pt-8 pb-8">
            <nav aria-label={t.site.nav.primary}>
              <ol className="space-y-1">
                {HOME_SECTIONS.map((id, index) => (
                  <li key={id} className="overflow-hidden">
                    <m.a
                      href={`/#${id}`}
                      onClick={(event) => {
                        event.preventDefault()
                        go(id)
                      }}
                      aria-current={active === id ? 'location' : undefined}
                      className={cn('flex min-h-14 items-baseline gap-4 font-display text-h2 display-tight', active === id ? 'text-signal-ink' : 'text-ink')}
                      initial={{ y: '100%' }}
                      animate={{ y: '0%' }}
                      transition={{ duration: DURATION.slow, ease: EASE, delay: 0.15 + index * 0.06 }}
                    >
                      <span className="font-mono text-label text-ink-faint">0{index + 1}</span>
                      {t.site.nav[id]}
                    </m.a>
                  </li>
                ))}
              </ol>
            </nav>

            <m.div
              className="mt-12 space-y-6 border-t border-line pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={transition(DURATION.base, 0.45)}
            >
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {SECONDARY_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} onClick={onClose} className="inline-flex min-h-11 items-center text-ink-muted hover:text-ink">
                      {t.site.nav[link.key]}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2">
                <LanguageSwitch />
                <ThemeSwitch />
                <a
                  href="/#contact"
                  onClick={(event) => {
                    event.preventDefault()
                    go('contact')
                  }}
                  className="ms-auto inline-flex min-h-11 items-center rounded-chip bg-signal px-5 text-sm font-medium text-on-signal"
                >
                  {t.site.nav.hire}
                </a>
              </div>
            </m.div>
          </Container>
        </m.div>
      )}
    </AnimatePresence>
  )
}
