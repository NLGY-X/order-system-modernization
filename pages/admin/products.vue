<template>
  <!-- Page Header -->
  <div class="mb-8">
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Products Management</h1>
        <p class="mt-2 text-sm text-gray-700">
          Manage products and their pricing across different PPP tiers
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3">
        <button
          @click="refreshData"
          :disabled="loading"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
        <NuxtLink
          to="/admin/products-new"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Product
        </NuxtLink>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div v-for="i in 4" :key="i" class="bg-white shadow rounded-lg overflow-hidden animate-pulse">
      <!-- Product Header Skeleton -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div class="flex space-x-2">
            <div class="h-8 bg-gray-200 rounded w-16"></div>
            <div class="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>

      <!-- Pricing Table Skeleton -->
      <div class="px-6 py-4">
        <div class="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
        <div class="space-y-3">
          <div v-for="j in 4" :key="j" class="flex justify-between">
            <div class="h-4 bg-gray-200 rounded w-1/3"></div>
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>

      <!-- Stats Skeleton -->
      <div class="px-6 py-4 bg-gray-50">
        <div class="grid grid-cols-2 gap-4">
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Empty State -->
  <div v-else-if="products.length === 0" class="bg-white shadow rounded-lg p-8 text-center">
    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
    <h3 class="mt-2 text-sm font-medium text-gray-900">No products found</h3>
    <p class="mt-1 text-sm text-gray-500">Get started by creating your first product.</p>
    <div class="mt-6">
      <NuxtLink
        to="/admin/products-new"
        class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Product
      </NuxtLink>
    </div>
  </div>

  <!-- Products Grid -->
  <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div v-for="product in products" :key="product.id" class="bg-white shadow-sm hover:shadow-lg transition-shadow duration-200 rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300">
      <!-- Product Header -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ product.name }}</h3>
            <div class="flex items-center mt-1">
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                ID: {{ product.id.slice(-8) }}
              </span>
            </div>
          </div>
          <div class="flex space-x-2">
            <NuxtLink
              :to="`/admin/products-edit-${product.id}`"
              class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </NuxtLink>
            <button
              @click="deleteProduct(product.id)"
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-200"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Pricing Table -->
      <div class="px-6 py-4">
        <h4 class="text-sm font-medium text-gray-900 mb-3">Pricing by PPP Tier & Quantity</h4>
        <div class="overflow-x-auto">
          <table class="min-w-full text-xs">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-2 text-gray-500 font-medium">Quantity Range</th>
                <th class="text-right py-2 text-gray-500 font-medium">Price (USD)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tier in getProductPricing(product.id)" :key="tier.quantity_tier" class="border-b border-gray-100">
                <td class="py-2 text-gray-900 font-medium">{{ tier.quantity_tier }}</td>
                <td class="py-2 text-right text-gray-900">${{ tier.price?.toFixed(2) || 'N/A' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Product Stats -->
      <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <span class="text-gray-500">Orders:</span>
              <span class="ml-1 font-semibold text-gray-900">{{ getProductStats(product.id).orders }}</span>
            </div>
          </div>
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <span class="text-gray-500">Revenue:</span>
              <span class="ml-1 font-semibold text-green-700">${{ getProductStats(product.id).revenue.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminAuthV2 } from '~/composables/useAdminAuthV2.js'
import { calculateProductPricing, calculateProductStats } from '~/utils/productCalculations.js'
import { useToast } from '~/composables/useToast.js'

// Protect this route with admin auth and set layout
definePageMeta({
  middleware: 'admin-auth',
  layout: 'admin'
})

// Set page metadata
useHead({
  title: 'Products Management - Admin Panel',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Toast notifications
const { success, error, info } = useToast()

// Data
const loading = ref(true)
const products = ref([])
const pricing = ref([])
const orders = ref([])
const { adminToken } = useAdminAuthV2()

// Load all data
const loadData = async () => {
  try {
    loading.value = true
    const supabase = useSupabase()

    const [productsResult, pricingResult, ordersResult] = await Promise.all([
      supabase.from('products').select('*').order('name'),
      supabase.from('product_prices').select('*'),
      supabase.from('orders').select('product_name, quantity, total_price_usd, status')
    ])

    if (productsResult.error) throw productsResult.error
    if (pricingResult.error) throw pricingResult.error
    if (ordersResult.error) throw ordersResult.error

    products.value = productsResult.data || []
    pricing.value = pricingResult.data || []
    orders.value = ordersResult.data || []

    console.log('Products loaded:', products.value.length, products.value)
    console.log('Pricing loaded:', pricing.value.length, pricing.value)
    console.log('Orders loaded:', orders.value.length)

  } catch (error) {
    console.error('Error loading data:', error)
    console.error('Error details:', error.message)
  } finally {
    loading.value = false
  }
}

// Get pricing for a product - now using utility function
const getProductPricing = (productId) => {
  return calculateProductPricing(productId, pricing.value)
}

// Get product statistics - now using utility function
const getProductStats = (productId) => {
  return calculateProductStats(productId, products.value, orders.value)
}

// Delete product - FIXED VERSION
const deleteProduct = async (productId) => {
  // Find product name for better messaging
  const product = products.value.find(p => p.id === productId)
  const productName = product?.name || 'Unknown Product'
  
  if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
    return
  }

  try {
    info('Deleting Product', `Removing "${productName}"...`)
    
    // Use the new API endpoint that bypasses RLS
    console.log('[deleteProduct] Token being sent:', adminToken.value);
    const response = await $fetch('/api/admin/delete-product', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken.value}`
      },
      body: { productId }
    })

    if (response.success) {
      success('Product Deleted', `"${productName}" has been successfully removed.`)
      console.log('Product deleted successfully!')
      // Refresh data to remove from UI
      await loadData()
    } else {
      throw new Error(response.message || 'Failed to delete product')
    }

  } catch (err) {
    console.error('Error deleting product:', err)
    error('Delete Failed', `Could not delete "${productName}": ${err.message}`)
  }
}

// Close product modal
const closeProductModal = () => {
  showAddProduct.value = false
  editingProduct.value = null
  productForm.value = {
    name: '',
    pricing: [
      { global: 0, tier1: 0, tier2: 0, tier3: 0 },
      { global: 0, tier1: 0, tier2: 0, tier3: 0 },
      { global: 0, tier1: 0, tier2: 0, tier3: 0 },
      { global: 0, tier1: 0, tier2: 0, tier3: 0 }
    ]
  }
}

// Refresh data
const refreshData = () => {
  loadData()
}

// Load data on mount
onMounted(() => {
  loadData()
})
</script> 