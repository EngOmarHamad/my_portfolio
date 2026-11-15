import { m } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useLanguage } from '@/shared/i18n'
import { Tag } from '@/portfolio/components/ds'
import type { ProjectVM } from '@/portfolio/data/types'
import { DURATION, EASE, REVEAL_VIEWPORT } from '@/portfolio/lib/motion'
import { ProjectCover } from './ProjectCover'
import { isPlainClick, useTilt } from './interaction'

interface ProjectCardProps {
  project: ProjectVM
  index: number
  onOpen: (id: string) => void
}

export function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const { t } = useLanguage()
  const tilt = useTilt()

  return (
    <m.a
      href={`/projects/${project.routeId}`}
      onClick={(event) => {
        if (!isPlainClick(event)) return
        event.preventDefault()
        onOpen(project.routeId)
      }}
      data-cursor={`${t.site.work.viewCase} →`}
      className="spotlight group block h-full rounded-card border border-line bg-panel"
      style={tilt.style}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
    >
      <div className="aspect-[16/10] overflow-hidden rounded-t-card border-b border-line">
        <div className="size-full transition-transform duration-700 ease-precise group-hover:scale-105">
          <ProjectCover project={project} />
        </div>
      </div>
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between font-mono text-label text-ink-faint">
          <span>
            {String(index + 1).padStart(2, '0')} · {project.category}
          </span>
          <span>{project.year}</span>
        </div>
        <h3 className="font-display text-h3 font-semibold text-balance text-ink">{project.title}</h3>
        <p className="line-clamp-2 text-sm text-ink-muted">{project.summary}</p>
        <ul className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 4).map((tech, tagIndex) => (
            <m.li
              key={tech}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={REVEAL_VIEWPORT}
              transition={{ duration: DURATION.base, ease: EASE, delay: 0.2 + tagIndex * 0.05 }}
            >
              <Tag>{tech}</Tag>
            </m.li>
          ))}
          {project.technologies.length > 4 && (
            <li>
              <Tag>+{project.technologies.length - 4}</Tag>
            </li>
          )}
        </ul>
        <span className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-signal-ink">
          {t.site.work.viewCase}
          <ArrowUpRight className="size-4 transition-transform duration-500 ease-precise group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100" aria-hidden />
        </span>
      </div>
    </m.a>
  )
}
