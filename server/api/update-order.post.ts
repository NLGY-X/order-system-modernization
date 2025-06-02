import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { orderId, stripeCheckoutUrl, stripeSessionId } = body
    
    if (!orderId || !stripeCheckoutUrl || !stripeSessionId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
      })
    }

    const config = useRuntimeConfig()
    
    // Use service role key
    const supabase = createClient(
      config.public.supabaseUrl,
      config.supabaseServiceRoleKey
    )

    const { data, error } = await supabase
      .from('orders')
      .update({
        stripe_checkout_url: stripeCheckoutUrl,
        stripe_session_id: stripeSessionId
      })
      .eq('id', orderId)
      .select()

    if (error) {
      console.error('Update error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to update order: ${error.message}`
      })
    }

    return {
      success: true,
      order: data[0]
    }

  } catch (error: any) {
    console.error('Order update failed:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to update order: ${error.message}`
    })
  }
}) 