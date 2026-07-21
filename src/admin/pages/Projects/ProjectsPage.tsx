import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createBaseService } from '@/admin/services/supabase-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { DataTable } from '@/admin/components/ui/DataTable'
import { Pagination } from '@/admin/components/ui/Pagination'
import { SearchInput } from '@/admin/components/ui/SearchInput'
import { StatusBadge } from '@/admin/components/ui/StatusBadge'
import { DeleteButton } from '@/admin/components/ui/DeleteButton'
import { ImageUpload } from '@/admin/components/ui/ImageUpload'
import { Input, Textarea, Select, Toggle } from '@/admin/components/ui/FormField'
import { toast } from 'sonner'
import { Plus, Pencil, ExternalLink } from 'lucide-react'
import type { Project } from '@/admin/types'

const projectsService = createBaseService<Project>('projects')

export function ProjectsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Project | null>(null)
  const [showForm, setShowForm] = useState(false)
  const queryClient = useQueryClient()
  const pageSize = 10

  const { data, isLoading } = useQuery({
    queryKey: ['projects', page, search],
    queryFn: () => projectsService.list({ page, pageSize, search }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project deleted')
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to delete'),
  })

  const saveMutation = useMutation({
    mutationFn: (values: Partial<Project>) =>
      editing
        ? projectsService.update(editing.id, values)
        : projectsService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success(editing ? 'Project updated' : 'Project created')
      setShowForm(false)
      setEditing(null)
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to save'),
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_featured }: { id: string; is_featured: boolean }) =>
      projectsService.toggleStatus(id, 'is_featured', is_featured),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })

  if (isLoading) return <PageSkeleton />

  const columns = [
    {
      key: 'title',
      header: 'Project',
      render: (project: Project) => (
        <div className="flex items-center gap-3">
          {project.thumbnail_url ? (
            <img src={project.thumbnail_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-hover)] flex items-center justify-center text-xs text-[var(--color-text-tertiary)]">No img</div>
          )}
          <div>
            <p className="font-medium text-[var(--color-text)]">{project.title}</p>
            <p className="text-xs text-[var(--color-text-tertiary)]">{project.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (project: Project) => <StatusBadge status={project.status} />,
    },
    {
      key: 'is_featured',
      header: 'Featured',
      render: (project: Project) => (
        <button
          onClick={() => toggleMutation.mutate({ id: project.id, is_featured: !project.is_featured })}
          className={`text-sm ${project.is_featured ? 'text-amber-500' : 'text-[var(--color-text-tertiary)]'}`}
        >
          {project.is_featured ? 'Yes' : 'No'}
        </button>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (project: Project) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] transition-colors">
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={() => { setEditing(project); setShowForm(true) }}
            className="p-1.5 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <DeleteButton onDelete={() => deleteMutation.mutateAsync(project.id)} />
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Manage your portfolio projects"
        actions={
          <button
            onClick={() => { setEditing(null); setShowForm(true) }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        }
      />

      <div className="mb-4 max-w-sm">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search projects..." />
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        keyExtractor={(p) => p.id}
      />

      {data && (
        <Pagination page={page} pageSize={pageSize} total={data.count} onPageChange={setPage} />
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-10">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowForm(false); setEditing(null) }} />
          <div className="relative bg-[var(--color-surface)] rounded-2xl shadow-dialog border border-[var(--color-border)] p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-6">
              {editing ? 'Edit Project' : 'Add Project'}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = new FormData(e.currentTarget)
                saveMutation.mutate({
                  title: form.get('title') as string,
                  slug: form.get('slug') as string,
                  description: form.get('description') as string,
                  long_description: form.get('long_description') as string,
                  category: form.get('category') as string,
                  github_url: form.get('github_url') as string,
                  live_demo_url: form.get('live_demo_url') as string,
                  tech_stack: (form.get('tech_stack') as string || '').split(',').map(s => s.trim()).filter(Boolean),
                  tags: (form.get('tags') as string || '').split(',').map(s => s.trim()).filter(Boolean),
                  status: (form.get('status') as 'draft' | 'published') || 'draft',
                  is_featured: form.get('is_featured') === 'on',
                })
              }}
              className="space-y-6 max-h-[70vh] overflow-y-auto px-1"
            >
              <div className="grid grid-cols-2 gap-4">
                <Input label="Title" name="title" defaultValue={editing?.title} required />
                <Input label="Slug" name="slug" defaultValue={editing?.slug} required placeholder="my-project" />
              </div>

              <Textarea label="Description" name="description" defaultValue={editing?.description} rows={3} />
              <Textarea label="Long Description" name="long_description" defaultValue={editing?.long_description} rows={5} />

              <div className="grid grid-cols-2 gap-4">
                <Input label="Category" name="category" defaultValue={editing?.category} placeholder="web, mobile, etc." />
                <Select label="Status" name="status" defaultValue={editing?.status || 'draft'}
                  options={[
                    { value: 'draft', label: 'Draft' },
                    { value: 'published', label: 'Published' },
                    { value: 'archived', label: 'Archived' },
                  ]}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="GitHub URL" name="github_url" defaultValue={editing?.github_url} />
                <Input label="Live Demo URL" name="live_demo_url" defaultValue={editing?.live_demo_url} />
              </div>

              <Input label="Tech Stack (comma separated)" name="tech_stack" defaultValue={editing?.tech_stack?.join(', ')} />
              <Input label="Tags (comma separated)" name="tags" defaultValue={editing?.tags?.join(', ')} />

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text)]">Thumbnail</label>
                <ImageUpload
                  value={editing?.thumbnail_url}
                  onChange={(url) => setEditing(prev => prev ? { ...prev, thumbnail_url: url } : prev)}
                  bucket="projects"
                  aspectRatio="16/10"
                />
              </div>

              <label className="flex items-center gap-2">
                <input type="checkbox" name="is_featured" defaultChecked={editing?.is_featured} className="rounded" />
                <span className="text-sm text-[var(--color-text)]">Featured project</span>
              </label>

              <div className="flex justify-end gap-2 pt-4 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditing(null) }}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)] disabled:opacity-50 transition-colors"
                >
                  {saveMutation.isPending ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
