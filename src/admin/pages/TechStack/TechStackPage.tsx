import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createBaseService } from '@/admin/services/supabase-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { DataTable } from '@/admin/components/ui/DataTable'
import { Pagination } from '@/admin/components/ui/Pagination'
import { StatusBadge } from '@/admin/components/ui/StatusBadge'
import { DeleteButton } from '@/admin/components/ui/DeleteButton'
import { Input, Select } from '@/admin/components/ui/FormField'
import { toast } from 'sonner'
import { Plus, Pencil, Cpu } from 'lucide-react'
import type { TechStackItem } from '@/admin/types'

const techService = createBaseService<TechStackItem>('tech_stack')

export function TechStackPage() {
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<TechStackItem | null>(null)
  const [showForm, setShowForm] = useState(false)
  const queryClient = useQueryClient()
  const pageSize = 10

  const { data, isLoading } = useQuery({ queryKey: ['tech-stack', page], queryFn: () => techService.list({ page, pageSize }) })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => techService.remove(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tech-stack'] }); toast.success('Item deleted') },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to delete'),
  })

  const saveMutation = useMutation({
    mutationFn: (values: Partial<TechStackItem>) => editing ? techService.update(editing.id, values) : techService.create(values),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tech-stack'] }); toast.success(editing ? 'Item updated' : 'Item created'); setShowForm(false); setEditing(null) },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to save'),
  })

  if (isLoading) return <PageSkeleton />

  const columns = [
    { key: 'name', header: 'Technology', render: (t: TechStackItem) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-hover)] flex items-center justify-center"><Cpu className="w-4 h-4" /></div>
        <div><p className="font-medium text-[var(--color-text)]">{t.name}</p><p className="text-xs text-[var(--color-text-tertiary)]">{t.category} - {t.proficiency}%</p></div>
      </div>
    )},
    { key: 'is_published', header: 'Status', render: (t: TechStackItem) => <StatusBadge status={t.is_published ? 'published' : 'draft'} /> },
    { key: 'actions', header: '', render: (t: TechStackItem) => (
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => { setEditing(t); setShowForm(true) }} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-hover)]"><Pencil className="w-4 h-4" /></button>
        <DeleteButton onDelete={() => deleteMutation.mutateAsync(t.id)} />
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Tech Stack" description="Manage technologies you work with" actions={
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-[var(--color-primary)] text-white"><Plus className="w-4 h-4" />Add Technology</button>
      } />
      <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(t) => t.id} />
      {data && <Pagination page={page} pageSize={pageSize} total={data.count} onPageChange={setPage} />}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowForm(false); setEditing(null) }} />
          <div className="relative bg-[var(--color-surface)] rounded-2xl shadow-dialog border border-[var(--color-border)] p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-semibold mb-6">{editing ? 'Edit Technology' : 'Add Technology'}</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const form = new FormData(e.currentTarget)
              saveMutation.mutate({
                name: form.get('name') as string,
                icon: form.get('icon') as string,
                category: form.get('category') as string,
                proficiency: Number(form.get('proficiency')) || 0,
                is_published: true,
              })
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Name" name="name" defaultValue={editing?.name} required />
                <Input label="Icon (emoji)" name="icon" defaultValue={editing?.icon} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Category" name="category" defaultValue={editing?.category} placeholder="frontend, backend, etc." />
                <Input label="Proficiency %" name="proficiency" type="number" min="0" max="100" defaultValue={editing?.proficiency?.toString() || '0'} />
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
