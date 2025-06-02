import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { calculateOrderPrice } from '../shared/pricing-engine.ts'
import { createStripeSession } from '../shared/stripe-integration.ts'
import { sendConfirmationEmail } from '../shared/email-service.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function processOrder(orderId: string): Promise<void> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  console.log(`Starting order processing for order: ${orderId}`)

  try {
    // Step 1: Calculate pricing
    console.log('Step 1: Calculating order price...')
    const pricingResult = await calculateOrderPrice(orderId)
    console.log(`Pricing calculated: $${pricingResult.totalPrice} (${pricingResult.pppTier} tier)`)

    // Step 2: Create Stripe checkout session
    console.log('Step 2: Creating Stripe checkout session...')
    const stripeResult = await createStripeSession(orderId, pricingResult.totalPrice)
    console.log(`Stripe session created: ${stripeResult.sessionId}`)

    // Step 3: Send confirmation email
    console.log('Step 3: Sending confirmation email...')
    const emailResult = await sendConfirmationEmail(orderId)
    console.log(`Email sent: ${emailResult.messageId}`)

    // Step 4: Update order status to processed
    console.log('Step 4: Updating order status to processed...')
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'processed' })
      .eq('id', orderId)

    if (updateError) {
      throw new Error(`Failed to update order status: ${updateError.message}`)
    }

    console.log(`Order ${orderId} processed successfully`)

  } catch (error) {
    console.error(`Error processing order ${orderId}:`, error)

    // Update order status to error
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'error' })
      .eq('id', orderId)

    if (updateError) {
      console.error(`Failed to update order status to error:`, updateError)
    }

    throw error
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // This endpoint can be called manually or via webhook
    if (req.method === 'POST') {
      const { orderId } = await req.json()
      
      if (!orderId) {
        return new Response(
          JSON.stringify({ error: 'orderId is required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      await processOrder(orderId)

      return new Response(
        JSON.stringify({ message: 'Order processed successfully' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Process order endpoint error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 