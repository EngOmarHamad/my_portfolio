import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Card, Col, Form, Input, Row, Switch, Typography } from 'antd'
import { createBaseService } from '@/admin/services/supabase-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { toast } from '@/shared/lib/toast'
import type { ContactInfo } from '@/admin/types'

const contactService = createBaseService<ContactInfo>('contact_info')

export function ContactPage() {
  const queryClient = useQueryClient()

  const { data: contact, isLoading } = useQuery({
    queryKey: ['contact'],
    queryFn: async () => {
      const { data } = await contactService.list({ pageSize: 1 })
      return data[0]
    },
  })

  const mutation = useMutation({
    mutationFn: (values: Partial<ContactInfo>) =>
      contact ? contactService.update(contact.id, values) : contactService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact'] })
      toast.success('Contact info updated')
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to update'),
  })

  if (isLoading) return <PageSkeleton />

  return (
    <div>
      <PageHeader
        title="Contact Information"
        description="Manage your contact details"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Contact Information' }]}
      />

      <Form<Partial<ContactInfo>>
        layout="vertical"
        onFinish={(values) => mutation.mutate(values)}
        initialValues={{
          email: contact?.email,
          phone: contact?.phone,
          location: contact?.location,
          working_hours: contact?.working_hours,
          google_map_embed_url: contact?.google_map_embed_url,
        }}
        style={{ maxWidth: 512 }}
      >
        <Card size="small" style={{ marginBottom: 16 }} styles={{ body: { padding: 24 } }}>
          <Typography.Title level={5} style={{ marginTop: 0 }}>
            Contact Details
          </Typography.Title>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Email is required' },
                  { type: 'email', message: 'Enter a valid email' },
                ]}
              >
                <Input placeholder="you@example.com" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="phone" label="Phone">
                <Input placeholder="+1 234 567 890" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="location" label="Location">
                <Input placeholder="City, Country" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="working_hours" label="Working Hours">
                <Input placeholder="Mon-Fri 9AM-5PM" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="google_map_embed_url" label="Google Map Embed URL">
            <Input.TextArea rows={3} placeholder="Paste your Google Maps embed URL" />
          </Form.Item>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div>
              <Typography.Text>Published</Typography.Text>
              <Typography.Paragraph type="secondary" style={{ marginBottom: 0, fontSize: 12 }}>
                Show this section on the public site
              </Typography.Paragraph>
            </div>
            <Switch
              checked={contact?.is_published ?? true}
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
