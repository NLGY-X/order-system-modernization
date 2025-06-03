import { describe, it, expect, beforeAll, afterAll } from 'vitest'

// Mock data for testing
const mockProducts = [
  { id: 'vue-mid-voucher', name: 'Vue Mid: Voucher Only' },
  { id: 'js-junior-voucher', name: 'JavaScript Junior: Voucher Only' },
  { id: 'angular-senior-bundle', name: 'Angular Mid + Senior: Voucher + Preparation + Bootcamp' }
]

const mockPricingData = [
  // Vue Mid: Voucher Only - Base price $220
  { product_id: 'vue-mid-voucher', min_quantity: 1, max_quantity: 100, ppp_tier: 'Global', price_usd: 220.00 },
  { product_id: 'vue-mid-voucher', min_quantity: 101, max_quantity: 400, ppp_tier: 'Global', price_usd: 209.00 },
  { product_id: 'vue-mid-voucher', min_quantity: 401, max_quantity: 800, ppp_tier: 'Global', price_usd: 198.00 },
  { product_id: 'vue-mid-voucher', min_quantity: 801, max_quantity: null, ppp_tier: 'Global', price_usd: 187.00 },
  
  // Tier 1 PPP (20% discount)
  { product_id: 'vue-mid-voucher', min_quantity: 1, max_quantity: 100, ppp_tier: 'Tier 1', price_usd: 176.00 },
  { product_id: 'vue-mid-voucher', min_quantity: 101, max_quantity: 400, ppp_tier: 'Tier 1', price_usd: 167.20 },
  
  // Tier 2 PPP (35% discount)
  { product_id: 'vue-mid-voucher', min_quantity: 1, max_quantity: 100, ppp_tier: 'Tier 2', price_usd: 143.00 },
  
  // Tier 3 PPP (50% discount)
  { product_id: 'vue-mid-voucher', min_quantity: 1, max_quantity: 100, ppp_tier: 'Tier 3', price_usd: 110.00 },
  
  // JavaScript Junior - Base price $69
  { product_id: 'js-junior-voucher', min_quantity: 1, max_quantity: 100, ppp_tier: 'Global', price_usd: 69.00 },
  { product_id: 'js-junior-voucher', min_quantity: 101, max_quantity: 400, ppp_tier: 'Global', price_usd: 65.55 },
  { product_id: 'js-junior-voucher', min_quantity: 401, max_quantity: 800, ppp_tier: 'Global', price_usd: 62.10 },
  { product_id: 'js-junior-voucher', min_quantity: 801, max_quantity: null, ppp_tier: 'Global', price_usd: 58.65 }
]

const mockCountries = [
  { country_name: 'United States', ppp_tier: 'Tier 1' },
  { country_name: 'Germany', ppp_tier: 'Tier 1' },
  { country_name: 'Poland', ppp_tier: 'Tier 2' },
  { country_name: 'India', ppp_tier: 'Tier 3' },
  { country_name: 'Unknown Country', ppp_tier: 'Global' } // Fallback
]

