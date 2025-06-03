<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Certificates.dev</h1>
        <p class="text-sm text-gray-600">Professional Developer Certifications</p>
      </div>
      
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Complete Your Admin Setup
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Create your password to activate your admin account
      </p>
    </div>

    <!-- Form -->
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Success State -->
        <div v-if="successMessage" class="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            {{ successMessage }}
          </div>
          <div class="mt-4">
            <NuxtLink 
              to="/admin/login"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Go to Login
            </NuxtLink>
          </div>
        </div>

        <!-- Error State -->
        <div v-if="error" class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>

        <!-- Loading State -->
        <div v-if="verifying" class="mb-6 flex items-center justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
          <span class="text-gray-600">Verifying invitation...</span>
        </div>

        <!-- Signup Form -->
        <form v-if="!successMessage && !verifying" @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email Field (readonly) -->
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
                readonly
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 bg-gray-50 text-gray-500 sm:text-sm"
              />
            </div>
          </div>

          <!-- Role Display -->
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Admin Role
            </label>
            <div class="mt-1">
              <span class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 text-sm capitalize">
                {{ invitationData?.role?.replace('_', ' ') }}
              </span>
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Create Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="form.password"
                name="password"
                type="password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Choose a secure password"
              />
            </div>
            <p class="mt-1 text-xs text-gray-500">
              Password must be at least 6 characters long
            </p>
          </div>

          <!-- Confirm Password Field -->
          <div>
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
              {{ loading ? 'Creating Account...' : 'Create Admin Account' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Set page metadata
useHead({
  title: 'Admin Signup - Complete Your Invitation',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Data
const loading = ref(false)
const verifying = ref(true)
const error = ref('')
const successMessage = ref('')
const invitationData = ref(null)

// Form state
const form = ref({
  email: '',
  password: '',
  confirmPassword: ''
})

// Get query parameters
const route = useRoute()
const token = route.query.token as string;
const email = route.query.email as string;

// Verify invitation on mount
const verifyInvitation = async () => {
  try {
    if (!token || !email) {
      error.value = 'Invalid invitation link. Please check your email for the correct link.'
      return
    }

    form.value.email = decodeURIComponent(email)

    // Verify the invitation token
    const response = await $fetch('/api/verify-invitation', {
      method: 'POST',
      body: { token, email: form.value.email }
    })

    if (response.success) {
      invitationData.value = response.invitation
    } else {
      error.value = response.message || 'Invalid or expired invitation'
    }

  } catch (err) {
    console.error('Invitation verification error:', err)
    error.value = 'Failed to verify invitation. Please try again.'
  } finally {
    verifying.value = false
  }
}

// Form submission
const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''

    // Validation
    if (!form.value.password.trim() || form.value.password.length < 6) {
      error.value = 'Password must be at least 6 characters long'
      return
    }

    if (form.value.password !== form.value.confirmPassword) {
      error.value = 'Passwords do not match'
      return
    }

    // Complete the signup
    const response = await $fetch('/api/complete-admin-signup', {
      method: 'POST',
      body: {
        token,
        email: form.value.email,
        password: form.value.password
      }
    })

    if (response.success) {
      successMessage.value = 'Admin account created successfully! You can now log in.'
    } else {
      error.value = response.message || 'Failed to create account'
    }

  } catch (err) {
    console.error('Signup error:', err)
    error.value = err.data?.message || 'Failed to create admin account'
  } finally {
    loading.value = false
  }
}

// Initialize on mount
onMounted(() => {
  verifyInvitation()
})
</script> 