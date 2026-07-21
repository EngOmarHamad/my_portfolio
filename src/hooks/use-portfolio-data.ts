import { useQuery } from '@tanstack/react-query'
import { portfolioService } from '@/services/portfolio-service'

export function useHero() {
  return useQuery({
    queryKey: ['portfolio', 'hero'],
    queryFn: portfolioService.getHero,
    staleTime: 1000 * 60 * 5,
  })
}

export function useAbout() {
  return useQuery({
    queryKey: ['portfolio', 'about'],
    queryFn: portfolioService.getAbout,
    staleTime: 1000 * 60 * 5,
  })
}

export function useSkills() {
  return useQuery({
    queryKey: ['portfolio', 'skills'],
    queryFn: portfolioService.getSkills,
    staleTime: 1000 * 60 * 5,
  })
}

export function useProjects() {
  return useQuery({
    queryKey: ['portfolio', 'projects'],
    queryFn: portfolioService.getProjects,
    staleTime: 1000 * 60 * 5,
  })
}

export function useProjectBySlug(slug: string) {
  return useQuery({
    queryKey: ['portfolio', 'project', slug],
    queryFn: () => portfolioService.getProjectBySlug(slug),
    staleTime: 1000 * 60 * 5,
  })
}

export function useProjectById(id: string) {
  return useQuery({
    queryKey: ['portfolio', 'project', id],
    queryFn: () => portfolioService.getProjectById(id),
    staleTime: 1000 * 60 * 5,
  })
}

export function useProjectCategories() {
  return useQuery({
    queryKey: ['portfolio', 'project-categories'],
    queryFn: portfolioService.getCategories,
    staleTime: 1000 * 60 * 5,
  })
}

export function useExperience() {
  return useQuery({
    queryKey: ['portfolio', 'experience'],
    queryFn: portfolioService.getExperience,
    staleTime: 1000 * 60 * 5,
  })
}

export function useEducation() {
  return useQuery({
    queryKey: ['portfolio', 'education'],
    queryFn: portfolioService.getEducation,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCertificates() {
  return useQuery({
    queryKey: ['portfolio', 'certificates'],
    queryFn: portfolioService.getCertificates,
    staleTime: 1000 * 60 * 5,
  })
}

export function useTestimonials() {
  return useQuery({
    queryKey: ['portfolio', 'testimonials'],
    queryFn: portfolioService.getTestimonials,
    staleTime: 1000 * 60 * 5,
  })
}

export function useAchievements() {
  return useQuery({
    queryKey: ['portfolio', 'achievements'],
    queryFn: portfolioService.getAchievements,
    staleTime: 1000 * 60 * 5,
  })
}

export function useBlogPosts() {
  return useQuery({
    queryKey: ['portfolio', 'blog'],
    queryFn: portfolioService.getBlogPosts,
    staleTime: 1000 * 60 * 5,
  })
}

export function useBlogPostBySlug(slug: string) {
  return useQuery({
    queryKey: ['portfolio', 'blog', slug],
    queryFn: () => portfolioService.getBlogPostBySlug(slug),
    staleTime: 1000 * 60 * 5,
  })
}

export function useSocialLinks() {
  return useQuery({
    queryKey: ['portfolio', 'social-links'],
    queryFn: portfolioService.getSocialLinks,
    staleTime: 1000 * 60 * 5,
  })
}

export function useTechStack() {
  return useQuery({
    queryKey: ['portfolio', 'tech-stack'],
    queryFn: portfolioService.getTechStack,
    staleTime: 1000 * 60 * 5,
  })
}

export function useTimelineItems() {
  return useQuery({
    queryKey: ['portfolio', 'timeline'],
    queryFn: portfolioService.getTimelineItems,
    staleTime: 1000 * 60 * 5,
  })
}

export function useContactInfo() {
  return useQuery({
    queryKey: ['portfolio', 'contact-info'],
    queryFn: portfolioService.getContactInfo,
    staleTime: 1000 * 60 * 5,
  })
}

export function useSeo() {
  return useQuery({
    queryKey: ['portfolio', 'seo'],
    queryFn: portfolioService.getSEO,
    staleTime: 1000 * 60 * 5,
  })
}

export function useSettings() {
  return useQuery({
    queryKey: ['portfolio', 'settings'],
    queryFn: portfolioService.getSettings,
    staleTime: 1000 * 60 * 5,
  })
}

export function useActiveResume() {
  return useQuery({
    queryKey: ['portfolio', 'resume'],
    queryFn: portfolioService.getActiveResume,
    staleTime: 1000 * 60 * 5,
  })
}
