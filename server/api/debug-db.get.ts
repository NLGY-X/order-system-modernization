import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    
    // Check if environment variables are set
    const envStatus = {
      supabaseUrl: !!config.public.supabaseUrl,
      supabaseUrlValue: config.public.supabaseUrl || 'MISSING',
      supabaseAnonKey: !!config.public.supabaseAnonKey,
      supabaseAnonKeyLength: config.public.supabaseAnonKey?.length || 0
    }
    
    if (!config.public.supabaseUrl || !config.public.supabaseAnonKey) {
      return {
        success: false,
        error: 'Missing environment variables',
        envStatus
      }
    }
    
    const supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey)
    
    // Test a simple query first
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('id')
      .limit(1)
    
    if (testError) {
      return {
        success: false,
        error: 'Database query failed',
        details: testError,
        envStatus
      }
    }
    
    // If that works, try the full queries
    const [productsResult, countriesResult] = await Promise.all([
      supabase.from('products').select('id, name').order('name', { ascending: true }),
      supabase.from('ppp_classifications').select('country_name').order('country_name', { ascending: true })
    ])
    
    return {
      success: true,
      envStatus,
      products: {
        error: productsResult.error,
        count: productsResult.data?.length || 0,
        sample: productsResult.data?.slice(0, 3) || []
      },
      countries: {
        error: countriesResult.error,
        count: countriesResult.data?.length || 0,
        sample: countriesResult.data?.slice(0, 3) || []
      }
    }
    
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }
  }
}) 