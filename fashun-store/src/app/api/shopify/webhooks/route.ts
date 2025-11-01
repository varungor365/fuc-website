/**
 * Shopify Webhook Handler
 * Receives webhooks from Shopify and triggers n8n workflows
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET!;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL!;

// Verify Shopify webhook signature
function verifyShopifyWebhook(body: string, hmac: string): boolean {
  const hash = crypto
    .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
    .update(body, 'utf8')
    .digest('base64');
  
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hmac));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const hmac = request.headers.get('x-shopify-hmac-sha256');
    const topic = request.headers.get('x-shopify-topic');
    const shopDomain = request.headers.get('x-shopify-shop-domain');

    // Verify webhook authenticity
    if (!hmac || !verifyShopifyWebhook(body, hmac)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = JSON.parse(body);

    console.log(`📦 Shopify Webhook Received: ${topic} from ${shopDomain}`);

    // Forward to n8n for processing
    if (N8N_WEBHOOK_URL) {
      await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Source': 'shopify',
          'X-Shopify-Topic': topic || '',
        },
        body: JSON.stringify({
          topic,
          shopDomain,
          payload,
          timestamp: new Date().toISOString(),
        }),
      });
    }

    // Handle specific webhook topics
    switch (topic) {
      case 'orders/create':
        await handleOrderCreate(payload);
        break;
      
      case 'orders/updated':
        await handleOrderUpdate(payload);
        break;
      
      case 'orders/fulfilled':
        await handleOrderFulfilled(payload);
        break;
      
      case 'orders/cancelled':
        await handleOrderCancelled(payload);
        break;
      
      case 'products/create':
      case 'products/update':
        await handleProductSync(payload);
        break;
      
      case 'products/delete':
        await handleProductDelete(payload);
        break;
      
      case 'inventory_levels/update':
        await handleInventoryUpdate(payload);
        break;
      
      case 'customers/create':
      case 'customers/update':
        await handleCustomerSync(payload);
        break;
      
      default:
        console.log(`⚠️ Unhandled webhook topic: ${topic}`);
    }

    return NextResponse.json({ success: true, topic });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Webhook handlers
async function handleOrderCreate(order: any) {
  console.log(`✅ New order: #${order.order_number}`);
  
  // Sync to Supabase
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = createClient();
  
  await supabase.from('orders').insert({
    shopify_order_id: order.id.toString(),
    order_number: order.order_number,
    email: order.email,
    total_price: parseFloat(order.total_price),
    currency: order.currency,
    financial_status: order.financial_status,
    fulfillment_status: order.fulfillment_status,
    customer_id: order.customer?.id?.toString(),
    order_data: order,
    created_at: order.created_at,
  });
}

async function handleOrderUpdate(order: any) {
  console.log(`🔄 Order updated: #${order.order_number}`);
  
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = createClient();
  
  await supabase
    .from('orders')
    .update({
      financial_status: order.financial_status,
      fulfillment_status: order.fulfillment_status,
      order_data: order,
      updated_at: new Date().toISOString(),
    })
    .eq('shopify_order_id', order.id.toString());
}

async function handleOrderFulfilled(order: any) {
  console.log(`📦 Order fulfilled: #${order.order_number}`);
  
  // Trigger fulfillment notification via n8n
  if (N8N_WEBHOOK_URL) {
    await fetch(`${N8N_WEBHOOK_URL}/order-fulfilled`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
  }
}

async function handleOrderCancelled(order: any) {
  console.log(`❌ Order cancelled: #${order.order_number}`);
  
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = createClient();
  
  await supabase
    .from('orders')
    .update({
      financial_status: 'cancelled',
      fulfillment_status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('shopify_order_id', order.id.toString());
}

async function handleProductSync(product: any) {
  console.log(`🔄 Syncing product: ${product.title}`);
  
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = createClient();
  
  await supabase.from('products').upsert({
    shopify_product_id: product.id.toString(),
    title: product.title,
    handle: product.handle,
    vendor: product.vendor,
    product_type: product.product_type,
    description: product.body_html,
    images: product.images,
    variants: product.variants,
    product_data: product,
    updated_at: new Date().toISOString(),
  }, {
    onConflict: 'shopify_product_id',
  });
}

async function handleProductDelete(product: any) {
  console.log(`🗑️ Product deleted: ${product.id}`);
  
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = createClient();
  
  await supabase
    .from('products')
    .update({ is_active: false })
    .eq('shopify_product_id', product.id.toString());
}

async function handleInventoryUpdate(inventory: any) {
  console.log(`📊 Inventory updated: Item ${inventory.inventory_item_id}`);
  
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = createClient();
  
  await supabase
    .from('inventory')
    .upsert({
      inventory_item_id: inventory.inventory_item_id.toString(),
      location_id: inventory.location_id?.toString(),
      available: inventory.available,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'inventory_item_id',
    });
  
  // Trigger low stock alert via n8n
  if (inventory.available < 5 && N8N_WEBHOOK_URL) {
    await fetch(`${N8N_WEBHOOK_URL}/low-stock-alert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inventory),
    });
  }
}

async function handleCustomerSync(customer: any) {
  console.log(`👤 Syncing customer: ${customer.email}`);
  
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = createClient();
  
  await supabase.from('customers').upsert({
    shopify_customer_id: customer.id.toString(),
    email: customer.email,
    first_name: customer.first_name,
    last_name: customer.last_name,
    phone: customer.phone,
    total_spent: parseFloat(customer.total_spent || '0'),
    orders_count: customer.orders_count || 0,
    customer_data: customer,
    updated_at: new Date().toISOString(),
  }, {
    onConflict: 'shopify_customer_id',
  });
}
