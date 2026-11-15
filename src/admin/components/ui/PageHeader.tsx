import type { ReactNode } from 'react'
import { Space, Typography } from 'antd'
import type { BreadcrumbItem } from './Breadcrumb'
import { Breadcrumb as AntdBreadcrumb } from './Breadcrumb'

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: ReactNode
  eyebrow?: string
}

export function PageHeader({ title, description, breadcrumbs, actions, eyebrow }: PageHeaderProps) {
  return (
    <div style={{ marginBottom: 28 }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <AntdBreadcrumb items={breadcrumbs} />
        </div>
      )}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div style={{ minWidth: 0 }}>
          {eyebrow && (
            <Typography.Text
              type="secondary"
              style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 6,
              }}
            >
              {eyebrow}
            </Typography.Text>
          )}
          <Typography.Title level={2} style={{ margin: 0, letterSpacing: '-0.02em' }}>
            {title}
          </Typography.Title>
          {description && (
            <Typography.Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0, maxWidth: 720, fontSize: 15 }}>
              {description}
            </Typography.Paragraph>
          )}
        </div>
        {actions && <Space wrap>{actions}</Space>}
      </div>
    </div>
  )
}
