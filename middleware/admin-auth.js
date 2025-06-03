import { useAdminAuthV2 } from '@/composables/useAdminAuthV2';

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client side
  if (process.client) {
    const { isAuthenticated, initAuth } = useAdminAuthV2()
    
    // Initialize auth state from Supabase session
    await initAuth()
    
    // If not authenticated, redirect to login
    if (!isAuthenticated.value) {
      return navigateTo('/admin/login')
    }
  }
  
  // On server side, we'll let the client handle the auth check
  // This prevents hydration mismatches
  if (process.server) {
    return
  }
}) 