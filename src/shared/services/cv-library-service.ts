import { supabase } from '@/shared/lib/supabase'
import type { CVEntry, CVProfile, CVProfileEntry } from '@/shared/types/cv-library'

export const cvLibraryService = {
  async publicEntries(): Promise<CVEntry[]> {
    const { data, error } = await supabase.from('cv_entries').select('*').eq('is_public', true).order('display_order')
    if (error) throw error
    return (data ?? []) as CVEntry[]
  },

  async adminEntries(): Promise<CVEntry[]> {
    const { data, error } = await supabase.from('cv_entries').select('*').order('display_order')
    if (error) throw error
    return (data ?? []) as CVEntry[]
  },

  async profiles(): Promise<CVProfile[]> {
    const { data, error } = await supabase.from('cv_profiles').select('*').order('name')
    if (error) throw error
    return (data ?? []) as CVProfile[]
  },

  async profileEntries(profileId: string): Promise<CVProfileEntry[]> {
    const { data, error } = await supabase.from('cv_profile_entries').select('*').eq('profile_id', profileId)
    if (error) throw error
    return (data ?? []) as CVProfileEntry[]
  },

  async createProfile(values: Pick<CVProfile, 'name' | 'slug' | 'title' | 'summary' | 'keywords'>): Promise<CVProfile> {
    const { data, error } = await supabase.from('cv_profiles').insert(values).select().single()
    if (error) throw error
    return data as CVProfile
  },

  async updateProfile(id: string, values: Pick<CVProfile, 'name' | 'title' | 'summary' | 'keywords'>): Promise<void> {
    const { error } = await supabase.from('cv_profiles').update(values).eq('id', id)
    if (error) throw error
  },

  async saveSelection(profileId: string, entries: CVProfileEntry[]): Promise<void> {
    if (!entries.length) return
    const { error } = await supabase.from('cv_profile_entries').upsert(
      entries.map((entry) => ({ ...entry, profile_id: profileId })),
      { onConflict: 'profile_id,entry_id' },
    )
    if (error) throw error
  },

  async updateEntry(id: string, values: Pick<CVEntry, 'label' | 'content' | 'tags' | 'is_public'>): Promise<void> {
    const { error } = await supabase.from('cv_entries').update(values).eq('id', id)
    if (error) throw error
  },
}
