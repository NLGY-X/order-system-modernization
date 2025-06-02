<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Payment Successful!
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Thank you for your order. Your certification will be processed shortly.
        </p>
      </div>

      <div v-if="orderDetails" class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Order Details</h3>
        <dl class="space-y-3">
          <div>
            <dt class="text-sm font-medium text-gray-500">Product</dt>
            <dd class="text-sm text-gray-900">{{ orderDetails.product_name }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Quantity</dt>
            <dd class="text-sm text-gray-900">{{ orderDetails.quantity }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Country</dt>
            <dd class="text-sm text-gray-900">{{ orderDetails.country_name }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Total Paid</dt>
            <dd class="text-sm text-gray-900">${{ orderDetails.total_price_usd?.toFixed(2) || '0.00' }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Email</dt>
            <dd class="text-sm text-gray-900">{{ orderDetails.email }}</dd>
          </div>
        </dl>
      </div>

      <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800">
              What happens next?
            </h3>
            <div class="mt-2 text-sm text-blue-700">
              <p>You will receive a confirmation email shortly with your certification details and access instructions.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center">
        <NuxtLink to="/" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Place Another Order
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const sessionId = route.query.session_id

const orderDetails = ref(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  if (sessionId) {
    try {
      // Get order details based on session ID
      const supabase = useSupabase()
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('stripe_session_id', sessionId)
        .single()

      if (fetchError) {
        throw fetchError
      }

      orderDetails.value = data
    } catch (err) {
      console.error('Failed to fetch order details:', err)
      error.value = 'Failed to load order details'
    }
  }
  loading.value = false
})

// SEO
useHead({
  title: 'Payment Successful - Order System',
  meta: [
    { name: 'description', content: 'Your payment has been processed successfully.' }
  ]
})
</script> 