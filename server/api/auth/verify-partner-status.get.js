import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  // 1. Check for critical configuration
  if (!config.public.supabaseUrl || !config.public.supabaseAnonKey || !config.supabaseServiceRoleKey) {
    console.error('Supabase critical keys are not configured in runtimeConfig for API route /api/auth/verify-partner-status.')
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
    if (authError) console.error('Error getting user with token:', authError.message)
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized: Invalid or expired token' })
  }

  // 4. User token is valid. Check if this user is a recognized partner OR admin using service_role key.
  const supabaseServiceRoleClient = createClient(config.public.supabaseUrl, config.supabaseServiceRoleKey)
  
  try {
    // First, check if user is a partner
    const { data: partnerRecord, error: partnerCheckError } = await supabaseServiceRoleClient
      .from('partner_users')
      .select('id, email, organization_name, contact_name, role, status, volume_tier, auth_id')
      .eq('auth_id', user.id)
      .eq('status', 'active')
      .single()

    console.log('Fetched partnerRecord for auth_id', user.id, ':', JSON.stringify(partnerRecord));

    // If partner found and active, return partner data
    if (partnerRecord && partnerRecord.status === 'active') {
      console.log('Partner status verified for user:', partnerRecord.email, 'Status:', partnerRecord.status);
      return { 
        isPartner: true, 
        partnerUser: {
          id: partnerRecord.id,
          email: partnerRecord.email,
          organization_name: partnerRecord.organization_name,
          contact_name: partnerRecord.contact_name,
          role: partnerRecord.role,
          volume_tier: partnerRecord.volume_tier,
          auth_id: partnerRecord.auth_id,
          user_type: 'partner'
        } 
      }
    }

    // If no partner found (PGRST116 is expected), check if user is an admin
    if (partnerCheckError?.code === 'PGRST116') {
      console.log('No partner record found, checking if user is an admin...');
      
      const { data: adminRecord, error: adminCheckError } = await supabaseServiceRoleClient
        .from('admin_users')
        .select('id, email, role, status, auth_id')
        .eq('auth_id', user.id)
        .eq('status', 'active')
        .single()

      console.log('Fetched adminRecord for auth_id', user.id, ':', JSON.stringify(adminRecord));

      if (adminRecord && adminRecord.status === 'active') {
        console.log('Admin accessing partner system:', adminRecord.email, 'Status:', adminRecord.status);
        return { 
          isPartner: true, // Grant partner access to admins
          partnerUser: {
            id: adminRecord.id,
            email: adminRecord.email,
            organization_name: 'Admin Access', // Placeholder organization
            contact_name: adminRecord.email,
            role: 'admin_as_partner',
            volume_tier: 'enterprise', // Give admins best pricing tier
            auth_id: adminRecord.auth_id,
            user_type: 'admin'
          } 
        }
      }

      if (adminCheckError?.code === 'PGRST116') {
        return { isPartner: false, message: 'User is not a recognized active partner or admin.' }
      }

      if (adminCheckError) {
        console.error("Error checking admin_users table:", adminCheckError.message)
        throw createError({ statusCode: 500, statusMessage: 'Error verifying admin status.' })
      }
    }

    // Handle other partner check errors
    if (partnerCheckError && partnerCheckError.code !== 'PGRST116') {
      console.error("Error checking partner_users table:", partnerCheckError.message)
      throw createError({ statusCode: 500, statusMessage: 'Error verifying partner status.' })
    }

    return { isPartner: false, message: 'User is not a recognized active partner or admin.' }

  } catch (error) {
    console.error('Unexpected error in verify-partner-status:', error.message)
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: 'An unexpected error occurred while verifying partner status.' })
  }
}) 