import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Form, Input, Modal, Select, Space, Tooltip, Typography } from 'antd'
import { PlusOutlined, EditOutlined } from '@ant-design/icons'
import { createBaseService } from '@/admin/services/supabase-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { DataTable } from '@/admin/components/ui/DataTable'
import { Pagination } from '@/admin/components/ui/Pagination'
import { StatusBadge } from '@/admin/components/ui/StatusBadge'
import { DeleteButton } from '@/admin/components/ui/DeleteButton'
import { toast } from '@/shared/lib/toast'
import type { TimelineItem } from '@/admin/types'

const timelineService = createBaseService<TimelineItem>('timeline_items')

const typeOptions = [
  { value: 'education', label: 'Education' },
  { value: 'experience', label: 'Experience' },
  { value: 'certification', label: 'Certification' },
  { value: 'achievement', label: 'Achievement' },
]

interface TimelineFormValues {
  year: string
  title: string
  subtitle: string
  description: string
  type: TimelineItem['type']
}

export function TimelinePage() {
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<TimelineItem | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form] = Form.useForm<TimelineFormValues>()
  const queryClient = useQueryClient()
  const pageSize = 10

  const { data, isLoading } = useQuery({
    queryKey: ['timeline', page],
    queryFn: () => timelineService.list({ page, pageSize }),
  })

  const openForm = (item: TimelineItem | null) => {
    setEditing(item)
    setShowForm(true)
    form.setFieldsValue({
      year: item?.year ?? '',
      title: item?.title ?? '',
      subtitle: item?.subtitle ?? '',
      description: item?.description ?? '',
      type: item?.type ?? 'experience',
    })
  }

  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
  }

  const deleteMutation = useMutation({
    mutationFn: (id: string) => timelineService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeline'] })
      toast.success('Item deleted')
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to delete'),
  })

  const saveMutation = useMutation({
    mutationFn: (values: TimelineFormValues) => {
      const payload: Partial<TimelineItem> = {
        year: values.year,
        title: values.title,
        subtitle: values.subtitle,
        description: values.description,
        type: values.type,
        is_published: true,
      }
      return editing ? timelineService.update(editing.id, payload) : timelineService.create(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeline'] })
      toast.success(editing ? 'Item updated' : 'Item created')
      setShowForm(false)
      setEditing(null)
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to save'),
  })

  if (isLoading) return <PageSkeleton />

  const columns = [
    {
      key: 'title',
      header: 'Event',
      render: (t: TimelineItem) => (
        <div style={{ minWidth: 0 }}>
          <Typography.Text strong ellipsis style={{ display: 'block', maxWidth: 280 }}>
            {t.title}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {t.subtitle || '—'}
          </Typography.Text>
        </div>
      ),
    },
    {
      key: 'year',
      header: 'Year',
      width: 90,
      render: (t: TimelineItem) => <Typography.Text strong>{t.year}</Typography.Text>,
    },
    {
      key: 'type',
      header: 'Type',
      width: 140,
      render: (t: TimelineItem) => <StatusBadge status={t.type} />,
    },
    {
      key: 'is_published',
      header: 'Status',
      width: 110,
      render: (t: TimelineItem) => <StatusBadge status={t.is_published ? 'published' : 'draft'} />,
    },
    {
      key: 'actions',
      header: '',
      width: 100,
      render: (t: TimelineItem) => (
        <Space size={0} onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Edit">
            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => openForm(t)} />
          </Tooltip>
          <DeleteButton onDelete={() => deleteMutation.mutateAsync(t.id)} />
        </Space>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Timeline"
        description="Manage your timeline events"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Timeline' }]}
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm(null)}>
            Add Event
          </Button>
        }
      />

      <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(t) => t.id} />

      {data && <Pagination page={page} pageSize={pageSize} total={data.count} onPageChange={setPage} />}

      <Modal
        open={showForm}
        onCancel={closeForm}
        footer={null}
        title={editing ? 'Edit Event' : 'Add Event'}
        width={560}
        destroyOnHidden forceRender
      >
        <Form<TimelineFormValues>
          form={form}
          layout="vertical"
          onFinish={(values) => saveMutation.mutate(values)}
          style={{ marginTop: 16 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item name="year" label="Year" rules={[{ required: true, message: 'Year is required' }]}>
              <Input placeholder="2024" />
            </Form.Item>
            <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Title is required' }]}>
              <Input placeholder="Event title" />
            </Form.Item>
          </div>

          <Form.Item name="subtitle" label="Subtitle">
            <Input placeholder="e.g. Company or school" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Details about this event" />
          </Form.Item>

          <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Type is required' }]}>
            <Select options={typeOptions} placeholder="Select type" />
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
