import type { MouseEvent, PointerEvent } from 'react'
import { useMotionValue, useSpring, useTransform } from 'framer-motion'
import { trackSpotlight } from '@/portfolio/lib/spotlight'
import { useFinePointer, usePrefersReducedMotion } from '@/portfolio/lib/environment'

const MAX_TILT = 6
const SPRING = { stiffness: 200, damping: 30, mass: 0.6 }

/** Open in the modal unless the user asked for a new tab/window. */
export const isPlainClick = (event: MouseEvent) =>
  event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey

export function useTilt() {
  const fine = useFinePointer()
  const reduced = usePrefersReducedMotion()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]), SPRING)
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]), SPRING)
  const enabled = fine && !reduced

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    trackSpotlight(event)
    if (!enabled) return
    const rect = event.currentTarget.getBoundingClientRect()
    px.set((event.clientX - rect.left) / rect.width - 0.5)
    py.set((event.clientY - rect.top) / rect.height - 0.5)
  }
  const onPointerLeave = () => {
    px.set(0)
    py.set(0)
  }
  return { style: enabled ? { rotateX, rotateY, transformPerspective: 1000 } : undefined, onPointerMove, onPointerLeave }
}
