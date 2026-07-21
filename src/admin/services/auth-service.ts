import { supabase } from '@/admin/lib/supabase'
import type { AuthUser } from '@/admin/types'

export const authService = {
  async login(email: string, password: string): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    if (!data.user) throw new Error('No user returned')

    return {
      id: data.user.id,
      email: data.user.email ?? '',
    }
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  },

  async getUser(): Promise<AuthUser | null> {
    const { data, error } = await supabase.auth.getUser()
    if (error || !data.user) return null
    return {
      id: data.user.id,
      email: data.user.email ?? '',
    }
  },

  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email ?? '',
        })
      } else {
        callback(null)
      }
    })
  },
}
