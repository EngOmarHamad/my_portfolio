import { supabase } from '@/shared/lib/supabase'

export const portfolioService = {
  async getHero() {
    const { data, error } = await supabase.from('hero').select('*').limit(1).single()
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async getAbout() {
    const { data, error } = await supabase.from('about').select('*').limit(1).single()
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async getSkills() {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
    if (error) throw error
    return data ?? []
  },

  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('display_order', { ascending: true })
    if (error) throw error
    return data ?? []
  },

  async getProjectBySlug(slug: string) {
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
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .eq('is_published', true)
      .order('start_date', { ascending: false })
    if (error) throw error
    return data ?? []
  },

  async getEducation() {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .eq('is_published', true)
      .order('start_date', { ascending: false })
    if (error) throw error
    return data ?? []
  },

  async getCertificates() {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('is_published', true)
      .order('issue_date', { ascending: false })
    if (error) throw error
    return data ?? []
  },

  async getTestimonials() {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
    if (error) throw error
    return data ?? []
  },

  async getAchievements() {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
    if (error) throw error
    return data ?? []
  },

  async getBlogPosts() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data ?? []
  },

  async getBlogPostBySlug(slug: string) {
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
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    if (error) throw error
    return data ?? []
  },

  async getTechStack() {
    const { data, error } = await supabase
      .from('tech_stack')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
    if (error) throw error
    return data ?? []
  },

  async getTimelineItems() {
    const { data, error } = await supabase
      .from('timeline_items')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
    if (error) throw error
    return data ?? []
  },

  async getContactInfo() {
    const { data, error } = await supabase.from('contact_info').select('*').limit(1).single()
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async getSEO() {
    const { data, error } = await supabase.from('seo').select('*').limit(1).single()
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async getSettings() {
    const { data, error } = await supabase.from('settings').select('*').limit(1).single()
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async submitContact(message: { name: string; email: string; subject: string; message: string }) {
    const { error } = await supabase.from('contact_messages').insert(message)
    if (error) throw error
  },

  async getActiveResume() {
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
