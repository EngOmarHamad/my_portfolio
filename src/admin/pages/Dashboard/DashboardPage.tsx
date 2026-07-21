import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/admin/lib/supabase'
import { StatsCard } from '@/admin/components/ui/StatsCard'
import { PageHeader } from '@/admin/components/ui/PageHeader'
import { PageSkeleton } from '@/admin/components/ui/LoadingSkeleton'
import {
  Users, Code2, FolderKanban, FileText, MessageSquare, Briefcase,
  Star, Award, Image,
} from 'lucide-react'

export function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const [
        projects, skills, messages, blog, services,
        testimonials, certificates, gallery, experience,
      ] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('skills').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }),
        supabase.from('certificates').select('*', { count: 'exact', head: true }),
        supabase.from('gallery_images').select('*', { count: 'exact', head: true }),
        supabase.from('experience').select('*', { count: 'exact', head: true }),
      ])

      return {
        projects: projects.count ?? 0,
        skills: skills.count ?? 0,
        messages: messages.count ?? 0,
        blog: blog.count ?? 0,
        services: services.count ?? 0,
        testimonials: testimonials.count ?? 0,
        certificates: certificates.count ?? 0,
        gallery: gallery.count ?? 0,
        experience: experience.count ?? 0,
      }
    },
  })

  if (isLoading) return <PageSkeleton />

  const cards = [
    { title: 'Projects', value: stats?.projects ?? 0, icon: <FolderKanban className="w-5 h-5" /> },
    { title: 'Skills', value: stats?.skills ?? 0, icon: <Code2 className="w-5 h-5" /> },
    { title: 'Services', value: stats?.services ?? 0, icon: <Briefcase className="w-5 h-5" /> },
    { title: 'Experience', value: stats?.experience ?? 0, icon: <Users className="w-5 h-5" /> },
    { title: 'Testimonials', value: stats?.testimonials ?? 0, icon: <Star className="w-5 h-5" /> },
    { title: 'Certificates', value: stats?.certificates ?? 0, icon: <Award className="w-5 h-5" /> },
    { title: 'Blog Posts', value: stats?.blog ?? 0, icon: <FileText className="w-5 h-5" /> },
    { title: 'Gallery Images', value: stats?.gallery ?? 0, icon: <Image className="w-5 h-5" /> },
    { title: 'Messages', value: stats?.messages ?? 0, icon: <MessageSquare className="w-5 h-5" /> },
  ]

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your portfolio content"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card) => (
          <StatsCard key={card.title} {...card} />
        ))}
      </div>
    </div>
  )
}
