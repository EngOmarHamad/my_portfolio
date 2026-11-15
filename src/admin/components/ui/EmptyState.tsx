import { Button, Empty, Typography } from 'antd'
import { InboxOutlined } from '@ant-design/icons'

interface EmptyStateProps {
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  title = 'Nothing here yet',
  description = 'Get started by creating your first item.',
  action,
}: EmptyStateProps) {
  return (
    <Empty
      image={<InboxOutlined style={{ fontSize: 56 }} />}
      styles={{ image: { height: 72 } }}
      description={
        <div>
          <Typography.Text strong style={{ display: 'block', fontSize: 15 }}>
            {title}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            {description}
          </Typography.Text>
        </div>
      }
      style={{ padding: '32px 16px' }}
    >
      {action && (
        <Button type="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Empty>
  )
}
