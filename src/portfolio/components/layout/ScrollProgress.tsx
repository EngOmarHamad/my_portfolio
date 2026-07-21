import { motion, useSpring } from 'framer-motion'
import { useScrollProgress } from '@/portfolio/hooks/useScrollProgress'

export function ScrollProgress() {
  const progress = useScrollProgress()
  const scaleX = useSpring(progress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-px bg-primary origin-left z-[60]"
      style={{ scaleX }}
    />
  )
}
