import { describe, it, expect } from 'vitest'

/**
 * Order Validation Tests
 * Tests the business rules for order creation
 */

// Helper functions extracted from the actual codebase
function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validateOrderData(orderData) {
  const errors = []
  
  // Check required fields
  if (!orderData.email) {
    errors.push('Email is required')
  } else if (!isValidEmail(orderData.email)) {
    errors.push('Invalid email format')
  }
  
  if (!orderData.productName) {
    errors.push('Product name is required')
  }
  
  if (!orderData.countryName) {
    errors.push('Country name is required')
  }
  
  if (orderData.quantity === null || orderData.quantity === undefined) {
    errors.push('Quantity is required')
  } else {
    const quantity = typeof orderData.quantity === 'number' ? orderData.quantity : parseInt(orderData.quantity)
    if (isNaN(quantity) || quantity <= 0) {
      errors.push('Quantity must be a positive number')
    } else if (quantity > 10000) {
      errors.push('Quantity cannot exceed 10,000')
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

function sanitizeOrderData(orderData) {
  return {
    email: orderData.email?.trim().toLowerCase(),
    productName: orderData.productName?.trim(),
    countryName: orderData.countryName?.trim(),
    quantity: typeof orderData.quantity === 'number' ? orderData.quantity : parseInt(orderData.quantity)
  }
}

describe('Order Validation', () => {
  describe('isValidEmail', () => {
    it('accepts valid email addresses', () => {
      const validEmails = [
        'user@example.com',
        'test.email+tag@domain.co.uk',
        'user123@subdomain.example.org',
        'firstname.lastname@company.io',
        'user_name@domain-name.com'
      ]
      
      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true)
      })
    })

    it('rejects invalid email addresses', () => {
      const invalidEmails = [
        'plainaddress',
        '@missingdomain.com',
        'missing@.com',
        'missing.domain@.com',
        'spaces in@email.com',
        'double@@domain.com',
        'user@',
        '@domain.com',
        '',
        'user@domain'
      ]
      
      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false)
      })
    })

    it('handles edge cases gracefully', () => {
      expect(isValidEmail(null)).toBe(false)
      expect(isValidEmail(undefined)).toBe(false)
      expect(isValidEmail(123)).toBe(false)
      expect(isValidEmail({})).toBe(false)
      expect(isValidEmail([])).toBe(false)
    })
  })

  describe('validateOrderData', () => {
    const validOrderData = {
      email: 'customer@example.com',
      productName: 'Vue Mid: Voucher Only',
      countryName: 'United States',
      quantity: 5
    }

    it('validates correct order data', () => {
      const result = validateOrderData(validOrderData)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('requires email field', () => {
      const orderData = { ...validOrderData, email: '' }
      const result = validateOrderData(orderData)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Email is required')
    })

    it('validates email format', () => {
      const orderData = { ...validOrderData, email: 'invalid-email' }
      const result = validateOrderData(orderData)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Invalid email format')
    })

    it('requires product name', () => {
      const orderData = { ...validOrderData, productName: '' }
      const result = validateOrderData(orderData)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Product name is required')
    })

    it('requires country name', () => {
      const orderData = { ...validOrderData, countryName: '' }
      const result = validateOrderData(orderData)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Country name is required')
    })

    it('requires quantity', () => {
      const orderData = { ...validOrderData, quantity: null }
      const result = validateOrderData(orderData)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Quantity is required')
    })

    it('rejects zero quantity', () => {
      const orderData = { ...validOrderData, quantity: 0 }
      const result = validateOrderData(orderData)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Quantity must be a positive number')
    })

    it('rejects negative quantity', () => {
      const orderData = { ...validOrderData, quantity: -5 }
      const result = validateOrderData(orderData)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Quantity must be a positive number')
    })

    it('rejects excessive quantity', () => {
      const orderData = { ...validOrderData, quantity: 15000 }
      const result = validateOrderData(orderData)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Quantity cannot exceed 10,000')
    })

    it('handles string quantities', () => {
      const orderData = { ...validOrderData, quantity: '25' }
      const result = validateOrderData(orderData)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('rejects non-numeric string quantities', () => {
      const orderData = { ...validOrderData, quantity: 'twenty-five' }
      const result = validateOrderData(orderData)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Quantity must be a positive number')
    })

    it('accumulates multiple validation errors', () => {
      const invalidOrderData = {
        email: 'invalid-email',
        productName: '',
        countryName: '',
        quantity: -1
      }
      
      const result = validateOrderData(invalidOrderData)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Invalid email format')
      expect(result.errors).toContain('Product name is required')
      expect(result.errors).toContain('Country name is required')
      expect(result.errors).toContain('Quantity must be a positive number')
      expect(result.errors).toHaveLength(4)
    })

    it('handles missing order data gracefully', () => {
      const result = validateOrderData({})
      
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('sanitizeOrderData', () => {
    it('trims and lowercases email', () => {
      const orderData = {
        email: '  User@EXAMPLE.COM  ',
        productName: 'Vue Mid: Voucher Only',
        countryName: 'United States',
        quantity: 5
      }
      
      const sanitized = sanitizeOrderData(orderData)
      expect(sanitized.email).toBe('user@example.com')
    })

    it('trims product name', () => {
      const orderData = {
        email: 'user@example.com',
        productName: '  Vue Mid: Voucher Only  ',
        countryName: 'United States',
        quantity: 5
      }
      
      const sanitized = sanitizeOrderData(orderData)
      expect(sanitized.productName).toBe('Vue Mid: Voucher Only')
    })

    it('trims country name', () => {
      const orderData = {
        email: 'user@example.com',
        productName: 'Vue Mid: Voucher Only',
        countryName: '  United States  ',
        quantity: 5
      }
      
      const sanitized = sanitizeOrderData(orderData)
      expect(sanitized.countryName).toBe('United States')
    })

    it('converts string quantity to number', () => {
      const orderData = {
        email: 'user@example.com',
        productName: 'Vue Mid: Voucher Only',
        countryName: 'United States',
        quantity: '25'
      }
      
      const sanitized = sanitizeOrderData(orderData)
      expect(sanitized.quantity).toBe(25)
      expect(typeof sanitized.quantity).toBe('number')
    })

    it('preserves numeric quantity', () => {
      const orderData = {
        email: 'user@example.com',
        productName: 'Vue Mid: Voucher Only',
        countryName: 'United States',
        quantity: 25
      }
      
      const sanitized = sanitizeOrderData(orderData)
      expect(sanitized.quantity).toBe(25)
      expect(typeof sanitized.quantity).toBe('number')
    })

    it('handles undefined values gracefully', () => {
      const orderData = {
        email: undefined,
        productName: undefined,
        countryName: undefined,
        quantity: undefined
      }
      
      const sanitized = sanitizeOrderData(orderData)
      expect(sanitized.email).toBeUndefined()
      expect(sanitized.productName).toBeUndefined()
      expect(sanitized.countryName).toBeUndefined()
      expect(isNaN(sanitized.quantity)).toBe(true)
    })
  })

  describe('Business rule validation', () => {
    it('accepts minimum valid order', () => {
      const minOrder = {
        email: 'a@b.co',
        productName: 'A',
        countryName: 'A',
        quantity: 1
      }
      
      const result = validateOrderData(minOrder)
      expect(result.isValid).toBe(true)
    })

    it('accepts maximum allowed quantity', () => {
      const maxOrder = {
        email: 'user@example.com',
        productName: 'Vue Mid: Voucher Only',
        countryName: 'United States',
        quantity: 10000
      }
      
      const result = validateOrderData(maxOrder)
      expect(result.isValid).toBe(true)
    })

    it('validates realistic certification order scenarios', () => {
      const scenarios = [
        {
          name: 'Single certification for individual',
          data: {
            email: 'developer@company.com',
            productName: 'Vue Mid: Voucher Only',
            countryName: 'Germany',
            quantity: 1
          },
          shouldBeValid: true
        },
        {
          name: 'Bulk order for company training',
          data: {
            email: 'hr@company.com',
            productName: 'Angular Mid + Senior: Voucher + Preparation + Bootcamp',
            countryName: 'United States',
            quantity: 50
          },
          shouldBeValid: true
        },
        {
          name: 'Large enterprise order',
          data: {
            email: 'procurement@enterprise.com',
            productName: 'JavaScript Junior: Voucher + Preparation',
            countryName: 'Canada',
            quantity: 500
          },
          shouldBeValid: true
        },
        {
          name: 'Invalid email for bulk order',
          data: {
            email: 'not-an-email',
            productName: 'Vue Mid: Voucher Only',
            countryName: 'France',
            quantity: 25
          },
          shouldBeValid: false
        }
      ]

      scenarios.forEach(scenario => {
        const result = validateOrderData(scenario.data)
        expect(result.isValid).toBe(scenario.shouldBeValid)
      })
    })
  })
}) 