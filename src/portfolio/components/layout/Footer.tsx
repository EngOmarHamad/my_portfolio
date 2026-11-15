import { Link } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'
import { useLanguage } from '@/shared/i18n'
import { Container, Monogram, SocialIcon } from '@/portfolio/components/ds'
import { useSiteContent } from '@/portfolio/hooks/use-site-content'
import { scrollToTarget } from '@/portfolio/lib/smooth-scroll'
import { SECONDARY_LINKS } from './links'

export function Footer() {
  const { t } = useLanguage()
  const { socials, profile } = useSiteContent()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line">
      <Container className="flex flex-col gap-8 py-12 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Monogram className="h-5 w-auto text-ink" />
          <p className="text-sm text-ink-muted">{t.site.footer.designed}</p>
        </div>

        <nav aria-label={t.site.nav.elsewhere}>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {SECONDARY_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="link-wipe inline-flex min-h-11 items-center text-sm text-ink-muted hover:text-ink">
                  {t.site.nav[link.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {socials.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="group inline-flex size-11 items-center justify-center rounded-chip border border-line text-ink-muted transition-colors duration-200 hover:border-signal hover:text-signal-ink"
            >
              <SocialIcon platform={social.platform} className="size-4 transition-transform duration-500 ease-precise group-hover:-translate-y-0.5" />
            </a>
          ))}
          <button
            type="button"
            onClick={() => scrollToTarget(0)}
            className="group ms-2 inline-flex min-h-11 items-center gap-2 rounded-chip border border-line px-4 text-sm text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
          >
            {t.site.footer.top}
            <ArrowUp className="size-4 transition-transform duration-500 ease-precise group-hover:-translate-y-0.5" aria-hidden />
          </button>
        </div>
      </Container>
      <Container>
        <div className="flex flex-wrap justify-between gap-2 border-t border-line py-6">
        <p className="font-mono text-label text-ink-faint">
          © {year} {profile.name}. {t.site.footer.rights}
        </p>
        <p className="font-mono text-label text-ink-faint">
          {profile.coordinates} · {t.site.meta.build}
        </p>
        </div>
      </Container>
    </footer>
  )
}
