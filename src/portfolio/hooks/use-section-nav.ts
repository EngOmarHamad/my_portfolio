import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { scrollToTarget } from '@/portfolio/lib/smooth-scroll'

export const HOME_SECTIONS = ['about', 'skills', 'work', 'experience', 'contact'] as const
export type HomeSection = (typeof HOME_SECTIONS)[number]

/** Scrolls to a home section, navigating home first when needed. */
export function useGoToSection() {
  const location = useLocation()
  const navigate = useNavigate()

  return useCallback(
    (id: string) => {
      if (location.pathname === '/' && scrollToTarget(id)) {
        window.history.replaceState(window.history.state, '', `#${id}`)
        return
      }
      navigate({ pathname: '/', hash: `#${id}` })
    },
    [location.pathname, navigate],
  )
}

/** The home section currently crossing the middle band of the viewport. */
export function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<HomeSection | null>(null)

  useEffect(() => {
    if (!enabled) {
      setActive(null)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as HomeSection)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    const attach = () => {
      HOME_SECTIONS.forEach((id) => {
        const node = document.getElementById(id)
        if (node) observer.observe(node)
      })
    }
    attach()
    // Sections mount lazily; observe late arrivals too.
    const mutation = new MutationObserver(attach)
    mutation.observe(document.getElementById('main-content') ?? document.body, { childList: true, subtree: true })
    const onTop = () => window.scrollY < 200 && setActive(null)
    window.addEventListener('scroll', onTop, { passive: true })
    return () => {
      observer.disconnect()
      mutation.disconnect()
      window.removeEventListener('scroll', onTop)
    }
  }, [enabled])

  return active
}
