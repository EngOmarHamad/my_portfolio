/**
 * Pure mappers from CMS rows to view models. Every mapper tolerates partial rows
 * (older schemas, empty columns) and returns `null`/`[]` so callers can fall
 * back to the static content.
 */
import type {
  Achievement,
  About,
  Certificate,
  ContactInfo,
  Education,
  Experience,
  Hero,
  Project,
  Resume,
  SocialLink,
  TechStackItem,
  Testimonial,
  TimelineItem,
} from '@/admin/types'
import type {
  AchievementVM,
  CertificateVM,
  EducationVM,
  ExperienceVM,
  ProfileVM,
  ProjectLinkVM,
  ProjectVM,
  SkillGroupId,
  SkillVM,
  SocialLinkVM,
  SocialPlatform,
  StatVM,
  TestimonialVM,
} from './types'

const text = (value: unknown): string => (typeof value === 'string' ? value.trim() : '')
const list = (value: unknown): string[] =>
  Array.isArray(value) ? value.map(text).filter(Boolean) : []

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** "2024-05-01" | "2024-05" → "2024-05"; anything else → "". */
const month = (value: unknown): string => {
  const match = /^(\d{4})-(\d{2})/.exec(text(value))
  return match ? `${match[1]}-${match[2]}` : /^\d{4}$/.test(text(value)) ? `${text(value)}-01` : ''
}

/* ------------------------------------------------------------------ profile */

export function mergeProfile(
  base: ProfileVM,
  hero?: Partial<Hero> | null,
  about?: Partial<About> | null,
  contact?: Partial<ContactInfo> | null,
  resume?: Partial<Resume> | null,
): ProfileVM {
  const avatar = text(about?.profile_image_url) || text(hero?.avatar_url)
  const resumeFile = text(resume?.file_url) || text(hero?.resume_button_url)
  return {
    ...base,
    name: text(hero?.name) || base.name,
    title: text(hero?.title) || base.title,
    location: text(contact?.location) || text(hero?.location) || base.location,
    email: text(contact?.email) || text(about?.personal_info?.email) || base.email,
    phone: text(contact?.phone) || base.phone,
    availability: text(hero?.availability) || base.availability,
    biography: text(about?.biography) || base.biography,
    workingHours: text(contact?.working_hours) || base.workingHours,
    languages: list(about?.languages).length ? list(about?.languages) : base.languages,
    interests: list(about?.interests).length ? list(about?.interests) : base.interests,
    resumeUrl: resumeFile || base.resumeUrl,
    resumeIsFile: Boolean(resumeFile) || base.resumeIsFile,
    // A CMS avatar replaces the optimised local portrait only when it is set.
    portrait: avatar
      ? { avif: [], webp: [], fallback: avatar, alt: base.portrait.alt, isPlaceholder: false }
      : base.portrait,
  }
}

/* ------------------------------------------------------------------ socials */

const PLATFORM_ALIASES: Record<string, SocialPlatform> = {
  github: 'github',
  linkedin: 'linkedin',
  twitter: 'x',
  'twitter-x': 'x',
  x: 'x',
  youtube: 'youtube',
  instagram: 'instagram',
  facebook: 'facebook',
  medium: 'medium',
  dev: 'dev',
}

export function mapSocials(rows: Partial<SocialLink>[] | undefined): SocialLinkVM[] {
  return (rows ?? [])
    .filter((row) => text(row.url))
    .map((row, index) => {
      const key = (text(row.platform) || text(row.icon)).toLowerCase()
      return {
        id: text(row.id) || `${key}-${index}`,
        platform: PLATFORM_ALIASES[key] ?? 'other',
        label: text(row.label) || text(row.platform) || 'Link',
        url: text(row.url),
      }
    })
}

/* ------------------------------------------------------------------- skills */

