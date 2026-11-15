import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { m } from 'framer-motion'
import { useLanguage } from '@/shared/i18n'
import { cn } from '@/shared/utils/cn'
import { SkillIcon } from '@/portfolio/components/ds'
import { iconForSkill } from '@/portfolio/data/adapters'
import type { ArchitectureEdgeVM, ArchitectureNodeVM } from '@/portfolio/data/types'
import { DURATION, EASE, REVEAL_VIEWPORT } from '@/portfolio/lib/motion'

interface DiagramProps {
  nodes: ArchitectureNodeVM[]
  edges: ArchitectureEdgeVM[]
  selected: string
  onSelect: (id: string) => void
}

interface EdgePath {
  key: string
  d: string
  from: string
  to: string
}

const LAYERS = [0, 1, 2, 3] as const

/**
 * Layered system diagram. Node positions come from CSS grid; edges are measured
 * from the DOM so the drawing stays exact in LTR, RTL and at every width.
 */
export function ArchitectureDiagram({ nodes, edges, selected, onSelect }: DiagramProps) {
  const { t, lang } = useLanguage()
  const container = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef(new Map<string, HTMLButtonElement>())
  const [paths, setPaths] = useState<EdgePath[]>([])
  const [size, setSize] = useState({ width: 0, height: 0 })

  const neighbours = useMemo(() => {
    const set = new Set<string>([selected])
    edges.forEach(({ from, to }) => {
      if (from === selected) set.add(to)
      if (to === selected) set.add(from)
    })
    return set
  }, [edges, selected])

  const measure = useCallback(() => {
    const root = container.current
    if (!root) return
    const box = root.getBoundingClientRect()
    setSize({ width: box.width, height: box.height })
    const next: EdgePath[] = []
    for (const edge of edges) {
      const a = nodeRefs.current.get(edge.from)?.getBoundingClientRect()
      const b = nodeRefs.current.get(edge.to)?.getBoundingClientRect()
      if (!a || !b) continue
      const forward = b.left >= a.right - 1
      const sx = (forward ? a.right : a.left) - box.left
      const ex = (forward ? b.left : b.right) - box.left
      const sy = a.top + a.height / 2 - box.top
      const ey = b.top + b.height / 2 - box.top
      const bend = (ex - sx) / 2
      next.push({ key: `${edge.from}-${edge.to}`, from: edge.from, to: edge.to, d: `M${sx} ${sy} C${sx + bend} ${sy} ${ex - bend} ${ey} ${ex} ${ey}` })
    }
    setPaths(next)
  }, [edges])

  useLayoutEffect(() => {
    measure()
    const root = container.current
    if (!root) return
    const observer = new ResizeObserver(measure)
    observer.observe(root)
    return () => observer.disconnect()
  }, [measure, lang])

  return (
    <div ref={container} className="relative">
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden md:block"
        width={size.width}
        height={size.height}
        viewBox={`0 0 ${size.width || 1} ${size.height || 1}`}
      >
        {paths.map((path, index) => {
          const lit = neighbours.has(path.from) && neighbours.has(path.to) && (path.from === selected || path.to === selected)
          return (
            <m.path
              key={path.key}
              d={path.d}
              fill="none"
              stroke={lit ? 'var(--accent)' : 'var(--accent-2)'}
              strokeOpacity={lit ? 1 : 0.35}
              strokeWidth={1}
              strokeDasharray={lit ? '0' : '3 5'}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={REVEAL_VIEWPORT}
              transition={{ duration: DURATION.slow, ease: EASE, delay: 0.2 + index * 0.04 }}
            />
          )
        })}
      </svg>

      <div className="grid gap-6 md:grid-cols-4 md:gap-x-16 md:gap-y-6 lg:gap-x-24">
        {LAYERS.map((layer) => (
          <div key={layer} className="flex flex-col gap-3 md:gap-6">
            <p className="label-mono flex items-center gap-2 text-ink-faint">
              <span className="text-circuit">L{layer}</span>
              {t.site.skills.layers[layer]}
            </p>
            <div className="flex flex-wrap gap-3 md:flex-col md:gap-6">
              {nodes
                .filter((node) => node.layer === layer)
                .sort((a, b) => a.row - b.row)
                .map((node, index) => {
                  const isSelected = node.id === selected
                  const isNeighbour = !isSelected && neighbours.has(node.id)
                  return (
                    <m.button
                      key={node.id}
                      ref={(element) => {
                        if (element) nodeRefs.current.set(node.id, element)
                        else nodeRefs.current.delete(node.id)
                      }}
                      type="button"
                      aria-pressed={isSelected}
                      onPointerEnter={(event) => event.pointerType === 'mouse' && onSelect(node.id)}
                      onFocus={() => onSelect(node.id)}
                      onClick={() => onSelect(node.id)}
                      className={cn(
                        'relative z-10 flex min-h-12 items-center justify-between gap-3 rounded-chip border bg-panel px-4 text-start text-sm transition-colors duration-200',
                        isSelected && 'border-signal text-ink',
                        isNeighbour && 'border-circuit text-ink',
                        !isSelected && !isNeighbour && 'border-line text-ink-muted hover:text-ink',
                      )}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={REVEAL_VIEWPORT}
                      transition={{ duration: DURATION.base, ease: EASE, delay: layer * 0.08 + index * 0.05 }}
                    >
                      <span className="font-medium">{node.label}</span>
                      <span
                        aria-hidden
                        className={cn('size-1.5 rounded-full', isSelected ? 'bg-signal' : isNeighbour ? 'bg-circuit' : 'bg-line-strong')}
                      />
                    </m.button>
                  )
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** The technologies behind the traced node and its neighbours. */
export function TracePanel({ node, connected }: { node: ArchitectureNodeVM; connected: ArchitectureNodeVM[] }) {
  const { t } = useLanguage()
  return (
    <div aria-live="polite" className="rounded-card border border-line bg-panel p-6">
      <p className="label-mono text-ink-faint">
        {t.site.skills.traced} <span className="text-signal-ink">→ {node.label}</span>
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {node.technologies.map((tech) => (
          <li key={tech} className="inline-flex min-h-9 items-center gap-2 rounded-chip border border-signal px-3 text-sm text-ink">
            <SkillIcon name={tech} icon={iconForSkill(tech)} />
            {tech}
          </li>
        ))}
      </ul>
      {connected.length > 0 && (
        <p className="mt-4 font-mono text-label text-ink-muted">
          ⇄ {connected.map((item) => item.label).join(' · ')}
        </p>
      )}
    </div>
  )
}
