import { describe, it, expect } from 'vitest'

// Simulated pricing logic from the API files
class PricingCalculator {
  constructor() {
    this.basePrices = {
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

    this.tier1Countries = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia', 'Japan', 'Switzerland', 'Netherlands', 'Sweden', 'Norway', 'Denmark']
    this.tier2Countries = ['Poland', 'Hungary', 'Czech Republic', 'Slovakia', 'Slovenia', 'Estonia', 'Lithuania', 'Latvia', 'Croatia', 'Portugal', 'Greece', 'Spain', 'Italy']
    this.tier3Countries = ['India', 'Brazil', 'Mexico', 'Argentina', 'Colombia', 'Philippines', 'Thailand', 'Vietnam', 'Ukraine', 'Romania', 'Bulgaria', 'Turkey']
  }

  getVolumeDiscount(quantity) {
    if (quantity >= 1 && quantity <= 100) return 1.0 // No discount
    if (quantity >= 101 && quantity <= 400) return 0.95 // 5% discount
    if (quantity >= 401 && quantity <= 800) return 0.90 // 10% discount
    if (quantity >= 801) return 0.85 // 15% discount
    return 1.0
  }

  getPPPDiscount(countryName) {
    if (this.tier1Countries.includes(countryName)) return 0.8 // 20% discount
    if (this.tier2Countries.includes(countryName)) return 0.65 // 35% discount
    if (this.tier3Countries.includes(countryName)) return 0.5 // 50% discount
    return 1.0 // Global pricing
  }

  calculatePrice(productName, countryName, quantity) {
    const basePrice = this.basePrices[productName] || 100 // Default fallback
    const volumeDiscount = this.getVolumeDiscount(quantity)
    const pppDiscount = this.getPPPDiscount(countryName)
    
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
}

describe('Pricing Calculation Tests', () => {
  let calculator

  beforeEach(() => {
    calculator = new PricingCalculator()
  })

  describe('Volume Discount Calculations', () => {
    it('should apply no volume discount for quantities 1-100', () => {
      expect(calculator.getVolumeDiscount(1)).toBe(1.0)
      expect(calculator.getVolumeDiscount(50)).toBe(1.0)
      expect(calculator.getVolumeDiscount(100)).toBe(1.0)
    })

    it('should apply 5% volume discount for quantities 101-400', () => {
      expect(calculator.getVolumeDiscount(101)).toBe(0.95)
      expect(calculator.getVolumeDiscount(200)).toBe(0.95)
      expect(calculator.getVolumeDiscount(400)).toBe(0.95)
    })

    it('should apply 10% volume discount for quantities 401-800', () => {
      expect(calculator.getVolumeDiscount(401)).toBe(0.90)
      expect(calculator.getVolumeDiscount(600)).toBe(0.90)
      expect(calculator.getVolumeDiscount(800)).toBe(0.90)
    })

    it('should apply 15% volume discount for quantities 801+', () => {
      expect(calculator.getVolumeDiscount(801)).toBe(0.85)
      expect(calculator.getVolumeDiscount(1000)).toBe(0.85)
      expect(calculator.getVolumeDiscount(5000)).toBe(0.85)
    })
  })

  describe('PPP Discount Calculations', () => {
    it('should apply 20% PPP discount for Tier 1 countries', () => {
      expect(calculator.getPPPDiscount('United States')).toBe(0.8)
      expect(calculator.getPPPDiscount('Germany')).toBe(0.8)
      expect(calculator.getPPPDiscount('Canada')).toBe(0.8)
      expect(calculator.getPPPDiscount('United Kingdom')).toBe(0.8)
    })

    it('should apply 35% PPP discount for Tier 2 countries', () => {
      expect(calculator.getPPPDiscount('Poland')).toBe(0.65)
      expect(calculator.getPPPDiscount('Czech Republic')).toBe(0.65)
      expect(calculator.getPPPDiscount('Spain')).toBe(0.65)
      expect(calculator.getPPPDiscount('Italy')).toBe(0.65)
    })

    it('should apply 50% PPP discount for Tier 3 countries', () => {
      expect(calculator.getPPPDiscount('India')).toBe(0.5)
      expect(calculator.getPPPDiscount('Brazil')).toBe(0.5)
      expect(calculator.getPPPDiscount('Mexico')).toBe(0.5)
      expect(calculator.getPPPDiscount('Thailand')).toBe(0.5)
    })

    it('should apply no PPP discount for unlisted countries', () => {
      expect(calculator.getPPPDiscount('Unknown Country')).toBe(1.0)
      expect(calculator.getPPPDiscount('Antarctica')).toBe(1.0)
      expect(calculator.getPPPDiscount('')).toBe(1.0)
    })
  })

  describe('Complete Price Calculations', () => {
    it('should calculate correct price with no discounts', () => {
      const result = calculator.calculatePrice('Vue Mid: Voucher Only', 'Unknown Country', 5)
      
      expect(result.basePrice).toBe(220.00)
      expect(result.unitPrice).toBe(220.00)
      expect(result.totalPrice).toBe(1100.00)
      expect(result.volumeDiscount).toBe(1.0)
      expect(result.pppDiscount).toBe(1.0)
    })

    it('should calculate correct price with only volume discount', () => {
      const result = calculator.calculatePrice('Vue Mid: Voucher Only', 'Unknown Country', 200)
      
      expect(result.basePrice).toBe(220.00)
      expect(result.unitPrice).toBe(209.00) // 220 * 0.95
      expect(result.totalPrice).toBe(41800.00) // 209 * 200
      expect(result.volumeDiscount).toBe(0.95)
      expect(result.pppDiscount).toBe(1.0)
    })

    it('should calculate correct price with only PPP discount', () => {
      const result = calculator.calculatePrice('Vue Mid: Voucher Only', 'India', 5)
      
      expect(result.basePrice).toBe(220.00)
      expect(result.unitPrice).toBe(110.00) // 220 * 0.5
      expect(result.totalPrice).toBe(550.00) // 110 * 5
      expect(result.volumeDiscount).toBe(1.0)
      expect(result.pppDiscount).toBe(0.5)
    })

    it('should calculate correct price with both volume and PPP discounts', () => {
      const result = calculator.calculatePrice('Vue Mid: Voucher Only', 'India', 500)
      
      expect(result.basePrice).toBe(220.00)
      expect(result.unitPrice).toBe(99.00) // 220 * 0.90 * 0.5
      expect(result.totalPrice).toBe(49500.00) // 99 * 500
      expect(result.volumeDiscount).toBe(0.90)
      expect(result.pppDiscount).toBe(0.5)
    })

    it('should calculate maximum discount scenario', () => {
      const result = calculator.calculatePrice('Vue Mid: Voucher Only', 'India', 1000)
      
      expect(result.basePrice).toBe(220.00)
      expect(result.unitPrice).toBe(93.50) // 220 * 0.85 * 0.5
      expect(result.totalPrice).toBe(93500.00) // 93.5 * 1000
      expect(result.volumeDiscount).toBe(0.85)
      expect(result.pppDiscount).toBe(0.5)
    })
  })

  describe('Product-Specific Pricing Tests', () => {
    it('should handle JavaScript Junior pricing correctly', () => {
      const result = calculator.calculatePrice('JavaScript Junior: Voucher Only', 'Germany', 150)
      
      expect(result.basePrice).toBe(69.00)
      expect(result.unitPrice).toBe(52.44) // 69 * 0.95 * 0.8
      expect(result.totalPrice).toBe(7866.00) // 52.44 * 150
    })

    it('should handle Angular bundle pricing correctly', () => {
      const result = calculator.calculatePrice('Angular Mid + Senior: Voucher + Preparation + Bootcamp', 'Poland', 100)
      
      expect(result.basePrice).toBe(2166.00)
      expect(result.unitPrice).toBe(1407.90) // 2166 * 1.0 * 0.65
      expect(result.totalPrice).toBe(140790.00) // 1407.90 * 100
    })

    it('should handle unknown product with fallback pricing', () => {
      const result = calculator.calculatePrice('Unknown Product', 'United States', 50)
      
      expect(result.basePrice).toBe(100.00) // Fallback price
      expect(result.unitPrice).toBe(80.00) // 100 * 1.0 * 0.8
      expect(result.totalPrice).toBe(4000.00) // 80 * 50
    })
  })

  describe('Edge Cases and Validation', () => {
    it('should handle quantity boundaries correctly', () => {
      // Test exact boundary values
      expect(calculator.getVolumeDiscount(100)).toBe(1.0)
      expect(calculator.getVolumeDiscount(101)).toBe(0.95)
      expect(calculator.getVolumeDiscount(400)).toBe(0.95)
      expect(calculator.getVolumeDiscount(401)).toBe(0.90)
      expect(calculator.getVolumeDiscount(800)).toBe(0.90)
      expect(calculator.getVolumeDiscount(801)).toBe(0.85)
    })

    it('should handle decimal rounding correctly', () => {
      const result = calculator.calculatePrice('JavaScript Junior: Voucher Only', 'India', 3)
      
      // 69 * 1.0 * 0.5 = 34.5, should be rounded to 34.5
      expect(result.unitPrice).toBe(34.50)
      expect(result.totalPrice).toBe(103.50) // 34.5 * 3
    })

    it('should calculate large volume orders accurately', () => {
      const result = calculator.calculatePrice('Vue Mid + Senior: Voucher + Preparation + Bootcamp', 'India', 2000)
      
      expect(result.basePrice).toBe(2257.00)
      expect(result.unitPrice).toBe(959.23) // 2257 * 0.85 * 0.5, rounded
      expect(result.totalPrice).toBe(1918460.00) // 959.23 * 2000
    })
  })

  describe('Discount Combination Logic', () => {
    it('should apply discounts multiplicatively, not additively', () => {
      const basePrice = 1000
      const volumeDiscount = 0.90 // 10% off
      const pppDiscount = 0.65 // 35% off
      
      // Should be 1000 * 0.90 * 0.65 = 585, not 1000 * (1 - 0.10 - 0.35) = 550
      const result = basePrice * volumeDiscount * pppDiscount
      expect(result).toBe(585)
      expect(result).not.toBe(550) // Not additive
    })

    it('should preserve discount information for display', () => {
      const result = calculator.calculatePrice('Angular Mid: Voucher Only', 'Czech Republic', 300)
      
      expect(result.volumeDiscount).toBe(0.95) // 5% volume discount
      expect(result.pppDiscount).toBe(0.65) // 35% PPP discount
      
      // Can calculate savings
      const volumeSavings = (1 - result.volumeDiscount) * 100 // 5%
      const pppSavings = (1 - result.pppDiscount) * 100 // 35%
      
      expect(volumeSavings).toBe(5)
      expect(pppSavings).toBe(35)
    })
  })
}) 