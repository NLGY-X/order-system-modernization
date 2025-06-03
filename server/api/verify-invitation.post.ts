import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { token, email } = body

    if (!token || !email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Token and email are required'
      })
    }

    const config = useRuntimeConfig()
    const supabase = createClient(
      config.public.supabaseUrl,
      config.supabaseServiceRoleKey
    )

    // Decode token to get user ID and timestamp
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
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', userId)
      .eq('email', email)
      .eq('status', 'pending')
      .single()

    if (error || !adminUser) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid invitation or invitation already used'
      })
    }

    return {
      success: true,
      invitation: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        invited_at: adminUser.invited_at
      }
    }

  } catch (error: any) {
    console.error('Verify invitation error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to verify invitation'
    })
  }
}) 