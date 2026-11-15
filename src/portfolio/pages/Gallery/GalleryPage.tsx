import { PageTransition } from '@/portfolio/components/layout/PageTransition'
import { Section, SectionHeader } from '@/portfolio/components/ui/Section'
import { useGalleryImages } from '@/portfolio/hooks/use-portfolio-data'

export function GalleryPage() {
  const { data: images = [], isLoading, isError } = useGalleryImages()

  return (
    <PageTransition>
      <Section>
        <SectionHeader title="Gallery" subtitle="Selected images from my work and process." />
        {isLoading && <p className="text-center text-text-secondary">Loading gallery…</p>}
        {isError && <p role="alert" className="text-center text-text-secondary">The gallery could not be loaded. Please try again later.</p>}
        {!isLoading && !isError && images.length === 0 && <p className="text-center text-text-secondary">Gallery images will appear here soon.</p>}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((item) => (
            <figure key={item.id} className="overflow-hidden rounded-xl border border-border bg-surface">
              <img src={item.url} alt={item.alt_text || 'Portfolio gallery image'} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              {item.alt_text && <figcaption className="px-4 py-3 text-sm text-text-secondary">{item.alt_text}</figcaption>}
            </figure>
          ))}
        </div>
      </Section>
    </PageTransition>
  )
}
