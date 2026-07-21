import { PageTransition } from '@/portfolio/components/layout/PageTransition'
import { Hero } from '@/portfolio/components/sections/Hero'
import { Metrics } from '@/portfolio/components/sections/Metrics'
import { FeaturedProjects } from '@/portfolio/components/sections/FeaturedProjects'
import { ArchitectureBlueprint } from '@/portfolio/components/sections/ArchitectureBlueprint'
import { SkillsSection } from '@/portfolio/components/sections/SkillsSection'
import { Section, SectionHeader } from '@/portfolio/components/ui/Section'
import { ContactForm } from '@/portfolio/components/forms/ContactForm'
import { Reveal } from '@/portfolio/components/animations/Reveal'

export function HomePage() {
  return (
    <PageTransition>
      <main>
        <Hero />
        <Metrics />
        <FeaturedProjects />
        <ArchitectureBlueprint />
        <SkillsSection />
        <Section id="contact-section" variant="coral">
          <Reveal>
            <SectionHeader
              title="Let&apos;s Work Together"
              subtitle="Have a project in mind? I&apos;d love to hear about it."
              accent="accent"
            />
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mx-auto max-w-xl">
              <ContactForm />
            </div>
          </Reveal>
        </Section>
      </main>
    </PageTransition>
  )
}
