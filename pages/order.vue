<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-12">
        <!-- Navigation Row -->
        <div class="flex justify-between items-center mb-8">
          <!-- Back to Home Link -->
          <NuxtLink 
            to="/"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/50 hover:bg-gray-700/70 rounded-lg shadow-sm transition-all duration-200 backdrop-blur-sm border border-gray-700"
            title="Back to Home"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </NuxtLink>

          <!-- Admin Login Link -->
          <NuxtLink 
            to="/admin/login"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/50 hover:bg-gray-700/70 rounded-lg shadow-sm transition-all duration-200 backdrop-blur-sm border border-gray-700"
            title="Admin Access"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 002 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Admin Panel
          </NuxtLink>
        </div>

        <!-- Access Notice for New Visitors -->
        <div class="mb-8">
          <div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6 max-w-2xl mx-auto backdrop-blur-sm">
            <div class="flex items-center justify-center">
              <svg class="h-5 w-5 text-blue-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="text-center">
                <h3 class="text-blue-300 font-medium text-sm">Approved Access Required</h3>
                <p class="text-blue-400 text-xs mt-1">
                  Don't have access yet? <NuxtLink to="/signup" class="underline hover:text-blue-300">Apply for bulk ordering access</NuxtLink>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Notice for approved partners only -->
        <div class="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 mb-8">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-200">
                Partner Program Access Required
              </h3>
              <div class="mt-2 text-sm text-blue-100">
                <p>This is the certificates.dev partner ordering system. If you're a new training provider, please <NuxtLink to="/signup" class="underline hover:text-white">apply for partnership</NuxtLink> first.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Title Section -->
        <div class="text-center">
          <h1 class="text-4xl font-bold text-white mb-4">
            Partner Order System
          </h1>
          <p class="text-xl text-gray-300 mb-8">
            Place your certificate orders with automatic partner pricing. All orders include digital delivery and premium support.
          </p>
        </div>
      </div>

      <!-- Partner Authentication Gate -->
      <div v-if="!isAuthenticated" class="max-w-2xl mx-auto">
        <div class="bg-gray-800/40 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 p-8">
          <!-- Partner Access Instructions -->
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-white mb-2">Partner Access Required</h2>
            <p class="text-gray-400">Enter your partner credentials to access the order system</p>
          </div>

          <!-- Partner Login Form -->
          <div class="space-y-6">
            <!-- Partner Email -->
            <div>
              <label for="partnerEmail" class="block text-sm font-medium text-gray-300 mb-2">
                Partner Email Address
              </label>
              <input
                id="partnerEmail"
                v-model="partnerEmail"
                type="email"
                placeholder="your.email@company.com"
                class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                @keyup.enter="authenticatePartner"
              />
            </div>

            <!-- Partner Password -->
            <div>
              <label for="partnerPassword" class="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="partnerPassword"
                v-model="partnerPassword"
                type="password"
                placeholder="Your password"
                class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                @keyup.enter="authenticatePartner"
              />
            </div>

            <!-- Access Buttons -->
            <div class="space-y-3">
              <button
                @click="authenticatePartner"
                :disabled="!partnerEmail || !partnerPassword || authLoading"
                class="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="authLoading" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
                <span v-else>Sign In to Order System</span>
              </button>
            </div>

            <!-- Error Message -->
            <div v-if="authError" class="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <div class="flex items-center">
                <svg class="h-5 w-5 text-red-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 15c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p class="text-red-300 text-sm">{{ authError }}</p>
              </div>
            </div>

            <!-- Success Message -->
            <div v-if="authSuccess" class="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <div class="flex items-center">
                <svg class="h-5 w-5 text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-green-300 text-sm">{{ authSuccess }}</p>
              </div>
            </div>
          </div>

          <!-- Help Section -->
          <div class="mt-8 pt-6 border-t border-gray-700/50">
            <div class="text-center">
              <p class="text-gray-400 text-sm mb-4">
                New to our Partner Program?
              </p>
              <div class="flex flex-col sm:flex-row gap-3 justify-center">
                <NuxtLink 
                  to="/signup"
                  class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-300 bg-blue-900/30 hover:bg-blue-800/50 border border-blue-500/30 rounded-lg transition-all duration-200"
                >
                  Apply for Partnership
                </NuxtLink>
                <a 
                  href="mailto:team@certificates.dev"
                  class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/50 hover:bg-gray-700/70 border border-gray-600/50 rounded-lg transition-all duration-200"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Authenticated Content -->
      <div v-else>
        <!-- Partner Welcome Message -->
        <div class="max-w-2xl mx-auto mb-8">
          <div class="bg-green-900/20 border border-green-500/30 rounded-lg p-4 backdrop-blur-sm">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <svg class="h-5 w-5 text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 class="text-green-300 font-medium text-sm">
                    {{ partnerUser?.user_type === 'admin' ? 'Admin Access (as Partner)' : 'Partner Access Granted' }}
                  </h3>
                  <p class="text-green-400 text-xs mt-1">
                    Welcome {{ organizationName || partnerUser?.email }}! 
                    <span v-if="partnerUser?.user_type === 'admin'">You're accessing as an admin with enterprise pricing.</span>
                    <span v-else>You can now place orders with partner pricing.</span>
                    <button @click="logout" class="underline hover:text-green-300 ml-2">Logout</button>
                  </p>
                </div>
              </div>
              <!-- Admin Panel Link for Admins -->
              <div v-if="partnerUser?.user_type === 'admin'" class="flex items-center space-x-2">
                <NuxtLink 
                  to="/admin/dashboard" 
                  class="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-300 bg-blue-900/30 hover:bg-blue-800/50 border border-blue-500/30 rounded-lg transition-all duration-200"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Admin Panel
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Database Connection Warning -->
        <div v-if="usingMockData" class="max-w-2xl mx-auto mb-8">
          <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
            <div class="flex items-center">
              <svg class="h-5 w-5 text-red-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 15c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h3 class="text-red-300 font-medium text-sm">Database Connection Issue</h3>
                <p class="text-red-400 text-xs mt-1">
                  Unable to load products from database. Showing demo products only.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="flex items-center justify-center py-16">
          <div class="text-center">
            <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <span class="text-lg text-gray-300">Loading certification packages...</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error && !data" class="max-w-2xl mx-auto">
          <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-8 backdrop-blur-sm">
            <div class="flex items-center">
              <svg class="h-8 w-8 text-red-400 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 class="text-red-300 font-bold text-lg">Failed to Load Certification Packages</h3>
                <p class="text-red-400 mt-2">
                  Unable to load products and countries. Please refresh the page to try again.
                </p>
              </div>
            </div>
            <button 
              @click="refresh()"
              class="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg"
            >
              Retry Loading
            </button>
          </div>
        </div>

        <!-- Order Form -->
        <div v-else class="max-w-2xl mx-auto">
          <div class="bg-gray-800/40 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 p-8">
            <div class="mb-8 text-center">
              <h2 class="text-2xl font-bold text-white mb-2">Select Your Certification Package</h2>
              <p class="text-gray-400">Choose your certification, country, and quantity to get started</p>
            </div>
            
            <OrderForm 
              :products="data?.products || []" 
              :countries="data?.countries || []" 
            />
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-20 text-center">
        <div class="border-t border-gray-700/50 pt-12">
          <p class="text-gray-400 mb-8 text-lg">
            Need assistance? Our team is here to help with your certification journey.
          </p>
          
          <!-- Enhanced Support Section -->
          <div class="flex flex-col sm:flex-row justify-center items-center gap-6">
            <NuxtLink 
              to="/admin/login" 
              class="group inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-blue-300 bg-blue-900/30 hover:bg-blue-800/50 border border-blue-500/30 rounded-lg transition-all duration-200 backdrop-blur-sm min-w-[160px]"
            >
              <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Admin Dashboard
            </NuxtLink>
            
            <a 
              href="mailto:team@certificates.dev" 
              class="group inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-300 bg-gray-800/50 hover:bg-gray-700/70 border border-gray-600/50 rounded-lg transition-all duration-200 backdrop-blur-sm min-w-[160px]"
            >
              <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.93a1.78 1.78 0 001.76 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Support
            </a>
          </div>
          
          <div class="mt-8 pt-8 border-t border-gray-800/50">
            <p class="text-gray-500 text-sm">
              © 2025 Certificates.dev - Professional Developer Certifications
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import OrderForm from '~/components/OrderForm.vue'
import { usePartnerAuth } from '@/composables/usePartnerAuth'

