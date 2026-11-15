import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, Card, Form, Input, Typography } from 'antd'
import { ArrowLeftOutlined, CheckCircleFilled, LockOutlined, MailOutlined } from '@ant-design/icons'
import { supabase } from '@/admin/lib/supabase'

interface ResetPasswordValues {
  email?: string
  password?: string
}

const pageStyle: CSSProperties = {
  minHeight: '100dvh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
  background: 'var(--color-bg)',
}

const brandIconStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 48,
  height: 48,
  borderRadius: 10,
  background: 'var(--color-primary)',
  color: '#fff',
  marginBottom: 16,
}

export function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [isRecovery] = useState(() => window.location.hash.includes('type=recovery'))
  const [done, setDone] = useState(false)
  const navigate = useNavigate()

  const handleSendEmail = async (values: ResetPasswordValues) => {
    setError('')
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email ?? '', {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      })
      if (error) throw error
      setEmail(values.email ?? '')
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetPassword = async (values: ResetPasswordValues) => {
    setError('')
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ password: values.password ?? '' })
      if (error) throw error
      await supabase.auth.signOut()
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set new password')
    } finally {
      setIsLoading(false)
    }
  }

  if (done) {
    return (
      <div style={pageStyle}>
        <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
          <CheckCircleFilled style={{ fontSize: 48, color: 'var(--color-secondary)' }} />
          <Typography.Title level={3} style={{ marginTop: 16, marginBottom: 4 }}>
            Password updated
          </Typography.Title>
          <Typography.Text type="secondary">Sign in with your new password</Typography.Text>
          <div style={{ marginTop: 24 }}>
            <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/login')}>
              Go to login
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (isRecovery) {
    return (
      <div style={pageStyle}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={brandIconStyle}>
              <LockOutlined style={{ fontSize: 22 }} />
            </div>
            <Typography.Title level={3} style={{ marginBottom: 4 }}>
              Set new password
            </Typography.Title>
            <Typography.Text type="secondary">Enter your new password</Typography.Text>
          </div>

          <Card styles={{ body: { padding: 24 } }}>
            <Form<ResetPasswordValues> layout="vertical" onFinish={handleSetPassword} requiredMark={false}>
              <Form.Item
                name="password"
                label="New password"
                rules={[
                  { required: true, message: 'Password is required' },
                  { min: 6, message: 'Password must be at least 6 characters' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter new password (min 6 chars)"
                  autoFocus
                  size="large"
                />
              </Form.Item>

              {error && (
                <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />
              )}

              <Button type="primary" htmlType="submit" block size="large" loading={isLoading} icon={<LockOutlined />}>
                Set new password
              </Button>
            </Form>
          </Card>
        </div>
      </div>
    )
  }

  if (sent) {
    return (
      <div style={pageStyle}>
        <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
          <CheckCircleFilled style={{ fontSize: 48, color: 'var(--color-secondary)' }} />
          <Typography.Title level={3} style={{ marginTop: 16, marginBottom: 4 }}>
            Check your email
          </Typography.Title>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
            We've sent a password reset link to <Typography.Text strong>{email}</Typography.Text>
          </Typography.Paragraph>
          <div style={{ marginTop: 24 }}>
            <Link to="/admin/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <ArrowLeftOutlined style={{ fontSize: 14 }} />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={brandIconStyle}>
            <MailOutlined style={{ fontSize: 22 }} />
          </div>
          <Typography.Title level={3} style={{ marginBottom: 4 }}>
            Reset password
          </Typography.Title>
          <Typography.Text type="secondary">Enter your email to receive a reset link</Typography.Text>
        </div>

        <Card styles={{ body: { padding: 24 } }}>
          <Form<ResetPasswordValues> layout="vertical" onFinish={handleSendEmail} requiredMark={false}>
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

            {error && (
              <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />
            )}

            <Button type="primary" htmlType="submit" block size="large" loading={isLoading}>
              Send reset link
            </Button>

            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Link to="/admin/login">Back to login</Link>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  )
}
