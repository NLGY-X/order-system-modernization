import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { productId } = body

    if (!productId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product ID is required'
      })
    }

    // Use service role key - bypasses RLS completely
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Delete product_prices first (foreign key constraint)
    const { error: pricesError } = await supabaseAdmin
      .from('product_prices')
      .delete()
      .eq('product_id', productId)

    if (pricesError) {
      console.warn('Error deleting product prices:', pricesError.message)
      // Continue anyway - prices might not exist
    }

    // Delete the product using admin client
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', productId)

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to delete product: ${error.message}`
      })
    }

    return { success: true, message: 'Product deleted successfully' }
    
  } catch (error) {
    console.error('Delete product error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  }
}) 