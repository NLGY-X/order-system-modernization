import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { orderData, returnUrl } = body
    const config = useRuntimeConfig()

    // Initialize Stripe with secret key from runtime config
    const stripe = new Stripe(config.stripeSecretKey, {
      apiVersion: '2025-05-28.basil',
    })

    // Get product pricing - this would normally come from your database
    // For now, using a simple pricing calculation
    const unitPrice = calculatePrice(orderData.product_name, orderData.country_name, orderData.quantity)
    const totalAmount = Math.round(unitPrice * orderData.quantity * 100) // Convert to cents

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: orderData.product_name,
              description: `Certification for ${orderData.country_name} (Quantity: ${orderData.quantity})`,
            },
            unit_amount: Math.round(unitPrice * 100), // Convert to cents
          },
          quantity: orderData.quantity,
        },
      ],
      mode: 'payment',
      success_url: `${returnUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}/cancel`,
      customer_email: orderData.email,
      metadata: {
        order_id: orderData.id,
        customer_email: orderData.email,
        product_name: orderData.product_name,
        country_name: orderData.country_name,
        quantity: orderData.quantity.toString(),
      },
    })

    return {
      success: true,
      checkout_url: session.url,
      session_id: session.id
    }
  } catch (error) {
    console.error('Stripe checkout creation failed:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create checkout session'
    })
  }
})

// Simple pricing function - replace with your actual pricing logic
function calculatePrice(productName: string, countryName: string, quantity: number): number {
  // This is a simplified pricing model - replace with your actual database lookup
  const basePrices: Record<string, number> = {
    'Certified Junior Angular Developer': 62.10,
    'Certified Mid-Level Angular Developer': 134.25,
    'CJAD + Self-Learning Bundle': 89.10,
    'CMAD + Self-Learning Bundle': 283.50,
  }

  const basePrice = basePrices[productName] || 100.00

  // Apply PPP pricing (simplified)
  const pppMultipliers: Record<string, number> = {
    'PPP1': 0.8,
    'PPP2': 0.6,
    'PPP3': 0.5,
  }

  // You would normally look up the country's PPP tier from database
  // For now, applying a simple discount for some countries
  const lowCostCountries = ['India', 'Bangladesh', 'Pakistan', 'Nigeria', 'Egypt']
  const mediumCostCountries = ['Brazil', 'Mexico', 'Poland', 'Turkey', 'South Africa']
  
  let multiplier = 1.0 // Global pricing
  if (lowCostCountries.includes(countryName)) {
    multiplier = 0.5 // PPP3
  } else if (mediumCostCountries.includes(countryName)) {
    multiplier = 0.8 // PPP1
  }

  return basePrice * multiplier
} 