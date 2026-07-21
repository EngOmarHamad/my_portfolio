import { useCallback, useSyncExternalStore } from 'react'

function getScrollProgress() {
  if (typeof window === 'undefined') return 0
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  return docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0
}

function subscribe(callback: () => void) {
  window.addEventListener('scroll', callback, { passive: true })
  window.addEventListener('resize', callback, { passive: true })
  return () => {
    window.removeEventListener('scroll', callback)
    window.removeEventListener('resize', callback)
  }
}

export function useScrollProgress() {
  const progress = useSyncExternalStore(
    subscribe,
    useCallback(() => getScrollProgress(), []),
  )
  return progress
}
