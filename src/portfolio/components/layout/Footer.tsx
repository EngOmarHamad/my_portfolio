import { Link } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'
import { FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaYoutube, FaBehance, FaDribbble, FaMedium } from 'react-icons/fa'
import { useSocialLinks, useHero } from '@/portfolio/hooks/use-portfolio-data'
import { NAV_ITEMS } from '@/portfolio/constants/navigation'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: FaGithub, linkedin: FaLinkedin, 'twitter-x': FaTwitter,
  facebook: FaFacebook, instagram: FaInstagram, youtube: FaYoutube,
  behance: FaBehance, dribbble: FaDribbble, medium: FaMedium,
}

export function Footer() {
  const { data: socialLinks } = useSocialLinks()
  const { data: hero } = useHero()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative border-t border-border/60 bg-surface/60 backdrop-blur-md">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" aria-hidden />
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12 py-14">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-12">
          <div className="col-span-2 sm:col-span-3 lg:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-primary/25 bg-gradient-to-br from-primary/15 to-accent/10 text-xs font-bold text-primary-light font-mono">
                {hero?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'TS'}
              </span>
              <span className="text-sm font-mono text-text-secondary group-hover:text-text transition-colors">
                Portfolio
              </span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed max-w-sm">
              {hero?.short_description || 'Senior Full Stack Engineer & .NET Architect. Building scalable, maintainable systems with clean architecture.'}
            </p>
            <div className="flex gap-2">
              {(socialLinks ?? []).slice(0, 5).map((link) => {
                const Icon = iconMap[link.platform] || FaGithub
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 text-text-secondary transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:text-text hover:bg-primary/5"
                    aria-label={link.label || link.platform}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-text">Pages</h3>
            <ul className="space-y-2.5">
              {NAV_ITEMS.slice(0, 6).map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-sm text-text-secondary hover:text-primary-light transition-colors duration-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-text">Expertise</h3>
            <ul className="space-y-2.5">
              {['React / TypeScript', '.NET Core / C#', 'Cloud Architecture', 'System Design'].map((item) => (
                <li key={item}>
                  <span className="text-sm text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-text">Available</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {hero?.location || 'Worldwide remote'}<br />
              Freelance & full-time
            </p>
            <Link to="/contact" className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border/60 px-4 py-2 text-sm font-medium text-text-secondary transition-all hover:border-primary/40 hover:text-text">
              Get in Touch
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-6 sm:flex-row">
          <p className="font-mono text-xs text-text-tertiary">
            &copy; {new Date().getFullYear()} Portfolio. React, TypeScript & Tailwind CSS.
          </p>
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 rounded-lg border border-transparent px-3 py-1.5 text-xs text-text-secondary transition-all hover:border-border/60 hover:text-text"
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
