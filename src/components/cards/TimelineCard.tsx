import { motion } from 'framer-motion'
import { GraduationCap, Briefcase, Award, Trophy } from 'lucide-react'

const typeConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  education: { icon: GraduationCap, color: 'text-accent', bg: 'bg-accent/10' },
  experience: { icon: Briefcase, color: 'text-primary', bg: 'bg-primary/10' },
  certification: { icon: Award, color: 'text-highlight', bg: 'bg-highlight/10' },
  achievement: { icon: Trophy, color: 'text-accent', bg: 'bg-accent/10' },
}

interface TimelineCardProps {
  item: {
    year: string
    title: string
    subtitle?: string
    description?: string
    type: string
  }
  index: number
}

export function TimelineCard({ item, index }: TimelineCardProps) {
  const config = typeConfig[item.type] || typeConfig.experience
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative pl-12 pb-10 last:pb-0"
    >
      <div className="absolute left-0 top-0 flex flex-col items-center">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.bg} ${config.color} border border-border/40`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="w-px flex-1 bg-gradient-to-b from-border to-transparent mt-2" />
      </div>

      <div className="pt-0.5">
        <span className="inline-flex items-center rounded-md bg-primary/10 text-primary px-3 py-1 text-xs font-semibold mb-2 tracking-wide font-mono">
          {item.year}
        </span>
        <h3 className="text-base font-semibold text-text">{item.title}</h3>
        {item.subtitle && <p className="text-sm text-text-secondary mt-1 font-medium">{item.subtitle}</p>}
        {item.description && <p className="text-sm text-text-tertiary mt-2 leading-relaxed">{item.description}</p>}
      </div>
    </motion.div>
  )
}
