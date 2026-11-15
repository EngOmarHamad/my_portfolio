import { ArrowUpRight, PlayCircle } from 'lucide-react'
import { FaGithub } from 'react-icons/fa6'
import { useLanguage } from '@/shared/i18n'
import type { ProjectLinkVM } from '@/portfolio/data/types'

const ICONS = { live: ArrowUpRight, video: PlayCircle, source: FaGithub }

export function ProjectLinks({ links }: { links: ProjectLinkVM[] }) {
  const { t } = useLanguage()
  if (!links.length) return null
  return (
    <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
      {links.map((link) => {
        const Icon = ICONS[link.kind]
        return (
          <li key={link.url}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-wipe inline-flex min-h-11 items-center gap-2 text-sm text-ink"
            >
              {t.site.work.link[link.kind]}
              <Icon className="size-4 text-ink-muted rtl:-scale-x-100" aria-hidden />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
