import { Link } from 'react-router-dom'
import { ArrowUpRight, Code2, Server, Smartphone, Cloud, GitBranch, Layers, Database, CheckCircle } from 'lucide-react'
import { Section, SectionHeader } from '@/portfolio/components/ui/Section'
import { useSkills } from '@/portfolio/hooks/use-portfolio-data'
import { useLanguage } from '@/shared/i18n'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2, Server, Smartphone, Cloud, GitBranch, Layers, Database, CheckCircle,
}

export function SkillsSection() {
  const { data: skills = [] } = useSkills()
  const { t } = useLanguage()

  const featured = skills.filter((s) => s.is_featured)
  const displaySkills = (featured.length > 0 ? featured : skills).slice(0, 4)

  return (
    <Section className="py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader title={t.skillsSection.title} subtitle={t.skillsSection.subtitle} align="left" />
          <Link
            to="/skills"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text transition-colors hover:border-primary/40 hover:text-primary"
          >
            <span>{t.skillsSection.viewAll}</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {displaySkills.map((skill, idx) => {
            const IconComponent = iconMap[skill.icon] || Code2
            const accent = idx % 2 === 0 ? 'text-primary bg-primary/10' : 'text-secondary bg-secondary/10'
            const bar = idx % 2 === 0 ? 'bg-primary' : 'bg-secondary'

            return (
              <div key={skill.id || skill.title} className="flex h-full flex-col justify-between rounded-xl border border-border bg-surface p-5 shadow-card">
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accent}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-text">{skill.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-secondary">
                      {skill.description || `${skill.percentage}% proficiency`}
                    </p>
                  </div>
                </div>

                {typeof skill.percentage === 'number' && (
                  <div className="mt-4 space-y-1.5 border-t border-border pt-3">
                    <div className="flex justify-between text-xs text-text-secondary">
                      <span>{t.skillsSection.proficiency}</span>
                      <span className="font-semibold text-text">{skill.percentage}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-hover">
                      <div className={`h-full rounded-full ${bar}`} style={{ width: `${skill.percentage}%` }} />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
