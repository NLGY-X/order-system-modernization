import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export interface PricingResult {
  unitPrice: number;
  totalPrice: number;
  pppTier: string;
}

export async function calculateOrderPrice(orderId: string): Promise<PricingResult> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Get order details
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, product_id, quantity, country_name')
    .eq('id', orderId)
    .single()

  if (orderError || !order) {
    throw new Error(`Order not found: ${orderId}`)
  }

  // Get PPP tier for the country
  const { data: pppClassification, error: pppError } = await supabase
    .from('ppp_classifications')
    .select('ppp_tier')
    .eq('country_name', order.country_name)
    .single()

  if (pppError || !pppClassification) {
    throw new Error(`PPP classification not found for country: ${order.country_name}`)
  }

  const pppTier = pppClassification.ppp_tier

  // Find the appropriate price tier for the quantity
  let unitPrice: number | null = null
  let finalPppTier = pppTier

  // First, try to find price for the specific PPP tier
  const { data: specificPrice, error: specificPriceError } = await supabase
    .from('product_prices')
    .select('unit_price, ppp_tier')
    .eq('product_id', order.product_id)
    .eq('ppp_tier', pppTier)
    .lte('quantity_tier_min', order.quantity)
    .gte('quantity_tier_max', order.quantity)
    .single()

  if (!specificPriceError && specificPrice) {
    unitPrice = specificPrice.unit_price
    finalPppTier = specificPrice.ppp_tier
  } else {
    // Fallback to Global pricing if specific tier not found
    const { data: globalPrice, error: globalPriceError } = await supabase
      .from('product_prices')
      .select('unit_price, ppp_tier')
      .eq('product_id', order.product_id)
      .eq('ppp_tier', 'Global')
      .lte('quantity_tier_min', order.quantity)
      .gte('quantity_tier_max', order.quantity)
      .single()

    if (!globalPriceError && globalPrice) {
      unitPrice = globalPrice.unit_price
      finalPppTier = 'Global'
    }
  }

  if (unitPrice === null) {
    throw new Error(`No price found for product ${order.product_id}, quantity ${order.quantity}, PPP tier ${pppTier} or Global`)
  }

  const totalPrice = unitPrice * order.quantity

  // Update the order with calculated prices
  const { error: updateError } = await supabase
    .from('orders')
    .update({
      calculated_unit_price: unitPrice,
      calculated_total_price: totalPrice
    })
    .eq('id', orderId)

  if (updateError) {
    throw new Error(`Failed to update order with calculated prices: ${updateError.message}`)
  }

  return {
    unitPrice,
    totalPrice,
    pppTier: finalPppTier
  }
} 