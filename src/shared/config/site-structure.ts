export interface SiteSection {
  label: string
  adminPath: string
  publicPath?: string
  icon: string
  group: 'overview' | 'portfolio' | 'profile' | 'engagement' | 'system'
  navigation?: boolean
  primaryNavigation?: boolean
}

// A single map connects each editor to the public content it controls.
export const SITE_SECTIONS: SiteSection[] = [
  { label: 'Dashboard', adminPath: '/admin', publicPath: '/', icon: 'LayoutDashboard', group: 'overview' },
  { label: 'Hero Section', adminPath: '/admin/hero', publicPath: '/', icon: 'PanelsTopLeft', group: 'portfolio' },
  { label: 'Projects', adminPath: '/admin/projects', publicPath: '/projects', icon: 'FolderKanban', group: 'portfolio', navigation: true, primaryNavigation: true },
  { label: 'Services', adminPath: '/admin/services', publicPath: '/services', icon: 'Briefcase', group: 'portfolio', navigation: true, primaryNavigation: true },
  { label: 'Gallery', adminPath: '/admin/gallery', publicPath: '/gallery', icon: 'Image', group: 'portfolio', navigation: true },
  { label: 'Skills', adminPath: '/admin/skills', publicPath: '/#skills', icon: 'Code2', group: 'profile', navigation: true, primaryNavigation: true },
  { label: 'About', adminPath: '/admin/about', publicPath: '/#about', icon: 'User', group: 'profile', navigation: true, primaryNavigation: true },
  { label: 'Achievements', adminPath: '/admin/achievements', publicPath: '/#achievements', icon: 'Trophy', group: 'profile' },
  { label: 'Testimonials', adminPath: '/admin/testimonials', publicPath: '/#testimonials', icon: 'Star', group: 'profile' },
  { label: 'Experience', adminPath: '/admin/experience', publicPath: '/#experience', icon: 'History', group: 'profile', navigation: true },
  { label: 'Education', adminPath: '/admin/education', publicPath: '/#education', icon: 'GraduationCap', group: 'profile' },
  { label: 'Certificates', adminPath: '/admin/certificates', publicPath: '/#certificates', icon: 'Award', group: 'profile' },
  { label: 'Timeline', adminPath: '/admin/timeline', publicPath: '/#experience', icon: 'Timeline', group: 'profile' },
  { label: 'Blog', adminPath: '/admin/blog', publicPath: '/blog', icon: 'FileText', group: 'engagement', navigation: true },
  { label: 'Contact Info', adminPath: '/admin/contact', publicPath: '/#contact', icon: 'Mail', group: 'engagement', navigation: true, primaryNavigation: true },
  { label: 'Social Links', adminPath: '/admin/social-links', publicPath: '/#social-links', icon: 'Share2', group: 'engagement' },
  { label: 'Resume', adminPath: '/admin/resume', publicPath: '/cv', icon: 'FileDown', group: 'engagement' },
  { label: 'Messages', adminPath: '/admin/messages', icon: 'MessageSquare', group: 'engagement' },
  { label: 'SEO', adminPath: '/admin/seo', publicPath: '/', icon: 'Search', group: 'system' },
  { label: 'Settings', adminPath: '/admin/settings', icon: 'Settings', group: 'system' },
  { label: 'Data Viewer', adminPath: '/admin/data', icon: 'Database', group: 'system' },
  { label: 'Create CV', adminPath: '/admin/create-cv', icon: 'GraduationCap', group: 'system' },
  { label: 'CV from Database', adminPath: '/admin/cv-from-data', icon: 'FileDown', group: 'system' },
]

export const SECTION_GROUP_LABELS: Record<SiteSection['group'], string> = {
  overview: 'Overview',
  portfolio: 'Work',
  profile: 'Profile',
  engagement: 'Connect',
  system: 'System',
}
