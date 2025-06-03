import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup.js']
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, '.'),
      '@': resolve(__dirname, '.'),
    }
  },
  define: {
    // Mock environment variables for testing
    'process.env.SUPABASE_URL': JSON.stringify('https://test.supabase.co'),
    'process.env.SUPABASE_SERVICE_ROLE_KEY': JSON.stringify('test-service-key'),
    'process.env.SUPABASE_ANON_KEY': JSON.stringify('test-anon-key'),
  }
}) 