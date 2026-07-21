import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Section, SectionHeader } from '@/portfolio/components/ui/Section'
import { Reveal, StaggerReveal, StaggerItem } from '@/portfolio/components/animations/Reveal'

const principles = [
  {
    title: 'Clean Architecture',
    description: 'Separation of concerns with domain-driven design and dependency inversion.',
  },
  {
    title: 'Scalable Systems',
    description: 'Microservices, CQRS, and event-driven patterns for growth.',
  },
  {
    title: 'Modern Frontend',
    description: 'React with TypeScript, component-driven design, and best practices.',
  },
  {
    title: 'Cloud Native',
    description: 'Azure, Docker, and CI/CD pipelines for reliable deployments.',
  },
]

export function ArchitectureBlueprint() {
  return (
    <Section variant="teal">
      <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-16 items-start">
        <div className="hidden lg:block">
          <div className="sticky top-24 h-[65vh] w-full rounded-xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] via-highlight/[0.04] to-accent/[0.06] overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-mono text-primary/[0.12] select-none tracking-tighter">
                  {'</>'}
                </div>
                <div className="text-xs font-mono text-text-tertiary tracking-widest uppercase mt-1">
                  Philosophy
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Reveal>
            <SectionHeader
              title="Engineering Philosophy"
              subtitle="How I approach building software that lasts."
              align="left"
              accent="primary"
            />
          </Reveal>

          <Reveal>
            <p className="text-base text-text-secondary leading-relaxed mb-8 max-w-lg">
              Every project starts with understanding the problem deeply. I architect
              solutions that are maintainable, testable, and built to scale — without
              over-engineering for problems that don&apos;t exist yet.
            </p>
          </Reveal>

          <StaggerReveal>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {principles.map((p, i) => {
                const colors = [
                  'border-primary/30 hover:border-primary/60',
                  'border-accent/30 hover:border-accent/60',
                  'border-highlight/30 hover:border-highlight/60',
                  'border-primary/30 hover:border-primary/60',
                ]
                return (
                  <StaggerItem key={p.title}>
                    <div className={`p-5 rounded-xl border ${colors[i]} bg-surface shadow-card hover:shadow-elevated transition-all duration-300`}>
                      <h3 className="text-sm font-semibold text-text mb-1.5">{p.title}</h3>
                      <p className="text-xs text-text-secondary leading-relaxed">{p.description}</p>
                    </div>
                  </StaggerItem>
                )
              })}
            </div>
          </StaggerReveal>

          <Reveal>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              Learn more about my approach
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
