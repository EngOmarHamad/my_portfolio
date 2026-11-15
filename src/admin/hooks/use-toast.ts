import { useState } from 'react'

type Toast = {
  id: string
  title: string
  description: string
  action?: React.ReactNode
}

type UseToastReturn = {
  toast: (props: Omit<Toast, 'id'>) => string
  dismiss: (id: string) => void
}

export function useToast(): UseToastReturn {
  const [, setToasts] = useState<Toast[]>([])

  const toast = (props: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = { id, ...props }
    setToasts((prev) => [...prev, newToast])
    return id
  }

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return { toast, dismiss }
}