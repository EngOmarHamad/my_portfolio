import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createBaseService } from '@/admin/services/supabase-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { Input, Textarea, Toggle } from '@/admin/components/ui/FormField'
import { toast } from 'sonner'
import type { ContactInfo } from '@/admin/types'

const contactService = createBaseService<ContactInfo>('contact_info')

export function ContactPage() {
  const queryClient = useQueryClient()

  const { data: contact, isLoading } = useQuery({
    queryKey: ['contact'],
    queryFn: async () => {
      const { data } = await contactService.list({ pageSize: 1 })
      return data[0]
    },
  })

  const mutation = useMutation({
    mutationFn: (values: Partial<ContactInfo>) =>
      contact ? contactService.update(contact.id, values) : contactService.create(values),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['contact'] }); toast.success('Contact info updated') },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to update'),
  })

  if (isLoading) return <PageSkeleton />

  return (
    <div>
      <PageHeader title="Contact Information" description="Manage your contact details" />
      <form onSubmit={(e) => { e.preventDefault(); const form = new FormData(e.currentTarget); mutation.mutate(Object.fromEntries(form) as unknown as Partial<ContactInfo>) }} className="max-w-lg space-y-6">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
          <Input label="Email" name="email" type="email" defaultValue={contact?.email} />
          <Input label="Phone" name="phone" defaultValue={contact?.phone} />
          <Input label="Location" name="location" defaultValue={contact?.location} />
          <Input label="Working Hours" name="working_hours" defaultValue={contact?.working_hours} placeholder="Mon-Fri 9AM-5PM" />
          <Textarea label="Google Map Embed URL" name="google_map_embed_url" defaultValue={contact?.google_map_embed_url} rows={3} />
          <Toggle label="Published" checked={contact?.is_published ?? true} onChange={(checked) => mutation.mutate({ is_published: checked })} />
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={mutation.isPending} className="px-6 py-2.5 text-sm font-medium rounded-xl bg-[var(--color-primary)] text-white disabled:opacity-50">{mutation.isPending ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  )
}
