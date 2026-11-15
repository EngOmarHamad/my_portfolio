import { portfolioService } from '@/portfolio/services/portfolio-service'
import { cvLibraryService } from '@/shared/services/cv-library-service'
import { buildCVData } from '@/shared/lib/cv-mapper'
import type { CVData } from '@/shared/types/cv-data'

export type { CVData } from '@/shared/types/cv-data'

export async function generateCVData(): Promise<CVData> {
  try {
    const entries = await cvLibraryService.publicEntries()
    if (entries.length > 0) return buildCVData(entries)
  } catch (error) {
    const code = (error as { code?: string }).code
    if (code !== 'PGRST205' && code !== '42P01') throw error
  }

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
    experience: experience.length > 0
      ? experience.map((e) => ({
          year: e.start_date?.slice(0, 4) || '',
          title: e.position,
          subtitle: e.company,
          description: e.description,
          highlights: [],
        }))
      : allExperience.map((e) => ({
          year: e.year,
          title: e.title,
          subtitle: e.subtitle,
          description: e.description,
          highlights: [],
        })),
    projects: projects.map((p) => ({
      title: p.title,
      summary: p.description || '',
      technologies: p.tech_stack || [],
    })),
    education: education.length > 0
      ? education.map((e) => ({
          year: e.start_date?.slice(0, 4) || '',
          title: e.degree,
          institution: e.university,
          description: e.description,
        }))
      : allEducation.map((e) => ({
          year: e.year,
          title: e.title,
          institution: e.subtitle,
          description: e.description,
        })),
    certifications: certificates.length > 0
      ? certificates.map((c) => ({
          year: c.issue_date?.slice(0, 4) || '',
          title: c.title,
          issuer: c.issuer,
          description: '',
        }))
      : allCertifications.map((c) => ({
          year: c.year,
          title: c.title,
          issuer: c.subtitle,
          description: c.description,
        })),
    languages: (about?.languages || ['English', 'Arabic']).map((l: string) => ({
      language: l,
      level: 'Native',
    })),
    socialLinks: (socialLinks || []).map((l) => ({ label: l.platform, url: l.url })),
    achievements: [],
    references: [],
  }
}
