import { useEffect, useRef, useState } from 'react'
import { m, useMotionValueEvent, useScroll } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useLanguage } from '@/shared/i18n'
import { cn } from '@/shared/utils/cn'
import { Reveal, Section, SectionHeader, SpotlightCard } from '@/portfolio/components/ds'
import { useSiteContent } from '@/portfolio/hooks/use-site-content'
import type { ExperienceVM } from '@/portfolio/data/types'
import { formatMonth, formatYear } from '@/portfolio/lib/format'
import { DURATION, EASE } from '@/portfolio/lib/motion'

/** Viewport line (as a fraction of height) the timeline "draws" toward. */
const DRAW_LINE = 0.6

function Timeline({ items }: { items: ExperienceVM[] }) {
  const { t, lang } = useLanguage()
  const list = useRef<HTMLOListElement>(null)
  const offsets = useRef<number[]>([])
  const [reached, setReached] = useState(0)
  const { scrollYProgress } = useScroll({ target: list, offset: [`start ${DRAW_LINE}`, `end ${DRAW_LINE}`] })

  useEffect(() => {
    const node = list.current
    if (!node) return
    const measure = () => {
      const height = node.offsetHeight || 1
      offsets.current = Array.from(node.children)
        .filter((child): child is HTMLElement => child instanceof HTMLElement && child.dataset.milestone !== undefined)
        .map((child) => child.offsetTop / height)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [items.length])

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const count = offsets.current.filter((offset) => offset <= progress + 0.001).length
    setReached((current) => (current === count ? current : count))
  })

  return (
    <ol ref={list} className="relative">
      <span aria-hidden className="absolute start-[7px] top-2 bottom-2 w-px bg-line" />
      <m.span
        aria-hidden
        className="absolute start-[7px] top-2 bottom-2 w-px origin-top bg-signal"
        style={{ scaleY: scrollYProgress }}
      />
      {items.map((item, index) => {
        const lit = index < reached
        const range = [formatMonth(item.start, lang), item.isCurrent ? t.site.experience.present : formatMonth(item.end, lang)]
          .filter(Boolean)
          .join(' — ')
        return (
          <li key={item.id} data-milestone className="relative ps-12 pb-16 last:pb-0">
            <span
              aria-hidden
              className={cn(
                'absolute start-0 top-1.5 grid size-[15px] place-items-center rounded-full border bg-canvas transition-colors duration-500',
                lit ? 'border-signal' : 'border-line-strong',
              )}
            >
              <span className={cn('size-[5px] rounded-full transition-[transform,background-color] duration-500 ease-precise', lit ? 'scale-100 bg-signal' : 'scale-50 bg-line-strong')} />
            </span>
            <m.div
              initial={{ opacity: 0, clipPath: lang === 'ar' ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)' }}
              whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              transition={{ duration: DURATION.slow, ease: EASE }}
            >
              <p className={cn('font-mono text-label transition-colors duration-500', lit ? 'text-signal-ink' : 'text-ink-faint')}>{range}</p>
              <h3 className="mt-3 font-display text-h3 font-semibold text-ink">{item.role}</h3>
              <p className="mt-1 text-ink-muted">{item.organization}</p>
              {item.summary && <p className="mt-4 max-w-prose text-sm text-pretty text-ink-muted">{item.summary}</p>}
              {item.highlights.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3 text-sm text-ink">
                      <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-circuit" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              )}
            </m.div>
          </li>
        )
      })}
    </ol>
  )
}

export function Experience() {
  const { t, lang } = useLanguage()
  const { experience, education, certificates } = useSiteContent()
  const copy = t.site.experience

  return (
    <Section id="experience">
      <SectionHeader id="experience" index={copy.index} label={copy.label} title={copy.title} intro={copy.intro} />

      <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <Timeline items={experience} />
        </div>

        <aside className="space-y-12 lg:col-span-4 lg:col-start-9">
          {education.length > 0 && (
            <div id="education" className="scroll-mt-(--nav-h)">
              <h3 className="label-mono text-ink-faint">{copy.education}</h3>
              <ul className="mt-4 space-y-4">
                {education.map((item, index) => (
                  <Reveal key={item.id} as="li" delay={index * 0.08}>
                    <SpotlightCard className="p-6">
                      <p className="font-mono text-label text-ink-faint">
                        {[formatYear(item.start), formatYear(item.end)].filter(Boolean).join(' — ')}
                      </p>
                      <p className="mt-3 font-medium text-ink">{item.degree}</p>
                      <p className="mt-1 text-sm text-ink-muted">{item.institution}</p>
                      {item.grade && (
                        <p className="mt-4 font-mono text-label text-ink-muted">
                          {copy.grade} <span className="text-signal-ink">{item.grade}</span>
                        </p>
                      )}
                    </SpotlightCard>
                  </Reveal>
                ))}
              </ul>
            </div>
          )}

          {certificates.length > 0 && (
            <div id="certificates" className="scroll-mt-(--nav-h)">
              <h3 className="label-mono text-ink-faint">{copy.certificates}</h3>
              <ul className="mt-4 space-y-4">
                {certificates.map((item, index) => (
                  <Reveal key={item.id} as="li" delay={index * 0.08}>
                    <SpotlightCard className="p-6">
                      <p className="font-mono text-label text-ink-faint">
                        {item.issuer}
                        {item.date && ` · ${formatMonth(item.date, lang)}`}
                      </p>
                      <p className="mt-3 font-medium text-ink">{item.title}</p>
                      {item.summary && <p className="mt-2 text-sm text-ink-muted">{item.summary}</p>}
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-wipe mt-4 inline-flex min-h-11 items-center gap-2 text-sm text-ink"
                        >
                          {copy.credential}
                          <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden />
                        </a>
                      )}
                    </SpotlightCard>
                  </Reveal>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </Section>
  )
}
