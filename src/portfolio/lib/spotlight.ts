import type { PointerEvent } from 'react'

/** Track the pointer in CSS vars; the amber spotlight itself is pure CSS (.spotlight). */
export function trackSpotlight(event: PointerEvent<HTMLElement>) {
  const node = event.currentTarget
  const rect = node.getBoundingClientRect()
  node.style.setProperty('--mx', `${event.clientX - rect.left}px`)
  node.style.setProperty('--my', `${event.clientY - rect.top}px`)
}
