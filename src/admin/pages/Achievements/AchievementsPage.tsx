import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createBaseService } from '@/admin/services/supabase-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { DataTable } from '@/admin/components/ui/DataTable'
import { Pagination } from '@/admin/components/ui/Pagination'
import { StatusBadge } from '@/admin/components/ui/StatusBadge'
import { DeleteButton } from '@/admin/components/ui/DeleteButton'
import { Input, Textarea } from '@/admin/components/ui/FormField'
import { toast } from 'sonner'
import { Plus, Pencil, Trophy } from 'lucide-react'
import type { Achievement } from '@/admin/types'

const achievementService = createBaseService<Achievement>('achievements')

export function AchievementsPage() {
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Achievement | null>(null)
  const [showForm, setShowForm] = useState(false)
  const queryClient = useQueryClient()
  const pageSize = 10

  const { data, isLoading } = useQuery({ queryKey: ['achievements', page], queryFn: () => achievementService.list({ page, pageSize }) })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => achievementService.remove(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['achievements'] }); toast.success('Achievement deleted') },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to delete'),
  })

  const saveMutation = useMutation({
    mutationFn: (values: Partial<Achievement>) => editing ? achievementService.update(editing.id, values) : achievementService.create(values),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['achievements'] }); toast.success(editing ? 'Achievement updated' : 'Achievement created'); setShowForm(false); setEditing(null) },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to save'),
  })

  if (isLoading) return <PageSkeleton />

  const columns = [
    { key: 'title', header: 'Achievement', render: (a: Achievement) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center"><Trophy className="w-4 h-4 text-amber-500" /></div>
        <div><p className="font-medium text-[var(--color-text)]">{a.title}</p><p className="text-xs text-[var(--color-text-tertiary)]">{a.description?.slice(0, 60)}</p></div>
      </div>
    )},
    { key: 'is_published', header: 'Status', render: (a: Achievement) => <StatusBadge status={a.is_published ? 'published' : 'draft'} /> },
    { key: 'actions', header: '', render: (a: Achievement) => (
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => { setEditing(a); setShowForm(true) }} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-hover)]"><Pencil className="w-4 h-4" /></button>
        <DeleteButton onDelete={() => deleteMutation.mutateAsync(a.id)} />
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Achievements" description="Manage your achievements" actions={
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-[var(--color-primary)] text-white"><Plus className="w-4 h-4" />Add Achievement</button>
      } />
      <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(a) => a.id} />
      {data && <Pagination page={page} pageSize={pageSize} total={data.count} onPageChange={setPage} />}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowForm(false); setEditing(null) }} />
          <div className="relative bg-[var(--color-surface)] rounded-2xl shadow-dialog border border-[var(--color-border)] p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-semibold mb-6">{editing ? 'Edit Achievement' : 'Add Achievement'}</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const form = new FormData(e.currentTarget)
              saveMutation.mutate({
                title: form.get('title') as string,
                description: form.get('description') as string,
                icon: form.get('icon') as string,
                date: form.get('date') as string || null,
                is_published: true,
              })
            }} className="space-y-4">
              <Input label="Title" name="title" defaultValue={editing?.title} required />
              <Textarea label="Description" name="description" defaultValue={editing?.description} rows={3} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Icon (emoji)" name="icon" defaultValue={editing?.icon} />
                <Input label="Date" name="date" type="date" defaultValue={editing?.date || ''} />
              </div>
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
