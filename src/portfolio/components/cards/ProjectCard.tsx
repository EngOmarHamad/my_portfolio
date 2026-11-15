import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ExternalLink, ArrowRight } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description?: string
    summary?: string
    category?: string
    technologies?: string[]
    tech_stack?: string[]
    githubUrl?: string
    github_url?: string
    liveUrl?: string
    live_demo_url?: string
  }
  index?: number
}

const topStyles = [
  'from-primary/25 via-primary/5 to-transparent',
  'from-secondary/25 via-secondary/5 to-transparent',
  'from-accent/25 via-accent/5 to-transparent',
]

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const techs = project.technologies || project.tech_stack || []
  const desc = project.summary || project.description || ''
  const githubUrl = project.githubUrl || project.github_url
  const liveUrl = project.liveUrl || project.live_demo_url
  const top = topStyles[index % topStyles.length]

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated hover:border-primary/30"
    >
      <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${top}`}>
        <div className="absolute inset-0 bg-grid opacity-60 mask-fade-b" aria-hidden />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-7xl font-display font-bold text-text/10 select-none group-hover:scale-105 transition-transform duration-500">
            {project.title.charAt(0)}
          </span>
        </div>
        {project.category && (
          <span className="absolute left-4 top-4 inline-flex items-center rounded-full border border-border/60 bg-bg/70 px-3 py-1 text-[11px] font-medium text-text-secondary backdrop-blur-md">
            {project.category}
          </span>
        )}
      </div>

      <div className="relative flex flex-1 flex-col p-5">
        <h3 className="mb-2 text-[17px] font-semibold text-text leading-snug group-hover:text-primary-light transition-colors duration-200">
          {project.title}
        </h3>

        <p className="mb-4 text-sm text-text-secondary leading-relaxed line-clamp-2">
          {desc}
        </p>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {techs.slice(0, 3).map((tech) => (
            <span key={tech} className="inline-flex items-center rounded-md border border-border/50 bg-surface-hover px-2 py-1 text-xs font-medium text-text-secondary">
              {tech}
            </span>
          ))}
          {techs.length > 3 && (
            <span className="inline-flex items-center rounded-md bg-surface-hover px-2 py-1 text-xs font-medium text-text-tertiary">
              +{techs.length - 3}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center gap-3 border-t border-border/50 pt-4">
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:text-text hover:bg-surface-hover border border-transparent hover:border-border/60 transition-all" aria-label={`View ${project.title} on GitHub`}>
              <FaGithub className="h-4 w-4" />
            </a>
          )}
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:text-text hover:bg-surface-hover border border-transparent hover:border-border/60 transition-all" aria-label={`View ${project.title} live demo`}>
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <Link to={`/projects/${project.id}`} className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary-light hover:text-primary transition-colors">
            Case Study
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
