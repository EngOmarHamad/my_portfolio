import { Skeleton, Spin } from 'antd'

interface LoadingSkeletonProps {
  rows?: number
  cols?: number
}

export function LoadingSkeleton({ rows = 3, cols: _cols = 4 }: LoadingSkeletonProps) {
  return (
    <div style={{ padding: '8px 4px' }}>
      <Skeleton active paragraph={{ rows }} title={{ width: '35%' }} />
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 40,
        border: '1px solid var(--color-border)',
        borderRadius: 8,
        background: 'var(--color-surface)',
      }}
    >
      <Spin />
      <span style={{ color: 'var(--color-text-tertiary)', fontSize: 13 }}>Loading...</span>
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '72px 24px' }}>
      <Spin size="large" />
      <span style={{ color: 'var(--color-text-tertiary)', fontSize: 13 }}>Loading...</span>
    </div>
  )
}
