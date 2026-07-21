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
import { Input, Textarea, Select } from '@/admin/components/ui/FormField'
import { ImageUpload } from '@/admin/components/ui/ImageUpload'
import { RichTextEditor } from '@/admin/components/ui/RichTextEditor'
import { toast } from 'sonner'
import { Plus, Pencil, FileText } from 'lucide-react'
import type { BlogPost } from '@/admin/types'

const blogService = createBaseService<BlogPost>('blog_posts')

export function BlogPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [content, setContent] = useState('')
  const queryClient = useQueryClient()
  const pageSize = 10

  const { data, isLoading } = useQuery({ queryKey: ['blog', page, search], queryFn: () => blogService.list({ page, pageSize, search }) })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => blogService.remove(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['blog'] }); toast.success('Post deleted') },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to delete'),
  })

  const saveMutation = useMutation({
    mutationFn: (values: Partial<BlogPost>) => editing ? blogService.update(editing.id, { ...values, content }) : blogService.create({ ...values, content }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['blog'] }); toast.success(editing ? 'Post updated' : 'Post created'); setShowForm(false); setEditing(null); setContent('') },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to save'),
  })

  if (isLoading) return <PageSkeleton />

  const columns = [
    { key: 'title', header: 'Post', render: (p: BlogPost) => (
      <div className="flex items-center gap-3">
        {p.cover_image_url ? <img src={p.cover_image_url} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-hover)] flex items-center justify-center"><FileText className="w-4 h-4 text-[var(--color-text-tertiary)]" /></div>}
        <div><p className="font-medium text-[var(--color-text)]">{p.title}</p><p className="text-xs text-[var(--color-text-tertiary)]">{p.reading_time} min read</p></div>
      </div>
    )},
    { key: 'status', header: 'Status', render: (p: BlogPost) => <StatusBadge status={p.status} /> },
    { key: 'date', header: 'Date', render: (p: BlogPost) => <span className="text-sm text-[var(--color-text-secondary)]">{new Date(p.created_at).toLocaleDateString()}</span> },
    { key: 'actions', header: '', render: (p: BlogPost) => (
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => { setEditing(p); setContent(p.content); setShowForm(true) }} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-hover)]"><Pencil className="w-4 h-4" /></button>
        <DeleteButton onDelete={() => deleteMutation.mutateAsync(p.id)} />
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Blog" description="Manage blog posts" actions={
        <button onClick={() => { setEditing(null); setContent(''); setShowForm(true) }} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-[var(--color-primary)] text-white"><Plus className="w-4 h-4" />New Post</button>
      } />
      <div className="mb-4 max-w-sm"><SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search posts..." /></div>
      <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(p) => p.id} />
      {data && <Pagination page={page} pageSize={pageSize} total={data.count} onPageChange={setPage} />}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-10">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowForm(false); setEditing(null) }} />
          <div className="relative bg-[var(--color-surface)] rounded-2xl shadow-dialog border border-[var(--color-border)] p-6 w-full max-w-3xl mx-4">
            <h3 className="text-lg font-semibold mb-6">{editing ? 'Edit Post' : 'New Post'}</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const form = new FormData(e.currentTarget)
              saveMutation.mutate({
                title: form.get('title') as string,
                slug: form.get('slug') as string,
                excerpt: form.get('excerpt') as string,
                tags: ((form.get('tags') as string) || '').split(',').map(s => s.trim()).filter(Boolean),
                reading_time: Number(form.get('reading_time')) || 0,
                status: (form.get('status') as 'draft' | 'published') || 'draft',
              })
            }} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Title" name="title" defaultValue={editing?.title} required />
                <Input label="Slug" name="slug" defaultValue={editing?.slug} required />
              </div>
              <Textarea label="Excerpt" name="excerpt" defaultValue={editing?.excerpt} rows={2} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Tags (comma separated)" name="tags" defaultValue={editing?.tags?.join(', ')} />
                <Input label="Reading Time (min)" name="reading_time" type="number" defaultValue={editing?.reading_time?.toString() || '5'} />
              </div>
              <Select label="Status" name="status" defaultValue={editing?.status || 'draft'} options={[{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }, { value: 'archived', label: 'Archived' }]} />
              <div className="space-y-2">
                <label className="text-sm font-medium">Cover Image</label>
                <ImageUpload value={editing?.cover_image_url} onChange={(url) => setEditing(prev => prev ? { ...prev, cover_image_url: url } : prev)} bucket="blog" aspectRatio="16/9" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content (Markdown)</label>
                <RichTextEditor value={content} onChange={setContent} />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-[var(--color-border)]">
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); setContent('') }} className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--color-border)]">Cancel</button>
                <button type="submit" disabled={saveMutation.isPending} className="px-4 py-2 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white disabled:opacity-50">{saveMutation.isPending ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
