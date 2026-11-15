import {
  siBootstrap,
  siCss,
  siDocker,
  siDotnet,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siJsonwebtokens,
  siPostgresql,
  siPostman,
  siReact,
  siSwagger,
  siTailwindcss,
  siTypescript,
} from 'simple-icons'
import { cn } from '@/shared/utils/cn'

const ICONS = {
  siBootstrap,
  siCss,
  siDocker,
  siDotnet,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siJsonwebtokens,
  siPostgresql,
  siPostman,
  siReact,
  siSwagger,
  siTailwindcss,
  siTypescript,
} as const

const initials = (name: string) =>
  name
    .replace(/[^A-Za-z0-9#+. ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

/** Real brand logo (simple-icons, monochrome) or a mono monogram when none exists. */
export function SkillIcon({ name, icon, className }: { name: string; icon?: string; className?: string }) {
  const data = icon ? ICONS[icon as keyof typeof ICONS] : undefined
  if (data) {
    return (
      <svg viewBox="0 0 24 24" className={cn('size-4 shrink-0', className)} aria-hidden fill="currentColor">
        <path d={data.path} />
      </svg>
    )
  }
  return (
    <span aria-hidden className={cn('grid size-4 shrink-0 place-items-center font-mono text-[9px] leading-none font-medium', className)}>
      {initials(name)}
    </span>
  )
}
