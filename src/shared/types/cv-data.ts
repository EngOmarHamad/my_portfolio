export interface CVData {
  name: string
  title: string
  email: string
  location: string
  phone: string
  website: string
  summary: string
  skills: { category: string; technologies: string[]; level?: string }[]
  experience: { year: string; title: string; subtitle: string; description: string; highlights: string[] }[]
  projects: { title: string; summary: string; technologies: string[]; link?: string }[]
  education: { year: string; title: string; institution: string; description: string; gpa?: string }[]
  certifications: {
    year: string
    title: string
    issuer: string
    description?: string
    type?: string
    status?: string
    level?: string
    duration?: string
    skills?: string[]
    credentialUrl?: string
  }[]
  languages: { language: string; level: string }[]
  socialLinks: { label: string; url: string }[]
  achievements: { title: string; description: string; date?: string }[]
  references: { name: string; position: string; organization?: string; relationship?: string; email?: string; phone?: string }[]
}
