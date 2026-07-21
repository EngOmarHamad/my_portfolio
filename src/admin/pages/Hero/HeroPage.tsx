import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createBaseService } from '@/admin/services/supabase-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { Input, Textarea, Toggle } from '@/admin/components/ui/FormField'
import { ImageUpload } from '@/admin/components/ui/ImageUpload'
import { toast } from 'sonner'
import type { Hero } from '@/admin/types'

const heroService = createBaseService<Hero>('hero')

export function HeroPage() {
  const queryClient = useQueryClient()

  const { data: hero, isLoading } = useQuery({
    queryKey: ['hero'],
    queryFn: async () => {
      const { data } = await heroService.list({ pageSize: 1 })
      return data[0]
    },
  })

  const mutation = useMutation({
    mutationFn: (values: Partial<Hero>) =>
      hero
        ? heroService.update(hero.id, values)
        : heroService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero'] })
      toast.success('Hero section updated')
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to update'),
  })

  if (isLoading) return <PageSkeleton />

  return (
    <div>
      <PageHeader
        title="Hero Section"
        description="Manage your hero/landing section content"
      />

      <form
        onSubmit={(e) => {
          e.preventDefault()
          const form = new FormData(e.currentTarget)
          mutation.mutate(Object.fromEntries(form) as unknown as Partial<Hero>)
        }}
        className="max-w-3xl space-y-8"
      >
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-6">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Main Content</h2>

          <Input
            label="Name"
            name="name"
            defaultValue={hero?.name}
            required
            placeholder="Your full name"
          />

          <Input
            label="Title"
            name="title"
            defaultValue={hero?.title}
            required
            placeholder="e.g. Full Stack Developer"
          />

          <Textarea
            label="Short Description"
            name="short_description"
            defaultValue={hero?.short_description}
            placeholder="Brief introduction"
            rows={3}
          />

          <Textarea
            label="Long Description"
            name="long_description"
            defaultValue={hero?.long_description}
            placeholder="Detailed introduction"
            rows={5}
          />
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-6">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Media</h2>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Avatar</label>
            <ImageUpload
              value={hero?.avatar_url}
              onChange={(url) => mutation.mutate({ avatar_url: url })}
              bucket="avatars"
              aspectRatio="1/1"
              className="max-w-[200px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Background Image</label>
            <ImageUpload
              value={hero?.background_image_url}
              onChange={(url) => mutation.mutate({ background_image_url: url })}
              bucket="uploads"
            />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-6">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Details</h2>

          <Input
            label="Location"
            name="location"
            defaultValue={hero?.location}
            placeholder="e.g. San Francisco, CA"
          />

          <Input
            label="Availability"
            name="availability"
            defaultValue={hero?.availability}
            placeholder="e.g. Available for work"
          />

          <Input
            label="Resume Button Text"
            name="resume_button_text"
            defaultValue={hero?.resume_button_text}
          />

          <Input
            label="Resume Button URL"
            name="resume_button_url"
            defaultValue={hero?.resume_button_url}
            placeholder="/cv"
          />

          <Toggle
            label="Published"
            checked={hero?.is_published ?? true}
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
