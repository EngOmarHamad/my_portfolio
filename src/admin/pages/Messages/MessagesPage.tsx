import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Descriptions, Modal, Space, Tooltip, Typography } from 'antd'
import { MailFilled, MailOutlined } from '@ant-design/icons'
import { createBaseService } from '@/admin/services/supabase-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { DataTable } from '@/admin/components/ui/DataTable'
import { Pagination } from '@/admin/components/ui/Pagination'
import { StatusBadge } from '@/admin/components/ui/StatusBadge'
import { DeleteButton } from '@/admin/components/ui/DeleteButton'
import { SearchInput } from '@/admin/components/ui/SearchInput'
import { toast } from '@/shared/lib/toast'
import type { ContactMessage } from '@/admin/types'

const messagesService = createBaseService<ContactMessage>('contact_messages')

export function MessagesPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<ContactMessage | null>(null)
  const queryClient = useQueryClient()
  const pageSize = 15

  const { data, isLoading } = useQuery({
    queryKey: ['messages', page, search],
    queryFn: () => messagesService.list({ page, pageSize, search, sortBy: 'created_at', sortOrder: 'desc' }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => messagesService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
      toast.success('Message deleted')
      setSelected(null)
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to delete'),
  })

  const toggleReadMutation = useMutation({
    mutationFn: ({ id, is_read }: { id: string; is_read: boolean }) =>
      messagesService.toggleStatus(id, 'is_read', is_read),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })

  if (isLoading) return <PageSkeleton />

  const unreadCount = data?.data?.filter((m) => !m.is_read).length ?? 0

  const columns = [
    {
      key: 'name',
      header: 'From',
      render: (m: ContactMessage) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              background: m.is_read ? 'var(--color-surface-hover)' : 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
              color: m.is_read ? 'var(--color-text-tertiary)' : 'var(--color-primary)',
            }}
          >
            {m.is_read ? <MailOutlined /> : <MailFilled />}
          </div>
          <div style={{ minWidth: 0 }}>
            <Typography.Text strong={!m.is_read} ellipsis style={{ display: 'block', maxWidth: 240 }}>
              {m.name}
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {m.email}
            </Typography.Text>
          </div>
        </div>
      ),
    },
    {
      key: 'subject',
      header: 'Subject',
      render: (m: ContactMessage) => (
        <Typography.Text strong={!m.is_read} type={m.is_read ? 'secondary' : undefined} ellipsis style={{ maxWidth: 320, display: 'block' }}>
          {m.subject || '(No subject)'}
        </Typography.Text>
      ),
    },
    {
      key: 'created_at',
      header: 'Date',
      width: 170,
      render: (m: ContactMessage) => (
        <Typography.Text type="secondary" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
          {new Date(m.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </Typography.Text>
      ),
    },
    {
      key: 'is_read',
      header: 'Status',
      width: 100,
      render: (m: ContactMessage) => (
        <StatusBadge status={m.is_read ? 'read' : 'unread'} />
      ),
    },
    {
      key: 'actions',
      header: '',
      width: 110,
      render: (m: ContactMessage) => (
        <Space size={0} onClick={(e) => e.stopPropagation()}>
          <Tooltip title={m.is_read ? 'Mark as unread' : 'Mark as read'}>
            <Button
              type="text"
              size="small"
              icon={m.is_read ? <MailFilled /> : <MailOutlined />}
              onClick={() => toggleReadMutation.mutate({ id: m.id, is_read: !m.is_read })}
            />
          </Tooltip>
          <DeleteButton onDelete={() => deleteMutation.mutateAsync(m.id)} />
        </Space>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Messages"
        description={`Manage messages from visitors${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Messages' }]}
      />

      <div style={{ marginBottom: 16 }}>
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search messages..." />
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        keyExtractor={(m) => m.id}
        onRowClick={(m) => setSelected(m)}
      />

      {data && (
        <Pagination page={page} pageSize={pageSize} total={data.count} onPageChange={setPage} />
      )}

      <Modal
        open={Boolean(selected)}
        onCancel={() => setSelected(null)}
        footer={null}
        title={
          <Space>
            <span>Message Details</span>
            {selected && (
              <Tooltip title={selected.is_read ? 'Mark as unread' : 'Mark as read'}>
                <Button
                  type="text"
                  size="small"
                  icon={selected.is_read ? <MailFilled /> : <MailOutlined />}
                  onClick={() => {
                    toggleReadMutation.mutate({ id: selected.id, is_read: !selected.is_read })
                    setSelected(null)
                  }}
                />
              </Tooltip>
            )}
          </Space>
        }
        width={560}
        destroyOnHidden forceRender
      >
        {selected && (
          <>
            <Descriptions column={1} size="small" style={{ marginTop: 16 }}>
              <Descriptions.Item label="From">
                <Typography.Text strong>{selected.name}</Typography.Text>
                <br />
                <Typography.Link href={`mailto:${selected.email}`}>{selected.email}</Typography.Link>
              </Descriptions.Item>
              <Descriptions.Item label="Subject">
                {selected.subject || '(No subject)'}
              </Descriptions.Item>
              <Descriptions.Item label="Message">
                <Typography.Text type="secondary" style={{ whiteSpace: 'pre-wrap' }}>
                  {selected.message}
                </Typography.Text>
              </Descriptions.Item>
              <Descriptions.Item label="Received">
                <Typography.Text type="secondary">
                  {new Date(selected.created_at).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
                </Typography.Text>
              </Descriptions.Item>
            </Descriptions>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
              <Button
                onClick={() => toggleReadMutation.mutate({ id: selected.id, is_read: !selected.is_read })}
              >
                {selected.is_read ? 'Mark Unread' : 'Mark Read'}
              </Button>
              <DeleteButton onDelete={() => deleteMutation.mutateAsync(selected.id)} />
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
