// Supabase Edge Function: handle-phygital-orders
// Deploy this to Supabase Edge Functions
// supabase functions deploy handle-phygital-orders

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PhygitalOrder {
  order_id: string;
  customer_id: string;
  customer_username?: string;
  product_id: string;
  product_name: string;
  size: string;
  color: string;
  quantity: number;
  is_phygital: boolean;
  shipping_address: any;
}

interface PrintOnDemandPayload {
  order_id: string;
  product_name: string;
  size: string;
  color: string;
  quantity: number;
  qr_code_url?: string;
  qr_code_settings?: any;
  shipping_address: any;
  customer_info: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { order } = await req.json() as { order: PhygitalOrder }

    console.log('Processing phygital order:', order.order_id)

    let qrCodeUrl = null;
    let qrCodeSettings = null;

    // If this is a phygital order, get the customer's custom QR code
    if (order.is_phygital && order.customer_username) {
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('custom_qr_url, qr_settings, username')
        .eq('username', order.customer_username)
        .single()

      if (profile) {
        qrCodeUrl = profile.custom_qr_url
        qrCodeSettings = profile.qr_settings

        // If no custom QR code exists, generate a default one
        if (!qrCodeUrl) {
          console.log('No custom QR code found, using default for profile:', profile.username)
          qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(`https://p.fashun.co.in/${profile.username}`)}`
        }
      }
    }

    // Prepare payload for print-on-demand service (e.g., Printful, Gooten, etc.)
    const printPayload: PrintOnDemandPayload = {
      order_id: order.order_id,
      product_name: order.product_name,
      size: order.size,
      color: order.color,
      quantity: order.quantity,
      qr_code_url: qrCodeUrl,
      qr_code_settings: qrCodeSettings,
      shipping_address: order.shipping_address,
      customer_info: {
        customer_id: order.customer_id,
        username: order.customer_username
      }
    }

    // In production, this would make an API call to your print-on-demand provider
    // Example: Printful API call
    /*
    const printfulResponse = await fetch('https://api.printful.com/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('PRINTFUL_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        recipient: printPayload.shipping_address,
        items: [{
          sync_variant_id: getPrintfulVariantId(order.product_id, order.size, order.color),
          quantity: order.quantity,
          files: qrCodeUrl ? [{
            type: 'front',
            url: qrCodeUrl
          }] : []
        }]
      })
    })
    */

    // For demo purposes, log the payload
    console.log('Would send to print-on-demand provider:', printPayload)

    // Update order status in database
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({
        status: 'sent_to_printer',
        print_payload: printPayload,
        processed_at: new Date().toISOString()
      })
      .eq('id', order.order_id)

    if (updateError) {
      throw updateError
    }

    // Log the phygital order processing
    await supabaseClient
      .from('phygital_orders')
      .insert({
        order_id: order.order_id,
        customer_id: order.customer_id,
        qr_code_url: qrCodeUrl,
        qr_settings_used: qrCodeSettings,
        processed_at: new Date().toISOString(),
        status: 'processing'
      })

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Phygital order processed successfully',
        order_id: order.order_id,
        has_custom_qr: !!qrCodeUrl
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error processing phygital order:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

// Helper function to map product variants to print provider IDs
function getPrintfulVariantId(productId: string, size: string, color: string): number {
  // This would contain your mapping of internal product IDs to Printful variant IDs
  const variantMap: { [key: string]: number } = {
    'cyber-punk-hoodie-s-black': 4012,
    'cyber-punk-hoodie-m-black': 4013,
    'cyber-punk-hoodie-l-black': 4014,
    // Add more mappings as needed
  }
  
  const key = `${productId}-${size}-${color}`.toLowerCase()
  return variantMap[key] || 4012 // Default fallback
}