export function groupForCategory(category: string): SkillGroupId {
  const value = category.toLowerCase()
  if (/front|ui|web design/.test(value)) return 'frontend'
  if (/data|sql|storage/.test(value)) return 'data'
  if (/devops|cloud|tool|infra|deploy/.test(value)) return 'devops'
  if (/architect|engineering|practice|method|soft/.test(value)) return 'architecture'
  return 'backend'
}

/** Logos available in simple-icons for technologies on the CV. */
const ICONS: Record<string, string> = {
  'asp.net core': 'siDotnet',
  'asp.net core web api': 'siDotnet',
  '.net': 'siDotnet',
  '.net 10': 'siDotnet',
  'jwt authentication': 'siJsonwebtokens',
  jwt: 'siJsonwebtokens',
  react: 'siReact',
  'react.js': 'siReact',
  typescript: 'siTypescript',
  javascript: 'siJavascript',
  'tailwind css': 'siTailwindcss',
  bootstrap: 'siBootstrap',
  html5: 'siHtml5',
  html: 'siHtml5',
  css3: 'siCss',
  css: 'siCss',
  postgresql: 'siPostgresql',
  docker: 'siDocker',
  git: 'siGit',
  github: 'siGithub',
  'swagger / openapi': 'siSwagger',
  swagger: 'siSwagger',
  postman: 'siPostman',
}

export const iconForSkill = (name: string): string | undefined => ICONS[name.trim().toLowerCase()]

export function mapSkills(rows: Partial<TechStackItem>[] | undefined): SkillVM[] {
  const seen = new Set<string>()
  return (rows ?? []).flatMap((row) => {
    const name = text(row.name)
    const key = name.toLowerCase()
    if (!name || seen.has(key)) return []
    seen.add(key)
    return [{ id: text(row.id) || slugify(name), name, group: groupForCategory(text(row.category)), icon: iconForSkill(name) }]
  })
}

/* ----------------------------------------------------------------- projects */

const isVideo = (url: string) => /youtu\.?be|vimeo\.com/.test(url)

export function mapProjects(rows: Partial<Project>[] | undefined): ProjectVM[] {
  return (rows ?? [])
    .filter((row) => text(row.title))
    .map((row) => {
      const title = text(row.title)
      const links: ProjectLinkVM[] = []
      const live = text(row.live_demo_url)
      if (live) links.push({ kind: isVideo(live) ? 'video' : 'live', url: live })
      if (text(row.github_url)) links.push({ kind: 'source', url: text(row.github_url) })
      const technologies = list(row.tech_stack).length
        ? list(row.tech_stack)
        : list((row as { technologies?: unknown }).technologies)
      return {
        id: text(row.id) || slugify(title),
        routeId: text(row.id) || slugify(title),
        title,
        category: text(row.category),
        summary: text(row.description),
        problem: text(row.challenges),
        approach: text(row.solutions) || text(row.long_description),
        caseStudy: text(row.case_study),
        features: list(row.features),
        technologies,
        cover: text(row.thumbnail_url) || null,
        gallery: (row.images ?? []).map((image) => text(image.url)).filter(Boolean),
        links,
        year: text(row.completion_date).slice(0, 4),
        featured: Boolean(row.is_featured),
      }
    })
}

/* --------------------------------------------------------------- experience */

export function mapExperience(rows: Partial<Experience>[] | undefined): ExperienceVM[] {
  return (rows ?? [])
    .filter((row) => text(row.position) || text(row.company))
    .map((row) => ({
      id: text(row.id) || slugify(`${row.company}-${row.position}`),
      role: text(row.position),
      organization: text(row.company),
      start: month(row.start_date),
      end: month(row.end_date),
      isCurrent: Boolean(row.is_current) || !text(row.end_date),
      summary: text(row.description),
      highlights: [],
    }))
}

export function mapTimelineExperience(rows: Partial<TimelineItem>[] | undefined): ExperienceVM[] {
  return (rows ?? [])
    .filter((row) => row.type === 'experience' && text(row.title))
    .map((row) => ({
      id: text(row.id) || slugify(text(row.title)),
      role: text(row.title),
      organization: text(row.subtitle),
      start: month(row.start_date) || month(row.year),
      end: month(row.end_date),
      isCurrent: !text(row.end_date),
      summary: text(row.description),
      highlights: [],
    }))
}

