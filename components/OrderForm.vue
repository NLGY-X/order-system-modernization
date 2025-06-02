<template>
  <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Place Your Order</h2>
    
    <SubmissionStatus :status="submissionStatus" :error-message="errorMessage" />
    
    <form @submit.prevent="handleSubmit">
      <SelectInput
        v-model="form.productId"
        label="Certification Package"
        :options="products"
        placeholder="Choose a certification package"
      />
      
      <SelectInput
        v-model="form.countryName"
        label="Country of Sale"
        :options="countries"
        placeholder="Select your country"
      />
      
      <NumberInput
        v-model="form.quantity"
        label="Quantity"
        placeholder="Enter quantity"
        :min="1"
      />
      
      <TextInput
        v-model="form.email"
        label="Email Address"
        type="email"
        placeholder="your.email@example.com"
      />
      
      <button
        type="submit"
        :disabled="submissionStatus === 'loading' || !isFormValid"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {{ submissionStatus === 'loading' ? 'Processing...' : 'Submit Order' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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

// Form validation
const isFormValid = computed(() => {
  return form.value.productId && 
         form.value.countryName && 
         form.value.quantity > 0 && 
         form.value.email && 
         isValidEmail(form.value.email)
})

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