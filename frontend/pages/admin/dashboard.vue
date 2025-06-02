<template>
  <div>
    <!-- Use admin layout -->
    <NuxtLayout name="admin">
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Orders -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Orders</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalOrders }}</p>
            </div>
          </div>
        </div>

        <!-- Total Revenue -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Revenue</p>
              <p class="text-2xl font-semibold text-gray-900">${{ stats.totalRevenue.toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <!-- Active Products -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Active Products</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.activeProducts }}</p>
            </div>
          </div>
        </div>

        <!-- Countries Supported -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-orange-100 rounded-lg">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Countries</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalCountries }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Orders & Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Recent Orders -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">Recent Orders</h3>
              <NuxtLink to="/admin/orders" class="text-sm text-blue-600 hover:text-blue-500">
                View all
              </NuxtLink>
            </div>
          </div>
          <div class="p-6">
            <div v-if="loading" class="space-y-4">
              <div v-for="i in 5" :key="i" class="animate-pulse">
                <div class="flex items-center space-x-4">
                  <div class="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div class="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div class="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
            <div v-else-if="recentOrders.length === 0" class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="mt-2 text-sm text-gray-500">No orders yet</p>
            </div>
            <div v-else class="space-y-4">
              <div v-for="order in recentOrders" :key="order.id" class="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ order.email }}</p>
                  <p class="text-xs text-gray-500">{{ formatDate(order.created_at) }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-900">${{ order.total_price_usd?.toFixed(2) || '0.00' }}</p>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getStatusColor(order.status)">
                    {{ order.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <!-- Add Product -->
              <NuxtLink
                to="/admin/products/new"
                class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div class="p-2 bg-blue-100 rounded-lg">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900">Add New Product</p>
                  <p class="text-xs text-gray-500">Create a new certification product</p>
                </div>
              </NuxtLink>

              <!-- Manage Products -->
              <NuxtLink
                to="/admin/products"
                class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div class="p-2 bg-indigo-100 rounded-lg">
                  <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900">Manage Products</p>
                  <p class="text-xs text-gray-500">View and edit existing products</p>
                </div>
              </NuxtLink>

              <!-- View Orders -->
              <NuxtLink
                to="/admin/orders"
                class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div class="p-2 bg-green-100 rounded-lg">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900">Manage Orders</p>
                  <p class="text-xs text-gray-500">View and process customer orders</p>
                </div>
              </NuxtLink>

              <!-- Update PPP -->
              <NuxtLink
                to="/admin/countries"
                class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div class="p-2 bg-purple-100 rounded-lg">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900">Update PPP Settings</p>
                  <p class="text-xs text-gray-500">Manage country pricing tiers</p>
                </div>
              </NuxtLink>

              <!-- View Analytics -->
              <NuxtLink
                to="/admin/analytics"
                class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div class="p-2 bg-orange-100 rounded-lg">
                  <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900">View Analytics</p>
                  <p class="text-xs text-gray-500">Sales reports and insights</p>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Protect this route with admin auth
definePageMeta({
  middleware: 'admin-auth'
})

// Set page metadata
useHead({
  title: 'Dashboard - Admin Panel',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Data
const loading = ref(true)
const stats = ref({
  totalOrders: 0,
  totalRevenue: 0,
  activeProducts: 0,
  totalCountries: 0
})
const recentOrders = ref([])

// Load dashboard data
const loadDashboardData = async () => {
  try {
    const supabase = useSupabase()

    // Load stats in parallel
    const [ordersResult, productsResult, countriesResult] = await Promise.all([
      supabase.from('orders').select('total_price_usd'),
      supabase.from('products').select('id'),
      supabase.from('ppp_classifications').select('id')
    ])

    // Calculate stats
    if (ordersResult.data) {
      stats.value.totalOrders = ordersResult.data.length
      stats.value.totalRevenue = ordersResult.data.reduce((sum, order) => sum + (order.total_price_usd || 0), 0)
    }

    if (productsResult.data) {
      stats.value.activeProducts = productsResult.data.length
    }

    if (countriesResult.data) {
      stats.value.totalCountries = countriesResult.data.length
    }

    // Load recent orders
    const recentOrdersResult = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (recentOrdersResult.data) {
      recentOrders.value = recentOrdersResult.data
    }

  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    loading.value = false
  }
}

// Utility functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Load data on mount
onMounted(() => {
  loadDashboardData()
})
</script> 