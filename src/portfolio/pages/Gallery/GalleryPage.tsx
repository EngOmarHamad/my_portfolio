import { useLanguage } from '@/shared/i18n'
import { Reveal } from '@/portfolio/components/ds'
import { useGalleryImages } from '@/portfolio/hooks/use-portfolio-data'
import { PageShell, StatusMessage } from '../PageShell'

export function GalleryPage() {
  const { t } = useLanguage()
  const copy = t.site.pages.gallery
  const { data: images = [], isLoading, isError } = useGalleryImages()

  return (
    <PageShell id="gallery" index="G" label={copy.label} title={copy.title} intro={copy.intro}>
      {isLoading && <StatusMessage role="status">{t.site.pages.loading}</StatusMessage>}
      {isError && <StatusMessage role="alert">{t.site.pages.error}</StatusMessage>}
      {!isLoading && !isError && images.length === 0 && <StatusMessage>{copy.empty}</StatusMessage>}
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((item, index) => (
          <Reveal key={item.id} as="li" variant="clip" delay={(index % 3) * 0.08}>
            <figure>
              <div className="overflow-hidden rounded-card border border-line">
                <img
                  src={item.url}
                  alt={item.alt_text || copy.alt}
                  width={1200}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-precise hover:scale-105"
                />
              </div>
              {item.alt_text && (
                <figcaption className="mt-3 font-mono text-label text-ink-muted">
                  fig.{String(index + 1).padStart(2, '0')} — {item.alt_text}
                </figcaption>
              )}
            </figure>
          </Reveal>
        ))}
      </ul>
    </PageShell>
  )
}
