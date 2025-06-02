<template>
  <!-- Page Header -->
  <div class="mb-8">
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p class="mt-2 text-sm text-gray-700">
          Create a new product with pricing across different PPP tiers
        </p>
      </div>
      <div class="mt-4 sm:mt-0">
        <NuxtLink
          to="/admin/products"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Products
        </NuxtLink>
      </div>
    </div>
  </div>

  <!-- Product Form -->
  <div class="bg-white shadow rounded-lg">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-900">Product Information</h3>
      <p class="mt-1 text-sm text-gray-500">Enter the product details and pricing structure</p>
    </div>
    
    <form @submit.prevent="saveProduct" class="p-6 space-y-6">
      <!-- Product Name -->
      <div>
        <label for="product-name" class="block text-sm font-medium text-gray-700 mb-2">
          Product Name *
        </label>
        <input
          id="product-name"
          v-model="productForm.name"
          type="text"
          required
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Enter product name"
        />
      </div>

      <!-- Product Description -->
      <div>
        <label for="product-description" class="block text-sm font-medium text-gray-700 mb-2">
          Product Description
        </label>
        <textarea
          id="product-description"
          v-model="productForm.description"
          rows="3"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Enter product description (optional)"
        ></textarea>
      </div>

      <!-- PPP Tier Information -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 class="text-sm font-medium text-blue-900 mb-2">PPP Tier System</h4>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div class="flex items-center">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
              Global
            </span>
            <span class="text-blue-700">Full Price (0% discount)</span>
          </div>
          <div class="flex items-center">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
              Tier 1
            </span>
            <span class="text-blue-700">20% discount</span>
          </div>
          <div class="flex items-center">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
              Tier 2
            </span>
            <span class="text-blue-700">35% discount</span>
          </div>
          <div class="flex items-center">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mr-2">
              Tier 3
            </span>
            <span class="text-blue-700">50% discount</span>
          </div>
        </div>
      </div>

      <!-- Pricing Grid -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">
          Pricing by Quantity & PPP Tier *
        </label>
        <div class="border border-gray-300 rounded-lg overflow-hidden">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Quantity Tier</th>
                <th class="px-4 py-3 text-center text-sm font-medium text-gray-700">Global</th>
                <th class="px-4 py-3 text-center text-sm font-medium text-gray-700">Tier 1 (20% off)</th>
                <th class="px-4 py-3 text-center text-sm font-medium text-gray-700">Tier 2 (35% off)</th>
                <th class="px-4 py-3 text-center text-sm font-medium text-gray-700">Tier 3 (50% off)</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(tier, index) in quantityTiers" :key="tier" class="hover:bg-gray-50">
                <td class="px-4 py-3 font-medium text-gray-900">{{ tier }}</td>
                <td class="px-4 py-3">
                  <input
                    v-model.number="productForm.pricing[index].global"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </td>
                <td class="px-4 py-3">
                  <input
                    v-model.number="productForm.pricing[index].tier1"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </td>
                <td class="px-4 py-3">
                  <input
                    v-model.number="productForm.pricing[index].tier2"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </td>
                <td class="px-4 py-3">
                  <input
                    v-model.number="productForm.pricing[index].tier3"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="mt-2 text-sm text-gray-500">
          Enter prices for each quantity tier and PPP tier combination. All fields are required.
        </p>
      </div>

      <!-- Auto-calculate Helper -->
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 class="text-sm font-medium text-yellow-900 mb-2">Quick Fill Helper</h4>
        <p class="text-sm text-yellow-700 mb-3">
          Enter a base price for the 1-100 Global tier, and we'll auto-calculate the other tiers based on PPP discounts.
        </p>
        <div class="flex items-center space-x-3">
          <input
            v-model.number="basePrice"
            type="number"
            step="0.01"
            min="0"
            class="w-32 px-3 py-2 border border-yellow-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            placeholder="Base price"
          />
          <button
            type="button"
            @click="autoCalculatePricing"
            :disabled="!basePrice || basePrice <= 0"
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-800 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
          >
            Auto-calculate
          </button>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <NuxtLink
          to="/admin/products"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </NuxtLink>
        <button
          type="submit"
          :disabled="saving"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {{ saving ? 'Creating Product...' : 'Create Product' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Protect this route with admin auth and set layout
definePageMeta({
  middleware: 'admin-auth',
  layout: 'admin'
})

// Set page metadata
useHead({
  title: 'Add New Product - Admin Panel',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Data
const saving = ref(false)
const basePrice = ref(null)

// Quantity tiers
const quantityTiers = ['1-100', '101-400', '401-800', '801+']

// Product form
const productForm = ref({
  name: '',
  description: '',
  pricing: [
    { global: null, tier1: null, tier2: null, tier3: null }, // 1-100
    { global: null, tier1: null, tier2: null, tier3: null }, // 101-400
    { global: null, tier1: null, tier2: null, tier3: null }, // 401-800
    { global: null, tier1: null, tier2: null, tier3: null }  // 801+
  ]
})

// Auto-calculate pricing based on base price
const autoCalculatePricing = () => {
  if (!basePrice.value || basePrice.value <= 0) return

  const base = basePrice.value

  // Calculate for first tier (1-100) with PPP discounts
  productForm.value.pricing[0] = {
    global: base,
    tier1: Math.round((base * 0.8) * 100) / 100, // 20% off
    tier2: Math.round((base * 0.65) * 100) / 100, // 35% off
    tier3: Math.round((base * 0.5) * 100) / 100   // 50% off
  }

  // Calculate for other quantity tiers (with slight volume discounts)
  const volumeDiscounts = [1, 0.95, 0.9, 0.85] // 0%, 5%, 10%, 15% volume discounts

  quantityTiers.forEach((tier, index) => {
    const volumeMultiplier = volumeDiscounts[index]
    productForm.value.pricing[index] = {
      global: Math.round((base * volumeMultiplier) * 100) / 100,
      tier1: Math.round((base * volumeMultiplier * 0.8) * 100) / 100,
      tier2: Math.round((base * volumeMultiplier * 0.65) * 100) / 100,
      tier3: Math.round((base * volumeMultiplier * 0.5) * 100) / 100
    }
  })
}

// Save product
const saveProduct = async () => {
  try {
    saving.value = true
    const supabase = useSupabase()

    // Validate form
    if (!productForm.value.name.trim()) {
      alert('Product name is required')
      return
    }

    // Check if all pricing fields are filled
    const allPricesValid = productForm.value.pricing.every(tier => 
      tier.global > 0 && tier.tier1 > 0 && tier.tier2 > 0 && tier.tier3 > 0
    )

    if (!allPricesValid) {
      alert('Please fill in all pricing fields with values greater than 0')
      return
    }

    // Create product
    const { data: newProduct, error: createError } = await supabase
      .from('products')
      .insert({ 
        name: productForm.value.name.trim(),
        description: productForm.value.description?.trim() || null
      })
      .select()
      .single()

    if (createError) throw createError

    // Insert pricing data
    const pricingData = []
    quantityTiers.forEach((tier, index) => {
      const tierPricing = productForm.value.pricing[index]
      
      Object.entries(tierPricing).forEach(([pppTier, price]) => {
        if (price > 0) {
          pricingData.push({
            product_id: newProduct.id,
            quantity_tier: tier,
            ppp_tier: pppTier.toUpperCase(),
            price: price
          })
        }
      })
    })

    if (pricingData.length > 0) {
      const { error: pricingError } = await supabase
        .from('product_prices')
        .insert(pricingData)

      if (pricingError) throw pricingError
    }

    // Success - redirect to products page
    await navigateTo('/admin/products')

  } catch (error) {
    console.error('Error creating product:', error)
    alert('Failed to create product. Please try again.')
  } finally {
    saving.value = false
  }
}
</script> 