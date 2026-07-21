import type { ReactNode } from 'react'

export interface NavItem {
  label: string
  path: string
}

export interface SocialLink {
  label: string
  url: string
  icon: string
}

export interface Project {
  id: string
  title: string
  summary: string
  description: string
  challenge: string
  solution: string
  architecture: string[]
  technologies: string[]
  tags: string[]
  category: string
  image?: string
  githubUrl?: string
  liveUrl?: string
  lessons: string[]
}

export interface Skill {
  icon: string
  title: string
  technologies: string[]
  description: string
}

export interface TimelineItem {
  year: string
  title: string
  subtitle: string
  description: string
  type: 'education' | 'experience' | 'certification' | 'achievement'
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  tags: string[]
  readingTime: number
  date: string
  author: string
  slug: string
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface SectionProps {
  children: ReactNode
  className?: string
  id?: string
}

export interface GlassProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'article'
}
