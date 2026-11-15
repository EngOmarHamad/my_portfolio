import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/shared/i18n'
import { Button, Container } from '@/portfolio/components/ds'
import { CaseStudyContent } from '@/portfolio/components/work/CaseStudyContent'
import { useSiteContent } from '@/portfolio/hooks/use-site-content'
import { useProjects } from '@/portfolio/hooks/use-portfolio-data'

/** Deep-linkable case study (the same content the modal shows). */
export function ProjectDetailPage() {
  const { id = '' } = useParams()
  const { t } = useLanguage()
  const { projects, profile } = useSiteContent()
  const { isPending } = useProjects()
  const project = projects.find((item) => item.routeId === id || item.id === id)

  useEffect(() => {
    if (project) document.title = `${project.title} — ${profile.name}`
  }, [project, profile.name])

  return (
    <Container className="max-w-5xl pt-[calc(var(--nav-h)+4rem)] pb-24">
      <Button variant="ghost" to="/#work" className="-ms-6 mb-8">
        <ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden />
        {t.site.work.case.back}
      </Button>
      {project ? (
        <CaseStudyContent project={project} titleId="case-title" />
      ) : isPending ? (
        <div className="min-h-svh" aria-busy="true" />
      ) : (
        <div className="py-24">
          <h1 className="font-display text-h2 font-bold display-tight text-ink">404</h1>
          <p className="mt-4 text-ink-muted">{t.site.work.case.notFound}</p>
        </div>
      )}
    </Container>
  )
}
