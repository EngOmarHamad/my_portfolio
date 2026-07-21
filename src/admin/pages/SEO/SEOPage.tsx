import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createBaseService } from '@/admin/services/supabase-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { Input, Textarea } from '@/admin/components/ui/FormField'
import { ImageUpload } from '@/admin/components/ui/ImageUpload'
import { toast } from 'sonner'
import type { SEO } from '@/admin/types'

const seoService = createBaseService<SEO>('seo')

export function SEOPage() {
  const queryClient = useQueryClient()

  const { data: seo, isLoading } = useQuery({
    queryKey: ['seo'],
    queryFn: async () => {
      const { data } = await seoService.list({ pageSize: 1 })
      return data[0]
    },
  })

  const mutation = useMutation({
    mutationFn: (values: Partial<SEO>) =>
      seo ? seoService.update(seo.id, values) : seoService.create(values),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['seo'] }); toast.success('SEO settings updated') },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to update'),
  })

  if (isLoading) return <PageSkeleton />

  return (
    <div>
      <PageHeader title="SEO" description="Manage SEO settings for your portfolio" />
      <form onSubmit={(e) => { e.preventDefault(); const form = new FormData(e.currentTarget); mutation.mutate(Object.fromEntries(form) as unknown as Partial<SEO>) }} className="max-w-2xl space-y-6">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
          <h2 className="text-lg font-semibold">General</h2>
          <Input label="Site Title" name="site_title" defaultValue={seo?.site_title} />
          <Textarea label="Site Description" name="site_description" defaultValue={seo?.site_description} rows={3} />
          <Input label="Keywords (comma separated)" name="keywords" defaultValue={seo?.keywords?.join(', ')} />
          <Input label="Canonical URL" name="canonical_url" defaultValue={seo?.canonical_url} placeholder="https://example.com" />
          <Input label="Robots" name="robots" defaultValue={seo?.robots || 'index, follow'} />
          <div className="space-y-2">
            <label className="text-sm font-medium">Favicon</label>
            <ImageUpload value={seo?.favicon_url} onChange={(url) => mutation.mutate({ favicon_url: url })} bucket="uploads" aspectRatio="1/1" className="max-w-[100px]" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
          <h2 className="text-lg font-semibold">Open Graph</h2>
          <Input label="OG Title" name="og_title" defaultValue={seo?.og_title} />
          <Textarea label="OG Description" name="og_description" defaultValue={seo?.og_description} rows={2} />
          <div className="space-y-2">
            <label className="text-sm font-medium">OG Image</label>
            <ImageUpload value={seo?.og_image_url} onChange={(url) => mutation.mutate({ og_image_url: url })} bucket="uploads" />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
          <h2 className="text-lg font-semibold">Twitter Card</h2>
          <Input label="Twitter Handle" name="twitter_handle" defaultValue={seo?.twitter_handle} placeholder="@username" />
          <Input label="Twitter Card Type" name="twitter_card" defaultValue={seo?.twitter_card || 'summary_large_image'} />
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={mutation.isPending} className="px-6 py-2.5 text-sm font-medium rounded-xl bg-[var(--color-primary)] text-white disabled:opacity-50">{mutation.isPending ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  )
}
