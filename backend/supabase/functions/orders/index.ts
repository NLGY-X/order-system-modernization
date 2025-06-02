import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OrderRequest {
  email: string;
  productName: string;
  countryName: string;
  quantity: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse request body
    const requestBody: OrderRequest = await req.json()
    
    // Validate required fields
    const { email, productName, countryName, quantity } = requestBody
    
    if (!email || !productName || !countryName || quantity === undefined) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: email, productName, countryName, and quantity are required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate email format (basic validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate quantity
    if (typeof quantity !== 'number' || quantity <= 0 || !Number.isInteger(quantity)) {
      return new Response(
        JSON.stringify({ error: 'Quantity must be a positive integer' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Look up the product by name
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('name', productName)
      .single()

    if (productError || !product) {
      return new Response(
        JSON.stringify({ error: `Product not found: ${productName}` }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Insert the new order
    const { data: newOrder, error: insertError } = await supabase
      .from('orders')
      .insert({
        customer_email: email,
        product_id: product.id,
        country_name: countryName,
        quantity: quantity,
        status: 'pending'
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('Error inserting order:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to create order' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        id: newOrder.id,
        message: 'Order created successfully' 
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 