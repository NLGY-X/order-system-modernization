import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { productName, countryName, quantity } = body
    
    // Validate input
    if (!productName || !countryName || !quantity) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
      })
    }

    const quantityNum = typeof quantity === 'number' ? quantity : parseInt(quantity)
    if (isNaN(quantityNum) || quantityNum <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid quantity'
      })
    }

    const config = useRuntimeConfig()
    
    // Use service role key to bypass RLS issues
    const supabase = createClient(
      config.public.supabaseUrl,
      config.supabaseServiceRoleKey
    )

    // Calculate the unit price
    const result = await calculatePriceFromDatabase(productName, countryName, quantityNum, supabase)

    return {
      success: true,
      unitPrice: result.unitPrice,
      volumeDiscount: result.volumeDiscount,
      pppDiscount: result.pppDiscount
    }

  } catch (error: any) {
    console.error('Pricing calculation failed:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to calculate pricing: ${error.message}`
    })
  }
})

// Enhanced pricing calculation that returns discount information
async function calculatePriceFromDatabase(productName: string, countryName: string, quantity: number, supabase: any) {
  try {
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

    // Determine quantity tier and volume discount
    let minQuantity, maxQuantity, volumeDiscount
    if (quantity >= 1 && quantity <= 100) {
      minQuantity = 1
      maxQuantity = 100
      volumeDiscount = 1.0
    } else if (quantity >= 101 && quantity <= 400) {
      minQuantity = 101
      maxQuantity = 400
      volumeDiscount = 0.95
    } else if (quantity >= 401 && quantity <= 800) {
      minQuantity = 401
      maxQuantity = 800
      volumeDiscount = 0.90
    } else if (quantity >= 801) {
      minQuantity = 801
      maxQuantity = null
      volumeDiscount = 0.85
    } else {
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

    // Determine PPP discount
    const pppDiscounts: Record<string, number> = {
      'Global': 1.0,
      'Tier 1': 0.8,
      'Tier 2': 0.65,
      'Tier 3': 0.5
    }
    const pppDiscount = pppDiscounts[pppTier] || 1.0

    console.log('Database price found:', {
      productName,
      country: countryName,
      quantity,
      pppTier,
      price: priceData.price_usd,
      volumeDiscount,
      pppDiscount
    })

    return {
      unitPrice: priceData.price_usd,
      volumeDiscount,
      pppDiscount
    }

  } catch (error) {
    console.error('Database pricing lookup failed:', error)
    return getFallbackPrice(productName, countryName, quantity)
  }
}

// Fallback pricing function that returns discount info
function getFallbackPrice(productName: string, countryName: string, quantity: number) {
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

  let basePrice = basePrices[productName] || 100 // Default fallback

  // Apply quantity-based volume discounts
  let volumeDiscount = 1.0 // No discount by default
  if (quantity >= 1 && quantity <= 100) {
    volumeDiscount = 1.0 // No volume discount
  } else if (quantity >= 101 && quantity <= 400) {
    volumeDiscount = 0.95 // 5% volume discount
  } else if (quantity >= 401 && quantity <= 800) {
    volumeDiscount = 0.90 // 10% volume discount
  } else if (quantity >= 801) {
    volumeDiscount = 0.85 // 15% volume discount
  }

  // Apply PPP-based regional discounts
  let pppDiscount = 1.0 // Global pricing by default
  
  // Define PPP discount tiers by country
  const tier1Countries = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia', 'Japan', 'Switzerland', 'Netherlands', 'Sweden', 'Norway', 'Denmark']
  const tier2Countries = ['Poland', 'Hungary', 'Czech Republic', 'Slovakia', 'Slovenia', 'Estonia', 'Lithuania', 'Latvia', 'Croatia', 'Portugal', 'Greece', 'Spain', 'Italy']
  const tier3Countries = ['India', 'Brazil', 'Mexico', 'Argentina', 'Colombia', 'Philippines', 'Thailand', 'Vietnam', 'Ukraine', 'Romania', 'Bulgaria', 'Turkey']

  if (tier1Countries.includes(countryName)) {
    pppDiscount = 0.8 // 20% PPP discount
  } else if (tier2Countries.includes(countryName)) {
    pppDiscount = 0.65 // 35% PPP discount
  } else if (tier3Countries.includes(countryName)) {
    pppDiscount = 0.5 // 50% PPP discount
  }

  const finalPrice = Math.round((basePrice * volumeDiscount * pppDiscount) * 100) / 100

  console.log('Fallback pricing calculation:', {
    productName,
    countryName,
    quantity,
    basePrice,
    volumeDiscount,
    pppDiscount,
    finalPrice
  })

  return {
    unitPrice: finalPrice,
    volumeDiscount,
    pppDiscount
  }
} 