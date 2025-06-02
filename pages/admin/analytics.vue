<template>
  <div>
    <NuxtLayout name="admin">
      <!-- Page Header -->
      <div class="mb-8">
        <div class="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
            <p class="mt-2 text-sm text-gray-700">
              View detailed analytics and generate reports
            </p>
          </div>
          <div class="mt-4 sm:mt-0">
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
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-lg text-gray-600">Loading analytics...</span>
      </div>

      <!-- Analytics Content -->
      <div v-else class="space-y-6">
        <!-- Key Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total Revenue -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                    <dd class="text-lg font-medium text-gray-900">${{ analytics.totalRevenue.toFixed(2) }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Total Orders -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ analytics.totalOrders }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Average Order Value -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Avg Order Value</dt>
                    <dd class="text-lg font-medium text-gray-900">${{ analytics.averageOrderValue.toFixed(2) }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Conversion Rate -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Success Rate</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ analytics.successRate.toFixed(1) }}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Revenue by Product -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Revenue by Product</h3>
            <div class="space-y-3">
              <div v-for="product in analytics.revenueByProduct" :key="product.name" class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center justify-between text-sm">
                    <span class="font-medium text-gray-900">{{ product.name }}</span>
                    <span class="text-gray-500">${{ product.revenue.toFixed(2) }}</span>
                  </div>
                  <div class="mt-1 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      class="bg-blue-600 h-2 rounded-full" 
                      :style="{ width: `${(product.revenue / analytics.totalRevenue) * 100}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Orders by Country Tier -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Orders by PPP Tier</h3>
            <div class="space-y-3">
              <div v-for="tier in analytics.ordersByTier" :key="tier.tier" class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center justify-between text-sm">
                    <span class="font-medium text-gray-900">{{ tier.tier }}</span>
                    <span class="text-gray-500">{{ tier.count }} orders</span>
                  </div>
                  <div class="mt-1 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      class="h-2 rounded-full" 
                      :class="getTierColor(tier.tier)"
                      :style="{ width: `${(tier.count / analytics.totalOrders) * 100}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div class="p-6">
            <div class="flow-root">
              <ul class="-mb-8">
                <li v-for="(activity, index) in analytics.recentActivity" :key="index">
                  <div class="relative pb-8" :class="{ 'pb-0': index === analytics.recentActivity.length - 1 }">
                    <span v-if="index !== analytics.recentActivity.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></span>
                    <div class="relative flex space-x-3">
                      <div>
                        <span class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white" :class="getActivityColor(activity.type)">
                          <svg class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                          </svg>
                        </span>
                      </div>
                      <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p class="text-sm text-gray-500">{{ activity.description }}</p>
                        </div>
                        <div class="text-right text-sm whitespace-nowrap text-gray-500">
                          {{ formatDate(activity.timestamp) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
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
  title: 'Analytics - Admin Panel',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Data
const loading = ref(true)
const analytics = ref({
  totalRevenue: 0,
  totalOrders: 0,
  averageOrderValue: 0,
  successRate: 0,
  revenueByProduct: [],
  ordersByTier: [],
  recentActivity: []
})

// Load analytics data
const loadAnalytics = async () => {
  try {
    loading.value = true
    const supabase = useSupabase()

    // Fetch orders and related data
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        products!inner(name)
      `)

    if (error) throw error

    // Calculate metrics
    const completedOrders = orders.filter(o => o.status === 'completed')
    const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.total_price_usd || 0), 0)
    const totalOrders = orders.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / completedOrders.length : 0
    const successRate = totalOrders > 0 ? (completedOrders.length / totalOrders) * 100 : 0

    // Revenue by product
    const productRevenue = {}
    completedOrders.forEach(order => {
      const productName = order.products?.name || 'Unknown'
              productRevenue[productName] = (productRevenue[productName] || 0) + (order.total_price_usd || 0)
    })

    const revenueByProduct = Object.entries(productRevenue)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)

    // Orders by tier (mock data for now)
    const ordersByTier = [
              { tier: 'Global', count: orders.filter(o => !o.country_name || o.country_name === 'United States').length },
      { tier: 'Tier 1', count: Math.floor(orders.length * 0.3) },
      { tier: 'Tier 2', count: Math.floor(orders.length * 0.2) },
      { tier: 'Tier 3', count: Math.floor(orders.length * 0.1) }
    ]

    // Recent activity
    const recentActivity = orders
      .slice(0, 5)
      .map(order => ({
        type: order.status,
        description: `Order #${order.id.slice(-8)} ${order.status} - ${order.products?.name || 'Unknown Product'}`,
        timestamp: order.created_at
      }))

    analytics.value = {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      successRate,
      revenueByProduct,
      ordersByTier,
      recentActivity
    }

  } catch (error) {
    console.error('Error loading analytics:', error)
  } finally {
    loading.value = false
  }
}

// Utility functions
const getTierColor = (tier) => {
  switch (tier) {
    case 'Global': return 'bg-gray-600'
    case 'Tier 1': return 'bg-blue-600'
    case 'Tier 2': return 'bg-green-600'
    case 'Tier 3': return 'bg-purple-600'
    default: return 'bg-gray-600'
  }
}

const getActivityColor = (type) => {
  switch (type) {
    case 'completed': return 'bg-green-500'
    case 'pending': return 'bg-yellow-500'
    case 'failed': return 'bg-red-500'
    case 'cancelled': return 'bg-gray-500'
    default: return 'bg-blue-500'
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Refresh data
const refreshData = () => {
  loadAnalytics()
}

// Load data on mount
onMounted(() => {
  loadAnalytics()
})
</script> 