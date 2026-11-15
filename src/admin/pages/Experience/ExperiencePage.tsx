import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Checkbox, Form, Input, Modal, Space, Tooltip, Typography } from 'antd'
import { PlusOutlined, EditOutlined, BankOutlined } from '@ant-design/icons'
import { createBaseService } from '@/admin/services/supabase-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { DataTable } from '@/admin/components/ui/DataTable'
import { Pagination } from '@/admin/components/ui/Pagination'
import { StatusBadge } from '@/admin/components/ui/StatusBadge'
import { DeleteButton } from '@/admin/components/ui/DeleteButton'
import { toast } from '@/shared/lib/toast'
import type { Experience } from '@/admin/types'

const experienceService = createBaseService<Experience>('experience')

interface ExperienceFormValues {
  company: string
  position: string
  description: string
  start_date: string
  end_date: string
  is_current: boolean
}

export function ExperiencePage() {
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Experience | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form] = Form.useForm<ExperienceFormValues>()
  const queryClient = useQueryClient()
  const pageSize = 10

  const { data, isLoading } = useQuery({
    queryKey: ['experience', page],
    queryFn: () => experienceService.list({ page, pageSize, sortBy: 'start_date', sortOrder: 'desc' }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => experienceService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] })
      toast.success('Experience deleted')
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to delete'),
  })

  const saveMutation = useMutation({
    mutationFn: (values: ExperienceFormValues) => {
      const payload: Partial<Experience> = { ...values, end_date: values.end_date || null }
      return editing ? experienceService.update(editing.id, payload) : experienceService.create(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] })
      toast.success(editing ? 'Experience updated' : 'Experience created')
      setShowForm(false)
      setEditing(null)
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to save'),
  })

  const openForm = (exp: Experience | null) => {
    setEditing(exp)
    setShowForm(true)
    form.setFieldsValue({
      company: exp?.company ?? '',
      position: exp?.position ?? '',
      description: exp?.description ?? '',
      start_date: exp?.start_date ?? '',
      end_date: exp?.end_date ?? '',
      is_current: exp?.is_current ?? false,
    })
  }

  if (isLoading) return <PageSkeleton />

  const columns = [
    {
      key: 'company',
      header: 'Company',
      render: (exp: Experience) => (
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
              flexShrink: 0,
            }}
          >
            {exp.logo_url ? (
              <img
                src={exp.logo_url}
                alt=""
                style={{ width: 24, height: 24, borderRadius: 4, objectFit: 'cover' }}
              />
            ) : (
              <BankOutlined style={{ color: 'var(--color-text-tertiary)' }} />
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <Typography.Text strong ellipsis style={{ display: 'block', maxWidth: 260 }}>
              {exp.company}
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {exp.position}
            </Typography.Text>
          </div>
        </div>
      ),
    },
    {
      key: 'period',
      header: 'Period',
      width: 220,
      render: (exp: Experience) => (
        <Typography.Text type="secondary" style={{ fontSize: 13 }}>
          {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
        </Typography.Text>
      ),
    },
    {
      key: 'is_current',
      header: 'Current',
      width: 100,
      render: (exp: Experience) => (exp.is_current ? <StatusBadge status="active" /> : null),
    },
    {
      key: 'actions',
      header: '',
      width: 90,
      render: (exp: Experience) => (
        <Space size={0} onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Edit">
            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => openForm(exp)} />
          </Tooltip>
          <DeleteButton onDelete={() => deleteMutation.mutateAsync(exp.id)} />
        </Space>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Experience"
        description="Manage your work experience"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Experience' }]}
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm(null)}>
            Add Experience
          </Button>
        }
      />

      <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(e) => e.id} />
      {data && <Pagination page={page} pageSize={pageSize} total={data.count} onPageChange={setPage} />}

      <Modal
        open={showForm}
        onCancel={() => {
          setShowForm(false)
          setEditing(null)
        }}
        footer={null}
        title={editing ? 'Edit Experience' : 'Add Experience'}
        width={560}
        destroyOnHidden forceRender
      >
        <Form<ExperienceFormValues>
          form={form}
          layout="vertical"
          onFinish={(values) => saveMutation.mutate(values)}
          style={{ marginTop: 16 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item
              name="company"
              label="Company"
              rules={[{ required: true, message: 'Company is required' }]}
            >
              <Input placeholder="Company name" />
            </Form.Item>
            <Form.Item
              name="position"
              label="Position"
              rules={[{ required: true, message: 'Position is required' }]}
            >
              <Input placeholder="Job title" />
            </Form.Item>
          </div>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} placeholder="What did you do?" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item
              name="start_date"
              label="Start Date"
              rules={[{ required: true, message: 'Start date is required' }]}
            >
              <Input type="date" />
            </Form.Item>
            <Form.Item name="end_date" label="End Date">
              <Input type="date" />
            </Form.Item>
          </div>

          <Form.Item name="is_current" valuePropName="checked" style={{ marginBottom: 0 }}>
            <Checkbox>Current job</Checkbox>
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
