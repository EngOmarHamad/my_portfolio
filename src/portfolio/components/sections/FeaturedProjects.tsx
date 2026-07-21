import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Section, SectionHeader } from '@/portfolio/components/ui/Section'
import { ProjectCard } from '@/portfolio/components/cards/ProjectCard'
import { Reveal, StaggerReveal, StaggerItem } from '@/portfolio/components/animations/Reveal'
import { useProjects } from '@/portfolio/hooks/use-portfolio-data'

export function FeaturedProjects() {
  const { data: projects = [] } = useProjects()
  const featured = projects.filter((p) => p.is_featured).slice(0, 3)
  const display = featured.length > 0 ? featured : projects.slice(0, 3)

  return (
    <Section variant="coral">
      <div className="grid lg:grid-cols-[1fr_280px] gap-12 lg:gap-16">
        <div>
          <Reveal>
            <SectionHeader
              title="Selected Projects"
              subtitle="Real-world applications built with clean architecture and modern stacks."
              align="left"
              accent="accent"
            />
          </Reveal>

          <StaggerReveal>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {display.map((project, i) => (
                <StaggerItem key={project.id}>
                  <ProjectCard project={project} index={i} />
                </StaggerItem>
              ))}
            </div>
          </StaggerReveal>

          <Reveal delay={0.2}>
            <div className="mt-10">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border-2 border-accent/30 text-accent text-sm font-medium hover:bg-accent/5 hover:border-accent/60 transition-all duration-200"
              >
                View All Projects
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-24 h-[65vh] w-full rounded-xl overflow-hidden">
            <img src="https://picsum.photos/seed/projects/400/600" alt="Code on screen" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-accent/10 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <div className="text-xs font-mono text-white/60 tracking-widest uppercase">Featured Work</div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
