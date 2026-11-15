import { useEffect, useRef } from 'react'

/**
 * Hero "system map": a canvas network of services that drift, stay connected
 * and gently move away from the cursor. Pure canvas 2D, no dependencies.
 * Paused off-screen and in background tabs; a single static frame on touch
 * devices and under reduced motion.
 */

interface ServiceNode {
  label?: string
  hx: number // home position, normalised 0..1
  hy: number
  x: number
  y: number
  ox: number // cursor-repulsion offset (px)
  oy: number
  phase: number
  amp: number
}

const SERVICES: Array<[string, number, number]> = [
  ['Client', 0.1, 0.32],
  ['Gateway', 0.3, 0.2],
  ['API', 0.48, 0.4],
  ['Auth', 0.3, 0.6],
  ['SignalR', 0.66, 0.16],
  ['Queue', 0.7, 0.5],
  ['Worker', 0.9, 0.34],
  ['Cache', 0.6, 0.76],
  ['DB', 0.86, 0.74],
  ['Reports', 0.16, 0.84],
]

const LINKS: Array<[number, number]> = [
  [0, 1], [1, 2], [1, 3], [2, 3], [2, 4], [2, 5], [5, 6], [2, 7], [7, 8], [6, 8], [3, 8], [9, 2], [4, 6],
]

const AMBIENT = 22
const NEIGHBOUR_RADIUS = 150
const REPEL_RADIUS = 150
const REPEL_FORCE = 26
const PACKETS = 3

