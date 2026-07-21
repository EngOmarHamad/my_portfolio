import { Outlet } from 'react-router-dom'
import { Navbar } from '@/portfolio/components/layout/Navbar'
import { Footer } from '@/portfolio/components/layout/Footer'
import { ScrollProgress } from '@/portfolio/components/layout/ScrollProgress'
import { AnimatedBackground } from '@/portfolio/components/layout/AnimatedBackground'
import { SkipNav } from '@/portfolio/components/ui/SkipNav'

export function RootLayout() {
  return (
    <>
      <SkipNav />
      <ScrollProgress />
      <AnimatedBackground />
      <Navbar />
      <main id="main-content" className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
