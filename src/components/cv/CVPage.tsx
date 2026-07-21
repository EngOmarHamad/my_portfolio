import { useQuery } from '@tanstack/react-query'
import '@/styles/cv-print.css'
import { Link } from 'react-router-dom'
import { ArrowLeft, Download, Globe, Mail, MapPin, Phone } from 'lucide-react'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { Button } from '@/components/ui/Button'
import { generateCVData } from '@/services/cv'

const socialIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedin,
  Twitter: FaTwitter,
}

export function CVPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['cv-data'],
    queryFn: generateCVData,
    staleTime: 1000 * 60 * 5,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="cv-page">
      <div className="cv-print-controls">
        <div className="mx-auto max-w-[210mm] px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm text-text-secondary hover:text-text transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="cv-content mx-auto max-w-[210mm] bg-white shadow-lg min-h-[297mm]">
        <header className="cv-header">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{data.name}</h1>
              <p className="text-lg text-primary mt-1">{data.title}</p>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-slate-600">
                {data.email && (
                  <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{data.email}</span>
                )}
                {data.location && (
                  <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{data.location}</span>
                )}
                {data.phone && (
                  <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{data.phone}</span>
                )}
                <span className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" />{data.website}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            {data.socialLinks.map((link) => {
              const Icon = socialIcons[link.label] || FaGithub
              return (
                <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-600 hover:bg-primary hover:text-white transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              )
            })}
          </div>
        </header>

        <div className="cv-body">
          <section className="cv-section">
            <h2 className="cv-section-title">Professional Summary</h2>
            <p className="text-sm text-slate-700 leading-relaxed">{data.summary}</p>
          </section>

          <section className="cv-section">
            <h2 className="cv-section-title">Skills</h2>
            <div className="grid grid-cols-2 gap-4">
              {data.skills.map((skill) => (
                <div key={skill.category}>
                  <h3 className="text-sm font-semibold text-slate-800 mb-2">{skill.category}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {skill.technologies.map((t) => (
                      <span key={t} className="inline-flex items-center rounded-md bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
              {data.skills.length === 0 && (
                <p className="text-sm text-slate-500 col-span-2">Skills data not available yet. Add skills in the admin dashboard.</p>
              )}
            </div>
          </section>

          <section className="cv-section">
            <h2 className="cv-section-title">Experience</h2>
            <div className="space-y-5">
              {data.experience.map((exp) => (
                <div key={exp.year + exp.title}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">{exp.title}</h3>
                      <p className="text-xs text-primary font-medium">{exp.subtitle}</p>
                    </div>
                    <span className="text-xs text-slate-500 font-mono shrink-0 ml-4">{exp.year}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{exp.description}</p>
                  <ul className="mt-2 space-y-1">
                    {exp.highlights.map((h, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>{h}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="cv-section">
            <h2 className="cv-section-title">Projects</h2>
            <div className="grid grid-cols-2 gap-4">
              {data.projects.map((proj) => (
                <div key={proj.title} className="p-3 rounded-lg bg-slate-50">
                  <h3 className="text-sm font-semibold text-slate-800">{proj.title}</h3>
                  <p className="text-xs text-slate-600 mt-1">{proj.summary}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {proj.technologies.map((t) => (
                      <span key={t} className="inline-flex items-center rounded-md bg-slate-200 text-slate-700 px-1.5 py-0.5 text-[10px] font-medium">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-2 gap-8">
            <section className="cv-section">
              <h2 className="cv-section-title">Education</h2>
              <div className="space-y-4">
                {data.education.map((edu) => (
                  <div key={edu.year + edu.title}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">{edu.title}</h3>
                        <p className="text-xs text-primary font-medium">{edu.institution}</p>
                      </div>
                      <span className="text-xs text-slate-500 font-mono shrink-0 ml-4">{edu.year}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{edu.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="cv-section">
              <h2 className="cv-section-title">Certifications</h2>
              <div className="space-y-4">
                {data.certifications.map((cert) => (
                  <div key={cert.year + cert.title}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">{cert.title}</h3>
                        <p className="text-xs text-primary font-medium">{cert.issuer}</p>
                      </div>
                      <span className="text-xs text-slate-500 font-mono shrink-0 ml-4">{cert.year}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{cert.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="cv-section">
            <h2 className="cv-section-title">Languages</h2>
            <div className="flex flex-wrap gap-4">
              {data.languages.map((lang) => (
                <div key={lang.language}>
                  <span className="text-sm font-semibold text-slate-800">{lang.language}</span>
                  <span className="text-xs text-slate-500 ml-2">{lang.level}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
