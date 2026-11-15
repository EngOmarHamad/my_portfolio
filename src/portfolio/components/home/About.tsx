import { motion } from 'framer-motion'
import { useLanguage } from '@/shared/i18n'
import { Counter, Reveal, Section, SectionHeader } from '@/portfolio/components/ds'
import { useSiteContent } from '@/portfolio/hooks/use-site-content'
import { PORTRAIT } from '@/portfolio/data/content'
import { DURATION, EASE, REVEAL_VIEWPORT, transition } from '@/portfolio/lib/motion'
import type { ProfileVM } from '@/portfolio/data/types'

const CORNERS = [
  'top-0 start-0 border-t border-s',
  'top-0 end-0 border-t border-e',
  'bottom-0 start-0 border-b border-s',
  'bottom-0 end-0 border-b border-e',
]

/** Portrait inside a measured frame: brackets draw in, the photo wipes up. */
function Portrait({ profile, caption }: { profile: ProfileVM; caption: string }) {
  const { portrait } = profile
  return (
    <figure className="relative">
      <div className="relative p-3">
        {CORNERS.map((position, index) => (
          <motion.span
            key={position}
            aria-hidden
            className={`absolute size-6 border-signal ${position}`}
            initial={{ opacity: 0, scale: 1.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={REVEAL_VIEWPORT}
            transition={{ duration: DURATION.base, ease: EASE, delay: 0.1 + index * 0.06 }}
          />
        ))}
        <Reveal variant="clip" className="overflow-hidden rounded-chip bg-panel-2">
          <picture>
            {portrait.avif.length > 0 && <source type="image/avif" srcSet={portrait.avif.join(', ')} sizes="(min-width: 1024px) 400px, 90vw" />}
            {portrait.webp.length > 0 && <source type="image/webp" srcSet={portrait.webp.join(', ')} sizes="(min-width: 1024px) 400px, 90vw" />}
            <img
              src={portrait.fallback}
              alt={portrait.alt}
              width={PORTRAIT.width}
              height={PORTRAIT.height}
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full object-cover grayscale-[20%]"
            />
          </picture>
        </Reveal>
      </div>
      <figcaption className="mt-4 flex justify-between gap-4 px-3 font-mono text-label text-ink-faint">
        <span>{caption}</span>
        <span>{profile.coordinates}</span>
      </figcaption>
    </figure>
  )
}

function splitLead(text: string) {
  const match = /^(.+?[.!?؟])\s+(.*)$/s.exec(text)
  return match ? { lead: match[1], rest: match[2] } : { lead: text, rest: '' }
}

export function About() {
  const { t } = useLanguage()
  const { profile, stats, achievements, testimonials } = useSiteContent()
  const { lead, rest } = splitLead(profile.biography)
  const copy = t.site.about

  return (
    <Section id="about">
      <SectionHeader id="about" index={copy.index} label={copy.label} title={copy.title} intro={copy.intro} />

      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="mx-auto w-full max-w-sm lg:col-span-4 lg:mx-0 lg:max-w-none">
          <Portrait profile={profile} caption={copy.caption} />
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <Reveal>
            <p className="max-w-prose text-lead font-medium text-pretty text-ink">{lead}</p>
          </Reveal>
          {rest && (
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-prose text-pretty text-ink-muted">{rest}</p>
            </Reveal>
          )}

          {stats.length > 0 && (
            <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-chip border border-line bg-line sm:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  className="bg-canvas p-4 sm:p-6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={REVEAL_VIEWPORT}
                  transition={transition(DURATION.base, index * 0.08)}
                >
                  <dt className="label-mono text-ink-faint">{stat.label ?? (stat.key ? copy.stats[stat.key] : '')}</dt>
                  <dd className="mt-2 font-display text-h3 font-semibold text-ink">
                    <Counter value={stat.value} decimals={stat.decimals} prefix={stat.prefix} suffix={stat.suffix} />
                  </dd>
                </motion.div>
              ))}
            </dl>
          )}

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {profile.languages.length > 0 && (
              <div>
                <h3 className="label-mono text-ink-faint">{copy.languages}</h3>
                <ul className="mt-4 space-y-2 text-ink">
                  {profile.languages.map((language) => (
                    <li key={language}>{language}</li>
                  ))}
                </ul>
              </div>
            )}
            {profile.interests.length > 0 && (
              <div>
                <h3 className="label-mono text-ink-faint">{copy.interests}</h3>
                <ul className="mt-4 space-y-2 text-ink">
                  {profile.interests.map((interest) => (
                    <li key={interest}>{interest}</li>
                  ))}
                </ul>
              </div>
            )}
            {achievements.length > 0 && (
              <div id="achievements" className="scroll-mt-(--nav-h) sm:col-span-2">
                <h3 className="label-mono text-ink-faint">{copy.achievements}</h3>
                <ul className="mt-4 divide-y divide-line border-t border-line">
                  {achievements.map((achievement) => (
                    <li key={achievement.id} className="grid gap-2 py-4 sm:grid-cols-[auto_1fr] sm:gap-6">
                      <span className="font-mono text-label text-signal-ink">{achievement.date ? achievement.date.slice(0, 4) : '◆'}</span>
                      <div>
                        <p className="font-medium text-ink">{achievement.title}</p>
                        {achievement.summary && <p className="mt-1 max-w-prose text-sm text-ink-muted">{achievement.summary}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {testimonials.length > 0 && (
        <div id="testimonials" className="mt-24 scroll-mt-(--nav-h)">
          <h3 className="label-mono text-ink-faint">{copy.testimonials}</h3>
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <Reveal key={testimonial.id} as="figure" delay={index * 0.08} className="border-s border-signal ps-6">
                <blockquote className="font-display text-h3 font-semibold text-pretty text-ink">“{testimonial.quote}”</blockquote>
                <figcaption className="mt-4 font-mono text-label text-ink-muted">
                  {testimonial.author}
                  {testimonial.company && ` · ${testimonial.company}`}
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </Section>
  )
}
