export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  return {
    environment: process.env.NODE_ENV || 'unknown',
    vercel: !!process.env.VERCEL,
    supabaseUrl: config.public.supabaseUrl ? 'Set' : 'Missing',
    supabaseAnonKey: config.public.supabaseAnonKey ? 'Set' : 'Missing',
    supabaseServiceRoleKey: config.supabaseServiceRoleKey ? 'Set' : 'Missing',
    stripeSecretKey: config.stripeSecretKey ? 'Set' : 'Missing',
    stripeWebhookSecret: config.stripeWebhookSecret ? 'Set' : 'Missing'
  }
}) 