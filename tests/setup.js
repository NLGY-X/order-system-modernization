// Test setup file for mocking dependencies
import { vi } from 'vitest'

// Mock fetch for API testing
global.fetch = vi.fn()

// Mock Nuxt's $fetch
global.$fetch = vi.fn()

// Mock console methods to reduce noise in tests
console.log = vi.fn()
console.error = vi.fn()

// Mock runtime config
global.useRuntimeConfig = vi.fn(() => ({
  public: {
    supabaseUrl: 'https://test.supabase.co'
  },
  supabaseServiceRoleKey: 'test-service-key'
}))

// Mock event handler helpers
global.defineEventHandler = vi.fn((handler) => handler)
global.readBody = vi.fn()
global.createError = vi.fn((error) => {
  const err = new Error(error.statusMessage)
  err.statusCode = error.statusCode
  return err
})

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
}) 