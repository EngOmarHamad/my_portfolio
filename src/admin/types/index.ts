// ============================================
// Admin Types
// ============================================

export interface Hero {
  id: string
  name: string
  title: string
  short_description: string
  long_description: string
  avatar_url: string
  background_image_url: string
  resume_button_text: string
  resume_button_url: string
  availability: string
  location: string
  typing_animation_texts: string[]
  statistics: Statistic[]
  cta_buttons: CTAButton[]
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Statistic {
  label: string
  value: string
}

export interface CTAButton {
  label: string
  url: string
  variant: 'primary' | 'secondary' | 'outline'
}

export interface About {
  id: string
  profile_image_url: string
  biography: string
  years_experience: number
  languages: string[]
  interests: string[]
  highlights: Highlight[]
  personal_info: PersonalInfo
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Highlight {
  label: string
  value: string
}

export interface PersonalInfo {
  full_name?: string
  email?: string
  phone?: string
  address?: string
  date_of_birth?: string
  nationality?: string
}

export interface SkillCategory {
  id: string
  name: string
  slug: string
  description: string
  display_order: number
  skills?: Skill[]
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  category_id: string
  title: string
  icon: string
  color: string
  percentage: number
  display_order: number
  is_featured: boolean
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  long_description: string
  thumbnail_url: string
  category: string
  tech_stack: string[]
  tags: string[]
  github_url: string
  live_demo_url: string
  case_study: string
  features: string[]
  challenges: string
  solutions: string
  status: 'draft' | 'published' | 'archived'
  is_featured: boolean
  completion_date: string | null
  display_order: number
  images?: ProjectImage[]
  created_at: string
  updated_at: string
}

export interface ProjectImage {
  id: string
  project_id: string
  url: string
  alt_text: string
  display_order: number
  created_at: string
}

export interface Service {
  id: string
  icon: string
  title: string
  description: string
  price: number | null
  is_featured: boolean
  display_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Experience {
  id: string
  company: string
  position: string
  description: string
  start_date: string
  end_date: string | null
  is_current: boolean
  logo_url: string
  display_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Education {
  id: string
  university: string
  degree: string
  department: string
  description: string
  gpa: number | null
  start_date: string
  end_date: string | null
  display_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Certificate {
  id: string
  title: string
  issuer: string
  issue_date: string | null
  credential_url: string
  certificate_image_url: string
  display_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  client_name: string
  company: string
  image_url: string
  review: string
  rating: number
  display_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  date: string | null
  display_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image_url: string
  tags: string[]
  reading_time: number
  status: 'draft' | 'published' | 'archived'
  meta_title: string
  meta_description: string
  canonical_url: string
  created_at: string
  updated_at: string
}

export interface GalleryCategory {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface GalleryImage {
  id: string
  category_id: string | null
  url: string
  alt_text: string
  is_featured: boolean
  display_order: number
  created_at: string
}

export interface ContactInfo {
  id: string
  email: string
  phone: string
  location: string
  working_hours: string
  google_map_embed_url: string
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

export interface SocialLink {
  id: string
  platform: string
  label: string
  url: string
  icon: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TechStackItem {
  id: string
  name: string
  icon: string
  category: string
  proficiency: number
  display_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface TimelineItem {
  id: string
  year: string
  title: string
  subtitle: string
  description: string
  type: 'education' | 'experience' | 'certification' | 'achievement'
  icon: string
  display_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Resume {
  id: string
  file_url: string
  file_name: string
  file_size: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SEO {
  id: string
  site_title: string
  site_description: string
  keywords: string[]
  og_title: string
  og_description: string
  og_image_url: string
  twitter_card: string
  twitter_handle: string
  favicon_url: string
  robots: string
  canonical_url: string
  created_at: string
  updated_at: string
}

export interface Settings {
  id: string
  theme: string
  website_status: 'online' | 'maintenance' | 'offline'
  maintenance_mode: boolean
  google_analytics_id: string
  google_search_console_id: string
  custom_head_scripts: string
  custom_body_scripts: string
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
}

export interface PaginationState {
  page: number
  pageSize: number
  total: number
}

export interface QueryParams {
  search?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  status?: string
  category?: string
  featured?: boolean
}

export type TableName =
  | 'hero' | 'about' | 'skills' | 'skill_categories'
  | 'projects' | 'project_images' | 'services'
  | 'experience' | 'education' | 'certificates'
  | 'testimonials' | 'achievements' | 'blog_posts'
  | 'gallery_categories' | 'gallery_images'
  | 'contact_info' | 'contact_messages' | 'social_links'
  | 'tech_stack' | 'timeline_items' | 'resume'
  | 'seo' | 'settings'
