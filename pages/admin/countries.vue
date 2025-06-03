<template>
  <div>
    <NuxtLayout name="admin">
      <!-- Page Header -->
      <div class="mb-8">
        <div class="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Countries & PPP Management</h1>
            <p class="mt-2 text-sm text-gray-700">
              Manage purchasing power parity classifications for different countries
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
            <button
              @click="showAddCountry = true"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Country
            </button>
          </div>
        </div>
      </div>

      <!-- PPP Tier Legend -->
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">PPP Tier System</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="flex items-center">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-3">
              Global
            </span>
            <span class="text-sm text-gray-600">Full Price (0% discount)</span>
          </div>
          <div class="flex items-center">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-3">
              Tier 1
            </span>
            <span class="text-sm text-gray-600">20% discount</span>
          </div>
          <div class="flex items-center">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-3">
              Tier 2
            </span>
            <span class="text-sm text-gray-600">35% discount</span>
          </div>
          <div class="flex items-center">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mr-3">
              Tier 3
            </span>
            <span class="text-sm text-gray-600">50% discount</span>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- PPP Tier Filter -->
          <div>
            <label for="tier-filter" class="block text-sm font-medium text-gray-700 mb-2">
              PPP Tier
            </label>
            <select
              id="tier-filter"
              v-model="filters.pppTier"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Tiers</option>
              <option value="GLOBAL">Global</option>
              <option value="TIER1">Tier 1</option>
              <option value="TIER2">Tier 2</option>
              <option value="TIER3">Tier 3</option>
            </select>
          </div>

          <!-- Search -->
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700 mb-2">
              Search Countries
            </label>
            <input
              id="search"
              v-model="filters.search"
              type="text"
              placeholder="Search by country name..."
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <!-- Results Count -->
          <div class="flex items-end">
            <div class="text-sm text-gray-500">
              Showing {{ filteredCountries.length }} of {{ countries.length }} countries
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-lg text-gray-600">Loading countries...</span>
      </div>

      <!-- Countries Table -->
      <div v-else class="bg-white shadow rounded-lg overflow-hidden">
        <!-- Empty State -->
        <div v-if="filteredCountries.length === 0" class="p-8 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No countries found</h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ countries.length === 0 ? 'No countries have been added yet.' : 'No countries match your current filters.' }}
          </p>
        </div>

        <!-- Countries Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PPP Tier
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="country in paginatedCountries" :key="country.id" class="hover:bg-gray-50">
                <!-- Country Name -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ country.country_name }}
                  </div>
                </td>

                <!-- PPP Tier -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getTierColor(country.ppp_tier)">
                    {{ country.ppp_tier }}
                  </span>
                </td>

                <!-- Discount -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ getTierDiscount(country.ppp_tier) }}
                </td>

                <!-- Orders Count -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ getCountryOrderCount(country.country_name) }}
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="editCountry(country)"
                    class="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteCountry(country.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredCountries.length) }} of {{ filteredCountries.length }} results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    page === currentPage
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="currentPage++"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Country Modal -->
      <div v-if="showAddCountry || editingCountry" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeCountryModal">
        <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white" @click.stop>
          <div class="mt-3">
            <!-- Modal Header -->
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">
                {{ editingCountry ? 'Edit Country' : 'Add New Country' }}
              </h3>
              <button @click="closeCountryModal" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Country Form -->
            <form @submit.prevent="saveCountry" class="space-y-4">
              <!-- Country Name -->
              <div>
                <label for="country-name" class="block text-sm font-medium text-gray-700 mb-2">
                  Country Name
                </label>
                <input
                  id="country-name"
                  v-model="countryForm.country_name"
                  type="text"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter country name"
                />
              </div>

              <!-- PPP Tier -->
              <div>
                <label for="ppp-tier" class="block text-sm font-medium text-gray-700 mb-2">
                  PPP Tier
                </label>
                <select
                  id="ppp-tier"
                  v-model="countryForm.ppp_tier"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select PPP Tier</option>
                  <option value="GLOBAL">Global (0% discount)</option>
                  <option value="TIER1">Tier 1 (20% discount)</option>
                  <option value="TIER2">Tier 2 (35% discount)</option>
                  <option value="TIER3">Tier 3 (50% discount)</option>
                </select>
              </div>

              <!-- Form Actions -->
              <div class="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  @click="closeCountryModal"
                  class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="saving"
                  class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {{ saving ? 'Saving...' : (editingCountry ? 'Update Country' : 'Add Country') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// Protect this route with admin auth
definePageMeta({
  middleware: 'admin-auth'
})

// Set page metadata
useHead({
  title: 'Countries Management - Admin Panel',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Data
const loading = ref(true)
const saving = ref(false)
const countries = ref([])
const orders = ref([])
const showAddCountry = ref(false)
const editingCountry = ref(null)

// Pagination
const currentPage = ref(1)
const itemsPerPage = 50

// Filters
const filters = ref({
  pppTier: '',
  search: ''
})

// Country form
const countryForm = ref({
  country_name: '',
  ppp_tier: ''
})

// Computed filtered countries
const filteredCountries = computed(() => {
  let filtered = [...countries.value]

  console.log('Filtering countries:', {
    total: countries.value.length,
    pppTierFilter: filters.value.pppTier,
    searchFilter: filters.value.search
  })

  // PPP Tier filter
  if (filters.value.pppTier) {
    filtered = filtered.filter(country => country.ppp_tier === filters.value.pppTier)
    console.log('After PPP tier filter:', filtered.length)
  }

  // Search filter
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    filtered = filtered.filter(country => 
      country.country_name.toLowerCase().includes(searchTerm)
    )
    console.log('After search filter:', filtered.length)
  }

  console.log('Final filtered results:', filtered.length)
  return filtered.sort((a, b) => a.country_name.localeCompare(b.country_name))
})

// Pagination computed properties
const totalPages = computed(() => Math.ceil(filteredCountries.value.length / itemsPerPage))

const paginatedCountries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredCountries.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Load data
const loadData = async () => {
  try {
    loading.value = true
    const supabase = useSupabase()

    const [countriesResult, ordersResult] = await Promise.all([
      supabase.from('ppp_classifications').select('*').order('country_name'),
      supabase.from('orders').select('country_name')
    ])

    if (countriesResult.error) throw countriesResult.error
    if (ordersResult.error) throw ordersResult.error

    countries.value = countriesResult.data || []
    orders.value = ordersResult.data || []

    console.log('Countries data loaded:', {
      countriesCount: countries.value.length,
      ordersCount: orders.value.length,
      countries: countries.value
    })

  } catch (error) {
    console.error('Error loading data:', error)
  } finally {
    loading.value = false
  }
}

// Get tier color
const getTierColor = (tier) => {
  switch (tier) {
    case 'GLOBAL':
      return 'bg-gray-100 text-gray-800'
    case 'TIER1':
      return 'bg-blue-100 text-blue-800'
    case 'TIER2':
      return 'bg-green-100 text-green-800'
    case 'TIER3':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Get tier discount
const getTierDiscount = (tier) => {
  switch (tier) {
    case 'GLOBAL':
      return '0%'
    case 'TIER1':
      return '20%'
    case 'TIER2':
      return '35%'
    case 'TIER3':
      return '50%'
    default:
      return 'N/A'
  }
}

// Get country order count
const getCountryOrderCount = (countryName) => {
      return orders.value.filter(order => order.country_name === countryName).length
}

// Edit country
const editCountry = (country) => {
  editingCountry.value = country
  countryForm.value = {
    country_name: country.country_name,
    ppp_tier: country.ppp_tier
  }
}

// Save country
const saveCountry = async () => {
  try {
    saving.value = true
    const supabase = useSupabase()

    if (editingCountry.value) {
      // Update existing country
      const { error } = await supabase
        .from('ppp_classifications')
        .update(countryForm.value)
        .eq('id', editingCountry.value.id)

      if (error) throw error

    } else {
      // Create new country
      const { error } = await supabase
        .from('ppp_classifications')
        .insert(countryForm.value)

      if (error) throw error
    }

    // Refresh data
    await loadData()
    closeCountryModal()

  } catch (error) {
    console.error('Error saving country:', error)
  } finally {
    saving.value = false
  }
}

// Delete country
const deleteCountry = async (countryId) => {
  if (!confirm('Are you sure you want to delete this country? This action cannot be undone.')) {
    return
  }

  try {
    const supabase = useSupabase()

    const { error } = await supabase
      .from('ppp_classifications')
      .delete()
      .eq('id', countryId)

    if (error) throw error

    // Refresh data
    await loadData()

  } catch (error) {
    console.error('Error deleting country:', error)
  }
}

// Close country modal
const closeCountryModal = () => {
  showAddCountry.value = false
  editingCountry.value = null
  countryForm.value = {
    country_name: '',
    ppp_tier: ''
  }
}

// Watch for filter changes and reset pagination
watch(filters, () => {
  currentPage.value = 1
  console.log('Filters changed, reset to page 1:', filters.value)
}, { deep: true })

// Apply filters
const applyFilters = () => {
  console.log('applyFilters called with:', filters.value)
  currentPage.value = 1 // Reset to first page when filtering
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