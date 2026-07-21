import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { ConfirmDialog } from './ConfirmDialog'

interface DeleteButtonProps {
  onDelete: () => Promise<void>
  title?: string
  message?: string
  variant?: 'danger' | 'warning'
  size?: 'sm' | 'md'
}

export function DeleteButton({
  onDelete,
  title = 'Delete item',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  variant = 'danger',
}: DeleteButtonProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await onDelete()
      setOpen(false)
    } catch {
      // Error handled by caller
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        title={title}
        message={message}
        variant={variant}
        confirmText="Delete"
        isLoading={isLoading}
      />
    </>
  )
}
