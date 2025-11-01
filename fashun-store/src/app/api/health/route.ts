import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * Health check endpoint for monitoring services
 * Used by uptime monitors and load balancers
 */
export async function GET() {
  const startTime = Date.now();
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_VERSION || '1.0.0',
    environment: process.env.NODE_ENV,
    services: {
      database: { status: 'unknown', responseTime: 0 },
      shopify: { status: 'unknown', responseTime: 0 },
      n8n: { status: 'unknown', responseTime: 0 },
    },
    performance: {
      uptime: process.uptime ? process.uptime() : 0,
      memory: process.memoryUsage ? process.memoryUsage() : {},
    },
  };

  try {
    // Check Supabase database
    const dbStart = Date.now();
    try {
      const { error } = await supabase.from('products').select('id').limit(1);
      health.services.database.status = error ? 'unhealthy' : 'healthy';
      health.services.database.responseTime = Date.now() - dbStart;
    } catch (error) {
      health.services.database.status = 'unhealthy';
      health.services.database.responseTime = Date.now() - dbStart;
    }

    // Check Shopify API
    const shopifyStart = Date.now();
    try {
      const response = await fetch(
        `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/${process.env.SHOPIFY_API_VERSION}/shop.json`,
        {
          headers: {
            'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
          },
          signal: AbortSignal.timeout(5000), // 5 second timeout
        }
      );
      health.services.shopify.status = response.ok ? 'healthy' : 'unhealthy';
      health.services.shopify.responseTime = Date.now() - shopifyStart;
    } catch (error) {
      health.services.shopify.status = 'unhealthy';
      health.services.shopify.responseTime = Date.now() - shopifyStart;
    }

    // Check n8n webhooks
    const n8nStart = Date.now();
    try {
      if (process.env.N8N_WEBHOOK_URL) {
        const response = await fetch(`${process.env.N8N_WEBHOOK_URL}/health-check`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000),
        });
        health.services.n8n.status = response.ok ? 'healthy' : 'degraded';
        health.services.n8n.responseTime = Date.now() - n8nStart;
      } else {
        health.services.n8n.status = 'not_configured';
      }
    } catch (error) {
      health.services.n8n.status = 'degraded';
      health.services.n8n.responseTime = Date.now() - n8nStart;
    }

    // Determine overall status
    const unhealthyServices = Object.values(health.services).filter(
      (s) => s.status === 'unhealthy'
    );
    
    if (unhealthyServices.length > 0) {
      health.status = 'degraded';
    }

    // Calculate total response time
    const totalTime = Date.now() - startTime;

    return NextResponse.json(
      {
        ...health,
        totalResponseTime: totalTime,
      },
      {
        status: health.status === 'healthy' ? 200 : 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  }
}
