import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createBaseService } from '@/admin/services/supabase-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { DataTable } from '@/admin/components/ui/DataTable'
import { Pagination } from '@/admin/components/ui/Pagination'
import { StatusBadge } from '@/admin/components/ui/StatusBadge'
import { DeleteButton } from '@/admin/components/ui/DeleteButton'
import { Input, Textarea, Select } from '@/admin/components/ui/FormField'
import { toast } from 'sonner'
import { Plus, Pencil } from 'lucide-react'
import type { TimelineItem } from '@/admin/types'

const timelineService = createBaseService<TimelineItem>('timeline_items')

export function TimelinePage() {
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<TimelineItem | null>(null)
  const [showForm, setShowForm] = useState(false)
  const queryClient = useQueryClient()
  const pageSize = 10

  const { data, isLoading } = useQuery({ queryKey: ['timeline', page], queryFn: () => timelineService.list({ page, pageSize }) })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => timelineService.remove(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['timeline'] }); toast.success('Item deleted') },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to delete'),
  })

  const saveMutation = useMutation({
    mutationFn: (values: Partial<TimelineItem>) => editing ? timelineService.update(editing.id, values) : timelineService.create(values),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['timeline'] }); toast.success(editing ? 'Item updated' : 'Item created'); setShowForm(false); setEditing(null) },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to save'),
  })

  if (isLoading) return <PageSkeleton />

  const typeOptions = [
    { value: 'education', label: 'Education' },
    { value: 'experience', label: 'Experience' },
    { value: 'certification', label: 'Certification' },
    { value: 'achievement', label: 'Achievement' },
  ]

  const columns = [
    { key: 'title', header: 'Event', render: (t: TimelineItem) => (
      <div><p className="font-medium text-[var(--color-text)]">{t.title}</p><p className="text-xs text-[var(--color-text-tertiary)]">{t.subtitle}</p></div>
    )},
    { key: 'year', header: 'Year', render: (t: TimelineItem) => <span className="text-sm font-medium">{t.year}</span> },
    { key: 'type', header: 'Type', render: (t: TimelineItem) => <StatusBadge status={t.type} /> },
    { key: 'is_published', header: 'Status', render: (t: TimelineItem) => <StatusBadge status={t.is_published ? 'published' : 'draft'} /> },
    { key: 'actions', header: '', render: (t: TimelineItem) => (
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => { setEditing(t); setShowForm(true) }} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-hover)]"><Pencil className="w-4 h-4" /></button>
        <DeleteButton onDelete={() => deleteMutation.mutateAsync(t.id)} />
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Timeline" description="Manage your timeline events" actions={
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-[var(--color-primary)] text-white"><Plus className="w-4 h-4" />Add Event</button>
      } />
      <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(t) => t.id} />
      {data && <Pagination page={page} pageSize={pageSize} total={data.count} onPageChange={setPage} />}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowForm(false); setEditing(null) }} />
          <div className="relative bg-[var(--color-surface)] rounded-2xl shadow-dialog border border-[var(--color-border)] p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-semibold mb-6">{editing ? 'Edit Event' : 'Add Event'}</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const form = new FormData(e.currentTarget)
              saveMutation.mutate({
                year: form.get('year') as string,
                title: form.get('title') as string,
                subtitle: form.get('subtitle') as string,
                description: form.get('description') as string,
                type: form.get('type') as TimelineItem['type'],
                is_published: true,
              })
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Year" name="year" defaultValue={editing?.year} required placeholder="2024" />
                <Input label="Title" name="title" defaultValue={editing?.title} required />
              </div>
              <Input label="Subtitle" name="subtitle" defaultValue={editing?.subtitle} />
              <Textarea label="Description" name="description" defaultValue={editing?.description} rows={3} />
              <Select label="Type" name="type" options={typeOptions} defaultValue={editing?.type} required />
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--color-border)]">Cancel</button>
                <button type="submit" disabled={saveMutation.isPending} className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white disabled:opacity-50">{saveMutation.isPending ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
