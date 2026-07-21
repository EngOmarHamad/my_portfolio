import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createBaseService } from '@/admin/services/supabase-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { DeleteButton } from '@/admin/components/ui/DeleteButton'
import { ImageUpload } from '@/admin/components/ui/ImageUpload'
import { Input } from '@/admin/components/ui/FormField'
import { toast } from 'sonner'
import { Plus, X } from 'lucide-react'
import type { GalleryImage } from '@/admin/types'

const galleryService = createBaseService<GalleryImage>('gallery_images')

export function GalleryPage() {
  const [showUpload, setShowUpload] = useState(false)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: () => galleryService.list({ pageSize: 100 }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => galleryService.remove(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['gallery'] }); toast.success('Image deleted') },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to delete'),
  })

  const createMutation = useMutation({
    mutationFn: (values: Partial<GalleryImage>) => galleryService.create(values),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['gallery'] }); toast.success('Image added'); setShowUpload(false) },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to add image'),
  })

  if (isLoading) return <PageSkeleton />

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Gallery</h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Manage your gallery images</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)] transition-colors">
          <Plus className="w-4 h-4" />Add Images
        </button>
      </div>

      {data && data.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="p-4 rounded-2xl bg-[var(--color-surface-hover)] mb-4"><X className="w-10 h-10 text-[var(--color-text-tertiary)]" /></div>
          <h3 className="text-lg font-semibold">No images yet</h3>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Upload your first gallery image.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data?.data.map((image) => (
            <div key={image.id} className="group relative rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]">
              <img src={image.url} alt={image.alt_text || ''} className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <DeleteButton onDelete={() => deleteMutation.mutateAsync(image.id)} />
              </div>
              {image.is_featured && (
                <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-500 text-white">Featured</span>
              )}
            </div>
          ))}
        </div>
      )}

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowUpload(false)} />
          <div className="relative bg-[var(--color-surface)] rounded-2xl shadow-dialog border border-[var(--color-border)] p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-6">Add Image to Gallery</h3>
            <div className="space-y-4">
              <ImageUpload
                onChange={(url) => createMutation.mutate({ url, is_featured: false, display_order: 0 } as Partial<GalleryImage>)}
                bucket="gallery"
                aspectRatio="1/1"
              />
              <button type="button" onClick={() => setShowUpload(false)} className="w-full px-4 py-2 text-sm font-medium rounded-lg border border-[var(--color-border)]">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
