import { useMousePosition } from '@/hooks/useMousePosition'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function AnimatedBackground() {
  const { x, y } = useMousePosition()
  const reducedMotion = useReducedMotion()

  if (reducedMotion) return null

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        className="absolute -inset-[100px] opacity-[0.025] dark:opacity-[0.04]"
        style={{
          background: `radial-gradient(800px circle at ${x}px ${y}px, var(--color-primary), transparent 50%)`,
        }}
      />
    </div>
  )
}
