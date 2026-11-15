import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, Card, Divider, Form, Input, Typography } from 'antd'
import { LockOutlined, MailOutlined, LoginOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons'
import { authService } from '@/admin/services/auth-service'
import { useAuthStore } from '@/admin/stores/auth-store'
import { toast } from '@/shared/lib/toast'

const DEMO_EMAIL = 'omar.mohammad.hamad2003@gmail.com'
const DEMO_PASSWORD = 'Omar@2003'

interface LoginValues {
  email: string
  password: string
}

export function LoginPage() {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedField, setCopiedField] = useState<'email' | 'password' | null>(null)
  const [form] = Form.useForm<LoginValues>()
  const navigate = useNavigate()
  const { setUser } = useAuthStore()

  const fillDemoAccount = () => {
    form.setFieldsValue({ email: DEMO_EMAIL, password: DEMO_PASSWORD })
  }

  const copyToClipboard = async (value: string, field: 'email' | 'password') => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedField(field)
      toast.success('Copied to clipboard')
      setTimeout(() => setCopiedField(null), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }

  const handleSubmit = async (values: LoginValues) => {
    setError('')
    setIsLoading(true)
    try {
      const user = await authService.login(values.email, values.password)
      setUser(user)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        background: 'var(--color-bg)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 10,
              background: 'var(--color-primary)',
              color: '#fff',
              marginBottom: 16,
            }}
          >
            <LockOutlined style={{ fontSize: 22 }} />
          </div>
          <Typography.Title level={3} style={{ marginBottom: 4 }}>
            Admin Login
          </Typography.Title>
          <Typography.Text type="secondary">Sign in to manage your portfolio</Typography.Text>
        </div>

        <Card styles={{ body: { padding: 24 } }}>
          <Form<LoginValues> form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Email is required' },
                { type: 'email', message: 'Enter a valid email' },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="admin@example.com" autoFocus size="large" />
            </Form.Item>

            <Form.Item
              name="password"
              label={
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span>Password</span>
                  <Link to="/admin/reset-password" style={{ fontWeight: 400 }}>
                    Forgot password?
                  </Link>
                </div>
              }
              rules={[{ required: true, message: 'Password is required' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Enter your password" size="large" />
            </Form.Item>

            {error && (
              <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />
            )}

            <Button type="primary" htmlType="submit" block size="large" loading={isLoading} icon={<LoginOutlined />}>
              Sign in
            </Button>
          </Form>
        </Card>

        {import.meta.env.DEV && (
          <Card
            size="small"
            style={{ marginTop: 16 }}
            title={
              <span>
                Demo Account <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>(dev only)</span>
              </span>
            }
          >
            {(
              [
                { label: 'Email', value: DEMO_EMAIL, field: 'email' as const },
                { label: 'Password', value: DEMO_PASSWORD, field: 'password' as const },
              ]
            ).map(({ label, value, field }) => (
              <div
                key={field}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  padding: '6px 10px',
                  borderRadius: 6,
                  border: '1px solid var(--color-border)',
                  marginBottom: 8,
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <Typography.Text type="secondary" style={{ fontSize: 11, display: 'block' }}>
                    {label}
                  </Typography.Text>
                  <Typography.Text style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }} ellipsis>
                    {value}
                  </Typography.Text>
                </div>
                <Button
                  size="small"
                  type="text"
                  icon={copiedField === field ? <CheckOutlined style={{ color: 'var(--color-secondary)' }} /> : <CopyOutlined />}
                  onClick={() => copyToClipboard(value, field)}
                  aria-label={`Copy ${label.toLowerCase()}`}
                />
              </div>
            ))}
            <Divider style={{ margin: '12px 0' }} />
            <Button block type="primary" ghost onClick={fillDemoAccount}>
              Use demo account
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
