<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out" :class="{ '-translate-x-full': !sidebarOpen, 'translate-x-0': sidebarOpen }">
      <!-- Sidebar Header -->
      <div class="flex items-center justify-between h-16 px-6 bg-blue-600">
        <h1 class="text-xl font-semibold text-white">Admin Panel</h1>
        <button @click="sidebarOpen = false" class="text-white hover:text-gray-200 lg:hidden">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="mt-8">
        <div class="px-4 space-y-2">
          <!-- Dashboard -->
          <NuxtLink
            to="/admin/dashboard"
            class="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            :class="{ 'bg-blue-50 text-blue-700 border-r-2 border-blue-600': $route.path === '/admin/dashboard' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
            </svg>
            Dashboard
          </NuxtLink>

          <!-- Orders -->
          <NuxtLink
            to="/admin/orders"
            class="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            :class="{ 'bg-blue-50 text-blue-700 border-r-2 border-blue-600': $route.path.startsWith('/admin/orders') }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Orders
          </NuxtLink>

          <!-- Products -->
          <NuxtLink
            to="/admin/products"
            class="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            :class="{ 'bg-blue-50 text-blue-700 border-r-2 border-blue-600': $route.path.startsWith('/admin/products') }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Products
          </NuxtLink>

          <!-- Countries & PPP -->
          <NuxtLink
            to="/admin/countries"
            class="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            :class="{ 'bg-blue-50 text-blue-700 border-r-2 border-blue-600': $route.path.startsWith('/admin/countries') }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Countries & PPP
          </NuxtLink>

          <!-- Analytics -->
          <NuxtLink
            to="/admin/analytics"
            class="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            :class="{ 'bg-blue-50 text-blue-700 border-r-2 border-blue-600': $route.path.startsWith('/admin/analytics') }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </NuxtLink>

          <!-- Admin Users -->
          <NuxtLink
            to="/admin/users"
            class="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            :class="{ 'bg-blue-50 text-blue-700 border-r-2 border-blue-600': $route.path.startsWith('/admin/users') }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            Admin Users
          </NuxtLink>

          <!-- Settings -->
          <NuxtLink
            to="/admin/settings"
            class="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            :class="{ 'bg-blue-50 text-blue-700 border-r-2 border-blue-600': $route.path.startsWith('/admin/settings') }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </NuxtLink>
          
          <!-- Divider -->
          <div class="border-t border-gray-200 my-4"></div>
          
          <!-- Back to Order System -->
          <NuxtLink
            to="/"
            class="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Order System
          </NuxtLink>
        </div>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="lg:ml-64">
      <!-- Top Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="flex items-center justify-between h-16 px-6">
          <!-- Mobile menu button -->
          <button @click="sidebarOpen = true" class="text-gray-500 hover:text-gray-700 lg:hidden">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <!-- Page Title -->
          <div class="flex-1 lg:flex-none">
            <h1 class="text-2xl font-semibold text-gray-900">{{ pageTitle }}</h1>
          </div>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <!-- User Info -->
            <div class="hidden md:flex items-center space-x-3">
              <div class="text-right">
                <p class="text-sm font-medium text-gray-900">{{ adminUser?.email }}</p>
                <p class="text-xs text-gray-500 capitalize">{{ adminUser?.role?.replace('_', ' ') }}</p>
              </div>
              <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-white">{{ adminUser?.email?.charAt(0).toUpperCase() }}</span>
              </div>
            </div>

            <!-- Logout Button -->
            <button
              @click="handleLogout"
              class="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6">
        <slot />
      </main>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Sidebar state
const sidebarOpen = ref(false)

// Auth
const { adminUser, logout } = useAdminAuth()

// Page title based on route
const pageTitle = computed(() => {
  const route = useRoute()
  const path = route.path
  
  if (path === '/admin/dashboard') return 'Dashboard'
  if (path.startsWith('/admin/orders')) return 'Orders'
  if (path.startsWith('/admin/products')) return 'Products'
  if (path.startsWith('/admin/countries')) return 'Countries & PPP'
  if (path.startsWith('/admin/analytics')) return 'Analytics'
  if (path.startsWith('/admin/users')) return 'Admin Users'
  if (path.startsWith('/admin/settings')) return 'Settings'
  
  return 'Admin Panel'
})

// Handle logout
const handleLogout = async () => {
  await logout()
}

// Close sidebar on route change (mobile)
watch(() => useRoute().path, () => {
  sidebarOpen.value = false
})
</script> 