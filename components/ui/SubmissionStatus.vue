<template>
  <div v-if="status !== 'idle'" class="mb-4">
    <!-- Loading State -->
    <div v-if="status === 'loading'" class="flex items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-md">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
      <span class="text-blue-700 font-medium">Processing your order...</span>
    </div>

    <!-- Success State -->
    <div v-else-if="status === 'success'" class="p-4 bg-green-50 border border-green-200 rounded-md">
      <div class="flex items-center">
        <svg class="h-6 w-6 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <div>
          <h3 class="text-green-800 font-medium">Order Submitted Successfully!</h3>
          <p class="text-green-700 text-sm mt-1">
            Thank you! Your order has been received. Please check your email for the payment link.
          </p>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="status === 'error'" class="p-4 bg-red-50 border border-red-200 rounded-md">
      <div class="flex items-center">
        <svg class="h-6 w-6 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 class="text-red-800 font-medium">Submission Failed</h3>
          <p class="text-red-700 text-sm mt-1">
            {{ errorMessage || 'Sorry, there was a problem submitting your order. Please try again.' }}
          </p>
        </div>
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