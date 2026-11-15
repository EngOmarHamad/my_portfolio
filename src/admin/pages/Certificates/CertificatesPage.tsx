import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Form, Input, Modal, Space, Tooltip, Typography } from 'antd'
import { PlusOutlined, EditOutlined, ExportOutlined, TrophyOutlined } from '@ant-design/icons'
import { createBaseService } from '@/admin/services/supabase-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { DataTable } from '@/admin/components/ui/DataTable'
import { Pagination } from '@/admin/components/ui/Pagination'
import { DeleteButton } from '@/admin/components/ui/DeleteButton'
import { ImageUpload } from '@/admin/components/ui/ImageUpload'
import { toast } from '@/shared/lib/toast'
import type { Certificate } from '@/admin/types'

const certService = createBaseService<Certificate>('certificates')

interface CertificateFormValues {
  title: string
  issuer: string
  issue_date: string
  credential_url: string
}

export function CertificatesPage() {
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Certificate | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form] = Form.useForm<CertificateFormValues>()
  const queryClient = useQueryClient()
  const pageSize = 10

  const { data, isLoading } = useQuery({
    queryKey: ['certificates', page],
    queryFn: () => certService.list({ page, pageSize }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => certService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] })
      toast.success('Certificate deleted')
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to delete'),
  })

  const saveMutation = useMutation({
    mutationFn: (values: Partial<Certificate>) => {
      const payload: Partial<Certificate> = { ...values, issue_date: values.issue_date || null }
      return editing ? certService.update(editing.id, payload) : certService.create(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] })
      toast.success(editing ? 'Certificate updated' : 'Certificate created')
      setShowForm(false)
      setEditing(null)
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to save'),
  })

  const openForm = (cert: Certificate | null) => {
    setEditing(cert)
    setShowForm(true)
    form.setFieldsValue({
      title: cert?.title ?? '',
      issuer: cert?.issuer ?? '',
      issue_date: cert?.issue_date ?? '',
      credential_url: cert?.credential_url ?? '',
    })
  }

  if (isLoading) return <PageSkeleton />

  const columns = [
    {
      key: 'title',
      header: 'Certificate',
      render: (c: Certificate) => (
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
            <TrophyOutlined style={{ color: '#D69E36' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <Typography.Text strong ellipsis style={{ display: 'block', maxWidth: 300 }}>
              {c.title}
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {c.issuer}
            </Typography.Text>
          </div>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Issue Date',
      width: 150,
      render: (c: Certificate) => (
        <Typography.Text type="secondary" style={{ fontSize: 13 }}>
          {c.issue_date || '-'}
        </Typography.Text>
      ),
    },
    {
      key: 'link',
      header: '',
      width: 60,
      render: (c: Certificate) =>
        c.credential_url ? (
          <Tooltip title="View credential">
            <Button
              type="text"
              size="small"
              icon={<ExportOutlined />}
              href={c.credential_url}
              target="_blank"
              rel="noopener noreferrer"
            />
          </Tooltip>
        ) : null,
    },
    {
      key: 'actions',
      header: '',
      width: 90,
      render: (c: Certificate) => (
        <Space size={0} onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Edit">
            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => openForm(c)} />
          </Tooltip>
          <DeleteButton onDelete={() => deleteMutation.mutateAsync(c.id)} />
        </Space>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Certificates"
        description="Manage your certificates"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Certificates' }]}
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm(null)}>
            Add Certificate
          </Button>
        }
      />

      <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(c) => c.id} />
      {data && <Pagination page={page} pageSize={pageSize} total={data.count} onPageChange={setPage} />}

      <Modal
        open={showForm}
        onCancel={() => {
          setShowForm(false)
          setEditing(null)
        }}
        footer={null}
        title={editing ? 'Edit Certificate' : 'Add Certificate'}
        width={560}
        destroyOnHidden forceRender
      >
        <Form<CertificateFormValues>
          form={form}
          layout="vertical"
          onFinish={(values) => saveMutation.mutate(values)}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Title is required' }]}
          >
            <Input placeholder="Certificate title" />
          </Form.Item>

          <Form.Item
            name="issuer"
            label="Issuer"
            rules={[{ required: true, message: 'Issuer is required' }]}
          >
            <Input placeholder="Issuing organization" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item name="issue_date" label="Issue Date">
              <Input type="date" />
            </Form.Item>
            <Form.Item name="credential_url" label="Credential URL">
              <Input placeholder="https://..." />
            </Form.Item>
          </div>

          <Form.Item label="Certificate Image">
            <ImageUpload
              value={editing?.certificate_image_url}
              onChange={(url) => saveMutation.mutate({ certificate_image_url: url })}
              bucket="certificates"
              aspectRatio="4/3"
            />
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
