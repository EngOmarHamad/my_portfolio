import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { PageTransition } from '@/portfolio/components/layout/PageTransition'
import { Reveal } from '@/portfolio/components/animations/Reveal'
import { useProjectById } from '@/portfolio/hooks/use-portfolio-data'

export function ProjectDetailPage() {
  const { id } = useParams()
  const { data: project, isLoading } = useProjectById(id ?? '')

  if (isLoading) {
    return (
      <PageTransition>
        <main className="min-h-screen flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </main>
      </PageTransition>
    )
  }

  if (!project) {
    return (
      <PageTransition>
        <main className="min-h-screen flex items-center justify-center px-5">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-text mb-3">Project Not Found</h2>
            <p className="text-text-secondary mb-6 text-sm">The project you're looking for doesn't exist.</p>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-light transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Link>
          </div>
        </main>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <main>
        <section className="pt-32 pb-20 px-5 sm:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-4xl">
            <Reveal>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text transition-colors mb-8"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Link>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="inline-flex items-center gap-3 text-xs font-mono text-text-tertiary mb-4">
                <span className="font-semibold text-primary">Case Study</span>
                <span aria-hidden className="text-border">/</span>
                <span>{project.category}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl text-text mb-4">
                {project.title}
              </h1>
              <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl mb-8">
                {project.description}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="flex flex-wrap items-center gap-4 mb-12">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border text-sm font-medium text-text hover:bg-surface-hover transition-all duration-200"
                  >
                    <FaGithub className="h-4 w-4" />
                    View Source
                  </a>
                )}
                {project.live_demo_url && (
                  <a
                    href={project.live_demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-light transition-all duration-200 shadow-soft"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Live Demo
                  </a>
                )}
              </div>
            </Reveal>

            <div className="space-y-12">
              <Reveal>
                <div>
                  <hr className="hairline-primary mb-5" />
                  <h2 className="text-xl font-semibold text-text mb-4">Technologies Used</h2>
                  <div className="flex flex-wrap gap-2">
                    {(project.tech_stack ?? []).map((tech: string) => (
                      <span
                        key={tech}
                        className="inline-flex items-center rounded-md bg-surface-hover px-3 py-1.5 text-sm font-medium text-text-secondary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>

              {project.challenges && (
                <Reveal delay={0.1}>
                  <div>
                    <hr className="hairline-primary mb-5" />
                    <h2 className="text-xl font-semibold text-text mb-4">The Challenge</h2>
                    <p className="text-base text-text-secondary leading-relaxed">{project.challenges}</p>
                  </div>
                </Reveal>
              )}

              {project.solutions && (
                <Reveal delay={0.15}>
                  <div>
                    <hr className="hairline-primary mb-5" />
                    <h2 className="text-xl font-semibold text-text mb-4">The Solution</h2>
                    <p className="text-base text-text-secondary leading-relaxed">{project.solutions}</p>
                  </div>
                </Reveal>
              )}

              {(project.features ?? []).length > 0 && (
                <Reveal delay={0.2}>
                  <div>
                    <hr className="hairline-primary mb-5" />
                    <h2 className="text-xl font-semibold text-text mb-4">Features</h2>
                    <div className="flex flex-wrap gap-2">
                      {(project.features ?? []).map((feature: string) => (
                        <span
                          key={feature}
                          className="inline-flex items-center rounded-md bg-primary/10 text-primary px-3 py-1.5 text-sm font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}

              {project.case_study && (
                <Reveal delay={0.25}>
                  <div>
                    <hr className="hairline-primary mb-5" />
                    <h2 className="text-xl font-semibold text-text mb-4">Case Study</h2>
                    <div className="prose prose-sm text-text-secondary leading-relaxed max-w-none">
                      {project.case_study.split('\n').map((p: string, i: number) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </section>
      </main>
    </PageTransition>
  )
}
