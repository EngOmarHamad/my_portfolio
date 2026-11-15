import type { NavItem, SocialLink } from '@/shared/types'
import { PUBLIC_NAVIGATION, PRIMARY_NAVIGATION, MORE_NAVIGATION } from '@/shared/config/site-structure'

export const NAV_ITEMS: NavItem[] = PUBLIC_NAVIGATION
export const HEADER_ITEMS: NavItem[] = PRIMARY_NAVIGATION
export const MORE_ITEMS: NavItem[] = MORE_NAVIGATION

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'GitHub', url: 'https://github.com', icon: 'github' },
  { label: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
]

export const HERO_TITLES = [
  'Senior Full Stack Engineer',
  '.NET Architect',
  'React Developer',
  'Mobile Developer',
  'Problem Solver',
]
