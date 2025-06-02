import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    
    if (!config.supabaseServiceRoleKey) {
      return {
        success: false,
        error: 'SUPABASE_SERVICE_ROLE_KEY environment variable is missing',
        hint: 'Add this to your Vercel environment variables'
      }
    }

    const supabase = createClient(
      config.public.supabaseUrl,
      config.supabaseServiceRoleKey
    )

    // Test insert
    const { data, error } = await supabase
      .from('orders')
      .insert({
        email: 'test@servicetest.com',
        product_name: 'Test Product',
        country_name: 'Test Country',
        quantity: 1,
        status: 'pending'
      })
      .select()

    if (error) {
      return {
        success: false,
        error: error.message,
        details: error
      }
    }

    // Clean up test order
    await supabase
      .from('orders')
      .delete()
      .eq('id', data[0].id)

    return {
      success: true,
      message: 'Service role key works! Order operations should succeed.',
      testOrderId: data[0].id
    }

  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      type: 'exception'
    }
  }
}) 