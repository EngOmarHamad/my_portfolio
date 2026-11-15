import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useLanguage } from '@/shared/i18n'
import { cn } from '@/shared/utils/cn'
import { Container, Magnetic, Monogram } from '@/portfolio/components/ds'
import { HOME_SECTIONS, useActiveSection, useGoToSection } from '@/portfolio/hooks/use-section-nav'
import { transition } from '@/portfolio/lib/motion'
import { scrollToTarget } from '@/portfolio/lib/smooth-scroll'
import { LanguageSwitch, ThemeSwitch } from './Controls'
import { MobileMenu } from './MobileMenu'

const SOLID_AFTER = 50
const HIDE_AFTER = 240

export function Navbar() {
  const { t } = useLanguage()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const goTo = useGoToSection()
  const active = useActiveSection(isHome)
  const { scrollY } = useScroll()
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = scrollY.getPrevious() ?? 0
    setSolid(current > SOLID_AFTER)
    if (menuOpen) return
    if (current > HIDE_AFTER && current > previous + 2) setHidden(true)
    else if (current < previous - 2 || current <= HIDE_AFTER) setHidden(false)
  })

  const onHome = (event: React.MouseEvent) => {
    if (!isHome) return
    event.preventDefault()
    scrollToTarget(0)
    window.history.replaceState(window.history.state, '', '/')
  }

  return (
    <>
      <motion.header
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ease-precise',
          solid || menuOpen ? 'border-line bg-canvas/80 backdrop-blur-md' : 'border-transparent bg-transparent',
        )}
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={transition(0.5)}
      >
        <Container className="flex h-(--nav-h) items-center gap-4">
          <Link to="/" onClick={onHome} aria-label={t.site.nav.home} className="group -ms-2 flex min-h-11 items-center gap-3 rounded-chip px-2 text-ink">
            <Monogram className="h-5 w-auto transition-transform duration-500 ease-precise group-hover:-rotate-6" />
            <span className="label-mono hidden text-ink-muted sm:inline">{t.site.meta.version}</span>
          </Link>

          <nav aria-label={t.site.nav.primary} className="mx-auto hidden lg:block">
            <ul className="flex items-center gap-1">
              {HOME_SECTIONS.map((id, index) => {
                const isActive = active === id
                return (
                  <li key={id}>
                    <a
                      href={`/#${id}`}
                      onClick={(event) => {
                        event.preventDefault()
                        goTo(id)
                      }}
                      aria-current={isActive ? 'location' : undefined}
                      className={cn(
                        'relative flex min-h-11 items-center gap-2 px-4 text-sm transition-colors duration-200',
                        isActive ? 'text-ink' : 'text-ink-muted hover:text-ink',
                      )}
                    >
                      <span className="font-mono text-label text-ink-faint">0{index + 1}</span>
                      {t.site.nav[id]}
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute inset-x-4 bottom-2 h-px bg-signal"
                          transition={transition(0.5)}
                        />
                      )}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="ms-auto flex items-center gap-2 lg:ms-0">
            <LanguageSwitch className="hidden sm:inline-flex" />
            <ThemeSwitch className="hidden sm:inline-flex" />
            <Magnetic className="hidden md:inline-flex">
              <a
                href="/#contact"
                onClick={(event) => {
                  event.preventDefault()
                  goTo('contact')
                }}
                className="inline-flex min-h-11 items-center gap-2 rounded-chip bg-signal px-5 text-sm font-medium text-on-signal"
              >
                {t.site.nav.hire}
              </a>
            </Magnetic>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={t.site.nav.openMenu}
              className="inline-flex size-11 flex-col items-center justify-center gap-1.5 rounded-chip border border-line lg:hidden"
            >
              <span aria-hidden className="h-px w-5 bg-ink" />
              <span aria-hidden className="h-px w-5 bg-ink" />
            </button>
          </div>
        </Container>
      </motion.header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} active={active} />
    </>
  )
}
