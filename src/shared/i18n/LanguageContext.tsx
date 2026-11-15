import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { STRINGS } from './translations'
import type { Language, Strings } from './translations'

const STORAGE_KEY = 'portfolio-lang'

interface LanguageContextValue {
  lang: Language
  setLang: (lang: Language) => void
  toggleLang: () => void
  t: Strings
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function getInitialLang(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'ar') return stored
  } catch {
    /* storage unavailable */
  }
  return 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(getInitialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* storage unavailable */
    }
  }, [lang])

  const setLang = (next: Language) => setLangState(next)
  const toggleLang = () => setLangState((prev) => (prev === 'en' ? 'ar' : 'en'))

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t: STRINGS[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return ctx
}
