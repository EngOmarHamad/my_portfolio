import { useEffect, useState } from 'react'

interface MousePosition {
  x: number
  y: number
}

export function useMousePosition() {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 })

  useEffect(() => {
    let rafId: number
    let currentX = 0
    let currentY = 0

    const handleMouseMove = (e: MouseEvent) => {
      currentX = e.clientX
      currentY = e.clientY
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        setPosition({ x: currentX, y: currentY })
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return position
}
