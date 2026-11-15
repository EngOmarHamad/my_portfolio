import { lazy, Suspense, useEffect, useState } from 'react'
import { m } from 'framer-motion'
import { ArrowDownRight, Download } from 'lucide-react'
import { useLanguage } from '@/shared/i18n'
import { Button, Container, Magnetic, RevealWords } from '@/portfolio/components/ds'
import { useSiteContent } from '@/portfolio/hooks/use-site-content'
import { useGoToSection } from '@/portfolio/hooks/use-section-nav'
import { useIntroDone } from '@/portfolio/lib/intro'
import { useIsDesktop, usePrefersReducedMotion } from '@/portfolio/lib/environment'
import { DURATION, STAGGER, transition } from '@/portfolio/lib/motion'

const SystemMap = lazy(() => import('@/portfolio/components/experience/SystemMap'))

/** Max wait for CMS identity data before revealing with the fallback copy. */
const SETTLE_TIMEOUT = 900

function splitTitle(title: string) {
  const [main, ...rest] = title.split('|')
  return { main: main.trim(), detail: rest.join('|').trim() }
}

export function Hero() {
  const { t, lang } = useLanguage()
  const { profile, isSettled } = useSiteContent()
  const introDone = useIntroDone()
  const reduced = usePrefersReducedMotion()
  const desktop = useIsDesktop()
  const goTo = useGoToSection()
  const [waitedEnough, setWaitedEnough] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setWaitedEnough(true), SETTLE_TIMEOUT)
    return () => window.clearTimeout(timer)
  }, [])

  const play = introDone && (isSettled || waitedEnough)
  const name = (lang === 'ar' && t.site.hero.name) || profile.name
  const { main: title, detail } = splitTitle((lang === 'ar' && t.site.hero.title) || profile.title)
  const nameWords = name.split(/\s+/).length
  const afterHeadline = nameWords * STAGGER + 0.35

  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-svh flex-col overflow-hidden pt-(--nav-h)">
      <div className="absolute inset-0 -z-10 opacity-35 md:start-[38%] md:opacity-100 [mask-image:linear-gradient(to_right,transparent,#000_30%)] rtl:[mask-image:linear-gradient(to_left,transparent,#000_30%)]">
        {introDone && (
          <Suspense fallback={null}>
            <SystemMap animate={desktop && !reduced} className="size-full" />
          </Suspense>
        )}
        <span className="sr-only">{t.site.hero.mapLabel}</span>
      </div>

      <Container className="flex flex-1 flex-col justify-center py-16">
        <m.div
          className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: play ? 1 : 0 }}
          transition={transition(DURATION.base)}
        >
          <span className="label-mono inline-flex items-center gap-3 text-ink">
            <span className={profile.isAvailable ? 'status-dot' : 'inline-block size-2 rounded-full bg-ink-faint'} aria-hidden />
            {profile.availability || (profile.isAvailable ? t.site.hero.available : t.site.hero.unavailable)}
          </span>
          <span className="label-mono hidden text-ink-faint sm:inline">{profile.coordinates}</span>
        </m.div>

        <h1 id="hero-title" className="max-w-5xl font-display text-hero font-bold display-tight text-ink">
          <RevealWords text={name} play={play} />
          <span className="mt-4 block text-h3 font-semibold tracking-normal text-ink-muted">
            <RevealWords text={title} play={play} delay={nameWords * STAGGER} />
          </span>
        </h1>

        {detail && (
          <m.p
            className="mt-4 font-mono text-label text-ink-faint"
            initial={{ opacity: 0 }}
            animate={{ opacity: play ? 1 : 0 }}
            transition={transition(DURATION.base, afterHeadline)}
          >
            {detail}
          </m.p>
        )}

        <div className="mt-12 max-w-xl">
          {/* Painted immediately (it is the LCP element); only the actions animate in. */}
          <p className="text-body text-pretty text-ink-muted">{t.site.hero.statement}</p>
          <m.div
            className="mt-8 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={play ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={transition(DURATION.slow, afterHeadline)}
          >
            <Magnetic>
              <Button
                href="/#work"
                onClick={(event) => {
                  event.preventDefault()
                  goTo('work')
                }}
              >
                {t.site.hero.viewWork}
                <ArrowDownRight className="size-4 transition-transform duration-500 ease-precise group-hover/btn:translate-y-0.5 rtl:-scale-x-100" aria-hidden />
              </Button>
            </Magnetic>
            {profile.resumeIsFile ? (
              <Button variant="secondary" href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" download>
                {t.site.hero.downloadCv}
                <Download className="size-4" aria-hidden />
              </Button>
            ) : (
              <Button variant="secondary" to={profile.resumeUrl}>
                {t.site.hero.downloadCv}
                <Download className="size-4" aria-hidden />
              </Button>
            )}
          </m.div>
        </div>
      </Container>

      <Container className="pb-8">
        <m.div
          className="flex items-end justify-between border-t border-line pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: play ? 1 : 0 }}
          transition={transition(DURATION.base, afterHeadline + 0.2)}
        >
          <a
            href="/#about"
            onClick={(event) => {
              event.preventDefault()
              goTo('about')
            }}
            className="label-mono group flex min-h-11 items-center gap-3 text-ink-muted hover:text-ink"
          >
            <span aria-hidden className="relative block h-8 w-px overflow-hidden bg-line">
              <span className="scroll-cue absolute inset-0 bg-signal" />
            </span>
            {t.site.hero.scroll}
          </a>
          <p className="label-mono text-end text-ink-faint">
            {t.site.hero.based}
            <span className="block text-ink-muted">{profile.location}</span>
          </p>
        </m.div>
      </Container>
    </section>
  )
}
