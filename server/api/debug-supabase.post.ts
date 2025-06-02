import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    
    console.log('Environment variables check:')
    console.log('SUPABASE_URL:', config.public.supabaseUrl ? 'Set' : 'Missing')
    console.log('SUPABASE_ANON_KEY:', config.public.supabaseAnonKey ? 'Set' : 'Missing')
    console.log('SUPABASE_SERVICE_ROLE_KEY:', config.supabaseServiceRoleKey ? 'Set' : 'Missing')

    // Test with anon key (what the frontend uses)
    const anonClient = createClient(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey
    )

    console.log('Testing anon client insert...')
    const { data: anonData, error: anonError } = await anonClient
      .from('orders')
      .insert({
        email: 'test@debug.com',
        product_name: 'Test Product',
        country_name: 'Test Country',
        quantity: 1,
        status: 'pending'
      })
      .select()

    console.log('Anon insert result:', { data: anonData, error: anonError })

    // Test with service role key
    const serviceClient = createClient(
      config.public.supabaseUrl,
      config.supabaseServiceRoleKey
    )

    console.log('Testing service role client insert...')
    const { data: serviceData, error: serviceError } = await serviceClient
      .from('orders')
      .insert({
        email: 'test-service@debug.com',
        product_name: 'Test Product Service',
        country_name: 'Test Country',
        quantity: 1,
        status: 'pending'
      })
      .select()

    console.log('Service insert result:', { data: serviceData, error: serviceError })

    return {
      success: true,
      results: {
        anonClient: {
          data: anonData,
          error: anonError?.message || null
        },
        serviceClient: {
          data: serviceData,
          error: serviceError?.message || null
        }
      },
      config: {
        supabaseUrl: config.public.supabaseUrl,
        hasAnonKey: !!config.public.supabaseAnonKey,
        hasServiceKey: !!config.supabaseServiceRoleKey
      }
    }
  } catch (error: any) {
    console.error('Debug API error:', error)
    return {
      success: false,
      error: error.message || 'Unknown error'
    }
  }
}) 