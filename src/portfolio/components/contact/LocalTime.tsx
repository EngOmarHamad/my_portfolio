import { useEffect, useState } from 'react'
import { useLanguage } from '@/shared/i18n'

/** Live wall clock for a time zone, refreshed every second. */
export function LocalTime({ timeZone }: { timeZone: string }) {
  const { lang } = useLanguage()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const locale = lang === 'ar' ? 'ar' : 'en-GB'
  const time = new Intl.DateTimeFormat(locale, { timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now)
  const zone =
    new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'shortOffset' }).formatToParts(now).find((part) => part.type === 'timeZoneName')?.value ?? ''

  return (
    <time dateTime={now.toISOString()} className="tabular-nums">
      {time}
      <span className="ms-2 text-ink-faint">{zone}</span>
    </time>
  )
}
