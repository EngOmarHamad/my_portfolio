import { Mail, Clock } from 'lucide-react'
import { Section } from '@/portfolio/components/ui/Section'
import { ContactForm } from '@/portfolio/components/forms/ContactForm'
import { useContactInfo, useHero } from '@/portfolio/hooks/use-portfolio-data'
import { useLanguage } from '@/shared/i18n'

export function ContactSection() {
  const { data: contactInfo } = useContactInfo()
  const { data: hero } = useHero()
  const { t } = useLanguage()

  return (
    <Section id="contact-section" className="py-20">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">{t.contactSection.badge}</p>
          <h2 className="mt-3 text-3xl font-semibold text-text sm:text-4xl">
            {t.contactSection.titleA} <span className="text-primary">{t.contactSection.titleB}</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">{t.contactSection.subtitle}</p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">{t.contactSection.workAvailability}</p>
              <h3 className="mt-2 text-lg font-semibold text-text">{hero?.availability || t.contactSection.availabilityFallback}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {hero?.short_description || t.contactSection.availabilityDescriptionFallback}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
              <h4 className="text-sm font-semibold text-text">{t.contactSection.directChannels}</h4>
              <div className="mt-4 space-y-3">
                {contactInfo?.email && (
                  <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/30 hover:bg-surface-hover">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-text-tertiary">{t.contactSection.emailResponse}</p>
                      <p className="truncate text-sm font-medium text-text">{contactInfo.email}</p>
                    </div>
                  </a>
                )}

                {contactInfo?.working_hours && (
                  <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-text-tertiary">{t.contactSection.workingHours}</p>
                      <p className="text-sm font-medium text-text">{contactInfo.working_hours}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-1 shadow-card sm:p-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </Section>
  )
}
