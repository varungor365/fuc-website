import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * Cron job to trigger abandoned cart recovery
 * Runs every 4 hours via Vercel Cron
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || process.env.REVALIDATE_SECRET;
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Find abandoned carts (not checked out, older than 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: abandonedCarts, error } = await supabase
      .from('abandoned_carts')
      .select('*')
      .eq('status', 'abandoned')
      .lt('created_at', oneHourAgo)
      .is('recovered_at', null);

    if (error) throw error;

    if (!abandonedCarts || abandonedCarts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No abandoned carts to recover',
        count: 0,
      });
    }

    const results = {
      triggered: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Trigger recovery workflow for each cart
    for (const cart of abandonedCarts) {
      try {
        // Check if we've already sent recovery emails
        const timeSinceAbandonment = Date.now() - new Date(cart.created_at).getTime();
        const hoursSinceAbandonment = timeSinceAbandonment / (1000 * 60 * 60);

        // Recovery email schedule:
        // 1st email: 1 hour after abandonment
        // 2nd email: 24 hours after abandonment
        // 3rd email: 72 hours after abandonment
        let emailSequence = 1;
        if (hoursSinceAbandonment >= 72) emailSequence = 3;
        else if (hoursSinceAbandonment >= 24) emailSequence = 2;

        // Check if this email was already sent
        if (cart.recovery_emails_sent >= emailSequence) {
          continue; // Skip if already sent this sequence
        }

        // Trigger n8n workflow
        if (process.env.N8N_WEBHOOK_URL) {
          const response = await fetch(
            `${process.env.N8N_WEBHOOK_URL}/abandoned-cart-recovery`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                cartId: cart.id,
                email: cart.email,
                customerName: cart.customer_name,
                cartValue: cart.total_value,
                items: cart.items,
                emailSequence,
                abandonedAt: cart.created_at,
                discountCode: generateDiscountCode(emailSequence),
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`n8n webhook failed: ${response.statusText}`);
          }

          // Update cart with recovery attempt
          await supabase
            .from('abandoned_carts')
            .update({
              recovery_emails_sent: emailSequence,
              last_recovery_email: new Date().toISOString(),
            })
            .eq('id', cart.id);

          results.triggered++;
        }
      } catch (error) {
        console.error(`Failed to trigger recovery for cart ${cart.id}:`, error);
        results.failed++;
        results.errors.push(`${cart.id}: ${(error as Error).message}`);
      }
    }

    console.log('Abandoned cart recovery completed:', results);

    return NextResponse.json({
      success: true,
      message: 'Abandoned cart recovery triggered',
      totalCarts: abandonedCarts.length,
      results,
    });
  } catch (error) {
    console.error('Abandoned cart recovery cron error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to trigger cart recovery',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

/**
 * Generate discount code based on email sequence
 */
function generateDiscountCode(sequence: number): { code: string; discount: number } {
  switch (sequence) {
    case 1:
      return { code: 'COMEBACK10', discount: 10 };
    case 2:
      return { code: 'COMEBACK15', discount: 15 };
    case 3:
      return { code: 'LASTCHANCE20', discount: 20 };
    default:
      return { code: 'COMEBACK10', discount: 10 };
  }
}
