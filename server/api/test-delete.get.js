import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    console.log('Testing Supabase connection...')
    
    // Check environment variables
    const supabaseUrl = process.env.SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    console.log('Supabase URL:', supabaseUrl ? 'Present' : 'MISSING')
    console.log('Service Key:', serviceKey ? 'Present' : 'MISSING')
    
    if (!supabaseUrl || !serviceKey) {
      return {
        success: false,
        error: 'Environment variables missing',
        details: {
          url: !!supabaseUrl,
          key: !!serviceKey
        }
      }
    }

    // Test connection
    const supabaseAdmin = createClient(supabaseUrl, serviceKey)
    
    // Try to read products
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('id, name')
      .limit(1)

    if (error) {
      console.error('Supabase error:', error)
      return {
        success: false,
        error: error.message,
        details: error
      }
    }

    return {
      success: true,
      message: 'Supabase connection working',
      productsFound: data?.length || 0,
      sampleProduct: data?.[0] || null
    }

  } catch (error) {
    console.error('Test error:', error)
    return {
      success: false,
      error: error.message,
      stack: error.stack
    }
  }
}) 