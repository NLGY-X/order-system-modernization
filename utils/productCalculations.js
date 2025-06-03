/**
 * Calculate product pricing tiers for a given product
 * @param {string} productId - The product ID to calculate pricing for
 * @param {Array} pricingData - Array of pricing data from product_prices table
 * @returns {Array} Array of pricing tiers with quantity_tier and price
 */
export function calculateProductPricing(productId, pricingData) {
  if (!productId || !Array.isArray(pricingData)) {
    return []
  }

  const productPricing = pricingData.filter(p => p.product_id === productId)
  
  // Group by quantity ranges and return simplified structure
  const grouped = {}
  productPricing.forEach(p => {
    const key = `${p.min_quantity}-${p.max_quantity || '+'}`
    if (!grouped[key]) {
      grouped[key] = { 
        quantity_tier: key, 
        price: p.price_usd,
        min_quantity: p.min_quantity,
        max_quantity: p.max_quantity
      }
    }
  })
  
  return Object.values(grouped)
}

/**
 * Calculate product statistics (orders count and revenue)
 * @param {string} productId - The product ID to calculate stats for
 * @param {Array} productsData - Array of products data
 * @param {Array} ordersData - Array of orders data
 * @returns {Object} Object with orders count and total revenue
 */
export function calculateProductStats(productId, productsData, ordersData) {
  if (!productId || !Array.isArray(productsData) || !Array.isArray(ordersData)) {
    return { orders: 0, revenue: 0 }
  }

  // Find the product name first
  const product = productsData.find(p => p.id === productId)
  if (!product) {
    return { orders: 0, revenue: 0 }
  }
  
  const productOrders = ordersData.filter(o => o.product_name === product.name)
  
  return {
    orders: productOrders.length,
    revenue: productOrders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + (o.total_price_usd || 0), 0)
  }
}

/**
 * Find the best price for a given product and quantity
 * @param {string} productId - The product ID
 * @param {number} quantity - The desired quantity
 * @param {Array} pricingData - Array of pricing data from product_prices table
 * @returns {number|null} The price for the given quantity or null if not found
 */
export function findPriceForQuantity(productId, quantity, pricingData) {
  if (!productId || !quantity || quantity <= 0 || !Array.isArray(pricingData)) {
    return null
  }

  const productPricing = pricingData.filter(p => p.product_id === productId)
  
  // Find the pricing tier that matches the quantity
  const matchingTier = productPricing.find(p => {
    const minQty = p.min_quantity || 1
    const maxQty = p.max_quantity
    
    if (maxQty === null || maxQty === undefined) {
      // No max quantity means this tier applies to all quantities >= min
      return quantity >= minQty
    } else {
      // Check if quantity falls within the range
      return quantity >= minQty && quantity <= maxQty
    }
  })
  
  return matchingTier ? matchingTier.price_usd : null
}

/**
 * Calculate total order value for multiple products
 * @param {Array} orderItems - Array of order items {productId, quantity}
 * @param {Array} pricingData - Array of pricing data
 * @returns {number} Total order value
 */
export function calculateOrderTotal(orderItems, pricingData) {
  if (!Array.isArray(orderItems) || !Array.isArray(pricingData)) {
    return 0
  }

  return orderItems.reduce((total, item) => {
    const price = findPriceForQuantity(item.productId, item.quantity, pricingData)
    return total + (price ? price * item.quantity : 0)
  }, 0)
} 