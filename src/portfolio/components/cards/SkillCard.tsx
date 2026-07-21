import { motion, useReducedMotion } from 'framer-motion'
import { Code2, Server, Smartphone, Cloud, GitBranch, Layers, Database, CheckCircle } from 'lucide-react'
import type { Skill } from '@/shared/types'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  code: Code2,
  server: Server,
  smartphone: Smartphone,
  cloud: Cloud,
  'git-branch': GitBranch,
  layers: Layers,
  database: Database,
  'check-circle': CheckCircle,
}

const colorVariants = [
  { border: 'card-border-teal', iconBg: 'bg-primary/10', iconHover: 'group-hover:bg-primary', iconColor: 'text-primary', iconHoverText: 'group-hover:text-white' },
  { border: 'card-border-coral', iconBg: 'bg-accent/10', iconHover: 'group-hover:bg-accent', iconColor: 'text-accent', iconHoverText: 'group-hover:text-white' },
  { border: 'card-border-gold', iconBg: 'bg-highlight/10', iconHover: 'group-hover:bg-highlight', iconColor: 'text-highlight', iconHoverText: 'group-hover:text-[#1C1917]' },
  { border: 'card-border-teal', iconBg: 'bg-primary/10', iconHover: 'group-hover:bg-primary', iconColor: 'text-primary', iconHoverText: 'group-hover:text-white' },
]

interface SkillCardProps {
  skill: Skill
  index?: number
}

export function SkillCard({ skill, index = 0 }: SkillCardProps) {
  const Icon = iconMap[skill.icon] || Code2
  const reduce = useReducedMotion()
  const colors = colorVariants[index % colorVariants.length]

  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -2, scale: 1.005 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={`group relative rounded-xl border border-border/50 bg-surface shadow-card hover:shadow-elevated transition-all duration-300 ${colors.border}`}
    >
      <div className="flex items-start gap-3 p-5">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colors.iconBg} ${colors.iconColor} ${colors.iconHover} ${colors.iconHoverText} transition-colors duration-300`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-text mb-1">{skill.title}</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            {skill.description}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 px-5 pb-5">
        {skill.technologies.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center rounded-md bg-surface-hover px-2 py-1 text-xs font-medium text-text-secondary"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
