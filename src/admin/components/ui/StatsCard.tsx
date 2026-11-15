import type { ReactNode } from 'react'
import { ArrowUpOutlined } from '@ant-design/icons'
import { Card, Statistic, Tag, Typography, theme } from 'antd'

interface StatsCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  trend?: {
    value: number
    positive: boolean
  }
  hint?: string
  color?: string
  className?: string
  onClick?: () => void
}

export function StatsCard({ title, value, icon, trend, hint, color, className, onClick }: StatsCardProps) {
  const { token } = theme.useToken()
  const accent = color ?? token.colorPrimary

  return (
    <Card
      className={className}
      hoverable={Boolean(onClick)}
      onClick={onClick}
      styles={{
        body: { padding: 18 },
      }}
      style={{
        height: '100%',
        borderRadius: 14,
        borderColor: token.colorBorderSecondary,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          insetInlineStart: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: accent,
          opacity: 0.9,
        }}
      />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <Typography.Text type="secondary" style={{ fontSize: 12, fontWeight: 500, letterSpacing: '0.02em' }}>
            {title}
          </Typography.Text>
          <Statistic
            value={value}
            valueStyle={{
              fontSize: 28,
              fontWeight: 700,
              color: token.colorText,
              lineHeight: 1.1,
              marginTop: 6,
              letterSpacing: '-0.02em',
            }}
          />
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {trend && (
              <Tag
                color={trend.positive ? 'success' : 'error'}
                bordered={false}
                icon={<ArrowUpOutlined rotate={trend.positive ? 0 : 180} />}
                style={{ marginInlineEnd: 0, borderRadius: 999, fontSize: 11 }}
              >
                {trend.positive ? '+' : ''}
                {trend.value}%
              </Tag>
            )}
            {hint && (
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {hint}
              </Typography.Text>
            )}
          </div>
        </div>
        {icon && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 46,
              height: 46,
              borderRadius: 12,
              background: `color-mix(in srgb, ${accent} 14%, transparent)`,
              color: accent,
              flexShrink: 0,
              fontSize: 20,
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
