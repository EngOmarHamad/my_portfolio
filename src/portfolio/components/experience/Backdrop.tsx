import { motion, useScroll, useTransform } from 'framer-motion'
import { usePrefersReducedMotion } from '@/portfolio/lib/environment'

const CELL = 64
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/** Fixed blueprint grid that drifts slower than the page, plus a 2.5% grain. */
export function Backdrop() {
  const reduced = usePrefersReducedMotion()
  const { scrollY } = useScroll()
  // Wraps every cell so the transform stays tiny and the layer never needs repainting.
  const y = useTransform(scrollY, (value) => (reduced ? 0 : -((value * 0.15) % CELL)))

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div className="bg-blueprint absolute -inset-x-0 -top-16 -bottom-16" style={{ y }} />
      </div>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[90] opacity-[0.025] mix-blend-overlay"
        style={{ backgroundImage: NOISE }}
      />
    </>
  )
}
