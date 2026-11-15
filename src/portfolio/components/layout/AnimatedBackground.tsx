import { useEffect } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { useReducedMotion } from '@/portfolio/hooks/useReducedMotion'

export function AnimatedBackground() {
  const x = useMotionValue(-400)
  const y = useMotionValue(-400)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    let raf = 0
    let targetX = -400
    let targetY = -400
    const onMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        x.set(targetX)
        y.set(targetY)
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [reducedMotion, x, y])

  const background = useMotionTemplate`radial-gradient(800px circle at ${x}px ${y}px, var(--color-primary), transparent 50%)`

  if (reducedMotion) return null

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -inset-[100px] opacity-[0.025] dark:opacity-[0.04]"
        style={{ background }}
      />
    </div>
  )
}
