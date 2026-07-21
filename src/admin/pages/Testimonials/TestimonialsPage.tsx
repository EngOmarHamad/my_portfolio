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
import { ImageUpload } from '@/admin/components/ui/ImageUpload'
import { toast } from 'sonner'
import { Plus, Pencil, Star } from 'lucide-react'
import type { Testimonial } from '@/admin/types'

const testimonialService = createBaseService<Testimonial>('testimonials')

export function TestimonialsPage() {
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [showForm, setShowForm] = useState(false)
  const queryClient = useQueryClient()
  const pageSize = 10

  const { data, isLoading } = useQuery({ queryKey: ['testimonials', page], queryFn: () => testimonialService.list({ page, pageSize }) })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => testimonialService.remove(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['testimonials'] }); toast.success('Testimonial deleted') },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to delete'),
  })

  const saveMutation = useMutation({
    mutationFn: (values: Partial<Testimonial>) => editing ? testimonialService.update(editing.id, values) : testimonialService.create(values),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['testimonials'] }); toast.success(editing ? 'Testimonial updated' : 'Testimonial created'); setShowForm(false); setEditing(null) },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to save'),
  })

  if (isLoading) return <PageSkeleton />

  const columns = [
    { key: 'client', header: 'Client', render: (t: Testimonial) => (
      <div className="flex items-center gap-3">
        {t.image_url ? <img src={t.image_url} alt="" className="w-8 h-8 rounded-full object-cover" /> : <div className="w-8 h-8 rounded-full bg-[var(--color-surface-hover)] flex items-center justify-center text-xs">{t.client_name.charAt(0)}</div>}
        <div><p className="font-medium text-[var(--color-text)]">{t.client_name}</p><p className="text-xs text-[var(--color-text-tertiary)]">{t.company}</p></div>
      </div>
    )},
    { key: 'rating', header: 'Rating', render: (t: Testimonial) => <div className="flex items-center gap-0.5">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />)}</div> },
    { key: 'is_published', header: 'Status', render: (t: Testimonial) => <StatusBadge status={t.is_published ? 'published' : 'draft'} /> },
    { key: 'actions', header: '', render: (t: Testimonial) => (
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => { setEditing(t); setShowForm(true) }} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-hover)]"><Pencil className="w-4 h-4" /></button>
        <DeleteButton onDelete={() => deleteMutation.mutateAsync(t.id)} />
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Testimonials" description="Manage client testimonials" actions={
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-[var(--color-primary)] text-white"><Plus className="w-4 h-4" />Add Testimonial</button>
      } />
      <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(t) => t.id} />
      {data && <Pagination page={page} pageSize={pageSize} total={data.count} onPageChange={setPage} />}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowForm(false); setEditing(null) }} />
          <div className="relative bg-[var(--color-surface)] rounded-2xl shadow-dialog border border-[var(--color-border)] p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-semibold mb-6">{editing ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const form = new FormData(e.currentTarget)
              saveMutation.mutate({
                client_name: form.get('client_name') as string,
                company: form.get('company') as string,
                review: form.get('review') as string,
                rating: Number(form.get('rating')) || 5,
                is_published: true,
              })
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Client Name" name="client_name" defaultValue={editing?.client_name} required />
                <Input label="Company" name="company" defaultValue={editing?.company} />
              </div>
              <Textarea label="Review" name="review" defaultValue={editing?.review} rows={4} required />
              <Input label="Rating (1-5)" name="rating" type="number" min="1" max="5" defaultValue={editing?.rating?.toString() || '5'} />
              <div className="space-y-2">
                <label className="text-sm font-medium">Client Photo</label>
                <ImageUpload value={editing?.image_url} onChange={(url) => saveMutation.mutate({ image_url: url })} bucket="avatars" aspectRatio="1/1" className="max-w-[120px]" />
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
