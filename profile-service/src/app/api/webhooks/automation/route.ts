/**
 * Webhook API Route - Handles automation triggers from main store
 * POST /api/webhooks/automation
 */

import { NextRequest, NextResponse } from 'next/server';
import { AutomationController, defaultAutomationConfig } from '@/lib/automation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Webhook secret for security
const WEBHOOK_SECRET = process.env.AUTOMATION_WEBHOOK_SECRET || 'fashun_automation_secret_2024';

/**
 * Verify webhook signature
 */
function verifyWebhookSignature(body: string, signature: string): boolean {
  if (!signature) return false;
  
  // Simple signature verification - in production, use proper HMAC
  const expectedSignature = `sha256=${Buffer.from(WEBHOOK_SECRET + body).toString('base64')}`;
  return signature === expectedSignature;
}

/**
 * Log webhook activity
 */
async function logWebhookActivity(type: string, payload: any, success: boolean, error?: string) {
  try {
    await supabase
      .from('webhook_logs')
      .insert({
        webhook_type: type,
        payload: payload,
        success: success,
        error_message: error || null,
        processed_at: new Date().toISOString()
      });
  } catch (logError) {
    console.error('Error logging webhook activity:', logError);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-signature');

    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature || '')) {
      console.error('❌ [Webhook] Invalid signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const payload = JSON.parse(body);
    const webhookType = request.headers.get('x-webhook-type') || payload.type;

    if (!webhookType) {
      console.error('❌ [Webhook] Missing webhook type');
      return NextResponse.json(
        { error: 'Missing webhook type' },
        { status: 400 }
      );
    }

    console.log(`🎣 [Webhook] Received: ${webhookType}`);

    // Initialize automation controller
    const automation = new AutomationController(defaultAutomationConfig);

    // Process webhook
    const success = await automation.processWebhook(webhookType, payload);

    // Log activity
    await logWebhookActivity(webhookType, payload, success);

    if (success) {
      console.log(`✅ [Webhook] Successfully processed: ${webhookType}`);
      return NextResponse.json({
        success: true,
        message: `Webhook ${webhookType} processed successfully`,
        timestamp: new Date().toISOString()
      });
    } else {
      console.error(`❌ [Webhook] Failed to process: ${webhookType}`);
      return NextResponse.json(
        {
          success: false,
          error: `Failed to process webhook ${webhookType}`
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ [Webhook] Error processing webhook:', error);
    
    // Log the error
    await logWebhookActivity('unknown', {}, false, error instanceof Error ? error.message : 'Unknown error');

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'health') {
      // Health check endpoint
      return NextResponse.json({
        status: 'healthy',
        automation: 'active',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      });
    }

    if (action === 'stats') {
      // Get automation statistics
      const automation = new AutomationController(defaultAutomationConfig);
      const stats = await automation.getAutomationStats();
      
      return NextResponse.json({
        stats,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('❌ [Webhook] Error in GET request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}