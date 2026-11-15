import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Checkbox, Form, Input, InputNumber, Modal, Space, Tooltip, Typography } from 'antd'
import { PlusOutlined, EditOutlined } from '@ant-design/icons'
import { createBaseService } from '@/admin/services/supabase-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { DataTable } from '@/admin/components/ui/DataTable'
import { Pagination } from '@/admin/components/ui/Pagination'
import { StatusBadge } from '@/admin/components/ui/StatusBadge'
import { DeleteButton } from '@/admin/components/ui/DeleteButton'
import { toast } from '@/shared/lib/toast'
import type { Service } from '@/admin/types'

const serviceApi = createBaseService<Service>('services')

interface ServiceFormValues {
  title: string
  icon: string
  description: string
  price: number | null
  is_featured: boolean
}

export function ServicesPage() {
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Service | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form] = Form.useForm<ServiceFormValues>()
  const queryClient = useQueryClient()
  const pageSize = 10

  const { data, isLoading } = useQuery({
    queryKey: ['services', page],
    queryFn: () => serviceApi.list({ page, pageSize }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => serviceApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      toast.success('Service deleted')
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to delete'),
  })

  const saveMutation = useMutation({
    mutationFn: (values: ServiceFormValues) => {
      const payload: Partial<Service> = { ...values }
      if (!editing) payload.is_published = true
      return editing ? serviceApi.update(editing.id, payload) : serviceApi.create(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      toast.success(editing ? 'Service updated' : 'Service created')
      setShowForm(false)
      setEditing(null)
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to save'),
  })

  const openForm = (service: Service | null) => {
    setEditing(service)
    setShowForm(true)
    form.setFieldsValue({
      title: service?.title ?? '',
      icon: service?.icon ?? '',
      description: service?.description ?? '',
      price: service?.price ?? null,
      is_featured: service?.is_featured ?? false,
    })
  }

  if (isLoading) return <PageSkeleton />

  const columns = [
    {
      key: 'title',
      header: 'Service',
      render: (s: Service) => (
        <div style={{ minWidth: 0 }}>
          <Typography.Text strong ellipsis style={{ display: 'block', maxWidth: 320 }}>
            {s.icon ? `${s.icon} ` : ''}
            {s.title}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {s.description?.slice(0, 80)}
          </Typography.Text>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      width: 100,
      render: (s: Service) =>
        s.price ? (
          <Typography.Text strong>${s.price}</Typography.Text>
        ) : (
          <Typography.Text type="secondary">-</Typography.Text>
        ),
    },
    {
      key: 'is_featured',
      header: 'Featured',
      width: 100,
      render: (s: Service) => (s.is_featured ? <StatusBadge status="active" /> : null),
    },
    {
      key: 'is_published',
      header: 'Status',
      width: 110,
      render: (s: Service) => <StatusBadge status={s.is_published ? 'published' : 'draft'} />,
    },
    {
      key: 'actions',
      header: '',
      width: 90,
      render: (s: Service) => (
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
        title="Services"
        description="Manage your services"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Services' }]}
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm(null)}>
            Add Service
          </Button>
        }
      />

      <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(s) => s.id} />
      {data && <Pagination page={page} pageSize={pageSize} total={data.count} onPageChange={setPage} />}

      <Modal
        open={showForm}
        onCancel={() => {
          setShowForm(false)
          setEditing(null)
        }}
        footer={null}
        title={editing ? 'Edit Service' : 'Add Service'}
        width={560}
        destroyOnHidden forceRender
      >
        <Form<ServiceFormValues>
          form={form}
          layout="vertical"
          onFinish={(values) => saveMutation.mutate(values)}
          style={{ marginTop: 16 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Title is required' }]}>
              <Input placeholder="Service title" />
            </Form.Item>
            <Form.Item name="icon" label="Icon (emoji)">
              <Input placeholder="💻" />
            </Form.Item>
          </div>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} placeholder="Describe this service" />
          </Form.Item>

          <Form.Item name="price" label="Price (optional)">
            <InputNumber min={0} step={0.01} placeholder="0.00" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="is_featured" valuePropName="checked" style={{ marginBottom: 0 }}>
            <Checkbox>Featured</Checkbox>
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 24 }}>
            <Button
              onClick={() => {
                setShowForm(false)
                setEditing(null)
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={saveMutation.isPending}>
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
