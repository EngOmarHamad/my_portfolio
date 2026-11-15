import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { RootLayout } from '@/app/layouts/RootLayout'
import { HomePage } from '@/portfolio/pages/Home'

const WorkPage = lazy(() => import('@/portfolio/pages/Projects').then((m) => ({ default: m.ProjectsPage })))
const CaseStudyPage = lazy(() => import('@/portfolio/pages/Projects').then((m) => ({ default: m.ProjectDetailPage })))
const ServicesPage = lazy(() => import('@/portfolio/pages/Services/ServicesPage').then((m) => ({ default: m.ServicesPage })))
const GalleryPage = lazy(() => import('@/portfolio/pages/Gallery/GalleryPage').then((m) => ({ default: m.GalleryPage })))
const BlogPage = lazy(() => import('@/portfolio/pages/Blog').then((m) => ({ default: m.BlogPage })))
const CVPage = lazy(() => import('@/portfolio/pages/CV').then((m) => ({ default: m.CVPage })))
const NotFoundPage = lazy(() => import('@/portfolio/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))

/** Reserves the viewport while a route chunk loads, so nothing shifts. */
const PageFallback = () => <div className="min-h-svh" aria-busy="true" />

/** Former standalone pages now live as sections of the home narrative. */
const toSection = (id: string) => <Navigate to={{ pathname: '/', hash: `#${id}` }} replace />

export function AppRouter() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="projects" element={<WorkPage />} />
          <Route path="projects/:id" element={<CaseStudyPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogPage />} />
          <Route path="about" element={toSection('about')} />
          <Route path="skills" element={toSection('skills')} />
          <Route path="experience" element={toSection('experience')} />
          <Route path="contact" element={toSection('contact')} />
          <Route path="cv-form" element={<Navigate to="/cv" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="cv" element={<CVPage />} />
      </Routes>
    </Suspense>
  )
}
