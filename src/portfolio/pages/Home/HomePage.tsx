import { lazy, Suspense } from 'react'
import { Hero } from '@/portfolio/components/home/Hero'

const HomeSections = lazy(() => import('./HomeSections'))

/** The home narrative: who → what I build with → what I built → where → let's talk. */
export function HomePage() {
  return (
    <>
      <Hero />
      <Suspense fallback={<div className="min-h-svh" aria-busy="true" />}>
        <HomeSections />
      </Suspense>
    </>
  )
}
