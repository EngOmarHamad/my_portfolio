/**
 * View models for the public site. CMS rows (Supabase) and the static fallback
 * in `content.ts` are both normalised into these shapes, so components never
 * depend on database column names.
 */

export type SocialPlatform = 'github' | 'linkedin' | 'x' | 'youtube' | 'instagram' | 'facebook' | 'medium' | 'dev' | 'other'

export interface SocialLinkVM {
  id: string
  platform: SocialPlatform
  label: string
  url: string
}

export type StatKey = 'years' | 'projects' | 'roles' | 'grade'

export interface StatVM {
  id: string
  /** Numeric part animated by the counter. */
  value: number
  /** Decimal places shown by the counter. */
  decimals: number
  prefix: string
  suffix: string
  /** Built-in statistic, labelled through i18n. */
  key?: StatKey
  /** Free-text label from the CMS (hero.statistics). */
  label?: string
}

export interface ProfileVM {
  name: string
  title: string
  location: string
  /** Approximate coordinates shown as a mono micro-detail. */
  coordinates: string
  /** IANA zone used by the live clock. */
  timeZone: string
  email: string
  phone: string
  availability: string
  isAvailable: boolean
  biography: string
  portrait: { avif: string[]; webp: string[]; fallback: string; alt: string; isPlaceholder: boolean }
  resumeUrl: string
  /** True when the resume is the external CMS file rather than the generated /cv page. */
  resumeIsFile: boolean
  languages: string[]
  interests: string[]
  workingHours: string
}

export type SkillGroupId = 'backend' | 'frontend' | 'data' | 'devops' | 'architecture'

export interface SkillVM {
  id: string
  name: string
  group: SkillGroupId
  /** simple-icons slug (`si*` export name) when a real logo exists. */
  icon?: string
}

export interface SkillGroupVM {
  id: SkillGroupId
  skills: SkillVM[]
}

export interface ArchitectureNodeVM {
  id: string
  label: string
  /** Column in the layered diagram, left (client) to right (data). */
  layer: 0 | 1 | 2 | 3
  /** Row inside the column. */
  row: number
  technologies: string[]
}

export interface ArchitectureEdgeVM {
  from: string
  to: string
}

export interface ProjectLinkVM {
  kind: 'live' | 'video' | 'source'
  url: string
}

export interface ProjectVM {
  id: string
  /** Route segment used by /projects/:id. */
  routeId: string
  title: string
  category: string
  summary: string
  problem: string
  approach: string
  caseStudy: string
  features: string[]
  technologies: string[]
  cover: string | null
  gallery: string[]
  links: ProjectLinkVM[]
  year: string
  featured: boolean
}

export interface ExperienceVM {
  id: string
  role: string
  organization: string
  start: string
  end: string
  isCurrent: boolean
  summary: string
  highlights: string[]
}

export interface EducationVM {
  id: string
  degree: string
  institution: string
  start: string
  end: string
  grade: string
  summary: string
}

export interface CertificateVM {
  id: string
  title: string
  issuer: string
  date: string
  url: string
  summary: string
}

export interface AchievementVM {
  id: string
  title: string
  date: string
  summary: string
}

export interface TestimonialVM {
  id: string
  quote: string
  author: string
  company: string
}

export interface SiteContent {
  profile: ProfileVM
  socials: SocialLinkVM[]
  stats: StatVM[]
  skills: SkillVM[]
  architecture: { nodes: ArchitectureNodeVM[]; edges: ArchitectureEdgeVM[] }
  projects: ProjectVM[]
  experience: ExperienceVM[]
  education: EducationVM[]
  certificates: CertificateVM[]
  achievements: AchievementVM[]
  testimonials: TestimonialVM[]
}