// Set page metadata
useHead({
  title: 'Order Certificates - Bulk Developer Certifications',
  meta: [
    { name: 'description', content: 'Order industry-trusted developer certifications in bulk with automatic volume discounts' }
  ]
})

// Use the new partner authentication system
const { isAuthenticated, partnerUser, login, logout: partnerLogout, initAuth, organizationName } = usePartnerAuth()

// Login form state
const partnerEmail = ref('')
const partnerPassword = ref('')
const authLoading = ref(false)
const authError = ref('')
const authSuccess = ref('')

// Initialize authentication on mount
onMounted(async () => {
  await initAuth()
})

// Partner authentication function
const authenticatePartner = async () => {
  if (!partnerEmail.value || !partnerPassword.value) {
    authError.value = 'Please enter both email and password'
    return
  }

  authLoading.value = true
  authError.value = ''
  authSuccess.value = ''

  try {
    const result = await login(partnerEmail.value, partnerPassword.value)
    
    if (result.success) {
      authSuccess.value = 'Access granted! Loading order system...'
      // Clear form
      partnerEmail.value = ''
      partnerPassword.value = ''
    } else {
      authError.value = result.error?.message || 'Authentication failed. Please check your credentials.'
    }
  } catch (error) {
    authError.value = 'Authentication failed. Please try again.'
  } finally {
    authLoading.value = false
  }
}

