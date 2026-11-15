import type { ReactNode } from 'react'
import { m } from 'framer-motion'
import { DURATION, EASE, REVEAL_VIEWPORT, STAGGER, transition } from '@/portfolio/lib/motion'

type RevealVariant = 'fade' | 'clip' | 'rise'

interface RevealProps {
  children: ReactNode
  variant?: RevealVariant
  delay?: number
  className?: string
  as?: 'div' | 'li' | 'article' | 'figure'
}

const VARIANTS = {
  /** Plain opacity — for dense UI where movement would be noise. */
  fade: { hidden: { opacity: 0 }, shown: { opacity: 1 } },
  /** Small vertical drift. */
  rise: { hidden: { opacity: 0, y: 24 }, shown: { opacity: 1, y: 0 } },
  /** Bottom-up wipe — used for cards and media. */
  clip: { hidden: { clipPath: 'inset(100% 0% 0% 0%)' }, shown: { clipPath: 'inset(0% 0% 0% 0%)' } },
} as const

/** Scroll-triggered reveal; each section picks a different variant on purpose. */
export function Reveal({ children, variant = 'rise', delay = 0, className, as = 'div' }: RevealProps) {
  const Component = m[as]
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={REVEAL_VIEWPORT}
      variants={VARIANTS[variant]}
      transition={transition(variant === 'clip' ? DURATION.slow : DURATION.base, delay)}
    >
      {children}
    </Component>
  )
}

interface RevealWordsProps {
  text: string
  /** Start immediately (hero) instead of on scroll. */
  play?: boolean
  delay?: number
  className?: string
}

/**
 * Word-by-word masked reveal: each word rises 0.6em out of an overflow clip,
 * 60ms apart. Screen readers get the sentence once, from a visually hidden copy.
 */
export function RevealWords({ text, play, delay = 0, className }: RevealWordsProps) {
  const words = text.split(/\s+/).filter(Boolean)
  const trigger = play === undefined ? { whileInView: 'shown' as const, viewport: REVEAL_VIEWPORT } : { animate: play ? 'shown' : 'hidden' }

  return (
    <m.span
      className={className}
      initial="hidden"
      {...trigger}
      transition={{ staggerChildren: STAGGER, delayChildren: delay }}
    >
      <span className="sr-only">{text}</span>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <m.span
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: '0.6em', opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' },
              shown: { y: '0em', opacity: 1, clipPath: 'inset(0% 0% -20% 0%)' },
            }}
            transition={{ duration: DURATION.slow, ease: EASE }}
          >
            {word}
          </m.span>
          {index < words.length - 1 && ' '}
        </span>
      ))}
    </m.span>
  )
}
