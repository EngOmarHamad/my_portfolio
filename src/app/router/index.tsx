import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { RootLayout } from '@/app/layouts/RootLayout'

const HomePage = lazy(() => import('@/pages/Home').then((m) => ({ default: m.HomePage })))
const ProjectsPage = lazy(() => import('@/pages/Projects').then((m) => ({ default: m.ProjectsPage })))
const ProjectDetailPage = lazy(() => import('@/pages/Projects/ProjectDetail').then((m) => ({ default: m.ProjectDetailPage })))
const AboutPage = lazy(() => import('@/pages/About').then((m) => ({ default: m.AboutPage })))
const BlogPage = lazy(() => import('@/pages/Blog').then((m) => ({ default: m.BlogPage })))
const SkillsPage = lazy(() => import('@/pages/Skills').then((m) => ({ default: m.SkillsPage })))
const ExperiencePage = lazy(() => import('@/pages/Experience').then((m) => ({ default: m.ExperiencePage })))
const ContactPage = lazy(() => import('@/pages/Contact').then((m) => ({ default: m.ContactPage })))
const CVPage = lazy(() => import('@/pages/CV').then((m) => ({ default: m.CVPage })))
const NotFoundPage = lazy(() => import('@/pages/NotFound').then((m) => ({ default: m.NotFoundPage })))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-text-tertiary">Loading...</p>
      </div>
    </div>
  )
}

export function AppRouter() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:id" element={<ProjectDetailPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="skills" element={<SkillsPage />} />
            <Route path="experience" element={<ExperiencePage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:slug" element={<BlogPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="cv" element={<CVPage />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}