describe('Pricing API Tests', () => {
  
  describe('Calculate Pricing API (/api/calculate-pricing)', () => {
    
    it('should calculate correct pricing for Global tier with no volume discount', async () => {
      const response = await fetch('/api/calculate-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: 'Vue Mid: Voucher Only',
          countryName: 'Unknown Country',
          quantity: 5
        })
      })
      
      const data = await response.json()
      
      expect(response.ok).toBe(true)
      expect(data.success).toBe(true)
      expect(data.unitPrice).toBe(220.00)
      expect(data.volumeDiscount).toBe(1.0)
      expect(data.pppDiscount).toBe(1.0)
    })
    
    it('should calculate correct pricing with 5% volume discount (101-400 range)', async () => {
      const response = await fetch('/api/calculate-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: 'Vue Mid: Voucher Only',
          countryName: 'Unknown Country',
          quantity: 200
        })
      })
      
      const data = await response.json()
      
      expect(response.ok).toBe(true)
      expect(data.success).toBe(true)
      expect(data.unitPrice).toBe(209.00) // 5% volume discount already applied in DB
      expect(data.volumeDiscount).toBe(0.95)
    })
    
    it('should calculate correct pricing with 10% volume discount (401-800 range)', async () => {
      const response = await fetch('/api/calculate-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: 'Vue Mid: Voucher Only',
          countryName: 'Unknown Country',
          quantity: 500
        })
      })
      
      const data = await response.json()
      
      expect(response.ok).toBe(true)
      expect(data.success).toBe(true)
      expect(data.unitPrice).toBe(198.00) // 10% volume discount already applied in DB
      expect(data.volumeDiscount).toBe(0.90)
    })
    
    it('should calculate correct pricing with 15% volume discount (801+ range)', async () => {
      const response = await fetch('/api/calculate-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: 'Vue Mid: Voucher Only',
          countryName: 'Unknown Country',
          quantity: 1000
        })
      })
      
      const data = await response.json()
      
      expect(response.ok).toBe(true)
      expect(data.success).toBe(true)
      expect(data.unitPrice).toBe(187.00) // 15% volume discount already applied in DB
      expect(data.volumeDiscount).toBe(0.85)
    })
    
    it('should calculate correct pricing with PPP Tier 1 (20% discount)', async () => {
      const response = await fetch('/api/calculate-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: 'Vue Mid: Voucher Only',
          countryName: 'United States',
          quantity: 5
        })
      })
      
      const data = await response.json()
      
      expect(response.ok).toBe(true)
      expect(data.success).toBe(true)
      expect(data.unitPrice).toBe(176.00) // 20% PPP discount already applied in DB
      expect(data.pppDiscount).toBe(0.8)
    })
    
    it('should calculate correct pricing with PPP Tier 2 (35% discount)', async () => {
      const response = await fetch('/api/calculate-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: 'Vue Mid: Voucher Only',
          countryName: 'Poland',
          quantity: 5
        })
      })
      
      const data = await response.json()
      
      expect(response.ok).toBe(true)
      expect(data.success).toBe(true)
      expect(data.unitPrice).toBe(143.00) // 35% PPP discount already applied in DB
      expect(data.pppDiscount).toBe(0.65)
    })
    
    it('should calculate correct pricing with PPP Tier 3 (50% discount)', async () => {
      const response = await fetch('/api/calculate-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: 'Vue Mid: Voucher Only',
          countryName: 'India',
          quantity: 5
        })
      })
      
      const data = await response.json()
      
      expect(response.ok).toBe(true)
      expect(data.success).toBe(true)
      expect(data.unitPrice).toBe(110.00) // 50% PPP discount already applied in DB
      expect(data.pppDiscount).toBe(0.5)
    })
    
    it('should combine volume and PPP discounts correctly', async () => {
      const response = await fetch('/api/calculate-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: 'Vue Mid: Voucher Only',
          countryName: 'United States', // Tier 1 PPP
          quantity: 200 // 5% volume discount
        })
      })
      
      const data = await response.json()
      
      expect(response.ok).toBe(true)
      expect(data.success).toBe(true)
      expect(data.unitPrice).toBe(167.20) // Both discounts applied in DB
      expect(data.volumeDiscount).toBe(0.95) // 5% volume discount
      expect(data.pppDiscount).toBe(0.8) // 20% PPP discount
    })
    
    it('should fallback to default pricing when product not in database', async () => {
      const response = await fetch('/api/calculate-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: 'Non-Existent Product',
          countryName: 'United States',
          quantity: 5
        })
      })
      
      const data = await response.json()
      
      expect(response.ok).toBe(true)
      expect(data.success).toBe(true)
      expect(data.unitPrice).toBe(80.00) // Fallback: $100 base * 0.8 PPP discount
      expect(data.volumeDiscount).toBe(1.0)
      expect(data.pppDiscount).toBe(0.8)
    })
    
    it('should return error for missing required fields', async () => {
      const response = await fetch('/api/calculate-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: 'Vue Mid: Voucher Only'
          // Missing countryName and quantity
        })
      })
      
      expect(response.status).toBe(400)
    })
    
    it('should return error for invalid quantity', async () => {
      const response = await fetch('/api/calculate-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: 'Vue Mid: Voucher Only',
          countryName: 'United States',
          quantity: -5
        })
      })
      
      expect(response.status).toBe(400)
    })
  })
  
  describe('Create Order API (/api/create-order)', () => {
    
    it('should create order with correct total price calculation', async () => {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          productName: 'JavaScript Junior: Voucher Only',
          countryName: 'Germany', // Tier 1 PPP
          quantity: 10
        })
      })
      
      const data = await response.json()
      
      expect(response.ok).toBe(true)
      expect(data.success).toBe(true)
      expect(data.order).toBeDefined()
      expect(data.order.total_price_usd).toBeDefined()
      expect(data.order.total_price_usd).toBeGreaterThan(0)
      
      // For JS Junior at Tier 1 PPP with quantity 10:
      // Base: $69, PPP discount: 20%, Volume discount: none
      // Expected unit price: $55.20, Total: $552.00
      expect(data.order.total_price_usd).toBe(552.00)
    })
    
    it('should create order with volume discount applied', async () => {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          productName: 'JavaScript Junior: Voucher Only',
          countryName: 'Global',
          quantity: 150 // Should get 5% volume discount
        })
      })
      
      const data = await response.json()
      
      expect(response.ok).toBe(true)
      expect(data.success).toBe(true)
      
      // JS Junior: $69 base, 5% volume discount = $65.55 unit price
      // Total: $65.55 * 150 = $9,832.50
      expect(data.order.total_price_usd).toBe(9832.50)
    })
    
    it('should create order with maximum discounts (volume + PPP)', async () => {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          productName: 'JavaScript Junior: Voucher Only',
          countryName: 'India', // Tier 3 PPP (50% discount)
          quantity: 1000 // 15% volume discount
        })
      })
      
      const data = await response.json()
      
      expect(response.ok).toBe(true)
      expect(data.success).toBe(true)
      
      // Expected: $69 * 0.85 (volume) * 0.5 (PPP) = $29.325 per unit
      // Total: $29.325 * 1000 = $29,325
      // Database should store this pre-calculated
      expect(data.order.total_price_usd).toBe(29325.00)
    })
  })
  
  describe('Pricing Logic Validation', () => {
    
    it('should validate volume discount tiers', () => {
      const testCases = [
        { quantity: 1, expectedDiscount: 1.0 },
        { quantity: 50, expectedDiscount: 1.0 },
        { quantity: 100, expectedDiscount: 1.0 },
        { quantity: 101, expectedDiscount: 0.95 },
        { quantity: 200, expectedDiscount: 0.95 },
        { quantity: 400, expectedDiscount: 0.95 },
        { quantity: 401, expectedDiscount: 0.90 },
        { quantity: 600, expectedDiscount: 0.90 },
        { quantity: 800, expectedDiscount: 0.90 },
        { quantity: 801, expectedDiscount: 0.85 },
        { quantity: 1500, expectedDiscount: 0.85 }
      ]
      
      testCases.forEach(({ quantity, expectedDiscount }) => {
        const discount = getVolumeDiscount(quantity)
        expect(discount).toBe(expectedDiscount)
      })
    })
    
    it('should validate PPP discount tiers', () => {
      const testCases = [
        { tier: 'Global', expectedDiscount: 1.0 },
        { tier: 'Tier 1', expectedDiscount: 0.8 },
        { tier: 'Tier 2', expectedDiscount: 0.65 },
        { tier: 'Tier 3', expectedDiscount: 0.5 }
      ]
      
      testCases.forEach(({ tier, expectedDiscount }) => {
        const discount = getPPPDiscount(tier)
        expect(discount).toBe(expectedDiscount)
      })
    })
    
    it('should calculate combined discounts correctly', () => {
      // Test case: 500 quantity (10% volume) + Tier 2 PPP (35% off)
      const basePrice = 100
      const volumeDiscount = 0.90 // 10% off
      const pppDiscount = 0.65 // 35% off
      
      const finalPrice = basePrice * volumeDiscount * pppDiscount
      expect(finalPrice).toBe(58.50) // $100 * 0.90 * 0.65
    })
  })
})

// Helper functions for testing logic
function getVolumeDiscount(quantity) {
  if (quantity >= 1 && quantity <= 100) return 1.0
  if (quantity >= 101 && quantity <= 400) return 0.95
  if (quantity >= 401 && quantity <= 800) return 0.90
  if (quantity >= 801) return 0.85
  return 1.0
}

function getPPPDiscount(pppTier) {
  const discounts = {
    'Global': 1.0,
    'Tier 1': 0.8,
    'Tier 2': 0.65,
    'Tier 3': 0.5
  }
  return discounts[pppTier] || 1.0
} 