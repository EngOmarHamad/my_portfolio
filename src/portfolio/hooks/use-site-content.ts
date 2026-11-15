import { useMemo } from 'react'
import * as fallback from '@/portfolio/data/content'
import {
  deriveStats,
  mapAchievements,
  mapCertificates,
  mapEducation,
  mapExperience,
  mapHeroStatistics,
  mapProjects,
  mapSkills,
  mapSocials,
  mapTestimonials,
  mapTimelineExperience,
  mergeProfile,
} from '@/portfolio/data/adapters'
import type { SiteContent } from '@/portfolio/data/types'
import {
  useAbout,
  useAchievements,
  useActiveResume,
  useCertificates,
  useContactInfo,
  useEducation,
  useExperience,
  useHero,
  useProjects,
  useSocialLinks,
  useTechStack,
  useTestimonials,
  useTimelineItems,
} from './use-portfolio-data'

const preferCms = <T,>(cms: T[], local: T[]) => (cms.length ? cms : local)

/**
 * Single entry point for public content: CMS data when available, the typed
 * CV fallback otherwise. `isSettled` turns true once the identity queries have
 * either resolved or failed, so above-the-fold reveals never show a swap.
 */
export function useSiteContent(): SiteContent & { isSettled: boolean } {
  const hero = useHero()
  const about = useAbout()
  const contact = useContactInfo()
  const resume = useActiveResume()
  const socials = useSocialLinks()
  const skills = useTechStack()
  const projects = useProjects()
  const experience = useExperience()
  const timeline = useTimelineItems()
  const education = useEducation()
  const certificates = useCertificates()
  const achievements = useAchievements()
  const testimonials = useTestimonials()

  const isSettled = !hero.isPending || hero.isError

  const content = useMemo<SiteContent>(() => {
    const projectList = preferCms(mapProjects(projects.data), fallback.projects)
    const experienceList = preferCms(
      preferCms(mapExperience(experience.data), mapTimelineExperience(timeline.data)),
      fallback.experience,
    )
    const educationList = preferCms(mapEducation(education.data), fallback.education)
    const cmsStats = mapHeroStatistics(hero.data?.statistics)

    return {
      profile: mergeProfile(fallback.profile, hero.data, about.data, contact.data, resume.data),
      socials: preferCms(mapSocials(socials.data), fallback.socials),
      stats: cmsStats.length ? cmsStats : deriveStats(experienceList, projectList, educationList),
      skills: preferCms(mapSkills(skills.data), fallback.skills),
      architecture: { nodes: fallback.architectureNodes, edges: fallback.architectureEdges },
      projects: projectList,
      experience: experienceList,
      education: educationList,
      certificates: preferCms(mapCertificates(certificates.data), fallback.certificates),
      achievements: preferCms(mapAchievements(achievements.data), fallback.achievements),
      testimonials: mapTestimonials(testimonials.data),
    }
  }, [
    hero.data,
    about.data,
    contact.data,
    resume.data,
    socials.data,
    skills.data,
    projects.data,
    experience.data,
    timeline.data,
    education.data,
    certificates.data,
    achievements.data,
    testimonials.data,
  ])

  return { ...content, isSettled }
}
