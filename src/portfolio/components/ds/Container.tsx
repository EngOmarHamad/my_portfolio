import type { ElementType, ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'

interface ContainerProps {
  as?: ElementType
  className?: string
  children: ReactNode
}

/** 1280px max width, 16/24/32px gutters. Children compose the 12-column grid. */
export function Container({ as: Tag = 'div', className, children }: ContainerProps) {
  return <Tag className={cn('mx-auto w-full max-w-site px-4 sm:px-6 lg:px-8', className)}>{children}</Tag>
}

/** The 12-column grid used inside every section. */
export const grid12 = 'grid grid-cols-4 gap-x-4 sm:grid-cols-8 sm:gap-x-6 lg:grid-cols-12 lg:gap-x-8'
