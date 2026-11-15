import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Form, Input, Modal, Select, Switch, Space, Tooltip, Typography } from 'antd'
import { PlusOutlined, EditOutlined, ExportOutlined, StarFilled, StarOutlined } from '@ant-design/icons'
import { supabase } from '@/admin/lib/supabase'
import { createBaseService } from '@/admin/services/supabase-service'
import { TagInput } from '@/admin/components/ui/TagInput'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { DataTable } from '@/admin/components/ui/DataTable'
import { Pagination } from '@/admin/components/ui/Pagination'
import { SearchInput } from '@/admin/components/ui/SearchInput'
import { StatusBadge } from '@/admin/components/ui/StatusBadge'
import { DeleteButton } from '@/admin/components/ui/DeleteButton'
import { ImageUpload } from '@/admin/components/ui/ImageUpload'
import { toast } from '@/shared/lib/toast'
import type { Project } from '@/admin/types'

const projectsService = createBaseService<Project>('projects')

interface ProjectFormValues {
  title: string
  slug: string
  description: string
  long_description: string
  category: string
  github_url: string
  live_demo_url: string
  tech_stack_text: string
  status: 'draft' | 'published' | 'archived'
  is_featured: boolean
}

export function ProjectsPage() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Project | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [form] = Form.useForm<ProjectFormValues>()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['projects', page, pageSize, search],
    queryFn: () => projectsService.list({ page, pageSize, search }),
  })

  const tagOptionsQuery = useQuery({
    queryKey: ['project-tags'],
    queryFn: async () => {
      const { data, error } = await supabase.from('projects').select('tags')
      if (error) throw error
      const set = new Set<string>()
      data?.forEach((p) => (p.tags ?? []).forEach((t: unknown) => set.add(String(t))))
      return [...set].sort()
    },
  })

  const openForm = (project: Project | null) => {
    setEditing(project)
    setThumbnailUrl(project?.thumbnail_url ?? '')
    setTags(project?.tags ?? [])
    setShowForm(true)
    form.setFieldsValue({
      title: project?.title ?? '',
      slug: project?.slug ?? '',
      description: project?.description ?? '',
      long_description: project?.long_description ?? '',
      category: project?.category ?? '',
      github_url: project?.github_url ?? '',
      live_demo_url: project?.live_demo_url ?? '',
      tech_stack_text: project?.tech_stack?.join(', ') ?? '',
      status: project?.status ?? 'draft',
      is_featured: project?.is_featured ?? false,
    })
  }

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project deleted')
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to delete'),
  })

  const saveMutation = useMutation({
    mutationFn: (values: ProjectFormValues) => {
      const payload: Partial<Project> = {
        ...values,
        tech_stack: (values.tech_stack_text || '').split(',').map((s) => s.trim()).filter(Boolean),
        tags,
        thumbnail_url: thumbnailUrl,
      }
      delete (payload as Record<string, unknown>).tech_stack_text
      return editing ? projectsService.update(editing.id, payload) : projectsService.create(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success(editing ? 'Project updated' : 'Project created')
      setShowForm(false)
      setEditing(null)
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to save'),
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_featured }: { id: string; is_featured: boolean }) =>
      projectsService.toggleStatus(id, 'is_featured', is_featured),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  })

  if (isLoading) return <PageSkeleton />

  const columns = [
    {
      key: 'title',
      header: 'Project',
      render: (project: Project) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {project.thumbnail_url ? (
            <img src={project.thumbnail_url} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} />
          ) : (
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 6,
                background: 'var(--color-surface-hover)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                color: 'var(--color-text-tertiary)',
              }}
            >
              No img
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <Typography.Text strong ellipsis style={{ display: 'block', maxWidth: 260 }}>
              {project.title}
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {project.category || '—'}
            </Typography.Text>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: 110,
      render: (project: Project) => <StatusBadge status={project.status} />,
    },
    {
      key: 'is_featured',
      header: 'Featured',
      width: 100,
      render: (project: Project) => (
        <Tooltip title={project.is_featured ? 'Unfeature' : 'Feature'}>
          <Button
            type="text"
            size="small"
            icon={project.is_featured ? <StarFilled style={{ color: 'var(--color-secondary)' }} /> : <StarOutlined />}
            onClick={() => toggleMutation.mutate({ id: project.id, is_featured: !project.is_featured })}
          />
        </Tooltip>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: 130,
      render: (project: Project) => (
        <Space size={0} onClick={(e) => e.stopPropagation()}>
          {project.live_demo_url && (
            <Tooltip title="Open demo">
              <Button
                type="text"
                size="small"
                icon={<ExportOutlined />}
                href={project.live_demo_url}
                target="_blank"
                rel="noopener noreferrer"
              />
            </Tooltip>
          )}
          <Tooltip title="Edit">
            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => openForm(project)} />
          </Tooltip>
          <DeleteButton onDelete={() => deleteMutation.mutateAsync(project.id)} />
        </Space>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Manage your portfolio projects"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Projects' }]}
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm(null)}>
            Add Project
          </Button>
        }
      />

      <div style={{ marginBottom: 16 }}>
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v)
            setPage(1)
          }}
          placeholder="Search projects..."
        />
      </div>

      <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(p) => p.id} />

      {data && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={data.count}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setPage(1)
          }}
        />
      )}

      <Modal
        open={showForm}
        onCancel={() => {
          setShowForm(false)
          setEditing(null)
        }}
        footer={null}
        title={editing ? 'Edit Project' : 'Add Project'}
        width={720}
        destroyOnHidden forceRender
      >
        <Form<ProjectFormValues>
          form={form}
          layout="vertical"
          onFinish={(values) => saveMutation.mutate(values)}
          style={{ marginTop: 16 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Title is required' }]}>
              <Input placeholder="Project title" />
            </Form.Item>
            <Form.Item name="slug" label="Slug" rules={[{ required: true, message: 'Slug is required' }]}>
              <Input placeholder="my-project" />
            </Form.Item>
          </div>

          <Form.Item name="description" label="Short Description">
            <Input.TextArea rows={3} placeholder="One or two sentences about this project" />
          </Form.Item>

          <Form.Item name="long_description" label="Long Description">
            <Input.TextArea rows={5} placeholder="Detailed description" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item name="category" label="Category">
              <Input placeholder="web, mobile, etc." />
            </Form.Item>
            <Form.Item name="status" label="Status">
              <Select
                options={[
                  { value: 'draft', label: 'Draft' },
                  { value: 'published', label: 'Published' },
                  { value: 'archived', label: 'Archived' },
                ]}
              />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item name="github_url" label="GitHub URL">
              <Input placeholder="https://github.com/..." />
            </Form.Item>
            <Form.Item name="live_demo_url" label="Live Demo URL">
              <Input placeholder="https://..." />
            </Form.Item>
          </div>

          <Form.Item name="tech_stack_text" label="Tech Stack">
            <Input placeholder="React, Node.js, PostgreSQL (comma separated)" />
          </Form.Item>

          <TagInput
            label="Tags"
            value={tags}
            onChange={setTags}
            options={tagOptionsQuery.data ?? []}
            placeholder="Type a tag and press Enter"
          />

          <Form.Item label="Thumbnail">
            <ImageUpload value={thumbnailUrl} onChange={setThumbnailUrl} bucket="projects" />
          </Form.Item>

          <Form.Item name="is_featured" valuePropName="checked" style={{ marginBottom: 0 }}>
            <Switch checkedChildren="Featured" unCheckedChildren="Not featured" />
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
              {editing ? 'Save Changes' : 'Create Project'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
