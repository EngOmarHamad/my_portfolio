import { useEffect } from 'react'
import Lenis from 'lenis'
import { setLenis } from '@/portfolio/lib/smooth-scroll'
import { usePrefersReducedMotion } from '@/portfolio/lib/environment'

/** Lenis smooth scrolling for the public site. Native scrolling under reduced motion. */
export function SmoothScroll() {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      // Let nested scroll areas (modal, menus) scroll natively.
      prevent: (node) => node.closest('[data-lenis-prevent]') !== null,
    })
    setLenis(lenis)
    return () => {
      setLenis(null)
      lenis.destroy()
    }
  }, [reduced])

  return null
}
