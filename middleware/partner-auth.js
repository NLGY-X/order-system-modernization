import { usePartnerAuth } from '@/composables/usePartnerAuth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client side
  if (process.client) {
    const { isAuthenticated, initAuth } = usePartnerAuth()
    
    // Initialize auth state from Supabase session
    await initAuth()
    
    // If not authenticated, redirect to order page (which has login form)
    if (!isAuthenticated.value) {
      return navigateTo('/order')
    }
  }
  
  // On server side, we'll let the client handle the auth check
  // This prevents hydration mismatches
  if (process.server) {
    return
  }
}) 