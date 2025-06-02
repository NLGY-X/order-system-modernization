import { createClient } from '@supabase/supabase-js'

// Singleton instance
let supabaseInstance = null

export const useSupabase = () => {
  // Return existing instance if available
  if (supabaseInstance) {
    return supabaseInstance
  }

  const config = useRuntimeConfig()
  
  // Create new instance only if none exists
  supabaseInstance = createClient(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey
  )
  
  return supabaseInstance
} 