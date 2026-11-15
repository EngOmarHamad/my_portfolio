import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, CheckCircle2, Layers, Calendar, Maximize2, X } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { useState } from 'react'
import { PageTransition } from '@/portfolio/components/layout/PageTransition'
import { Reveal } from '@/portfolio/components/animations/Reveal'
import { useProjectById } from '@/portfolio/hooks/use-portfolio-data'

export function ProjectDetailPage() {
  const { id } = useParams()
  const { data: project, isLoading } = useProjectById(id ?? '')

  // حالة التحكم في الـ Lightbox (تخزين رابط الصورة المفتوحة حالياً)
  const [activeImage, setActiveImage] = useState<string | null>(null)

  if (isLoading) {
    return (
      <PageTransition>
        <main className="min-h-screen flex items-center justify-center bg-bg">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </main>
      </PageTransition>
    )
  }

  if (!project) {
    return (
      <PageTransition>
        <main className="min-h-screen flex items-center justify-center px-5 bg-bg">
          <div className="text-center max-w-md">
            <h2 className="text-xl font-bold text-text mb-2">Project Not Found</h2>
            <p className="text-text-secondary mb-6 text-sm">The project you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-95 transition-all shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Link>
          </div>
        </main>
      </PageTransition>
    )
  }

  // تحويل رابط اليوتيوب العادي إلى رابط embed تلقائياً إذا وجد
  const getEmbedUrl = (url: string) => {
    if (!url) return ''
    if (url.includes('embed/')) return url
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop()
    return `https://www.youtube.com/embed/${videoId}`
  }

  return (
    <PageTransition>
      <main className="bg-bg min-h-screen pb-24 relative">
        <section className="pt-32 px-5 sm:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-4xl">

            {/* زر العودة */}
            <Reveal>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text transition-colors mb-8 group"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Projects
              </Link>
            </Reveal>

            {/* العنوان والبيانات الوصفية */}
            <Reveal delay={0.1}>
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-text-tertiary mb-4">
                <span className="px-2.5 py-1 rounded-full bg-primary/10 font-semibold text-primary">
                  {project.category || 'Portfolio Project'}
                </span>
                {project.status && (
                  <>
                    <span aria-hidden className="text-border">•</span>
                    <span className="capitalize text-text-secondary flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      {project.status}
                    </span>
                  </>
                )}
                {project.completion_date && (
                  <>
                    <span aria-hidden className="text-border">•</span>
                    <span className="flex items-center gap-1 text-text-secondary">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(project.completion_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text mb-6">
                {project.title}
              </h1>

              {/* الصورة الرئيسية للمشروع (قابلة للضغط لتفتح في الـ Lightbox أيضاً) */}
              {project.thumbnail_url && (
                <div
                  onClick={() => setActiveImage(project.thumbnail_url)}
                  className="mb-8 overflow-hidden rounded-2xl border border-border bg-surface-hover shadow-sm cursor-pointer group relative"
                >
                  <img
                    src={project.thumbnail_url}
                    alt={project.title}
                    className="w-full h-auto object-cover transform group-hover:scale-[1.01] transition-transform duration-500 max-h-[500px]"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 backdrop-blur-md">
                      <Maximize2 className="h-4 w-4" /> View Full Image
                    </span>
                  </div>
                </div>
              )}

              <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-3xl mb-8">
                {project.description}
              </p>
            </Reveal>

            {/* أزرار الروابط الخارجية (GitHub & Live Demo) */}
            <Reveal delay={0.2}>
              <div className="flex flex-wrap items-center gap-4 pb-12 border-b border-border">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-text hover:bg-surface-hover transition-all shadow-sm"
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
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-95 transition-all shadow-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Live Demo
                  </a>
                )}
              </div>
            </Reveal>

            {/* محتوى المشروع وتفاصيله */}
            <div className="space-y-12 pt-10">

              {/* نبذة أو وصف طويل */}
              {project.long_description && (
                <Reveal>
                  <div className="bg-surface/50 border border-border/60 rounded-2xl p-6 sm:p-8 shadow-sm">
                    <h2 className="text-lg font-semibold text-text mb-3 flex items-center gap-2">
                      <Layers className="h-5 w-5 text-primary" />
                      Project Overview
                    </h2>
                    <p className="text-base text-text-secondary leading-relaxed">
                      {project.long_description}
                    </p>
                  </div>
                </Reveal>
              )}

              {/* التقنيات المستخدمة */}
              {(project.tech_stack ?? []).length > 0 && (
                <Reveal delay={0.1}>
                  <div>
                    <h2 className="text-lg font-semibold text-text mb-4">Technologies Used</h2>
                    <div className="flex flex-wrap gap-2">
                      {(project.tech_stack ?? []).map((tech: string) => (
                        <span
                          key={tech}
                          className="inline-flex items-center rounded-lg bg-surface-hover border border-border/50 px-3.5 py-1.5 text-sm font-medium text-text-secondary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}

              {/* التحديات */}
              {project.challenges && project.challenges.trim() !== "" && (
                <Reveal delay={0.15}>
                  <div className="border-l-2 border-primary pl-6 py-1">
                    <h2 className="text-lg font-semibold text-text mb-2">The Challenge</h2>
                    <p className="text-base text-text-secondary leading-relaxed">{project.challenges}</p>
                  </div>
                </Reveal>
              )}

              {/* الحلول */}
              {project.solutions && project.solutions.trim() !== "" && (
                <Reveal delay={0.2}>
                  <div className="border-l-2 border-primary pl-6 py-1">
                    <h2 className="text-lg font-semibold text-text mb-2">The Solution</h2>
                    <p className="text-base text-text-secondary leading-relaxed">{project.solutions}</p>
                  </div>
                </Reveal>
              )}

              {/* المميزات */}
              {(project.features ?? []).length > 0 && (
                <Reveal delay={0.25}>
                  <div>
                    <h2 className="text-lg font-semibold text-text mb-4">Key Features</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(project.features ?? []).map((feature: string) => (
                        <div
                          key={feature}
                          className="flex items-start gap-3 p-3.5 rounded-xl bg-surface/40 border border-border/60 text-sm font-medium text-text-secondary"
                        >
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}

              {/* دراسة الحالة (Case Study) */}
              {project.case_study && project.case_study.trim() !== "" && (
                <Reveal delay={0.3}>
                  <div className="pt-6 border-t border-border">
                    <h2 className="text-xl font-semibold text-text mb-6">Case Study</h2>
                    <div className="prose prose-sm sm:prose-base text-text-secondary leading-relaxed max-w-none space-y-4">
                      {project.case_study.split('\n').map((p: string, i: number) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}

              {/* فيديو اليوتيوب التوضيحي */}
              {project.youtube_url && project.youtube_url.trim() !== "" && (
                <Reveal delay={0.35}>
                  <div className="pt-6 border-t border-border">
                    <h2 className="text-xl font-semibold text-text mb-6">Project Walkthrough</h2>
                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-surface border border-border shadow-sm">
                      <iframe
                        src={getEmbedUrl(project.youtube_url)}
                        title="Project Video Walkthrough"
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </Reveal>
              )}

              {/* معرض الصور - Gallery */}
              {(project.gallery_images ?? []).length > 0 && (
                <Reveal delay={0.4}>
                  <div className="pt-6 border-t border-border">
                    <h2 className="text-xl font-semibold text-text mb-6">Project Gallery</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {project.gallery_images.map((img: string, i: number) => (
                        <div
                          key={i}
                          onClick={() => setActiveImage(img)}
                          className="group relative overflow-hidden rounded-xl bg-surface border border-border shadow-sm hover:shadow-xl transition-all cursor-pointer"
                        >
                          <img
                            src={img}
                            alt={`Gallery image ${i + 1}`}
                            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Maximize2 className="text-white h-7 w-7" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}

            </div>
          </div>
        </section>

        {/* --- Custom Lightbox Modal --- */}
        {activeImage && (
          <div
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors border border-white/10"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 shadow-sm bg-black/40"
            >
              <img
                src={activeImage}
                alt="Enlarged view"
                className="w-full h-auto max-h-[85vh] object-contain block mx-auto"
              />
            </div>
          </div>
        )}

      </main>
    </PageTransition>
  )
}