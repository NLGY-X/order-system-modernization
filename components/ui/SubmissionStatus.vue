<template>
  <div v-if="status !== 'idle'" class="mb-4">
    <!-- Loading State -->
    <div v-if="status === 'loading'" class="flex items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-md">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
      <span class="text-blue-700 font-medium">Processing your order...</span>
    </div>

    <!-- Success State -->
    <div v-else-if="status === 'success'" class="mb-6 bg-green-900/20 border border-green-500/30 text-green-300 px-4 py-3 rounded-lg backdrop-blur-sm">
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        Order submitted successfully!
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="status === 'error'" class="mb-6 bg-red-900/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg backdrop-blur-sm">
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        {{ errorMessage || 'An error occurred while processing your order.' }}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  status: {
    type: String,
    default: 'idle',
    validator: (value) => ['idle', 'loading', 'success', 'error'].includes(value)
  },
  errorMessage: {
    type: String,
    default: ''
  }
})
</script> 