import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Configuration
const supabaseUrl = 'https://zezcsjltcbajkuqyxupt.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required')
  console.log('💡 You can set it by running:')
  console.log('   $env:SUPABASE_SERVICE_ROLE_KEY = "your_service_role_key"')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// New products with their base prices (Voucher Only pricing)
const newProducts = [
  // Vue Certifications
  { name: 'Vue Mid: Voucher Only', basePrice: 220.00 },
  { name: 'Vue Mid: Voucher + Preparation', basePrice: 499.00 },
  { name: 'Vue Mid: Voucher + Preparation + Bootcamp', basePrice: 999.00 },
  { name: 'Vue Mid + Senior: Voucher Only', basePrice: 499.00 },
  { name: 'Vue Mid + Senior: Voucher + Preparation', basePrice: 1057.00 },
  { name: 'Vue Mid + Senior: Voucher + Preparation + Bootcamp', basePrice: 2257.00 },
  
  // Nuxt Certifications
  { name: 'Nuxt Mid: Voucher Only', basePrice: 220.00 },
  { name: 'Nuxt Mid: Voucher + Preparation', basePrice: 499.00 },
  { name: 'Nuxt Mid: Voucher + Preparation + Bootcamp', basePrice: 999.00 },
  { name: 'Nuxt Mid + Senior: Voucher Only', basePrice: 499.00 },
  { name: 'Nuxt Mid + Senior: Voucher + Preparation', basePrice: 1057.00 },
  { name: 'Nuxt Mid + Senior: Voucher + Preparation + Bootcamp', basePrice: 2257.00 },
  
  // Angular Certifications
  { name: 'Angular Junior: Voucher Only', basePrice: 69.00 },
  { name: 'Angular Junior: Voucher + Preparation', basePrice: 99.00 },
  { name: 'Angular Mid: Voucher Only', basePrice: 179.00 },
  { name: 'Angular Mid: Voucher + Preparation', basePrice: 378.00 },
  { name: 'Angular Mid: Voucher + Preparation + Bootcamp', basePrice: 999.00 },
  { name: 'Angular Mid + Senior: Voucher Only', basePrice: 398.00 },
  { name: 'Angular Mid + Senior: Voucher + Preparation', basePrice: 796.00 },
  { name: 'Angular Mid + Senior: Voucher + Preparation + Bootcamp', basePrice: 2166.00 },
  
  // JavaScript Certifications
  { name: 'JavaScript Junior: Voucher Only', basePrice: 69.00 },
  { name: 'JavaScript Junior: Voucher + Preparation', basePrice: 99.00 },
  { name: 'JavaScript Mid: Voucher Only', basePrice: 179.00 },
  { name: 'JavaScript Mid: Voucher + Preparation', basePrice: 378.00 },
  { name: 'JavaScript Mid: Voucher + Preparation + Bootcamp', basePrice: 999.00 },
  { name: 'JavaScript Mid + Senior: Voucher Only', basePrice: 398.00 },
  { name: 'JavaScript Mid + Senior: Voucher + Preparation', basePrice: 796.00 },
  { name: 'JavaScript Mid + Senior: Voucher + Preparation + Bootcamp', basePrice: 2166.00 }
]

// Quantity tiers configuration (matching existing system)
const quantityTiers = [
  { min: 1, max: 100, volumeDiscount: 1.0 },     // No volume discount
  { min: 101, max: 400, volumeDiscount: 0.95 },  // 5% volume discount
  { min: 401, max: 800, volumeDiscount: 0.90 },  // 10% volume discount
  { min: 801, max: null, volumeDiscount: 0.85 }  // 15% volume discount
]

// PPP tiers configuration (matching existing system)
const pppTiers = {
  'Global': 1.0,      // No PPP discount
  'Tier 1': 0.8,      // 20% PPP discount
  'Tier 2': 0.65,     // 35% PPP discount
  'Tier 3': 0.5       // 50% PPP discount
}

// Function to calculate price with both volume and PPP discounts
function calculatePrice(basePrice, volumeDiscount, pppDiscount) {
  return Math.round((basePrice * volumeDiscount * pppDiscount) * 100) / 100
}

// Function to check if product already exists
async function checkProductExists(productName) {
  const { data, error } = await supabase
    .from('products')
    .select('id, name')
    .eq('name', productName)
    .single()

  return !error && data
}

