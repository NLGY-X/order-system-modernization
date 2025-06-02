<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {{ setupMode ? 'Setup Super Admin' : 'Admin Login' }}
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        {{ setupMode ? 'Create your super admin account' : 'Access the administration panel' }}
      </p>
      
      <!-- Navigation to User System -->
      <div class="mt-4 text-center">
        <NuxtLink
          to="/"
          class="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Order System
        </NuxtLink>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="form.email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                :placeholder="setupMode ? 'dan@kraveit.net' : 'Enter your email'"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="form.password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                :placeholder="setupMode ? 'Choose a secure password' : 'Enter your password'"
              />
            </div>
            <p v-if="setupMode" class="mt-1 text-xs text-gray-500">
              Password must be at least 6 characters long
            </p>
          </div>

          <!-- Confirm Password Field (Setup Mode Only) -->
          <div v-if="setupMode">
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div class="mt-1">
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                name="confirmPassword"
                type="password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-md p-4">
            <div class="flex">
              <svg class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="ml-3">
                <p class="text-sm text-green-800">{{ successMessage }}</p>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
            <div class="flex">
              <svg class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="ml-3">
                <p class="text-sm text-red-800">{{ error }}</p>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? (setupMode ? 'Creating Account...' : 'Signing in...') : (setupMode ? 'Create Super Admin' : 'Sign in') }}
            </button>
          </div>
        </form>

        <!-- Setup Mode Info -->
        <div v-if="setupMode" class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p class="text-sm text-blue-800">
            <strong>First Time Setup:</strong> You're creating the first super admin account for this system. After setup, you can invite other admin users.
          </p>
        </div>

        <!-- Mode Toggle -->
        <div v-if="!successMessage" class="mt-6 text-center">
          <button
            @click="toggleMode"
            type="button"
            class="text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            {{ setupMode ? 'Already have an account? Sign in' : 'Need to setup first admin? Click here' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Set page metadata
useHead({
  title: 'Admin Login - Order System',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Data
const setupMode = ref(false)
const loading = ref(false)
const error = ref('')
const successMessage = ref('')

// Form state
const form = ref({
  email: '',
  password: '',
  confirmPassword: ''
})

// Check if we need setup mode
const checkSetupMode = async () => {
  try {
    const supabase = useSupabase()
    
    // Check if there are any active admin users
    const { data: adminUsers, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('status', 'active')

    if (error) throw error
    
    // If no active admin users exist, show setup mode
    setupMode.value = !adminUsers || adminUsers.length === 0
    
    // Pre-fill email if in setup mode
    if (setupMode.value) {
      form.value.email = 'dan@kraveit.net'
    }
  } catch (err) {
    console.error('Error checking setup mode:', err)
  }
}

// Toggle between setup and login mode
const toggleMode = () => {
  setupMode.value = !setupMode.value
  error.value = ''
  successMessage.value = ''
  form.value = {
    email: setupMode.value ? 'dan@kraveit.net' : '',
    password: '',
    confirmPassword: ''
  }
}

// Handle form submission
const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    // Validation
    if (!form.value.email.trim() || !form.value.password) {
      throw new Error('Email and password are required')
    }

    if (setupMode.value) {
      // Setup mode validation
      if (form.value.password.length < 6) {
        throw new Error('Password must be at least 6 characters long')
      }
      if (form.value.password !== form.value.confirmPassword) {
        throw new Error('Passwords do not match')
      }

      // Setup first admin
      const { setupFirstAdmin } = useAdminAuth()
      const result = await setupFirstAdmin(form.value.email, form.value.password)

      if (result.success) {
        successMessage.value = result.message
        setupMode.value = false
        form.value = { email: form.value.email, password: '', confirmPassword: '' }
      } else {
        error.value = result.error || 'Setup failed'
      }
    } else {
      // Login mode
      const { login } = useAdminAuth()
      const result = await login(form.value.email, form.value.password)

      if (result.success) {
        // Redirect to dashboard
        await navigateTo('/admin/dashboard')
      } else {
        error.value = result.error || 'Login failed'
      }
    }
  } catch (err) {
    error.value = err.message || 'An unexpected error occurred'
    console.error('Auth error:', err)
  } finally {
    loading.value = false
  }
}

// Initialize on mount
onMounted(async () => {
  // Check if already authenticated
  const { isAuthenticated, initAuth } = useAdminAuth()
  await initAuth()
  
  if (isAuthenticated.value) {
    await navigateTo('/admin/dashboard')
    return
  }

  // Check if we need setup mode
  await checkSetupMode()
})
</script> 