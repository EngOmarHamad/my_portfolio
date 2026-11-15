import type { ReactNode } from 'react'
import { Section, SectionHeader } from '@/portfolio/components/ds'

interface PageShellProps {
  id: string
  index: string
  label: string
  title: string
  intro?: string
  children: ReactNode
}

/** Standalone page frame: same header grammar as the home sections, with an h1. */
export function PageShell({ id, index, label, title, intro, children }: PageShellProps) {
  return (
    <Section id={id} className="min-h-svh pt-[calc(var(--nav-h)+4rem)]">
      <SectionHeader as="h1" id={id} index={index} label={label} title={title} intro={intro} />
      {children}
    </Section>
  )
}

export function StatusMessage({ children, role }: { children: ReactNode; role?: 'alert' | 'status' }) {
  return (
    <p role={role} className="rounded-card border border-dashed border-line-strong p-12 text-center text-ink-muted">
      {children}
    </p>
  )
}
