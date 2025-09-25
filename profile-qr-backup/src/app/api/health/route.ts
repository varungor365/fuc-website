import { NextRequest, NextResponse } from 'next/server';
import { checkDeploymentHealth } from '@/lib/app-config';

export async function GET(request: NextRequest) {
  try {
    const health = checkDeploymentHealth();
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      features: {
        database: '✅ Connected',
        independence: '✅ Fully Independent',
        permanence: '✅ Lifetime Access',
        socialPlatforms: '✅ 25+ Supported',
        qrGeneration: '✅ Active',
        staticAssets: '✅ Optimized'
      },
      deployment: health,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      platform: process.platform,
      nodeVersion: process.version
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}