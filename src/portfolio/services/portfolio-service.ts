// The client is loaded on demand so the 50 KB SDK never blocks first render.
const isSupabaseConfigured = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
const loadClient = () => import('@/shared/lib/supabase').then((module) => module.supabase)

export class BackendUnavailableError extends Error {
  constructor() {
    super('CMS backend is not configured')
    this.name = 'BackendUnavailableError'
  }
}

async function client() {
  if (!isSupabaseConfigured) throw new BackendUnavailableError()
  return loadClient()
}

export const portfolioService = {
  async getHero() {
    const supabase = await client()
    const { data, error } = await supabase.from('hero').select('*').eq('is_published', true).limit(1).single()
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async getAbout() {
    const supabase = await client()
    const { data, error } = await supabase.from('about').select('*').eq('is_published', true).limit(1).single()
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async getSkills() {
    const supabase = await client()
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
    if (error) throw error
    return data ?? []
  },

  async getProjects() {
    const supabase = await client()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true })
    if (error) throw error
    return data ?? []
  },

  async getServices() {
    const supabase = await client()
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
    if (error) throw error
    return data ?? []
  },

  async getGalleryImages() {
    const supabase = await client()
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('display_order', { ascending: true })
    if (error) throw error
    return data ?? []
  },

  async getProjectBySlug(slug: string) {
    const supabase = await client()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    if (error) throw error
    return data
  },

  async getProjectById(id: string) {
    const supabase = await client()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('status', 'published')
      .single()
    if (error) throw error
    return data
  },

  async getCategories() {
    const supabase = await client()
    const { data, error } = await supabase
      .from('projects')
      .select('category')
      .eq('status', 'published')
      .not('category', 'is', null)
    if (error) throw error
    const categories = [...new Set((data ?? []).map((p) => p.category).filter(Boolean))]
    return ['All', ...categories]
  },

  async getExperience() {
    const supabase = await client()
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .eq('is_published', true)
      .order('start_date', { ascending: false })
    if (error) throw error
    return data ?? []
  },

  async getEducation() {
    const supabase = await client()
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .eq('is_published', true)
      .order('start_date', { ascending: false })
    if (error) throw error
    return data ?? []
  },

  async getCertificates() {
    const supabase = await client()
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('is_published', true)
      .order('issue_date', { ascending: false })
    if (error) throw error
    return data ?? []
  },

  async getTestimonials() {
    const supabase = await client()
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
    if (error) throw error
    return data ?? []
  },

  async getAchievements() {
    const supabase = await client()
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
    if (error) throw error
    return data ?? []
  },

  async getBlogPosts() {
    const supabase = await client()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data ?? []
  },

  async getBlogPostBySlug(slug: string) {
    const supabase = await client()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
    if (error) throw error
    return data
  },

  async getSocialLinks() {
    const supabase = await client()
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    if (error) throw error
    return data ?? []
  },

  async getTechStack() {
    const supabase = await client()
    // Unified: tech_stack is now merged into skills (single source). Read from skills where category is Tools/DevOps or all if needed.
    const { data, error } = await supabase
      .from('skills')
      .select('id, title, icon, percentage, level, category_id, skill_categories!left(name, slug)')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
    if (error) throw error
    // Map to TechStackItem shape for backward compatibility
    const mapped = (data ?? []).map((row: Record<string, unknown>) => {
      const cat = row.skill_categories as { name?: string } | null
      return {
        id: String(row.id ?? ''),
        name: String(row.title ?? ''),
        icon: String(row.icon ?? ''),
        category: String(cat?.name ?? (row.level as string) ?? 'General'),
        proficiency: Number(row.percentage ?? 0),
        display_order: Number(row.display_order ?? 0),
        is_published: true,
        created_at: String(row.created_at ?? ''),
        updated_at: String(row.updated_at ?? ''),
      }
    }) as import('@/admin/types').TechStackItem[]
    return mapped
  },

  async getTimelineItems() {
    const supabase = await client()
    const { data, error } = await supabase
      .from('timeline_items')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
    if (error) throw error
    return data ?? []
  },

  async getContactInfo() {
    const supabase = await client()
    const { data, error } = await supabase.from('contact_info').select('*').eq('is_published', true).limit(1).single()
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async getSEO() {
    const supabase = await client()
    const { data, error } = await supabase.from('seo').select('*').limit(1).single()
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async getSettings() {
    const supabase = await client()
    const { data, error } = await supabase.from('settings').select('*').limit(1).single()
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async submitContact(message: { name: string; email: string; subject: string; message: string }) {
    const supabase = await client()
    const { error } = await supabase.from('contact_messages').insert(message)
    if (error) throw error
  },

  async getActiveResume() {
    const supabase = await client()
    const { data, error } = await supabase
      .from('resume')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return data
  },
}
