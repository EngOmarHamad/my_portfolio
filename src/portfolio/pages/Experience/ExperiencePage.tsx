import { PageTransition } from '@/portfolio/components/layout/PageTransition'
import { Section, SectionHeader } from '@/portfolio/components/ui/Section'
import { TimelineCard } from '@/portfolio/components/cards/TimelineCard'
import { Reveal } from '@/portfolio/components/animations/Reveal'
import { useTimelineItems, useExperience } from '@/portfolio/hooks/use-portfolio-data'

export function ExperiencePage() {
  const { data: timeline = [] } = useTimelineItems()
  const { data: experience = [] } = useExperience()

  const milestones = [
    { year: experience.length > 0 ? `${experience[0]?.start_date?.slice(0, 4)}-Present` : '2017-2024', label: 'Years of Growth', desc: 'From CS graduate to Senior Engineer' },
    { year: '8+', label: 'Technologies Mastered', desc: 'Across frontend, backend, cloud, and mobile' },
    { year: '5+', label: 'Certifications', desc: 'Microsoft and cloud architecture certified' },
    { year: '3', label: 'Core Specializations', desc: 'Full Stack, Architecture, Cloud Native' },
  ]

  const expEvents = timeline.filter(t => t.type === 'experience')

  return (
    <PageTransition>
      <main>
        <Section variant="coral">
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
                    <div className="text-2xl font-serif font-normal text-primary">{m.year}</div>
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
      </main>
    </PageTransition>
  )
}
