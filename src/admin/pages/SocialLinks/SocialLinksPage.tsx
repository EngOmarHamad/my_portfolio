import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Checkbox, Form, Input, Modal, Select, Space, Tooltip, Typography } from 'antd'
import { PlusOutlined, EditOutlined, ShareAltOutlined } from '@ant-design/icons'
import { createBaseService } from '@/admin/services/supabase-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { DataTable } from '@/admin/components/ui/DataTable'
import { Pagination } from '@/admin/components/ui/Pagination'
import { StatusBadge } from '@/admin/components/ui/StatusBadge'
import { DeleteButton } from '@/admin/components/ui/DeleteButton'
import { toast } from '@/shared/lib/toast'
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

interface SocialLinkFormValues {
  platform: string
  label: string
  url: string
  is_active: boolean
}

export function SocialLinksPage() {
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<SocialLink | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form] = Form.useForm<SocialLinkFormValues>()
  const queryClient = useQueryClient()
  const pageSize = 10

  const { data, isLoading } = useQuery({
    queryKey: ['social-links', page],
    queryFn: () => socialService.list({ page, pageSize }),
  })

  const openForm = (link: SocialLink | null) => {
    setEditing(link)
    setShowForm(true)
    form.setFieldsValue({
      platform: link?.platform ?? '',
      label: link?.label ?? '',
      url: link?.url ?? '',
      is_active: link?.is_active ?? true,
    })
  }

  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
  }

  const deleteMutation = useMutation({
    mutationFn: (id: string) => socialService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-links'] })
      toast.success('Social link deleted')
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to delete'),
  })

  const saveMutation = useMutation({
    mutationFn: (values: SocialLinkFormValues) => {
      const payload: Partial<SocialLink> = {
        platform: values.platform,
        label: values.label,
        url: values.url,
        is_active: values.is_active,
      }
      return editing ? socialService.update(editing.id, payload) : socialService.create(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-links'] })
      toast.success(editing ? 'Link updated' : 'Link created')
      setShowForm(false)
      setEditing(null)
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to save'),
  })

  if (isLoading) return <PageSkeleton />

  const columns = [
    {
      key: 'platform',
      header: 'Platform',
      render: (s: SocialLink) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'var(--color-surface-hover)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShareAltOutlined />
          </div>
          <div style={{ minWidth: 0 }}>
            <Typography.Text strong style={{ display: 'block', textTransform: 'capitalize' }}>
              {s.platform}
            </Typography.Text>
            <Typography.Text type="secondary" ellipsis style={{ display: 'block', maxWidth: 260, fontSize: 12 }}>
              {s.url}
            </Typography.Text>
          </div>
        </div>
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      width: 110,
      render: (s: SocialLink) => <StatusBadge status={s.is_active ? 'active' : 'inactive'} />,
    },
    {
      key: 'actions',
      header: '',
      width: 100,
      render: (s: SocialLink) => (
        <Space size={0} onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Edit">
            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => openForm(s)} />
          </Tooltip>
          <DeleteButton onDelete={() => deleteMutation.mutateAsync(s.id)} />
        </Space>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Social Links"
        description="Manage your social media links"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Social Links' }]}
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm(null)}>
            Add Link
          </Button>
        }
      />

      <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(s) => s.id} />

      {data && <Pagination page={page} pageSize={pageSize} total={data.count} onPageChange={setPage} />}

      <Modal
        open={showForm}
        onCancel={closeForm}
        footer={null}
        title={editing ? 'Edit Social Link' : 'Add Social Link'}
        width={560}
        destroyOnHidden forceRender
      >
        <Form<SocialLinkFormValues>
          form={form}
          layout="vertical"
          onFinish={(values) => saveMutation.mutate(values)}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="platform"
            label="Platform"
            rules={[{ required: true, message: 'Platform is required' }]}
          >
            <Select options={platformOptions} placeholder="Select platform" />
          </Form.Item>

          <Form.Item name="label" label="Label (optional)">
            <Input placeholder="e.g. My GitHub" />
          </Form.Item>

          <Form.Item name="url" label="URL" rules={[{ required: true, message: 'URL is required' }]}>
            <Input placeholder="https://" />
          </Form.Item>

          <Form.Item name="is_active" valuePropName="checked" style={{ marginBottom: 0 }}>
            <Checkbox>Active</Checkbox>
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 24 }}>
            <Button onClick={closeForm}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={saveMutation.isPending}>
              {editing ? 'Save Changes' : 'Save'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
