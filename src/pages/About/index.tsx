import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Reveal, StaggerReveal, StaggerItem } from '@/components/animations/Reveal'
import { TimelineCard } from '@/components/cards/TimelineCard'
import { PageTransition } from '@/components/layout/PageTransition'
import { useAbout, useTimelineItems, useAchievements } from '@/hooks/use-portfolio-data'

export function AboutPage() {
  const { data: about } = useAbout()
  const { data: timeline = [] } = useTimelineItems()
  const { data: achievements = [] } = useAchievements()

  const stats = about ? [
    { label: 'Years Experience', value: `${about.years_experience}+` || '8+' },
    { label: 'Achievements', value: `${achievements.length}+` || '5+' },
    { label: 'Projects Delivered', value: '15+' },
    { label: 'Technologies', value: '12+' },
  ] : [
    { label: 'Years Experience', value: '8+' },
    { label: 'Technologies', value: '12+' },
    { label: 'Certifications', value: '5+' },
    { label: 'Projects', value: '15+' },
  ]

  return (
    <PageTransition>
      <main>
        <Section>
          <SectionHeader
            title="About Me"
            subtitle="Engineer, architect, problem solver."
          />

          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-3 space-y-5">
              <Reveal>
                <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
                  {about?.biography || "I'm a Senior Full Stack Engineer and .NET Architect with over 8 years of experience designing and building enterprise-scale applications. My expertise spans the entire stack, from modern frontend frameworks to cloud-native backend services."}
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                >
                  View my work
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Reveal>
            </div>

            <div className="lg:col-span-2">
              <Reveal direction="right">
                <StaggerReveal>
                  <div className="grid grid-cols-2 gap-3">
                    {stats.map((stat, i) => {
                      const tints = ['border-primary/30 bg-primary/[0.04]', 'border-accent/30 bg-accent/[0.04]', 'border-highlight/30 bg-highlight/[0.04]', 'border-primary/30 bg-primary/[0.04]']
                      return (
                        <StaggerItem key={stat.label}>
                          <motion.div
                            whileHover={{ y: -2 }}
                            className={`rounded-xl border ${tints[i]} p-5 text-center shadow-soft hover:shadow-elevated transition-all duration-300`}
                          >
                            <div className="text-2xl font-serif font-normal text-primary">{stat.value}</div>
                            <div className="text-xs text-text-tertiary mt-1">{stat.label}</div>
                          </motion.div>
                        </StaggerItem>
                      )
                    })}
                  </div>
                </StaggerReveal>
              </Reveal>
            </div>
          </div>
        </Section>

        <Section variant="coral">
          <Reveal>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              <div>
                <hr className="hairline-accent mb-5" />
                <h3 className="text-2xl sm:text-3xl text-text mb-8">Languages & Interests</h3>
                <StaggerReveal>
                  <div className="space-y-4">
                    {(about?.languages ?? []).length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-text mb-3">Languages</h4>
                        <div className="flex flex-wrap gap-2">
                          {(about?.languages ?? []).map((lang: string) => (
                            <span key={lang} className="px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/[0.04] text-sm text-text-secondary">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {(about?.interests ?? []).length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-text mb-3">Interests</h4>
                        <div className="flex flex-wrap gap-2">
                          {(about?.interests ?? []).map((interest: string) => (
                            <span key={interest} className="px-3 py-1.5 rounded-lg border border-accent/30 bg-accent/[0.04] text-sm text-text-secondary">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </StaggerReveal>
              </div>

              <div>
                <hr className="hairline-accent mb-5" />
                <h3 className="text-2xl sm:text-3xl text-text mb-8">Timeline</h3>
                <div className="relative">
                  <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-accent/30 to-highlight/30" />
                  {timeline.map((item, i) => (
                    <TimelineCard key={item.id || item.year + item.title} item={item} index={i} />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </Section>
      </main>
    </PageTransition>
  )
}
