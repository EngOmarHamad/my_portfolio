import { useLanguage } from '@/shared/i18n'

export function SkipNav() {
  const { t } = useLanguage()
  return (
    <a
      href="#main-content"
      className="fixed start-4 top-4 z-[200] -translate-y-24 rounded-chip bg-signal px-5 py-3 text-sm font-medium text-on-signal transition-transform duration-200 focus:translate-y-0"
    >
      {t.site.nav.skip}
    </a>
  )
}
