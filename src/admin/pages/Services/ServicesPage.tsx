import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createBaseService } from '@/admin/services/supabase-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { DataTable } from '@/admin/components/ui/DataTable'
import { Pagination } from '@/admin/components/ui/Pagination'
import { StatusBadge } from '@/admin/components/ui/StatusBadge'
import { DeleteButton } from '@/admin/components/ui/DeleteButton'
import { Input, Textarea, Toggle } from '@/admin/components/ui/FormField'
import { toast } from 'sonner'
import { Plus, Pencil } from 'lucide-react'
import type { Service } from '@/admin/types'

const serviceApi = createBaseService<Service>('services')

export function ServicesPage() {
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Service | null>(null)
  const [showForm, setShowForm] = useState(false)
  const queryClient = useQueryClient()
  const pageSize = 10

  const { data, isLoading } = useQuery({ queryKey: ['services', page], queryFn: () => serviceApi.list({ page, pageSize }) })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => serviceApi.remove(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['services'] }); toast.success('Service deleted') },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to delete'),
  })

  const saveMutation = useMutation({
    mutationFn: (values: Partial<Service>) => editing ? serviceApi.update(editing.id, values) : serviceApi.create(values),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['services'] }); toast.success(editing ? 'Service updated' : 'Service created'); setShowForm(false); setEditing(null) },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to save'),
  })

  if (isLoading) return <PageSkeleton />

  const columns = [
    { key: 'title', header: 'Service', render: (s: Service) => <div><p className="font-medium text-[var(--color-text)]">{s.icon} {s.title}</p><p className="text-xs text-[var(--color-text-tertiary)]">{s.description?.slice(0, 80)}</p></div> },
    { key: 'price', header: 'Price', render: (s: Service) => s.price ? <span className="font-medium">${s.price}</span> : <span className="text-[var(--color-text-tertiary)]">-</span> },
    { key: 'is_featured', header: 'Featured', render: (s: Service) => s.is_featured ? <StatusBadge status="active" /> : null },
    { key: 'is_published', header: 'Status', render: (s: Service) => <StatusBadge status={s.is_published ? 'published' : 'draft'} /> },
    { key: 'actions', header: '', render: (s: Service) => (
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => { setEditing(s); setShowForm(true) }} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-hover)]"><Pencil className="w-4 h-4" /></button>
        <DeleteButton onDelete={() => deleteMutation.mutateAsync(s.id)} />
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Services" description="Manage your services" actions={
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)]"><Plus className="w-4 h-4" />Add Service</button>
      } />
      <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(s) => s.id} />
      {data && <Pagination page={page} pageSize={pageSize} total={data.count} onPageChange={setPage} />}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowForm(false); setEditing(null) }} />
          <div className="relative bg-[var(--color-surface)] rounded-2xl shadow-dialog border border-[var(--color-border)] p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-semibold mb-6">{editing ? 'Edit Service' : 'Add Service'}</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const form = new FormData(e.currentTarget)
              saveMutation.mutate({
                title: form.get('title') as string,
                icon: form.get('icon') as string,
                description: form.get('description') as string,
                price: form.get('price') ? Number(form.get('price')) : null,
                is_featured: form.get('is_featured') === 'on',
                is_published: true,
              })
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Title" name="title" defaultValue={editing?.title} required />
                <Input label="Icon (emoji)" name="icon" defaultValue={editing?.icon} />
              </div>
              <Textarea label="Description" name="description" defaultValue={editing?.description} rows={4} />
              <Input label="Price (optional)" name="price" type="number" step="0.01" defaultValue={editing?.price?.toString() || ''} />
              <label className="flex items-center gap-2"><input type="checkbox" name="is_featured" defaultChecked={editing?.is_featured} className="rounded" /><span className="text-sm">Featured</span></label>
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
