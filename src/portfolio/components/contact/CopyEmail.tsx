import { useRef } from 'react'
import { Copy } from 'lucide-react'
import { useLanguage } from '@/shared/i18n'
import { showToast } from '@/portfolio/components/ds'

/** Email as a mailto link plus a copy button that confirms with a toast. */
export function CopyEmail({ email }: { email: string }) {
  const { t } = useLanguage()
  const link = useRef<HTMLAnchorElement>(null)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      showToast(t.site.contact.copied)
    } catch {
      const selection = window.getSelection()
      if (link.current && selection) {
        const range = document.createRange()
        range.selectNodeContents(link.current)
        selection.removeAllRanges()
        selection.addRange(range)
      }
      showToast(t.site.contact.copyFailed)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a ref={link} href={`mailto:${email}`} className="link-wipe min-h-11 break-all text-lead font-medium text-ink" dir="ltr">
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-11 items-center gap-2 rounded-chip border border-line px-4 text-sm text-ink-muted transition-colors hover:border-signal hover:text-ink"
      >
        <Copy className="size-4" aria-hidden />
        {t.site.contact.copy}
      </button>
    </div>
  )
}
