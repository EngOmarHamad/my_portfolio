import { useState } from 'react'
import { Layers, GitFork, Cpu, ShieldCheck } from 'lucide-react'
import { Section, SectionHeader } from '@/portfolio/components/ui/Section'
import { useLanguage } from '@/shared/i18n'

const principleMeta = [
  { id: 'clean-arch', icon: Layers, techs: ['CQRS', 'MediatR', 'Repository Pattern', 'Domain Events'] },
  { id: 'scalable-systems', icon: GitFork, techs: ['Event-Driven', 'Caching', 'Microservices', 'APIs'] },
  { id: 'modern-frontend', icon: Cpu, techs: ['React', 'TypeScript', 'Tailwind CSS', 'State Management'] },
  { id: 'cloud-native', icon: ShieldCheck, techs: ['Docker', 'CI/CD', 'Cloud', 'Monitoring'] },
]

export function ArchitectureBlueprint() {
  const { t } = useLanguage()
  const principles = principleMeta.map((meta, i) => ({
    ...meta,
    ...(t.blueprint.principles[i] ?? { title: meta.id, subtitle: '', description: '', metric: '' }),
  }))
  const [activeId, setActiveId] = useState(principles[0]?.id)
  const activePrinciple = principles.find((p) => p.id === activeId) ?? principles[0]

  if (!activePrinciple) return null

  const ActiveIcon = activePrinciple.icon

  return (
    <Section className="py-20">
      <div className="mx-auto max-w-6xl space-y-10">
        <SectionHeader title={t.blueprint.title} subtitle={t.blueprint.subtitle} align="left" />

        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-3">
            {principles.map((p, i) => {
              const Icon = p.icon
              const active = p.id === activePrinciple.id
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActiveId(p.id)}
                  className={`w-full rounded-xl border p-4 text-left transition-colors ${
                    active
                      ? 'border-primary/40 bg-primary/5'
                      : 'border-border bg-surface hover:border-primary/30 hover:bg-surface-hover'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${active ? 'bg-primary text-white' : 'bg-secondary/10 text-secondary'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-text-tertiary">0{i + 1}</p>
                      <h3 className="text-sm font-semibold text-text">{p.title}</h3>
                      {p.subtitle && <p className="mt-0.5 text-xs text-text-secondary">{p.subtitle}</p>}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ActiveIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text">{activePrinciple.title}</h3>
                  {activePrinciple.subtitle && <p className="text-sm text-text-secondary">{activePrinciple.subtitle}</p>}
                </div>
              </div>
              {activePrinciple.metric && (
                <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary">
                  {activePrinciple.metric}
                </span>
              )}
            </div>

            <p className="mt-5 text-sm leading-relaxed text-text-secondary">{activePrinciple.description}</p>

            <div className="mt-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-tertiary">{t.blueprint.coreImpl}</p>
              <div className="flex flex-wrap gap-2">
                {activePrinciple.techs.map((tech) => (
                  <span key={tech} className="rounded-md border border-border bg-surface-hover px-3 py-1.5 text-xs font-medium text-text-secondary">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
