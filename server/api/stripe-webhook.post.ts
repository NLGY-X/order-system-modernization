import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  const stripe = new Stripe(config.stripeSecretKey, {
    apiVersion: '2025-05-28.basil',
  })

  const sig = getHeader(event, 'stripe-signature')
  const webhookSecret = config.stripeWebhookSecret

  let stripeEvent: Stripe.Event

  try {
    const body = await readRawBody(event)
    stripeEvent = stripe.webhooks.constructEvent(body!, sig!, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    throw createError({
      statusCode: 400,
      statusMessage: 'Webhook signature verification failed'
    })
  }

  // Handle the event
  switch (stripeEvent.type) {
    case 'checkout.session.completed':
      const session = stripeEvent.data.object as Stripe.Checkout.Session
      await handleSuccessfulPayment(session, config)
      break
    
    case 'payment_intent.payment_failed':
      const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent
      await handleFailedPayment(paymentIntent)
      break
    
    default:
      console.log(`Unhandled event type ${stripeEvent.type}`)
  }

  return { received: true }
})

async function handleSuccessfulPayment(session: Stripe.Checkout.Session, config: any) {
  try {
    const orderId = session.metadata?.order_id
    if (!orderId) {
      console.error('No order_id in session metadata')
      return
    }

    // Update order status in Supabase
    const supabase = createClient(
      config.public.supabaseUrl,
      config.supabaseServiceRoleKey
    )

    const { error } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent,
        paid_at: new Date().toISOString(),
        total_price_usd: (session.amount_total || 0) / 100, // Convert from cents
      })
      .eq('id', orderId)

    if (error) {
      console.error('Failed to update order status:', error)
      return
    }

    console.log(`Order ${orderId} marked as paid`)

    // TODO: Send confirmation email to customer
    // await sendOrderConfirmationEmail(session.metadata?.customer_email, orderId)

  } catch (error) {
    console.error('Error handling successful payment:', error)
  }
}

async function handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
  try {
    // You might want to update order status or send notification
    console.log(`Payment failed for payment intent: ${paymentIntent.id}`)
    
    // TODO: Update order status or notify customer of failed payment
    
  } catch (error) {
    console.error('Error handling failed payment:', error)
  }
} 