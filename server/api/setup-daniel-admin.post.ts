import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    
    if (!config.supabaseServiceRoleKey) {
      return {
        success: false,
        error: 'SUPABASE_SERVICE_ROLE_KEY missing. Please add it to your environment variables.'
      }
    }

    // Create admin client using service role
    const supabase = createClient(
      config.public.supabaseUrl,
      config.supabaseServiceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const danielEmail = 'daniel@vueschool.io'
    const danielPassword = 'VueSchool2024!'

    // Step 1: Check if user already exists in admin_users
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', danielEmail)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      return {
        success: false,
        error: `Failed to check existing admin: ${checkError.message}`,
        details: checkError
      }
    }

    if (existingAdmin) {
      return {
        success: false,
        error: 'Admin user with this email already exists'
      }
    }

    // Step 2: Create Supabase Auth user
    console.log('Creating Supabase Auth user for Daniel...')
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: danielEmail,
      password: danielPassword,
      email_confirm: true, // Skip email confirmation
      user_metadata: {
        role: 'admin',
        created_via: 'direct_admin_setup',
        created_at: new Date().toISOString()
      }
    })

    if (authError) {
      return {
        success: false,
        error: `Auth creation failed: ${authError.message}`,
        details: authError
      }
    }

    console.log('Auth user created:', authData.user?.id)

    // Step 3: Create admin_users record
    console.log('Creating admin_users record...')
    const { data: adminUserData, error: insertError } = await supabase
      .from('admin_users')
      .insert({
        email: danielEmail,
        auth_id: authData.user.id,
        role: 'admin',
        status: 'active',
        invited_by: 'system',
        last_login: null
      })
      .select()
      .single()

    if (insertError) {
      // If admin_users creation fails, clean up the auth user
      try {
        await supabase.auth.admin.deleteUser(authData.user.id)
      } catch (cleanupError) {
        console.error('Failed to cleanup auth user:', cleanupError)
      }

      return {
        success: false,
        error: `Failed to create admin_users record: ${insertError.message}`,
        details: insertError
      }
    }

    console.log('Admin user created successfully:', adminUserData.id)

    return {
      success: true,
      message: `Daniel has been successfully created as an admin user!`,
      details: {
        auth_user: {
          id: authData.user.id,
          email: authData.user.email,
          created_at: authData.user.created_at
        },
        admin_user: {
          id: adminUserData.id,
          email: adminUserData.email,
          role: adminUserData.role,
          status: adminUserData.status
        }
      },
      credentials: {
        email: danielEmail,
        password: danielPassword,
        login_url: '/admin/login'
      }
    }

  } catch (error: any) {
    console.error('Create Daniel admin error:', error)
    return {
      success: false,
      error: error.message,
      type: 'exception'
    }
  }
}) 