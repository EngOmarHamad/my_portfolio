import { useSyncExternalStore } from 'react'

function mediaStore(query: string) {
  const subscribe = (callback: () => void) => {
    const list = window.matchMedia(query)
    list.addEventListener('change', callback)
    return () => list.removeEventListener('change', callback)
  }
  const getSnapshot = () => window.matchMedia(query).matches
  return { subscribe, getSnapshot }
}

const reducedMotion = mediaStore('(prefers-reduced-motion: reduce)')
const finePointer = mediaStore('(hover: hover) and (pointer: fine)')
const desktop = mediaStore('(min-width: 768px)')

export const usePrefersReducedMotion = () =>
  useSyncExternalStore(reducedMotion.subscribe, reducedMotion.getSnapshot, () => false)

/** True for mouse/trackpad devices; false on touch. */
export const useFinePointer = () =>
  useSyncExternalStore(finePointer.subscribe, finePointer.getSnapshot, () => false)

export const useIsDesktop = () => useSyncExternalStore(desktop.subscribe, desktop.getSnapshot, () => true)
