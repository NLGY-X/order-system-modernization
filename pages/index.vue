<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12 relative">
        <!-- Admin Login Link -->
        <div class="absolute top-0 right-0">
          <NuxtLink 
            to="/admin/login"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 rounded-md shadow-sm transition-colors"
            title="Admin Access"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Admin Panel
          </NuxtLink>
        </div>

        <h1 class="text-4xl font-bold text-gray-900 mb-4">Order System</h1>
        <p class="text-lg text-gray-600">
          Place your certification order with our streamlined ordering system
        </p>
      </div>

      <!-- Database Connection Warning -->
      <div v-if="usingMockData" class="max-w-md mx-auto mb-8">
        <div class="bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex items-center">
            <svg class="h-5 w-5 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 15c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h3 class="text-red-800 font-medium text-sm">Database Connection Issue</h3>
              <p class="text-red-700 text-xs mt-1">
                Unable to load products from database. Showing demo products only.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-lg text-gray-600">Loading form data...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error && !data" class="max-w-md mx-auto">
        <div class="bg-red-50 border border-red-200 rounded-md p-6">
          <div class="flex items-center">
            <svg class="h-6 w-6 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 class="text-red-800 font-medium">Failed to Load Form Data</h3>
              <p class="text-red-700 text-sm mt-1">
                Unable to load products and countries. Please refresh the page to try again.
              </p>
            </div>
          </div>
          <button 
            @click="refresh()"
            class="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Retry
          </button>
        </div>
      </div>

      <!-- Order Form -->
      <OrderForm 
        v-else
        :products="data?.products || []" 
        :countries="data?.countries || []" 
      />

      <!-- Footer -->
      <div class="mt-16 text-center">
        <div class="border-t border-gray-200 pt-8">
          <p class="text-sm text-gray-500 mb-4">
            Need help? Contact support or access the admin panel for management functions.
          </p>
          <!-- Enhanced Admin Access -->
          <div class="flex justify-center space-x-6">
            <NuxtLink 
              to="/admin/login" 
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Admin Panel
            </NuxtLink>
            <a 
              href="mailto:team@certificates.dev" 
              class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.93a1.78 1.78 0 001.76 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import OrderForm from '~/components/OrderForm.vue'

// Set page metadata
useHead({
  title: 'Order System - Place Your Order',
  meta: [
    { name: 'description', content: 'Place your certification order with our streamlined ordering system' }
  ]
})

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