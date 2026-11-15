import { useLanguage } from '@/shared/i18n'
import { cn } from '@/shared/utils/cn'
import type { ProjectVM } from '@/portfolio/data/types'

const initials = (title: string) =>
  title
    .split(/[\s–—-]+/)
    .filter((word) => /^[A-Za-z]/.test(word))
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')

/**
 * Project screenshot, or — when none is published yet — a generated blueprint
 * plate clearly marked as a placeholder.
 */
export function ProjectCover({ project, className, eager, size = 'card' }: { project: ProjectVM; className?: string; eager?: boolean; size?: 'card' | 'feature' }) {
  const { t } = useLanguage()

  if (project.cover) {
    return (
      <img
        src={project.cover}
        alt=""
        width={1600}
        height={1000}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={cn('size-full object-cover', className)}
      />
    )
  }

  return (
    <div className={cn('bg-blueprint relative flex size-full flex-col justify-between bg-panel-2 p-6', className)}>
      <div className="flex items-start justify-between gap-4 font-mono text-label text-ink-faint">
        <span>{project.category || 'system'}</span>
        <span>{project.year || '—'}</span>
      </div>
      <span aria-hidden className={cn('font-display leading-none font-bold tracking-tighter text-line-strong', size === 'feature' ? 'text-hero' : 'text-title')}>
        {initials(project.title)}
      </span>
      <div className="flex items-end justify-between gap-4">
        <span className="min-w-0 truncate font-mono text-label text-ink-muted">{project.technologies.slice(0, 3).join(' / ')}</span>
        <span className="hidden shrink-0 font-mono text-label whitespace-nowrap text-ink-faint sm:inline">{t.site.work.coverPlaceholder}</span>
      </div>
    </div>
  )
}
