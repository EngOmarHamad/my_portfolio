import { Section, SectionHeader } from '@/portfolio/components/ui/Section'
import { useAchievements, useTestimonials } from '@/portfolio/hooks/use-portfolio-data'

export function ProfileHighlights() {
  const { data: achievements = [] } = useAchievements()
  const { data: testimonials = [] } = useTestimonials()

  return (
    <>
      <Section id="achievements" className="scroll-mt-16 py-20">
        <SectionHeader title="Achievements" subtitle="Milestones from the work behind the portfolio." />
        {achievements.length === 0 ? (
          <p className="text-center text-text-secondary">Achievements will appear here soon.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {achievements.map((item) => (
              <article key={item.id} className="rounded-xl border border-border bg-surface p-6 shadow-card">
                <h3 className="text-lg font-semibold text-text">{item.title}</h3>
                {item.date && <p className="mt-1 text-xs text-text-tertiary">{new Date(item.date).getFullYear()}</p>}
                {item.description && <p className="mt-3 text-sm leading-relaxed text-text-secondary">{item.description}</p>}
              </article>
            ))}
          </div>
        )}
      </Section>

      <Section id="testimonials" className="scroll-mt-16 py-20">
        <SectionHeader title="Testimonials" subtitle="Feedback from people I have worked with." />
        {testimonials.length === 0 ? (
          <p className="text-center text-text-secondary">Testimonials will appear here soon.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {testimonials.map((item) => (
              <figure key={item.id} className="rounded-xl border border-border bg-surface p-6 shadow-card">
                <blockquote className="text-sm leading-relaxed text-text">"{item.review}"</blockquote>
                <figcaption className="mt-5 border-t border-border pt-4 text-sm text-text-secondary">
                  <strong className="font-semibold text-text">{item.client_name}</strong>
                  {item.company ? ` · ${item.company}` : ''}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </Section>
    </>
  )
}
