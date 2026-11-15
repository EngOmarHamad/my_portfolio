import { useEffect } from 'react'
import { ThemeProvider } from '@/shared/theme'
import { AdminRouter } from '@/admin/AdminRouter'

/** Admin shell: opts the document into the admin palette and the antd theme. */
export function AdminApp() {
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('admin')
    return () => root.classList.remove('admin')
  }, [])

  return (
    <ThemeProvider>
      <AdminRouter />
    </ThemeProvider>
  )
}
