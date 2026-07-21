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
import { Plus, Pencil, Share2 } from 'lucide-react'
import type { SocialLink } from '@/admin/types'

const socialService = createBaseService<SocialLink>('social_links')

const platformOptions = [
  { value: 'github', label: 'GitHub' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'behance', label: 'Behance' },
  { value: 'dribbble', label: 'Dribbble' },
  { value: 'medium', label: 'Medium' },
  { value: 'other', label: 'Other' },
]

const platformIcons: Record<string, string> = {
  github: 'github', linkedin: 'linkedin', twitter: 'twitter-x',
  facebook: 'facebook', instagram: 'instagram', youtube: 'youtube',
  behance: 'behance', dribbble: 'dribbble', medium: 'medium',
}

export function SocialLinksPage() {
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<SocialLink | null>(null)
  const [showForm, setShowForm] = useState(false)
  const queryClient = useQueryClient()
  const pageSize = 10

  const { data, isLoading } = useQuery({ queryKey: ['social-links', page], queryFn: () => socialService.list({ page, pageSize }) })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => socialService.remove(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['social-links'] }); toast.success('Social link deleted') },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to delete'),
  })

  const saveMutation = useMutation({
    mutationFn: (values: Partial<SocialLink>) => editing ? socialService.update(editing.id, values) : socialService.create(values),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['social-links'] }); toast.success(editing ? 'Link updated' : 'Link created'); setShowForm(false); setEditing(null) },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to save'),
  })

  if (isLoading) return <PageSkeleton />

  const columns = [
    { key: 'platform', header: 'Platform', render: (s: SocialLink) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-hover)] flex items-center justify-center"><Share2 className="w-4 h-4" /></div>
        <div><p className="font-medium text-[var(--color-text)] capitalize">{s.platform}</p><p className="text-xs text-[var(--color-text-tertiary)]">{s.url}</p></div>
      </div>
    )},
    { key: 'is_active', header: 'Status', render: (s: SocialLink) => <StatusBadge status={s.is_active ? 'active' : 'inactive'} /> },
    { key: 'actions', header: '', render: (s: SocialLink) => (
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => { setEditing(s); setShowForm(true) }} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-hover)]"><Pencil className="w-4 h-4" /></button>
        <DeleteButton onDelete={() => deleteMutation.mutateAsync(s.id)} />
      </div>
    )},
  ]

  return (
    <div>
      <PageHeader title="Social Links" description="Manage your social media links" actions={
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-[var(--color-primary)] text-white"><Plus className="w-4 h-4" />Add Link</button>
      } />
      <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(s) => s.id} />
      {data && <Pagination page={page} pageSize={pageSize} total={data.count} onPageChange={setPage} />}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowForm(false); setEditing(null) }} />
          <div className="relative bg-[var(--color-surface)] rounded-2xl shadow-dialog border border-[var(--color-border)] p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-semibold mb-6">{editing ? 'Edit Social Link' : 'Add Social Link'}</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const form = new FormData(e.currentTarget)
              saveMutation.mutate({
                platform: form.get('platform') as string,
                label: form.get('label') as string,
                url: form.get('url') as string,
                is_active: form.get('is_active') === 'on',
              })
            }} className="space-y-4">
              <Select label="Platform" name="platform" options={platformOptions} defaultValue={editing?.platform} required placeholder="Select platform" />
              <Input label="Label (optional)" name="label" defaultValue={editing?.label} placeholder="e.g. My GitHub" />
              <Input label="URL" name="url" defaultValue={editing?.url} required placeholder="https://" />
              <label className="flex items-center gap-2"><input type="checkbox" name="is_active" defaultChecked={editing?.is_active ?? true} className="rounded" /><span className="text-sm">Active</span></label>
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
