import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ExternalLink, ArrowRight } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'

const colorVariants = [
  { border: 'card-border-teal', initial: 'P', color: 'text-primary/[0.06]' },
  { border: 'card-border-coral', initial: 'P', color: 'text-accent/[0.06]' },
  { border: 'card-border-gold', initial: 'P', color: 'text-highlight/[0.06]' },
]

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

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const colors = colorVariants[index % colorVariants.length]
  const techs = project.technologies || project.tech_stack || []
  const desc = project.summary || project.description || ''
  const githubUrl = project.githubUrl || project.github_url
  const liveUrl = project.liveUrl || project.live_demo_url

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, mass: 1 }}
      className={`group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-surface shadow-card hover:shadow-elevated transition-all duration-300 ${colors.border}`}
    >
      <div className="relative h-44 overflow-hidden bg-surface-hover">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-7xl font-serif ${colors.color} select-none`}>
            {project.title.charAt(0)}
          </span>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center rounded-md border border-border/50 bg-surface-hover px-2.5 py-1 text-xs font-medium text-text-secondary">
            {project.category}
          </span>
        </div>

        <h3 className="text-base font-semibold text-text mb-2 group-hover:text-primary transition-colors duration-200">
          {project.title}
        </h3>

        <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-2">
          {desc}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {techs.slice(0, 3).map((tech, i) => {
            const techColors = ['bg-primary/10 text-primary', 'bg-accent/10 text-accent', 'bg-highlight/10 text-highlight']
            return (
              <span key={tech} className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${techColors[i % techColors.length]}`}>
                {tech}
              </span>
            )
          })}
          {techs.length > 3 && (
            <span className="inline-flex items-center rounded-md bg-surface-hover px-2 py-1 text-xs font-medium text-text-tertiary">
              +{techs.length - 3}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center gap-3 pt-4 border-t border-border/40">
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text transition-colors" aria-label={`View ${project.title} on GitHub`}>
              <FaGithub className="h-4 w-4" />
            </a>
          )}
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text transition-colors" aria-label={`View ${project.title} live demo`}>
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <Link to={`/projects/${project.id}`} className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark transition-colors">
            Case Study
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
