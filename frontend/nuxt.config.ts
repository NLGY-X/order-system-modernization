// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL || 'https://zezcsjltcbajkuqyxupt.supabase.co',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplemNzamx0Y2Jhamt1cXl4dXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDg2NjAsImV4cCI6MjA2MzkyNDY2MH0.EUlrFj5VF_fpNHD4QjLXD4YQqZLMdT4xTqKHlzp-vEQ'
    }
  }
})
