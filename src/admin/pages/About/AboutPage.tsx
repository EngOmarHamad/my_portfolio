import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Card, Form, Input, InputNumber, Switch, Typography } from 'antd'
import { createBaseService } from '@/admin/services/supabase-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { ImageUpload } from '@/admin/components/ui/ImageUpload'
import { toast } from '@/shared/lib/toast'
import type { About } from '@/admin/types'

const aboutService = createBaseService<About>('about')

export function AboutPage() {
  const queryClient = useQueryClient()

  const { data: about, isLoading } = useQuery({
    queryKey: ['about'],
    queryFn: async () => {
      const { data } = await aboutService.list({ pageSize: 1 })
      return data[0]
    },
  })

  const mutation = useMutation({
    mutationFn: (values: Partial<About>) =>
      about
        ? aboutService.update(about.id, values)
        : aboutService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about'] })
      toast.success('About section updated')
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to update'),
  })

  if (isLoading) return <PageSkeleton />

  return (
    <div>
      <PageHeader
        title="About"
        description="Manage your about section"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'About' }]}
      />

      <Form<Partial<About>>
        layout="vertical"
        onFinish={(values) => mutation.mutate(values)}
        initialValues={{
          biography: about?.biography,
          years_experience: Number(about?.years_experience ?? 0),
        }}
        style={{ maxWidth: 768 }}
      >
        <Card size="small" style={{ marginBottom: 16 }} styles={{ body: { padding: 24 } }}>
          <Typography.Title level={5} style={{ marginTop: 0 }}>
            Profile
          </Typography.Title>
          <Form.Item label="Profile Image">
            <div style={{ maxWidth: 200 }}>
              <ImageUpload
                value={about?.profile_image_url}
                onChange={(url) => mutation.mutate({ profile_image_url: url })}
                bucket="avatars"
              />
            </div>
          </Form.Item>
          <Form.Item name="biography" label="Biography">
            <Input.TextArea rows={6} placeholder="Write your biography..." />
          </Form.Item>
          <Form.Item name="years_experience" label="Years of Experience">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Card>

        <Card size="small" style={{ marginBottom: 16 }} styles={{ body: { padding: 24 } }}>
          <Typography.Title level={5} style={{ marginTop: 0 }}>
            Status
          </Typography.Title>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div>
              <Typography.Text>Published</Typography.Text>
              <Typography.Paragraph type="secondary" style={{ marginBottom: 0, fontSize: 12 }}>
                Show this section on the public site
              </Typography.Paragraph>
            </div>
            <Switch
              checked={about?.is_published ?? true}
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
