import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    
    // Create anon client (same as frontend)
    const anonClient = createClient(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey
    )

    // Try a simple insert like the frontend does
    const testOrder = {
      email: 'test-rls@example.com',
      product_name: 'Test Product',
      country_name: 'Test Country',
      quantity: 1,
      status: 'pending'
    }

    console.log('Attempting insert with anon client...')
    const { data, error } = await anonClient
      .from('orders')
      .insert(testOrder)
      .select()

    if (error) {
      console.log('Anon insert failed:', error)
      
      // Try with service role to see if it's truly an RLS issue
      const serviceClient = createClient(
        config.public.supabaseUrl,
        config.supabaseServiceRoleKey
      )
      
      console.log('Trying with service role...')
      const { data: serviceData, error: serviceError } = await serviceClient
        .from('orders')
        .insert({
          ...testOrder,
          email: 'test-service@example.com'
        })
        .select()

      return {
        success: false,
        anonError: error.message,
        serviceWorked: !serviceError,
        serviceError: serviceError?.message || null,
        diagnosis: !serviceError ? 'RLS issue with anon role' : 'Broader database issue'
      }
    }

    return {
      success: true,
      message: 'Anon insert worked! RLS is configured correctly.',
      data
    }

  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      type: 'connection_error'
    }
  }
}) 