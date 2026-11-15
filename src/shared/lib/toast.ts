/**
 * Ant Design message facade — sonner-compatible API so existing call sites
 * (`toast.success(...)`, `toast.error(...)`) keep working while rendering
 * through Ant Design's themed Message system.
 */
import type { MessageInstance } from 'antd/es/message/interface'

let messageApi: MessageInstance | null = null

export function bindMessageApi(api: MessageInstance) {
  messageApi = api
}

type ToastContent = string
type ToastOptions = number | { duration?: number }

function resolveDuration(options?: ToastOptions): number | undefined {
  if (options === undefined) return undefined
  if (typeof options === 'number') return options
  return options.duration
}

export const toast = {
  success(content: ToastContent, options?: ToastOptions) {
    messageApi?.success(content, resolveDuration(options))
  },
  error(content: ToastContent, options?: ToastOptions) {
    messageApi?.error(content, resolveDuration(options))
  },
  info(content: ToastContent, options?: ToastOptions) {
    messageApi?.info(content, resolveDuration(options))
  },
  warning(content: ToastContent, options?: ToastOptions) {
    messageApi?.warning(content, resolveDuration(options))
  },
  loading(content: ToastContent, options?: ToastOptions) {
    messageApi?.loading(content, resolveDuration(options))
  },
}
