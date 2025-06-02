import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export interface StripeSessionResult {
  checkoutUrl: string;
  sessionId: string;
}

export async function createStripeSession(orderId: string, totalPrice: number): Promise<StripeSessionResult> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')!
  
  if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set')
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Get order details for the line item
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select(`
      id,
      customer_email,
      quantity,
      products!inner(name)
    `)
    .eq('id', orderId)
    .single()

  if (orderError || !order) {
    throw new Error(`Order not found: ${orderId}`)
  }

  // Convert total price to cents (Stripe expects amounts in smallest currency unit)
  const amountInCents = Math.round(totalPrice * 100)

  // Create Stripe checkout session
  const stripePayload = {
    payment_method_types: ['card'],
    mode: 'payment',
    currency: 'usd',
    customer_email: order.customer_email,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: order.products.name,
            description: `Quantity: ${order.quantity}`
          },
          unit_amount: Math.round(amountInCents / order.quantity)
        },
        quantity: order.quantity
      }
    ],
    metadata: {
      order_id: orderId
    },
    success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://example.com/cancel'
  }

  try {
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'payment_method_types[]': 'card',
        'mode': 'payment',
        'currency': 'usd',
        'customer_email': order.customer_email,
        'line_items[0][price_data][currency]': 'usd',
        'line_items[0][price_data][product_data][name]': order.products.name,
        'line_items[0][price_data][product_data][description]': `Quantity: ${order.quantity}`,
        'line_items[0][price_data][unit_amount]': Math.round(amountInCents / order.quantity).toString(),
        'line_items[0][quantity]': order.quantity.toString(),
        'metadata[order_id]': orderId,
        'success_url': 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
        'cancel_url': 'https://example.com/cancel'
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Stripe API error: ${response.status} - ${errorText}`)
    }

    const session = await response.json()

    if (!session.url) {
      throw new Error('Stripe session created but no URL returned')
    }

    // Update the order with the Stripe checkout URL
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        stripe_checkout_url: session.url
      })
      .eq('id', orderId)

    if (updateError) {
      throw new Error(`Failed to update order with Stripe URL: ${updateError.message}`)
    }

    return {
      checkoutUrl: session.url,
      sessionId: session.id
    }

  } catch (error) {
    console.error('Stripe session creation failed:', error)
    throw new Error(`Failed to create Stripe checkout session: ${error.message}`)
  }
} 