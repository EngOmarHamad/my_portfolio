import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Form, Input, InputNumber, Modal, Space, Tooltip, Typography } from 'antd'
import { PlusOutlined, EditOutlined, StarFilled } from '@ant-design/icons'
import { createBaseService } from '@/admin/services/supabase-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { DataTable } from '@/admin/components/ui/DataTable'
import { Pagination } from '@/admin/components/ui/Pagination'
import { StatusBadge } from '@/admin/components/ui/StatusBadge'
import { DeleteButton } from '@/admin/components/ui/DeleteButton'
import { ImageUpload } from '@/admin/components/ui/ImageUpload'
import { toast } from '@/shared/lib/toast'
import type { Testimonial } from '@/admin/types'

const testimonialService = createBaseService<Testimonial>('testimonials')

interface TestimonialFormValues {
  client_name: string
  company: string
  review: string
  rating: number
}

export function TestimonialsPage() {
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [form] = Form.useForm<TestimonialFormValues>()
  const queryClient = useQueryClient()
  const pageSize = 10

  const { data, isLoading } = useQuery({
    queryKey: ['testimonials', page],
    queryFn: () => testimonialService.list({ page, pageSize }),
  })

  const openForm = (testimonial: Testimonial | null) => {
    setEditing(testimonial)
    setImageUrl(testimonial?.image_url ?? '')
    setShowForm(true)
    form.setFieldsValue({
      client_name: testimonial?.client_name ?? '',
      company: testimonial?.company ?? '',
      review: testimonial?.review ?? '',
      rating: testimonial?.rating ?? 5,
    })
  }

  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
  }

  const deleteMutation = useMutation({
    mutationFn: (id: string) => testimonialService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
      toast.success('Testimonial deleted')
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to delete'),
  })

  const saveMutation = useMutation({
    mutationFn: (values: TestimonialFormValues) => {
      const payload: Partial<Testimonial> = {
        client_name: values.client_name,
        company: values.company,
        review: values.review,
        rating: values.rating ?? 5,
        image_url: imageUrl,
        is_published: true,
      }
      return editing ? testimonialService.update(editing.id, payload) : testimonialService.create(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
      toast.success(editing ? 'Testimonial updated' : 'Testimonial created')
      setShowForm(false)
      setEditing(null)
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to save'),
  })

  if (isLoading) return <PageSkeleton />

  const columns = [
    {
      key: 'client',
      header: 'Client',
      render: (t: Testimonial) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {t.image_url ? (
            <img
              src={t.image_url}
              alt=""
              style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'var(--color-surface-hover)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                color: 'var(--color-text-tertiary)',
              }}
            >
              {t.client_name.charAt(0)}
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <Typography.Text strong ellipsis style={{ display: 'block', maxWidth: 220 }}>
              {t.client_name}
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {t.company || '—'}
            </Typography.Text>
          </div>
        </div>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      width: 140,
      render: (t: Testimonial) => (
        <Space size={2}>
          {Array.from({ length: t.rating }).map((_, i) => (
            <StarFilled key={i} style={{ color: '#f59e0b', fontSize: 13 }} />
          ))}
        </Space>
      ),
    },
    {
      key: 'is_published',
      header: 'Status',
      width: 110,
      render: (t: Testimonial) => <StatusBadge status={t.is_published ? 'published' : 'draft'} />,
    },
    {
      key: 'actions',
      header: '',
      width: 100,
      render: (t: Testimonial) => (
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
        title="Testimonials"
        description="Manage client testimonials"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Testimonials' }]}
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm(null)}>
            Add Testimonial
          </Button>
        }
      />

      <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(t) => t.id} />

      {data && <Pagination page={page} pageSize={pageSize} total={data.count} onPageChange={setPage} />}

      <Modal
        open={showForm}
        onCancel={closeForm}
        footer={null}
        title={editing ? 'Edit Testimonial' : 'Add Testimonial'}
        width={560}
        destroyOnHidden forceRender
      >
        <Form<TestimonialFormValues>
          form={form}
          layout="vertical"
          onFinish={(values) => saveMutation.mutate(values)}
          style={{ marginTop: 16 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item
              name="client_name"
              label="Client Name"
              rules={[{ required: true, message: 'Client name is required' }]}
            >
              <Input placeholder="Jane Doe" />
            </Form.Item>
            <Form.Item name="company" label="Company">
              <Input placeholder="Acme Inc." />
            </Form.Item>
          </div>

          <Form.Item name="review" label="Review" rules={[{ required: true, message: 'Review is required' }]}>
            <Input.TextArea rows={4} placeholder="What did the client say?" />
          </Form.Item>

          <Form.Item name="rating" label="Rating (1-5)">
            <InputNumber min={1} max={5} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Client Photo">
            <ImageUpload value={imageUrl} onChange={setImageUrl} bucket="avatars" />
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
