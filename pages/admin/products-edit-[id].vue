<template>
  <!-- Page Header -->
  <div class="mb-8">
    <div class="sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p class="mt-2 text-sm text-gray-700">
          Update product information and pricing
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

  <!-- Loading State -->
  <div v-if="loading" class="flex items-center justify-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <span class="ml-3 text-lg text-gray-600">Loading product...</span>
  </div>

  <!-- Product Not Found -->
  <div v-else-if="!product" class="text-center py-12">
    <h3 class="text-lg font-medium text-gray-900">Product not found</h3>
    <p class="mt-2 text-sm text-gray-500">The product you're looking for doesn't exist.</p>
    <NuxtLink
      to="/admin/products"
      class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
    >
      Back to Products
    </NuxtLink>
  </div>

  <!-- Product Form -->
  <div v-else class="bg-white shadow rounded-lg">
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-900">Product Information</h3>
      <p class="mt-1 text-sm text-gray-500">Update the product details and pricing structure</p>
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
        <div class="flex items-center justify-between mb-3">
          <label class="block text-sm font-medium text-gray-700">
            Pricing by Quantity & PPP Tier
          </label>
          <div class="text-sm text-gray-500">
            <span class="inline-flex items-center">
              <input
                id="update-pricing"
                v-model="updatePricing"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <label for="update-pricing" class="ml-2">Update pricing (leave unchecked to keep existing prices)</label>
            </span>
          </div>
        </div>
        
        <div class="border border-gray-300 rounded-lg overflow-hidden" :class="{ 'opacity-50': !updatePricing }">
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
                    :required="updatePricing"
                    :disabled="!updatePricing"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    placeholder="0.00"
                  />
                </td>
                <td class="px-4 py-3">
                  <input
                    v-model.number="productForm.pricing[index].tier1"
                    type="number"
                    step="0.01"
                    min="0"
                    :required="updatePricing"
                    :disabled="!updatePricing"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    placeholder="0.00"
                  />
                </td>
                <td class="px-4 py-3">
                  <input
                    v-model.number="productForm.pricing[index].tier2"
                    type="number"
                    step="0.01"
                    min="0"
                    :required="updatePricing"
                    :disabled="!updatePricing"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    placeholder="0.00"
                  />
                </td>
                <td class="px-4 py-3">
                  <input
                    v-model.number="productForm.pricing[index].tier3"
                    type="number"
                    step="0.01"
                    min="0"
                    :required="updatePricing"
                    :disabled="!updatePricing"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    placeholder="0.00"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="mt-2 text-sm text-gray-500">
          <span v-if="updatePricing">Enter prices for each quantity tier and PPP tier combination. All fields are required when updating pricing.</span>
          <span v-else>Current pricing will be preserved. Check the box above to modify pricing.</span>
        </p>
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
          {{ saving ? 'Updating Product...' : 'Update Product' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Protect this route with admin auth and set layout
definePageMeta({
  middleware: 'admin-auth',
  layout: 'admin'
})

// Set page metadata
useHead({
  title: 'Edit Product - Admin Panel',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Get product ID from route
const route = useRoute()
const productId = route.params.id

// Data
const loading = ref(true)
const saving = ref(false)
const product = ref(null)
const updatePricing = ref(false)

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

// Load product data
const loadProduct = async () => {
  try {
    loading.value = true
    const supabase = useSupabase()

    // Get product details
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (productError) throw productError

    product.value = productData
    productForm.value.name = productData.name
    productForm.value.description = productData.description || ''

    // Get pricing data
    const { data: pricingData, error: pricingError } = await supabase
      .from('product_prices')
      .select('*')
      .eq('product_id', productId)

    if (pricingError) throw pricingError

    // Organize pricing data by quantity tier and PPP tier
    quantityTiers.forEach((tier, index) => {
      // Map quantity tier display names to actual min/max quantities
      const quantityRanges = [
        { min: 1, max: 100 },    // 1-100
        { min: 101, max: 400 },  // 101-400
        { min: 401, max: 800 },  // 401-800
        { min: 801, max: null }  // 801+
      ]
      
      const range = quantityRanges[index]
      const tierPrices = pricingData.filter(p => 
        p.min_quantity === range.min && 
        (range.max === null ? p.max_quantity === null : p.max_quantity === range.max)
      )
      
      productForm.value.pricing[index] = {
        global: tierPrices.find(p => p.ppp_tier === 'Global')?.price_usd || 0,
        tier1: tierPrices.find(p => p.ppp_tier === 'Tier 1')?.price_usd || 0,
        tier2: tierPrices.find(p => p.ppp_tier === 'Tier 2')?.price_usd || 0,
        tier3: tierPrices.find(p => p.ppp_tier === 'Tier 3')?.price_usd || 0
      }
    })

  } catch (error) {
    console.error('Error loading product:', error)
    product.value = null
  } finally {
    loading.value = false
  }
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

    // Only validate pricing if user wants to update it
    if (updatePricing.value) {
      const allPricesValid = productForm.value.pricing.every(tier => 
        tier.global > 0 && tier.tier1 > 0 && tier.tier2 > 0 && tier.tier3 > 0
      )

      if (!allPricesValid) {
        alert('Please fill in all pricing fields with values greater than 0')
        return
      }
    }

    // Update product
    const { data: updateData, error: updateError } = await supabase
      .from('products')
      .update({ 
        name: productForm.value.name.trim(),
        description: productForm.value.description?.trim() || null
      })
      .eq('id', productId)
      .select() // Add select to return the updated data

    if (updateError) throw updateError

    // Only update pricing if checkbox is checked
    if (updatePricing.value) {
      // Delete existing prices for this product
      const { error: deleteError } = await supabase
        .from('product_prices')
        .delete()
        .eq('product_id', productId)

      if (deleteError) throw deleteError

      // Insert new prices
      const pricesToInsert = []

      // Convert form data to database format
      productForm.value.pricing.forEach((tier, tierIndex) => {
        // Map to correct quantity ranges
        const quantityRanges = [
          { min: 1, max: 100 },    // 1-100
          { min: 101, max: 400 },  // 101-400
          { min: 401, max: 800 },  // 401-800
          { min: 801, max: null }  // 801+
        ]
        
        const range = quantityRanges[tierIndex]

        // Map form field names to database ppp_tier values
        const pppMapping = {
          'global': 'Global',
          'tier1': 'Tier 1', 
          'tier2': 'Tier 2',
          'tier3': 'Tier 3'
        }

        Object.entries(pppMapping).forEach(([formField, dbTier]) => {
          if (tier[formField] > 0) {
            pricesToInsert.push({
              product_id: productId,
              min_quantity: range.min,
              max_quantity: range.max,
              ppp_tier: dbTier,
              price_usd: tier[formField]
            })
          }
        })
      })

      if (pricesToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('product_prices')
          .insert(pricesToInsert)

        if (insertError) throw insertError
      }
    }

    alert('Product updated successfully!')
    
    // Refresh the product data to show updated information
    await loadProduct()
    
    // Navigate back to products list
    await navigateTo('/admin/products')
  } catch (error) {
    console.error('Error saving product:', error)
    alert('Failed to save product: ' + error.message)
  } finally {
    saving.value = false
  }
}

// Load product data on mount
onMounted(() => {
  loadProduct()
})
</script> 