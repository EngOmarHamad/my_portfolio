import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

/**
 * True when the CMS backend is configured. The public site falls back to the
 * typed static content in `src/portfolio/data/content.ts` when it is not, so a
 * missing environment never renders a blank page.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// createClient throws on an empty URL; a syntactically valid placeholder keeps
// module evaluation safe. Public queries are short-circuited before reaching it.
export const supabase = createClient(
  supabaseUrl || 'https://not-configured.supabase.co',
  supabaseAnonKey || 'not-configured',
)
