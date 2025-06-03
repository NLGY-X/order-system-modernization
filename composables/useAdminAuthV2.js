import { ref } from 'vue'
// import { createClient } from '@supabase/supabase-js' // Not needed if useSupabase is always used

// Supabase client, user, and token refs
export const useAdminAuthV2 = () => {
  const supabase = useSupabase()

  // Initialize auth state from Supabase session
  const initAuth = async () => {
    console.log('[useAdminAuthV2] Attempting REFACTORED initAuth - using API call to /api/auth/verify-admin-status'); // DIAGNOSTIC LOG
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
            adminUser.value = null;
            adminToken.value = null;
            await logout(); // Log out if admin verification fails
            return;
          }

          const { isAdmin, adminUser: adminDataFromApi } = await response.json();

          if (isAdmin && adminDataFromApi) {
            adminUser.value = { ...session.user, ...adminDataFromApi }; // Combine Supabase user with admin details
            adminToken.value = session.access_token;
            console.log('[useAdminAuthV2] Admin status VERIFIED via API, user and token set:', adminUser.value);
          } else {
            console.log('[useAdminAuthV2] Admin status NOT verified via API or user data missing.');
            adminUser.value = null;
            adminToken.value = null;
            await logout(); // Log out if not an admin
          }
        } else {
          console.log('[useAdminAuthV2] No active session found or access token missing.');
          adminUser.value = null;
          adminToken.value = null;
        }
      } catch (error) {
        console.error('[useAdminAuthV2] Error during initAuth:', error);
        adminUser.value = null;
        adminToken.value = null;
      }
    }
  };


  // Login function using Supabase Auth
  const login = async (email, password) => {
    console.log('[useAdminAuthV2] Attempting REFACTORED login - using API call to /api/auth/verify-admin-status'); // DIAGNOSTIC LOG
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data?.user && data.session?.access_token) {
         // Call the new server API to verify admin status
        const response = await fetch('/api/auth/verify-admin-status', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${data.session.access_token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          console.error('Error verifying admin status via API after login:', response.status, errorData.message);
          adminUser.value = null;
          adminToken.value = null;
          await logout(); // Ensure logout if admin check fails
          // throw new Error('Failed to verify admin status after login.'); 
          // Propagate error to login form
          return { success: false, error: new Error(errorData.message || 'Failed to verify admin status.') };
        }

        const { isAdmin, adminUser: adminDataFromApi } = await response.json();

        if (isAdmin && adminDataFromApi) {
          adminUser.value = { ...data.user, ...adminDataFromApi };
          adminToken.value = data.session.access_token;
          console.log('[useAdminAuthV2] Login successful & Admin status VERIFIED via API. Token and user set.');
          return { success: true, error: null };
        } else {
          console.log('[useAdminAuthV2] Login successful BUT admin status NOT verified via API.');
          adminUser.value = null;
          adminToken.value = null;
          await logout(); // Ensure logout if not an admin
          // throw new Error('User is not a recognized admin.');
           return { success: false, error: new Error('User is not a recognized admin.') };
        }
      } else {
        // Should be caught by signInWithPassword error, but as a fallback:
        adminUser.value = null;
        adminToken.value = null;
        return { success: false, error: new Error('Login failed: No user data or session token returned.') };
      }
    } catch (error) {
      console.error("Login error in useAdminAuthV2:", error);
      adminUser.value = null;
      adminToken.value = null;
      // throw error;
      return { success: false, error };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      adminUser.value = null;
      adminToken.value = null;
      if (process.client) {
        navigateTo('/admin/login');
      }
    }
  };

  // Persisted state for admin user and token
  const adminUser = ref(null);
  const adminToken = ref(null);


  // Utility to check if a user is authenticated (has a token and user object)
  const isAuthenticated = computed(() => !!adminToken.value && !!adminUser.value);


  // Placeholder for a potential setupFirstAdmin function, if needed.
  const setupFirstAdmin = async (email, password) => {
    // This function would likely call a specific server API endpoint
    // to create the first admin user if none exist.
    // For now, it's a placeholder.
    console.warn("setupFirstAdmin is not implemented yet.");
    // Example:
    // try {
    //   const response = await fetch('/api/auth/setup-first-admin', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email, password })
    //   });
    //   if (!response.ok) throw new Error('Failed to setup first admin');
    //   const data = await response.json();
    //   // Handle login or further actions
    // } catch (error) {
    //   console.error("Error in setupFirstAdmin:", error);
    //   throw error;
    // }
    return { success: false, error: "Not implemented" };
  };


  return {
    adminUser,
    adminToken,
    login,
    logout,
    initAuth,
    isAuthenticated,
    setupFirstAdmin
  };
};

// Auto-initialize auth state on client-side
// if (process.client) {
//   const { initAuth } = useAdminAuthV2();
//   initAuth();
// }
// It's generally better to call initAuth explicitly, e.g., in a layout or middleware.

// Note on Supabase client initialization:
// This composable relies on useSupabase() to provide the Supabase client.
// Ensure useSupabase() is correctly configured (e.g., in composables/useSupabase.js or via a Nuxt module).
// The Supabase client should be initialized with the public URL and anon key. 