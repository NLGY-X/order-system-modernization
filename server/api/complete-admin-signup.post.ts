import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { token, email, password } = body

    if (!token || !email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Token, email, and password are required'
      })
    }

    const config = useRuntimeConfig()
    const supabase = createClient(
      config.public.supabaseUrl,
      config.supabaseServiceRoleKey
    )

    // Decode and verify token first
    let userId, timestamp
    try {
      const decoded = Buffer.from(token, 'base64').toString()
      const [id, ts] = decoded.split(':')
      userId = id
      timestamp = parseInt(ts)
    } catch {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid invitation token'
      })
    }

    // Check if token is expired (48 hours)
    const now = Date.now()
    const maxAge = 48 * 60 * 60 * 1000 // 48 hours in milliseconds
    if (now - timestamp > maxAge) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invitation has expired'
      })
    }

    // Get admin user record
    const { data: adminUser, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', userId)
      .eq('email', email)
      .eq('status', 'pending')
      .single()

    if (fetchError || !adminUser) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid invitation or invitation already used'
      })
    }

    // Validate password
    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 6 characters long'
      })
    }

    // Create Supabase Auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email confirmation since they came via invitation
      user_metadata: {
        role: adminUser.role,
        invited_by: adminUser.invited_by,
        admin_user_id: adminUser.id
      }
    })

    if (authError) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to create auth account: ${authError.message}`
      })
    }

    // Update admin user record to active with auth_id
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({
        auth_id: authData.user.id,
        status: 'active',
        activated_at: new Date().toISOString()
      })
      .eq('id', adminUser.id)

    if (updateError) {
      // Clean up auth user if database update fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to activate admin account: ${updateError.message}`
      })
    }

    return {
      success: true,
      message: 'Admin account created successfully! You can now log in.',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: adminUser.role
      }
    }

  } catch (error: any) {
    console.error('Complete admin signup error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to complete signup'
    })
  }
}) 