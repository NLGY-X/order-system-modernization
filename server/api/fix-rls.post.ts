import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    
    // Use service role key to bypass RLS and execute admin commands
    const supabase = createClient(
      config.public.supabaseUrl,
      config.supabaseServiceRoleKey
    )

    // Disable RLS on orders table temporarily
    const { error } = await supabase.rpc('exec_sql', {
      query: 'ALTER TABLE orders DISABLE ROW LEVEL SECURITY;'
    })

    if (error) {
      console.error('RLS disable error:', error)
      return 'Error: ' + (error as any).message
    }

    return 'SUCCESS: RLS disabled on orders table'
  } catch (error: any) {
    console.error('Fix RLS failed:', error)
    return 'Error: ' + error.message
  }
}) 