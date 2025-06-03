export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validate required fields
    const requiredFields = [
      'organizationName', 
      'organizationType', 
      'contactName', 
      'jobTitle', 
      'email', 
      'country', 
      'expectedVolume'
    ]
    
    for (const field of requiredFields) {
      if (!body[field]) {
        throw createError({
          statusCode: 400,
          statusMessage: `Missing required field: ${field}`
        })
      }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format'
      })
    }
    
    // Get Supabase client using the Nuxt pattern
    const supabase = serverSupabaseClient(event)
    
    // Prepare data for insertion (following existing naming patterns)
    const signupData = {
      organization_name: body.organizationName,
      organization_type: body.organizationType,
      contact_name: body.contactName,
      job_title: body.jobTitle,
      email: body.email.toLowerCase().trim(),
      phone: body.phone || null,
      website: body.website || null,
      country: body.country,
      expected_volume: body.expectedVolume,
      certifications_interest: body.certifications || [],
      description: body.description || null,
      status: 'pending'
      // created_at will be set automatically by the database default
    }
    
    // Insert into database
    const { data, error } = await supabase
      .from('bulk_access_requests')
      .insert([signupData])
      .select()
    
    if (error) {
      console.error('Database error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to submit application'
      })
    }
    
    // TODO: Send notification email to admin team
    // TODO: Send confirmation email to applicant
    
    return {
      success: true,
      message: 'Application submitted successfully',
      data: data[0]
    }
    
  } catch (error) {
    console.error('Signup API error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
}) 