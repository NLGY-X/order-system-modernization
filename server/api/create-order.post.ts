import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, productName, countryName, quantity } = body
    
    // Validate input
    if (!email || !productName || !countryName || !quantity) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
      })
    }

    const config = useRuntimeConfig()
    
    // Use service role key to bypass RLS issues
    const supabase = createClient(
      config.public.supabaseUrl,
      config.supabaseServiceRoleKey
    )

    // Insert the order
    const { data, error } = await supabase
      .from('orders')
      .insert({
        email,
        product_name: productName,
        country_name: countryName,
        quantity: parseInt(quantity),
        status: 'pending'
      })
      .select()

    if (error) {
      console.error('Database error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: `Database error: ${error.message}`
      })
    }

    return {
      success: true,
      order: data[0]
    }

  } catch (error: any) {
    console.error('Order creation failed:', error)
    
    if (error.statusCode) {
      throw error // Re-throw HTTP errors
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to create order: ${error.message}`
    })
  }
}) 