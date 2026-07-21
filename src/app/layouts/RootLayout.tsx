import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ScrollProgress } from '@/components/layout/ScrollProgress'
import { AnimatedBackground } from '@/components/layout/AnimatedBackground'
import { SkipNav } from '@/components/ui/SkipNav'

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
