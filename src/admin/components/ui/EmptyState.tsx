import { Inbox } from 'lucide-react'

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
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="p-4 rounded-2xl bg-[var(--color-surface-hover)] mb-4">
        <Inbox className="w-10 h-10 text-[var(--color-text-tertiary)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-text)]">{title}</h3>
      <p className="mt-1 text-sm text-[var(--color-text-secondary)] max-w-sm text-center">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 text-sm font-medium rounded-lg bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-light)] transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
