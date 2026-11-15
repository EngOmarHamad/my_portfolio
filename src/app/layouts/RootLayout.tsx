import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from '@/portfolio/components/layout/Navbar'
import { Footer } from '@/portfolio/components/layout/Footer'
import { ScrollProgress } from '@/portfolio/components/layout/ScrollProgress'
import { AnimatedBackground } from '@/portfolio/components/layout/AnimatedBackground'
import { SkipNav } from '@/portfolio/components/ui/SkipNav'
import { useSeo } from '@/portfolio/hooks/use-portfolio-data'

export function RootLayout() {
  const location = useLocation()
  const { data: seo } = useSeo()

  useEffect(() => {
    if (!seo) return

    const setMeta = (selector: string, attribute: 'name' | 'property', key: string, content?: string) => {
      if (!content) return
      let element = document.head.querySelector<HTMLMetaElement>(selector)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, key)
        document.head.appendChild(element)
      }
      element.content = content
    }

    if (seo.site_title) document.title = seo.site_title
    setMeta('meta[name="description"]', 'name', 'description', seo.site_description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', seo.og_title || seo.site_title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', seo.og_description || seo.site_description)
    setMeta('meta[property="og:image"]', 'property', 'og:image', seo.og_image_url)
    setMeta('meta[name="robots"]', 'name', 'robots', seo.robots)
    if (seo.favicon_url) {
      const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
      if (icon) icon.href = seo.favicon_url
    }
  }, [seo])

  useEffect(() => {
    if (!location.hash) return
    const id = decodeURIComponent(location.hash.slice(1))
    const scrollToSection = () => {
      const target = document.getElementById(id)
      if (!target) return false
      target.scrollIntoView({ block: 'start' })
      return true
    }

    if (scrollToSection()) return
    const observer = new MutationObserver(() => {
      if (scrollToSection()) observer.disconnect()
    })
    observer.observe(document.body, { childList: true, subtree: true })
    const timeout = window.setTimeout(() => observer.disconnect(), 3000)
    return () => {
      observer.disconnect()
      window.clearTimeout(timeout)
    }
  }, [location.pathname, location.hash])

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
