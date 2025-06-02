import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    
    if (!config.supabaseServiceRoleKey) {
      return {
        success: false,
        error: 'SUPABASE_SERVICE_ROLE_KEY missing'
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

    const alexEmail = 'alex@vueschool.io'
    const alexPassword = 'VueSchool2024!'

    // Step 1: Create Supabase Auth user
    console.log('Creating Supabase Auth user for Alex...')
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: alexEmail,
      password: alexPassword,
      email_confirm: true, // Skip email confirmation
      user_metadata: {
        role: 'admin',
        invited_by: 'Daniel',
        created_for: 'Order System Admin Access'
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

    // Step 2: Check if admin_users record already exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', alexEmail)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means "not found"
      return {
        success: false,
        error: `Failed to check existing admin: ${checkError.message}`,
        details: checkError
      }
    }

    let adminUserData

    if (existingAdmin) {
      // Step 3a: Update existing admin_users record
      console.log('Updating existing admin_users record...')
      const { data: updateData, error: updateError } = await supabase
        .from('admin_users')
        .update({
          auth_id: authData.user.id,
          status: 'active',
          role: 'admin',
          last_login: null
        })
        .eq('id', existingAdmin.id)
        .select()
        .single()

      if (updateError) {
        return {
          success: false,
          error: `Failed to update admin_users: ${updateError.message}`,
          details: updateError
        }
      }

      adminUserData = updateData
      console.log('Admin user updated:', adminUserData.id)
    } else {
      // Step 3b: Create new admin_users record
      console.log('Creating new admin_users record...')
      const { data: insertData, error: insertError } = await supabase
        .from('admin_users')
        .insert({
          email: alexEmail,
          auth_id: authData.user.id,
          role: 'admin',
          status: 'active',
          invited_by: null,
          last_login: null
        })
        .select()
        .single()

      if (insertError) {
        return {
          success: false,
          error: `Failed to create admin_users record: ${insertError.message}`,
          details: insertError
        }
      }

      adminUserData = insertData
      console.log('Admin user created:', adminUserData.id)
    }

    return {
      success: true,
      message: 'Alex has been successfully set up as an admin user!',
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
        email: alexEmail,
        password: alexPassword,
        login_url: 'https://order-system-modernization.vercel.app/admin/login'
      }
    }

  } catch (error: any) {
    console.error('Setup Alex admin error:', error)
    return {
      success: false,
      error: error.message,
      type: 'exception'
    }
  }
}) 