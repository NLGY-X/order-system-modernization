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

    // Get product pricing from database
    const unitPrice = await calculatePriceFromDatabase(orderData.product_name, orderData.country_name, orderData.quantity)
    
    if (!unitPrice || unitPrice <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Unable to calculate price for the selected product and country'
      })
    }

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

// Enhanced pricing function that queries the database
async function calculatePriceFromDatabase(productName: string, countryName: string, quantity: number): Promise<number> {
  try {
    const config = useRuntimeConfig()
    const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceRoleKey)

    // First, get the product ID
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('name', productName)
      .single()

    if (productError || !productData) {
      console.error('Product not found:', productName, productError)
      return getFallbackPrice(productName, countryName, quantity)
    }

    // Get the country's PPP tier
    const { data: countryData, error: countryError } = await supabase
      .from('ppp_classifications')
      .select('ppp_tier')
      .eq('country_name', countryName)
      .single()

    // If country not found, use Global pricing
    const pppTier = countryData?.ppp_tier || 'Global'

    // Determine quantity tier
    let minQuantity, maxQuantity
    if (quantity >= 1 && quantity <= 100) {
      minQuantity = 1
      maxQuantity = 100
    } else if (quantity >= 101 && quantity <= 400) {
      minQuantity = 101
      maxQuantity = 400
    } else if (quantity >= 401 && quantity <= 800) {
      minQuantity = 401
      maxQuantity = 800
    } else if (quantity >= 801) {
      minQuantity = 801
      maxQuantity = null
    } else {
      // Invalid quantity
      return getFallbackPrice(productName, countryName, quantity)
    }

    // Query for the specific price
    const priceQuery = supabase
      .from('product_prices')
      .select('price_usd')
      .eq('product_id', productData.id)
      .eq('ppp_tier', pppTier)
      .eq('min_quantity', minQuantity)

    if (maxQuantity !== null) {
      priceQuery.eq('max_quantity', maxQuantity)
    } else {
      priceQuery.is('max_quantity', null)
    }

    const { data: priceData, error: priceError } = await priceQuery.single()

    if (priceError || !priceData) {
      console.error('Price not found for:', {
        productName,
        productId: productData.id,
        pppTier,
        minQuantity,
        maxQuantity,
        error: priceError
      })
      return getFallbackPrice(productName, countryName, quantity)
    }

    console.log('Database price found:', {
      productName,
      country: countryName,
      quantity,
      pppTier,
      price: priceData.price_usd
    })

    return priceData.price_usd

  } catch (error) {
    console.error('Database pricing lookup failed:', error)
    return getFallbackPrice(productName, countryName, quantity)
  }
}

// Fallback pricing function for backward compatibility and when database lookup fails
function getFallbackPrice(productName: string, countryName: string, quantity: number): number {
  console.log('Using fallback pricing for:', productName)
  
  // Enhanced base prices including new products
  const basePrices: Record<string, number> = {
    // Existing products
    'Certified Junior Angular Developer': 62.10,
    'Certified Mid-Level Angular Developer': 134.25,
    'CJAD + Self-Learning Bundle': 89.10,
    'CMAD + Self-Learning Bundle': 283.50,
    
    // New Vue products
    'Vue Mid: Voucher Only': 220.00,
    'Vue Mid: Voucher + Preparation': 499.00,
    'Vue Mid: Voucher + Preparation + Bootcamp': 999.00,
    'Vue Mid + Senior: Voucher Only': 499.00,
    'Vue Mid + Senior: Voucher + Preparation': 1057.00,
    'Vue Mid + Senior: Voucher + Preparation + Bootcamp': 2257.00,
    
    // New Nuxt products
    'Nuxt Mid: Voucher Only': 220.00,
    'Nuxt Mid: Voucher + Preparation': 499.00,
    'Nuxt Mid: Voucher + Preparation + Bootcamp': 999.00,
    'Nuxt Mid + Senior: Voucher Only': 499.00,
    'Nuxt Mid + Senior: Voucher + Preparation': 1057.00,
    'Nuxt Mid + Senior: Voucher + Preparation + Bootcamp': 2257.00,
    
    // New Angular products
    'Angular Junior: Voucher Only': 69.00,
    'Angular Junior: Voucher + Preparation': 99.00,
    'Angular Mid: Voucher Only': 179.00,
    'Angular Mid: Voucher + Preparation': 378.00,
    'Angular Mid: Voucher + Preparation + Bootcamp': 999.00,
    'Angular Mid + Senior: Voucher Only': 398.00,
    'Angular Mid + Senior: Voucher + Preparation': 796.00,
    'Angular Mid + Senior: Voucher + Preparation + Bootcamp': 2166.00,
    
    // New JavaScript products
    'JavaScript Junior: Voucher Only': 69.00,
    'JavaScript Junior: Voucher + Preparation': 99.00,
    'JavaScript Mid: Voucher Only': 179.00,
    'JavaScript Mid: Voucher + Preparation': 378.00,
    'JavaScript Mid: Voucher + Preparation + Bootcamp': 999.00,
    'JavaScript Mid + Senior: Voucher Only': 398.00,
    'JavaScript Mid + Senior: Voucher + Preparation': 796.00,
    'JavaScript Mid + Senior: Voucher + Preparation + Bootcamp': 2166.00
  }

  const basePrice = basePrices[productName] || 100.00

  // Apply volume discounts
  let volumeDiscount = 1.0
  if (quantity >= 101 && quantity <= 400) {
    volumeDiscount = 0.95 // 5% off
  } else if (quantity >= 401 && quantity <= 800) {
    volumeDiscount = 0.90 // 10% off
  } else if (quantity >= 801) {
    volumeDiscount = 0.85 // 15% off
  }

  // Apply PPP pricing
  const pppMultipliers: Record<string, number> = {
    'Tier 1': 0.8,   // 20% off
    'Tier 2': 0.65,  // 35% off
    'Tier 3': 0.5,   // 50% off
  }

  // Country to PPP tier mapping (simplified)
  const lowCostCountries = ['India', 'Bangladesh', 'Pakistan', 'Nigeria', 'Egypt', 'Vietnam', 'Philippines']
  const mediumCostCountries = ['Brazil', 'Mexico', 'Poland', 'Turkey', 'South Africa', 'Argentina', 'Ukraine']
  const tier1Countries = ['Russia', 'China', 'Malaysia', 'Thailand', 'Romania', 'Bulgaria']
  
  let pppMultiplier = 1.0 // Global pricing
  if (lowCostCountries.includes(countryName)) {
    pppMultiplier = pppMultipliers['Tier 3'] // 50% off
  } else if (mediumCostCountries.includes(countryName)) {
    pppMultiplier = pppMultipliers['Tier 2'] // 35% off
  } else if (tier1Countries.includes(countryName)) {
    pppMultiplier = pppMultipliers['Tier 1'] // 20% off
  }

  const finalPrice = Math.round((basePrice * volumeDiscount * pppMultiplier) * 100) / 100
  
  console.log('Fallback pricing calculation:', {
    productName,
    basePrice,
    volumeDiscount,
    pppMultiplier,
    finalPrice
  })

  return finalPrice
} 