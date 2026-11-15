import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Card, Col, Form, Input, Row, Switch, Typography } from 'antd'
import { createBaseService } from '@/admin/services/supabase-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { ImageUpload } from '@/admin/components/ui/ImageUpload'
import { toast } from '@/shared/lib/toast'
import type { Hero } from '@/admin/types'

const heroService = createBaseService<Hero>('hero')

export function HeroPage() {
  const queryClient = useQueryClient()

  const { data: hero, isLoading } = useQuery({
    queryKey: ['hero'],
    queryFn: async () => {
      const { data } = await heroService.list({ pageSize: 1 })
      return data[0]
    },
  })

  const mutation = useMutation({
    mutationFn: (values: Partial<Hero>) =>
      hero ? heroService.update(hero.id, values) : heroService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero'] })
      toast.success('Hero section updated')
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to update'),
  })

  if (isLoading) return <PageSkeleton />

  return (
    <div>
      <PageHeader
        title="Hero Section"
        description="Manage your hero/landing section content"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Hero Section' }]}
      />

      <Form<Partial<Hero>>
        layout="vertical"
        onFinish={(values) => mutation.mutate(values)}
        initialValues={{
          name: hero?.name,
          title: hero?.title,
          short_description: hero?.short_description,
          long_description: hero?.long_description,
          location: hero?.location,
          availability: hero?.availability,
          resume_button_text: hero?.resume_button_text,
          resume_button_url: hero?.resume_button_url,
        }}
        style={{ maxWidth: 880 }}
      >
        <Card size="small" style={{ marginBottom: 16 }} styles={{ body: { padding: 24 } }}>
          <Typography.Title level={5} style={{ marginTop: 0 }}>
            Main Content
          </Typography.Title>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
                <Input placeholder="Your full name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Title is required' }]}>
                <Input placeholder="e.g. Full Stack Developer" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="short_description" label="Short Description">
            <Input.TextArea rows={3} placeholder="Brief introduction" />
          </Form.Item>
          <Form.Item name="long_description" label="Long Description">
            <Input.TextArea rows={5} placeholder="Detailed introduction" />
          </Form.Item>
        </Card>

        <Card size="small" style={{ marginBottom: 16 }} styles={{ body: { padding: 24 } }}>
          <Typography.Title level={5} style={{ marginTop: 0 }}>
            Media
          </Typography.Title>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Avatar">
                <ImageUpload
                  value={hero?.avatar_url}
                  onChange={(url) => mutation.mutate({ avatar_url: url })}
                  bucket="avatars"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Background Image">
                <ImageUpload
                  value={hero?.background_image_url}
                  onChange={(url) => mutation.mutate({ background_image_url: url })}
                  bucket="uploads"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card size="small" style={{ marginBottom: 16 }} styles={{ body: { padding: 24 } }}>
          <Typography.Title level={5} style={{ marginTop: 0 }}>
            Details
          </Typography.Title>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="location" label="Location">
                <Input placeholder="e.g. San Francisco, CA" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="availability" label="Availability">
                <Input placeholder="e.g. Available for work" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="resume_button_text" label="Resume Button Text">
                <Input placeholder="Download CV" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="resume_button_url" label="Resume Button URL">
                <Input placeholder="/cv" />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div>
              <Typography.Text>Published</Typography.Text>
              <Typography.Paragraph type="secondary" style={{ marginBottom: 0, fontSize: 12 }}>
                Show this section on the public site
              </Typography.Paragraph>
            </div>
            <Switch
              checked={hero?.is_published ?? true}
              onChange={(checked) => mutation.mutate({ is_published: checked })}
              loading={mutation.isPending}
            />
          </div>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>
            Save Changes
          </Button>
        </div>
      </Form>
    </div>
  )
}
