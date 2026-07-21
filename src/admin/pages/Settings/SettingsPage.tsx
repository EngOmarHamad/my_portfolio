import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createBaseService } from '@/admin/services/supabase-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { Input, Select, Toggle } from '@/admin/components/ui/FormField'
import { Textarea } from '@/admin/components/ui/FormField'
import { toast } from 'sonner'
import type { Settings } from '@/admin/types'

const settingsService = createBaseService<Settings>('settings')

export function SettingsPage() {
  const queryClient = useQueryClient()

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await settingsService.list({ pageSize: 1 })
      return data[0]
    },
  })

  const mutation = useMutation({
    mutationFn: (values: Partial<Settings>) =>
      settings ? settingsService.update(settings.id, values) : settingsService.create(values),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['settings'] }); toast.success('Settings updated') },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to update'),
  })

  if (isLoading) return <PageSkeleton />

  return (
    <div>
      <PageHeader title="Settings" description="Manage website settings" />
      <form onSubmit={(e) => { e.preventDefault(); const form = new FormData(e.currentTarget); mutation.mutate(Object.fromEntries(form) as unknown as Partial<Settings>) }} className="max-w-2xl space-y-6">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
          <h2 className="text-lg font-semibold">General</h2>
          <Select label="Theme" name="theme" defaultValue={settings?.theme || 'system'} options={[{ value: 'system', label: 'System' }, { value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} />
          <Select label="Website Status" name="website_status" defaultValue={settings?.website_status || 'online'} options={[{ value: 'online', label: 'Online' }, { value: 'maintenance', label: 'Maintenance' }, { value: 'offline', label: 'Offline' }]} />
          <Toggle label="Maintenance Mode" checked={settings?.maintenance_mode ?? false} onChange={(checked) => mutation.mutate({ maintenance_mode: checked })} />
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
          <h2 className="text-lg font-semibold">Analytics</h2>
          <Input label="Google Analytics ID" name="google_analytics_id" defaultValue={settings?.google_analytics_id} placeholder="G-XXXXXXXXXX" />
          <Input label="Google Search Console ID" name="google_search_console_id" defaultValue={settings?.google_search_console_id} />
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
          <h2 className="text-lg font-semibold">Custom Scripts</h2>
          <Textarea label="Head Scripts" name="custom_head_scripts" defaultValue={settings?.custom_head_scripts} rows={4} placeholder="<script>...</script>" />
          <Textarea label="Body Scripts" name="custom_body_scripts" defaultValue={settings?.custom_body_scripts} rows={4} placeholder="<script>...</script>" />
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={mutation.isPending} className="px-6 py-2.5 text-sm font-medium rounded-xl bg-[var(--color-primary)] text-white disabled:opacity-50">{mutation.isPending ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  )
}
