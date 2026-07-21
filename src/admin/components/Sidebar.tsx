import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, PanelsTopLeft, User, Code2, FolderKanban, Briefcase,
  History, GraduationCap, Award, Star, Trophy, Cpu, Timeline, FileText,
  Image, FileDown, Mail, Share2, Search, Settings, ChevronLeft,
  PanelRightClose, PanelRightOpen,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { useSidebar } from '@/admin/hooks/use-sidebar'
import { useMediaQuery } from '@/admin/hooks/use-media-query'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, PanelsTopLeft, User, Code2, FolderKanban, Briefcase,
  History, GraduationCap, Award, Star, Trophy, Cpu, Timeline, FileText,
  Image, FileDown, Mail, Share2, Search, Settings,
}

export function Sidebar() {
  const location = useLocation()
  const { items, isCollapsed, toggleCollapse } = useSidebar()
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-[var(--color-surface)] border-r border-[var(--color-border)] flex flex-col transition-all duration-300',
        isCollapsed && !isMobile ? 'w-16' : 'w-60',
        isMobile && '-translate-x-full'
      )}
    >
      <div className={cn(
        'flex items-center h-16 border-b border-[var(--color-border)] px-4',
        isCollapsed ? 'justify-center' : 'justify-between'
      )}>
        {!isCollapsed && (
          <Link to="/admin" className="font-bold text-lg text-[var(--color-text)]">
            <span className="text-[var(--color-primary)]">P</span>ortfolio
          </Link>
        )}
        {isCollapsed && (
          <Link to="/admin" className="font-bold text-lg text-[var(--color-primary)]">
            P
          </Link>
        )}
        {!isMobile && (
          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-tertiary)] transition-colors"
          >
            {isCollapsed ? <PanelRightOpen className="w-4 h-4" /> : <PanelRightClose className="w-4 h-4" />}
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 scrollbar-thin">
        {items.map((item) => {
          const Icon = iconMap[item.icon]
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]',
                isCollapsed && 'justify-center px-2'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              {Icon && <Icon className="w-4 h-4 shrink-0" />}
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className={cn(
        'border-t border-[var(--color-border)] p-3',
        isCollapsed && 'flex justify-center'
      )}>
        <Link
          to="/"
          className={cn(
            'flex items-center gap-2 text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] transition-colors',
            isCollapsed && 'justify-center'
          )}
        >
          <ChevronLeft className="w-3 h-3" />
          {!isCollapsed && <span>Back to site</span>}
        </Link>
      </div>
    </aside>
  )
}
