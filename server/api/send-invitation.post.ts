import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, role, invitedBy } = body

    // Validate input
    if (!email || !role) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and role are required'
      })
    }

    const config = useRuntimeConfig()
    
    // Check if Resend API key is configured
    if (!config.resendApiKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Email service not configured'
      })
    }

    // Initialize Resend
    const resend = new Resend(config.resendApiKey)

    // Use service role to create admin record
    const supabase = createClient(
      config.public.supabaseUrl,
      config.supabaseServiceRoleKey
    )

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User with this email already exists'
      })
    }

    // Create admin user record with pending status
    const { data: adminUser, error: dbError } = await supabase
      .from('admin_users')
      .insert({
        email,
        role,
        status: 'pending',
        invited_by: invitedBy,
        invited_at: new Date().toISOString()
      })
      .select()
      .single()

    if (dbError) {
      throw createError({
        statusCode: 500,
        statusMessage: `Database error: ${dbError.message}`
      })
    }

    // Generate invitation token (simple approach using the user ID and timestamp)
    const invitationToken = Buffer.from(`${adminUser.id}:${Date.now()}`).toString('base64')

    // Create signup URL 
    const signupUrl = `${getHeader(event, 'origin') || 'https://order-system-modernization.vercel.app'}/admin/signup?token=${invitationToken}&email=${encodeURIComponent(email)}`

    // Send invitation email
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Certificates.dev Team <noreply@certificates.dev>',
      to: [email],
      subject: 'Admin Account Invitation - Certificates.dev',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Admin Invitation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1f2937, #1e40af, #1f2937); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Certificates.dev</h1>
            <p style="color: #93c5fd; margin: 10px 0 0 0; font-size: 16px;">Professional Developer Certifications</p>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <h2 style="color: #1f2937; margin-top: 0;">You've been invited to join as an admin!</h2>
            
            <p>Hello,</p>
            
            <p>You've been invited to join the Certificates.dev admin team with <strong>${role.replace('_', ' ')}</strong> privileges.</p>
            
            <p>To accept this invitation and set up your admin account, please click the button below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${signupUrl}" 
                 style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
                Accept Invitation & Create Account
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Or copy and paste this link into your browser:<br>
              <span style="color: #3b82f6; word-break: break-all;">${signupUrl}</span>
            </p>
            
            <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                This invitation will expire in 48 hours. If you didn't expect this invitation, you can safely ignore this email.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px;">
            <p>© 2025 Certificates.dev - Professional Developer Certifications</p>
          </div>
        </body>
        </html>
      `
    })

    if (emailError) {
      // Clean up the database record if email fails
      await supabase
        .from('admin_users')
        .delete()
        .eq('id', adminUser.id)
      
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to send invitation email: ${emailError.message}`
      })
    }

    return {
      success: true,
      message: `Invitation sent successfully to ${email}`,
      emailId: emailData?.id
    }

  } catch (error: any) {
    console.error('Send invitation error:', error)
    
    // Return structured error
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to send invitation'
    })
  }
}) 