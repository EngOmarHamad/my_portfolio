import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { LoadingSkeleton } from './LoadingSkeleton'
import { EmptyState } from './EmptyState'
import { ErrorState } from './ErrorState'

export interface Column<T> {
  key: string
  header: string
  render: (item: T) => ReactNode
  sortable?: boolean
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
  onRetry?: () => void
  emptyMessage?: string
  emptyDescription?: string
  onRowClick?: (item: T) => void
  selectedIds?: string[]
  onSelect?: (id: string) => void
  onSelectAll?: () => void
  keyExtractor: (item: T) => string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSort?: (key: string) => void
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  isLoading,
  isError,
  error,
  onRetry,
  emptyMessage,
  emptyDescription,
  onRowClick,
  selectedIds,
  onSelect,
  onSelectAll,
  keyExtractor,
  sortBy,
  sortOrder,
  onSort,
}: DataTableProps<T>) {
  if (isLoading) {
    return <LoadingSkeleton rows={5} cols={columns.length} />
  }

  if (isError) {
    return <ErrorState message={error?.message} onRetry={onRetry} />
  }

  if (!data.length) {
    return (
      <EmptyState
        title={emptyMessage || 'No data found'}
        description={emptyDescription || 'There are no items to display.'}
      />
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
            {onSelect && onSelectAll && (
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  onChange={onSelectAll}
                  checked={selectedIds?.length === data.length}
                  className="rounded border-[var(--color-border)]"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-text-secondary)]',
                  col.sortable && 'cursor-pointer hover:text-[var(--color-text)]',
                  col.className
                )}
                onClick={() => col.sortable && onSort?.(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && sortBy === col.key && (
                    <span className="text-[10px]">
                      {sortOrder === 'asc' ? '\u2191' : '\u2193'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              className={cn(
                'transition-colors hover:bg-[var(--color-surface-hover)]',
                onRowClick && 'cursor-pointer'
              )}
              onClick={() => onRowClick?.(item)}
            >
              {onSelect && (
                <td className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds?.includes(keyExtractor(item))}
                    onChange={() => onSelect(keyExtractor(item))}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-[var(--color-border)]"
                  />
                </td>
              )}
              {columns.map((col) => (
                <td key={col.key} className={cn('px-4 py-3 text-sm', col.className)}>
                  {col.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
