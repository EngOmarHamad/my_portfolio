import { PageTransition } from '@/portfolio/components/layout/PageTransition'
import { Section, SectionHeader } from '@/portfolio/components/ui/Section'
import { ContactForm } from '@/portfolio/components/forms/ContactForm'
import { Reveal, StaggerReveal, StaggerItem } from '@/portfolio/components/animations/Reveal'
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  Send,
  ArrowRight,
  MessageCircle
} from 'lucide-react'
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaFacebook,
  FaDev,
  FaMedium,
  FaWhatsapp,
  FaTelegram
} from 'react-icons/fa'
import { SiX } from 'react-icons/si'
import { motion } from 'framer-motion'
import { useContactInfo, useHero, useSocialLinks } from '@/portfolio/hooks/use-portfolio-data'

// أيقونات المنصات المدعومة
const platformIcons: Record<string, any> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  x: SiX,
  youtube: FaYoutube,
  instagram: FaInstagram,
  facebook: FaFacebook,
  dev: FaDev,
  medium: FaMedium,
  whatsapp: FaWhatsapp,
  telegram: FaTelegram,
}

const getPlatformIcon = (platform: string) => {
  const key = platform.toLowerCase().trim()
  return platformIcons[key] || FaGithub
}

export function ContactPage() {
  const { data: contactInfo } = useContactInfo()
  const { data: socialLinks = [] } = useSocialLinks()
  const { data: hero } = useHero()
  const availability = hero?.availability

  const contactItems = [
    {
      icon: Mail,
      label: 'Email',
      value: contactInfo?.email,
      href: contactInfo?.email ? `mailto:${contactInfo.email}` : null,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: contactInfo?.phone,
      href: contactInfo?.phone ? `tel:${contactInfo.phone}` : null,
    },
    {
      icon: MapPin,
      label: 'Location',
      value: contactInfo?.location,
      href: null,
    },
    ...(contactInfo?.working_hours ? [{
      icon: Clock,
      label: 'Working Hours',
      value: contactInfo.working_hours,
      href: null,
    }] : []),
  ].filter((item) => Boolean(item.value))

  return (
    <PageTransition>
      <main>
        <Section variant="coral" withGlow>
          <SectionHeader
            title="Get in Touch"
            subtitle="Have a project in mind or just want to say hello? Let's talk."
            accent="accent"
            withBadge
            badgeText="Let's Connect"
            animated
          />

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left Column - Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <Reveal>
                <StaggerReveal>
                  <div className="space-y-3">
                    {contactItems.map((item, _index) => (
                      <StaggerItem key={item.label}>
                        <motion.div
                          whileHover={{ y: -2 }}
                          className="group flex items-center gap-4 rounded-xl border border-border/40 bg-surface/50 p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-card"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                            <item.icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs uppercase tracking-wider text-text-tertiary/70 font-mono font-medium">
                              {item.label}
                            </p>
                            {item.href ? (
                              <a
                                href={item.href}
                                className="text-sm font-medium text-text hover:text-primary transition-colors duration-200 flex items-center gap-1 group/link"
                              >
                                {item.value}
                                <ArrowRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-all duration-300 -translate-x-1 group-hover/link:translate-x-0" />
                              </a>
                            ) : (
                              <p className="text-sm font-medium text-text">{item.value}</p>
                            )}
                          </div>
                        </motion.div>
                      </StaggerItem>
                    ))}
                  </div>
                </StaggerReveal>
              </Reveal>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <Reveal>
                  <div id="social-links" className="scroll-mt-24 rounded-xl border border-border/40 bg-surface/50 p-4">
                    <p className="text-xs uppercase tracking-wider text-text-tertiary/70 font-mono font-medium text-center mb-3">
                      Connect Socially
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {socialLinks.map((link) => {
                        const Icon = getPlatformIcon(link.icon || link.platform)
                        return (
                          <motion.a
                            key={link.platform}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ y: -3 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/40 bg-surface text-text-secondary transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                            aria-label={link.label || link.platform}
                          >
                            <Icon className="h-4 w-4" />
                          </motion.a>
                        )
                      })}
                    </div>
                  </div>
                </Reveal>
              )}

              {/* Availability */}
              <Reveal>
                <motion.div
                  whileHover={{ y: -2 }}
                  className="rounded-xl border border-primary/20 bg-primary/[0.03] p-4 transition-all duration-300 hover:border-primary/40 hover:shadow-card"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <MessageCircle className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {availability || 'Currently available for new opportunities.'}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                          </span>
                          <span className="text-xs font-medium text-primary">Current status</span>
                        </div>
                        <span className="text-xs text-text-tertiary">•</span>
                        <span className="text-xs text-text-tertiary">{contactInfo?.working_hours || 'Send a message anytime'}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            </div>

            {/* Right Column - Contact Form */}
            <Reveal delay={0.15} className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-xl border border-border/40 bg-surface/50 p-6 md:p-8 transition-all duration-300 hover:border-primary/20"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Send className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text">Send a Message</h3>
                    <p className="text-sm text-text-tertiary">I'll get back to you within 24 hours</p>
                  </div>
                </div>

                <ContactForm />
              </motion.div>
            </Reveal>
          </div>
        </Section>
      </main>
    </PageTransition>
  )
}
