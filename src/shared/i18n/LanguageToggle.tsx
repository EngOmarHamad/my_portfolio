import { motion } from 'framer-motion'
import { Languages } from 'lucide-react'
import { useLanguage } from './LanguageContext'

export function LanguageToggle() {
  const { lang, toggleLang, t } = useLanguage()

  return (
    <motion.button
      onClick={toggleLang}
      className="relative flex h-9 min-w-9 items-center justify-center gap-1.5 rounded-lg border border-border/40 px-2 text-text-secondary transition-all duration-200 hover:border-border hover:bg-surface-hover hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      aria-label={lang === 'en' ? t.toggle.toArabic : t.toggle.toEnglish}
      title={lang === 'en' ? t.toggle.toArabic : t.toggle.toEnglish}
      whileTap={{ scale: 0.9 }}
    >
      <Languages className="h-4 w-4" />
      <span className="text-xs font-bold">{lang === 'en' ? t.toggle.arabicShort : t.toggle.englishShort}</span>
    </motion.button>
  )
}
