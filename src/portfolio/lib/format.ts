import type { Language } from '@/shared/i18n'

const locale = (lang: Language) => (lang === 'ar' ? 'ar' : 'en-GB')

/** "2024-05" → "May 2024" (or Arabic). Returns '' for missing dates. */
export function formatMonth(value: string, lang: Language) {
  const match = /^(\d{4})-(\d{2})/.exec(value)
  if (!match) return ''
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1))
  return new Intl.DateTimeFormat(locale(lang), { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date)
}

export function formatYear(value: string) {
  return /^\d{4}/.exec(value)?.[0] ?? ''
}
