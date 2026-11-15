import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useLanguage } from '@/shared/i18n'
import { Section, SectionHeader } from '@/portfolio/components/ds'
import { useSiteContent } from '@/portfolio/hooks/use-site-content'
import { CaseStudyModal } from './CaseStudyModal'
import { FeaturedProject } from './FeaturedProject'
import { ProjectGrid } from './ProjectGrid'
import { useCaseStudy } from './use-case-study'

interface WorkProps {
  /** Page variant: h1 header and no "browse all" link. */
  standalone?: boolean
}

export function Work({ standalone }: WorkProps) {
  const { t } = useLanguage()
  const { projects } = useSiteContent()
  const { openId, open, close } = useCaseStudy()
  const copy = t.site.work

  const featured = projects.find((project) => project.featured) ?? projects[0]
  const rest = projects.filter((project) => project !== featured)
  const openProject = projects.find((project) => project.routeId === openId) ?? null

  return (
    <Section id="work" className={standalone ? 'pt-(--nav-h)' : undefined}>
      <SectionHeader
        id="work"
        as={standalone ? 'h1' : 'h2'}
        index={copy.index}
        label={copy.label}
        title={standalone ? copy.pageTitle : copy.title}
        intro={standalone ? copy.pageIntro : copy.intro}
      />
      {featured && <FeaturedProject project={featured} onOpen={open} />}
      {rest.length > 0 && (
        <div className="mt-24">
          <ProjectGrid projects={rest} onOpen={open} />
        </div>
      )}
      {!standalone && (
        <div className="mt-12 flex justify-end">
          <Link to="/projects" className="link-wipe inline-flex min-h-11 items-center gap-2 text-sm text-ink">
            {copy.viewAll}
            <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden />
          </Link>
        </div>
      )}
      <CaseStudyModal project={openProject} onClose={close} />
    </Section>
  )
}
