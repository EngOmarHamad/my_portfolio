import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, DatePicker, Form, Input, Modal, Space, Tooltip, Typography } from 'antd'
import { PlusOutlined, EditOutlined, TrophyOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { createBaseService } from '@/admin/services/supabase-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { DataTable } from '@/admin/components/ui/DataTable'
import { Pagination } from '@/admin/components/ui/Pagination'
import { StatusBadge } from '@/admin/components/ui/StatusBadge'
import { DeleteButton } from '@/admin/components/ui/DeleteButton'
import { toast } from '@/shared/lib/toast'
import type { Achievement } from '@/admin/types'

const achievementService = createBaseService<Achievement>('achievements')

interface AchievementFormValues {
  title: string
  description: string
  icon: string
  date: Dayjs | null
}

export function AchievementsPage() {
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Achievement | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form] = Form.useForm<AchievementFormValues>()
  const queryClient = useQueryClient()
  const pageSize = 10

  const { data, isLoading } = useQuery({
    queryKey: ['achievements', page],
    queryFn: () => achievementService.list({ page, pageSize }),
  })

  const openForm = (achievement: Achievement | null) => {
    setEditing(achievement)
    setShowForm(true)
    form.setFieldsValue({
      title: achievement?.title ?? '',
      description: achievement?.description ?? '',
      icon: achievement?.icon ?? '',
      date: achievement?.date ? dayjs(achievement.date) : null,
    })
  }

  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
  }

  const deleteMutation = useMutation({
    mutationFn: (id: string) => achievementService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] })
      toast.success('Achievement deleted')
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to delete'),
  })

  const saveMutation = useMutation({
    mutationFn: (values: AchievementFormValues) => {
      const payload: Partial<Achievement> = {
        title: values.title,
        description: values.description,
        icon: values.icon,
        date: values.date ? values.date.format('YYYY-MM-DD') : null,
        is_published: true,
      }
      return editing ? achievementService.update(editing.id, payload) : achievementService.create(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] })
      toast.success(editing ? 'Achievement updated' : 'Achievement created')
      setShowForm(false)
      setEditing(null)
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to save'),
  })

  if (isLoading) return <PageSkeleton />

  const columns = [
    {
      key: 'title',
      header: 'Achievement',
      render: (a: Achievement) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(245, 158, 11, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrophyOutlined style={{ color: '#f59e0b' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <Typography.Text strong ellipsis style={{ display: 'block', maxWidth: 320 }}>
              {a.title}
            </Typography.Text>
            <Typography.Text type="secondary" ellipsis style={{ display: 'block', maxWidth: 320, fontSize: 12 }}>
              {a.description?.slice(0, 60)}
            </Typography.Text>
          </div>
        </div>
      ),
    },
    {
      key: 'is_published',
      header: 'Status',
      width: 110,
      render: (a: Achievement) => <StatusBadge status={a.is_published ? 'published' : 'draft'} />,
    },
    {
      key: 'actions',
      header: '',
      width: 100,
      render: (a: Achievement) => (
        <Space size={0} onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Edit">
            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => openForm(a)} />
          </Tooltip>
          <DeleteButton onDelete={() => deleteMutation.mutateAsync(a.id)} />
        </Space>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Achievements"
        description="Manage your achievements"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Achievements' }]}
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm(null)}>
            Add Achievement
          </Button>
        }
      />

      <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(a) => a.id} />

      {data && <Pagination page={page} pageSize={pageSize} total={data.count} onPageChange={setPage} />}

      <Modal
        open={showForm}
        onCancel={closeForm}
        footer={null}
        title={editing ? 'Edit Achievement' : 'Add Achievement'}
        width={560}
        destroyOnHidden forceRender
      >
        <Form<AchievementFormValues>
          form={form}
          layout="vertical"
          onFinish={(values) => saveMutation.mutate(values)}
          style={{ marginTop: 16 }}
        >
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Title is required' }]}>
            <Input placeholder="Award name" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="What did you achieve?" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item name="icon" label="Icon (emoji)">
              <Input placeholder="🏆" />
            </Form.Item>
            <Form.Item name="date" label="Date">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </div>

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
