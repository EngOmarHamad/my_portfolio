import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

/**
 * Page entrance without opacity fading: a full-page opacity fade forces
 * Chromium to composite backdrop-blur descendants inside a transparent
 * group, which flashes black seams/bars until the animation completes.
 * A short vertical drift is artifact-free and keeps the premium feel.
 */
export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ y: 10 }}
      animate={{ y: 0 }}
      transition={{
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
