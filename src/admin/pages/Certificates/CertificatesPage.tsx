import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createBaseService } from '@/admin/services/supabase-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { DataTable } from '@/admin/components/ui/DataTable'
import { Pagination } from '@/admin/components/ui/Pagination'
import { DeleteButton } from '@/admin/components/ui/DeleteButton'
import { Input } from '@/admin/components/ui/FormField'
import { ImageUpload } from '@/admin/components/ui/ImageUpload'
import { toast } from 'sonner'
import { Plus, Pencil, ExternalLink, Award } from 'lucide-react'
import type { Certificate } from '@/admin/types'

const certService = createBaseService<Certificate>('certificates')

export function CertificatesPage() {
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Certificate | null>(null)
  const [showForm, setShowForm] = useState(false)
  const queryClient = useQueryClient()
  const pageSize = 10

  const { data, isLoading } = useQuery({ queryKey: ['certificates', page], queryFn: () => certService.list({ page, pageSize }) })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => certService.remove(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['certificates'] }); toast.success('Certificate deleted') },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to delete'),
  })

  const saveMutation = useMutation({
    mutationFn: (values: Partial<Certificate>) => editing ? certService.update(editing.id, values) : certService.create(values),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['certificates'] }); toast.success(editing ? 'Certificate updated' : 'Certificate created'); setShowForm(false); setEditing(null) },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to save'),
  })

  if (isLoading) return <PageSkeleton />

  const columns = [
    { key: 'title', header: 'Certificate', render: (c: Certificate) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-hover)] flex items-center justify-center"><Award className="w-4 h-4 text-amber-500" /></div>
        <div><p className="font-medium text-[var(--color-text)]">{c.title}</p><p className="text-xs text-[var(--color-text-tertiary)]">{c.issuer}</p></div>
      </div>
    )},
    { key: 'date', header: 'Issue Date', render: (c: Certificate) => <span className="text-sm text-[var(--color-text-secondary)]">{c.issue_date || '-'}</span> },
    { key: 'link', header: '', render: (c: Certificate) => c.credential_url ? <a href={c.credential_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-[var(--color-surface-hover)] inline-block"><ExternalLink className="w-4 h-4" /></a> : null },
    { key: 'actions', header: '', render: (c: Certificate) => (
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => { setEditing(c); setShowForm(true) }} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-hover)]"><Pencil className="w-4 h-4" /></button>
        <DeleteButton onDelete={() => deleteMutation.mutateAsync(c.id)} />
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Certificates" description="Manage your certificates" actions={
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)]"><Plus className="w-4 h-4" />Add Certificate</button>
      } />
      <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(c) => c.id} />
      {data && <Pagination page={page} pageSize={pageSize} total={data.count} onPageChange={setPage} />}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-10">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowForm(false); setEditing(null) }} />
          <div className="relative bg-[var(--color-surface)] rounded-2xl shadow-dialog border border-[var(--color-border)] p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-semibold mb-6">{editing ? 'Edit Certificate' : 'Add Certificate'}</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const form = new FormData(e.currentTarget)
              saveMutation.mutate({
                title: form.get('title') as string,
                issuer: form.get('issuer') as string,
                issue_date: form.get('issue_date') as string || null,
                credential_url: form.get('credential_url') as string,
              })
            }} className="space-y-4">
              <Input label="Title" name="title" defaultValue={editing?.title} required />
              <Input label="Issuer" name="issuer" defaultValue={editing?.issuer} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Issue Date" name="issue_date" type="date" defaultValue={editing?.issue_date || ''} />
                <Input label="Credential URL" name="credential_url" defaultValue={editing?.credential_url} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Certificate Image</label>
                <ImageUpload value={editing?.certificate_image_url} onChange={(url) => saveMutation.mutate({ certificate_image_url: url })} bucket="certificates" aspectRatio="4/3" />
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
