import { PageTransition } from '@/components/layout/PageTransition'
import { Hero } from '@/components/sections/Hero'
import { Metrics } from '@/components/sections/Metrics'
import { FeaturedProjects } from '@/components/sections/FeaturedProjects'
import { ArchitectureBlueprint } from '@/components/sections/ArchitectureBlueprint'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { Section, SectionHeader } from '@/components/ui/Section'
import { ContactForm } from '@/components/forms/ContactForm'
import { Reveal } from '@/components/animations/Reveal'

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
