import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ message = 'Something went wrong', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="p-4 rounded-2xl bg-red-500/10 mb-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-text)]">Error</h3>
      <p className="mt-1 text-sm text-[var(--color-text-secondary)] max-w-sm text-center">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 text-sm font-medium rounded-lg border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      )}
    </div>
  )
}
