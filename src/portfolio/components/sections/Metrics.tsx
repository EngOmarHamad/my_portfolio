import { useAbout, useCertificates, useHero, useProjects, useTechStack } from '@/portfolio/hooks/use-portfolio-data'
import { useLanguage } from '@/shared/i18n'

export function Metrics() {
  const { data: hero } = useHero()
  const { data: about } = useAbout()
  const { data: projects = [] } = useProjects()
  const { data: certificates = [] } = useCertificates()
  const { data: stack = [] } = useTechStack()
  const { t } = useLanguage()

  const stats = hero?.statistics as Array<{ label: string; value: string }> | undefined
  const metrics = stats && stats.length > 0 ? stats : [
    { value: String(about?.years_experience ?? 0), label: t.metrics.yearsExperience },
    { value: String(projects.length), label: t.metrics.projectsDelivered },
    { value: String(certificates.length), label: t.metrics.certifications },
    { value: String(stack.length), label: t.metrics.technologies },
  ]

  return (
    <section className="px-5 sm:px-8 lg:px-12 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className="rounded-xl border border-border bg-surface p-6 text-center shadow-card"
            >
              <div className={`text-3xl font-semibold sm:text-4xl ${index % 2 === 0 ? 'text-primary' : 'text-secondary'}`}>
                {metric.value}
              </div>
              <div className="mt-2 text-sm text-text-secondary">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
