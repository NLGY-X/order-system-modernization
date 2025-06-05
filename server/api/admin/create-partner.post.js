import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  // Only allow POST requests
  if (event.node.req.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    // Get request body
    const body = await readBody(event)
    const { organization_name, contact_name, email, password, volume_tier, notes } = body

    // Validate required fields
    if (!organization_name || !contact_name || !email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format'
      })
    }

    // Use service role client to create user and bypass RLS
    const supabase = serverSupabaseServiceRole(event)

    // Check if email already exists in partner_users
    const { data: existingPartner } = await supabase
      .from('partner_users')
      .select('email')
      .eq('email', email)
      .single()

    if (existingPartner) {
      throw createError({
        statusCode: 400,
        statusMessage: 'A partner with this email already exists'
      })
    }

    // Create user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Auto-confirm email
    })

    if (authError) {
      console.error('Auth creation error:', authError)
      throw createError({
        statusCode: 400,
        statusMessage: authError.message || 'Failed to create user account'
      })
    }

    if (!authUser.user) {
      throw createError({
        statusCode: 500,
        statusMessage: 'User creation succeeded but no user data returned'
      })
    }

    // Create partner record in partner_users table
    const partnerData = {
      id: authUser.user.id,
      email,
      organization_name,
      contact_name,
      volume_tier: volume_tier || 'standard',
      status: 'active',
      notes: notes || null,
      created_at: new Date().toISOString(),
      last_login: null
    }

    const { data: partner, error: partnerError } = await supabase
      .from('partner_users')
      .insert([partnerData])
      .select()
      .single()

    if (partnerError) {
      console.error('Partner creation error:', partnerError)
      
      // If partner creation fails, clean up the auth user
      try {
        await supabase.auth.admin.deleteUser(authUser.user.id)
      } catch (cleanupError) {
        console.error('Failed to cleanup auth user:', cleanupError)
      }
      
      throw createError({
        statusCode: 500,
        statusMessage: partnerError.message || 'Failed to create partner record'
      })
    }

    // Return success response with partner data
    return {
      success: true,
      message: 'Partner created successfully',
      partner: {
        id: partner.id,
        email: partner.email,
        organization_name: partner.organization_name,
        contact_name: partner.contact_name,
        volume_tier: partner.volume_tier,
        status: partner.status,
        created_at: partner.created_at
      },
      credentials: {
        email,
        password // Return password so admin can share with partner
      }
    }

  } catch (error) {
    console.error('Create partner error:', error)
    
    // If it's already a createError, re-throw it
    if (error.statusCode) {
      throw error
    }
    
    // Otherwise, create a generic error
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal server error'
    })
  }
}) 