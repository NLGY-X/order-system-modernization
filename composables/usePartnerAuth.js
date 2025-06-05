import { ref, computed } from 'vue'

// Partner user and token refs - HOISTED FOR SINGLETON PATTERN
const partnerUser = ref(null);
const partnerToken = ref(null);

export const usePartnerAuth = () => {
  const supabase = useSupabase()

  // Initialize auth state from Supabase session
  const initAuth = async () => {
    console.log('[usePartnerAuth] Attempting initAuth - using API call to /api/auth/verify-partner-status');
    if (process.client) {
      partnerUser.value = null; // Reset initially
      partnerToken.value = null; // Reset initially

      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user && session.access_token) {
          // Call the partner verification API
          const response = await fetch('/api/auth/verify-partner-status', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            console.error('Error verifying partner status via API:', response.status, errorData.message);
            partnerUser.value = null;
            partnerToken.value = null;
            await logout(); // Log out if partner verification fails
            return;
          }

          const { isPartner, partnerUser: partnerDataFromApi } = await response.json();

          if (isPartner && partnerDataFromApi) {
            partnerUser.value = { ...session.user, ...partnerDataFromApi }; // Combine Supabase user with partner details
            partnerToken.value = session.access_token;
            console.log('[usePartnerAuth] Partner status VERIFIED via API, user and token set:', partnerUser.value);
          } else {
            console.log('[usePartnerAuth] Partner status NOT verified via API or user data missing.');
            partnerUser.value = null;
            partnerToken.value = null;
            await logout(); // Log out if not a partner
          }
        } else {
          console.log('[usePartnerAuth] No active session found or access token missing.');
          partnerUser.value = null;
          partnerToken.value = null;
        }
      } catch (error) {
        console.error('[usePartnerAuth] Error during initAuth:', error);
        partnerUser.value = null;
        partnerToken.value = null;
      }
    }
  };

  // Login function using Supabase Auth
  const login = async (email, password) => {
    console.log('[usePartnerAuth] Attempting login - using API call to /api/auth/verify-partner-status');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data?.user && data.session?.access_token) {
        // Call the partner verification API
        const response = await fetch('/api/auth/verify-partner-status', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${data.session.access_token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          console.error('Error verifying partner status via API after login:', response.status, errorData.message);
          partnerUser.value = null;
          partnerToken.value = null;
          await logout(); // Ensure logout if partner check fails
          return { success: false, error: new Error(errorData.message || 'Failed to verify partner status.') };
        }

        const { isPartner, partnerUser: partnerDataFromApi } = await response.json();

        if (isPartner && partnerDataFromApi) {
          partnerUser.value = { ...data.user, ...partnerDataFromApi };
          partnerToken.value = data.session.access_token;
          console.log('[usePartnerAuth] Login successful & Partner status VERIFIED via API. Token and user set.');
          return { success: true, error: null };
        } else {
          console.log('[usePartnerAuth] Login successful BUT partner status NOT verified via API.');
          partnerUser.value = null;
          partnerToken.value = null;
          await logout(); // Ensure logout if not a partner
          return { success: false, error: new Error('User is not a recognized active partner.') };
        }
      } else {
        partnerUser.value = null;
        partnerToken.value = null;
        return { success: false, error: new Error('Login failed: No user data or session token returned.') };
      }
    } catch (error) {
      console.error("Login error in usePartnerAuth:", error);
      partnerUser.value = null;
      partnerToken.value = null;
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
      partnerUser.value = null;
      partnerToken.value = null;
      if (process.client) {
        navigateTo('/order');
      }
    }
  };

  // Utility to check if a user is authenticated (has a token and user object)
  const isAuthenticated = computed(() => !!partnerToken.value && !!partnerUser.value);

  // Get partner organization name for display
  const organizationName = computed(() => partnerUser.value?.organization_name || '');

  // Get partner volume tier for pricing
  const volumeTier = computed(() => partnerUser.value?.volume_tier || 'standard');

  return {
    partnerUser,
    partnerToken,
    login,
    logout,
    initAuth,
    isAuthenticated,
    organizationName,
    volumeTier
  };
}; 