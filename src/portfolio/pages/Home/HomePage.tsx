import { PageTransition } from '@/portfolio/components/layout/PageTransition'
import { Hero } from '@/portfolio/components/sections/Hero'
import { Metrics } from '@/portfolio/components/sections/Metrics'
import { FeaturedProjects } from '@/portfolio/components/sections/FeaturedProjects'
import { ArchitectureBlueprint } from '@/portfolio/components/sections/ArchitectureBlueprint'
import { SkillsSection } from '@/portfolio/components/sections/SkillsSection'
import { ContactSection } from '@/portfolio/components/sections/ContactSection'

export function HomePage() {
  return (
    <PageTransition>
      <main>
        <Hero />
        <Metrics />
        <FeaturedProjects />
        <ArchitectureBlueprint />
        <SkillsSection />
        <ContactSection />
      </main>
    </PageTransition>
  )
}
