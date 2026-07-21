import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5">
          {index > 0 && (
            <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-tertiary)]" />
          )}
          {item.href ? (
            <Link
              to={item.href}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--color-text)] font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
