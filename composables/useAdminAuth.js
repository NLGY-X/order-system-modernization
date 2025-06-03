import { ref, computed } from 'vue'

const adminUser = ref(null)
const adminToken = ref(null)

export const useAdminAuth = () => {
  const supabase = useSupabase()

  // Initialize auth state from Supabase session
  const initAuth = async () => {
    console.log('[useAdminAuth] Attempting REFACTORED initAuth - using API call to /api/auth/verify-admin-status'); // DIAGNOSTIC LOG
    if (process.client) {
      adminUser.value = null; // Reset initially
      adminToken.value = null; // Reset initially

      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user && session.access_token) {
          // Call the new server API to verify admin status
          const response = await fetch('/api/auth/verify-admin-status', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            console.error('Error verifying admin status via API:', response.status, errorData.message);
            // Do not call full logout() here as it might cause redirect loops during initial load
            // Clearing local state is enough, middleware will handle redirect if needed on route change.
            adminUser.value = null;
            adminToken.value = null;
            await supabase.auth.signOut().catch(e => console.error('Error signing out after API verification failure:', e));
            return;
          }

          const verificationResult = await response.json();

          if (verificationResult.isAdmin && verificationResult.adminUser) {
            adminUser.value = verificationResult.adminUser;
            adminToken.value = session.access_token; // Store the original session token
          } else {
            // User is authenticated with Supabase but not a recognized/active admin by our API
            console.log('User authenticated but not a recognized admin by API, signing out locally.');
            adminUser.value = null;
            adminToken.value = null;
            // We don't necessarily need to sign out the Supabase session itself here,
            // as they might be a valid Supabase user but not an admin for *this* app.
            // The lack of adminUser/adminToken will prevent admin access.
            // However, if the previous logic was to sign out fully, we can keep that:
            await supabase.auth.signOut().catch(e => console.error('Error signing out non-admin user:', e));
          }
        } else {
          // No active Supabase session or token
          adminUser.value = null;
          adminToken.value = null;
        }
      } catch (error) {
        console.error('Error during initAuth calling verification API:', error);
        adminUser.value = null; // Ensure state is cleared on error
        adminToken.value = null;
        // Avoid full logout() here to prevent potential redirect loops on initial load errors.
        // Consider if a full supabase.auth.signOut() is always desired on any initAuth error.
      }
    }
  }

  // Check if admin is authenticated
  const isAuthenticated = computed(() => {
    return !!(adminToken.value && adminUser.value)
  })

  // Login function using Supabase Auth
  const login = async (email, password) => {
    console.log('[useAdminAuth] Attempting REFACTORED login - using API call to /api/auth/verify-admin-status'); // DIAGNOSTIC LOG
    try {
      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      })

      if (error) throw error

      if (data.user && data.session) { // data.session should exist on successful signInWithPassword
        // Verify admin status using the API
        const verifyResponse = await fetch('/api/auth/verify-admin-status', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${data.session.access_token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!verifyResponse.ok) {
          const errorBody = await verifyResponse.text(); // Get raw text for better error logging
          console.error('Admin verification API call failed after login:', verifyResponse.status, errorBody);
          let errorMessage = 'Admin verification failed after login.';
          try {
            const errorData = JSON.parse(errorBody);
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch (e) { /* Ignore if not JSON */ }
          await supabase.auth.signOut().catch(e => console.error('Error signing out after failed admin verification:', e));
          throw new Error(errorMessage);
        }

        const verificationResult = await verifyResponse.json();

        if (!verificationResult.isAdmin || !verificationResult.adminUser) {
          await supabase.auth.signOut().catch(e => console.error('Error signing out non-admin after login attempt:', e));
          throw new Error('Access denied. You are not authorized as an admin user.');
        }

        // Update last login (this needs RLS for UPDATE on admin_users)
        try {
            await supabase
              .from('admin_users')
              .update({ last_login: new Date().toISOString() })
              .eq('id', verificationResult.adminUser.id); // Use ID from verified admin user
        } catch (updateError) {
            console.warn('Failed to update last_login:', updateError.message);
            // Non-critical, so don't fail the login for this
        }

        // Set auth state
        adminUser.value = verificationResult.adminUser;
        adminToken.value = data.session.access_token;

        return { success: true };
      }

      throw new Error('Authentication failed: No user or session data returned.')
    } catch (error) {
      console.error('Login error:', error.message);
      // Ensure admin state is cleared on login failure
      adminUser.value = null;
      adminToken.value = null;
      return { success: false, error: error.message }
    }
  }

  // Signup function for admin users (only for invited users)
  const signup = async (email, password) => {
    try {
      // Check if this email is invited as pending admin
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .eq('status', 'pending')
        .single()

      if (adminError || !adminData) {
        throw new Error('You must be invited as an admin user before you can sign up.')
      }

      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
      })

      if (error) throw error

      if (data.user) {
        // Link the auth user to admin_users record
        const { error: updateError } = await supabase
          .from('admin_users')
          .update({ 
            auth_id: data.user.id,
            status: 'active'
          })
          .eq('id', adminData.id)

        if (updateError) throw updateError

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
      // Check if there are any active admin users
      const { data: existingAdmins, error: checkError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('status', 'active')

      if (checkError) {
        console.error('Check error:', checkError)
        // If we can't check, assume no active admins exist and proceed
      }

      if (existingAdmins && existingAdmins.length > 0) {
        throw new Error('Admin users already exist. Use the normal login process.')
      }

      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
      })

      if (error) throw error

      if (data.user) {
        // Update the existing admin_users record with auth_id and activate it
        const { error: updateError } = await supabase
          .from('admin_users')
          .update({ 
            auth_id: data.user.id,
            status: 'active'
          })
          .eq('email', email)

        if (updateError) {
          console.error('Update error:', updateError)
          throw updateError
        }

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
      console.log('onAuthStateChange event:', event, 'session:', !!session);
      if (event === 'SIGNED_OUT') {
        adminUser.value = null
        adminToken.value = null
        // navigateTo might be handled by middleware or explicit calls in UI
      } else if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // For TOKEN_REFRESHED, ensure the new token is used for verification if needed.
        // The current initAuth() will use the latest session.access_token.
        if (session?.user && session.access_token) {
            await initAuth(); // This will now use the API for verification
        } else if (event === 'SIGNED_IN' && (!session?.user || !session?.access_token)) {
            // This case might happen if SIGNED_IN fires but session is incomplete, logout to be safe
            console.warn('SIGNED_IN event with incomplete session, clearing admin state.');
            adminUser.value = null;
            adminToken.value = null;
        }
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