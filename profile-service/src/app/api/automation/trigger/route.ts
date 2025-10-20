/**
 * Manual Automation API Route
 * POST /api/automation/trigger
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  AutomationController, 
  QRAutomationService, 
  ProfileAutomationService, 
  PhygitalAutomationService,
  defaultAutomationConfig 
} from '@/lib/automation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json();

    console.log(`🚀 [Manual Automation] Triggering: ${action}`);

    switch (action) {
      case 'generate_qr':
        return await handleQRGeneration(data);
      
      case 'create_profile':
        return await handleProfileCreation(data);
      
      case 'process_order':
        return await handleOrderProcessing(data);
      
      case 'batch_qr_generation':
        return await handleBatchQRGeneration(data);
      
      case 'cleanup_automation_logs':
        return await handleLogCleanup();
      
      case 'test_automation':
        return await handleTestAutomation();
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('❌ [Manual Automation] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleQRGeneration(data: any) {
  try {
    const qrService = QRAutomationService.getInstance();
    const qrUrl = await qrService.generateAutomaticQR({
      userId: data.userId,
      profileUrl: data.profileUrl || `https://p.fashun.co.in/${data.username}`,
      customSettings: data.settings,
      urgentGeneration: true
    });

    if (qrUrl) {
      return NextResponse.json({
        success: true,
        qrUrl,
        message: 'QR code generated successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to generate QR code' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in QR generation:', error);
    return NextResponse.json(
      { error: 'QR generation failed' },
      { status: 500 }
    );
  }
}

async function handleProfileCreation(data: any) {
  try {
    const profileService = ProfileAutomationService.getInstance();
    const success = await profileService.createAutomaticProfile({
      userId: data.userId,
      email: data.email,
      username: data.username,
      displayName: data.displayName,
      theme: data.theme || 'vibrant',
      autoGenerateQR: data.autoGenerateQR !== false
    });

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Profile created successfully',
        profileUrl: `https://p.fashun.co.in/${data.username}`
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to create profile' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in profile creation:', error);
    return NextResponse.json(
      { error: 'Profile creation failed' },
      { status: 500 }
    );
  }
}

async function handleOrderProcessing(data: any) {
  try {
    const phygitalService = PhygitalAutomationService.getInstance();
    const success = await phygitalService.processPhygitalOrder({
      orderId: data.orderId,
      customerId: data.customerId,
      productId: data.productId,
      customerEmail: data.customerEmail,
      customerName: data.customerName,
      productName: data.productName,
      orderTotal: data.orderTotal,
      timestamp: new Date(data.timestamp || Date.now()),
      metadata: data.metadata
    });

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Phygital order processed successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to process phygital order' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in order processing:', error);
    return NextResponse.json(
      { error: 'Order processing failed' },
      { status: 500 }
    );
  }
}

async function handleBatchQRGeneration(data: any) {
  try {
    const qrService = QRAutomationService.getInstance();
    const requests = data.users.map((user: any) => ({
      userId: user.userId,
      profileUrl: user.profileUrl || `https://p.fashun.co.in/${user.username}`,
      customSettings: user.settings
    }));

    const results = await qrService.batchGenerateQRCodes(requests);

    return NextResponse.json({
      success: true,
      generated: results.size,
      total: requests.length,
      results: Object.fromEntries(results),
      message: `Generated ${results.size}/${requests.length} QR codes`
    });

  } catch (error) {
    console.error('Error in batch QR generation:', error);
    return NextResponse.json(
      { error: 'Batch QR generation failed' },
      { status: 500 }
    );
  }
}

async function handleLogCleanup() {
  try {
    // Clean up logs older than 30 days
    const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const { error: automationError } = await supabase
      .from('automation_logs')
      .delete()
      .lt('created_at', cutoffDate.toISOString());

    const { error: webhookError } = await supabase
      .from('webhook_logs')
      .delete()
      .lt('processed_at', cutoffDate.toISOString());

    if (automationError || webhookError) {
      console.error('Error cleaning up logs:', automationError || webhookError);
      return NextResponse.json(
        { error: 'Log cleanup failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Logs cleaned up successfully',
      cutoffDate: cutoffDate.toISOString()
    });

  } catch (error) {
    console.error('Error in log cleanup:', error);
    return NextResponse.json(
      { error: 'Log cleanup failed' },
      { status: 500 }
    );
  }
}

async function handleTestAutomation() {
  try {
    const testUserId = `test_${Date.now()}`;
    const testUsername = `testuser_${Date.now()}`;
    
    console.log('🧪 [Test Automation] Running automation test...');

    // Test profile creation
    const profileService = ProfileAutomationService.getInstance();
    const profileSuccess = await profileService.createAutomaticProfile({
      userId: testUserId,
      email: `${testUsername}@test.fashun.co.in`,
      username: testUsername,
      displayName: 'Test User',
      theme: 'vibrant',
      autoGenerateQR: true
    });

    if (!profileSuccess) {
      throw new Error('Profile creation test failed');
    }

    // Test QR generation
    const qrService = QRAutomationService.getInstance();
    const qrUrl = await qrService.generateAutomaticQR({
      userId: testUserId,
      profileUrl: `https://p.fashun.co.in/${testUsername}`,
      urgentGeneration: true
    });

    if (!qrUrl) {
      throw new Error('QR generation test failed');
    }

    // Test phygital order processing
    const phygitalService = PhygitalAutomationService.getInstance();
    const orderSuccess = await phygitalService.processPhygitalOrder({
      orderId: `test_order_${Date.now()}`,
      customerId: testUserId,
      productId: 'test_product',
      customerEmail: `${testUsername}@test.fashun.co.in`,
      customerName: 'Test User',
      productName: 'Test Phygital Item',
      orderTotal: 99.99,
      timestamp: new Date(),
      metadata: { test: true }
    });

    if (!orderSuccess) {
      throw new Error('Order processing test failed');
    }

    // Clean up test data
    await supabase.from('profiles').delete().eq('id', testUserId);
    await supabase.from('phygital_orders').delete().eq('user_id', testUserId);
    await supabase.from('virtual_closet').delete().eq('user_id', testUserId);

    return NextResponse.json({
      success: true,
      message: 'All automation tests passed',
      tests: {
        profileCreation: true,
        qrGeneration: true,
        orderProcessing: true
      },
      testData: {
        userId: testUserId,
        username: testUsername,
        qrUrl
      }
    });

  } catch (error) {
    console.error('Error in automation test:', error);
    return NextResponse.json(
      { 
        error: 'Automation test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'status') {
      // Get automation system status
      const automation = new AutomationController(defaultAutomationConfig);
      const stats = await automation.getAutomationStats();

      return NextResponse.json({
        status: 'operational',
        config: defaultAutomationConfig,
        stats,
        endpoints: {
          webhook: '/api/webhooks/automation',
          manual: '/api/automation/trigger',
          health: '/api/webhooks/automation?action=health'
        },
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'logs') {
      // Get recent automation logs
      const { data: logs, error } = await supabase
        .from('automation_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching logs:', error);
        return NextResponse.json(
          { error: 'Failed to fetch logs' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        logs,
        count: logs.length,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('❌ [Manual Automation] GET Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}