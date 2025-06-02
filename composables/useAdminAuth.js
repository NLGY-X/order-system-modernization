import { ref, computed } from 'vue'

const adminUser = ref(null)
const adminToken = ref(null)

export const useAdminAuth = () => {
  const supabase = useSupabase()

  // Initialize auth state from Supabase session
  const initAuth = async () => {
    if (process.client) {
      try {
        // Get current Supabase session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          // Check if this user is in admin_users table
          const { data: adminData, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('auth_id', session.user.id)
            .eq('status', 'active')
            .single()

          if (adminData && !error) {
            adminUser.value = {
              id: adminData.id,
              email: adminData.email,
              role: adminData.role,
              auth_id: adminData.auth_id
            }
            adminToken.value = session.access_token
          } else {
            // User exists in Supabase Auth but not in admin_users or inactive
            await supabase.auth.signOut()
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        await logout()
      }
    }
  }

  // Check if admin is authenticated
  const isAuthenticated = computed(() => {
    return !!(adminToken.value && adminUser.value)
  })

  // Login function using Supabase Auth
  const login = async (email, password) => {
    try {
      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      })

      if (error) throw error

      if (data.user) {
        // Check if this user is in admin_users table
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('auth_id', data.user.id)
          .eq('status', 'active')
          .single()

        if (adminError || !adminData) {
          // User not found in admin_users or inactive
          await supabase.auth.signOut()
          throw new Error('Access denied. You are not authorized as an admin user.')
        }

        // Update last login
        await supabase
          .from('admin_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', adminData.id)

        // Set auth state
        adminUser.value = {
          id: adminData.id,
          email: adminData.email,
          role: adminData.role,
          auth_id: adminData.auth_id
        }
        adminToken.value = data.session.access_token

        return { success: true }
      }

      throw new Error('Authentication failed')
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  }

  // Signup function for admin users (only for invited users)
  const signup = async (email, password) => {
    try {
      // Check if this email is invited as pending admin using our secure function
      const { data: isPending, error: checkError } = await supabase
        .rpc('is_pending_admin', { user_email: email })

      if (checkError) throw checkError

      if (!isPending) {
        throw new Error('You must be invited as an admin user before you can sign up.')
      }

      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
      })

      if (error) throw error

      if (data.user) {
        // Activate the pending admin user using our secure function
        const { error: activateError } = await supabase
          .rpc('activate_pending_admin', { 
            user_id: data.user.id, 
            user_email: email 
          })

        if (activateError) throw activateError

        return { 
          success: true, 
          message: 'Account created successfully! Please check your email to verify your account, then you can login.' 
        }
      }

      throw new Error('Signup failed')
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, error: error.message }
    }
  }

  // Setup first super admin (one-time setup)
  const setupFirstAdmin = async (email, password) => {
    try {
      // Check if there are any active admin users using our secure function
      const { data: hasActiveAdmins, error: checkError } = await supabase
        .rpc('has_active_admin_users')

      if (checkError) throw checkError

      if (hasActiveAdmins) {
        throw new Error('Admin users already exist. Use the normal login process.')
      }

      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
      })

      if (error) throw error

      if (data.user) {
        // Setup the first admin using our secure function
        const { error: setupError } = await supabase
          .rpc('setup_first_admin', { 
            user_id: data.user.id, 
            user_email: email 
          })

        if (setupError) throw setupError

        return { 
          success: true, 
          message: 'Super admin account created successfully! Please check your email to verify your account, then you can login.' 
        }
      }

      throw new Error('Setup failed')
    } catch (error) {
      console.error('Setup error:', error)
      return { success: false, error: error.message }
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Logout error:', error)
    }

    // Clear auth state
    adminToken.value = null
    adminUser.value = null

    // Redirect to login
    if (process.client) {
      await navigateTo('/admin/login')
    }
  }

  // Check if user has specific role
  const hasRole = (role) => {
    if (!adminUser.value) return false
    
    const roles = ['admin', 'super_admin']
    const userRoleIndex = roles.indexOf(adminUser.value.role)
    const requiredRoleIndex = roles.indexOf(role)
    
    return userRoleIndex >= requiredRoleIndex
  }

  // Listen to auth state changes
  if (process.client) {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        adminUser.value = null
        adminToken.value = null
      } else if (event === 'SIGNED_IN' && session?.user) {
        await initAuth()
      }
    })
  }

  return {
    adminUser: readonly(adminUser),
    adminToken: readonly(adminToken),
    isAuthenticated,
    login,
    signup,
    setupFirstAdmin,
    logout,
    hasRole,
    initAuth
  }
} 