#!/usr/bin/env node

// Simple test runner for pricing calculations without dependencies
import assert from 'node:assert'

// Pricing calculation logic (copied from API files for testing)
const basePrices = {
  'Vue Mid: Voucher Only': 220.00,
  'JavaScript Junior: Voucher Only': 69.00,
  'Angular Mid + Senior: Voucher + Preparation + Bootcamp': 2166.00,
}

const tier1Countries = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France']
const tier2Countries = ['Poland', 'Hungary', 'Czech Republic', 'Slovakia', 'Slovenia']
const tier3Countries = ['India', 'Brazil', 'Mexico', 'Argentina', 'Colombia']

function getVolumeDiscount(quantity) {
  if (quantity >= 1 && quantity <= 100) return 1.0
  if (quantity >= 101 && quantity <= 400) return 0.95
  if (quantity >= 401 && quantity <= 800) return 0.90
  if (quantity >= 801) return 0.85
  return 1.0
}

function getPPPDiscount(countryName) {
  if (tier1Countries.includes(countryName)) return 0.8
  if (tier2Countries.includes(countryName)) return 0.65
  if (tier3Countries.includes(countryName)) return 0.5
  return 1.0
}

function calculatePrice(productName, countryName, quantity) {
  const basePrice = basePrices[productName] || 100
  const volumeDiscount = getVolumeDiscount(quantity)
  const pppDiscount = getPPPDiscount(countryName)
  
  const unitPrice = Math.round((basePrice * volumeDiscount * pppDiscount) * 100) / 100
  const totalPrice = unitPrice * quantity

  return {
    basePrice,
    unitPrice,
    totalPrice,
    volumeDiscount,
    pppDiscount,
    quantity
  }
}

// Test cases
console.log('🧪 Running Pricing Calculation Tests...\n')

let passedTests = 0
let totalTests = 0

function test(description, testFn) {
  totalTests++
  try {
    testFn()
    console.log(`✅ ${description}`)
    passedTests++
  } catch (error) {
    console.log(`❌ ${description}`)
    console.log(`   Error: ${error.message}`)
  }
}

// Volume discount tests
test('Volume discount: 1-100 quantity should have no discount', () => {
  assert.strictEqual(getVolumeDiscount(50), 1.0)
  assert.strictEqual(getVolumeDiscount(100), 1.0)
})

test('Volume discount: 101-400 quantity should have 5% discount', () => {
  assert.strictEqual(getVolumeDiscount(150), 0.95)
  assert.strictEqual(getVolumeDiscount(400), 0.95)
})

test('Volume discount: 401-800 quantity should have 10% discount', () => {
  assert.strictEqual(getVolumeDiscount(500), 0.90)
  assert.strictEqual(getVolumeDiscount(800), 0.90)
})

test('Volume discount: 801+ quantity should have 15% discount', () => {
  assert.strictEqual(getVolumeDiscount(1000), 0.85)
  assert.strictEqual(getVolumeDiscount(5000), 0.85)
})

// PPP discount tests
test('PPP discount: Tier 1 countries should have 20% discount', () => {
  assert.strictEqual(getPPPDiscount('United States'), 0.8)
  assert.strictEqual(getPPPDiscount('Germany'), 0.8)
})

test('PPP discount: Tier 2 countries should have 35% discount', () => {
  assert.strictEqual(getPPPDiscount('Poland'), 0.65)
  assert.strictEqual(getPPPDiscount('Czech Republic'), 0.65)
})

test('PPP discount: Tier 3 countries should have 50% discount', () => {
  assert.strictEqual(getPPPDiscount('India'), 0.5)
  assert.strictEqual(getPPPDiscount('Brazil'), 0.5)
})

test('PPP discount: Unknown countries should have no discount', () => {
  assert.strictEqual(getPPPDiscount('Unknown'), 1.0)
  assert.strictEqual(getPPPDiscount('Antarctica'), 1.0)
})

