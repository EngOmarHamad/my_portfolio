import { useMemo, useState } from 'react'
import {
  Code2, Server, Smartphone, Cloud, GitBranch,
  Layers, Database, CheckCircle, Terminal, Cpu, Search,
} from 'lucide-react'
import { PageTransition } from '@/portfolio/components/layout/PageTransition'
import { Section } from '@/portfolio/components/ui/Section'
import { useSkills } from '@/portfolio/hooks/use-portfolio-data'
import { cn } from '@/shared/utils/cn'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2, Server, Smartphone, Cloud, GitBranch, Layers, Database, CheckCircle, Terminal, Cpu,
}

export function SkillsPage() {
  const { data: skills = [] } = useSkills()
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const categories = useMemo(() => {
    const cats = new Set<string>()
    skills.forEach((s) => {
      const cat = s.category || s.category_id || 'General'
      cats.add(cat)
    })
    return ['All', ...Array.from(cats)]
  }, [skills])

  const filteredSkills = useMemo(() => {
    return skills.filter((s) => {
      const cat = s.category || s.category_id || 'General'
      const matchesCategory = selectedCategory === 'All' || cat === selectedCategory
      const query = searchQuery.trim().toLowerCase()
      const matchesSearch =
        query === '' ||
        s.title.toLowerCase().includes(query) ||
        (s.description && s.description.toLowerCase().includes(query))
      return matchesCategory && matchesSearch
    })
  }, [skills, selectedCategory, searchQuery])

  const avgProficiency = useMemo(() => {
    if (!skills.length) return 0
    const total = skills.reduce((acc, curr) => acc + (curr.percentage || 0), 0)
    return Math.round(total / skills.length)
  }, [skills])

  return (
    <PageTransition>
      <main className="pt-8 pb-20">
        <Section className="py-16">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="flex flex-col gap-6 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Skills</p>
                <h1 className="text-3xl font-semibold text-text sm:text-4xl">Engineering Skills & Stack</h1>
                <p className="text-sm leading-relaxed text-text-secondary sm:text-base">
                  A clear overview of technical skills and proficiency across the stack.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:min-w-[280px]">
                <div className="rounded-xl border border-border bg-surface p-4 shadow-card">
                  <p className="text-xs text-text-tertiary">Total Skills</p>
                  <p className="mt-1 text-2xl font-semibold text-primary">{skills.length}</p>
                </div>
                <div className="rounded-xl border border-border bg-surface p-4 shadow-card">
                  <p className="text-xs text-text-tertiary">Avg. Proficiency</p>
                  <p className="mt-1 text-2xl font-semibold text-secondary">{avgProficiency || 0}%</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        'rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-surface text-text-secondary hover:border-primary/30 hover:text-text',
                      )}
                    >
                      {cat}
                    </button>
                  )
                })}
              </div>

              <div className="relative w-full lg:w-80">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-3 text-sm text-text outline-none transition-colors placeholder:text-text-tertiary focus:border-primary/40"
                />
              </div>
            </div>

            {filteredSkills.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center">
                <p className="text-sm font-medium text-text">No skills match your filters.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All')
                    setSearchQuery('')
                  }}
                  className="mt-4 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredSkills.map((skill, idx) => {
                  const IconComponent = iconMap[skill.icon] || Code2
                  const percentage = skill.percentage || 0
                  const accent = idx % 2 === 0 ? 'text-primary bg-primary/10' : 'text-secondary bg-secondary/10'
                  const bar = idx % 2 === 0 ? 'bg-primary' : 'bg-secondary'
                  const category = skill.category || skill.category_id || 'Core'

                  return (
                    <article
                      key={skill.id || skill.title || idx}
                      className="flex h-full min-w-0 flex-col justify-between rounded-xl border border-border bg-surface p-5 shadow-card"
                    >
                      <div className="min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accent}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <span className="rounded-md border border-border bg-surface-hover px-2 py-1 text-[11px] font-medium text-text-secondary">
                            {category}
                          </span>
                        </div>

                        <h3 className="mt-4 break-words text-base font-semibold text-text">{skill.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                          {skill.description || 'Technical skill and practical experience.'}
                        </p>
                      </div>

                      <div className="mt-5 border-t border-border pt-4">
                        <div className="mb-2 flex items-center justify-between text-xs text-text-secondary">
                          <span>Proficiency</span>
                          <span className="font-semibold text-text">{percentage}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-hover">
                          <div className={`h-full rounded-full ${bar}`} style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }} />
                        </div>
                        {skill.level && (
                          <p className="mt-2 text-xs text-text-tertiary">{skill.level}</p>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </Section>
      </main>
    </PageTransition>
  )
}
