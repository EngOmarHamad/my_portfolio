import { ExternalLink } from 'lucide-react'
import { Section, SectionHeader } from '@/portfolio/components/ui/Section'
import { useEducation, useCertificates } from '@/portfolio/hooks/use-portfolio-data'

export function CareerDetails() {
  const { data: education = [] } = useEducation()
  const { data: certificates = [] } = useCertificates()

  return (
    <>
      <Section id="education" className="scroll-mt-16 py-20">
        <SectionHeader title="Education" subtitle="The academic foundation of my work." />
        {education.length === 0 ? (
          <p className="text-center text-text-secondary">Education details will appear here soon.</p>
        ) : (
          <div className="mx-auto max-w-3xl divide-y divide-border rounded-xl border border-border bg-surface px-6 shadow-card">
            {education.map((item) => (
              <article key={item.id} className="py-6">
                <p className="text-xs text-text-tertiary">
                  {item.start_date?.slice(0, 4)}
                  {item.end_date ? ` - ${item.end_date.slice(0, 4)}` : ''}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-text">{item.degree}</h3>
                <p className="text-sm text-text-secondary">
                  {item.university}
                  {item.department ? ` · ${item.department}` : ''}
                </p>
                {item.description && <p className="mt-3 text-sm leading-relaxed text-text-secondary">{item.description}</p>}
              </article>
            ))}
          </div>
        )}
      </Section>

      <Section id="certificates" className="scroll-mt-16 py-20">
        <SectionHeader title="Certificates" subtitle="Credentials and continued learning." />
        {certificates.length === 0 ? (
          <p className="text-center text-text-secondary">Certificates will appear here soon.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((item) => (
              <article key={item.id} className="rounded-xl border border-border bg-surface p-6 shadow-card">
                <h3 className="text-lg font-semibold text-text">{item.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{item.issuer}</p>
                {item.issue_date && <p className="mt-1 text-xs text-text-tertiary">{new Date(item.issue_date).getFullYear()}</p>}
                {item.credential_url && (
                  <a
                    href={item.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark"
                  >
                    View credential <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </Section>
    </>
  )
}
