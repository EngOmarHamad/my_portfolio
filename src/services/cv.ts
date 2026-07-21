import { portfolioService } from '@/services/portfolio-service'

export interface CVData {
  name: string
  title: string
  email: string
  location: string
  phone: string
  website: string
  summary: string
  skills: { category: string; technologies: string[] }[]
  experience: {
    year: string
    title: string
    subtitle: string
    description: string
    highlights: string[]
  }[]
  projects: {
    title: string
    summary: string
    technologies: string[]
  }[]
  education: { year: string; title: string; institution: string; description: string }[]
  certifications: { year: string; title: string; issuer: string; description: string }[]
  languages: { language: string; level: string }[]
  socialLinks: { label: string; url: string }[]
}

export async function generateCVData(): Promise<CVData> {
  const [hero, about, skills, projects, experience, education, certificates, socialLinks, timelineItems] = await Promise.all([
    portfolioService.getHero(),
    portfolioService.getAbout(),
    portfolioService.getSkills(),
    portfolioService.getProjects(),
    portfolioService.getExperience(),
    portfolioService.getEducation(),
    portfolioService.getCertificates(),
    portfolioService.getSocialLinks(),
    portfolioService.getTimelineItems(),
  ])

  const allExperience = timelineItems.filter((t) => t.type === 'experience')
  const allEducation = timelineItems.filter((t) => t.type === 'education')
  const allCertifications = timelineItems.filter((t) => t.type === 'certification')

  return {
    name: hero?.name || 'Senior Full Stack Engineer',
    title: hero?.title || 'Senior Full Stack Engineer & .NET Architect',
    email: about?.personal_info?.email || 'hello@example.com',
    location: hero?.location || 'San Francisco, CA',
    phone: about?.personal_info?.phone || '+1 (555) 123-4567',
    website: 'portfolio.example.com',
    summary: about?.biography || hero?.long_description || 'Senior Full Stack Engineer with over 8 years of experience.',
    skills: skills.length > 0
      ? skills.map((s) => ({ category: s.title, technologies: [s.title] }))
      : [],
    experience: (experience.length > 0 ? experience : allExperience).map((e) => ({
      year: 'start_date' in e ? (e as any).start_date?.slice(0, 4) || e.year : e.year,
      title: e.position || e.title,
      subtitle: e.company || e.subtitle,
      description: e.description,
      highlights: ['Led technical strategy', 'Architected scalable solutions'],
    })),
    projects: projects.map((p) => ({
      title: p.title,
      summary: p.description || '',
      technologies: p.tech_stack || [],
    })),
    education: (education.length > 0 ? education : allEducation).map((e) => ({
      year: 'start_date' in e ? (e as any).start_date?.slice(0, 4) || e.year : e.year,
      title: e.degree || e.title,
      institution: e.university || e.subtitle,
      description: e.description,
    })),
    certifications: (certificates.length > 0 ? certificates : allCertifications).map((c) => ({
      year: 'issue_date' in c ? (c as any).issue_date?.slice(0, 4) || c.year : c.year,
      title: c.title,
      issuer: c.issuer || c.subtitle,
      description: c.description,
    })),
    languages: (about?.languages || ['English', 'Arabic']).map((l: string) => ({
      language: l,
      level: 'Native',
    })),
    socialLinks: (socialLinks || []).map((l) => ({ label: l.platform, url: l.url })),
  }
}
