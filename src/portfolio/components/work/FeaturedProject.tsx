import { m } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useLanguage } from '@/shared/i18n'
import { Reveal, Tag } from '@/portfolio/components/ds'
import type { ProjectVM } from '@/portfolio/data/types'
import { isPlainClick, useTilt } from './interaction'
import { ProjectCover } from './ProjectCover'
import { ProjectLinks } from './ProjectLinks'

/** The lead case study: a large plate with its story beside it. */
export function FeaturedProject({ project, onOpen }: { project: ProjectVM; onOpen: (id: string) => void }) {
  const { t } = useLanguage()
  const tilt = useTilt()

  return (
    <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-8">
      <Reveal variant="clip" className="lg:col-span-7">
        <m.a
          href={`/projects/${project.routeId}`}
          onClick={(event) => {
            if (!isPlainClick(event)) return
            event.preventDefault()
            onOpen(project.routeId)
          }}
          data-cursor={`${t.site.work.viewCase} →`}
          aria-label={`${t.site.work.viewCase}: ${project.title}`}
          className="spotlight group block aspect-[16/10] overflow-hidden rounded-card border border-line"
          style={tilt.style}
          onPointerMove={tilt.onPointerMove}
          onPointerLeave={tilt.onPointerLeave}
        >
          <div className="size-full transition-transform duration-700 ease-precise group-hover:scale-105">
            <ProjectCover project={project} size="feature" />
          </div>
        </m.a>
      </Reveal>

      <div className="lg:col-span-5">
        <Reveal>
          <p className="label-mono flex items-center gap-3 text-signal-ink">
            <span aria-hidden className="size-1.5 rounded-full bg-signal" />
            {t.site.work.featured}
            <span className="text-ink-faint">
              {project.category}
              {project.year && ` · ${project.year}`}
            </span>
          </p>
          <h3 className="mt-6 font-display text-title font-bold text-balance text-ink">{project.title}</h3>
          <p className="mt-6 max-w-prose text-pretty text-ink-muted">{project.summary}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <li key={tech}>
                <Tag>{tech}</Tag>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={`/projects/${project.routeId}`}
              onClick={(event) => {
                if (!isPlainClick(event)) return
                event.preventDefault()
                onOpen(project.routeId)
              }}
              className="group/btn inline-flex min-h-12 items-center gap-2 rounded-chip bg-signal px-6 text-sm font-medium text-on-signal"
            >
              {t.site.work.viewCase}
              <ArrowUpRight className="size-4 transition-transform duration-500 ease-precise group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 rtl:-scale-x-100" aria-hidden />
            </a>
            <ProjectLinks links={project.links} />
          </div>
        </Reveal>
      </div>
    </article>
  )
}
