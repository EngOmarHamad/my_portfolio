interface LoadingSkeletonProps {
  rows?: number
  cols?: number
}

export function LoadingSkeleton({ rows = 3, cols = 4 }: LoadingSkeletonProps) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={j}
              className="h-10 bg-[var(--color-surface-hover)] rounded-lg flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-[var(--color-border)] p-6 space-y-4">
      <div className="h-5 w-2/3 bg-[var(--color-surface-hover)] rounded" />
      <div className="h-4 w-1/2 bg-[var(--color-surface-hover)] rounded" />
      <div className="space-y-2">
        <div className="h-3 w-full bg-[var(--color-surface-hover)] rounded" />
        <div className="h-3 w-4/5 bg-[var(--color-surface-hover)] rounded" />
      </div>
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="h-8 w-48 bg-[var(--color-surface-hover)] rounded-lg animate-pulse" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
