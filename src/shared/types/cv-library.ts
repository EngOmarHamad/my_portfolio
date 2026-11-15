export const CV_ENTRY_KINDS = [
  'identity', 'skills', 'experience', 'education', 'certifications',
  'languages', 'socialLinks', 'projects', 'achievements', 'references',
] as const

export type CVEntryKind = (typeof CV_ENTRY_KINDS)[number]

export interface CVEntry {
  id: string
  source_key: string | null
  kind: CVEntryKind
  label: string
  content: Record<string, unknown>
  tags: string[]
  display_order: number
  is_public: boolean
}

export interface CVProfile {
  id: string
  name: string
  slug: string
  title: string
  summary: string
  keywords: string[]
}

export interface CVProfileEntry {
  profile_id: string
  entry_id: string
  included: boolean
}
