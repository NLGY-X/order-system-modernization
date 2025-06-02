import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export interface EmailResult {
  messageId: string;
  success: boolean;
}

export async function sendConfirmationEmail(orderId: string): Promise<EmailResult> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const resendApiKey = Deno.env.get('RESEND_API_KEY')!
  
  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set')
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Get order details for the email
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select(`
      id,
      customer_email,
      quantity,
      calculated_total_price,
      stripe_checkout_url,
      products!inner(name)
    `)
    .eq('id', orderId)
    .single()

  if (orderError || !order) {
    throw new Error(`Order not found: ${orderId}`)
  }

  if (!order.stripe_checkout_url) {
    throw new Error('Order does not have a Stripe checkout URL')
  }

  // Create email content
  const subject = `Order Confirmation for ${order.products.name}`
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .order-details { background-color: #ffffff; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .payment-button { display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .footer { font-size: 14px; color: #6c757d; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Order Confirmation</h1>
        <p>Thank you for your order! Please review the details below and complete your payment.</p>
      </div>
      
      <div class="order-details">
        <h2>Order Details</h2>
        <p><strong>Product:</strong> ${order.products.name}</p>
        <p><strong>Quantity:</strong> ${order.quantity}</p>
        <p><strong>Total Price:</strong> $${order.calculated_total_price?.toFixed(2) || 'Calculating...'}</p>
        <p><strong>Order ID:</strong> ${order.id}</p>
      </div>
      
      <div style="text-align: center;">
        <a href="${order.stripe_checkout_url}" class="payment-button">Complete Payment</a>
      </div>
      
      <div class="footer">
        <p>This payment link is secure and processed by Stripe. If you have any questions about your order, please contact our support team.</p>
        <p><em>Please complete your payment within 24 hours to secure your order.</em></p>
      </div>
    </body>
    </html>
  `

  const textContent = `
Order Confirmation for ${order.products.name}

Thank you for your order! Please review the details below and complete your payment.

Order Details:
- Product: ${order.products.name}
- Quantity: ${order.quantity}
- Total Price: $${order.calculated_total_price?.toFixed(2) || 'Calculating...'}
- Order ID: ${order.id}

Complete your payment here: ${order.stripe_checkout_url}

This payment link is secure and processed by Stripe. If you have any questions about your order, please contact our support team.

Please complete your payment within 24 hours to secure your order.
  `

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: [order.customer_email],
        subject: subject,
        html: htmlContent,
        text: textContent
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Resend API error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()

    console.log(`Email sent successfully to ${order.customer_email} for order ${orderId}`)

    return {
      messageId: result.id,
      success: true
    }

  } catch (error) {
    console.error('Email sending failed:', error)
    throw new Error(`Failed to send confirmation email: ${error.message}`)
  }
} 