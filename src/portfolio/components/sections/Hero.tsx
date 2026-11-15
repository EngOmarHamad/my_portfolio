import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowDown, Code2, Award, Briefcase } from 'lucide-react'
import { useHero, useSocialLinks } from '@/portfolio/hooks/use-portfolio-data'
import { useLanguage } from '@/shared/i18n'
import { FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaYoutube, FaBehance, FaDribbble, FaMedium, FaDev, FaDiscord } from 'react-icons/fa'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: FaGithub, linkedin: FaLinkedin, 'twitter-x': FaTwitter,
  facebook: FaFacebook, instagram: FaInstagram, youtube: FaYoutube,
  behance: FaBehance, dribbble: FaDribbble, medium: FaMedium,
  dev: FaDev, discord: FaDiscord,
}

export function Hero() {
  const [currentWord, setCurrentWord] = useState(0)
  const { data: hero } = useHero()
  const { data: socialLinks } = useSocialLinks()
  const { t, lang } = useLanguage()

  const titles = hero?.typing_animation_texts?.length
    ? hero.typing_animation_texts
    : t.hero.titlesFallback

  useEffect(() => {
    if (titles.length < 2) return
    const id = setInterval(() => setCurrentWord((p) => (p + 1) % titles.length), 3200)
    return () => clearInterval(id)
  }, [titles.length])

  const displayName = lang === 'ar' ? t.hero.name : (hero?.name || t.hero.name)
  const displayDescription = hero?.short_description || t.hero.descriptionFallback

  return (
    <section className="relative flex min-h-[90vh] items-center px-5 pb-16 pt-28 sm:px-8 lg:px-12 bg-bg">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-secondary" />
            <span className="text-sm text-text-secondary">
              {hero?.availability || t.hero.availabilityFallback}
            </span>
          </div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-text-tertiary">{t.hero.imA}</p>
          <h1 className="text-4xl leading-tight text-text sm:text-5xl lg:text-6xl">
            <span className="block">{displayName}</span>
            <span className="mt-2 block text-primary">{titles[currentWord]}</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
            {displayDescription}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              <span>{t.hero.viewWork}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-primary/40 hover:bg-surface-hover"
            >
              <span>{t.hero.aboutMe}</span>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              {(socialLinks ?? []).slice(0, 5).map((link) => {
                const Icon = iconMap[link.platform] || FaGithub
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
                    aria-label={link.label || link.platform}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>

            <div className="hidden h-8 w-px bg-border sm:block" aria-hidden />

            <div className="flex flex-wrap items-center gap-4">
              {[
                { icon: Code2, value: '12+', label: t.hero.stats[0].label },
                { icon: Award, value: '2+', label: t.hero.stats[1].label },
                { icon: Briefcase, value: '40+', label: t.hero.stats[2].label },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2 text-sm">
                  <s.icon className="h-4 w-4 text-secondary" />
                  <span className="font-semibold text-text">{s.value}</span>
                  <span className="text-text-tertiary">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-md">
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
              <img
                src={hero?.avatar_url || '/images/profile.png'}
                alt={t.hero.profileAlt}
                className="aspect-square h-full w-full object-cover object-[center_25%]"
                loading="eager"
                decoding="async"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-surface px-4 py-3">
                <p className="text-xs text-text-tertiary">{t.hero.availableBadge}</p>
                <p className="mt-1 text-sm font-semibold text-primary">Available</p>
              </div>
              <div className="rounded-xl border border-border bg-surface px-4 py-3">
                <p className="text-xs text-text-tertiary">{t.hero.yearsBadge}</p>
                <p className="mt-1 text-sm font-semibold text-secondary">Experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex" aria-hidden>
        <span className="text-[10px] uppercase tracking-[0.2em] text-text-tertiary">{t.hero.scroll}</span>
        <ArrowDown className="h-4 w-4 text-text-tertiary" />
      </div>
    </section>
  )
}
