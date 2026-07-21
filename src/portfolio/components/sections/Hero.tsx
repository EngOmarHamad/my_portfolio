import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowDown } from 'lucide-react'
import { useHero, useSocialLinks } from '@/portfolio/hooks/use-portfolio-data'
import { FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaYoutube, FaBehance, FaDribbble, FaMedium } from 'react-icons/fa'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: FaGithub, linkedin: FaLinkedin, 'twitter-x': FaTwitter,
  facebook: FaFacebook, instagram: FaInstagram, youtube: FaYoutube,
  behance: FaBehance, dribbble: FaDribbble, medium: FaMedium,
}

const stackItems = [
  { name: 'React', color: 'bg-primary/10 text-primary border-primary/20' },
  { name: 'TypeScript', color: 'bg-accent/10 text-accent border-accent/20' },
  { name: '.NET', color: 'bg-highlight/10 text-highlight border-highlight/20' },
  { name: 'Azure', color: 'bg-primary/10 text-primary border-primary/20' },
  { name: 'Flutter', color: 'bg-accent/10 text-accent border-accent/20' },
]

export function Hero() {
  const [mounted, setMounted] = useState(false)
  const { data: hero } = useHero()
  const { data: socialLinks } = useSocialLinks()

  useEffect(() => { setMounted(true) }, [])

  const titles = hero?.typing_animation_texts?.length
    ? hero.typing_animation_texts
    : ['Senior Full Stack Engineer']

  const displayTitle = hero?.title || 'Senior Full Stack Engineer'
  const displayName = hero?.name || ''
  const displayDescription = hero?.short_description || 'Building scalable, maintainable systems with clean architecture, modern stacks, and great user experiences.'

  return (
    <section className="relative min-h-[100dvh] flex items-center px-5 sm:px-8 lg:px-12 pt-24 pb-20 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-accent/[0.02] to-highlight/[0.03]" />
        <div className="absolute top-0 right-0 w-[50%] h-[60%] bg-gradient-to-bl from-primary/[0.04] to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[50%] bg-gradient-to-tr from-accent/[0.03] to-transparent rounded-full blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                {hero?.availability || 'Available for opportunities'}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-[1.05] font-serif font-normal">
                {displayName && <><span className="text-text">{displayName}</span><br /></>}
                <span className="text-primary">{displayTitle.split(' ')[0] || 'Senior'}</span>
                <br />
                <span className="text-gradient">{displayTitle.split(' ').slice(1).join(' ') || 'Full Stack Engineer'}</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-base sm:text-lg text-text-secondary leading-relaxed"
            >
              {displayDescription}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 flex flex-wrap gap-2"
            >
              {titles.slice(0, 5).map((title: string) => (
                <span
                  key={title}
                  className="inline-flex items-center rounded-md px-3 py-1 text-xs font-medium border bg-primary/10 text-primary border-primary/20 transition-all duration-200 hover:scale-105"
                >
                  {title}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              {(hero?.cta_buttons as Array<{ label: string; url: string; variant?: string }>)?.map((cta) => (
                cta.variant === 'primary' || !cta.variant ? (
                  <Link
                    key={cta.label}
                    to={cta.url}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light hover:shadow-elevated transition-all duration-200 shadow-soft"
                  >
                    {cta.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <Link
                    key={cta.label}
                    to={cta.url}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-accent/30 text-accent text-sm font-medium hover:bg-accent/5 hover:border-accent/60 transition-all duration-200"
                  >
                    {cta.label}
                  </Link>
                )
              )) || (
                <>
                  <Link to="/projects" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light hover:shadow-elevated transition-all duration-200 shadow-soft">
                    View Projects <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/about" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-accent/30 text-accent text-sm font-medium hover:bg-accent/5 hover:border-accent/60 transition-all duration-200">
                    About Me
                  </Link>
                </>
              )}
              {hero?.resume_button_url && (
                <Link to={hero.resume_button_url} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-text-secondary text-sm font-medium hover:bg-surface-hover hover:text-text transition-all duration-200">
                  {hero.resume_button_text || 'View CV'}
                </Link>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 flex items-center gap-3"
            >
              <span className="text-xs text-text-tertiary font-mono mr-1">Connect</span>
              {(socialLinks ?? []).slice(0, 4).map((link) => {
                const Icon = iconMap[link.platform] || FaGithub
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-text-tertiary hover:bg-surface hover:text-text border border-border/40 hover:border-border transition-all duration-200"
                    aria-label={link.label || link.platform}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-full max-w-md aspect-square"
            >
              <div className="absolute inset-0 rounded-2xl pixel-border-primary bg-gradient-to-br from-primary/5 via-accent/5 to-highlight/5" />
              <div className="absolute inset-3 rounded-xl overflow-hidden">
                <div className="w-full h-full scale-110 origin-center">
                  <img
                    src={hero?.avatar_url || '/images/profile.png'}
                    alt="Profile photo"
                    className="w-full h-full object-cover object-[center_25%]"
                  />
                </div>
                <div className="absolute inset-0 z-10 bg-gradient-to-br from-primary/25 via-accent/15 to-highlight/20" />
                <div className="absolute inset-0 z-20 pointer-events-none pixel-overlay" />
              </div>
              <div className="absolute -top-3 -left-3 w-7 h-7 bg-primary/20 rounded-sm z-10" />
              <div className="absolute -top-3 -right-3 w-7 h-7 bg-accent/20 rounded-sm z-10" />
              <div className="absolute -bottom-3 -left-3 w-7 h-7 bg-highlight/20 rounded-sm z-10" />
              <div className="absolute -bottom-3 -right-3 w-7 h-7 bg-primary/20 rounded-sm z-10" />
              {mounted && (
                <motion.div
                  className="absolute inset-3 rounded-xl overflow-hidden pointer-events-none z-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.12, 0, 0.08, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                >
                  <div className="w-full h-full bg-gradient-to-b from-transparent via-accent/15 to-transparent" />
                </motion.div>
              )}
              <div className="absolute -right-8 top-[30%] flex flex-col gap-1.5 z-10">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ background: i === 0 ? '#256F6C' : i === 1 ? '#F1633D' : '#EEC047' }}
                    animate={{ opacity: [0.2, 0.9, 0.2] }}
                    transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
          <ArrowDown className="h-5 w-5 text-text-tertiary" />
        </motion.div>
      </motion.div>
    </section>
  )
}
