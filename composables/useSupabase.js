import { createClient } from '@supabase/supabase-js'

// Singleton instance
let supabaseInstance = null

export const useSupabase = () => {
  // Return existing instance if available
  if (supabaseInstance) {
    return supabaseInstance
  }

  const config = useRuntimeConfig()
  
  // Validate environment variables
  if (!config.public.supabaseUrl || !config.public.supabaseAnonKey) {
    if (process.server) {
      console.warn('Supabase environment variables not available during build/prerender')
      // Return a mock client for SSG
      return {
        auth: { getUser: () => Promise.resolve({ data: { user: null }, error: null }) },
        from: () => ({ select: () => Promise.resolve({ data: [], error: null }) })
      }
    }
    throw new Error('Supabase environment variables are required')
  }
  
  // Create new instance only if none exists
  supabaseInstance = createClient(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey
  )
  
  return supabaseInstance
} 