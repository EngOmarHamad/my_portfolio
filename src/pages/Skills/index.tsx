import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code2, Server, Smartphone, Cloud, GitBranch, Layers, Database, CheckCircle } from 'lucide-react'
import { PageTransition } from '@/components/layout/PageTransition'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Reveal, StaggerReveal, StaggerItem } from '@/components/animations/Reveal'
import { useSkills } from '@/hooks/use-portfolio-data'
import { cn } from '@/utils/cn'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2, Server, Smartphone, Cloud, GitBranch, Layers, Database, CheckCircle,
}

const cardColors = [
  { border: 'border-primary/50', bg: 'bg-primary/5', iconBg: 'bg-primary', iconText: 'text-white', inactiveIconBg: 'bg-primary/10', inactiveIconText: 'text-primary' },
  { border: 'border-accent/50', bg: 'bg-accent/5', iconBg: 'bg-accent', iconText: 'text-white', inactiveIconBg: 'bg-accent/10', inactiveIconText: 'text-accent' },
  { border: 'border-highlight/50', bg: 'bg-highlight/5', iconBg: 'bg-highlight', iconText: 'text-[#1C1917]', inactiveIconBg: 'bg-highlight/10', inactiveIconText: 'text-highlight' },
  { border: 'border-primary/50', bg: 'bg-primary/5', iconBg: 'bg-primary', iconText: 'text-white', inactiveIconBg: 'bg-primary/10', inactiveIconText: 'text-primary' },
]

export function SkillsPage() {
  const [activeSkill, setActiveSkill] = useState<string | null>(null)
  const { data: skills = [] } = useSkills()

  const groupedSkills = skills.reduce((acc: Record<string, typeof skills>, skill) => {
    const category = skill.category_id || 'General'
    if (!acc[category]) acc[category] = []
    acc[category].push(skill)
    return acc
  }, {})

  const displayData = Object.keys(groupedSkills).length > 0
    ? Object.entries(groupedSkills).map(([category, items]: [string, typeof skills]) => ({
        title: category,
        description: `${items.length} skills`,
        technologies: items.map((s: { title: string }) => s.title),
        icon: items[0]?.icon || 'Code2',
      }))
    : skills.length > 0
      ? skills.map(s => ({
          title: s.title,
          description: `${s.percentage}% proficiency`,
          technologies: [s.title],
          icon: s.icon || 'Code2',
        }))
      : []

  return (
    <PageTransition>
      <main>
        <Section variant="gold">
          <SectionHeader
            title="Skills & Expertise"
            subtitle="A comprehensive toolkit built over years of hands-on engineering."
            accent="gold"
          />

          <Reveal>
            <StaggerReveal>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                {displayData.map((skill, idx) => {
                  const IconComponent = iconMap[skill.icon] || Code2
                  const isActive = activeSkill === skill.title
                  const colors = cardColors[idx % cardColors.length]

                  return (
                    <StaggerItem key={skill.title}>
                      <motion.button
                        onClick={() => setActiveSkill(isActive ? null : skill.title)}
                        whileHover={{ y: -2 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className={cn(
                          'w-full text-left rounded-xl border p-5 transition-all duration-300',
                          isActive
                            ? `${colors.border} ${colors.bg} shadow-elevated`
                            : 'border-border/50 bg-surface shadow-card hover:shadow-elevated',
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors duration-300',
                            isActive ? `${colors.iconBg} ${colors.iconText}` : `${colors.inactiveIconBg} ${colors.inactiveIconText}`,
                          )}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-text">{skill.title}</h3>
                            <p className="text-xs text-text-secondary leading-relaxed mt-1">{skill.description}</p>
                          </div>
                        </div>

                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-border/40">
                                {skill.technologies.map((tech: string) => (
                                  <span
                                    key={tech}
                                    className="inline-flex items-center rounded-md bg-surface px-2.5 py-1 text-xs font-medium text-text-secondary border border-border/40"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </StaggerItem>
                  )
                })}
              </div>
            </StaggerReveal>
          </Reveal>
        </Section>
      </main>
    </PageTransition>
  )
}
