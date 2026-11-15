import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { useLanguage } from '@/shared/i18n'
import { usePrefersReducedMotion } from '@/portfolio/lib/environment'

interface CounterProps {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  duration?: number
}

/** Counts from 0 to `value` once in view (ease-out cubic). Static under reduced motion. */
export function Counter({ value, decimals = 0, prefix = '', suffix = '', duration = 800 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduced = usePrefersReducedMotion()
  const { lang } = useLanguage()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!inView || reduced) return
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      setCurrent(value * (1 - Math.pow(1 - progress, 3)))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduced, value, duration])

  const shown = reduced ? value : current
  const formatted = new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(shown)

  return (
    <span ref={ref} className="tabular-nums">
      <span className="sr-only">{`${prefix}${value}${suffix}`}</span>
      <span aria-hidden>
        {prefix}
        {formatted}
        {suffix}
      </span>
    </span>
  )
}
