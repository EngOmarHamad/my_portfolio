import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { useLanguage } from '@/shared/i18n'
import type { ProjectVM } from '@/portfolio/data/types'
import { lockScroll } from '@/portfolio/lib/smooth-scroll'
import { useFocusTrap } from '@/portfolio/lib/use-focus-trap'
import { DURATION, transition } from '@/portfolio/lib/motion'
import { CaseStudyContent } from './CaseStudyContent'

interface CaseStudyModalProps {
  project: ProjectVM | null
  onClose: () => void
}

/** Full-screen case study over the page; Esc, the scrim and Back all close it. */
export function CaseStudyModal({ project, onClose }: CaseStudyModalProps) {
  return <AnimatePresence>{project && <Dialog key={project.id} project={project} onClose={onClose} />}</AnimatePresence>
}

function Dialog({ project, onClose }: { project: ProjectVM; onClose: () => void }) {
  const { t } = useLanguage()
  const panel = useRef<HTMLDivElement>(null)
  const titleId = `case-${project.id}-title`

  useFocusTrap(panel, true, onClose)
  useEffect(() => {
    lockScroll(true)
    return () => lockScroll(false)
  }, [])

  return (
    <div className="fixed inset-0 z-[80]">
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-(--scrim) backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={transition(DURATION.base)}
        onClick={onClose}
      />
      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-x-0 bottom-0 top-4 overflow-y-auto overscroll-contain rounded-t-card border border-line bg-canvas md:inset-x-6 md:top-6 lg:inset-x-auto lg:start-1/2 lg:w-full lg:max-w-5xl lg:-translate-x-1/2 rtl:lg:translate-x-1/2"
        initial={{ y: '100%' }}
        animate={{ y: '0%' }}
        exit={{ y: '100%' }}
        transition={transition(DURATION.slow)}
        data-lenis-prevent
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-canvas/90 px-6 py-3 backdrop-blur-md md:px-12">
          <Link to={`/projects/${project.routeId}`} className="label-mono inline-flex min-h-11 items-center gap-2 text-ink-muted hover:text-ink">
            {t.site.work.case.openPage}
            <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.site.work.case.close}
            className="inline-flex size-11 items-center justify-center rounded-chip border border-line text-ink hover:border-signal"
            data-autofocus
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="px-6 py-8 md:px-12 md:py-12">
          <CaseStudyContent project={project} titleId={titleId} />
        </div>
      </motion.div>
    </div>
  )
}