// Demo access function (removed - use real auth only)

// Logout function
const logout = () => {
  partnerLogout()
  partnerEmail.value = ''
  partnerPassword.value = ''
}

// Mock data for development
const mockProducts = [
  { id: '1', name: 'Certified Kubernetes Administrator (CKA)' },
  { id: '2', name: 'Certified Kubernetes Application Developer (CKAD)' },
  { id: '3', name: 'Certified Kubernetes Security Specialist (CKS)' },
  { id: '4', name: 'AWS Solutions Architect Associate' }
]

const mockCountries = [
  { name: 'United States' },
  { name: 'Canada' },
  { name: 'United Kingdom' },
  { name: 'Germany' },
  { name: 'France' },
  { name: 'Australia' },
  { name: 'Brazil' },
  { name: 'Mexico' },
  { name: 'India' },
  { name: 'Japan' }
]

// Fetch data from both endpoints
const config = useRuntimeConfig()

// Create reactive state
const data = ref(null)
const pending = ref(true)
const error = ref(null)
const usingMockData = ref(false)

const fetchFormData = async () => {
  try {
    pending.value = true
    error.value = null
    usingMockData.value = false

    // During SSG/prerendering, use mock data
    if (process.server && !config.public.supabaseUrl) {
      console.log('Using mock data during SSG/prerendering')
      data.value = {
        products: mockProducts,
        countries: mockCountries
      }
      usingMockData.value = true
      return
    }

    const supabase = useSupabase()

    // Fetch products and countries directly from the database
    const [productsResult, countriesResult] = await Promise.all([
      supabase.from('products').select('id, name').order('name', { ascending: true }),
      supabase.from('ppp_classifications').select('country_name').order('country_name', { ascending: true })
    ])

    if (productsResult.error) {
      console.error('Products query error:', productsResult.error)
      // Use mock data instead of throwing error
      data.value = {
        products: mockProducts,
        countries: mockCountries
      }
      usingMockData.value = true
      return
    }

    if (countriesResult.error) {
      console.error('Countries query error:', countriesResult.error)
      // Use mock data instead of throwing error
      data.value = {
        products: mockProducts,
        countries: mockCountries
      }
      usingMockData.value = true
      return
    }

    data.value = {
      products: productsResult.data || mockProducts,
      countries: countriesResult.data?.map(c => ({ name: c.country_name })) || mockCountries
    }

    // If we got empty data, use mock data
    if (!data.value.products.length || !data.value.countries.length) {
      data.value = {
        products: mockProducts,
        countries: mockCountries
      }
      usingMockData.value = true
    }

  } catch (err) {
    console.error('Fetch error:', err)
    // Use mock data as fallback
    data.value = {
      products: mockProducts,
      countries: mockCountries
    }
    usingMockData.value = true
    error.value = err
  } finally {
    pending.value = false
  }
}

const refresh = () => {
  fetchFormData()
}

// Initial fetch
await fetchFormData()
</script> 