import { useCallback, useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'
const listeners = new Set<() => void>()

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    return null
  }
}

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(theme)
}

// index.html already applied the class before first paint; mirror it here.
let currentTheme: Theme =
  typeof window === 'undefined' ? 'dark' : (readStoredTheme() ?? systemTheme())

function commit(theme: Theme, persist: boolean) {
  currentTheme = theme
  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* storage unavailable */
    }
  }
  applyTheme(theme)
  listeners.forEach((listener) => listener())
}

if (typeof window !== 'undefined') {
  applyTheme(currentTheme)
  window
    .matchMedia('(prefers-color-scheme: light)')
    .addEventListener('change', (event) => {
      if (!readStoredTheme()) commit(event.matches ? 'light' : 'dark', false)
    })
}

interface RevealOrigin {
  x: number
  y: number
}

/**
 * Switches theme with a circular reveal from `origin` when the browser supports
 * View Transitions and the user allows motion; otherwise switches instantly.
 */
function transitionTo(theme: Theme, origin?: RevealOrigin) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || reduced || !origin) {
    commit(theme, true)
    return
  }

  const radius = Math.hypot(
    Math.max(origin.x, window.innerWidth - origin.x),
    Math.max(origin.y, window.innerHeight - origin.y),
  )
  const transition = document.startViewTransition(() => commit(theme, true))
  transition.ready
    .then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${origin.x}px ${origin.y}px)`,
            `circle(${radius}px at ${origin.x}px ${origin.y}px)`,
          ],
        },
        { duration: 500, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
      )
    })
    .catch(() => {
      /* transition skipped */
    })
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => {
    listeners.delete(callback)
  }
}

const getSnapshot = () => currentTheme
const getServerSnapshot = (): Theme => 'dark'

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const toggleTheme = useCallback(
    (origin?: RevealOrigin) => transitionTo(theme === 'light' ? 'dark' : 'light', origin),
    [theme],
  )
  const setTheme = useCallback((next: Theme) => commit(next, true), [])

  return { theme, toggleTheme, setTheme, isDark: theme === 'dark' }
}
