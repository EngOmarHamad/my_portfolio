import { useSidebarStore } from '@/admin/stores/sidebar-store'

const sidebarItems = [
  { label: 'Dashboard', path: '/admin', icon: 'LayoutDashboard' },
  { label: 'Hero Section', path: '/admin/hero', icon: 'PanelsTopLeft' },
  { label: 'About', path: '/admin/about', icon: 'User' },
  { label: 'Skills', path: '/admin/skills', icon: 'Code2' },
  { label: 'Projects', path: '/admin/projects', icon: 'FolderKanban' },
  { label: 'Services', path: '/admin/services', icon: 'Briefcase' },
  { label: 'Experience', path: '/admin/experience', icon: 'History' },
  { label: 'Education', path: '/admin/education', icon: 'GraduationCap' },
  { label: 'Certificates', path: '/admin/certificates', icon: 'Award' },
  { label: 'Testimonials', path: '/admin/testimonials', icon: 'Star' },
  { label: 'Achievements', path: '/admin/achievements', icon: 'Trophy' },
  { label: 'Tech Stack', path: '/admin/tech-stack', icon: 'Cpu' },
  { label: 'Timeline', path: '/admin/timeline', icon: 'Timeline' },
  { label: 'Blog', path: '/admin/blog', icon: 'FileText' },
  { label: 'Gallery', path: '/admin/gallery', icon: 'Image' },
  { label: 'Resume', path: '/admin/resume', icon: 'FileDown' },
  { label: 'Contact Info', path: '/admin/contact', icon: 'Mail' },
  { label: 'Social Links', path: '/admin/social-links', icon: 'Share2' },
  { label: 'SEO', path: '/admin/seo', icon: 'Search' },
  { label: 'Settings', path: '/admin/settings', icon: 'Settings' },
  { label: 'Data Viewer', path: '/admin/data', icon: 'Database' },
]

export function useSidebar() {
  const store = useSidebarStore()
  return { ...store, items: sidebarItems }
}
