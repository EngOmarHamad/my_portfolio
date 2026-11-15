import type { ReactNode } from 'react'
import { useLanguage } from '@/shared/i18n'
import { SkillIcon, Tag } from '@/portfolio/components/ds'
import { iconForSkill } from '@/portfolio/data/adapters'
import type { ProjectVM } from '@/portfolio/data/types'
import { ProjectCover } from './ProjectCover'
import { ProjectLinks } from './ProjectLinks'
import { groupByLayer, type TechLayer } from './tech-layers'

const LAYER_ORDER: TechLayer[] = ['client', 'api', 'data', 'other']

function Chapter({ index, title, children }: { index: number; title: string; children: ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-line py-8 md:grid-cols-12 md:gap-8 md:py-12">
      <h3 className="label-mono flex gap-3 text-ink-muted md:col-span-3">
        <span className="text-signal-ink">{String(index).padStart(2, '0')}</span>
        {title}
      </h3>
      <div className="md:col-span-9">{children}</div>
    </section>
  )
}

/** Stack drawn as the request path: client → API & services → data (+ tooling). */
function StackDiagram({ technologies }: { technologies: string[] }) {
  const { t } = useLanguage()
  const layers = groupByLayer(technologies)
  const visible = LAYER_ORDER.filter((layer) => layers[layer].length)

  return (
    <ol className="grid gap-4 md:grid-flow-col md:auto-cols-fr">
      {visible.map((layer, index) => (
        <li key={layer} className="relative rounded-chip border border-line bg-panel-2 p-4">
          {index < visible.length - 1 && (
            <span aria-hidden className="absolute top-1/2 -end-4 hidden h-px w-4 bg-circuit md:block" />
          )}
          <p className="label-mono flex items-center gap-2 text-circuit">
            <span aria-hidden className="size-1.5 rounded-full bg-circuit" />
            {t.site.work.case.layers[layer]}
          </p>
          <ul className="mt-4 space-y-2">
            {layers[layer].map((tech) => (
              <li key={tech} className="flex items-center gap-2 text-sm text-ink">
                <SkillIcon name={tech} icon={iconForSkill(tech)} className="text-ink-muted" />
                {tech}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  )
}

const paragraphs = (text: string) =>
  text
    .split(/\n{2,}|\r\n\r\n/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => (
      <p key={part.slice(0, 32)} className="max-w-prose text-pretty text-ink-muted not-first:mt-4">
        {part}
      </p>
    ))

/** Problem → approach → architecture → result → links. Empty chapters are omitted, never invented. */
export function CaseStudyContent({ project, titleId }: { project: ProjectVM; titleId: string }) {
  const { t } = useLanguage()
  const copy = t.site.work.case
  let chapter = 0
  const next = () => ++chapter

  return (
    <article>
      <header>
        <p className="label-mono flex flex-wrap gap-x-4 gap-y-1 text-ink-faint">
          <span className="text-signal-ink">{project.category}</span>
          {project.year && <span>{project.year}</span>}
          <span>
            {copy.stack} · {project.technologies.length}
          </span>
        </p>
        <h2 id={titleId} className="mt-4 font-display text-h2 font-bold text-balance display-tight text-ink">
          {project.title}
        </h2>
        {project.summary && <p className="mt-6 max-w-prose text-body text-pretty text-ink-muted">{project.summary}</p>}
      </header>

      <div className="mt-8 aspect-[16/10] overflow-hidden rounded-card border border-line">
        <ProjectCover project={project} eager size="feature" />
      </div>

      <div className="mt-8">
        {project.problem && <Chapter index={next()} title={copy.problem}>{paragraphs(project.problem)}</Chapter>}
        {(project.approach || project.features.length > 0) && (
          <Chapter index={next()} title={copy.approach}>
            {paragraphs(project.approach)}
            {project.features.length > 0 && (
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {project.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm text-ink">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 bg-signal" />
                    {feature}
                  </li>
                ))}
              </ul>
            )}
          </Chapter>
        )}
        {project.technologies.length > 0 && (
          <Chapter index={next()} title={copy.architecture}>
            <StackDiagram technologies={project.technologies} />
          </Chapter>
        )}
        {project.caseStudy && <Chapter index={next()} title={copy.result}>{paragraphs(project.caseStudy)}</Chapter>}
        {project.gallery.length > 0 && (
          <div className="grid gap-4 border-t border-line py-8 sm:grid-cols-2">
            {project.gallery.map((src) => (
              <img key={src} src={src} alt="" loading="lazy" decoding="async" className="aspect-[16/10] w-full rounded-chip border border-line object-cover" />
            ))}
          </div>
        )}
        {project.links.length > 0 && (
          <Chapter index={next()} title={copy.links}>
            <ProjectLinks links={project.links} />
          </Chapter>
        )}
        {project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-line pt-8">
            {project.technologies.map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
