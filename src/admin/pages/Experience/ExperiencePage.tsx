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
import { Plus, Pencil, Building2 } from 'lucide-react'
import type { Experience } from '@/admin/types'

const experienceService = createBaseService<Experience>('experience')

export function ExperiencePage() {
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Experience | null>(null)
  const [showForm, setShowForm] = useState(false)
  const queryClient = useQueryClient()
  const pageSize = 10

  const { data, isLoading } = useQuery({
    queryKey: ['experience', page],
    queryFn: () => experienceService.list({ page, pageSize, sortBy: 'start_date', sortOrder: 'desc' }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => experienceService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] })
      toast.success('Experience deleted')
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to delete'),
  })

  const saveMutation = useMutation({
    mutationFn: (values: Partial<Experience>) =>
      editing ? experienceService.update(editing.id, values) : experienceService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] })
      toast.success(editing ? 'Experience updated' : 'Experience created')
      setShowForm(false); setEditing(null)
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to save'),
  })

  if (isLoading) return <PageSkeleton />

  const columns = [
    {
      key: 'company',
      header: 'Company',
      render: (exp: Experience) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-hover)] flex items-center justify-center">
            {exp.logo_url ? <img src={exp.logo_url} alt="" className="w-6 h-6 rounded" /> : <Building2 className="w-4 h-4 text-[var(--color-text-tertiary)]" />}
          </div>
          <div>
            <p className="font-medium text-[var(--color-text)]">{exp.company}</p>
            <p className="text-xs text-[var(--color-text-tertiary)]">{exp.position}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'period',
      header: 'Period',
      render: (exp: Experience) => (
        <span className="text-sm text-[var(--color-text-secondary)]">
          {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
        </span>
      ),
    },
    {
      key: 'is_current',
      header: 'Current',
      render: (exp: Experience) => exp.is_current ? <StatusBadge status="active" /> : null,
    },
    {
      key: 'actions',
      header: '',
      render: (exp: Experience) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => { setEditing(exp); setShowForm(true) }} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]"><Pencil className="w-4 h-4" /></button>
          <DeleteButton onDelete={() => deleteMutation.mutateAsync(exp.id)} />
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="Experience" description="Manage your work experience" actions={
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)] transition-colors"><Plus className="w-4 h-4" />Add Experience</button>
      } />

      <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(e) => e.id} />
      {data && <Pagination page={page} pageSize={pageSize} total={data.count} onPageChange={setPage} />}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowForm(false); setEditing(null) }} />
          <div className="relative bg-[var(--color-surface)] rounded-2xl shadow-dialog border border-[var(--color-border)] p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-6">{editing ? 'Edit Experience' : 'Add Experience'}</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const form = new FormData(e.currentTarget)
              saveMutation.mutate({
                company: form.get('company') as string,
                position: form.get('position') as string,
                description: form.get('description') as string,
                start_date: form.get('start_date') as string,
                end_date: form.get('end_date') as string || null,
                is_current: form.get('is_current') === 'on',
              })
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Company" name="company" defaultValue={editing?.company} required />
                <Input label="Position" name="position" defaultValue={editing?.position} required />
              </div>
              <Textarea label="Description" name="description" defaultValue={editing?.description} rows={4} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Start Date" name="start_date" type="date" defaultValue={editing?.start_date} required />
                <Input label="End Date" name="end_date" type="date" defaultValue={editing?.end_date || ''} />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="is_current" defaultChecked={editing?.is_current} className="rounded" />
                <span className="text-sm text-[var(--color-text)]">Current job</span>
              </label>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]">Cancel</button>
                <button type="submit" disabled={saveMutation.isPending} className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)] disabled:opacity-50">{saveMutation.isPending ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
