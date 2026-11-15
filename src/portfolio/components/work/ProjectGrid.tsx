import { useMemo, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { useLanguage } from '@/shared/i18n'
import { cn } from '@/shared/utils/cn'
import type { ProjectVM } from '@/portfolio/data/types'
import { DURATION, EASE, transition } from '@/portfolio/lib/motion'
import { ProjectCard } from './ProjectCard'

const ALL = '__all__'

/** Category filter + grid with shared-layout transitions between states. */
export function ProjectGrid({ projects, onOpen }: { projects: ProjectVM[]; onOpen: (id: string) => void }) {
  const { t } = useLanguage()
  const [filter, setFilter] = useState(ALL)
  const categories = useMemo(() => [...new Set(projects.map((project) => project.category).filter(Boolean))], [projects])
  const visible = filter === ALL ? projects : projects.filter((project) => project.category === filter)

  return (
    <LayoutGroup>
      {categories.length > 1 && (
        <div role="group" aria-label={t.site.work.filterLabel} className="mb-8 flex flex-wrap gap-1 border-b border-line">
          {[ALL, ...categories].map((category) => {
            const active = filter === category
            return (
              <button
                key={category}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(category)}
                className={cn('relative min-h-11 px-4 text-sm transition-colors duration-200', active ? 'text-ink' : 'text-ink-muted hover:text-ink')}
              >
                {category === ALL ? t.site.work.all : category}
                <span className="ms-2 font-mono text-label text-ink-faint">
                  {category === ALL ? projects.length : projects.filter((project) => project.category === category).length}
                </span>
                {active && <motion.span layoutId="work-filter" className="absolute inset-x-0 -bottom-px h-px bg-signal" transition={transition(DURATION.base)} />}
              </button>
            )
          })}
        </div>
      )}

      <motion.ul layout className="grid gap-6 md:grid-cols-2 lg:gap-8">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project, index) => (
            <motion.li
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: DURATION.base, ease: EASE }}
              className="min-w-0"
            >
              <ProjectCard project={project} index={index} onOpen={onOpen} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {visible.length === 0 && <p className="py-16 text-center text-ink-muted">{t.site.work.empty}</p>}
    </LayoutGroup>
  )
}
