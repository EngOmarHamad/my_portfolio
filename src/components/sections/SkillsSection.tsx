import { Section, SectionHeader } from '@/components/ui/Section'
import { SkillCard } from '@/components/cards/SkillCard'
import { Reveal, StaggerReveal, StaggerItem } from '@/components/animations/Reveal'
import { useSkills } from '@/hooks/use-portfolio-data'

export function SkillsSection() {
  const { data: skills = [] } = useSkills()

  const displaySkills = skills.length > 0
    ? skills.filter(s => s.is_featured).slice(0, 4)
    : []

  return (
    <Section variant="gold">
      <Reveal>
        <SectionHeader
          title="Toolkit"
          subtitle="A comprehensive toolkit spanning frontend, backend, cloud, and architecture."
          accent="gold"
        />
      </Reveal>

      <StaggerReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {displaySkills.map((skill, i) => (
            <StaggerItem key={skill.id}>
              <SkillCard
                skill={{
                  icon: skill.icon || 'Code2',
                  title: skill.title,
                  technologies: [skill.title],
                  description: `${skill.percentage}% proficiency`,
                }}
                index={i}
              />
            </StaggerItem>
          ))}
          {displaySkills.length === 0 && skills.slice(0, 4).map((skill, i) => (
            <StaggerItem key={skill.id}>
              <SkillCard
                skill={{
                  icon: skill.icon || 'code',
                  title: skill.title,
                  technologies: [skill.title],
                  description: `${skill.percentage}% proficiency`,
                }}
                index={i}
              />
            </StaggerItem>
          ))}
        </div>
      </StaggerReveal>
    </Section>
  )
}
