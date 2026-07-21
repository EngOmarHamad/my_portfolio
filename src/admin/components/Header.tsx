import { LogOut, User as UserIcon, Menu } from 'lucide-react'
import { useAuthStore } from '@/admin/stores/auth-store'
import { useSidebarStore } from '@/admin/stores/sidebar-store'
import { authService } from '@/admin/services/auth-service'
import { useNavigate } from 'react-router-dom'

export function Header() {
  const { user } = useAuthStore()
  const { toggle } = useSidebarStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await authService.logout()
    navigate('/admin/login')
  }

  return (
    <header className="sticky top-0 z-30 h-16 bg-[var(--color-surface)]/80 backdrop-blur-xl border-b border-[var(--color-border)]">
      <div className="flex items-center justify-between h-full px-6">
        <button
          onClick={toggle}
          className="p-2 -ml-2 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] transition-colors md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-surface-hover)]">
            <div className="w-7 h-7 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
              <UserIcon className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-[var(--color-text)]">{user?.email}</p>
              <p className="text-[10px] text-[var(--color-text-tertiary)]">Admin</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--color-text-secondary)] hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
