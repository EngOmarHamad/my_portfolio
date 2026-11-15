import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Card, Col, Form, Input, Row, Select, Switch, Typography } from 'antd'
import { createBaseService } from '@/admin/services/supabase-service'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import { toast } from '@/shared/lib/toast'
import { supabase } from '@/admin/lib/supabase'
import type { Settings } from '@/admin/types'

const settingsService = createBaseService<Settings>('settings')

interface PasswordValues {
  currentPassword: string
  newPassword: string
}

export function SettingsPage() {
  const queryClient = useQueryClient()
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordForm] = Form.useForm<PasswordValues>()

  const handleChangePassword = async (values: PasswordValues) => {
    if (values.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }
    setIsChangingPassword(true)
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email || '',
        password: values.currentPassword,
      })
      if (signInError) throw new Error('Current password is incorrect')
      const { error: updateError } = await supabase.auth.updateUser({ password: values.newPassword })
      if (updateError) throw updateError
      toast.success('Password changed successfully')
      passwordForm.resetFields()
      setShowPasswordSection(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to change password')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await settingsService.list({ pageSize: 1 })
      return data[0]
    },
  })

  const mutation = useMutation({
    mutationFn: (values: Partial<Settings>) =>
      settings ? settingsService.update(settings.id, values) : settingsService.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
      toast.success('Settings updated')
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Failed to update'),
  })

  if (isLoading) return <PageSkeleton />

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage website settings"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Settings' }]}
      />

      <Form<Partial<Settings>>
        layout="vertical"
        onFinish={(values) => mutation.mutate(values)}
        initialValues={{
          theme: settings?.theme || 'system',
          website_status: settings?.website_status || 'online',
          google_analytics_id: settings?.google_analytics_id,
          google_search_console_id: settings?.google_search_console_id,
          custom_head_scripts: settings?.custom_head_scripts,
          custom_body_scripts: settings?.custom_body_scripts,
        }}
        style={{ maxWidth: 768 }}
      >
        <Card size="small" style={{ marginBottom: 16 }} styles={{ body: { padding: 24 } }}>
          <Typography.Title level={5} style={{ marginTop: 0 }}>
            General
          </Typography.Title>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="theme" label="Theme">
                <Select
                  options={[
                    { value: 'system', label: 'System' },
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="website_status" label="Website Status">
                <Select
                  options={[
                    { value: 'online', label: 'Online' },
                    { value: 'maintenance', label: 'Maintenance' },
                    { value: 'offline', label: 'Offline' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <Typography.Text>Maintenance Mode</Typography.Text>
              <Typography.Paragraph type="secondary" style={{ marginBottom: 0, fontSize: 12 }}>
                Temporarily disable the public site
              </Typography.Paragraph>
            </div>
            <Switch
              checked={settings?.maintenance_mode ?? false}
              onChange={(checked) => mutation.mutate({ maintenance_mode: checked })}
              loading={mutation.isPending}
            />
          </div>
        </Card>

        <Card size="small" style={{ marginBottom: 16 }} styles={{ body: { padding: 24 } }}>
          <Typography.Title level={5} style={{ marginTop: 0 }}>
            Analytics
          </Typography.Title>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="google_analytics_id" label="Google Analytics ID">
                <Input placeholder="G-XXXXXXXXXX" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="google_search_console_id" label="Google Search Console ID">
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card size="small" style={{ marginBottom: 16 }} styles={{ body: { padding: 24 } }}>
          <Typography.Title level={5} style={{ marginTop: 0 }}>
            Custom Scripts
          </Typography.Title>
          <Form.Item name="custom_head_scripts" label="Head Scripts">
            <Input.TextArea rows={4} placeholder="<script>...</script>" />
          </Form.Item>
          <Form.Item name="custom_body_scripts" label="Body Scripts" style={{ marginBottom: 0 }}>
            <Input.TextArea rows={4} placeholder="<script>...</script>" />
          </Form.Item>
        </Card>

        <Card
          size="small"
          style={{ marginBottom: 16 }}
          styles={{ body: { padding: 24 } }}
          title={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Password</span>
              <Button type="link" size="small" onClick={() => setShowPasswordSection((v) => !v)} style={{ paddingInline: 0 }}>
                {showPasswordSection ? 'Cancel' : 'Change password'}
              </Button>
            </div>
          }
        >
          {showPasswordSection && (
            <Form<PasswordValues> form={passwordForm} layout="vertical" onFinish={handleChangePassword}>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="currentPassword"
                    label="Current password"
                    rules={[{ required: true, message: 'Current password is required' }]}
                  >
                    <Input.Password placeholder="Enter current password" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="newPassword"
                    label="New password"
                    rules={[
                      { required: true, message: 'New password is required' },
                      { min: 6, message: 'Password must be at least 6 characters' },
                    ]}
                  >
                    <Input.Password placeholder="Enter new password" />
                  </Form.Item>
                </Col>
              </Row>
              <Button type="primary" htmlType="submit" loading={isChangingPassword}>
                Update password
              </Button>
            </Form>
          )}
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
