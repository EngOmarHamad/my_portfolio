import type { CVData } from '@/shared/types/cv-data'
import type { CVEntry, CVProfile, CVProfileEntry } from '@/shared/types/cv-library'

const string = (value: unknown): string => typeof value === 'string' ? value : ''
const strings = (value: unknown): string[] => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
const contentText = (entry: CVEntry): string => `${entry.label} ${JSON.stringify(entry.content)} ${(entry.tags ?? []).join(' ')}`.toLocaleLowerCase()

export function suggestedSelection(entries: CVEntry[], profile: CVProfile, overrides: CVProfileEntry[] = []): Set<string> {
  const selected = new Set<string>()
  const overrideMap = new Map(overrides.map((entry) => [entry.entry_id, entry.included]))
  const keywords = profile.keywords.map((keyword) => keyword.trim().toLocaleLowerCase()).filter(Boolean)

  for (const entry of entries) {
    const alwaysIncluded = ['identity', 'education', 'languages', 'socialLinks'].includes(entry.kind)
    const matches = keywords.length > 0 && keywords.some((keyword) => contentText(entry).includes(keyword))
    if (overrideMap.get(entry.id) ?? (alwaysIncluded || matches)) selected.add(entry.id)
  }
  return selected
}

export function buildCVData(entries: CVEntry[], profile?: CVProfile, selectedIds?: Set<string>): CVData {
  const included = entries.filter((entry) => !selectedIds || selectedIds.has(entry.id) || entry.kind === 'identity')
  const byKind = (kind: CVEntry['kind']) => included.filter((entry) => entry.kind === kind).sort((a, b) => a.display_order - b.display_order)
  const identity = byKind('identity')[0]?.content ?? {}

  // Group skills by category for unified table + clean CV display
  const rawSkills = byKind('skills').map(({ content }) => ({
    category: string(content.category) || 'Skills',
    tech: string(content.name),
    level: string(content.level),
  })).filter((s) => s.tech)
  const groupedSkills = new Map<string, { technologies: string[]; level: string }>()
  for (const s of rawSkills) {
    const existing = groupedSkills.get(s.category)
    if (!existing) groupedSkills.set(s.category, { technologies: [s.tech], level: s.level })
    else {
      if (!existing.technologies.includes(s.tech)) existing.technologies.push(s.tech)
      // keep first level, or upgrade to Expert if any is Expert
      if (s.level === 'Expert') existing.level = 'Expert'
    }
  }
  const skillsGrouped = Array.from(groupedSkills.entries()).map(([category, v]) => ({
    category,
    technologies: v.technologies,
    level: v.level,
  }))

  return {
    name: string(identity.fullName),
    title: profile?.title || string(identity.title),
    email: string(identity.email),
    phone: string(identity.phone),
    location: string(identity.location),
    website: string(identity.website),
    summary: profile?.summary || string(identity.summary),
    skills: skillsGrouped,
    experience: byKind('experience').map(({ content }) => ({
      year: [string(content.start_date), string(content.end_date)].filter(Boolean).join(' – '),
      title: string(content.position),
      subtitle: string(content.organization),
      description: string(content.description),
      highlights: Array.isArray(content.highlights)
        ? content.highlights.map((item) => typeof item === 'object' && item !== null ? string((item as Record<string, unknown>).text) : string(item)).filter(Boolean)
        : [],
    })),
    education: byKind('education').map(({ content }) => ({
      year: [string(content.start_date), string(content.end_date)].filter(Boolean).join(' – '),
      title: string(content.degree),
      institution: string(content.institution),
      description: string(content.description),
      gpa: string(content.gpa),
    })),
    certifications: byKind('certifications').map(({ content }) => ({
      year: string(content.issue_date),
      title: string(content.title),
      issuer: string(content.issuer),
      description: string(content.description),
      type: string(content.type),
      status: string(content.status),
      level: string(content.level),
      duration: string(content.duration),
      skills: strings(content.skills),
      credentialUrl: string(content.credential_url),
    })),
    projects: byKind('projects').map(({ content }) => ({
      title: string(content.name),
      summary: string(content.description),
      technologies: strings(content.technologies),
      link: string(content.link),
    })),
    languages: byKind('languages').map(({ content }) => ({ language: string(content.language), level: string(content.level) })),
    socialLinks: byKind('socialLinks').map(({ content }) => ({ label: string(content.platform), url: string(content.url) })),
    achievements: byKind('achievements').map(({ content }) => ({ title: string(content.title), description: string(content.description), date: string(content.date) })),
    references: byKind('references').map(({ content }) => ({
      name: string(content.name),
      position: string(content.position),
      organization: string(content.organization),
      relationship: string(content.relationship),
      email: string(content.email),
      phone: string(content.phone),
    })),
  }
}
