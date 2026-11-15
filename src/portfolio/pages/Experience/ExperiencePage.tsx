import { PageTransition } from '@/portfolio/components/layout/PageTransition'
import { Section, SectionHeader } from '@/portfolio/components/ui/Section'
import { TimelineCard } from '@/portfolio/components/cards/TimelineCard'
import { Reveal } from '@/portfolio/components/animations/Reveal'
import { useTimelineItems, useExperience, useCertificates, useTechStack } from '@/portfolio/hooks/use-portfolio-data'
import { CareerDetails } from '@/portfolio/components/sections/CareerDetails'

export function ExperiencePage() {
  const { data: timeline = [] } = useTimelineItems()
  const { data: experience = [] } = useExperience()
  const { data: certificates = [] } = useCertificates()
  const { data: techStack = [] } = useTechStack()
  const years = experience.map((item) => Number(item.start_date?.slice(0, 4))).filter(Number.isFinite)
  const firstYear = years.length ? Math.min(...years) : null

  const milestones = [
    { year: firstYear ? `${firstYear}–${new Date().getFullYear()}` : '—', label: 'Career Timeline', desc: 'From the first role to today' },
    { year: String(techStack.length), label: 'Technologies', desc: 'Published tools and platforms' },
    { year: String(certificates.length), label: 'Certifications', desc: 'Published credentials' },
    { year: String(experience.length), label: 'Roles', desc: 'Published professional experience' },
  ]

  const expEvents = timeline.filter(t => t.type === 'experience')

  return (
    <PageTransition>
      <main>
        <Section id="timeline" className="scroll-mt-16" variant="coral">
          <SectionHeader
            title="Experience"
            subtitle="A journey through engineering, architecture, and continuous growth."
            accent="accent"
          />

          <Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
              {milestones.map((m, i) => {
                const borders = ['border-primary/30 bg-primary/[0.04]', 'border-accent/30 bg-accent/[0.04]', 'border-highlight/30 bg-highlight/[0.04]', 'border-primary/30 bg-primary/[0.04]']
                return (
                  <div key={m.label} className={`p-5 rounded-xl border ${borders[i]} text-center`}>
                    <div className="text-2xl font-display font-normal text-primary">{m.year}</div>
                    <div className="text-sm font-semibold text-text mt-1">{m.label}</div>
                    <div className="text-xs text-text-tertiary mt-1">{m.desc}</div>
                  </div>
                )
              })}
            </div>
          </Reveal>

          <Reveal>
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-accent/30 to-highlight/30" />
              {(expEvents.length > 0 ? expEvents : timeline).map((item, i) => (
                <TimelineCard key={item.id || item.year + item.title} item={item} index={i} />
              ))}
            </div>
          </Reveal>
        </Section>
        <CareerDetails />
      </main>
    </PageTransition>
  )
}
