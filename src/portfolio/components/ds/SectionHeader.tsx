import { motion } from 'framer-motion'
import { cn } from '@/shared/utils/cn'
import { REVEAL_VIEWPORT, transition, DURATION } from '@/portfolio/lib/motion'
import { RevealWords } from './Reveal'

interface SectionHeaderProps {
  id: string
  index: string
  label: string
  title: string
  intro?: string
  className?: string
  as?: 'h1' | 'h2'
}

/** "// 02 — label" + display headline + optional one-line intro. */
export function SectionHeader({ id, index, label, title, intro, className, as = 'h2' }: SectionHeaderProps) {
  const Heading = as
  return (
    <header className={cn('mb-12 max-w-4xl md:mb-16', className)}>
      <motion.p
        className="label-mono flex items-center gap-3 text-ink-muted"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={REVEAL_VIEWPORT}
        transition={transition(DURATION.base)}
      >
        <span className="text-signal-ink">// {index}</span>
        <span aria-hidden className="h-px w-8 bg-line-strong" />
        <span>{label}</span>
      </motion.p>
      <Heading id={`${id}-title`} className="display-tight mt-6 text-h2 text-balance text-ink">
        <RevealWords text={title} />
      </Heading>
      {intro && (
        <motion.p
          className="mt-6 max-w-prose text-body text-pretty text-ink-muted"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={REVEAL_VIEWPORT}
          transition={transition(DURATION.base, 0.2)}
        >
          {intro}
        </motion.p>
      )}
    </header>
  )
}
