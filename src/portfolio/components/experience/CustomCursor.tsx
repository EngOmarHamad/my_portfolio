import { useEffect, useRef, useState } from 'react'
import { useFinePointer, usePrefersReducedMotion } from '@/portfolio/lib/environment'
import { cn } from '@/shared/utils/cn'

type Mode = 'default' | 'link' | 'label' | 'hidden'

const INTERACTIVE = 'a, button, [role="button"], summary, label, [data-cursor]'
const TEXT_INPUT = 'input, textarea, select, [contenteditable="true"]'
const RING_LERP = 0.2

/**
 * Dot + lagging ring. The ring grows over links and expands into a label pill
 * over elements with `data-cursor="…"`. Mouse/trackpad only; off for reduced motion.
 */
export function CustomCursor() {
  const fine = useFinePointer()
  const reduced = usePrefersReducedMotion()
  const enabled = fine && !reduced

  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<Mode>('hidden')
  const [label, setLabel] = useState('')

  useEffect(() => {
    if (!enabled) return
    const root = document.documentElement
    root.classList.add('has-cursor')

    const target = { x: -100, y: -100 }
    const ringPos = { x: -100, y: -100 }
    let frame = 0
    let visible = false

    const loop = () => {
      ringPos.x += (target.x - ringPos.x) * RING_LERP
      ringPos.y += (target.y - ringPos.y) * RING_LERP
      if (dot.current) dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      target.x = event.clientX
      target.y = event.clientY
      if (!visible) {
        visible = true
        ringPos.x = target.x
        ringPos.y = target.y
        setMode('default')
      }
    }
    const onOver = (event: PointerEvent) => {
      const element = event.target as Element | null
      if (!element?.closest) return
      if (element.closest(TEXT_INPUT)) return setMode('hidden')
      const labelled = element.closest<HTMLElement>('[data-cursor]')
      if (labelled?.dataset.cursor) {
        setLabel(labelled.dataset.cursor)
        return setMode('label')
      }
      setMode(element.closest(INTERACTIVE) ? 'link' : 'default')
    }
    const onLeave = () => {
      visible = false
      setMode('hidden')
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(frame)
      root.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[150]">
      <div ref={ring} className="absolute top-0 left-0 will-change-transform">
        {/* Only transform + opacity animate. */}
        <div
          className={cn(
            'absolute size-10 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-[transform,opacity,border-color] duration-300 ease-precise',
            mode === 'default' && 'scale-75 border-ink-muted opacity-60',
            mode === 'link' && 'scale-125 border-signal opacity-100',
            (mode === 'label' || mode === 'hidden') && 'scale-50 opacity-0',
          )}
        />
        <div
          className={cn(
            'absolute flex h-10 -translate-x-1/2 -translate-y-1/2 items-center rounded-full bg-signal px-4 transition-[transform,opacity] duration-300 ease-precise',
            mode === 'label' ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
          )}
        >
          <span className="label-mono whitespace-nowrap text-on-signal">{label}</span>
        </div>
      </div>
      <div ref={dot} className="absolute top-0 left-0 will-change-transform">
        <div
          className={cn(
            'size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal transition-opacity duration-200',
            mode === 'hidden' || mode === 'label' ? 'opacity-0' : 'opacity-100',
          )}
        />
      </div>
    </div>
  )
}
