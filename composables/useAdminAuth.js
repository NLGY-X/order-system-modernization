import { ref, computed } from 'vue'

const adminUser = ref(null)
const adminToken = ref(null)

export const useAdminAuth = () => {
  const supabase = useSupabase()

  // Initialize auth state from localStorage
  const initAuth = () => {
    if (process.client) {
      const storedToken = localStorage.getItem('admin_token')
      const storedUser = localStorage.getItem('admin_user')
      
      if (storedToken && storedUser) {
        try {
          adminToken.value = storedToken
          adminUser.value = JSON.parse(storedUser)
        } catch (error) {
          console.error('Error parsing stored admin user:', error)
          logout()
        }
      }
    }
  }

  // Check if admin is authenticated
  const isAuthenticated = computed(() => {
    return !!(adminToken.value && adminUser.value)
  })

  // Login function
  const login = async (email, password) => {
    try {
      // For development, use simple authentication
      // In production, you'd verify against database with hashed passwords
      if (password !== 'admin123') {
        throw new Error('Invalid email or password')
      }

      // Create session token
      const sessionToken = generateSessionToken()
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      // Set auth state (using mock admin user for now)
      adminToken.value = sessionToken
      adminUser.value = {
        id: 'mock-admin-id',
        email: email,
        role: 'admin',
        expires_at: expiresAt.toISOString()
      }

      // Store in localStorage
      if (process.client) {
        localStorage.setItem('admin_token', sessionToken)
        localStorage.setItem('admin_user', JSON.stringify(adminUser.value))
      }

      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  }

  // Logout function
  const logout = async () => {
    // Clear auth state
    adminToken.value = null
    adminUser.value = null

    // Clear localStorage
    if (process.client) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
    }

    // Redirect to login
    await navigateTo('/admin/login')
  }

  // Generate session token
  const generateSessionToken = () => {
    return Math.random().toString(36).substring(2) + 
           Math.random().toString(36).substring(2) +
           Date.now().toString(36)
  }

  // Check if user has specific role
  const hasRole = (role) => {
    if (!adminUser.value) return false
    
    const roles = ['editor', 'admin', 'super_admin']
    const userRoleIndex = roles.indexOf(adminUser.value.role)
    const requiredRoleIndex = roles.indexOf(role)
    
    return userRoleIndex >= requiredRoleIndex
  }

  // Initialize on composable creation
  initAuth()

  return {
    adminUser: readonly(adminUser),
    adminToken: readonly(adminToken),
    isAuthenticated,
    login,
    logout,
    hasRole,
    initAuth
  }
} 