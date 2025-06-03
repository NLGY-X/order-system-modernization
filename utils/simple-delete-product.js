// Simple product deletion - no auth complexity
export async function deleteProduct(productId) {
  try {
    const response = await $fetch('/api/admin/delete-product', {
      method: 'POST',
      body: { productId }
    })
    
    return { success: true, data: response }
  } catch (error) {
    console.error('Failed to delete product:', error)
    return { success: false, error: error.message }
  }
} 