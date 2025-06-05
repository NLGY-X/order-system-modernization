<template>
  <!-- Page Header -->
  <div class="mb-8">
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Partner Management</h1>
        <p class="mt-2 text-sm text-gray-700">
          Manage partner organizations and their access to the order system
        </p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3">
        <button
          @click="showApplicationsModal = true"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 0a9 9 0 1118 0 9 9 0 01-18 0z" />
          </svg>
          View Applications
        </button>
        <button
          @click="showInviteModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Partner Directly
        </button>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-if="loading" class="flex items-center justify-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <span class="ml-3 text-lg text-gray-600">Loading partners...</span>
  </div>

  <!-- Partners Table -->
  <div v-else class="bg-white shadow rounded-lg overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-900">Active Partners ({{ partners.length }})</h3>
    </div>
    
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Organization
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Volume Tier
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Login
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="partner in partners" :key="partner.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div class="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center">
                    <span class="text-sm font-medium text-white">{{ partner.organization_name.charAt(0).toUpperCase() }}</span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ partner.organization_name }}</div>
                  <div class="text-sm text-gray-500">{{ partner.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ partner.contact_name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getTierColor(partner.volume_tier)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                {{ partner.volume_tier.replace('_', ' ').toUpperCase() }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusColor(partner.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                {{ partner.status.toUpperCase() }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ partner.last_login ? formatDate(partner.last_login) : 'Never' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(partner.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <button
                  @click="editPartner(partner)"
                  class="text-blue-600 hover:text-blue-900"
                  title="Edit partner"
                >
                  Edit
                </button>
                <button
                  v-if="partner.status === 'active'"
                  @click="togglePartnerStatus(partner)"
                  class="text-yellow-600 hover:text-yellow-900"
                  title="Suspend partner"
                >
                  Suspend
                </button>
                <button
                  v-if="partner.status === 'suspended'"
                  @click="togglePartnerStatus(partner)"
                  class="text-green-600 hover:text-green-900"
                  title="Activate partner"
                >
                  Activate
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="partners.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857M12 4a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No partners yet</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by adding your first partner organization.</p>
    </div>
  </div>

  <!-- Add Partner Modal -->
  <div v-if="showInviteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Add New Partner</h3>
        
        <form @submit.prevent="createPartner" class="space-y-4">
          <div>
            <label for="organization-name" class="block text-sm font-medium text-gray-700">Organization Name</label>
            <input
              id="organization-name"
              v-model="partnerForm.organization_name"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Example Training Academy"
            />
          </div>

          <div>
            <label for="contact-name" class="block text-sm font-medium text-gray-700">Contact Name</label>
            <input
              id="contact-name"
              v-model="partnerForm.contact_name"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="John Smith"
            />
          </div>
          
          <div>
            <label for="partner-email" class="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              id="partner-email"
              v-model="partnerForm.email"
              type="email"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="john@trainingacademy.com"
            />
          </div>

          <div>
            <label for="partner-password" class="block text-sm font-medium text-gray-700">Temporary Password</label>
            <input
              id="partner-password"
              v-model="partnerForm.password"
              type="password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter temporary password"
            />
            <p class="mt-1 text-xs text-gray-500">Partner will be asked to change this on first login</p>
          </div>
          
          <div>
            <label for="volume-tier" class="block text-sm font-medium text-gray-700">Volume Tier</label>
            <select
              id="volume-tier"
              v-model="partnerForm.volume_tier"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="standard">Standard (0-100 certificates/month)</option>
              <option value="premium">Premium (100-500 certificates/month)</option>
              <option value="enterprise">Enterprise (500+ certificates/month)</option>
            </select>
          </div>

          <div>
            <label for="notes" class="block text-sm font-medium text-gray-700">Notes (Optional)</label>
            <textarea
              id="notes"
              v-model="partnerForm.notes"
              rows="3"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any additional notes about this partner..."
            ></textarea>
          </div>
          
          <div class="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="showInviteModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="creating"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {{ creating ? 'Creating...' : 'Create Partner' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Applications Modal (placeholder) -->
  <div v-if="showApplicationsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Partner Applications</h3>
        <p class="text-gray-600 mb-4">View and approve partner applications from the signup form.</p>
        <div class="text-center py-8">
          <p class="text-gray-500">This feature will show applications from /signup form</p>
          <p class="text-sm text-gray-400 mt-2">Coming soon...</p>
        </div>
        <div class="flex justify-end">
          <button
            @click="showApplicationsModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminAuthV2 } from '@/composables/useAdminAuthV2'

// Protect this route with admin auth and set layout
definePageMeta({
  middleware: 'admin-auth',
  layout: 'admin'
})

// Set page metadata
useHead({
  title: 'Partners - Admin Panel',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Data
const loading = ref(true)
const partners = ref([])
const showInviteModal = ref(false)
const showApplicationsModal = ref(false)
const creating = ref(false)
const { adminUser } = useAdminAuthV2()

// Partner form
const partnerForm = ref({
  organization_name: '',
  contact_name: '',
  email: '',
  password: '',
  volume_tier: 'standard',
  notes: ''
})

// Load partners
const loadPartners = async () => {
  try {
    loading.value = true
    const supabase = useSupabase()

    const { data, error } = await supabase
      .from('partner_users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    partners.value = data || []
  } catch (error) {
    console.error('Error loading partners:', error)
    alert('Failed to load partners')
  } finally {
    loading.value = false
  }
}

// Create partner
const createPartner = async () => {
  try {
    creating.value = true
    
    // Call API to create partner user with Supabase Auth + partner_users record
    const response = await fetch('/api/admin/create-partner', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminUser.value?.token || 'admin'}`
      },
      body: JSON.stringify(partnerForm.value)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to create partner')
    }

    const result = await response.json()
    
    alert(`Partner created successfully! Login credentials:\nEmail: ${result.credentials.email}\nPassword: ${result.credentials.password}`)
    
    // Reset form and close modal
    partnerForm.value = {
      organization_name: '',
      contact_name: '',
      email: '',
      password: '',
      volume_tier: 'standard',
      notes: ''
    }
    showInviteModal.value = false
    
    // Reload partners list
    await loadPartners()
    
  } catch (error) {
    console.error('Error creating partner:', error)
    alert(error.message || 'Failed to create partner')
  } finally {
    creating.value = false
  }
}

// Toggle partner status
const togglePartnerStatus = async (partner) => {
  try {
    const newStatus = partner.status === 'active' ? 'suspended' : 'active'
    const supabase = useSupabase()

    const { error } = await supabase
      .from('partner_users')
      .update({ status: newStatus })
      .eq('id', partner.id)

    if (error) throw error

    partner.status = newStatus
    alert(`Partner ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`)
  } catch (error) {
    console.error('Error updating partner status:', error)
    alert('Failed to update partner status')
  }
}

// Edit partner (placeholder)
const editPartner = (partner) => {
  alert('Edit partner functionality coming soon...')
}

// Utility functions
const getTierColor = (tier) => {
  const colors = {
    standard: 'bg-gray-100 text-gray-800',
    premium: 'bg-blue-100 text-blue-800',
    enterprise: 'bg-purple-100 text-purple-800'
  }
  return colors[tier] || colors.standard
}

const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    suspended: 'bg-red-100 text-red-800',
    inactive: 'bg-gray-100 text-gray-800'
  }
  return colors[status] || colors.pending
}

const formatDate = (dateString) => {
  if (!dateString) return 'Never'
  return new Date(dateString).toLocaleDateString()
}

// Load data on mount
onMounted(() => {
  loadPartners()
})
</script> 