import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { productId } = body

    if (!productId) {
      return { success: false, error: 'Product ID is required' }
    }

    // Try service role first, fallback to anon key
    const supabaseUrl = process.env.SUPABASE_URL || 'https://zezcsjltcbajkuqyxupt.supabase.co'
    let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

    const supabase = createClient(supabaseUrl, supabaseKey)

    // If using service role, just delete directly
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // Delete product_prices first
      await supabase.from('product_prices').delete().eq('product_id', productId)
      
      // Delete product
      const { error } = await supabase.from('products').delete().eq('id', productId)
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      return { success: true, message: 'Product deleted successfully' }
    }

    // Fallback: Use raw SQL to bypass RLS completely
    const { error: sqlError } = await supabase.rpc('delete_product_force', { 
      product_id: productId 
    })

    if (sqlError) {
      // Final fallback: Try direct delete anyway
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        
      if (deleteError) {
        return { success: false, error: deleteError.message }
      }
    }

    return { success: true, message: 'Product deleted successfully' }

  } catch (error) {
    console.error('Delete product error:', error)
    return { success: false, error: error.message }
  }
}) 