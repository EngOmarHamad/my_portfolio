import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Form, Input, InputNumber, Modal, Select, Space, Tooltip, Typography } from 'antd'
import { PlusOutlined, EditOutlined, FileTextOutlined } from '@ant-design/icons'
import { createBaseService } from '@/admin/services/supabase-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { DataTable } from '@/admin/components/ui/DataTable'
import { Pagination } from '@/admin/components/ui/Pagination'
import { SearchInput } from '@/admin/components/ui/SearchInput'
import { StatusBadge } from '@/admin/components/ui/StatusBadge'
import { DeleteButton } from '@/admin/components/ui/DeleteButton'
import { ImageUpload } from '@/admin/components/ui/ImageUpload'
import { TagInput } from '@/admin/components/ui/TagInput'
import { RichTextEditor } from '@/admin/components/ui/RichTextEditor'
import { toast } from '@/shared/lib/toast'
import type { BlogPost } from '@/admin/types'

const blogService = createBaseService<BlogPost>('blog_posts')

interface BlogFormValues {
  title: string
  slug: string
  excerpt: string
  reading_time: number
  status: 'draft' | 'published' | 'archived'
}

export function BlogPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [content, setContent] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [form] = Form.useForm<BlogFormValues>()
  const queryClient = useQueryClient()
  const pageSize = 10

  const { data, isLoading } = useQuery({ queryKey: ['blog', page, search], queryFn: () => blogService.list({ page, pageSize, search }) })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => blogService.remove(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['blog'] }); toast.success('Post deleted') },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to delete'),
  })

  const saveMutation = useMutation({
    mutationFn: (values: BlogFormValues) =>
      editing
        ? blogService.update(editing.id, { ...values, content, cover_image_url: coverImageUrl, tags })
        : blogService.create({ ...values, content, cover_image_url: coverImageUrl, tags }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog'] })
      toast.success(editing ? 'Post updated' : 'Post created')
      setShowForm(false)
      setEditing(null)
      setContent('')
      setCoverImageUrl('')
      setTags([])
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to save'),
  })

  const openForm = (post: BlogPost | null) => {
    setEditing(post)
    setContent(post?.content ?? '')
    setCoverImageUrl(post?.cover_image_url ?? '')
    setTags(post?.tags ?? [])
    setShowForm(true)
    form.setFieldsValue({
      title: post?.title ?? '',
      slug: post?.slug ?? '',
      excerpt: post?.excerpt ?? '',
      reading_time: post?.reading_time ?? 5,
      status: post?.status ?? 'draft',
    })
  }

  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
    setContent('')
    setCoverImageUrl('')
    setTags([])
  }

  if (isLoading) return <PageSkeleton />

  const columns = [
    {
      key: 'title',
      header: 'Post',
      render: (p: BlogPost) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {p.cover_image_url ? (
            <img src={p.cover_image_url} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
          ) : (
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: 'var(--color-surface-hover)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-tertiary)',
              }}
            >
              <FileTextOutlined />
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <Typography.Text strong ellipsis style={{ display: 'block', maxWidth: 320 }}>
              {p.title}
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {p.reading_time} min read
            </Typography.Text>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: 110,
      render: (p: BlogPost) => <StatusBadge status={p.status} />,
    },
    {
      key: 'date',
      header: 'Date',
      width: 130,
      render: (p: BlogPost) => (
        <Typography.Text type="secondary" style={{ fontSize: 13 }}>
          {new Date(p.created_at).toLocaleDateString()}
        </Typography.Text>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: 110,
      render: (p: BlogPost) => (
        <Space size={0} onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Edit">
            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => openForm(p)} />
          </Tooltip>
          <DeleteButton onDelete={() => deleteMutation.mutateAsync(p.id)} />
        </Space>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Blog"
        description="Manage blog posts"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Blog' }]}
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm(null)}>
            New Post
          </Button>
        }
      />

      <div style={{ marginBottom: 16 }}>
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Search posts..." />
      </div>

      <DataTable columns={columns} data={data?.data ?? []} keyExtractor={(p) => p.id} />

      {data && <Pagination page={page} pageSize={pageSize} total={data.count} onPageChange={setPage} />}

      <Modal
        open={showForm}
        onCancel={closeForm}
        footer={null}
        title={editing ? 'Edit Post' : 'New Post'}
        width={720}
        destroyOnHidden forceRender
      >
        <Form<BlogFormValues>
          form={form}
          layout="vertical"
          onFinish={(values) => saveMutation.mutate(values)}
          style={{ marginTop: 16 }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Title is required' }]}>
              <Input placeholder="Post title" />
            </Form.Item>
            <Form.Item name="slug" label="Slug" rules={[{ required: true, message: 'Slug is required' }]}>
              <Input placeholder="my-blog-post" />
            </Form.Item>
          </div>

          <Form.Item name="excerpt" label="Excerpt">
            <Input.TextArea rows={2} placeholder="Short summary shown in post lists" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item name="reading_time" label="Reading Time (min)">
              <InputNumber min={0} style={{ width: '100%' }} />
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

          <TagInput label="Tags" value={tags} onChange={setTags} placeholder="Type a tag and press Enter" />

          <Form.Item label="Cover Image">
            <ImageUpload value={coverImageUrl} onChange={setCoverImageUrl} bucket="blog" />
          </Form.Item>

          <Form.Item label="Content (Markdown)">
            <RichTextEditor value={content} onChange={setContent} />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 24 }}>
            <Button onClick={closeForm}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={saveMutation.isPending}>
              {editing ? 'Save Changes' : 'Create Post'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
