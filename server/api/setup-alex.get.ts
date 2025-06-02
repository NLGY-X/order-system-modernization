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

    const supabase = createClient(
      config.public.supabaseUrl,
      config.supabaseServiceRoleKey
    )

    const alexEmail = 'alex@vueschool.io'
    const alexPassword = 'VueSchool2024!'

    // Create Supabase Auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: alexEmail,
      password: alexPassword,
      email_confirm: true
    })

    if (authError && authError.message !== 'User already registered') {
      return {
        success: false,
        error: `Auth error: ${authError.message}`
      }
    }

    const userId = authData?.user?.id || null

    // Create or update admin_users record
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .upsert({
        email: alexEmail,
        auth_id: userId,
        role: 'admin',
        status: 'active'
      }, {
        onConflict: 'email'
      })
      .select()

    if (adminError) {
      return {
        success: false,
        error: `Admin setup error: ${adminError.message}`
      }
    }

    return {
      success: true,
      message: 'Alex is now set up as an admin!',
      credentials: {
        email: alexEmail,
        password: alexPassword,
        loginUrl: 'https://order-system-modernization.vercel.app/admin/login'
      }
    }

  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
}) 