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

    // Create admin client
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

    // Create user for alex@vueschool.io
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'alex@vueschool.io',
      password: 'VueSchool2024!',
      email_confirm: true, // Skip email confirmation
      user_metadata: {
        role: 'admin',
        invited_by: 'Daniel',
        created_for: 'Order System Access'
      }
    })

    if (error) {
      return {
        success: false,
        error: error.message,
        details: error
      }
    }

    return {
      success: true,
      message: 'User created successfully for alex@vueschool.io',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        created_at: data.user?.created_at
      },
      credentials: {
        email: 'alex@vueschool.io',
        password: 'VueSchool2024!',
        login_url: config.public.supabaseUrl.replace('https://', 'https://').replace('.supabase.co', '.supabase.co/auth/v1/verify')
      }
    }

  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      type: 'exception'
    }
  }
}) 