/** Minimal toast queue for the public site (the admin keeps antd's). */
export interface ToastItem {
  id: number
  message: string
}

let items: ToastItem[] = []
export const getToasts = () => items
let nextId = 1
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((listener) => listener())

export function showToast(message: string) {
  items = [...items, { id: nextId++, message }].slice(-3)
  emit()
}

export const dismissToast = (id: number) => {
  items = items.filter((item) => item.id !== id)
  emit()
}

export const subscribeToasts = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
