import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    // Simulate the exact data the OrderForm would send
    const testData = {
      email: "test@orderform.com",
      productName: "Certified Junior Angular Developer", 
      countryName: "United States",
      quantity: 1
    }

    const config = useRuntimeConfig()
    
    if (!config.supabaseServiceRoleKey) {
      return {
        success: false,
        error: 'SUPABASE_SERVICE_ROLE_KEY missing'
      }
    }

    const supabase = createClient(
      config.public.supabaseUrl,
      config.supabaseServiceRoleKey
    )

    // Test the exact same logic as create-order
    const { email, productName, countryName, quantity } = testData
    
    if (!email || !productName || !countryName || !quantity) {
      return {
        success: false,
        error: 'Missing required fields'
      }
    }

    const quantityNum = typeof quantity === 'number' ? quantity : parseInt(quantity)
    if (isNaN(quantityNum) || quantityNum <= 0) {
      return {
        success: false,
        error: 'Invalid quantity'
      }
    }

    const orderData = {
      email,
      product_name: productName,
      country_name: countryName,
      quantity: quantityNum,
      status: 'pending'
    }

    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()

    if (error) {
      return {
        success: false,
        error: error.message,
        details: error,
        step: 'supabase_insert'
      }
    }

    // Clean up test order
    await supabase
      .from('orders')
      .delete()
      .eq('id', data[0].id)

    return {
      success: true,
      message: 'Order form simulation successful!',
      order: data[0],
      testData
    }

  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      type: 'exception',
      step: 'catch_block'
    }
  }
}) 