import { useCallback, useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark'

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') return stored
  } catch {}
  return null
}

function getTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme()
}

let currentTheme = getTheme()
const listeners = new Set<() => void>()

function setTheme(theme: Theme) {
  currentTheme = theme
  try {
    localStorage.setItem('theme', theme)
  } catch {}
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  listeners.forEach((l) => l())
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

function getSnapshot() {
  return currentTheme
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot)

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }, [theme])

  const setThemeValue = useCallback((t: Theme) => {
    setTheme(t)
  }, [])

  return { theme, toggleTheme, setTheme: setThemeValue, isDark: theme === 'dark' }
}

if (typeof window !== 'undefined') {
  const stored = getStoredTheme()
  if (stored) {
    setTheme(stored)
  } else {
    setTheme(getSystemTheme())
  }
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!getStoredTheme()) {
      setTheme(e.matches ? 'dark' : 'light')
    }
  })
}
