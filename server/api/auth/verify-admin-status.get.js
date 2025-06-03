import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  // 1. Check for critical configuration
  if (!config.public.supabaseUrl || !config.public.supabaseAnonKey || !config.supabaseServiceRoleKey) {
    console.error('Supabase critical keys are not configured in runtimeConfig for API route /api/auth/verify-admin-status.')
    throw createError({ statusCode: 500, statusMessage: 'Server configuration error (keys missing).' })
  }

  // 2. Get Bearer token from Authorization header
  const token = getHeader(event, 'authorization')?.split(' ')[1]
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized: Missing token' })
  }

  // 3. Create a Supabase client with the user's token to verify them
  const supabaseUserClient = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  })

  const { data: { user }, error: authError } = await supabaseUserClient.auth.getUser()

  if (authError || !user) {
    // Log the auth error for more insight on the server if needed
    if (authError) console.error('Error getting user with token:', authError.message)
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized: Invalid or expired token' })
  }

  // 4. User token is valid. Now, check if this user is a recognized admin using service_role key.
  const supabaseServiceRoleClient = createClient(config.public.supabaseUrl, config.supabaseServiceRoleKey)
  
  try {
    const { data: adminRecord, error: adminCheckError } = await supabaseServiceRoleClient
      .from('admin_users')
      .select('id, email, role, status, auth_id') // Select specific fields needed by useAdminAuth
      .eq('auth_id', user.id)
      .eq('status', 'active')
      .single()

    // Log the raw adminRecord and its status for detailed inspection
    console.log('Fetched adminRecord for auth_id', user.id, ':', JSON.stringify(adminRecord));
    if (adminRecord) {
      console.log('Type of adminRecord.status:', typeof adminRecord.status, '; Value:', "'" + adminRecord.status + "'");
    }

    if (adminCheckError) {
      // If error is "PGRST116" (single row not found), it means user is not an admin or not active.
      // This is not a server error, but an expected outcome for non-admins.
      if (adminCheckError.code === 'PGRST116') {
        return { isAdmin: false, message: 'User is not a recognized active admin.' }
      }
      // For other errors, log it and treat as a server issue.
      console.error("Error checking admin_users table:", adminCheckError.message)
      throw createError({ statusCode: 500, statusMessage: 'Error verifying admin status.' })
    }

    if (!adminRecord) {
      // Should be caught by PGRST116 if .single() is used, but as a fallback.
      return { isAdmin: false, message: 'Admin record not found or not active.' }
    }

    // 6. Check if admin user was found and is active
    if (adminRecord && adminRecord.status === 'active') {
      console.log('Admin status verified for user:', adminRecord.email, 'Status:', adminRecord.status);
      // User is an active admin
      return { 
        isAdmin: true, 
        adminUser: { // Return the necessary admin user details for the client-side composable
          id: adminRecord.id,
          email: adminRecord.email, // Ensure email is selected if needed by useAdminAuth
          role: adminRecord.role,
          auth_id: adminRecord.auth_id
        } 
      }
    }

  } catch (error) {
    // Catch any other unexpected errors
    console.error('Unexpected error in verify-admin-status:', error.message)
    if (error.statusCode) throw error; // Re-throw if it's a createError we made
    throw createError({ statusCode: 500, statusMessage: 'An unexpected error occurred while verifying admin status.' })
  }
}) 