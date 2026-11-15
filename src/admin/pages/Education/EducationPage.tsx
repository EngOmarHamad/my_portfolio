import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Form, Input, InputNumber, Modal, Space, Tooltip, Typography } from 'antd'
import { PlusOutlined, EditOutlined, ReadOutlined } from '@ant-design/icons'
import { createBaseService } from '@/admin/services/supabase-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { DataTable } from '@/admin/components/ui/DataTable'
import { Pagination } from '@/admin/components/ui/Pagination'
import { DeleteButton } from '@/admin/components/ui/DeleteButton'
import { toast } from '@/shared/lib/toast'
import type { Education } from '@/admin/types'

const educationService = createBaseService<Education>('education')

interface EducationFormValues {
  university: string
  degree: string
  department: string
  description: string
  gpa: number | null
  start_date: string
  end_date: string
}

export function EducationPage() {
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Education | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form] = Form.useForm<EducationFormValues>()
  const queryClient = useQueryClient()
  const pageSize = 10

  const { data, isLoading } = useQuery({
    queryKey: ['education', page],
    queryFn: () => educationService.list({ page, pageSize, sortBy: 'start_date', sortOrder: 'desc' }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => educationService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] })
      toast.success('Education deleted')
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to delete'),
  })

  const saveMutation = useMutation({
    mutationFn: (values: EducationFormValues) => {
      const payload: Partial<Education> = {
        ...values,
        gpa: values.gpa ?? null,
        end_date: values.end_date || null,
      }
      return editing ? educationService.update(editing.id, payload) : educationService.create(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] })
      toast.success(editing ? 'Education updated' : 'Education created')
      setShowForm(false)
      setEditing(null)
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to save'),
  })

  const openForm = (edu: Education | null) => {
    setEditing(edu)
    setShowForm(true)
    form.setFieldsValue({
      university: edu?.university ?? '',
      degree: edu?.degree ?? '',
      department: edu?.department ?? '',
      description: edu?.description ?? '',
      gpa: edu?.gpa ?? null,
      start_date: edu?.start_date ?? '',
      end_date: edu?.end_date ?? '',
    })
  }

  if (isLoading) return <PageSkeleton />

  const columns = [
    {
      key: 'university',
      header: 'Institution',
      render: (edu: Education) => (
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
            <ReadOutlined style={{ color: 'var(--color-text-tertiary)' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <Typography.Text strong ellipsis style={{ display: 'block', maxWidth: 260 }}>
              {edu.university}
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {edu.degree} - {edu.department}
            </Typography.Text>
          </div>
        </div>
      ),
    },
    {
      key: 'period',
      header: 'Period',
      width: 220,
      render: (edu: Education) => (
        <Typography.Text type="secondary" style={{ fontSize: 13 }}>
          {edu.start_date} - {edu.end_date || 'Present'}
        </Typography.Text>
      ),
    },
    {
      key: 'gpa',
      header: 'GPA',
      width: 90,
      render: (edu: Education) =>
        edu.gpa ? (
          <Typography.Text strong>{edu.gpa}</Typography.Text>
        ) : (
          <Typography.Text type="secondary">-</Typography.Text>
        ),
    },
    {
      key: 'actions',
      header: '',
      width: 90,
      render: (edu: Education) => (
        <Space size={0} onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Edit">
            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => openForm(edu)} />
          </Tooltip>
          <DeleteButton onDelete={() => deleteMutation.mutateAsync(edu.id)} />
        </Space>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Education"
        description="Manage your education history"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Education' }]}
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm(null)}>
            Add Education
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
        title={editing ? 'Edit Education' : 'Add Education'}
        width={560}
        destroyOnHidden forceRender
      >
        <Form<EducationFormValues>
          form={form}
          layout="vertical"
          onFinish={(values) => saveMutation.mutate(values)}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="university"
            label="University"
            rules={[{ required: true, message: 'University is required' }]}
          >
            <Input placeholder="University name" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item
              name="degree"
              label="Degree"
              rules={[{ required: true, message: 'Degree is required' }]}
            >
              <Input placeholder="e.g. Bachelor of Science" />
            </Form.Item>
            <Form.Item name="department" label="Department">
              <Input placeholder="e.g. Computer Science" />
            </Form.Item>
          </div>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Details about your studies" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 16px' }}>
            <Form.Item name="gpa" label="GPA">
              <InputNumber min={0} max={4} step={0.01} placeholder="3.5" style={{ width: '100%' }} />
            </Form.Item>
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
