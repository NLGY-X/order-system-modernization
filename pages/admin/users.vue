<template>
  <!-- Page Header -->
  <div class="mb-8">
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Admin Users</h1>
        <p class="mt-2 text-sm text-gray-700">
          Manage admin users and their permissions
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button
          @click="showInviteModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Invite Admin User
        </button>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-if="loading" class="flex items-center justify-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <span class="ml-3 text-lg text-gray-600">Loading admin users...</span>
  </div>

  <!-- Admin Users Table -->
  <div v-else class="bg-white shadow rounded-lg overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-900">Admin Users ({{ adminUsers.length }})</h3>
    </div>
    
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Login
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Invited
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in adminUsers" :key="user.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div class="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <span class="text-sm font-medium text-white">{{ user.email.charAt(0).toUpperCase() }}</span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ user.email }}</div>
                  <div class="text-sm text-gray-500">ID: {{ user.id.substring(0, 8) }}...</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getRoleColor(user.role)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                {{ user.role.replace('_', ' ').toUpperCase() }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusColor(user.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                {{ user.status.toUpperCase() }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ user.last_login ? formatDate(user.last_login) : 'Never' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(user.invited_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <button
                  v-if="user.status === 'active'"
                  @click="toggleUserStatus(user)"
                  class="text-yellow-600 hover:text-yellow-900"
                  title="Deactivate user"
                >
                  Deactivate
                </button>
                <button
                  v-if="user.status === 'inactive'"
                  @click="toggleUserStatus(user)"
                  class="text-green-600 hover:text-green-900"
                  title="Activate user"
                >
                  Activate
                </button>
                <button
                  v-if="canDeleteUser(user)"
                  @click="deleteUser(user)"
                  class="text-red-600 hover:text-red-900 ml-4"
                  title="Delete user"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="adminUsers.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No admin users</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by inviting your first admin user.</p>
    </div>
  </div>

  <!-- Invite User Modal -->
  <div v-if="showInviteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Invite Admin User</h3>
        
        <form @submit.prevent="inviteUser" class="space-y-4">
          <div>
            <label for="invite-email" class="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              id="invite-email"
              v-model="inviteForm.email"
              type="email"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="admin@example.com"
            />
          </div>
          
          <div>
            <label for="invite-role" class="block text-sm font-medium text-gray-700">Role</label>
            <select
              id="invite-role"
              v-model="inviteForm.role"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
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
              :disabled="inviting"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {{ inviting ? 'Inviting...' : 'Send Invite' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAdminAuthV2 } from '@/composables/useAdminAuthV2'

// Protect this route with admin auth and set layout
definePageMeta({
  middleware: 'admin-auth',
  layout: 'admin'
})

// Set page metadata
useHead({
  title: 'Admin Users - Admin Panel',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Data
const loading = ref(true)
const adminUsers = ref([])
const showInviteModal = ref(false)
const inviting = ref(false)
const { adminUser } = useAdminAuthV2()

// Invite form
const inviteForm = ref({
  email: '',
  role: 'admin'
})

// Load admin users
const loadAdminUsers = async () => {
  try {
    loading.value = true
    const supabase = useSupabase()

    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    adminUsers.value = data || []
  } catch (error) {
    console.error('Error loading admin users:', error)
    alert('Failed to load admin users')
  } finally {
    loading.value = false
  }
}

// Invite new user
const inviteUser = async () => {
  try {
    inviting.value = true
    const supabase = useSupabase()

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', inviteForm.value.email)
      .single()

    if (existingUser) {
      alert('User with this email already exists')
      return
    }

    // Create admin user record (they'll need to sign up through Supabase Auth separately)
    const { error } = await supabase
      .from('admin_users')
      .insert({
        email: inviteForm.value.email,
        role: inviteForm.value.role,
        status: 'pending',
        invited_by: adminUser.value?.id
      })

    if (error) throw error

    alert(`Invitation sent to ${inviteForm.value.email}`)
    showInviteModal.value = false
    inviteForm.value = { email: '', role: 'admin' }
    
    // Reload the list
    await loadAdminUsers()
  } catch (error) {
    console.error('Error inviting user:', error)
    alert('Failed to send invitation')
  } finally {
    inviting.value = false
  }
}

// Toggle user status
const toggleUserStatus = async (user) => {
  try {
    const newStatus = user.status === 'active' ? 'inactive' : 'active'
    const supabase = useSupabase()

    const { error } = await supabase
      .from('admin_users')
      .update({ status: newStatus })
      .eq('id', user.id)

    if (error) throw error

    user.status = newStatus
  } catch (error) {
    console.error('Error updating user status:', error)
    alert('Failed to update user status')
  }
}

// Delete user
const deleteUser = async (user) => {
  if (!confirm(`Are you sure you want to delete ${user.email}?`)) return

  try {
    const supabase = useSupabase()

    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', user.id)

    if (error) throw error

    // Remove from local list
    adminUsers.value = adminUsers.value.filter(u => u.id !== user.id)
  } catch (error) {
    console.error('Error deleting user:', error)
    alert('Failed to delete user')
  }
}

// Check if current user can delete another user
const canDeleteUser = (user) => {
  // Can't delete yourself, only super admins can delete others
  return adminUser.value?.role === 'super_admin' && user.id !== adminUser.value?.id
}

// Utility functions
const getRoleColor = (role) => {
  return {
    'bg-purple-100 text-purple-800': role === 'super_admin',
    'bg-blue-100 text-blue-800': role === 'admin'
  }
}

const getStatusColor = (status) => {
  return {
    'bg-green-100 text-green-800': status === 'active',
    'bg-yellow-100 text-yellow-800': status === 'pending',
    'bg-red-100 text-red-800': status === 'inactive'
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Load data on mount
onMounted(() => {
  loadAdminUsers()
})
</script> 