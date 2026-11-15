import { useSyncExternalStore } from 'react'

declare global {
  interface Window {
    __ohIntroDone?: boolean
  }
}

/** The intro (preloader) lives in index.html; this mirrors its state into React. */
const isDone = () => window.__ohIntroDone === true || !document.documentElement.classList.contains('intro-run')

const subscribe = (callback: () => void) => {
  window.addEventListener('oh:intro-done', callback)
  return () => window.removeEventListener('oh:intro-done', callback)
}

export const useIntroDone = () => useSyncExternalStore(subscribe, isDone, () => true)
