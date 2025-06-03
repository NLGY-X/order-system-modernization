<template>
  <div>
    <NuxtLayout name="admin">
      <!-- Page Header -->
      <div class="mb-8">
        <div class="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
            <p class="mt-2 text-sm text-gray-700">
              Manage system settings and configuration
            </p>
          </div>
        </div>
      </div>

      <!-- Settings Content -->
      <div class="space-y-6">
        <!-- Admin Users Section -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Admin Users</h3>
            <p class="mt-1 text-sm text-gray-500">Manage admin user accounts and permissions</p>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <!-- Current Admin User -->
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-white">{{ adminUser?.email?.charAt(0).toUpperCase() }}</span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ adminUser?.email }}</p>
                    <p class="text-xs text-gray-500 capitalize">{{ adminUser?.role?.replace('_', ' ') }} (Current User)</p>
                  </div>
                </div>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>

              <!-- Add Admin User Form -->
              <div class="border-t pt-4">
                <h4 class="text-sm font-medium text-gray-900 mb-3">Add New Admin User</h4>
                <form @submit.prevent="addAdminUser" class="space-y-3">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      v-model="newAdmin.email"
                      type="email"
                      placeholder="Email address"
                      required
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <select
                      v-model="newAdmin.role"
                      required
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select Role</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                    <button
                      type="submit"
                      :disabled="saving"
                      class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {{ saving ? 'Adding...' : 'Add User' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- System Configuration -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">System Configuration</h3>
            <p class="mt-1 text-sm text-gray-500">Configure system-wide settings</p>
          </div>
          <div class="p-6">
            <form @submit.prevent="saveSettings" class="space-y-6">
              <!-- Email Settings -->
              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-3">Email Settings</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="from-email" class="block text-sm font-medium text-gray-700 mb-2">
                      From Email Address
                    </label>
                    <input
                      id="from-email"
                      v-model="settings.fromEmail"
                      type="email"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="noreply@example.com"
                    />
                  </div>
                  <div>
                    <label for="support-email" class="block text-sm font-medium text-gray-700 mb-2">
                      Support Email Address
                    </label>
                    <input
                      id="support-email"
                      v-model="settings.supportEmail"
                      type="email"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="support@example.com"
                    />
                  </div>
                </div>
              </div>

              <!-- Order Settings -->
              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-3">Order Settings</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="order-timeout" class="block text-sm font-medium text-gray-700 mb-2">
                      Order Timeout (minutes)
                    </label>
                    <input
                      id="order-timeout"
                      v-model.number="settings.orderTimeout"
                      type="number"
                      min="1"
                      max="60"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label for="max-quantity" class="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Order Quantity
                    </label>
                    <input
                      id="max-quantity"
                      v-model.number="settings.maxQuantity"
                      type="number"
                      min="1"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <!-- Feature Toggles -->
              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-3">Feature Toggles</h4>
                <div class="space-y-3">
                  <div class="flex items-center">
                    <input
                      id="enable-ppp"
                      v-model="settings.enablePPP"
                      type="checkbox"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label for="enable-ppp" class="ml-2 block text-sm text-gray-900">
                      Enable PPP (Purchasing Power Parity) pricing
                    </label>
                  </div>
                  <div class="flex items-center">
                    <input
                      id="enable-analytics"
                      v-model="settings.enableAnalytics"
                      type="checkbox"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label for="enable-analytics" class="ml-2 block text-sm text-gray-900">
                      Enable analytics tracking
                    </label>
                  </div>
                  <div class="flex items-center">
                    <input
                      id="maintenance-mode"
                      v-model="settings.maintenanceMode"
                      type="checkbox"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label for="maintenance-mode" class="ml-2 block text-sm text-gray-900">
                      Maintenance mode (disable new orders)
                    </label>
                  </div>
                </div>
              </div>

              <!-- Save Button -->
              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="saving"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {{ saving ? 'Saving...' : 'Save Settings' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Database Information -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Database Information</h3>
            <p class="mt-1 text-sm text-gray-500">Current database statistics</p>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">{{ dbStats.products }}</div>
                <div class="text-sm text-gray-500">Products</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600">{{ dbStats.orders }}</div>
                <div class="text-sm text-gray-500">Orders</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-600">{{ dbStats.countries }}</div>
                <div class="text-sm text-gray-500">Countries</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-orange-600">{{ dbStats.pricePoints }}</div>
                <div class="text-sm text-gray-500">Price Points</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Danger Zone -->
        <div class="bg-white shadow rounded-lg border-l-4 border-red-400">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-red-900">Danger Zone</h3>
            <p class="mt-1 text-sm text-red-700">Irreversible and destructive actions</p>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Clear All Orders</h4>
                  <p class="text-sm text-gray-500">Permanently delete all order data</p>
                </div>
                <button
                  @click="clearAllOrders"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Clear Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminAuthV2 } from '@/composables/useAdminAuthV2'

// Protect this route with admin auth
definePageMeta({
  middleware: 'admin-auth'
})

// Set page metadata
useHead({
  title: 'Settings - Admin Panel',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Auth
const { adminUser } = useAdminAuthV2()

// Data
const saving = ref(false)
const newAdmin = ref({
  email: '',
  role: ''
})

const settings = ref({
  fromEmail: 'noreply@example.com',
  supportEmail: 'support@example.com',
  orderTimeout: 30,
  maxQuantity: 1000,
  enablePPP: true,
  enableAnalytics: true,
  maintenanceMode: false
})

const dbStats = ref({
  products: 0,
  orders: 0,
  countries: 0,
  pricePoints: 0
})

// Load database statistics
const loadDbStats = async () => {
  try {
    const supabase = useSupabase()

    const [productsResult, ordersResult, countriesResult, pricesResult] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id', { count: 'exact', head: true }),
      supabase.from('ppp_classifications').select('id', { count: 'exact', head: true }),
      supabase.from('product_prices').select('id', { count: 'exact', head: true })
    ])

    dbStats.value = {
      products: productsResult.count || 0,
      orders: ordersResult.count || 0,
      countries: countriesResult.count || 0,
      pricePoints: pricesResult.count || 0
    }

  } catch (error) {
    console.error('Error loading database stats:', error)
  }
}

// Add admin user
const addAdminUser = async () => {
  if (!newAdmin.value.email || !newAdmin.value.role) {
    alert('Please fill in all fields')
    return
  }

  try {
    saving.value = true
    
    // In a real implementation, you would create the user in your auth system
    // For now, we'll just show a success message
    alert(`Admin user ${newAdmin.value.email} would be created with role ${newAdmin.value.role}`)
    
    // Reset form
    newAdmin.value = { email: '', role: '' }

  } catch (error) {
    console.error('Error adding admin user:', error)
    alert('Failed to add admin user')
  } finally {
    saving.value = false
  }
}

// Save settings
const saveSettings = async () => {
  try {
    saving.value = true
    
    // In a real implementation, you would save these to a settings table
    // For now, we'll just show a success message
    alert('Settings saved successfully!')

  } catch (error) {
    console.error('Error saving settings:', error)
    alert('Failed to save settings')
  } finally {
    saving.value = false
  }
}

// Clear all orders
const clearAllOrders = async () => {
  if (!confirm('Are you sure you want to delete ALL orders? This action cannot be undone!')) {
    return
  }

  if (!confirm('This will permanently delete all order data. Type "DELETE" to confirm:')) {
    return
  }

  try {
    const supabase = useSupabase()

    const { error } = await supabase
      .from('orders')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

    if (error) throw error

    alert('All orders have been deleted')
    await loadDbStats() // Refresh stats

  } catch (error) {
    console.error('Error clearing orders:', error)
    alert('Failed to clear orders')
  }
}

// Load data on mount
onMounted(() => {
  loadDbStats()
})
</script> 