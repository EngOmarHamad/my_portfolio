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
import { Input, Toggle } from '@/admin/components/ui/FormField'
import { toast } from 'sonner'
import { Plus, Pencil, GripVertical } from 'lucide-react'
import type { Skill } from '@/admin/types'

const skillsService = createBaseService<Skill>('skills')

export function SkillsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Skill | null>(null)
  const [showForm, setShowForm] = useState(false)
  const queryClient = useQueryClient()
  const pageSize = 10

  const { data, isLoading } = useQuery({
    queryKey: ['skills', page, search],
    queryFn: () => skillsService.list({ page, pageSize, search }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => skillsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] })
      toast.success('Skill deleted')
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to delete'),
  })

  const saveMutation = useMutation({
    mutationFn: (values: Partial<Skill>) =>
      editing
        ? skillsService.update(editing.id, values)
        : skillsService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] })
      toast.success(editing ? 'Skill updated' : 'Skill created')
      setShowForm(false)
      setEditing(null)
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to save'),
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_published }: { id: string; is_published: boolean }) =>
      skillsService.toggleStatus(id, 'is_published', is_published),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] })
    },
  })

  if (isLoading) return <PageSkeleton />

  const columns = [
    {
      key: 'title',
      header: 'Skill',
      render: (skill: Skill) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-hover)] flex items-center justify-center text-sm">
            {skill.icon || skill.title.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-[var(--color-text)]">{skill.title}</p>
            <p className="text-xs text-[var(--color-text-tertiary)]">{skill.percentage}%</p>
          </div>
        </div>
      ),
    },
    {
      key: 'is_published',
      header: 'Status',
      render: (skill: Skill) => (
        <button onClick={() => toggleMutation.mutate({ id: skill.id, is_published: !skill.is_published })}>
          <StatusBadge status={skill.is_published ? 'published' : 'draft'} />
        </button>
      ),
    },
    {
      key: 'is_featured',
      header: 'Featured',
      render: (skill: Skill) => (
        <span className={skill.is_featured ? 'text-amber-500' : 'text-[var(--color-text-tertiary)]'}>
          {skill.is_featured ? 'Featured' : 'Regular'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (skill: Skill) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => { setEditing(skill); setShowForm(true) }}
            className="p-1.5 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <DeleteButton onDelete={() => deleteMutation.mutateAsync(skill.id)} />
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Skills"
        description="Manage your skills and competencies"
        actions={
          <button
            onClick={() => { setEditing(null); setShowForm(true) }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Skill
          </button>
        }
      />

      <div className="mb-4 max-w-sm">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search skills..." />
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        keyExtractor={(s) => s.id}
      />

      {data && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={data.count}
          onPageChange={setPage}
        />
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowForm(false); setEditing(null) }} />
          <div className="relative bg-[var(--color-surface)] rounded-2xl shadow-dialog border border-[var(--color-border)] p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-6">
              {editing ? 'Edit Skill' : 'Add Skill'}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = new FormData(e.currentTarget)
                saveMutation.mutate({
                  title: form.get('title') as string,
                  icon: form.get('icon') as string,
                  color: form.get('color') as string,
                  percentage: Number(form.get('percentage')),
                  is_featured: form.get('is_featured') === 'on',
                  is_published: true,
                })
              }}
              className="space-y-4"
            >
              <Input label="Skill Name" name="title" defaultValue={editing?.title} required />
              <Input label="Icon (emoji or icon name)" name="icon" defaultValue={editing?.icon} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Color" name="color" type="color" defaultValue={editing?.color || '#256F6C'} />
                <Input label="Percentage" name="percentage" type="number" min="0" max="100" defaultValue={editing?.percentage?.toString() || '0'} />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="is_featured" defaultChecked={editing?.is_featured} className="rounded" />
                <span className="text-sm text-[var(--color-text)]">Featured skill</span>
              </label>
              <div className="flex justify-end gap-2 pt-4">
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
