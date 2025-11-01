import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * System metrics endpoint for monitoring dashboards
 * Requires authentication
 */
export async function GET(request: NextRequest) {
  // Verify auth token
  const authHeader = request.headers.get('authorization');
  const apiToken = process.env.METRICS_API_TOKEN || process.env.REVALIDATE_SECRET;
  
  if (authHeader !== `Bearer ${apiToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const metrics = await collectMetrics();
    
    return NextResponse.json(metrics, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Metrics collection error:', error);
    return NextResponse.json(
      { error: 'Failed to collect metrics', details: (error as Error).message },
      { status: 500 }
    );
  }
}

async function collectMetrics() {
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Orders metrics
  const { data: orders24h } = await supabase
    .from('orders')
    .select('total_price, status')
    .gte('created_at', last24Hours.toISOString());

  const { data: orders7d } = await supabase
    .from('orders')
    .select('total_price, status')
    .gte('created_at', last7Days.toISOString());

  // Abandoned carts metrics
  const { data: abandonedCarts } = await supabase
    .from('abandoned_carts')
    .select('total_value, status, recovered_at')
    .gte('created_at', last7Days.toISOString());

  // Inventory metrics
  const { data: inventoryAlerts } = await supabase
    .from('inventory')
    .select('quantity, alert_threshold')
    .lt('quantity', supabase.rpc('alert_threshold'));

  const { data: inventoryLogs } = await supabase
    .from('inventory_logs')
    .select('*')
    .gte('created_at', last24Hours.toISOString());

  // Product metrics
  const { data: products } = await supabase
    .from('products')
    .select('id, title, status');

  // Customer metrics
  const { data: customers } = await supabase
    .from('customers')
    .select('id, created_at')
    .gte('created_at', last7Days.toISOString());

  // Calculate metrics
  const totalRevenue24h = orders24h?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0;
  const totalRevenue7d = orders7d?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0;
  
  const completedOrders24h = orders24h?.filter(o => o.status === 'completed').length || 0;
  const completedOrders7d = orders7d?.filter(o => o.status === 'completed').length || 0;

  const abandonedCartValue = abandonedCarts?.filter(c => c.status === 'abandoned')
    .reduce((sum, cart) => sum + (cart.total_value || 0), 0) || 0;
  
  const recoveredCartValue = abandonedCarts?.filter(c => c.recovered_at)
    .reduce((sum, cart) => sum + (cart.total_value || 0), 0) || 0;
  
  const recoveryRate = abandonedCarts?.length
    ? ((abandonedCarts.filter(c => c.recovered_at).length / abandonedCarts.length) * 100).toFixed(2)
    : 0;

  return {
    timestamp: now.toISOString(),
    
    // Orders
    orders: {
      last24Hours: {
        count: orders24h?.length || 0,
        completed: completedOrders24h,
        revenue: totalRevenue24h,
        averageOrderValue: completedOrders24h > 0 ? totalRevenue24h / completedOrders24h : 0,
      },
      last7Days: {
        count: orders7d?.length || 0,
        completed: completedOrders7d,
        revenue: totalRevenue7d,
        averageOrderValue: completedOrders7d > 0 ? totalRevenue7d / completedOrders7d : 0,
      },
    },

    // Abandoned Carts
    abandonedCarts: {
      total: abandonedCarts?.length || 0,
      totalValue: abandonedCartValue,
      recovered: abandonedCarts?.filter(c => c.recovered_at).length || 0,
      recoveredValue: recoveredCartValue,
      recoveryRate: `${recoveryRate}%`,
    },

    // Inventory
    inventory: {
      lowStockItems: inventoryAlerts?.length || 0,
      updates24h: inventoryLogs?.length || 0,
      totalProducts: products?.length || 0,
      activeProducts: products?.filter(p => p.status === 'active').length || 0,
    },

    // Customers
    customers: {
      new7Days: customers?.length || 0,
    },

    // System Performance
    system: {
      deploymentTime: process.env.VERCEL_DEPLOYMENT_TIME || 'unknown',
      region: process.env.VERCEL_REGION || 'unknown',
      environment: process.env.NODE_ENV || 'unknown',
    },
  };
}
