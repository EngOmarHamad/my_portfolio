import { BackendUnavailableError, portfolioService } from '@/portfolio/services/portfolio-service'
import * as fallback from '@/portfolio/data/content'
import { cvLibraryService } from '@/shared/services/cv-library-service'
import { buildCVData } from '@/shared/lib/cv-mapper'
import type { CVData } from '@/shared/types/cv-data'

export type { CVData } from '@/shared/types/cv-data'

const year = (value: string) => value.slice(0, 4)

/** CV built from the typed CV content — used when the CMS backend is unavailable. */
function fromStaticContent(): CVData {
  const { profile } = fallback
  return {
    name: profile.name,
    title: profile.title,
    email: profile.email,
    location: profile.location,
    phone: profile.phone,
    website: new URL(fallback.SITE_URL).host,
    summary: profile.biography,
    skills: fallback.skills.map((skill) => ({ category: skill.group, technologies: [skill.name] })),
    experience: fallback.experience.map((item) => ({
      year: year(item.start),
      title: item.role,
      subtitle: item.organization,
      description: item.summary,
      highlights: item.highlights,
    })),
    projects: fallback.projects.map((project) => ({ title: project.title, summary: project.summary, technologies: project.technologies })),
    education: fallback.education.map((item) => ({ year: year(item.start), title: item.degree, institution: item.institution, description: item.summary })),
    certifications: fallback.certificates.map((item) => ({ year: year(item.date), title: item.title, issuer: item.issuer, description: item.summary })),
    languages: profile.languages.map((entry) => {
      const [language, level = ''] = entry.split(' — ')
      return { language, level }
    }),
    socialLinks: fallback.socials.map((link) => ({ label: link.label, url: link.url })),
    achievements: [],
    references: [],
  }
}

export async function generateCVData(): Promise<CVData> {
  try {
    return await generateFromCms()
  } catch (error) {
    if (error instanceof BackendUnavailableError) return fromStaticContent()
    throw error
  }
}

async function generateFromCms(): Promise<CVData> {
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
    name: hero?.name || fallback.profile.name,
    title: hero?.title || fallback.profile.title,
    email: about?.personal_info?.email || fallback.profile.email,
    location: hero?.location || fallback.profile.location,
    phone: about?.personal_info?.phone || fallback.profile.phone,
    website: new URL(fallback.SITE_URL).host,
    summary: about?.biography || hero?.long_description || fallback.profile.biography,
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
    languages: (about?.languages || fallback.profile.languages).map((l: string) => ({
      language: l,
      level: '',
    })),
    socialLinks: (socialLinks || []).map((l) => ({ label: l.platform, url: l.url })),
    achievements: [],
    references: [],
  }
}