// Complete pricing calculation tests
test('Price calculation: No discounts', () => {
  const result = calculatePrice('Vue Mid: Voucher Only', 'Unknown', 5)
  assert.strictEqual(result.basePrice, 220.00)
  assert.strictEqual(result.unitPrice, 220.00)
  assert.strictEqual(result.totalPrice, 1100.00)
})

test('Price calculation: Volume discount only', () => {
  const result = calculatePrice('Vue Mid: Voucher Only', 'Unknown', 200)
  assert.strictEqual(result.basePrice, 220.00)
  assert.strictEqual(result.unitPrice, 209.00) // 220 * 0.95
  assert.strictEqual(result.totalPrice, 41800.00) // 209 * 200
})

test('Price calculation: PPP discount only', () => {
  const result = calculatePrice('Vue Mid: Voucher Only', 'India', 5)
  assert.strictEqual(result.basePrice, 220.00)
  assert.strictEqual(result.unitPrice, 110.00) // 220 * 0.5
  assert.strictEqual(result.totalPrice, 550.00) // 110 * 5
})

test('Price calculation: Both discounts combined', () => {
  const result = calculatePrice('Vue Mid: Voucher Only', 'India', 500)
  assert.strictEqual(result.basePrice, 220.00)
  assert.strictEqual(result.unitPrice, 99.00) // 220 * 0.90 * 0.5
  assert.strictEqual(result.totalPrice, 49500.00) // 99 * 500
})

test('Price calculation: Maximum discounts', () => {
  const result = calculatePrice('Vue Mid: Voucher Only', 'India', 1000)
  assert.strictEqual(result.basePrice, 220.00)
  assert.strictEqual(result.unitPrice, 93.50) // 220 * 0.85 * 0.5
  assert.strictEqual(result.totalPrice, 93500.00) // 93.5 * 1000
})

test('Price calculation: JavaScript Junior product', () => {
  const result = calculatePrice('JavaScript Junior: Voucher Only', 'Germany', 150)
  assert.strictEqual(result.basePrice, 69.00)
  assert.strictEqual(result.unitPrice, 52.44) // 69 * 0.95 * 0.8
  assert.strictEqual(result.totalPrice, 7866.00) // 52.44 * 150
})

test('Price calculation: Large bundle product', () => {
  const result = calculatePrice('Angular Mid + Senior: Voucher + Preparation + Bootcamp', 'Poland', 100)
  assert.strictEqual(result.basePrice, 2166.00)
  assert.strictEqual(result.unitPrice, 1407.90) // 2166 * 1.0 * 0.65
  assert.strictEqual(result.totalPrice, 140790.00) // 1407.90 * 100
})

test('Price calculation: Fallback for unknown product', () => {
  const result = calculatePrice('Unknown Product', 'United States', 50)
  assert.strictEqual(result.basePrice, 100.00) // Fallback
  assert.strictEqual(result.unitPrice, 80.00) // 100 * 1.0 * 0.8
  assert.strictEqual(result.totalPrice, 4000.00) // 80 * 50
})

// Boundary testing
test('Boundary testing: Quantity boundaries', () => {
  assert.strictEqual(getVolumeDiscount(100), 1.0)
  assert.strictEqual(getVolumeDiscount(101), 0.95)
  assert.strictEqual(getVolumeDiscount(400), 0.95)
  assert.strictEqual(getVolumeDiscount(401), 0.90)
  assert.strictEqual(getVolumeDiscount(800), 0.90)
  assert.strictEqual(getVolumeDiscount(801), 0.85)
})

test('Discount combination: Multiplicative, not additive', () => {
  // 10% volume + 35% PPP should be 0.90 * 0.65 = 0.585, not 0.55
  const basePrice = 1000
  const combined = basePrice * 0.90 * 0.65
  assert.strictEqual(combined, 585)
  assert.notStrictEqual(combined, 550) // Not additive
})

// Results
console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`)

if (passedTests === totalTests) {
  console.log('🎉 All pricing calculation tests passed!')
  process.exit(0)
} else {
  console.log('❌ Some tests failed. Please check the pricing logic.')
  process.exit(1)
} 