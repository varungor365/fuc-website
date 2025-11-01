import { NextRequest, NextResponse } from 'next/server';
import { updateInventory } from '@/lib/inventory/realtime-sync';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * Cron job to sync inventory across all channels
 * Runs every 15 minutes via Vercel Cron
 */
export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || process.env.REVALIDATE_SECRET;
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all products that need inventory sync
    const { data: products, error } = await supabase
      .from('products')
      .select('shopify_product_id, shopify_variant_id, inventory_item_id')
      .not('inventory_item_id', 'is', null);

    if (error) throw error;

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Sync each product's inventory
    for (const product of products || []) {
      try {
        // Get current Shopify inventory level
        const shopifyResponse = await fetch(
          `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/${process.env.SHOPIFY_API_VERSION}/inventory_levels.json?inventory_item_ids=${product.inventory_item_id}`,
          {
            headers: {
              'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!shopifyResponse.ok) {
          throw new Error(`Shopify API error: ${shopifyResponse.statusText}`);
        }

        const shopifyData = await shopifyResponse.json();
        const inventoryLevel = shopifyData.inventory_levels?.[0];

        if (inventoryLevel) {
          // Update local database with Shopify's current inventory
          await updateInventory(
            product.inventory_item_id,
            inventoryLevel.available,
            'shopify',
            'Automated sync from cron job'
          );
          results.success++;
        }
      } catch (error) {
        console.error(`Failed to sync inventory for ${product.inventory_item_id}:`, error);
        results.failed++;
        results.errors.push(`${product.inventory_item_id}: ${(error as Error).message}`);
      }
    }

    // Log sync results
    console.log('Inventory sync completed:', results);

    // Trigger n8n webhook for sync notification
    if (process.env.N8N_WEBHOOK_URL) {
      try {
        await fetch(`${process.env.N8N_WEBHOOK_URL}/inventory-sync-completed`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            results,
            totalProducts: products?.length || 0,
          }),
        });
      } catch (error) {
        console.error('Failed to notify n8n:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Inventory sync completed',
      results,
    });
  } catch (error) {
    console.error('Inventory sync cron error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to sync inventory',
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
}
