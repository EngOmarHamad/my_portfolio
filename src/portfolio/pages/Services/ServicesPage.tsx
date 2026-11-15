import { ArrowUpRight } from 'lucide-react'
import { useLanguage } from '@/shared/i18n'
import { Button, Reveal, SpotlightCard } from '@/portfolio/components/ds'
import { useServices } from '@/portfolio/hooks/use-portfolio-data'
import { PageShell, StatusMessage } from '../PageShell'

export function ServicesPage() {
  const { t } = useLanguage()
  const copy = t.site.pages.services
  const { data: services = [], isLoading, isError } = useServices()

  return (
    <PageShell id="services" index="S" label={copy.label} title={copy.title} intro={copy.intro}>
      {isLoading && <StatusMessage role="status">{t.site.pages.loading}</StatusMessage>}
      {isError && <StatusMessage role="alert">{t.site.pages.error}</StatusMessage>}
      {!isLoading && !isError && services.length === 0 && <StatusMessage>{copy.empty}</StatusMessage>}
      <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <Reveal key={service.id} as="li" delay={index * 0.06}>
            <SpotlightCard className="flex h-full flex-col p-8">
              <span className="font-mono text-label text-signal-ink">{String(index + 1).padStart(2, '0')}</span>
              <h2 className="mt-6 font-display text-h3 font-semibold text-ink">{service.title}</h2>
              <p className="mt-4 flex-1 text-sm text-pretty text-ink-muted">{service.description}</p>
              {service.price != null && (
                <p className="mt-6 border-t border-line pt-4 font-mono text-label text-ink">
                  {copy.from} ${service.price}
                </p>
              )}
            </SpotlightCard>
          </Reveal>
        ))}
      </ol>
      <div className="mt-16">
        <Button to="/#contact">
          {copy.cta}
          <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden />
        </Button>
      </div>
    </PageShell>
  )
}
