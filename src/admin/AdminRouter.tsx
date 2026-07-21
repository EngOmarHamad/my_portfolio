import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AdminLayout } from '@/admin/layouts/AdminLayout'

const LoginPage = lazy(() => import('@/admin/pages/Auth/LoginPage').then((m) => ({ default: m.LoginPage })))
const DashboardPage = lazy(() => import('@/admin/pages/Dashboard').then((m) => ({ default: m.DashboardPage })))
const HeroPage = lazy(() => import('@/admin/pages/Hero').then((m) => ({ default: m.HeroPage })))
const AboutPage = lazy(() => import('@/admin/pages/About').then((m) => ({ default: m.AboutPage })))
const SkillsPage = lazy(() => import('@/admin/pages/Skills').then((m) => ({ default: m.SkillsPage })))
const ProjectsPage = lazy(() => import('@/admin/pages/Projects').then((m) => ({ default: m.ProjectsPage })))
const ServicesPage = lazy(() => import('@/admin/pages/Services').then((m) => ({ default: m.ServicesPage })))
const ExperiencePage = lazy(() => import('@/admin/pages/Experience').then((m) => ({ default: m.ExperiencePage })))
const EducationPage = lazy(() => import('@/admin/pages/Education').then((m) => ({ default: m.EducationPage })))
const CertificatesPage = lazy(() => import('@/admin/pages/Certificates').then((m) => ({ default: m.CertificatesPage })))
const TestimonialsPage = lazy(() => import('@/admin/pages/Testimonials').then((m) => ({ default: m.TestimonialsPage })))
const AchievementsPage = lazy(() => import('@/admin/pages/Achievements').then((m) => ({ default: m.AchievementsPage })))
const BlogPage = lazy(() => import('@/admin/pages/Blog').then((m) => ({ default: m.BlogPage })))
const GalleryPage = lazy(() => import('@/admin/pages/Gallery').then((m) => ({ default: m.GalleryPage })))
const ContactPage = lazy(() => import('@/admin/pages/Contact').then((m) => ({ default: m.ContactPage })))
const SocialLinksPage = lazy(() => import('@/admin/pages/SocialLinks').then((m) => ({ default: m.SocialLinksPage })))
const TechStackPage = lazy(() => import('@/admin/pages/TechStack').then((m) => ({ default: m.TechStackPage })))
const TimelinePage = lazy(() => import('@/admin/pages/Timeline').then((m) => ({ default: m.TimelinePage })))
const ResumePage = lazy(() => import('@/admin/pages/Resume').then((m) => ({ default: m.ResumePage })))
const SEOPage = lazy(() => import('@/admin/pages/SEO').then((m) => ({ default: m.SEOPage })))
const SettingsPage = lazy(() => import('@/admin/pages/Settings').then((m) => ({ default: m.SettingsPage })))

function AdminLoader() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
        <p className="text-sm text-[var(--color-text-tertiary)]">Loading...</p>
      </div>
    </div>
  )
}

export function AdminRouter() {
  return (
    <Suspense fallback={<AdminLoader />}>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="hero" element={<HeroPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="experience" element={<ExperiencePage />} />
          <Route path="education" element={<EducationPage />} />
          <Route path="certificates" element={<CertificatesPage />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="achievements" element={<AchievementsPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="social-links" element={<SocialLinksPage />} />
          <Route path="tech-stack" element={<TechStackPage />} />
          <Route path="timeline" element={<TimelinePage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="seo" element={<SEOPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
