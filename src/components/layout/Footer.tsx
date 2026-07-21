import { Link } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'
import { FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaYoutube, FaBehance, FaDribbble, FaMedium } from 'react-icons/fa'
import { useSocialLinks, useHero } from '@/hooks/use-portfolio-data'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: FaGithub, linkedin: FaLinkedin, 'twitter-x': FaTwitter,
  facebook: FaFacebook, instagram: FaInstagram, youtube: FaYoutube,
  behance: FaBehance, dribbble: FaDribbble, medium: FaMedium,
}

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Projects', path: '/projects' },
  { label: 'Skills', path: '/skills' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

export function Footer() {
  const { data: socialLinks } = useSocialLinks()
  const { data: hero } = useHero()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-border/50 bg-surface/50">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12 py-14 lg:py-18">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-12">
          <div className="col-span-2 sm:col-span-3 lg:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <span className="flex h-7 w-7 items-center justify-center rounded border border-border bg-surface text-xs font-bold text-primary font-mono">
                {hero?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'TS'}
              </span>
              <span className="text-sm font-mono text-text-secondary group-hover:text-text transition-colors">
                Portfolio
              </span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
              {hero?.short_description || 'Senior Full Stack Engineer & .NET Architect. Building scalable, maintainable systems with clean architecture.'}
            </p>
            <div className="flex gap-2">
              {(socialLinks ?? []).slice(0, 4).map((link) => {
                const Icon = iconMap[link.platform] || FaGithub
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-md text-text-secondary hover:bg-surface hover:text-text border border-border/40 hover:border-border transition-all duration-200"
                    aria-label={link.label || link.platform}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold text-text uppercase tracking-widest mb-4 font-mono">Pages</h3>
            <ul className="space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-sm text-text-secondary hover:text-text transition-colors duration-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold text-text uppercase tracking-widest mb-4 font-mono">Expertise</h3>
            <ul className="space-y-3">
              {['React / TypeScript', '.NET Core / C#', 'Cloud Architecture', 'System Design', 'Mobile (Flutter)'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold text-text uppercase tracking-widest mb-4 font-mono">Available</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {hero?.location || 'Worldwide remote'}<br />
              Freelance & full-time
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-tertiary font-mono">
            &copy; {new Date().getFullYear()} Portfolio. Built with React, TypeScript & Tailwind CSS.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs text-text-secondary hover:text-text transition-colors group"
            aria-label="Scroll to top"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  )
}
