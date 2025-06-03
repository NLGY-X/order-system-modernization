<template>
  <div class="w-full">
    <SubmissionStatus :status="submissionStatus" :error-message="errorMessage" />
    
    <form @submit.prevent="handleSubmit" class="space-y-8">
      <SelectInput
        v-model="form.productId"
        label="Certification Package"
        :options="products"
        placeholder="Choose a certification package"
        class="form-field"
      />
      
      <SelectInput
        v-model="form.countryName"
        label="Country of Sale"
        :options="countries"
        placeholder="Select your country"
        class="form-field"
      />
      
      <NumberInput
        v-model="form.quantity"
        label="Quantity"
        placeholder="Enter quantity"
        :min="1"
        class="form-field"
      />
      
      <TextInput
        v-model="form.email"
        label="Email Address"
        type="email"
        placeholder="your.email@example.com"
        class="form-field"
      />
      
      <!-- Pricing Preview -->
      <div v-if="pricingPreview" class="bg-gray-800/50 border border-gray-600 rounded-lg p-6 space-y-3">
        <h3 class="text-lg font-semibold text-white">Order Summary</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-300">Unit Price:</span>
            <span class="text-white">${{ pricingPreview.unitPrice.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-300">Quantity:</span>
            <span class="text-white">{{ pricingPreview.quantity }}</span>
          </div>
          <div v-if="pricingPreview.volumeDiscount < 1" class="flex justify-between text-green-400">
            <span>Volume Discount:</span>
            <span>{{ Math.round((1 - pricingPreview.volumeDiscount) * 100) }}% off</span>
          </div>
          <div v-if="pricingPreview.pppDiscount < 1" class="flex justify-between text-blue-400">
            <span>Regional Discount:</span>
            <span>{{ Math.round((1 - pricingPreview.pppDiscount) * 100) }}% off</span>
          </div>
          <hr class="border-gray-600">
          <div class="flex justify-between text-lg font-semibold">
            <span class="text-white">Total:</span>
            <span class="text-green-400">${{ pricingPreview.total.toFixed(2) }}</span>
          </div>
        </div>
      </div>
      
      <button
        type="submit"
        :disabled="submissionStatus === 'loading' || !isFormValid"
        class="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
      >
        <span v-if="submissionStatus === 'loading'" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing Order...
        </span>
        <span v-else class="flex items-center justify-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Proceed to Checkout
        </span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import SelectInput from './ui/SelectInput.vue'
import TextInput from './ui/TextInput.vue'
import NumberInput from './ui/NumberInput.vue'
import SubmissionStatus from './ui/SubmissionStatus.vue'

const props = defineProps({
  products: {
    type: Array,
    default: () => []
  },
  countries: {
    type: Array,
    default: () => []
  }
})

// Form state
const form = ref({
  productId: '',
  countryName: '',
  quantity: 1,
  email: ''
})

// Submission state
const submissionStatus = ref('idle')
const errorMessage = ref('')

// Pricing preview state
const pricingPreview = ref(null)
const pricingLoading = ref(false)

// Form validation
const isFormValid = computed(() => {
  return form.value.productId && 
         form.value.countryName && 
         form.value.quantity > 0 && 
         form.value.email && 
         isValidEmail(form.value.email)
})

// Watch for changes to calculate pricing
watch(
  () => [form.value.productId, form.value.countryName, form.value.quantity],
  async ([productId, countryName, quantity]) => {
    if (productId && countryName && quantity > 0) {
      await calculatePricing()
    } else {
      pricingPreview.value = null
    }
  },
  { deep: true }
)

// Calculate pricing preview
const calculatePricing = async () => {
  if (!form.value.productId || !form.value.countryName || form.value.quantity <= 0) {
    pricingPreview.value = null
    return
  }

  pricingLoading.value = true
  try {
    const selectedProduct = props.products.find(p => p.id === form.value.productId)
    if (!selectedProduct) return

    const response = await $fetch('/api/calculate-pricing', {
      method: 'POST',
      body: {
        productName: selectedProduct.name,
        countryName: form.value.countryName,
        quantity: form.value.quantity
      }
    })

    if (response.success) {
      pricingPreview.value = {
        unitPrice: response.unitPrice,
        quantity: form.value.quantity,
        total: response.unitPrice * form.value.quantity,
        volumeDiscount: response.volumeDiscount || 1,
        pppDiscount: response.pppDiscount || 1
      }
    }
  } catch (error) {
    console.error('Pricing calculation failed:', error)
    pricingPreview.value = null
  } finally {
    pricingLoading.value = false
  }
}

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Form submission
const handleSubmit = async () => {
  if (!isFormValid.value) {
    errorMessage.value = 'Please fill in all fields correctly'
    submissionStatus.value = 'error'
    return
  }

  submissionStatus.value = 'loading'
  errorMessage.value = ''

  try {
    // Get the selected product name
    const selectedProduct = props.products.find(p => p.id === form.value.productId)
    if (!selectedProduct) {
      throw new Error('Selected product not found')
    }

    // Create order using server-side endpoint (bypasses RLS issues)
    const orderResponse = await $fetch('/api/create-order', {
      method: 'POST',
      body: {
        email: form.value.email,
        productName: selectedProduct.name,
        countryName: form.value.countryName,
        quantity: form.value.quantity
      }
    })

    if (!orderResponse?.success) {
      throw new Error(orderResponse?.error || 'Failed to create order')
    }

    const orderData = orderResponse.order
    console.log('Order created successfully:', orderData)

    // Create Stripe checkout session
    const currentUrl = window.location.origin
    const checkoutResponse = await $fetch('/api/create-checkout', {
      method: 'POST',
      body: {
        orderData: {
          id: orderData.id,
          email: form.value.email,
          product_name: selectedProduct.name,
          country_name: form.value.countryName,
          quantity: form.value.quantity
        },
        returnUrl: currentUrl
      }
    })

    if (checkoutResponse?.checkout_url) {
      // Update order with Stripe checkout URL (using server endpoint)
      await $fetch('/api/update-order', {
        method: 'POST',
        body: {
          orderId: orderData.id,
          stripeCheckoutUrl: checkoutResponse.checkout_url,
          stripeSessionId: checkoutResponse.session_id
        }
      })

      // Redirect to Stripe checkout
      window.location.href = checkoutResponse.checkout_url
    } else {
      throw new Error('Failed to create payment checkout')
    }

  } catch (error) {
    console.error('Order submission failed:', error)
    submissionStatus.value = 'error'
    errorMessage.value = error.message || 'Failed to submit order'
  }
}
</script> 