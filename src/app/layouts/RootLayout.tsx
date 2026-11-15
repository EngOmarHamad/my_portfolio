import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from '@/portfolio/components/layout/Navbar'
import { Footer } from '@/portfolio/components/layout/Footer'
import { SkipNav } from '@/portfolio/components/ui/SkipNav'
import { Backdrop } from '@/portfolio/components/experience/Backdrop'
import { CustomCursor } from '@/portfolio/components/experience/CustomCursor'
import { ScrollProgress } from '@/portfolio/components/experience/ScrollProgress'
import { SmoothScroll } from '@/portfolio/components/experience/SmoothScroll'
import { Toaster } from '@/portfolio/components/ds'
import { useSeo } from '@/portfolio/hooks/use-portfolio-data'
import { scrollToTarget } from '@/portfolio/lib/smooth-scroll'

function useCmsSeo() {
  const { data: seo } = useSeo()

  useEffect(() => {
    if (!seo) return
    const setMeta = (attribute: 'name' | 'property', key: string, content?: string) => {
      if (!content) return
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, key)
        document.head.appendChild(element)
      }
      element.content = content
    }
    if (seo.site_title) document.title = seo.site_title
    setMeta('name', 'description', seo.site_description)
    setMeta('property', 'og:title', seo.og_title || seo.site_title)
    setMeta('property', 'og:description', seo.og_description || seo.site_description)
    setMeta('property', 'og:image', seo.og_image_url)
    setMeta('name', 'twitter:title', seo.og_title || seo.site_title)
    setMeta('name', 'twitter:description', seo.og_description || seo.site_description)
    setMeta('name', 'twitter:image', seo.og_image_url)
    setMeta('name', 'robots', seo.robots)
  }, [seo])
}

/** Hash targets (e.g. "/#work") resolve once the lazily rendered section exists. */
function useHashNavigation() {
  const location = useLocation()
  const previousPath = useRef(location.pathname)

  useEffect(() => {
    const changedPage = previousPath.current !== location.pathname
    previousPath.current = location.pathname

    if (!location.hash) {
      if (changedPage) scrollToTarget(0, { immediate: true })
      return
    }
    const id = decodeURIComponent(location.hash.slice(1))
    const go = () => scrollToTarget(id, { immediate: changedPage })
    if (go()) return

    const observer = new MutationObserver(() => {
      if (go()) observer.disconnect()
    })
    observer.observe(document.body, { childList: true, subtree: true })
    const timeout = window.setTimeout(() => observer.disconnect(), 4000)
    return () => {
      observer.disconnect()
      window.clearTimeout(timeout)
    }
  }, [location.pathname, location.hash])
}

export function RootLayout() {
  useCmsSeo()
  useHashNavigation()

  return (
    <>
      <SkipNav />
      <SmoothScroll />
      <Backdrop />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </>
  )
}
