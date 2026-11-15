import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Card, Col, Form, Input, Row, Typography } from 'antd'
import { createBaseService } from '@/admin/services/supabase-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { ImageUpload } from '@/admin/components/ui/ImageUpload'
import { toast } from '@/shared/lib/toast'
import type { SEO } from '@/admin/types'

type SEOFormValues = Omit<SEO, 'keywords'> & { keywords: string }

const seoService = createBaseService<SEO>('seo')

export function SEOPage() {
  const queryClient = useQueryClient()

  const { data: seo, isLoading } = useQuery({
    queryKey: ['seo'],
    queryFn: async () => {
      const { data } = await seoService.list({ pageSize: 1 })
      return data[0]
    },
  })

  const mutation = useMutation({
    mutationFn: (values: Partial<SEO>) =>
      seo ? seoService.update(seo.id, values) : seoService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo'] })
      toast.success('SEO settings updated')
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to update'),
  })

  if (isLoading) return <PageSkeleton />

  const handleFinish = (values: Partial<SEOFormValues>) => {
    const keywords = (values.keywords ?? '')
      .split(',')
      .map((keyword) => keyword.trim())
      .filter(Boolean)
    mutation.mutate({ ...values, keywords } as Partial<SEO>)
  }

  return (
    <div>
      <PageHeader
        title="SEO"
        description="Manage SEO settings for your portfolio"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'SEO' }]}
      />

      <Form<Partial<SEOFormValues>>
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          site_title: seo?.site_title,
          site_description: seo?.site_description,
          keywords: seo?.keywords?.join(', '),
          canonical_url: seo?.canonical_url,
          robots: seo?.robots ?? 'index, follow',
          og_title: seo?.og_title,
          og_description: seo?.og_description,
          twitter_handle: seo?.twitter_handle,
          twitter_card: seo?.twitter_card ?? 'summary_large_image',
        }}
        style={{ maxWidth: 672 }}
      >
        <Card size="small" style={{ marginBottom: 16 }} styles={{ body: { padding: 24 } }}>
          <Typography.Title level={5} style={{ marginTop: 0 }}>
            General
          </Typography.Title>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="site_title" label="Site Title">
                <Input placeholder="My Portfolio" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="canonical_url" label="Canonical URL">
                <Input placeholder="https://example.com" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="site_description" label="Site Description">
            <Input.TextArea rows={3} placeholder="Brief description of your site" />
          </Form.Item>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="keywords" label="Keywords (comma separated)">
                <Input placeholder="developer, portfolio, react" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="robots" label="Robots">
                <Input placeholder="index, follow" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Favicon">
            <div style={{ maxWidth: 100 }}>
              <ImageUpload
                value={seo?.favicon_url}
                onChange={(url) => mutation.mutate({ favicon_url: url })}
                bucket="uploads"
              />
            </div>
          </Form.Item>
        </Card>

        <Card size="small" style={{ marginBottom: 16 }} styles={{ body: { padding: 24 } }}>
          <Typography.Title level={5} style={{ marginTop: 0 }}>
            Open Graph
          </Typography.Title>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="og_title" label="OG Title">
                <Input placeholder="Site title for social sharing" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="og_description" label="OG Description">
                <Input.TextArea rows={2} placeholder="Site description for social sharing" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="OG Image">
            <ImageUpload
              value={seo?.og_image_url}
              onChange={(url) => mutation.mutate({ og_image_url: url })}
              bucket="uploads"
            />
          </Form.Item>
        </Card>

        <Card size="small" style={{ marginBottom: 16 }} styles={{ body: { padding: 24 } }}>
          <Typography.Title level={5} style={{ marginTop: 0 }}>
            Twitter Card
          </Typography.Title>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="twitter_handle" label="Twitter Handle">
                <Input placeholder="@username" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="twitter_card" label="Twitter Card Type">
                <Input placeholder="summary_large_image" />
              </Form.Item>
            </Col>
          </Row>
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
