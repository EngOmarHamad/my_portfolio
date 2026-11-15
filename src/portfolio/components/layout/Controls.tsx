import type { MouseEvent } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/portfolio/hooks/useTheme'
import { useLanguage } from '@/shared/i18n'
import { cn } from '@/shared/utils/cn'

const control =
  'inline-flex size-11 items-center justify-center rounded-chip border border-line text-ink-muted transition-colors duration-200 hover:border-line-strong hover:text-ink'

export function ThemeSwitch({ className }: { className?: string }) {
  const { isDark, toggleTheme } = useTheme()
  const { t } = useLanguage()
  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    toggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
  }
  return (
    <button type="button" onClick={onClick} className={cn(control, className)} aria-label={isDark ? t.site.nav.toLight : t.site.nav.toDark}>
      {isDark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
    </button>
  )
}

export function LanguageSwitch({ className }: { className?: string }) {
  const { lang, toggleLang, t } = useLanguage()
  return (
    <button
      type="button"
      onClick={toggleLang}
      className={cn(control, 'font-mono text-label', className)}
      aria-label={lang === 'en' ? t.toggle.toArabic : t.toggle.toEnglish}
      lang={lang === 'en' ? 'ar' : 'en'}
    >
      {lang === 'en' ? 'ع' : 'EN'}
    </button>
  )
}
