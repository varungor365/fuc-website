/**
 * Real-Time Inventory Tracking System
 * Syncs inventory across Shopify, website, and n8n workflows
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface InventoryUpdate {
  inventoryItemId: string;
  locationId?: string;
  quantity: number;
  source: 'shopify' | 'website' | 'n8n' | 'manual';
  reason?: string;
}

interface InventoryAlert {
  productId: string;
  productTitle: string;
  variantTitle: string;
  currentStock: number;
  threshold: number;
  alertType: 'low_stock' | 'out_of_stock' | 'restock_needed';
}

/**
 * Update inventory across all channels
 */
export async function updateInventory(
  inventoryItemId: string,
  newQuantity: number,
  source: 'shopify' | 'website' | 'n8n' | 'manual' = 'website',
  notes?: string
): Promise<void> {
  try {
    // 1. Update Supabase database
    const { data: existing } = await supabase
      .from('inventory')
      .select('*')
      .eq('inventory_item_id', inventoryItemId)
      .single();

    if (existing) {
      await supabase
        .from('inventory')
        .update({
          available: newQuantity,
          updated_at: new Date().toISOString(),
          last_sync_source: source,
        })
        .eq('inventory_item_id', inventoryItemId);
    } else {
      await supabase.from('inventory').insert({
        inventory_item_id: inventoryItemId,
        available: newQuantity,
        last_sync_source: source,
      });
    }

    // 2. Log inventory change
    await supabase.from('inventory_logs').insert({
      inventory_item_id: inventoryItemId,
      previous_quantity: existing?.available || 0,
      new_quantity: newQuantity,
      change_amount: newQuantity - (existing?.available || 0),
      source,
      notes: notes || `Inventory updated via ${source}`,
      timestamp: new Date().toISOString(),
    });

    // 3. Check for alerts
    await checkInventoryAlerts(inventoryItemId, newQuantity);

    // 4. Sync to Shopify (if update came from website/n8n)
    if (source !== 'shopify' && process.env.SHOPIFY_ADMIN_ACCESS_TOKEN) {
      await syncToShopify(inventoryItemId, undefined, newQuantity);
    }

    // 5. Trigger n8n workflow for low stock
    if (newQuantity < 5) {
      await triggerLowStockWorkflow({
        inventoryItemId,
        quantity: newQuantity,
        source,
      });
    }

    // 6. Invalidate Next.js cache
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tags: ['inventory', `inventory-${inventoryItemId}`] }),
    });

    console.log(`✅ Inventory updated: ${inventoryItemId} → ${newQuantity} (source: ${source})`);
  } catch (error) {
    console.error('❌ Failed to update inventory:', error);
    throw error;
  }
}

/**
 * Sync inventory to Shopify
 */
async function syncToShopify(
  inventoryItemId: string,
  locationId: string | undefined,
  quantity: number
): Promise<void> {
  try {
    const response = await fetch(
      `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-10/inventory_levels/set.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
        },
        body: JSON.stringify({
          location_id: locationId || process.env.SHOPIFY_LOCATION_ID,
          inventory_item_id: inventoryItemId,
          available: quantity,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Shopify sync failed: ${response.statusText}`);
    }

    console.log(`✅ Synced to Shopify: ${inventoryItemId}`);
  } catch (error) {
    console.error('❌ Shopify sync error:', error);
  }
}

/**
 * Check inventory alerts and notify if needed
 */
async function checkInventoryAlerts(inventoryItemId: string, quantity: number): Promise<void> {
  const thresholds = {
    low_stock: 10,
    out_of_stock: 0,
    restock_needed: 2,
  };

  let alertType: InventoryAlert['alertType'] | null = null;

  if (quantity === 0) {
    alertType = 'out_of_stock';
  } else if (quantity <= thresholds.restock_needed) {
    alertType = 'restock_needed';
  } else if (quantity <= thresholds.low_stock) {
    alertType = 'low_stock';
  }

  if (alertType) {
    // Get product details
    const { data: product } = await supabase
      .from('products')
      .select('id, title, shopify_variant_id')
      .eq('inventory_item_id', inventoryItemId)
      .single();

    if (product) {
      const alert: InventoryAlert = {
        productId: product.id,
        productTitle: product.title,
        variantTitle: product.shopify_variant_id || 'Default',
        currentStock: quantity,
        threshold: thresholds[alertType],
        alertType,
      };

      // Send alert via n8n
      await sendInventoryAlert(alert);
    }
  }
}

/**
 * Send inventory alert via n8n
 */
async function sendInventoryAlert(alert: InventoryAlert): Promise<void> {
  try {
    await fetch(`${process.env.N8N_WEBHOOK_URL}/inventory-alert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alert),
    });
  } catch (error) {
    console.error('Failed to send inventory alert:', error);
  }
}

/**
 * Trigger n8n low stock workflow
 */
async function triggerLowStockWorkflow(data: any): Promise<void> {
  try {
    await fetch(`${process.env.N8N_WEBHOOK_URL}/low-stock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Failed to trigger low stock workflow:', error);
  }
}

/**
 * Get real-time inventory for a product
 */
export async function getInventory(inventoryItemId: string): Promise<number> {
  try {
    const { data } = await supabase
      .from('inventory')
      .select('available')
      .eq('inventory_item_id', inventoryItemId)
      .single();

    return data?.available || 0;
  } catch (error) {
    console.error('Failed to get inventory:', error);
    return 0;
  }
}

/**
 * Bulk inventory update (for syncing multiple items)
 */
export async function bulkUpdateInventory(updates: InventoryUpdate[]): Promise<void> {
  const promises = updates.map((update) => 
    updateInventory(update.inventoryItemId, update.quantity, update.source, update.reason)
  );
  await Promise.allSettled(promises);
}

/**
 * Get low stock items
 */
export async function getLowStockItems(threshold: number = 10): Promise<any[]> {
  try {
    const { data } = await supabase
      .from('inventory')
      .select('*, products(*)')
      .lte('available', threshold)
      .order('available', { ascending: true });

    return data || [];
  } catch (error) {
    console.error('Failed to get low stock items:', error);
    return [];
  }
}

/**
 * Reserve inventory (for pending orders)
 */
export async function reserveInventory(
  inventoryItemId: string,
  quantity: number,
  orderId: string
): Promise<boolean> {
  try {
    const current = await getInventory(inventoryItemId);
    
    if (current < quantity) {
      return false; // Not enough stock
    }

    // Create reservation
    await supabase.from('inventory_reservations').insert({
      inventory_item_id: inventoryItemId,
      order_id: orderId,
      quantity,
      reserved_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 min expiry
    });

    return true;
  } catch (error) {
    console.error('Failed to reserve inventory:', error);
    return false;
  }
}

/**
 * Release expired reservations (run via cron)
 */
export async function releaseExpiredReservations(): Promise<void> {
  try {
    const { data: expired } = await supabase
      .from('inventory_reservations')
      .select('*')
      .lt('expires_at', new Date().toISOString())
      .eq('released', false);

    if (expired && expired.length > 0) {
      // Mark as released
      await supabase
        .from('inventory_reservations')
        .update({ released: true, released_at: new Date().toISOString() })
        .in('id', expired.map((r) => r.id));

      console.log(`Released ${expired.length} expired reservations`);
    }
  } catch (error) {
    console.error('Failed to release reservations:', error);
  }
}
