import type Lenis from 'lenis'

/** Module-level handle so any component can scroll through Lenis when it runs. */
let instance: Lenis | null = null

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis
}

export const getLenis = () => instance

const navOffset = () => -(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72)

/** Scrolls to an element id (or the top) honouring the sticky navbar. */
export function scrollToTarget(target: string | 0, options: { immediate?: boolean } = {}) {
  const element = target === 0 ? null : document.getElementById(target)
  if (target !== 0 && !element) return false
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (instance) {
    instance.scrollTo(element ?? 0, { offset: element ? navOffset() : 0, immediate: options.immediate || reduced, duration: 1.1 })
  } else {
    const top = element ? element.getBoundingClientRect().top + window.scrollY + navOffset() : 0
    window.scrollTo({ top, behavior: options.immediate || reduced ? 'auto' : 'smooth' })
  }
  return true
}

/** Lock/unlock page scroll (modals, mobile menu). */
export function lockScroll(locked: boolean) {
  if (instance) {
    if (locked) instance.stop()
    else instance.start()
  }
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}
