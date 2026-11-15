import { ArrowDownRight } from 'lucide-react'
import { useLanguage } from '@/shared/i18n'
import { Magnetic, Reveal, RevealWords, Section, SocialIcon } from '@/portfolio/components/ds'
import { useSiteContent } from '@/portfolio/hooks/use-site-content'
import { scrollToTarget } from '@/portfolio/lib/smooth-scroll'
import { ContactForm } from './ContactForm'
import { CopyEmail } from './CopyEmail'
import { LocalTime } from './LocalTime'

export function Contact() {
  const { t } = useLanguage()
  const { profile, socials } = useSiteContent()
  const copy = t.site.contact

  const startProject = () => {
    scrollToTarget('contact-form')
    window.setTimeout(() => document.getElementById('contact-name')?.focus({ preventScroll: true }), 600)
  }

  const details = [
    profile.phone && { label: copy.phone, value: profile.phone, href: `tel:${profile.phone.replace(/\s+/g, '')}`, ltr: true },
    profile.location && { label: copy.location, value: profile.location },
    profile.workingHours && { label: copy.hours, value: profile.workingHours },
  ].filter(Boolean) as Array<{ label: string; value: string; href?: string; ltr?: boolean }>

  return (
    <Section id="contact" className="border-t border-line">
      <p className="label-mono flex items-center gap-3 text-ink-muted">
        <span className="text-signal-ink">// {copy.index}</span>
        <span aria-hidden className="h-px w-8 bg-line-strong" />
        {copy.label}
      </p>

      <h2 id="contact-title" className="mt-8 max-w-6xl font-display text-hero font-bold text-balance display-tight text-ink">
        <RevealWords text={copy.headline} />
      </h2>

      <div className="mt-12 flex flex-wrap items-center gap-x-12 gap-y-6">
        <Magnetic>
          <button
            type="button"
            onClick={startProject}
            className="group/btn inline-flex min-h-16 items-center gap-3 rounded-chip bg-signal px-8 text-body font-medium text-on-signal"
          >
            {copy.cta}
            <ArrowDownRight className="size-5 transition-transform duration-500 ease-precise group-hover/btn:translate-y-0.5 rtl:-scale-x-100" aria-hidden />
          </button>
        </Magnetic>
        <div>
          <p className="label-mono text-ink-faint">{copy.localTime}</p>
          <p className="mt-1 font-mono text-h3 text-ink">
            <LocalTime timeZone={profile.timeZone} />
          </p>
        </div>
      </div>

      <div className="mt-24 grid gap-16 lg:grid-cols-12 lg:gap-8">
        <Reveal className="space-y-10 lg:col-span-5">
          <p className="max-w-prose text-pretty text-ink-muted">{copy.intro}</p>
          {profile.email && (
            <div>
              <p className="label-mono text-ink-faint">{copy.email}</p>
              <div className="mt-2">
                <CopyEmail email={profile.email} />
              </div>
            </div>
          )}
          {details.length > 0 && (
            <dl className="grid gap-6 sm:grid-cols-2">
              {details.map((detail) => (
                <div key={detail.label}>
                  <dt className="label-mono text-ink-faint">{detail.label}</dt>
                  <dd className="mt-2 text-ink">
                    {detail.href ? (
                      <a href={detail.href} className="link-wipe" dir={detail.ltr ? 'ltr' : undefined}>
                        {detail.value}
                      </a>
                    ) : (
                      detail.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          )}
          {socials.length > 0 && (
            <div id="social-links" className="scroll-mt-(--nav-h)">
              <p className="label-mono text-ink-faint">{copy.elsewhere}</p>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {socials.map((social) => (
                  <li key={social.id}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex min-h-14 items-center gap-4 text-ink transition-colors hover:text-signal-ink"
                    >
                      <SocialIcon platform={social.platform} className="size-4 text-ink-muted transition-colors group-hover:text-signal-ink" />
                      <span className="flex-1">{social.label}</span>
                      <span aria-hidden className="font-mono text-label text-ink-faint transition-transform duration-500 ease-precise group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5">
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
          <ContactForm email={profile.email} />
        </Reveal>
      </div>
    </Section>
  )
}
