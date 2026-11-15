import { ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/shared/i18n'
import { Button, Container, RevealWords } from '@/portfolio/components/ds'

export function NotFoundPage() {
  const { t } = useLanguage()
  const copy = t.site.notFound
  return (
    <Container className="flex min-h-svh flex-col justify-center pt-(--nav-h)">
      <p className="label-mono text-signal-ink">// {copy.code}</p>
      <h1 className="mt-6 max-w-4xl font-display text-hero font-bold text-balance display-tight text-ink">
        <RevealWords text={copy.title} play />
      </h1>
      <p className="mt-6 text-ink-muted">{copy.body}</p>
      <div className="mt-12">
        <Button to="/">
          <ArrowLeft className="size-4 rtl:-scale-x-100" aria-hidden />
          {copy.home}
        </Button>
      </div>
    </Container>
  )
}
