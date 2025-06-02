export default defineNuxtRouteMiddleware((to, from) => {
  // Check if we're on the client side
  if (process.client) {
    const adminToken = localStorage.getItem('admin_token')
    const adminUser = localStorage.getItem('admin_user')
    
    console.log('🔍 Admin Auth Middleware Check:')
    console.log('- Current Route:', to.path)
    console.log('- Admin Token exists:', !!adminToken)
    console.log('- Admin User exists:', !!adminUser)
    
    // If no token or user data, redirect to login
    if (!adminToken || !adminUser) {
      console.log('❌ No admin credentials found, redirecting to login')
      return navigateTo('/admin/login')
    }
    
    // Check if token is expired (basic check)
    try {
      const user = JSON.parse(adminUser)
      const tokenExpiry = user.expires_at
      
      console.log('- Token expires at:', tokenExpiry)
      console.log('- Current time:', new Date().toISOString())
      
      if (tokenExpiry && new Date(tokenExpiry) < new Date()) {
        // Token expired, clear storage and redirect
        console.log('❌ Token expired, clearing storage and redirecting')
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
        return navigateTo('/admin/login')
      }
      
      console.log('✅ Admin authentication valid')
    } catch (error) {
      // Invalid user data, clear and redirect
      console.log('❌ Invalid user data, clearing storage and redirecting')
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      return navigateTo('/admin/login')
    }
  }
  
  // On server side, we'll handle auth differently
  if (process.server) {
    // For now, allow server-side rendering to proceed
    // We'll implement proper server-side auth later
    console.log('🖥️ Server-side rendering, allowing access')
    return
  }
}) 