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
  <div v-if="loading" class="flex items-center justify-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <span class="ml-3 text-lg text-gray-600">Loading products...</span>
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
    <div v-for="product in products" :key="product.id" class="bg-white shadow rounded-lg overflow-hidden">
      <!-- Product Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium text-gray-900">{{ product.name }}</h3>
            <p class="text-sm text-gray-500">Product ID: {{ product.id.slice(-8) }}</p>
          </div>
          <div class="flex space-x-2">
            <NuxtLink
              :to="`/admin/products-edit-${product.id}`"
              class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit
            </NuxtLink>
            <button
              @click="deleteProduct(product.id)"
              class="text-red-600 hover:text-red-900 text-sm font-medium"
            >
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
      <div class="px-6 py-4 bg-gray-50">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-500">Total Orders:</span>
            <span class="ml-2 font-medium text-gray-900">{{ getProductStats(product.id).orders }}</span>
          </div>
          <div>
            <span class="text-gray-500">Revenue:</span>
            <span class="ml-2 font-medium text-gray-900">${{ getProductStats(product.id).revenue.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminAuthV2 } from '~/composables/useAdminAuthV2.js'

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

// Get pricing for a product
const getProductPricing = (productId) => {
  const productPricing = pricing.value.filter(p => p.product_id === productId)
  
  // Group by quantity ranges and return simplified structure
  const grouped = {}
  productPricing.forEach(p => {
    const key = `${p.min_quantity}-${p.max_quantity || '+'}`
    if (!grouped[key]) {
      grouped[key] = { quantity_tier: key, price: p.price_usd }
    }
  })
  
  return Object.values(grouped)
}

// Get product statistics
const getProductStats = (productId) => {
  // Find the product name first
  const product = products.value.find(p => p.id === productId)
  if (!product) return { orders: 0, revenue: 0 }
  
  const productOrders = orders.value.filter(o => o.product_name === product.name)
  return {
    orders: productOrders.length,
    revenue: productOrders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + (o.total_price_usd || 0), 0)
  }
}

// Delete product - FIXED VERSION
const deleteProduct = async (productId) => {
  if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
    return
  }

  try {
    // Use the new API endpoint that bypasses RLS
    const response = await $fetch('/api/admin/delete-product', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken.value}`
      },
      body: { productId }
    })

    if (response.success) {
      console.log('Product deleted successfully!')
      // Refresh data to remove from UI
      await loadData()
    } else {
      throw new Error(response.message || 'Failed to delete product')
    }

  } catch (error) {
    console.error('Error deleting product:', error)
    alert(`Failed to delete product: ${error.message}`)
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