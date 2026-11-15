import { Breadcrumb as AntdBreadcrumb } from 'antd'
import { Link } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <AntdBreadcrumb
      items={items.map((item) => ({
        title: item.href ? <Link to={item.href}>{item.label}</Link> : item.label,
      }))}
    />
  )
}
