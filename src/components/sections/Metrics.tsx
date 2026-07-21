import { motion } from 'framer-motion'
import { StaggerReveal, StaggerItem } from '@/components/animations/Reveal'
import { useHero } from '@/hooks/use-portfolio-data'

export function Metrics() {
  const { data: hero } = useHero()

  const stats = hero?.statistics as Array<{ label: string; value: string }> | undefined
  const metrics = stats && stats.length > 0 ? stats : [
    { value: '8+', label: 'Years Experience' },
    { value: '15+', label: 'Projects Delivered' },
    { value: '5+', label: 'Certifications' },
    { value: '12+', label: 'Technologies' },
  ]

  return (
    <section className="relative px-5 sm:px-8 lg:px-12 py-20 sm:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('https://picsum.photos/seed/code-workspace/1920/800')" }} />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-accent/70 to-highlight/60" />

      <div className="mx-auto w-full max-w-6xl relative">
        <StaggerReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <StaggerItem key={metric.label}>
                <motion.div whileHover={{ y: -3 }} className="text-center p-6 sm:p-7 rounded-xl bg-white/15 dark:bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="text-3xl sm:text-4xl font-serif font-normal text-white">{metric.value}</div>
                  <div className="text-sm text-white/70 mt-1.5">{metric.label}</div>
                </motion.div>
              </StaggerItem>
            ))}
          </div>
        </StaggerReveal>
      </div>
    </section>
  )
}
