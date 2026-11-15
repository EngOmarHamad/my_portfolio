import { Link } from 'react-router-dom'
import { ArrowUpRight, ExternalLink } from 'lucide-react'
import { Section, SectionHeader } from '@/portfolio/components/ui/Section'
import { useProjects } from '@/portfolio/hooks/use-portfolio-data'
import { useLanguage } from '@/shared/i18n'

export function FeaturedProjects() {
  const { data: projects = [] } = useProjects()
  const { t } = useLanguage()
  const featured = projects.filter((p) => p.is_featured).slice(0, 3)
  const display = featured.length > 0 ? featured : projects.slice(0, 3)

  return (
    <Section className="py-20">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader title={t.featured.title} subtitle={t.featured.subtitle} align="left" />
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text transition-colors hover:border-primary/40 hover:text-primary"
          >
            <span>{t.featured.viewAll}</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {display.map((project, i) => {
            const techs = (project.tech_stack ?? (project as { technologies?: string[] }).technologies ?? []) as string[]
            return (
              <article key={project.id || i} className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card">
                <div className="aspect-[16/10] w-full overflow-hidden bg-surface-hover">
                  <img
                    src={project.thumbnail_url || `https://picsum.photos/seed/${project.id || i}/800/500`}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      {project.category || t.featured.categoryFallback}
                    </span>
                    <span className="text-xs font-medium text-secondary">0{i + 1}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-text">{project.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text-secondary">
                    {project.description || t.featured.descriptionFallback}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {techs.slice(0, 4).map((tech) => (
                      <span key={tech} className="rounded-md border border-border bg-surface-hover px-2.5 py-1 text-xs text-text-secondary">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-xs text-text-tertiary">
                      {project.github_url ? t.featured.openSource : t.featured.enterpriseSystem}
                    </span>
                    <Link
                      to={`/projects/${project.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark"
                    >
                      <span>{t.featured.caseStudy}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
