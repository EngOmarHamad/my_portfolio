import { PageTransition } from '@/components/layout/PageTransition'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { ContactForm } from '@/components/forms/ContactForm'
import { Reveal, StaggerReveal, StaggerItem } from '@/components/animations/Reveal'
import { Mail, MapPin } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'hello@example.com', href: 'mailto:hello@example.com' },
  { icon: MapPin, label: 'Location', value: 'Available Worldwide', href: null },
]

export function ContactPage() {
  return (
    <PageTransition>
      <main>
        <Section variant="coral">
          <SectionHeader
            title="Get in Touch"
            subtitle="Have a project in mind or just want to say hello? Let&apos;s talk."
            accent="accent"
          />

          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            <Reveal className="lg:col-span-2 space-y-8">
              <StaggerReveal>
                <div className="space-y-5">
                  {contactInfo.map((item, i) => {
                    const iconColors = [
                      'bg-primary/10 text-primary group-hover:bg-primary',
                      'bg-accent/10 text-accent group-hover:bg-accent',
                    ]
                    return (
                      <StaggerItem key={item.label}>
                        <div className="flex items-center gap-4 group">
                          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${iconColors[i]} group-hover:text-white transition-colors duration-300`}>
                            <item.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs text-text-tertiary uppercase tracking-wider font-medium font-mono">{item.label}</p>
                            {item.href ? (
                              <a
                                href={item.href}
                                className="text-sm font-medium text-text hover:text-primary transition-colors duration-200"
                              >
                                {item.value}
                              </a>
                            ) : (
                              <p className="text-sm font-medium text-text">{item.value}</p>
                            )}
                          </div>
                        </div>
                      </StaggerItem>
                    )
                  })}
                </div>
              </StaggerReveal>

              <div>
                <p className="text-xs text-text-tertiary uppercase tracking-wider font-medium font-mono mb-4">Social</p>
                <div className="flex gap-2">
                  {[
                    { icon: FaGithub, label: 'GitHub', href: 'https://github.com', color: 'hover:text-primary hover:border-primary/40' },
                    { icon: FaLinkedin, label: 'LinkedIn', href: 'https://linkedin.com', color: 'hover:text-accent hover:border-accent/40' },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex h-10 w-10 items-center justify-center rounded-md text-text-secondary hover:bg-surface border border-border/40 ${link.color} transition-all duration-200`}
                      aria-label={link.label}
                    >
                      <link.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-accent/20 bg-accent/[0.04] p-5">
                <p className="text-sm text-text-secondary leading-relaxed">
                  Currently available for freelance projects and full-time opportunities.
                  Response time is typically within 24 hours.
                </p>
                <div className="flex items-center gap-1.5 mt-3 text-xs text-accent font-medium">
                  <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
                  Available for opportunities
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15} className="lg:col-span-3">
              <Card className="p-6 sm:p-8 lg:p-10 card-border-coral">
                <ContactForm />
              </Card>
            </Reveal>
          </div>
        </Section>
      </main>
    </PageTransition>
  )
}