/** Deterministic pseudo-random so the layout is identical on every visit. */
function seeded(seed: number) {
  let value = seed
  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

function readPalette() {
  const style = getComputedStyle(document.documentElement)
  const get = (name: string) => style.getPropertyValue(name).trim()
  return { bg: get('--bg'), circuit: get('--accent-2'), signal: get('--accent'), text: get('--text'), muted: get('--muted'), line: get('--border-strong') }
}

interface SystemMapProps {
  /** false → draw a single static frame. */
  animate: boolean
  className?: string
}

export default function SystemMap({ animate, className }: SystemMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const random = seeded(7)
    const nodes: ServiceNode[] = [
      ...SERVICES.map(([label, hx, hy]) => ({ label, hx, hy })),
      ...Array.from({ length: AMBIENT }, () => ({ hx: random(), hy: random() })),
    ].map((node) => ({ ...node, x: 0, y: 0, ox: 0, oy: 0, phase: random() * Math.PI * 2, amp: 6 + random() * 10 }))

    const packets = Array.from({ length: PACKETS }, (_, index) => ({ link: (index * 4) % LINKS.length, t: random(), forward: true }))

    let palette = readPalette()
    let width = 0
    let height = 0
    let frame = 0
    let running = false
    const pointer = { x: -9999, y: -9999 }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const step = (time: number) => {
      const seconds = time / 1000
      for (const node of nodes) {
        const baseX = node.hx * width + Math.sin(seconds * 0.25 + node.phase) * node.amp
        const baseY = node.hy * height + Math.cos(seconds * 0.2 + node.phase) * node.amp
        const dx = baseX - pointer.x
        const dy = baseY - pointer.y
        const distance = Math.hypot(dx, dy)
        let targetX = 0
        let targetY = 0
        if (distance < REPEL_RADIUS && distance > 0.01) {
          const push = Math.pow(1 - distance / REPEL_RADIUS, 2) * REPEL_FORCE
          targetX = (dx / distance) * push
          targetY = (dy / distance) * push
        }
        node.ox += (targetX - node.ox) * 0.08
        node.oy += (targetY - node.oy) * 0.08
        node.x = baseX + node.ox
        node.y = baseY + node.oy
      }
      for (const packet of packets) {
        packet.t += 0.004
        if (packet.t >= 1) {
          const [, end] = LINKS[packet.link]
          const next = LINKS.findIndex(([from], index) => from === end && index !== packet.link)
          packet.link = next >= 0 ? next : (packet.link + 3) % LINKS.length
          packet.t = 0
        }
      }
    }

    const draw = () => {
      context.clearRect(0, 0, width, height)
      context.lineWidth = 1

      // Ambient proximity mesh.
      context.strokeStyle = palette.line
      for (let i = SERVICES.length; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const distance = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y)
          if (distance > NEIGHBOUR_RADIUS) continue
          context.globalAlpha = (1 - distance / NEIGHBOUR_RADIUS) * 0.5
          context.beginPath()
          context.moveTo(nodes[i].x, nodes[i].y)
          context.lineTo(nodes[j].x, nodes[j].y)
          context.stroke()
        }
      }

      // Service topology.
      context.strokeStyle = palette.circuit
      context.globalAlpha = 0.35
      context.setLineDash([4, 6])
      for (const [from, to] of LINKS) {
        context.beginPath()
        context.moveTo(nodes[from].x, nodes[from].y)
        context.lineTo(nodes[to].x, nodes[to].y)
        context.stroke()
      }
      context.setLineDash([])

      // Requests in flight (amber, the only accent on the canvas).
      context.fillStyle = palette.signal
      context.globalAlpha = 0.9
      for (const packet of packets) {
        const [from, to] = LINKS[packet.link]
        const x = nodes[from].x + (nodes[to].x - nodes[from].x) * packet.t
        const y = nodes[from].y + (nodes[to].y - nodes[from].y) * packet.t
        context.fillRect(x - 1.5, y - 1.5, 3, 3)
      }

      // Nodes.
      context.font = '500 11px "JetBrains Mono", ui-monospace, monospace'
      context.textBaseline = 'middle'
      // Labels are technical identifiers: always left-to-right, even in Arabic.
      context.direction = 'ltr'
      context.textAlign = 'left'
      for (const node of nodes) {
        if (!node.label) {
          context.globalAlpha = 0.45
          context.fillStyle = palette.muted
          context.beginPath()
          context.arc(node.x, node.y, 1.5, 0, Math.PI * 2)
          context.fill()
          continue
        }
        const near = Math.hypot(node.x - pointer.x, node.y - pointer.y) < REPEL_RADIUS
        context.globalAlpha = 1
        context.fillStyle = palette.bg
        context.fillRect(node.x - 4, node.y - 4, 8, 8)
        context.strokeStyle = near ? palette.signal : palette.circuit
        context.strokeRect(node.x - 4, node.y - 4, 8, 8)
        context.globalAlpha = near ? 1 : 0.75
        context.fillStyle = near ? palette.text : palette.muted
        context.fillText(node.label.toUpperCase(), node.x + 10, node.y)
      }
      context.globalAlpha = 1
    }

    const loop = (time: number) => {
      step(time)
      draw()
      frame = requestAnimationFrame(loop)
    }

    const start = () => {
      if (running || !animate) return
      running = true
      frame = requestAnimationFrame(loop)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(frame)
    }

    resize()
    step(0)
    draw()

    const resizeObserver = new ResizeObserver(() => {
      resize()
      step(performance.now())
      draw()
    })
    resizeObserver.observe(canvas)

    // Repaint with the new palette when the theme class changes.
    const themeObserver = new MutationObserver(() => {
      palette = readPalette()
      draw()
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    if (!animate) {
      return () => {
        resizeObserver.disconnect()
        themeObserver.disconnect()
      }
    }

    const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    visibility.observe(canvas)
    const onVisibility = () => (document.hidden ? stop() : start())
    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
    }
    const onLeave = () => {
      pointer.x = -9999
      pointer.y = -9999
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pointermove', onPointer, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)

    return () => {
      stop()
      resizeObserver.disconnect()
      themeObserver.disconnect()
      visibility.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointer)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [animate])

  return <canvas ref={canvasRef} className={className} aria-hidden />
}
