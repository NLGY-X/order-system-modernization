import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    console.log('Received body:', body)
    
    const { email, productName, countryName, quantity } = body
    
    // Validate input
    if (!email || !productName || !countryName || !quantity) {
      console.error('Missing fields:', { email: !!email, productName: !!productName, countryName: !!countryName, quantity: !!quantity })
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

    // Ensure quantity is a valid number
    const quantityNum = typeof quantity === 'number' ? quantity : parseInt(quantity)
    if (isNaN(quantityNum) || quantityNum <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid quantity'
      })
    }

    const orderData = {
      email,
      product_name: productName,
      country_name: countryName,
      quantity: quantityNum,
      status: 'pending'
    }
    
    console.log('Inserting order:', orderData)

    // Insert the order
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()

    if (error) {
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: `Database error: ${error.message}`
      })
    }

    console.log('Order created successfully:', data)

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