import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/admin/components/Sidebar'
import { Header } from '@/admin/components/Header'
import { useAuth, useRequireAuth } from '@/admin/hooks/use-auth'

export function AdminLayout() {
  useAuth()
  const { isAuthenticated, isLoading } = useRequireAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
          <p className="text-sm text-[var(--color-text-tertiary)]">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Sidebar />
      <div className="md:pl-60 transition-all duration-300">
        <Header />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