// Function to add a single product with all pricing tiers
async function addProduct(productData) {
  console.log(`Adding product: ${productData.name}`)
  
  try {
    // Check if product already exists
    const existingProduct = await checkProductExists(productData.name)
    if (existingProduct) {
      console.log(`  ⚠️  Product already exists: ${productData.name} (ID: ${existingProduct.id})`)
      return 'exists'
    }

    // Insert product
    const { data: newProduct, error: createError } = await supabase
      .from('products')
      .insert({ 
        name: productData.name,
        description: `Certification package: ${productData.name}`
      })
      .select()
      .single()

    if (createError) {
      console.error(`Error creating product ${productData.name}:`, createError)
      return false
    }

    console.log(`  Product created with ID: ${newProduct.id}`)

    // Generate all pricing combinations
    const pricesToInsert = []

    quantityTiers.forEach(quantityTier => {
      Object.entries(pppTiers).forEach(([pppTierName, pppDiscount]) => {
        const price = calculatePrice(
          productData.basePrice, 
          quantityTier.volumeDiscount, 
          pppDiscount
        )

        pricesToInsert.push({
          product_id: newProduct.id,
          min_quantity: quantityTier.min,
          max_quantity: quantityTier.max,
          ppp_tier: pppTierName,
          price_usd: price
        })
      })
    })

    // Insert all pricing data
    const { error: pricingError } = await supabase
      .from('product_prices')
      .insert(pricesToInsert)

    if (pricingError) {
      console.error(`Error creating pricing for ${productData.name}:`, pricingError)
      // Try to clean up the product if pricing failed
      await supabase.from('products').delete().eq('id', newProduct.id)
      return false
    }

    console.log(`  ✅ Product ${productData.name} added successfully with ${pricesToInsert.length} pricing entries`)
    return true

  } catch (error) {
    console.error(`Exception adding product ${productData.name}:`, error)
    return false
  }
}

// Main function to add all products
async function addAllProducts() {
  console.log('🚀 Starting to add new certification products...')
  console.log(`📦 ${newProducts.length} products to add`)
  console.log('💰 Pricing structure:')
  console.log('   - Quantity tiers: 1-100, 101-400, 401-800, 801+')
  console.log('   - Volume discounts: 0%, 5%, 10%, 15%')
  console.log('   - PPP tiers: Global, Tier 1 (20% off), Tier 2 (35% off), Tier 3 (50% off)')
  console.log('')

  let successCount = 0
  let failCount = 0
  let existsCount = 0

  for (const product of newProducts) {
    const result = await addProduct(product)
    if (result === true) {
      successCount++
    } else if (result === 'exists') {
      existsCount++
    } else {
      failCount++
    }
    
    // Small delay to avoid overwhelming the database
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  console.log('')
  console.log('📊 Summary:')
  console.log(`   ✅ Successfully added: ${successCount} products`)
  console.log(`   ⚠️  Already existed: ${existsCount} products`)
  console.log(`   ❌ Failed to add: ${failCount} products`)
  console.log('')

  if (failCount === 0) {
    console.log('🎉 All new products processed successfully!')
    console.log('💡 Next steps:')
    console.log('   1. Verify products appear in the admin panel (/admin/products)')
    console.log('   2. Test ordering functionality')
    console.log('   3. Verify PPP and volume discounts are applied correctly')
  } else {
    console.log('⚠️  Some products failed to add. Check the errors above.')
  }
}

// Display pricing example for verification
function showPricingExample() {
  console.log('')
  console.log('📋 Pricing Example (Vue Mid: Voucher Only - $220.00):')
  console.log('┌─────────────┬─────────┬──────────┬──────────┬──────────┐')
  console.log('│ Quantity    │ Global  │ Tier 1   │ Tier 2   │ Tier 3   │')
  console.log('├─────────────┼─────────┼──────────┼──────────┼──────────┤')
  
  const exampleProduct = { basePrice: 220.00 }
  
  quantityTiers.forEach((tier, index) => {
    const qtyRange = tier.max ? `${tier.min}-${tier.max}` : `${tier.min}+`
    const prices = Object.entries(pppTiers).map(([tierName, discount]) => {
      return '$' + calculatePrice(exampleProduct.basePrice, tier.volumeDiscount, discount).toFixed(2)
    })
    
    console.log(`│ ${qtyRange.padEnd(11)} │ ${prices[0].padStart(7)} │ ${prices[1].padStart(8)} │ ${prices[2].padStart(8)} │ ${prices[3].padStart(8)} │`)
  })
  
  console.log('└─────────────┴─────────┴──────────┴──────────┴──────────┘')
  console.log('')
}

// Test database connection
async function testConnection() {
  try {
    const { data, error } = await supabase.from('products').select('count').limit(1)
    if (error) {
      console.error('❌ Database connection failed:', error.message)
      return false
    }
    console.log('✅ Database connection successful')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    return false
  }
}

// Run the script
async function main() {
  console.log('🔌 Testing database connection...')
  const connected = await testConnection()
  
  if (!connected) {
    console.log('')
    console.log('💡 To fix database connection:')
    console.log('   1. Get your service role key from Supabase dashboard')
    console.log('   2. Set environment variable: $env:SUPABASE_SERVICE_ROLE_KEY = "your_key"')
    console.log('   3. Run this script again')
    process.exit(1)
  }

  showPricingExample()
  await addAllProducts()
}

// Only run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export { addAllProducts, newProducts } 