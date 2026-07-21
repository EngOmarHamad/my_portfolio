import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createBaseService } from '@/admin/services/supabase-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { DataTable } from '@/admin/components/ui/DataTable'
import { Pagination } from '@/admin/components/ui/Pagination'
import { DeleteButton } from '@/admin/components/ui/DeleteButton'
import { Input, Textarea } from '@/admin/components/ui/FormField'
import { toast } from 'sonner'
import { Plus, Pencil, GraduationCap } from 'lucide-react'
import type { Education } from '@/admin/types'

const educationService = createBaseService<Education>('education')

export function EducationPage() {
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Education | null>(null)
  const [showForm, setShowForm] = useState(false)
  const queryClient = useQueryClient()
  const pageSize = 10

  const { data, isLoading } = useQuery({
    queryKey: ['education', page],
    queryFn: () => educationService.list({ page, pageSize, sortBy: 'start_date', sortOrder: 'desc' }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => educationService.remove(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['education'] }); toast.success('Education deleted') },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to delete'),
  })

  const saveMutation = useMutation({
    mutationFn: (values: Partial<Education>) =>
      editing ? educationService.update(editing.id, values) : educationService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] })
      toast.success(editing ? 'Education updated' : 'Education created')
      setShowForm(false); setEditing(null)
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to save'),
  })

  if (isLoading) return <PageSkeleton />

  const columns = [
    {
      key: 'university',
      header: 'Institution',
      render: (edu: Education) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-hover)] flex items-center justify-center"><GraduationCap className="w-4 h-4 text-[var(--color-text-tertiary)]" /></div>
          <div>
            <p className="font-medium text-[var(--color-text)]">{edu.university}</p>
            <p className="text-xs text-[var(--color-text-tertiary)]">{edu.degree} - {edu.department}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'period',
      header: 'Period',
      render: (edu: Education) => <span className="text-sm text-[var(--color-text-secondary)]">{edu.start_date} - {edu.end_date || 'Present'}</span>,
    },
    {
      key: 'gpa',
      header: 'GPA',
      render: (edu: Education) => edu.gpa ? <span className="text-sm font-medium">{edu.gpa}</span> : <span className="text-sm text-[var(--color-text-tertiary)]">-</span>,
    },
    {
      key: 'actions',
      header: '',
      render: (edu: Education) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => { setEditing(edu); setShowForm(true) }} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]"><Pencil className="w-4 h-4" /></button>
          <DeleteButton onDelete={() => deleteMutation.mutateAsync(edu.id)} />
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="Education" description="Manage your education history" actions={
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)] transition-colors"><Plus className="w-4 h-4" />Add Education</button>
      } />
      <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(e) => e.id} />
      {data && <Pagination page={page} pageSize={pageSize} total={data.count} onPageChange={setPage} />}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowForm(false); setEditing(null) }} />
          <div className="relative bg-[var(--color-surface)] rounded-2xl shadow-dialog border border-[var(--color-border)] p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-6">{editing ? 'Edit Education' : 'Add Education'}</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const form = new FormData(e.currentTarget)
              saveMutation.mutate({
                university: form.get('university') as string,
                degree: form.get('degree') as string,
                department: form.get('department') as string,
                description: form.get('description') as string,
                gpa: form.get('gpa') ? Number(form.get('gpa')) : null,
                start_date: form.get('start_date') as string,
                end_date: form.get('end_date') as string || null,
              })
            }} className="space-y-4">
              <Input label="University" name="university" defaultValue={editing?.university} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Degree" name="degree" defaultValue={editing?.degree} required />
                <Input label="Department" name="department" defaultValue={editing?.department} />
              </div>
              <Textarea label="Description" name="description" defaultValue={editing?.description} rows={3} />
              <div className="grid grid-cols-3 gap-4">
                <Input label="GPA" name="gpa" type="number" step="0.01" defaultValue={editing?.gpa?.toString() || ''} />
                <Input label="Start Date" name="start_date" type="date" defaultValue={editing?.start_date} required />
                <Input label="End Date" name="end_date" type="date" defaultValue={editing?.end_date || ''} />
              </div>
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
