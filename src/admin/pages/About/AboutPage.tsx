import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createBaseService } from '@/admin/services/supabase-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { Input, Textarea, Toggle } from '@/admin/components/ui/FormField'
import { ImageUpload } from '@/admin/components/ui/ImageUpload'
import { toast } from 'sonner'
import type { About } from '@/admin/types'

const aboutService = createBaseService<About>('about')

export function AboutPage() {
  const queryClient = useQueryClient()

  const { data: about, isLoading } = useQuery({
    queryKey: ['about'],
    queryFn: async () => {
      const { data } = await aboutService.list({ pageSize: 1 })
      return data[0]
    },
  })

  const mutation = useMutation({
    mutationFn: (values: Partial<About>) =>
      about
        ? aboutService.update(about.id, values)
        : aboutService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about'] })
      toast.success('About section updated')
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to update'),
  })

  if (isLoading) return <PageSkeleton />

  return (
    <div>
      <PageHeader title="About" description="Manage your about section" />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          const form = new FormData(e.currentTarget)
          const values: Record<string, unknown> = {}
          form.forEach((v, k) => { values[k] = v })
          mutation.mutate(values as unknown as Partial<About>)
        }}
        className="max-w-3xl space-y-8"
      >
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-6">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Profile</h2>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Profile Image</label>
            <ImageUpload
              value={about?.profile_image_url}
              onChange={(url) => mutation.mutate({ profile_image_url: url })}
              bucket="avatars"
              aspectRatio="1/1"
              className="max-w-[200px]"
            />
          </div>

          <Textarea
            label="Biography"
            name="biography"
            defaultValue={about?.biography}
            rows={6}
            placeholder="Write your biography..."
          />

          <Input
            label="Years of Experience"
            name="years_experience"
            type="number"
            defaultValue={about?.years_experience?.toString()}
          />
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Status</h2>
          <Toggle
            label="Published"
            checked={about?.is_published ?? true}
            onChange={(checked) => mutation.mutate({ is_published: checked })}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-6 py-2.5 text-sm font-medium rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)] disabled:opacity-50 transition-colors"
          >
            {mutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
