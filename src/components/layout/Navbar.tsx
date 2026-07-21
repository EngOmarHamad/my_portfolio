import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/utils/cn'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useHero } from '@/hooks/use-portfolio-data'

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Projects', path: '/projects' },
  { label: 'Skills', path: '/skills' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const location = useLocation()
  const { data: hero } = useHero()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setIsMobileOpen(false) }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileOpen])

  const initials = hero?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'TS'

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50',
      'border-b border-border/50',
      'bg-bg/95 backdrop-blur-md',
      'transition-shadow duration-300',
      isScrolled && 'shadow-soft',
    )}>
      <nav className="mx-auto flex h-16 items-center justify-between px-5 sm:px-8 lg:px-12 max-w-6xl">
        <Link to="/" className="flex items-center gap-3 text-base font-medium text-text group">
          <span className="flex h-7 w-7 items-center justify-center rounded border border-border bg-surface text-xs font-bold text-primary font-mono">
            {initials}
          </span>
          <span className="hidden sm:inline text-sm text-text-secondary group-hover:text-text transition-colors font-mono">
            Portfolio
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'relative px-3.5 py-2 text-sm font-medium rounded-md transition-all duration-200',
                  isActive
                    ? 'text-text bg-surface-hover'
                    : 'text-text-secondary hover:text-text hover:bg-surface-hover',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/cv"
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md text-text-secondary hover:text-text hover:bg-surface-hover border border-border/40 transition-all duration-200"
          >
            CV
          </Link>
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary text-white hover:bg-primary-light transition-all duration-200 shadow-soft"
          >
            Get in Touch
          </Link>
          <ThemeToggle />
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="flex md:hidden items-center justify-center h-9 w-9 rounded-md text-text-secondary hover:bg-surface-hover hover:text-text transition-colors"
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mx-5 sm:mx-8 mb-2 overflow-hidden rounded-xl border border-border/60 bg-surface/95 backdrop-blur-2xl shadow-elevated md:hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'block px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200',
                      isActive
                        ? 'text-text bg-surface-hover'
                        : 'text-text-secondary hover:text-text hover:bg-surface-hover',
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
              <div className="pt-2 space-y-2">
                <Link to="/cv" className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium rounded-lg border border-border/50 text-text-secondary hover:text-text hover:bg-surface-hover transition-all duration-200">
                  View CV
                </Link>
                <Link to="/contact" className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary-light transition-all duration-200">
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
