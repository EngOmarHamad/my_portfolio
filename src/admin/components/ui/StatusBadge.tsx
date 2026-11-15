import { Tag } from 'antd'

interface StatusBadgeProps {
  status: string
}

/**
 * Consistent status indicator using Ant Design Tag.
 * Colors are semantic: green = live/positive, amber = pending/warning,
 * blue = informational, red = negative, neutral = inactive/archived.
 */
const STATUS_CONFIG: Record<string, { color: string; label?: string }> = {
  published: { color: 'success' },
  draft: { color: 'warning' },
  archived: { color: 'default' },
  active: { color: 'success' },
  inactive: { color: 'default' },
  online: { color: 'success' },
  maintenance: { color: 'warning' },
  offline: { color: 'default' },
  pending: { color: 'warning' },
  approved: { color: 'success' },
  rejected: { color: 'error' },
  read: { color: 'default' },
  unread: { color: 'processing' },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const key = status.toLowerCase()
  const config = STATUS_CONFIG[key] ?? { color: 'default' }
  const label = key.charAt(0).toUpperCase() + key.slice(1)

  return <Tag color={config.color}>{config.label ?? label}</Tag>
}
