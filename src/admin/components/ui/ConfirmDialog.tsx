import { Modal } from 'antd'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning'
  isLoading?: boolean
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onConfirm}
      okText={confirmText}
      cancelText={cancelText}
      okButtonProps={{ danger: variant === 'danger', loading: isLoading }}
      confirmLoading={isLoading}
      title={title}
      width={440}
    >
      <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>{message}</p>
    </Modal>
  )
}
