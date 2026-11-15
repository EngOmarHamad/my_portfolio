import { useMemo, useState } from 'react'
import { m } from 'framer-motion'
import { useLanguage } from '@/shared/i18n'
import { cn } from '@/shared/utils/cn'
import { Reveal, Section, SectionHeader, SkillIcon } from '@/portfolio/components/ds'
import { useSiteContent } from '@/portfolio/hooks/use-site-content'
import type { SkillGroupId } from '@/portfolio/data/types'
import { DURATION, EASE, REVEAL_VIEWPORT } from '@/portfolio/lib/motion'
import { ArchitectureDiagram, TracePanel } from './ArchitectureDiagram'

const GROUP_ORDER: SkillGroupId[] = ['backend', 'frontend', 'data', 'devops', 'architecture']
const DEFAULT_NODE = 'api'

export function Skills() {
  const { t } = useLanguage()
  const { skills, architecture } = useSiteContent()
  const [selected, setSelected] = useState(DEFAULT_NODE)
  const copy = t.site.skills

  const node = architecture.nodes.find((item) => item.id === selected) ?? architecture.nodes[0]
  const connected = useMemo(() => {
    const ids = architecture.edges.flatMap(({ from, to }) => (from === selected ? [to] : to === selected ? [from] : []))
    return architecture.nodes.filter((item) => ids.includes(item.id))
  }, [architecture, selected])
  const traced = useMemo(() => new Set(node.technologies.map((tech) => tech.toLowerCase())), [node])

  const groups = GROUP_ORDER.map((id) => ({ id, skills: skills.filter((skill) => skill.group === id) })).filter((group) => group.skills.length)

  return (
    <Section id="skills">
      <SectionHeader id="skills" index={copy.index} label={copy.label} title={copy.title} intro={copy.intro} />

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-9">
          <ArchitectureDiagram nodes={architecture.nodes} edges={architecture.edges} selected={selected} onSelect={setSelected} />
        </div>
        <Reveal variant="fade" className="lg:col-span-3">
          <TracePanel node={node} connected={connected} />
          <p className="mt-4 hidden font-mono text-label text-ink-faint md:block">{copy.hint}</p>
        </Reveal>
      </div>

      <div className="mt-24">
        <h3 className="label-mono text-ink-faint">{copy.inventory}</h3>
        <div className="mt-6 border-b border-line">
          {groups.map((group, groupIndex) => (
            <div key={group.id} className="grid gap-4 border-t border-line py-6 lg:grid-cols-12 lg:gap-8">
              <h4 className="flex items-baseline gap-3 text-sm font-medium text-ink lg:col-span-3">
                <span className="font-mono text-label text-ink-faint">{String(groupIndex + 1).padStart(2, '0')}</span>
                {copy.groups[group.id]}
                <span className="font-mono text-label text-ink-faint">({group.skills.length})</span>
              </h4>
              <ul className="flex flex-wrap gap-2 lg:col-span-9">
                {group.skills.map((skill, index) => {
                  const lit = traced.has(skill.name.toLowerCase())
                  return (
                    <m.li
                      key={skill.id}
                      className={cn(
                        'inline-flex min-h-9 items-center gap-2 rounded-chip border px-3 text-sm transition-colors duration-200',
                        lit ? 'border-signal text-ink' : 'border-line text-ink-muted',
                      )}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={REVEAL_VIEWPORT}
                      transition={{ duration: DURATION.base, ease: EASE, delay: Math.min(index, 12) * 0.03 }}
                    >
                      <SkillIcon name={skill.name} icon={skill.icon} className={lit ? 'text-signal-ink' : undefined} />
                      {skill.name}
                    </m.li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
