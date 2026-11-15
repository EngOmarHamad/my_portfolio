import { useState } from 'react'
import { Button, Popconfirm, Tooltip } from 'antd'
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons'

interface DeleteButtonProps {
  onDelete: () => Promise<void>
  title?: string
  message?: string
  variant?: 'danger' | 'warning'
  size?: 'sm' | 'md'
  disabled?: boolean
  tooltip?: string
}

export function DeleteButton({
  onDelete,
  title = 'Delete item',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  variant = 'danger',
  disabled,
  tooltip = 'Delete',
}: DeleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onDelete()
      setOpen(false)
    } catch {
      // Error handled by the caller's mutation
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Popconfirm
      title={title}
      description={message}
      open={open}
      onOpenChange={(next) => setOpen(next)}
      onConfirm={handleConfirm}
      okText="Delete"
      cancelText="Cancel"
      okButtonProps={{ danger: variant === 'danger', loading: isLoading }}
    >
      <Tooltip title={tooltip}>
        <Button
          type="text"
          danger={variant === 'danger'}
          size="small"
          disabled={disabled}
          icon={isLoading ? <LoadingOutlined /> : <DeleteOutlined />}
          aria-label={tooltip}
        />
      </Tooltip>
    </Popconfirm>
  )
}
