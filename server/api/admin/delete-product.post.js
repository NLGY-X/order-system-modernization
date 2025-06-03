import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const body = await readBody(event)
  const { productId } = body

  if (!productId) {
    throw createError({ statusCode: 400, statusMessage: 'Product ID is required' })
  }

  // --- AUTHENTICATION/AUTHORIZATION --- 
  const token = getHeader(event, 'authorization')?.split(' ')[1]
  console.log('Delete Product API - Received Token:', token ? 'Token Present' : 'Token MISSING');
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized: Missing token' })
  }

  if (!config.public.supabaseUrl || !config.public.supabaseAnonKey || !config.supabaseServiceRoleKey) {
    console.error('Supabase critical keys are not configured in runtimeConfig for API route.')
    throw createError({ statusCode: 500, statusMessage: 'Server configuration error (keys missing).' })
  }

  // Create a Supabase client with the user's token to verify them
  const supabaseUserClient = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  })

  const { data: { user }, error: authError } = await supabaseUserClient.auth.getUser()
  console.log('Delete Product API - Auth Error:', authError);
  console.log('Delete Product API - User from Token:', user);
  if (authError || !user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized: Invalid or expired token' })
  }

  // Check if the authenticated Supabase user is a recognized admin in the 'admin_users' table
  const supabaseServiceRoleClient = createClient(config.public.supabaseUrl, config.supabaseServiceRoleKey)
  const { data: adminRecord, error: adminCheckError } = await supabaseServiceRoleClient
    .from('admin_users')
    .select('id, status, role') // You might want to check the role as well if you have different admin levels
    .eq('auth_id', user.id)
    .eq('status', 'active')
    .single()

  if (adminCheckError || !adminRecord) {
    let message = 'Forbidden: You are not an authorized admin user.'
    if (adminCheckError && adminCheckError.code !== 'PGRST116') { // PGRST116: single row not found (expected)
        console.error("Error checking admin status:", adminCheckError);
        message = "Forbidden: Error verifying admin status."
    } else if (!adminRecord) {
        message = "Forbidden: Admin record not found or not active."
    }
    throw createError({ statusCode: 403, statusMessage: message })
  }
  // --- END AUTHENTICATION/AUTHORIZATION ---

  // User is now authenticated and authorized as an active admin.
  // Proceed with deleting the product using the `delete_product_force` RPC.

  try {
    const { error: rpcError } = await supabaseServiceRoleClient.rpc('delete_product_force', { 
      product_id: productId 
    })

    if (rpcError) {
      console.error('Error calling delete_product_force RPC:', rpcError)
      throw createError({ statusCode: 500, statusMessage: `Failed to delete product: ${rpcError.message}` })
    }
    
    return { success: true, message: 'Product deleted successfully via RPC' }

  } catch (error) {
    if (error.statusCode) { // If it's an error we threw with createError
      throw error;
    }
    console.error('Unhandled error during product deletion RPC call:', error)
    throw createError({ statusCode: 500, statusMessage: error.message || 'An unexpected error occurred during product deletion.' })
  }
}) 