export function mapEducation(rows: Partial<Education>[] | undefined): EducationVM[] {
  return (rows ?? [])
    .filter((row) => text(row.degree) || text(row.university))
    .map((row) => ({
      id: text(row.id) || slugify(`${row.university}-${row.degree}`),
      degree: [text(row.degree), text(row.department)].filter(Boolean).join(' · '),
      institution: text(row.university),
      start: month(row.start_date),
      end: month(row.end_date),
      grade: typeof row.gpa === 'number' ? String(row.gpa) : text(row.gpa),
      summary: text(row.description),
    }))
}

export function mapCertificates(rows: Partial<Certificate>[] | undefined): CertificateVM[] {
  return (rows ?? [])
    .filter((row) => text(row.title))
    .map((row) => ({
      id: text(row.id) || slugify(text(row.title)),
      title: text(row.title),
      issuer: text(row.issuer),
      date: text(row.issue_date),
      url: text(row.credential_url),
      summary: '',
    }))
}

export function mapAchievements(rows: Partial<Achievement>[] | undefined): AchievementVM[] {
  return (rows ?? [])
    .filter((row) => text(row.title))
    .map((row) => ({
      id: text(row.id) || slugify(text(row.title)),
      title: text(row.title),
      date: text(row.date),
      summary: text(row.description),
    }))
}

export function mapTestimonials(rows: Partial<Testimonial>[] | undefined): TestimonialVM[] {
  return (rows ?? [])
    .filter((row) => text(row.review) && text(row.client_name))
    .map((row) => ({
      id: text(row.id) || slugify(text(row.client_name)),
      quote: text(row.review),
      author: text(row.client_name),
      company: text(row.company),
    }))
}

/* -------------------------------------------------------------------- stats */

/** Parses CMS statistics like "12+", "3 yrs", "89.86%" into counter parts. */
export function mapHeroStatistics(rows: unknown): StatVM[] {
  if (!Array.isArray(rows)) return []
  return rows.flatMap((row, index) => {
    const raw = text((row as { value?: unknown }).value)
    const label = text((row as { label?: unknown }).label)
    const match = /^(\D*)(\d+(?:\.\d+)?)(.*)$/.exec(raw)
    if (!match || !label) return []
    const decimals = match[2].includes('.') ? match[2].split('.')[1].length : 0
    return [{ id: `cms-${index}`, value: Number(match[2]), decimals, prefix: match[1], suffix: match[3], label }]
  })
}

/** Statistics derived only from real records — nothing is estimated. */
export function deriveStats(
  experience: ExperienceVM[],
  projects: ProjectVM[],
  education: EducationVM[],
  now = new Date(),
): StatVM[] {
  const stats: StatVM[] = []
  const starts = experience.map((item) => item.start).filter(Boolean).sort()
  if (starts[0]) {
    const [year, mon] = starts[0].split('-').map(Number)
    const years = Math.floor((now.getFullYear() * 12 + now.getMonth() - (year * 12 + mon - 1)) / 12)
    if (years > 0) stats.push({ id: 'years', key: 'years', value: years, decimals: 0, prefix: '', suffix: '+' })
  }
  if (projects.length) stats.push({ id: 'projects', key: 'projects', value: projects.length, decimals: 0, prefix: '', suffix: '' })
  if (experience.length) stats.push({ id: 'roles', key: 'roles', value: experience.length, decimals: 0, prefix: '', suffix: '' })
  const grade = /(\d+(?:\.\d+)?)\s*%/.exec(education[0]?.grade ?? '')
  if (grade) {
    const decimals = grade[1].includes('.') ? grade[1].split('.')[1].length : 0
    stats.push({ id: 'grade', key: 'grade', value: Number(grade[1]), decimals, prefix: '', suffix: '%' })
  }
  return stats
}
