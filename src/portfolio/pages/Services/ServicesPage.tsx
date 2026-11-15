import { Link } from 'react-router-dom'
import { ArrowUpRight, BriefcaseBusiness } from 'lucide-react'
import { PageTransition } from '@/portfolio/components/layout/PageTransition'
import { Section, SectionHeader } from '@/portfolio/components/ui/Section'
import { useServices } from '@/portfolio/hooks/use-portfolio-data'

export function ServicesPage() {
  const { data: services = [], isLoading, isError } = useServices()

  return (
    <PageTransition>
      <Section>
        <SectionHeader title="Services" subtitle="Ways we can work together, from architecture to delivery." />
        {isLoading && <p className="text-center text-text-secondary">Loading services…</p>}
        {isError && <p role="alert" className="text-center text-text-secondary">Services could not be loaded. Please try again later.</p>}
        {!isLoading && !isError && services.length === 0 && <p className="text-center text-text-secondary">Services will be listed here soon.</p>}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article key={service.id} className="flex h-full flex-col rounded-xl border border-border bg-surface p-6">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                <BriefcaseBusiness className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 className="text-xl text-text">{service.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">{service.description}</p>
              {service.price != null && <p className="mt-5 border-t border-border pt-4 text-sm font-semibold text-text">From ${service.price}</p>}
            </article>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-light">Discuss a project <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </Section>
    </PageTransition>
  )
}
