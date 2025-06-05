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
    const { 
      organization_name, 
      organization_type, 
      contact_name, 
      job_title, 
      email, 
      phone, 
      website, 
      country, 
      expected_volume, 
      certifications_interest, 
      description 
    } = body

    // Validate required fields
    if (!organization_name || !organization_type || !contact_name || !job_title || !email || !country || !expected_volume) {
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

    // Get Supabase service role client
    const supabase = serverSupabaseServiceRole(event)

    // Check if application already exists for this email
    const { data: existingApplication, error: checkError } = await supabase
      .from('bulk_access_requests')
      .select('id, email, status')
      .eq('email', email)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking existing application:', checkError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Error checking existing application'
      })
    }

    if (existingApplication) {
      throw createError({
        statusCode: 409,
        statusMessage: `Application already exists for this email address. Status: ${existingApplication.status}`
      })
    }

    // Insert application into bulk_access_requests table
    const { data: newApplication, error: insertError } = await supabase
      .from('bulk_access_requests')
      .insert({
        organization_name,
        organization_type,
        contact_name,
        job_title,
        email,
        phone: phone || null,
        website: website || null,
        country,
        expected_volume,
        certifications_interest: certifications_interest || [],
        description: description || null,
        status: 'pending'
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting application:', insertError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to submit application'
      })
    }

    // Return success response
    return {
      success: true,
      message: 'Partner application submitted successfully',
      application_id: newApplication.id
    }

  } catch (error) {
    console.error('Partner application submission error:', error)
    
    // If it's already a createError, re-throw it
    if (error.statusCode) {
      throw error
    }
    
    // Otherwise, create a generic error
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
}) 