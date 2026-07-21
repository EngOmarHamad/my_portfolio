import { useEffect, useRef, useState } from 'react'
import { useInView } from '@/portfolio/hooks/useInView'
import { useReducedMotion } from '@/portfolio/hooks/useReducedMotion'

interface CountUpProps {
  end: number
  duration?: number
  suffix?: string
  label?: string
  className?: string
}

export function CountUp({
  end,
  duration = 2000,
  suffix = '',
  className,
}: CountUpProps) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({ threshold: 0.3, once: true })
  const reducedMotion = useReducedMotion()
  const startedRef = useRef(false)

  useEffect(() => {
    if (!inView || startedRef.current) return
    startedRef.current = true

    if (reducedMotion) {
      setCount(end)
      return
    }

    const startTime = performance.now()
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  }, [inView, end, duration, reducedMotion])

  return (
    <div ref={ref} className={className}>
      <span className="text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tight text-text">
        {count}
        {suffix}
      </span>
    </div>
  )
}
